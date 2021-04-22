import React, { useEffect } from "react";
import "../App.css";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from "@material-ui/core/FormLabel";
import Container from '@material-ui/core/Container';
//import AreaClosed from "./AreaClosed";
import Checkbox from '@material-ui/core/Checkbox';
import XYGraph from "./XYChart";
//import Grafico2 from "./Grafico2";
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { CHECKBOX_DATA } from './AppConfig';

export default function CheckboxesGroup() {
  const moment = require("moment");
  const m = moment();

  const firstStart = moment(m).startOf("year").format("LLL");
  const firstEnd = moment(m).endOf("year").format("LLL");

  const [selectedGraphs, setSelectedGraphs] = React.useState(["totale_positivi"]);
  const [datesInterval, setDatesInterval] = React.useState([firstStart, firstEnd]);
  const [period, setPeriod] = React.useState('year');
  const [shift, setShift] = React.useState(0);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150,
    },
  }));
  const classes = useStyles();

  const handleChange = (event) => {
    const checked = event.target.checked;
    const graph = event.target.value;
    const updatedGraphs =
      checked ?
        [...selectedGraphs, graph] :
        selectedGraphs.filter(cur => cur !== graph);
    setSelectedGraphs(updatedGraphs);
  };

  //Funzione che aggiunge le date di inizio e fine
  const updateStartEndDates = (period, shift) => {
    let startDate;
    let endDate;
    if (period === "week") {
      startDate = moment(m).startOf("week").add(shift, "W").format("LLL");
      endDate = moment(m).endOf("week").add(shift, "weeks").format("LLL");

    } else if (period === "month") {
      startDate = moment(m).startOf("month").add(shift, "M").format("LLL");
      endDate = moment(m).endOf("month").add(shift, "M").format("LLL");
    }
    else {
      startDate = moment(m).startOf("year").add(shift, "y").format("LLL");
      endDate = moment(m).endOf("year").add(shift, "y").format("LLL");
    }

    setDatesInterval([startDate, endDate]);
  }

  //prende il periodo selezionato
  const handlePeriod = (event) => {
    const period = event.target.value;
    setPeriod(period);
    updateStartEndDates(period, shift);
  }

  //fa lo schift rispetto al momento in cui sono nel tempo
  const handleClick = (event) => {
    const value = parseInt(event.currentTarget.value);
    const newShift = shift + value;

    setShift(newShift);
    updateStartEndDates(period, newShift);
  }

  //stardate=datainterval[0], endData=datainterval [1]
  const [startDate, endDate] = datesInterval;

  return (
    <div>
      <Grid container >
        <Grid item xs={12} container >
          <Grid item md={9} >
            <Container className="generale">
              <Container className="graphCss">
                <h1> GRAFICO COVID 2020-2021 </h1>
                <XYGraph
                  selected={selectedGraphs}
                  startDate={startDate}
                  endDate={endDate}
                />
              </Container>
              <Grid container alignItems="center" justify="space-evenly">
                <Button
                  variant="contained"
                  color="primary"
                  value={-1}
                  onClick={handleClick}
                >
                  - INDIETRO
              </Button>

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

                <Button
                  variant="contained"
                  color="primary"
                  value={1}
                  onClick={handleClick}
                >
                  + AVANTI
              </Button>
              </Grid>
            </Container>
          </Grid>

          <Grid item md={3}>
            <Container style={{ fontSize: "2vw" }} className="legenda">
              <FormControl component="fieldset">
                <FormLabel component="legend"> Seleziona dati: </FormLabel>
                <FormGroup
                  aria-label="graph"
                  name="graph"
                  value={selectedGraphs}
                  onChange={handleChange}
                >
                  {Object.keys(CHECKBOX_DATA).map((key, index) =>
                    <FormControlLabel
                      value={key}
                      key={key}
                      control={
                        <Checkbox defaultChecked={(index === 0) ? true : false}
                          color={CHECKBOX_DATA[key].color}
                        />
                      }
                      label={CHECKBOX_DATA[key].label}
                    />
                  )}
                </FormGroup>
              </FormControl>
            </Container>
          </Grid>
        </Grid>
      </Grid>
    </div >
  );
}
