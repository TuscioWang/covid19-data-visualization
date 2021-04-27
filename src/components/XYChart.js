import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  //AnimatedAxis,
  AnimatedLineSeries,
  XYChart,
  Grid,
} from '@visx/xychart';
import { ScaleSVG } from '@visx/responsive';
import { RadialGradient, LinearGradient } from '@visx/gradient';
import { Axis } from '@visx/axis';
import { scaleLinear, scaleBand, scaleTime } from '@visx/scale';
//import { GridColumns, Grid } from '@visx/grid';
import { DATA_COLORS } from './AppConfig';
import { Group } from '@visx/group';
import { useTooltip, useTooltipInPortal, TooltipWithBounds } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { curveBasis, curveCardinal } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { LinePath, LineSeries } from '@visx/shape';
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
  const [dataCovid, setData] = useState([]);

  const dataBase = [
    { data: '2020-01-01', datoScelto: 50 },
    { data: '2020-01-02', datoScelto: 10 },
    { data: '2020-01-03', datoScelto: 20 },
    { data: '2020-01-05', datoScelto: 30 },
    { data: '2020-01-07', datoScelto: 40 },
    { data: '2020-01-08', datoScelto: 60 },
    { data: '2020-01-09', datoScelto: 70 },
    { data: '2020-02-01', datoScelto: 80 },
    { data: '2020-02-03', datoScelto: 90 },
  ];

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });

  const handleMouseOver = (event, datum) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum,
    });
  };

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

  useMemo(() => { console.log("START:", startDate, "END:", endDate) }, [startDate, endDate]);

  const getData = async () => {
    await fetch("/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json")
      .then(res => res.json())
      .then(receivedData => setData(receivedData));
  }

  useEffect(() => {
    getData();
  }, []);

  const accessors = {
    xAccessor: d => d.date,
    yAccessor: d => d.datoScelto,
  }

  const rangeData = useMemo(() => {
    return (dataCovid.filter((d) =>
      new Date(startDate) < new Date(d.data) &&
      new Date(endDate) > new Date(d.data)
    ));
  }, [dataCovid, startDate, endDate]);

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
    domain: [0, Math.max(...dataCovid.map(d => d.totale_positivi))],
    nice: true,
  });

  return (
    <div>
      <ScaleSVG ref={containerRef} width={width} height={height}>
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
        <LinearGradient id='linear5' from="#0E98F1" to="lightblue" rotate="0" />
        <LinearGradient id='linear6' from="#B55107" to="#F7A040" rotate="0" />
        <LinearGradient id='linear7' from="#FF00B7" to="#FF69D5" rotate="0" />

        <Group left={margin.left} top={margin.top}
          onMouseMove={e => { handleMouseOver(e) }}
          onMouseOut={e => { hideTooltip(e) }}>
          <GridColumns
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
            numTicks={14}
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

          {/* <XYChart
            key={"graph"}
            width={xMax}
            height={yMax}
            xScale={{ type: "band" }}
            yScale={{ type: "linear" }}
          >
 */}
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
            console.log("filtro",filteredData.map(d => xScale(new Date(d.date).valueOf())));
            console.log("datoscelto",filteredData.map(d => yScale(d.datoScelto)));

            return (
                <LinePath
                  stroke={DATA_COLORS[sel]}
                  data={filteredData}
                  key={`Line ${i}`}
                  curve={curveBasis}
                  x={d => xScale(new Date(d.date).valueOf())}
                  y={d => yScale(d.datoScelto)}
                />
              /*  <AnimatedLineSeries
               stroke = {DATA_COLORS[sel]}
               data = {filteredData}
               dataKey = {`Line ${i}`}
               {...accessors}
               /> */
            );
          })}
          {/* </XYChart> */}
        </Group>
      </ScaleSVG>

      {
        tooltipOpen && (
          <TooltipInPortal
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            <div> Persone: <strong> {tooltipData} </strong></div>
          </TooltipInPortal>
        )
      }
    </div >
  );
}
export default XYGraph;
