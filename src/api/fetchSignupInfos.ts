import type { User } from "../types/user";

export interface Company {
  company_id: string;
  company_name: string;
  company_scale?: string;
  service_startdate?: string | null;
  service_enddate?: string | null;
  service_status?: boolean;
  company_positions?: CompanyPosition[];
}

export interface CompanyPosition {
  position_id: string;
  position_name: string;
  position_code: string;
  position_detail?: string;
  position_company_id: string;
}
export interface Sysrole {
  sysrole_id: string;
  sysrole_name: string;
  sysrole_detail: string;
  permissions: string;
}
export const fetchSignupInfos = async (): Promise<{
  companies: Company[];
  sysroles: Sysrole[];
}> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/signup/meta`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("회사 목록을 가져오지 못했습니다.");
    }

    const data = await response.json();

    // data.companies가 이미 Company[] 형태로 오므로 그대로 반환
    console.log(data);
    return { companies: data.companies, sysroles: data.companies.sysroles };
  } catch (error) {
    console.error("회사 목록 요청 중 오류 발생:", error);
    throw error;
  }
};

// 회사별 사용자 목록 조회
export const fetchUsersByCompany = async (
  company_id: string
): Promise<User[]> => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/admin/users/company/${company_id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("사용자 목록을 가져오지 못했습니다.");
    return await response.json();
  } catch (error) {
    console.error("회사별 사용자 목록 요청 중 오류 발생:", error);
    return [];
  }
};

// 관리자 등록(지정) 함수
export const putAdminUser = async (
  user_id: string,
  force: boolean = false
): Promise<{
  success?: boolean;
  already_admin?: boolean;
  message?: string;
}> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/admin/set_admin/${user_id}${
        force ? "?force=true" : ""
      }`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("관리자 등록 요청 중 오류 발생:", error);
    return { success: false, message: "네트워크 오류" };
  }
};

export const checkDuplicate = async (loginId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/users/sign_up/check_id?login_id=${loginId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("중복 확인 실패");

    const data = await response.json();
    return data.is_duplicate; // 서버 응답이 { is_duplicate: true } 형태라고 가정
  } catch (error) {
    console.error("아이디 중복 확인 중 오류 발생:", error);
    return false;
  }
};
