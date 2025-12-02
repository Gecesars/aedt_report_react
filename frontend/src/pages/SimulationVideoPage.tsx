import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import SelectField from "../components/forms/SelectField";
import { useSimulationJob, useSimulationStatus } from "../hooks/useSimulationJob";
import { useSimulationFrames } from "../hooks/useSimulationFrames";

export default function SimulationVideoPage() {
  const { designId = "default" } = useParams();
  const jobMutation = useSimulationJob(designId);
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoType, setVideoType] = useState("parametric");
  const [parameters, setParameters] = useState("theta,phi");

  const statusQuery = useSimulationStatus(jobId);
  const framesQuery = useSimulationFrames(jobId);

  useEffect(() => {
    if (jobMutation.data?.job_id) {
      setJobId(jobMutation.data.job_id);
    }
  }, [jobMutation.data]);

  const latestFrame = useMemo(() => framesQuery.data?.frames.at(-1), [framesQuery.data]);

  const handleStart = () => {
    jobMutation.mutate({
      type: videoType as "parametric",
      parameters: parameters
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      frame_rate: 12,
      max_frames: 60
    });
  };

  return (
    <div className="space-y-6">
      <Card title="Configurar video">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Tipo"
            value={videoType}
            onChange={setVideoType}
            options={[
              { label: "Parametrico", value: "parametric" },
              { label: "Movimento de fonte", value: "source_motion" },
              { label: "SBR+", value: "sbr_plus" }
            ]}
          />
          <label className="flex flex-col gap-1 text-sm text-slate-300">
            Parametros
            <input
              type="text"
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
            />
          </label>
        </div>
        <button className="btn-primary mt-4" onClick={handleStart} disabled={jobMutation.isLoading}>
          {jobMutation.isLoading ? "Submetendo" : "Gerar video"}
        </button>
      </Card>

      <Card title="Status">
        {jobId ? (
          statusQuery.data ? (
            <p>
              Job {jobId} - {statusQuery.data.status} - {statusQuery.data.progress.toFixed(1)}%
            </p>
          ) : (
            <Loader message="Monitorando" />
          )
        ) : (
          <p>Nenhum job em execucao.</p>
        )}
      </Card>

      <Card title="Player">
        {latestFrame ? (
          <div className="space-y-2">
            <img src={latestFrame.image_url} alt="Frame" className="rounded-lg" />
            <p className="text-xs text-slate-400">Frame #{latestFrame.frame_index}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Sem frames disponiveis.</p>
        )}
      </Card>
    </div>
  );
}
