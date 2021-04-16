import React from 'react';
import {
  //AnimatedAxis,
  //AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  AnimatedAxis,
  //Tooltip,
} from '@visx/xychart';
import { ScaleSVG } from '@visx/responsive';
import { RadialGradient, LinearGradient } from '@visx/gradient';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';

const json = require('../data/andamento-nazionale.json');

const DATA_COLORS = {
  totale_positivi: "red",
  ricoverati_con_sintomi: "blue",
  isolamento_domiciliare: "url(#linear)",
  deceduti: "",
  terapia_intensiva: "",
  tamponi: "",
  dimessi_guariti: "",
}

function XYGraph(props) {

  const selected = props.selected;
  const startDate = props.startDate;
  const endDate = props.endDate;

  console.log("START:", startDate, "END:", endDate);

  const width = 900;
  const height = 500;
  const margin = { top: 30, bottom: 20, left: 20, right:20 };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const accessors = {
    xAccessor: d => d.date,
    yAccessor: d => d.datoScelto,
  }

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

      {selected.map(sel => {

        const data = json.map((datapoint) => ({
          datoScelto: datapoint[sel],
          date: datapoint.data,
        }));

        const filteredData = data.filter(
          d =>
            new Date(startDate) < new Date(d.date) &&
            new Date(endDate) > new Date(d.date),
        );

       /*  const xScale = scaleBand({
          range: [0, xMax],
          round: true,
          domain: data.map(x),
        }); 
*/
        const yScale = scaleLinear({
          range: [yMax, 0],
          round: true,
          domain: [0, Math.max(...data.map(d => d.datoScelto))],
        });
 
        return (
          <XYChart
            width={width}
            height={height}
            xScale={{type: "band"}}
            yScale={{type: "linear"}}
          >
            <AnimatedLineSeries
              stroke={DATA_COLORS[sel]}
              dataKey="Line 1"
              data={filteredData}
              {...accessors}
            />
          </XYChart>
        );

        /*  <AxisBottom
           scale={xScale}
           stroke="black"
         /> */

      })}
    </ScaleSVG>
  );
}
export default XYGraph;