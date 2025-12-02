import api from "./apiClient";
import { SessionStatus } from "../types/aedt";
import { ProjectUploadResponse, ProjectInfo, ProjectListResponse } from "../types/projects";
import { DesignSummary } from "../types/designs";
import { GeometryImage, RadiationResponse, SParameterResponse } from "../types/results";
import {
  SimulationFramesResponse,
  SimulationJob,
  SimulationProgress,
  SimulationVideoRequest
} from "../types/simulations";
import { DatasheetResponse } from "../types/datasheet";

export const fetchSessionStatus = async () => {
  const { data } = await api.get<SessionStatus>("/session/status");
  return data;
};

export const connectSession = async () => {
  const { data } = await api.post<SessionStatus>("/session/connect", {});
  return data;
};

export const startSession = async (force = false) => {
  const { data } = await api.post<SessionStatus>("/session/start", { force });
  return data;
};

export const uploadProject = async (file: File) => {
  const body = new FormData();
  body.append("file", file);
  const { data } = await api.post<ProjectUploadResponse>("/projects/upload", body, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const openProject = async (project_id: string, open_in_gui = true) => {
  const { data } = await api.post<ProjectInfo>("/projects/open", { project_id, open_in_gui });
  return data;
};

export const listProjects = async () => {
  const { data } = await api.get<ProjectListResponse>("/projects");
  return data;
};

export const fetchDesignSummary = async (designId: string) => {
  const { data } = await api.get<DesignSummary>(`/designs/${designId}/summary`);
  return data;
};

export const fetchSParameters = async (designId: string) => {
  const { data } = await api.get<SParameterResponse>(`/designs/${designId}/sparameters`);
  return data;
};

export const fetchRadiation = async (designId: string) => {
  const { data } = await api.get<RadiationResponse>(`/designs/${designId}/radiation`);
  return data;
};

export const fetchGeometryImage = async (designId: string, view = "isometric") => {
  const { data } = await api.get<GeometryImage>(`/designs/${designId}/images/geometry`, { params: { view } });
  return data;
};

export const createSimulationVideo = async (designId: string, payload: SimulationVideoRequest) => {
  const { data } = await api.post<SimulationJob>(`/simulations/${designId}/videos`, payload);
  return data;
};

export const fetchSimulationStatus = async (jobId: string) => {
  const { data } = await api.get<SimulationProgress>(`/simulations/${jobId}`);
  return data;
};

export const fetchSimulationFrames = async (jobId: string) => {
  const { data } = await api.get<SimulationFramesResponse>(`/simulations/${jobId}/frames`);
  return data;
};

export const fetchDatasheet = async (designId: string) => {
  const { data } = await api.get<DatasheetResponse>(`/datasheets/${designId}`);
  return data;
};

