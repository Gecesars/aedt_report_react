export interface TracePoint {
  frequency_hz: number;
  magnitude_db: number;
  phase_deg: number;
  vswr?: number;
}

export interface TraceData {
  name: string;
  points: TracePoint[];
}

export interface SParameterResponse {
  design_id: string;
  traces: TraceData[];
}

export interface RadiationCut {
  plane: string;
  frequency_hz: number;
  theta: number[];
  gain_db: number[];
}

export interface RadiationResponse {
  design_id: string;
  cuts: RadiationCut[];
  heatmap_url?: string;
}

export interface GeometryImage {
  design_id: string;
  view: string;
  url: string;
  updated_at: string;
}
