export default function TooltipCircle(props) {

  //Destrutturazione dei props
  const tooltipLeft = props.tooltipLeft
  const tooltipTop = props.tooltipTop;
  //const key=props.key;

  return (
    <>
      {/*<circle
        cx={tooltipLeft}
        cy={tooltipTop + 1}
        r={4}
        fill="black"
        fillOpacity={0.1}
        stroke="black"
        strokeOpacity={0.1}
        strokeWidth={2}
        pointerEvents="none"
      /> */}
      <circle
        //key={key}
        cx={tooltipLeft}
        cy={tooltipTop}
        r={4}
        fill="green"
        stroke="white"
        strokeWidth={2}
        pointerEvents="none"
      />
    </>
  );


}