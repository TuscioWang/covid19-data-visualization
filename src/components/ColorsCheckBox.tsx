import Checkbox from "@material-ui/core/Checkbox";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

interface ColorsCheckBoxProps {
  color: string;
  
}
export default function ColorsCheckBox({
  color,
  ...props
}: ColorsCheckBoxProps) {
  const useStyles = makeStyles({
    root: {
      color: color,
      "%$checked": {
        color: color,
      },
    },
    checked: {},
  });
  const classes = useStyles();
  return (
    <Checkbox
      className={clsx(classes.root, classes.checked)}
      color="default"
      {...props}
    />
  );
}
