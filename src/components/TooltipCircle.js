export default function TooltipCircle({tooltipLeft,tooltipTop}){
    //Destrutturazione
    //const {tooltipLeft,tooltipTop} = props;

    return(
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