import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Container from "@material-ui/core/Container";
import { CHECKBOX_DATA } from "./AppConfig";
import { Radio, RadioGroup } from "@material-ui/core";
import MultiLineGraph from "./MultiLineGraph";
import moment from "moment";
import ColorsCheckBox from "./ColorsCheckBox";
import ButtonSelect from "./ButtonSelect";

export default function CheckboxesGroup() {
  const m = moment();
  const covidUrl =
    "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json";
  const firstStart = moment(m).startOf("year").format("LLL");
  const firstEnd = moment(m).endOf("year").format("LLL");

  //Dichiaro tutti gli state
  const [dataJson, setData] = useState([]);
  const [selectedGraphs, setSelectedGraphs] = useState(["totale_positivi"]);
  const [datesInterval, setDatesInterval] = useState([firstStart, firstEnd]);
  const [period, setPeriod] = useState("year");
  const [shift, setShift] = useState(0);
  const [view, setView] = useState("domain");

  const handleSwitch = (e) => {
    const view = e.target.value;
    console.log(view);
    setView(view);
  };

  const getDataJson = async () => {
    await fetch(covidUrl)
      .then((res) => res.json())
      .then((receivedData) => setData(receivedData));
  };
  useEffect(() => {
    getDataJson();
  }, []);

  //Funzione che mi aggiorna l'array contenenti il grafico selezionato
  const handleChange = (event) => {
    const checked = event.target.checked;
    const graph = event.target.value;
    const updatedGraphs = checked
      ? [...selectedGraphs, graph]
      : selectedGraphs.filter((cur) => cur !== graph);
    setSelectedGraphs(updatedGraphs);
  };

  //Funzioni per gestire il periodo e lo shift
  const displayPeriod = () => {
    if (period === "year") return moment(startDate).format("Y");
    else if (period === "month") return moment(startDate).format("MMMM - Y");
    else return moment(startDate).format("[W] WW - Y");
  };
  const updateStartEndDates = (period, shift) => {
    let startDate;
    let endDate;
    if (period === "week") {
      startDate = moment(m).startOf("week").add(shift, "W").format("LLL");
      endDate = moment(m).endOf("week").add(shift, "weeks").format("LLL");
    } else if (period === "month") {
      startDate = moment(m).startOf("month").add(shift, "M").format("LLL");
      endDate = moment(m).endOf("month").add(shift, "M").format("LLL");
    } else {
      startDate = moment(m).startOf("year").add(shift, "y").format("LLL");
      endDate = moment(m).endOf("year").add(shift, "y").format("LLL");
    }
    setDatesInterval([startDate, endDate]);
  };

   //Prende il periodo selezionato
  const handlePeriod = (event) => {
    const period = event.target.value;
    const resetShift = 0;

    setShift(resetShift);
    setPeriod(period);
    updateStartEndDates(period, resetShift);
  };

  const [startDate, endDate] = datesInterval;

  //Fa lo schift rispetto al momento in cui sono nel tempo
  const handleClick = (event) => {
    const value = parseInt(event.currentTarget.value);
    const newShift = shift + value;

    setShift(newShift);
    updateStartEndDates(period, newShift);
  };

  //Visualizzazione dominio non esteso
  const arrayData = dataJson.map((d) => d.data);
  const initDate = arrayData[0];
  const finalDate = arrayData[arrayData.length - 1];

  return (
    <div>
      <Grid container>
        <Grid item xs={12} container>
          <Grid item md={9}>
            <Container className="generale">
              <Container>
                <h1> GRAFICO DEL COVID-19 </h1>
                <MultiLineGraph
                  dataConfig={CHECKBOX_DATA}
                  dataUrl={dataJson}
                  selected={selectedGraphs}
                  startDate={startDate}
                  endDate={endDate}
                  periodSelected={period}
                  view={view}
                />
              </Container>

              <Grid container alignItems="center" justify="space-evenly">
                <ButtonSelect
                period={period}
                handlePeriod={handlePeriod}
                startDate={startDate}
                endDate={endDate}
                initDate={initDate}
                finalDate={finalDate}
                displayPeriod={displayPeriod}
                handleClick={handleClick}
                />
              </Grid> 
            </Container>
          </Grid>

          <Grid item md={3}>
            <Container style={{ fontSize: "1vw" }} className="checkboxes">
              <FormControl component="fieldset">
                <h4 component="checkbox"> DATI DISPONIBILI </h4>
                <FormGroup
                  aria-label="graph"
                  name="graph"
                  value={selectedGraphs}
                  onChange={handleChange}
                >
                  {Object.keys(CHECKBOX_DATA).map((key, index) => {
                    return (
                      <FormControlLabel
                        value={key}
                        key={key}
                        control={
                          <ColorsCheckBox
                            defaultChecked={index === 0 ? true : false}
                            color={CHECKBOX_DATA[key].dataColor}
                          />
                        }
                        label={CHECKBOX_DATA[key].label}
                      />
                    );
                  })}
                </FormGroup>
              </FormControl>

              <h4>VISUALIZZAZIONI DISPONIBILI</h4>
              <RadioGroup onChange={handleSwitch} value={view}>
                <FormControlLabel
                  value="domain"
                  control={<Radio color="primary" />}
                  label="Visuale Dominio"
                />
                <FormControlLabel
                  value="period"
                  control={<Radio color="primary" />}
                  label="Visuale Periodo"
                />
              </RadioGroup>
            </Container>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
