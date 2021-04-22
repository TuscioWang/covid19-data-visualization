import React, { useEffect, useState } from 'react';
import {
  //AnimatedAxis,
  AnimatedLineSeries,
  XYChart,
  //Tooltip,
} from '@visx/xychart';
import { ScaleSVG } from '@visx/responsive';
import { RadialGradient, LinearGradient } from '@visx/gradient';
import { Axis } from '@visx/axis';
import { scaleLinear, scaleBand, scaleTime } from '@visx/scale';
//import { GridColumns, Grid } from '@visx/grid';
import { DATA_COLORS } from './AppConfig';
import { Group } from '@visx/group';

function XYGraph(props) {
  const selected = props.selected;
  const startDate = props.startDate;
  const endDate = props.endDate;
  const [dataCovid, setData] = useState([]);

  console.log("START:", startDate, "END:", endDate);
  

  const getData = async () => {
    await fetch("/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json")
      .then(res => res.json())
      .then(receivedData => setData(receivedData));
  }

  useEffect(() => {
    getData();
  }, []);

  const width = 900;
  const height = 500;
  const margin = { top: 40, bottom: 50, left: 40, right: 40 };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const accessors = {
    xAccessor: d => d.date,
    yAccessor: d => d.datoScelto,
  }
  /* const parseDate = timeParse('%Y-%m-%d');
  const formatDate = (date) => parseDate(date); */

  const xScale = scaleTime({
    range: [0, xMax],
    round: true,
    domain: dataCovid.map(accessors.xAccessor),
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...dataCovid.map(accessors.yAccessor))],
  });

  return (
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
      <LinearGradient id='linear' from="red" to="yellow" rotate="0" />

      {/*  <GridColumns
        top={margin.top}
        scale={xScale}
        height={yMax}
        numTicks={14}
        stroke="white"
        strokeOpacity={0,1}
        strokeDasharray="1,3"
      /> */}
      <Group left={margin.left} top={margin.top}>
        <Axis
          key={"axis-left"}
          orientation="left"
          scale={yScale}
          numTicks={14}
        />
        <Axis
          key={"axis-bottom"}
          top={yMax}
          orientation="bottom"
          label="Data"
          scale={xScale}
          numTick={14}
          tickFormat={dataCovid.map(accessors.xAccessor)}
        />

        <XYChart
          key={"xygraph"}
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

              <AnimatedLineSeries
                stroke={DATA_COLORS[sel]}
                data={filteredData}
                dataKey={`Line ${i}`}
                {...accessors}
              />
            );
          })}


        </XYChart>
      </Group>
    </ScaleSVG>
  );
}
export default XYGraph;
