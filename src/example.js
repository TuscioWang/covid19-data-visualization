//import NostroGrafico from "nostro-grafico";

function MyPage() {
    return (
        <NostroGrafico
            dataUrl="/paht/to/my/json"
            colorsConfig={{positivi: "#f00"}}
            showTooltip={true}
            startDate={startDate}
            endDate={endDate}
            periodSelected={period}
        />);
}