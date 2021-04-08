import React from "react";
import Grid from "@material-ui/core/Grid";
import BarGraph from "./Grafico1";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import "../App.css";

export default function RadioButtonsGroup() {
  const [value, setValue] = React.useState("decessi");
  
  const handleChange = (event) => {
    console.log("stringa: ", event.target.value);
    setValue(event.target.value);
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} container justify="center" alignItems="center">
          <Grid item xs={8}>
            <BarGraph selected={value} />
          </Grid>

          <Grid item xs={2}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Seleziona il dato:</FormLabel>
              <RadioGroup
                aria-label="axisY"
                name="axisY"
                Value={value}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="deceduti"
                  control={<Radio />}
                  label="Decessi"
                />

                <FormControlLabel
                  value="terapia_intensiva"
                  control={<Radio />}
                  label="In terapia"
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
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
