import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ScaleSVG } from '@visx/responsive';
import { RadialGradient, LinearGradient } from '@visx/gradient';
import { Axis } from '@visx/axis';
import { scaleLinear, scaleBand, scaleTime } from '@visx/scale';
import { DATA_COLORS } from './AppConfig';
import { Group } from '@visx/group';
import { useTooltip, useTooltipInPortal, TooltipInPortal, withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { curveBasis, curveCardinal } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { LinePath, LineSeries, Line } from '@visx/shape';
import { XYChart } from '@visx/xychart';
import TooltipCircle from './TooltipCircle';
import { bisector } from "d3-array";
import { yellow } from '@material-ui/core/colors';

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
  const getDate = d => new Date(d.data);
  const bisectDate = bisector((d) => new Date(d.data)).left;

  //Tutti i state
  const [dataCovid, setData] = useState([]);
  const [tooltipPositionX, setTooltipPositionX] = useState(null);
  const [tooltipPositionY, setTooltipPositionY] = useState(null);

  //Prendo i miei dati e li trasformo in json
  const getDataJson = async () => {
    await fetch("/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json")
      .then(res => res.json())
      .then(receivedData => setData(receivedData));
  }
  useEffect(() => {
    getDataJson();
  }, []);

  //Oggetto che contiene i miei accessors
  const accessors = {
    xAccessor: d => d.date,
    yAccessor: d => d.datoScelto,
  }

  //Tooltip + Line
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    tooltipOpen,
    showTooltip,
  } = useTooltip();

  const tooltipStyles = {
    ...defaultStyles,
    background: "#3b6978",
    border: "1px solid white",
    color: "white"
  };
  const { TooltipWithBounds } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });
  const handleMouseOver = (event) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    //const cx = moment(xScale.invert(coords.x)).format("MMM/D/Y");
    const x0 = xScale.invert(coords.x);
    const y0 = Math.floor(yScale.invert(coords.y));
    const index= bisectDate(dataCovid,x0,1);
    const d0 = dataCovid[index - 1];
    const d1 = dataCovid[index];
    const d= x0 - xScale(d0.data) > xScale(d1.data) - x0 ? d1 : d0;

    console.log("SONO QUA",yScale(d.datoScelto) );

    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: yScale(d.selected),
      tooltipData: d,
    })

    setTooltipPositionX(x0); //tooltipPositionX
    setTooltipPositionY(y0); //tooltipPositionY
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
      return d => moment(d).format("MMM/Y");
    } else if (periodSelected === "month") {
      return d => moment(d).format("DD/MM/Y");
    } else {
      return d => moment(d).format("ddd/MM/Y");
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

  //Calcolo degli scale x e y
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


/* 
  console.log("Sono qua",tooltipLeft,tooltipTop);
  const posX = tooltipPositionX;
  const posY = tooltipPositionY;

  console.log("X:",posX,"Y:",posY); */

  return (
    <div>
      <ScaleSVG width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#radial)"
          rx={14}
        />
        <RadialGradient id='radial' from="#b3ecff" to="#0a8075" r="90%" />
        <LinearGradient id='linear1' from="red" to="yellow" rotate="0" />
        <LinearGradient id='linear2' from="green" to="lightgreen" rotate="0" />
        <LinearGradient id='linear3' from="#0937F6" to="#F6C809" rotate="0" />
        <LinearGradient id='linear4' from="black" to="white" rotate="0" />
        <LinearGradient id='linear5' from="blue" to="#0E98F1" rotate="0" />
        <LinearGradient id='linear6' from="#B55107" to="#F7A040" rotate="0" />
        <LinearGradient id='linear7' from="#FF00B7" to="#FF69D5" rotate="0" />

        <Group left={margin.left} top={margin.top}
          onMouseMove={handleMouseOver}
          onTouchMove={handleMouseOver}
          onTouchStart={handleMouseOver}
          onMouseOut={() => setTooltipPositionX(null)}
        >
          <GridColumns //Griglia delle colonne
            numTicks={numTick(periodSelected)}
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
            strokeOpacity={0.4}
          />
          <Axis //Asse Y
            key={"axis-left"}
            orientation="left"
            scale={yScale}
            numTicks={10}
            tickLabelProps={() => ({
              fontSize: 11,
              textAnchor: 'start',
              dy: '0.30em',
            })}
          />
          <Axis //Asse X
            key={"axis-bottom"}
            top={yMax}
            orientation="bottom"
            label={`Date Period: ${periodSelected}`}
            scale={xScale}
            numTicks={numTick(periodSelected)}
            tickFormat={tickFormatter(periodSelected)}
          />
          <text x="-70" y="-20" transform="rotate(-90)" fontSize={10}>
            Numero di Persone
          </text>

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
                  curve={curveBasis}
                  x={d => xScale(new Date(d.date).valueOf())}
                  y={d => yScale(d.datoScelto)}
                />
              );
            })}

            {tooltipOpen && (
              <g>
                <Line
                  from={{ x: tooltipLeft, y: 0 }}
                  to={{ x: tooltipLeft, y: yMax }}
                  stroke="yellow"
                  strokeWidth={1}
                  pointerEvents="none"
                  strokeDasharray="5,2"
                />
                <TooltipCircle tooltipLeft={tooltipPositionX} tooltipTop={tooltipPositionY} />
              </g>
            )}
          </XYChart>
        </Group>
      </ScaleSVG>

      {
        tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              Numero:
            </TooltipWithBounds>
            <Tooltip
              top={yMax + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: "center",
                transform: "translateX(-50%)"
              }}
            >
              Data: {moment(getDate(tooltipData)).format("MMM/D/Y")}
            </Tooltip>
          </div>
        )
      }
    </div >
  );
}
export default XYGraph;
