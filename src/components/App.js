import React from "react";
import Grid from "@material-ui/core/Grid";
import BarGraph from "./Grafico1";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Container from '@material-ui/core/Container';
import "../App.css";

export default function RadioButtonsGroup() {
  const [value, setValue] = React.useState("totale_positivi");
  
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Grid container >
        <Grid item xs={12} container >

          <Grid item xs={9}>
          <Container className="generale">
            <Container className="grafico">
              <BarGraph  selected={value} />
            </Container>
          </Container>
          </Grid>
          

          <Grid item xs={3}>
          <Container className="legenda">
            <FormControl component="fieldset">
              <FormLabel component="legend">Seleziona il dato:</FormLabel>
              <RadioGroup
                aria-label="axisY"
                name="axisY"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="totale_positivi"
                  control={<Radio />}
                  label="Positivi"
                />
                <FormControlLabel
                  value="ricoverati_con_sintomi"
                  control={<Radio />}
                  label="Ricoverati con sintomi"
                />
                <FormControlLabel
                  value="isolamento_domiciliare"
                  control={<Radio />}
                  label="Quarantena"
                />
                <FormControlLabel
                  value="deceduti"
                  control={<Radio />}
                  label="Decessi"
                />
                <FormControlLabel
                  value="terapia_intensiva"
                  control={<Radio />}
                  label="In Terapia"
                />

                <FormControlLabel
                  value="tamponi"
                  control={<Radio />}
                  label="Tamponati"
                />

                <FormControlLabel
                  value="dimessi_guariti"
                  control={<Radio />}
                  label="Guariti"
                />
              </RadioGroup>
            </FormControl>
            </Container>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
