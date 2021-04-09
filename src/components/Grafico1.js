import React from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
//import { timeParse } from 'd3-time-format';


function BarGraph(props) {
  const json = require ('../data/andamento-nazionale.json');
  const selected = props.selected;
  
  const data = json.map((datapoint)=> ({
    datoScelto: datapoint[selected],
    date: datapoint.data.substring(2,10)
  })
 );


// Define the graph dimensions and margins
const width = 900;
const height = 500;
const margin = { top: 20, bottom: 20, left: 20, right: 20 };

// Then we'll create some bounds
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;
console.log("y", yMax,"X",xMax);

// We'll make some helpers to get at the data we want
const x = d => d.date;
const y = d => d.datoScelto  ;

// And then scale the graph by our data
const xScale = scaleBand({
  range: [0, xMax],
  round: true,
  domain: data.map(x),
  padding: 0.2,
});

const yScale = scaleLinear({
  range: [yMax, 0],
  round: true,
  domain: [0, Math.max(...data.map(y))],
});

// Compose together the scale and accessor functions to get point functions
const compose = (scale, accessor) => data => scale(accessor(data));
const xPoint = compose(xScale, x);
const yPoint = compose(yScale, y);

// Finally we'll embed it all in an SVG
  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const barHeight = yMax - yPoint(d);
        return (
          <Group key={`bar-${i}`}>
            <Bar
            top={50}
              x={xPoint(d) + 50}
              y={yMax - barHeight}
              height={barHeight}
              width={xScale.bandwidth()}
              fill="#fc2e1c"

            />

            <AxisLeft 
            left={50}
            label={selected}
            scale={yScale} 
            tickLabelProps={() => ({
              fontSize: 11,
              textAnchor: 'end',
              dy: '0.50em',

            })}
            />
            
            <AxisBottom
            left={50}
              top={yMax}
              scale={xScale}
              numTicks={14}
              label={"Data"}
              tickLabelProps={() => ({
                fontSize: 11,
                textAnchor: 'middle',
                dy: '0.20em',
              })}
            />
          </Group>
        );
      })}
    </svg>
  );
}

export default BarGraph;

// ... somewhere else, render it ...
// <BarGraph />