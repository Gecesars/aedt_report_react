import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import SParameterChart from "../components/charts/SParameterChart";
import Tabs from "../components/common/Tabs";
import Table from "../components/common/Table";
import { useSParameters } from "../hooks/useSParameters";

export default function SParametersPage() {
  const { designId = "default" } = useParams();
  const { data, isLoading } = useSParameters(designId);
  const [activeTab, setActiveTab] = useState("magnitude");

  const vswrRows = useMemo(() => {
    if (!data) return [];
    return data.traces
      .filter((trace) => trace.name === "S11")
      .flatMap((trace) =>
        trace.points.map((point) => [
          `${(point.frequency_hz / 1e9).toFixed(2)} GHz`,
          point.vswr ? point.vswr.toFixed(2) : "--"
        ])
      );
  }, [data]);

  if (isLoading || !data) {
    return <Loader message="Carregando S-parametros" />;
  }

  return (
    <div className="space-y-6">
      <Tabs
        tabs={[
          { key: "magnitude", label: "Magnitude" },
          { key: "vswr", label: "VSWR" }
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "magnitude" ? (
        <Card title="Magnitude (dB)">
          <div className="h-80">
            <SParameterChart traces={data.traces} />
          </div>
        </Card>
      ) : (
        <Card title="VSWR">
          <Table headers={["Frequencia", "VSWR"]} rows={vswrRows} />
        </Card>
      )}
    </div>
  );
}
