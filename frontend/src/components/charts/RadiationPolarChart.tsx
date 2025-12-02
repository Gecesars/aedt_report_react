import Plot from "react-plotly.js";
import { RadiationCut } from "../../types/results";

interface Props {
  cuts: RadiationCut[];
}

export default function RadiationPolarChart({ cuts }: Props) {
  const traces = cuts.map((cut) => ({
    type: "scatterpolar",
    r: cut.gain_db,
    theta: cut.theta,
    name: `${cut.plane}-plane`
  }));

  return (
    <Plot
      data={traces}
      layout={{
        polar: { radialaxis: { visible: true, range: [Math.min(...cuts[0]?.gain_db ?? [0]) - 5, Math.max(...cuts[0]?.gain_db ?? [0]) + 5] } },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "#e2e8f0" }
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
      config={{ displayModeBar: false }}
    />
  );
}
