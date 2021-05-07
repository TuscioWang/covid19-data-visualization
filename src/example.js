import CovidGraph from "./components/MultiLineGraph";

function Example() {
    return (
        <NostroGrafico
            dataUrl="https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
            colorsConfig={{positivi: "#f00"}}
            showTooltip={true}
            startDate={startDate}
            endDate={endDate}
            periodSelected={period}
            selected={selectedGraph}
        />);
}