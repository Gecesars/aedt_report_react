import Plot from "react-plotly.js";

interface Props {
  heatmapUrl?: string;
}

export default function RadiationHeatmap({ heatmapUrl }: Props) {
  if (!heatmapUrl) {
    return <p className="text-sm text-slate-400">Heatmap ainda nao gerado.</p>;
  }
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <img src={heatmapUrl} alt="Heatmap de radiacao" className="w-full" />
    </div>
  );
}
