export interface SessionStatus {
  status: string;
  session_id?: string;
  aedt_version?: string;
  current_project?: string;
  current_design?: string;
  has_open_project?: boolean;
}
