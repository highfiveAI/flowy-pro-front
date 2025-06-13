export interface Project {
  project_id: string;
  project_name: string;
  project_detail: string;
  project_created_date: string; // ISO8601 날짜 문자열
  project_updated_date: string;
  project_end_date?: string | null; // 값이 없을 수 있으므로 optional로 처리
  project_status: boolean;
  company_id: string;
}

export interface ProjectUser {
  project_user_id: string;
  user_id: string;
  project_id: string;
  role_id: string;
  project: Project;
}
