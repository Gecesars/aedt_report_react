import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import SelectField from "../components/forms/SelectField";
import RadiationPolarChart from "../components/charts/RadiationPolarChart";
import RadiationHeatmap from "../components/charts/RadiationHeatmap";
import { useRadiation } from "../hooks/useRadiation";

export default function RadiationPage() {
  const { designId = "default" } = useParams();
  const { data, isLoading } = useRadiation(designId);
  const [plane, setPlane] = useState("E");

  const cuts = useMemo(() => data?.cuts.filter((cut) => cut.plane === plane) ?? [], [data, plane]);

  if (isLoading || !data) {
    return <Loader message="Obtendo padroes de radiacao" />;
  }

  return (
    <div className="space-y-6">
      <SelectField
        label="Plano"
        value={plane}
        onChange={setPlane}
        options={[
          { label: "Plano E", value: "E" },
          { label: "Plano H", value: "H" }
        ]}
      />

      <Card title="Diagrama polar">
        <div className="h-96">
          <RadiationPolarChart cuts={cuts} />
        </div>
      </Card>

      <Card title="Heatmap">
        <RadiationHeatmap heatmapUrl={data.heatmap_url} />
      </Card>
    </div>
  );
}
