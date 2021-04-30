export default function TooltipCircle(props) {

  //Destrutturazione dei props
  const tooltipLeft = props.tooltipLeft
  const tooltipTop = props.tooltipTop;

  return (
    <>
      <circle
        cx={tooltipLeft}
        cy={tooltipTop + 1}
        r={4}
        fill="black"
        fillOpacity={0.1}
        stroke="black"
        strokeOpacity={0.1}
        strokeWidth={2}
        pointerEvents="none"
      />
      <circle
        cx={tooltipLeft}
        cy={tooltipTop}
        r={4}
        fill="#75daad"
        stroke="white"
        strokeWidth={2}
        pointerEvents="none"
      />
    </>
  );


}