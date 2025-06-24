export const sendEmailCode = async (
  email: string
): Promise<{ message: string; code?: string }> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/find_id/send_code`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '인증 코드 전송 실패');
    }

    return data; // { message: "...", code: "123456" }
  } catch (error: any) {
    throw new Error(error.message || '네트워크 오류');
  }
};

export const verifyCode = async (
  input_code: string
): Promise<{ verified: boolean }> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/verify_code`,
      {
        method: 'POST',
        credentials: 'include', // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_code }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '코드 인증 실패');
    }

    return data; // { verified: true } or { verified: false }
  } catch (error: any) {
    throw new Error(error.message || '네트워크 오류');
  }
};

// api/fetchFindId.ts

export const fetchFindId = async (
  email: string
): Promise<{ user_login_id: string }> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/find_id`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || '아이디 찾기에 실패했습니다.');
    }

    return data; // { user_login_id: "example_id" }
  } catch (error: any) {
    throw new Error(error.message || '네트워크 오류가 발생했습니다.');
  }
};
