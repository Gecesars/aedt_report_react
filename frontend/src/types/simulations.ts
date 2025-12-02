export type SimulationType = "parametric" | "source_motion" | "sbr_plus";

export interface SimulationVideoRequest {
  type: SimulationType;
  parameters: string[];
  frame_rate: number;
  max_frames: number;
}

export interface SimulationJob {
  job_id: string;
  design_id: string;
  status: string;
  submitted_at: string;
}

export interface SimulationProgress {
  job_id: string;
  status: string;
  progress: number;
  current_frame: number;
  total_frames?: number;
  message?: string;
  submitted_at: string;
}

export interface SimulationFrame {
  job_id: string;
  frame_index: number;
  image_url: string;
  data_snapshot?: Record<string, unknown>;
  timestamp: string;
}

export interface SimulationFramesResponse {
  job_id: string;
  frames: SimulationFrame[];
}
