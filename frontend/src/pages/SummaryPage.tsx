import { useParams } from "react-router-dom";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import SParameterChart from "../components/charts/SParameterChart";
import { useDesignSummary } from "../hooks/useDesignSummary";
import { useGeometryImage, useRadiation } from "../hooks/useRadiation";
import { useSParameters } from "../hooks/useSParameters";

export default function SummaryPage() {
  const { designId = "default" } = useParams();
  const summaryQuery = useDesignSummary(designId);
  const geometryQuery = useGeometryImage(designId);
  const sparamsQuery = useSParameters(designId);
  const radiationQuery = useRadiation(designId);

  if (summaryQuery.isLoading) {
    return <Loader message="Carregando resumo" />;
  }

  const summary = summaryQuery.data;
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card title="Resumo do design">
        {summary ? (
          <ul className="text-sm space-y-2">
            <li>Nome: {summary.name}</li>
            <li>Faixa: {summary.frequency_range}</li>
            <li>Tipo: {summary.design_type}</li>
            <li>Portas: {summary.ports.map((port) => port.name).join(", ")}</li>
            <li>Ganho max: {summary.metrics.gain_max_db} dBi</li>
          </ul>
        ) : (
          <p>Nenhum resumo disponivel.</p>
        )}
      </Card>

      <Card title="Geometria">
        {geometryQuery.data ? (
          <img src={geometryQuery.data.url} alt="Geometria" className="rounded-lg" />
        ) : (
          <Loader message="Exportando imagem" />
        )}
      </Card>

      <Card title="S-parametros">
        {sparamsQuery.data ? <SParameterChart traces={sparamsQuery.data.traces} /> : <Loader message="Calculando" />}
      </Card>

      <Card title="Radiacao">
        {radiationQuery.data ? (
          <p>{radiationQuery.data.cuts.length} cortes disponiveis</p>
        ) : (
          <Loader message="Obtendo campos" />
        )}
      </Card>
    </div>
  );
}
