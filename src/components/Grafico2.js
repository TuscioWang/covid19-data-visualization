import React, { useEffect, useState } from 'react';
import {
  //AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  AnimatedAxis,
  AnimatedGrid,
  //Tooltip,
} from '@visx/xychart';
import { ScaleSVG } from '@visx/responsive';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape'
import { RadialGradient, LinearGradient } from '@visx/gradient';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleLinear, scaleBand, scaleTime } from '@visx/scale';
import { GridColumns } from '@visx/grid';
import { DATA_COLORS } from './AppConfig';

//const json = require('../data/andamento-nazionale.json');

function Grafico2(props) {

  const selected = props.selected;
  const startDate = props.startDate;
  const endDate = props.endDate;
  const [dataCovid, setData] = useState([]);

  const getData = async () => {
    await fetch("/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json")
      .then(res => res.json())
      .then(receivedData => setData(receivedData));
  }

  useEffect(() => {
    getData();
  }, []);

  console.log("START:", startDate, "END:", endDate);

  const width = 900;
  const height = 500;
  const margin = { top: 40, bottom: 50, left: 50, right: 40 };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  /* const accessors = {
    xAccessor: d => d.date,
    yAccessor: d => d.datoScelto,
  } */
  const x = d => d.date;
  const y = d => d.datoScelto;

  /*   const compose=(scale,accessor) => data => scale(accessor(data));
    const xPoint= compose(xScale,x);
    const yPoint= compose(yScale,y); */

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
        <LinearGradient id='linear' from="red" to="yellow" rotate="0" />



        {selected.map((sel) => {

          const data = dataCovid.map((datapoint) => ({
            datoScelto: datapoint[sel],
            date: datapoint.data,
          }));

          const filteredData = data.filter(
            d =>
              new Date(startDate) < new Date(d.date) &&
              new Date(endDate) > new Date(d.date),
          );

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

          return (

            <Group left={margin.left} top={margin.top}>
              <LinePath
                stroke={DATA_COLORS[sel]}
                data={filteredData}
                x={xScale}
                y={yScale}
              />
              <GridColumns
                height={yMax}
                scale={xScale}
                stroke="Grey"
                strokeOpacity={0.3}
              />

              <AxisLeft
                scale={yScale}
              />

              <AxisBottom
                top={yMax}
                scale={xScale}
                label="Data"
                numTick="14"
              />
            </Group>
          );
        })}

      </ScaleSVG>
    </div>
  );
}
export default Grafico2;
