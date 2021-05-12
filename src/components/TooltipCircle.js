export default function TooltipCircle(props) {
  //Destrutturazione dei propsHEAD
  const { tooltipLeft, tooltipTop } = props;
  const colors=props.colors;
  return (
    <>
      <circle
        cx={tooltipLeft}
        cy={tooltipTop}
        r={4}
        fill={colors}
        stroke="white"
        strokeWidth={2}
        pointerEvents="none"
      />
    </>
  );


}