import type { Company } from '../api/fetchSignupInfos';

export interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  user_login_id: string;
  user_login_type: string;
  user_password: string;
  user_phonenum: string;
  user_dept_name: string;
  user_team_name: string;
  user_jobname: string;
  user_company_id: string;
  user_position_id: string;
  user_sysrole_id: string;
  company: Company;
}

export interface UserUpdateRequest {
  user_team_name?: string;
  user_dept_name?: string;
  user_phonenum?: string;
}

export interface LoginRequest {
  login_id: string;
  password: string;
}
