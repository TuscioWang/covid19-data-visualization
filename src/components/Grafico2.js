import React from 'react';
import {
    AnimatedAxis, // any of these can be non-animated equivalents
    AnimatedGrid,
    AnimatedLineSeries,
    XYChart,
    //Tooltip,
  } from '@visx/xychart';
import { ScaleSVG } from '@visx/responsive';
import { GradientPurpleRed, RadialGradient} from '@visx/gradient';
  
  function Render(props){
    const json = require ('../data/andamento-nazionale.json');
    const selected = props.selected;
    
    const data = json.map((datapoint)=> ({
      datoScelto: datapoint[selected],
      date: datapoint.data.substring(2,10)
    })
   );

   const accessors = {
    xAccessor : d => d.date,
    yAccessor : d => d.datoScelto,
  }

  return (
    <ScaleSVG width={900} height={500}>
      <RadialGradient id='radial' from= "#b3ecff" to="#0a8075" r="90%"/>

    <XYChart width= {900} height={500} xScale={{ type: "band" }} yScale={{ type: "linear" }}>
      <AnimatedLineSeries dataKey="Line 1" data={data} {...accessors} />
    </XYChart>

    </ScaleSVG>
  );
}
export default Render;