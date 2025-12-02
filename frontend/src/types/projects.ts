export interface ProjectUploadResponse {
  project_id: string;
  filename: string;
  stored_path: string;
}

export interface ProjectInfo {
  project_id: string;
  name: string;
  designs: string[];
  last_modified?: string;
}

export interface ProjectListResponse {
  projects: ProjectInfo[];
}
