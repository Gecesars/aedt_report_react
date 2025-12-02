export interface PortInfo {
  name: string;
  type: string;
  impedance?: number;
}

export interface SetupInfo {
  name: string;
  sweep?: string | null;
  solution_type?: string | null;
}

export interface MetricSummary {
  gain_max_db?: number;
  beamwidth_deg?: number;
  front_to_back_db?: number;
  efficiency?: number;
}

export interface DesignSummary {
  design_id: string;
  name: string;
  design_type: string;
  frequency_range?: string;
  ports: PortInfo[];
  setups: SetupInfo[];
  metrics: MetricSummary;
}
