import React from "react";
import "../App.css";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from "@material-ui/core/FormLabel";
import Container from '@material-ui/core/Container';
//import AreaClosed from "./AreaClosed";
import Checkbox from '@material-ui/core/Checkbox';
import XYChart from "./XYChart";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import moment from "moment";


export default function CheckboxesGroup() {
  const [selectedGraphs, setSelectedGraphs] = React.useState(["totale_positivi"]);
  const [add, setAdd] = React.useState(0);
  const [period, setSelectedPeriod] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState();

  const [datesInterval, setDatesInterval] = React.useState([]);

  //Aggiunge le date di inizio e fine
  const updateStartEndDates = (period, shift) => {
    // start e end date

    if (period === "week") {
      const startDate = moment().startOf("week").add(shift, "weeks");
      const endDate = moment().endOf("week").add(shift, "weeks");
    }
    // salvare nello stato
    setDatesInterval([startDate, endDate]);
  }

  //prende il periodo selezionato
  const handlePeriod = (event) => {
    const {myValue} = event.currentTarget.dataset;
  
    setSelectedPeriod(myValue);
    updateStartEndDates(myValue, add);
  }

  //fa lo schift rispetto al momento in cui sono del tempo
  const handleAdd = (event) => {
    const {myValue} = event.currentTarget.dataset;

    setAdd(add + myValue); //add = shift myValue è il valore cliccato 
    updateStartEndDates(period, myValue);
  }

  const handleClick = (event) => {
   
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {

    const checked = event.target.checked;
    const graph = event.target.value;

    const updatedGraphs =
      checked ?
        [...selectedGraphs, graph] :
        selectedGraphs.filter(cur => cur !== graph);

    setSelectedGraphs(updatedGraphs);
  };

  const [startDate, endDate] = datesInterval;

  /*
  const startDate = datesInterval[0];
  const endDate = datesInterval[1];
  */

  return (
    <div>
      <Grid container >
        <Grid item xs={12} container >
          <Grid item md={9} >
            <Container className="generale">
              <Container className="graphCss">
                <h1> GRAFICO COVID 2020-2021 </h1>
                <XYChart
                  selected={selectedGraphs}
                  startDate={startDate}
                  endDate={endDate}
                />
              </Container>
              <Grid container justify="space-around">
                <Button
                  variant="contained"
                  color="secondary"
                  data-my-value={-1}
                  onClick={handleAdd}
                >
                  - INDIETRO
              </Button>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                >
                  periodo
              </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={handlePeriod}
                    data-my-value="settimana"
                  >
                    Settimana
                  </MenuItem>
                  <MenuItem
                    onClick={handlePeriod}
                    data-my-value="mese"
                  >
                    Mese
                    </MenuItem>
                  <MenuItem
                    onClick={handlePeriod}
                    data-my-value="anno"
                  >
                    Anno
                    </MenuItem>
                </Menu>
                <Button
                  variant="contained"
                  color="secondary"
                  data-my-value={+1}
                  onClick={handleAdd}
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
                  <FormControlLabel
                    value="totale_positivi"
                    control={<Checkbox defaultChecked />}
                    label="Positivi"
                  />
                  <FormControlLabel
                    value="ricoverati_con_sintomi"
                    control={<Checkbox />}
                    label="Ricoverati con sintomi"
                  />
                  <FormControlLabel
                    value="isolamento_domiciliare"
                    control={<Checkbox />}
                    label="Quarantena"
                  />
                  <FormControlLabel
                    value="deceduti"
                    control={<Checkbox />}
                    label="Decessi"
                  />
                  <FormControlLabel
                    value="terapia_intensiva"
                    control={<Checkbox />}
                    label="In Terapia"
                  />
                  <FormControlLabel
                    value="tamponi"
                    control={<Checkbox />}
                    label="Tamponati"
                  />
                  <FormControlLabel
                    value="dimessi_guariti"
                    control={<Checkbox />}
                    label="Guariti"
                  />
                </FormGroup>
              </FormControl>
            </Container>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
