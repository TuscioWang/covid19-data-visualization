import React, { useEffect, useState, useMemo, useCallback, useRef, createRef } from 'react';
import { ScaleSVG } from '@visx/responsive';
import { Axis } from '@visx/axis';
import { scaleLinear, scaleQuantile, scaleTime } from '@visx/scale';
import { DATA_COLORS, CHECKBOX_DATA } from './AppConfig';
import { Group } from '@visx/group';
import { useTooltipInPortal, TooltipWithBounds, Tooltip, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { curveBasis } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { LinePath, LineSeries, Line } from '@visx/shape';
import { XYChart } from '@visx/xychart';
import TooltipCircle from './TooltipCircle';

function XYGraph(props) {
  const selected = props.selected;
  const startDate = props.startDate;
  const endDate = props.endDate;
  const periodSelected = props.periodSelected;
  const moment = require("moment");
  const width = 900;
  const height = 500;
  const margin = { top: 40, bottom: 50, left: 40, right: 30 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  //Tutti gli state
  const [dataCovid, setData] = useState([]);
  const [tooltipValueX, setTooltipValueX] = useState(null);
  const [tooltipValueY, setTooltipValueY] = useState(null);
  const SVGref = createRef();
  const showTooltip = tooltipValueX != null;

  //Prendo i miei dati e li trasformo in json
  const getDataJson = async () => {
    await fetch("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json")
      .then(res => res.json())
      .then(receivedData => setData(receivedData));
  }
  useEffect(() => {
    getDataJson();
  }, []);

  useEffect(() => {
    console.log(SVGref);
  });
  //Oggetto che contiene i miei accessors
  const accessors = {
    xAccessor: d => d.date,
    yAccessor: d => d.datoScelto,
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
  /* const {To } = useTooltipWithBound({
    detectBounds: true,
    scroll: true,
  }); */
  const handleMouseOver = (event) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const x0 = xScale.invert(coords.x - margin.left);
    const y0 = yScale.invert(coords.y - margin.top);
    setTooltipValueX(x0); //Valore contenuto (data) di questa coordinata
    setTooltipValueY(y0); //Valore contenuto (numeri) di questa coordinata
  };


  //Funzioni per il formato dei tick
  const numTick = () => {
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
      return d => moment(d).format("DD MMM YY");
    } else {
      return d => moment(d).format("ddd-MM-Y");
    }
  }

  //Stampa del periodo di tempo selezionato in console
  useMemo(() => {
    console.log("START:", startDate, "END:", endDate)
  }, [startDate, endDate]);

  //Funzione che mi trova la data del periodo selezionato
  const rangeData = useMemo(() => {
    return (dataCovid.filter((d) =>
      new Date(startDate) < new Date(d.data) &&
      new Date(endDate) > new Date(d.data)
    ));
  }, [dataCovid, startDate, endDate]);

  //Funzione che mi trova gli array contenenti i dati dei checkbox selezionati
  const arraySel = useMemo(() => {
    return (selected.map(sel => {
      return (dataCovid.map((datapoint) => ({
        datoScelto: datapoint[sel],
      })));
    }))
  }, [selected, dataCovid]);

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
  const tooltipData = dataCovid.find(d => {
    return (
      moment(tooltipValueX).isSame(moment(d.data), 'day') &&
      moment(tooltipValueX).isSame(moment(d.data), 'year') &&
      moment(tooltipValueX).isSame(moment(d.data), 'week')
    );
  });

  //Valori in pixel del contenuto
  const tooltipLeft = xScale(tooltipValueX);
  const tooltipTop = yScale(tooltipValueY);

  console.log("X", tooltipLeft, "Y", tooltipTop);

  return (
    <div style={{ position: "relative" }}>
      <ScaleSVG ref={SVGref} width={width} height={height}>
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
        //onMouseOut={() => setTooltipValueX(null)}
        >
          <GridColumns //Griglia delle colonne
            numTicks={numTick(periodSelected)}
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
            strokeOpacity={0.3}
          />
          <Axis //Asse Y
            key={"axis-left"}
            orientation="left"
            scale={yScale}
            hideAxisLine="true"
            numTicks={10}
            stroke="#e0e0e0"
            tickLabelProps={() => ({
              fontSize: 11,
              textAnchor: 'middle',
              fill: '#C6B5DE'
            })}

          />
          <Axis //Asse X
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
          <XYChart
            key={"graph"}
            width={xMax}
            height={yMax}
            xScale={{ type: "band" }}
            yScale={{ type: "linear" }}
          >
            {selected.map((sel, i) => {
              const data = dataCovid.map((datapoint) => ({
                datoScelto: datapoint[sel],
                date: datapoint.data,
              }));

              const filteredData = data.filter(
                d =>
                  new Date(startDate) < new Date(d.date) &&
                  new Date(endDate) > new Date(d.date),
              );

              return (
                <LinePath
                  stroke={DATA_COLORS[sel]}
                  data={filteredData}
                  key={`Line ${i}`}
                  strokeWidth={3}
                  curve={curveBasis}
                  x={d => xScale(new Date(d.date).valueOf())}
                  y={d => yScale(d.datoScelto)}
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
                    const tooltipTop = (tooltipData !== undefined) ? yScale(tooltipData[index]) : null;
                    return (
                      <TooltipCircle tooltipLeft={tooltipLeft} tooltipTop={tooltipTop} />
                    );
                  })
                }
                )
              </g>
            )}
          </XYChart>
        </Group>
      </ScaleSVG>

      {
        showTooltip && (
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop + 150}
            //left={(tooltipLeft <= (width-200)) ? tooltipLeft + 100: tooltipLeft - 100}
            left={tooltipLeft}
          //style={tooltipStyles}
          >
            {selected.map((key) => {
              return (
                <p className={'tooltipCSS'}>
                  {CHECKBOX_DATA[key].label}: {(tooltipData !== undefined) ? (tooltipData[key]) : null}
                </p>
              )
            })}
            <p className={'tooltipCSS'} style={{ textAlign: "right" }} >
              {(tooltipData !== undefined) ? moment(tooltipData.data).format("DD/MM/Y") : null}
            </p>
          </TooltipWithBounds>
        )
      }
    </div >
  );
}
export default XYGraph;
