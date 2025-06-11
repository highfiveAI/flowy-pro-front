import type { UserUpdateRequest } from '../types/user';

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
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('회사 목록을 가져오지 못했습니다.');
    }

    const data = await response.json();

    // data.companies가 이미 Company[] 형태로 오므로 그대로 반환
    console.log(data);
    return { companies: data.companies, sysroles: data.companies.sysroles };
  } catch (error) {
    console.error('회사 목록 요청 중 오류 발생:', error);
    throw error;
  }
};

// 마이페이지 put 요청
export const updateUser = async (
  updateData: UserUpdateRequest
): Promise<any | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/update`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // "Authorization": "Bearer YOUR_ACCESS_TOKEN", // 필요 시 주석 해제
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('업데이트 실패:', errorData);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('업데이트 중 오류 발생:', error);
    return null;
  }
};
