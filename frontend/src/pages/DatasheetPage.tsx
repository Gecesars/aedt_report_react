import { useParams } from "react-router-dom";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import { useDatasheet } from "../hooks/useDatasheet";

export default function DatasheetPage() {
  const { designId = "default" } = useParams();
  const { data, isLoading } = useDatasheet(designId);

  if (isLoading || !data) {
    return <Loader message="Gerando datasheet" />;
  }

  return (
    <div className="space-y-6">
      <Card title="Resumo">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>Design: {data.summary.name}</p>
            <p>Faixa: {data.summary.frequency_range}</p>
            <p>Ganho maximo: {data.summary.metrics.gain_max_db} dBi</p>
          </div>
          <div>
            <p>Portas: {data.summary.ports.map((port) => port.name).join(", ")}</p>
            <p>Setups: {data.summary.setups.map((setup) => setup.name).join(", ")}</p>
            <p>Gerado em: {new Date(data.generated_at).toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {data.geometry && (
        <Card title="Geometria">
          <img src={data.geometry.url} alt="geometria" className="rounded-lg" />
        </Card>
      )}

      {data.sections.map((section) => (
        <Card key={section.title} title={section.title}>
          {section.description && <p className="text-sm text-slate-400 mb-2">{section.description}</p>}
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {section.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </Card>
      ))}

      <Card title="Notas">
        <ul className="list-disc pl-5 text-sm space-y-1">
          {data.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
