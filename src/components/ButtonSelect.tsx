import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";

interface ButtonSelect {
  period: string;
  handlePeriod: any;
  startDate: string;
  endDate: string;
  initDate: string;
  finalDate: string;
  handleClick: any;
  displayPeriod: any;
}

export default function ButtonSelect({
  period,
  handlePeriod,
  startDate,
  endDate,
  initDate,
  finalDate,
  displayPeriod,
  handleClick,
}: ButtonSelect) {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150,
    },
  }));
  const classes = useStyles();
  return (
    <div>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="simple-select-label">Period</InputLabel>
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={period}
          onChange={handlePeriod}
        >
          <MenuItem value={"week"}>Week</MenuItem>
          <MenuItem value={"month"}>Month</MenuItem>
          <MenuItem value={"year"}>Year</MenuItem>
        </Select>
      </FormControl>
      <FormLabel id="display">
        <span>{displayPeriod}</span>
      </FormLabel>
      <ButtonGroup variant="contained" color="primary">
        <Button
          value={-1}
          onClick={handleClick}
          disabled={new Date(startDate) < new Date(initDate)}
        >
          - PREV.
        </Button>
        <Button
          value={1}
          onClick={handleClick}
          disabled={new Date(endDate) > new Date(finalDate)}
        >
          + NEXT
        </Button>
      </ButtonGroup>
    </div>
  );
}
