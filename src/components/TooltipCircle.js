export default function TooltipCircle(props) {

  //Destrutturazione dei propsHEAD
  const tooltipLeft = props.tooltipLeft;
  const tooltipTop = props.tooltipTop;
  const key=props.key;

  console.log("X:",tooltipLeft,"Y:",tooltipTop);
  return (
    <>   
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