import { useState } from "react";
import { useConnectSession, useSessionStatus, useStartSession } from "../hooks/useAedtSession";
import { useOpenProject, useProjects, useUploadProject } from "../hooks/useProjects";
import FileUploadField from "../components/forms/FileUploadField";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function SessionPage() {
  const { data, isFetching } = useSessionStatus();
  const connectMutation = useConnectSession();
  const startMutation = useStartSession();
  const uploadMutation = useUploadProject();
  const openMutation = useOpenProject();
  const { data: projects } = useProjects();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const uploaded = await uploadMutation.mutateAsync(file);
    await openMutation.mutateAsync({ projectId: uploaded.project_id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={() => connectMutation.mutate()}>
          Conectar sessao existente
        </button>
        <button className="btn-secondary" onClick={() => startMutation.mutate(true)}>
          Iniciar nova GUI
        </button>
      </div>

      <section className="card space-y-2">
        <h2 className="text-lg font-semibold">Status da sessao</h2>
        {isFetching ? (
          <Loader message="Verificando sessao" />
        ) : (
          <ul className="text-sm text-slate-300">
            <li>Estado: {data?.status}</li>
            <li>Versao AEDT: {data?.aedt_version}</li>
            <li>Projeto ativo: {data?.current_project ?? "--"}</li>
          </ul>
        )}
        <ErrorMessage error={connectMutation.error ? "Falha ao conectar" : undefined} />
      </section>

      <section className="card space-y-4">
        <h3 className="font-semibold">Upload de projeto HFSS</h3>
        <FileUploadField onFileSelected={setFile} />
        <button className="btn-primary" disabled={!file || uploadMutation.isLoading} onClick={handleUpload}>
          {uploadMutation.isLoading ? "Enviando..." : "Enviar e abrir"}
        </button>
      </section>

      <section className="card">
        <h3 className="font-semibold mb-4">Projetos recentes</h3>
        <ul className="text-sm space-y-2">
          {projects?.projects.map((project) => (
            <li key={project.project_id} className="flex items-center justify-between">
              <span>{project.name}</span>
              <button className="btn-secondary" onClick={() => openMutation.mutate({ projectId: project.project_id })}>
                Abrir
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
