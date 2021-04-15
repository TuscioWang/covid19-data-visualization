import React from 'react';
import {
  //AnimatedAxis,
  //AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  //Tooltip,
} from '@visx/xychart';
import { ScaleSVG } from '@visx/responsive';
import { RadialGradient, LinearGradient } from '@visx/gradient';
import { AxisBottom, AxisLeft } from '@visx/axis';

const json = require('../data/andamento-nazionale.json');

function XYGraph(props) {

  const selected = props.selected;
  const startDate=props.startDate;
  const endDate=props.endDate;
  console.log(typeof startDate);


  console.log("inizio",startDate,"fine",endDate);

  const width = 900;
  const height = 500;

  const accessors = {
    xAccessor: d => d.date,
    yAccessor: d => d.datoScelto,
  }

  return (
    <ScaleSVG width={width} height={height}>
      <rect
        width={width}
        height={height}
        fill="url(#radial)"
        rx={15}
      />
      <RadialGradient id='radial' from="#b3ecff" to="#0a8075" r="90%" />
      <LinearGradient id='linear' from="red" to="yellow" rotate="0" />

      {selected.map(sel => {

        const data = json.map((datapoint) => ({
          datoScelto: datapoint[sel],
          date: datapoint.data.substring(2, 10)
        }));

        const filteredData = data.map(
          d =>
            new Date(startDate) < new Date(d.date) && new Date(endDate) > new Date(d.date)
        );
        console.log(filteredData);
        return (
          <XYChart width={width} height={height} xScale={{ type: "band" }} yScale={{ type: "linear" }}>
            <AnimatedLineSeries stroke={"url(#linear)"} dataKey="Line 1" data={filteredData} {...accessors} />

          </XYChart>);
      })}
    </ScaleSVG>
  );
}
export default XYGraph;