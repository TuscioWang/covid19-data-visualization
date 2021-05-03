import React from 'react';

export default function AppComponents(){
    const DATA_COLORS = {
        totale_positivi: "red",
        ricoverati_con_sintomi: "blue",
        isolamento_domiciliare: "url(#linear)",
        deceduti: "yellow",
        terapia_intensiva: "orange",
        tamponi: "green",
        dimessi_guariti: "grey",
      }

    const CHECKBOX_DATA = {
        totale_positivi: {
        label : "Positivi",
        },
        ricoverati_con_sintomi: {
        label : "Ricoverati con sintomi",
        },
        isolamento_domiciliare: {
        label : "Quarantena",
        },
        deceduti: {
        label : "Decessi",
        },
        terapia_intensiva: {
        label : "In Terapia",
        },
        tamponi: {
        label : "Tamponati",
        },
        dimessi_guariti: {
        label: "Guariti",
        },
  }
}