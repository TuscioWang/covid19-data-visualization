import React from 'react';
//import { Group } from '@visx/group';
import { Bar, AreaClosed } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { ScaleSVG } from '@visx/responsive';
import { GradientPurpleRed, RadialGradient} from '@visx/gradient';
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
const margin = { top: 30, bottom: 20 };

// Then we'll create some bounds
const xMax = width //- margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

// We'll make some helpers to get at the data we want
const x = d => d.date;
const y = d => d.datoScelto;

// And then scale the graph by our data
const xScale = scaleBand({
  range: [0, xMax],
  round: true,
  domain: data.map(x), 
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
    <ScaleSVG width={width} height={height}>
      
      <rect 
      width={width}
      height={height}
      fill="url(#radial)"
      rx= {15}
      />
      <RadialGradient id='radial' from= "#b3ecff" to="#0a8075" r="90%"/>
      <GradientPurpleRed id='pr' rotate="20"/>

      {/* <Group key={"group-graph"} top= {margin.top} left={margin.left}>
        {data.map((d, i) => {
          const barHeight = yMax - yPoint(d) ;
          return (
             <Group key={`bar-${i}`}>
              <AreaClosed
                data= {data}
                x={xPoint(d)}
                y={yMax - barHeight}
                width={barHeight}
                yScale={yScale}
                width={xScale.bandwidth()}
                fill="url(#linear)"
                
              />
            </Group>
          );
        })} */}

      <AreaClosed
        data={data}
        x={d => xPoint(d)}
        y={d => yMax - (yMax - yPoint(d))}
        yScale={yScale}
        fill={"url(#pr)"}
      />
    
      <GridColumns
        scale={xScale}
        height={yMax}
        numTicks={14}
        strokeOpacity={0.3}
        stroke="+#edffea"
        strokeDasharray="1,3"
      />

      <AxisLeft 
        left={20}
        label={selected}
        labelProps={()=>({
          fontSize: 11,
          dy: '0.40em',
        })}
        hideAxisLine={false}
        scale={yScale} 
        tickLabelProps={() => ({
          fontSize: 11,
          textAnchor: 'end',
          dy: '0.40em',
        })}
      />
          
      <AxisBottom
        top={yMax}
        scale={xScale}
        numTicks={14}
        label={"Data"}
        tickLabelProps={() => ({
          fontSize: 11,
          textAnchor: 'middle',
          dy: '0.40em',
        })}
      />
     {/*  </Group> */}
    </ScaleSVG>
  );
}

export default BarGraph;

// ... somewhere else, render it ...
// <BarGraph />