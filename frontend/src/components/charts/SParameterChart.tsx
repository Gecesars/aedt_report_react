import Plot from "react-plotly.js";
import { TraceData } from "../../types/results";

interface Props {
  traces: TraceData[];
}

export default function SParameterChart({ traces }: Props) {
  const plotData = traces.map((trace) => ({
    type: "scatter",
    mode: "lines",
    name: trace.name,
    x: trace.points.map((p) => p.frequency_hz / 1e9),
    y: trace.points.map((p) => p.magnitude_db)
  }));

  return (
    <Plot
      data={plotData}
      layout={{
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(15,23,42,1)",
        font: { color: "#e2e8f0" },
        xaxis: { title: "Frequencia (GHz)" },
        yaxis: { title: "Magnitude (dB)" }
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
      config={{ displayModeBar: false }}
    />
  );
}
