export default function TooltipCircle(props) {

  //Destrutturazione dei props
<<<<<<< HEAD
  const tooltipLeft = props.tooltipLeft;
  const tooltipTop = props.tooltipTop;
  const key=props.key;

  console.log("X:",tooltipLeft,"Y:",tooltipTop);
  return (
    <>
      {/* <circle
=======
  const tooltipLeft = props.tooltipLeft
  const tooltipTop = props.tooltipTop;

  return (
    <>
      <circle
>>>>>>> 53355d2e0fec912732f4eab12fc92d2463a385c3
        cx={tooltipLeft}
        cy={tooltipTop + 1}
        r={4}
        fill="black"
        fillOpacity={0.1}
        stroke="black"
        strokeOpacity={0.1}
        strokeWidth={2}
        pointerEvents="none"
<<<<<<< HEAD
      /> */}
      <circle
        key={key}
        cx={tooltipLeft}
        cy={tooltipTop}
        r={4}
        fill="green"
=======
      />
      <circle
        cx={tooltipLeft}
        cy={tooltipTop}
        r={4}
        fill="#75daad"
>>>>>>> 53355d2e0fec912732f4eab12fc92d2463a385c3
        stroke="white"
        strokeWidth={2}
        pointerEvents="none"
      />
    </>
  );


}