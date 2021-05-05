export default function TooltipCircle(props) {

  //Destrutturazione dei propsHEAD
  const {tooltipLeft,tooltipTop} = props;
  return (
    <>   
      <circle
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