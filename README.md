# Data Visualization MultiLineGraph
This project is builded using visx components and React.

## Documentation
[@visx/axis](https://airbnb.io/visx/docs/axis) [@visx/scale](https://airbnb.io/visx/docs/scale) [@visx/group](https://airbnb.io/visx/docs/group) [@visx/responsive](https://airbnb.io/visx/docs/responsive) [@visx/event](https://airbnb.io/visx/docs/event) [@visx/shape](https://airbnb.io/visx/docs/shape) [@visx/curve](https://airbnb.io/visx/docs/curve) [@visx/grid](https://airbnb.io/visx/docs/grid)
[@visx/tooltip](https://airbnb.io/visx/docs/tooltip)

## Example
MultiLineGraph used for [Covid-19](https://github.com/pcm-dpc/COVID-19) data visualization in Italy.

![MultiLineGraph of the Covid](https://github.com/TuscioWang/covid19-data-visualization/blob/4401804c0cf691ed713528808addfd651b7cb56a/public/GraphCovid.PNG)
________________________________________________________________________________
## APIs
### `<MultiLineGraph />`
### dataUrl
Type: _string **required**_

Set the JSON data URL. 
### dataConfig
Type: _object **required**_

Set the object.
```js
{ 
    "<data-Key>": {
        label: "name of the data"
        color: "primary|secondary|default|inherit"
        dataColor: "#color"
    }
}
```
### startDate
Type: _date **required**_

Set the start date for the visualizzation (tip: use moment.js).
### endDate
Type: _date **required**_

Set the end date for the visualizzation (tip: use moment.js).
### selected
Type: _array[] **required**_

Set the array of the selected data.
### periodSelected
Type: _string "year" | "month" | "week"_

Set the period selected, that allows you to have a different ticks visualization in the X-axis .
### timeTicks
Type: _number_

Set the number of ticks to show in the X-axis.
### showTooltip
Type: _boolean "true **|** false"_

Set the showTooltip.
________________________________________________________________________________
### `<TooltipCircle />`
### tooltipLeft
Type: _number **required**_

Set the coordinate for the circle according to X-axis.
### tooltipTop
Type: _number **required**_

Set the coordinate for the circle according to Y-axis.
### colors
Type: _array[]_

Set the array of colors for.circles.
________________________________________________________________________________
## Learn More
To use others components of visx, take a look [@visx](https://github.com/airbnb/visx).

To learn more about React, check out [React documentation](https://reactjs.org/).
