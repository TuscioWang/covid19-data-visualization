import React, { useEffect, useState, useMemo } from 'react';
import { Axis } from '@visx/axis';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Group } from '@visx/group';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { curveBasis } from '@visx/curve';
import { GridColumns } from '@visx/grid';
import { LinePath, Line } from '@visx/shape';
import { withParentSize } from '@visx/responsive';
import TooltipCircle from './TooltipCircle';
import moment from 'moment';

function MultiLineGraph(props) {
  //PROPS
  const dataUrl = props.dataUrl;
  const selected = props.selected;
  const startDate = props.startDate;
  const endDate = props.endDate;
  const periodSelected = props.periodSelected;
  const { parentWidth, parentHeight } = props;
  const dataConfig = props.dataConfig;
  const timeTicks = props.timeTicks;

  const width = parentWidth;
  const height = 600;
  const margin = { top: 40, bottom: 50, left: 60, right: 30 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  //Tutti gli state
  const [dataJson, setData] = useState([]);
  const [tooltipValueX, setTooltipValueX] = useState(null);
  const [tooltipValueY, setTooltipValueY] = useState(null);
  const showTooltip = tooltipValueX != null;

  //Prendo i miei dati e li trasformo in json
  const getDataJson = async () => {
    await fetch(dataUrl)
      .then(res => res.json())
      .then(receivedData => setData(receivedData));
  }
  useEffect(() => {
    getDataJson();
  }, []);

  //Oggetto che contiene i miei accessors
  const accessors = {
    xAccessor: d => d.date,
    yAccessor: d => d.dataSelect,
  }

  //Tooltip + Line
  const tooltipStyles = {
    ...defaultStyles,
    background: "#34467d",
    border: "1px solid white",
    color: "white",
    paddingTop: 0,
    paddingBottom: 0,
    position: "absolute",
  };

  const handleMouseOver = (event) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const x0 = xScale.invert(coords.x - margin.left);
    const y0 = yScale.invert(coords.y - margin.top);
    setTooltipValueX(x0); //Valore contenuto (data) di questa coordinata
    setTooltipValueY(y0); //Valore contenuto (numeri) di questa coordinata
  };

  //Funzioni per il formato dei tick
  const numTick = () => {
    if (timeTicks != null)
      return timeTicks;
    if (periodSelected === "year") {
      return 12;
    } else if (periodSelected === "month") {
      return 9;
    } else {
      return 7;
    }

  }
  const tickFormatter = () => {
    if (periodSelected === "year") {
      return d => moment(d).format("MMM YY");
    } else if (periodSelected === "month") {
      return d => moment(d).format("DD-MM-YY");
    } else {
      return d => moment(d).format("ddd DD MMM  Y");
    }
  }
  const tickNumberFormat = (n) => {
    if (n >= 1000000) {
      return Math.abs(n) > 999
        ? Math.sign(n) * ((Math.abs(n) / 1000000).toFixed(1)) + ' M'
        : Math.sign(n) * Math.abs(n)
    } else {
      return Math.abs(n) > 999
        ? Math.sign(n) * ((Math.abs(n) / 1000).toFixed(1)) + ' K '
        : Math.sign(n) * Math.abs(n)
    }
  }

  //Funzione che mi trova la data del periodo selezionato
  const rangeData = useMemo(() => {
    return (dataJson.filter((d) =>
      new Date(startDate) < new Date(d.data) &&
      new Date(endDate) > new Date(d.data)
    ));
  }, [dataJson, startDate, endDate]);

  //Funzione che mi trova gli array contenenti i dati dei checkbox selezionati
  const arraySel = useMemo(() => {
    return (selected.map(sel => {
      return (dataJson.map((datapoint) => ({
        dataSelect: datapoint[sel],
      })));
    }))
  }, [selected, dataJson]);

  //Calcolo per trovare il mio max di tutti i dati che ho selezionato
  const numberMax = useMemo(() => {
    let Max = 0;
    for (let i = 0; i < selected.length; i++) {
      const currentMax = Math.max(...arraySel[i].map(accessors.yAccessor));
      if (currentMax > Max)
        Max = currentMax;
    }
    return Max;
  }, [selected, arraySel]);

  //Calcolo degli scale x, y e legenda
  const xScale = scaleTime({
    range: [0, xMax],
    round: true,
    domain: [
      Math.min(...rangeData.map(d => new Date(d.data))),
      Math.max(...rangeData.map(d => new Date(d.data)))
    ],
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, numberMax],
    nice: true,
  });

  //Estraggo i valori contenuti nelle coordinate
  const tooltipData = dataJson.find(d => {
    return (
      moment(tooltipValueX).isSame(moment(d.data), 'day') &&
      moment(tooltipValueX).isSame(moment(d.data), 'year') &&
      moment(tooltipValueX).isSame(moment(d.data), 'week')
    );
  });

  //Valori in pixel del contenuto
  const tooltipLeft = xScale(tooltipValueX);
  const tooltipTop = yScale(tooltipValueY);

  //console.log("X", tooltipLeft, "Y", tooltipTop);
  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#1F1639"
          rx={14}

        />
        <Group left={margin.left} top={margin.top}
          onMouseMove={handleMouseOver}
          onTouchMove={handleMouseOver}
          onTouchStart={handleMouseOver}
          onMouseOut={() => setTooltipValueX(null)}
        >
          <GridColumns
            numTicks={numTick(periodSelected)}
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
            strokeOpacity={0.2}
          />
          <Axis //Axis Y
            key={"axis-left"}
            orientation="left"
            scale={yScale}
            numTicks={10}
            stroke="#C6B5DE"
            tickStroke="#C6B5DE"
            tickFormat={d => tickNumberFormat(d)}
            tickLabelProps={(d) => ({
              fontSize: 11,
              textAnchor: 'end',
              fill: '#C6B5DE'
            })}
          />
          <Axis //Axis X
            key={"axis-bottom"}
            top={yMax}
            orientation="bottom"
            scale={xScale}
            stroke="#C6B5DE"
            numTicks={numTick(periodSelected)}
            tickStroke="#C6B5DE"
            tickFormat={tickFormatter(periodSelected)}
            tickLabelProps={() => ({
              fontSize: 11,
              textAnchor: 'middle',
              fill: '#C6B5DE'
            })}
          />
          {selected.map((sel, i) => {
            const data = dataJson.map((datapoint) => ({
              dataSelect: datapoint[sel],
              date: datapoint.data,
            }));
            const filteredData = data.filter(
              d =>
                new Date(startDate) < new Date(d.date) &&
                new Date(endDate) > new Date(d.date),
            );

            return (
              <LinePath
                stroke={dataConfig[sel].dataColor}
                data={filteredData}
                key={`Line ${i}`}
                strokeWidth={3}
                curve={curveBasis}
                x={d => xScale(new Date(d.date).valueOf())}
                y={d => yScale(d.dataSelect)}
              />
            );
          })}

          {showTooltip && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: yMax }}
                stroke="yellow"
                strokeWidth={1}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              {
                selected.map(index => {
                  const tooltipTop = (tooltipData !== undefined)
                    ? yScale(tooltipData[index])
                    : null;
                  return (
                    <TooltipCircle
                      colors={dataConfig[index].dataColor}
                      tooltipLeft={tooltipLeft}
                      tooltipTop={tooltipTop}
                    />
                  );
                })
              }
                )
            </g>
          )}
        </Group>
      </svg>
      {showTooltip && (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop + margin.top}
          left={(tooltipLeft <= (width - 200))
            ? tooltipLeft + margin.left
            : tooltipLeft - margin.left
          }
          style={tooltipStyles}
        >
          {selected.map((key) => {
            return (
              <p className={'tooltipCSS'}>
                {dataConfig[key].label}: {(tooltipData !== undefined)
                  ? (tooltipData[key])
                  : null}
              </p>
            )
          })}
          <p className={'tooltipCSS'} style={{ textAlign: "right" }} >
            {(tooltipData !== undefined)
              ? moment(tooltipData.data).format("DD/MM/Y")
              : null}
          </p>
        </TooltipWithBounds>
      )
      }
    </div >
  );
}
export default withParentSize(MultiLineGraph);