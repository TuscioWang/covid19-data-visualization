import { DATA_COLORS, CHECKBOX_DATA } from "./AppConfig";
import { scaleOrdinal } from "@visx/scale";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import { colors } from "@material-ui/core";

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