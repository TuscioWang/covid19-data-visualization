import React from "react";
import Grid from "@material-ui/core/Grid";
//import BarGraph from "./Grafico1";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from "@material-ui/core/FormLabel";
import Container from '@material-ui/core/Container';
import "../App.css";
import BarGraph from "./Grafico1";
import Checkbox from '@material-ui/core/Checkbox';
import Render from "./Grafico2";


export default function CheckboxesGroup() {
  const [value, setValue] = React.useState("totale_positivi");
  
  const handleChange = (event) => {
    (event.target.checked) ? 
    setValue(event.target.value) : setValue(event.target.null);
  };

  return (
    <div>
      <Grid container >
        <Grid item xs={12} container >
          <Grid item xs={9}>
          <Container className="generale">
            <Container className="grafico">
            <h1> GRAFICO COVID 2020-2021 </h1>
              <Render selected={value} />
            </Container>
          </Container>
          </Grid>

          <Grid item xs={3}>
          <Container style={{fontSize: "2vw"}} className="legenda">
            <FormControl component="fieldset">
              <FormLabel component="legend"> Seleziona dati: </FormLabel>
              <FormGroup
                aria-label="axisY"
                name="axisY"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel style={{fontSize: "2vw"}}
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
