import { DesignSummary } from "./designs";
import { GeometryImage, RadiationResponse, SParameterResponse } from "./results";

export interface DatasheetSection {
  title: string;
  description?: string | null;
  highlights: string[];
}

export interface DatasheetResponse {
  design_id: string;
  generated_at: string;
  summary: DesignSummary;
  sparameters: SParameterResponse;
  radiation: RadiationResponse;
  geometry?: GeometryImage | null;
  sections: DatasheetSection[];
  notes: string[];
}
