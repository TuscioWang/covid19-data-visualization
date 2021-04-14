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
  const selectedPeriod = props.selectedPeriod;
  const slider = parseInt(props.slider);

  let brush = [7, 7];
  switch (selectedPeriod) {
    case "settimana":
      if (slider == -1) {
        brush[0] -= 7; brush[1] = brush[0] + 7
      } else {
        brush[0] += 7; brush[1] = brush[0] + 7
      }
      break;

    case "mese": brush[0] = 0; brush[1] = 30; break;
      if (slider == -1) {
        brush[0] -= 7; brush[1] = brush[0] + 7
      } else {
        brush[0] += 7; brush[1] = brush[0] + 7
      }
      break;

    case "anno": brush[0] = 0; brush[1] = 365; break;
      if (slider == -1) {
        brush[0] -= 7; brush[1] = brush[0] + 7
      } else {
        brush[0] += 7; brush[1] = brush[0] + 7
      }
      break;


  }

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
        })
        );

        const choose = data.slice(brush[0], brush[1]);
        console.log(choose);
        return (
          <XYChart width={width} height={height} xScale={{ type: "band" }} yScale={{ type: "linear" }}>
            <AnimatedLineSeries stroke={"url(#linear)"} dataKey="Line 1" data={choose} {...accessors} />

          </XYChart>);
      })}
    </ScaleSVG>
  );
}
export default XYGraph;