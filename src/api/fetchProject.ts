import type { ProjectRequestBody } from "../types/project";

// 프로젝트 메타데이터
export async function fetchProjectMetaData(): Promise<any | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/meta`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch project metadata:", error);
    return null;
  }
}

// 프로젝트들 get
export async function fetchProject(user_id: string): Promise<any[] | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/user_id/${user_id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return null;
  }
}
// 프로젝트의 회의정보들
export async function fetchMeetingsWithUsers(
  projectId: string
): Promise<any[] | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/meeting/${projectId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch meetings with users:", error);
    return null;
  }
}

// 프로젝트 정보 post
export const createProject = async (
  body: ProjectRequestBody
): Promise<Response> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "프로젝트 생성 실패");
    }

    return response;
  } catch (error) {
    console.error("프로젝트 생성 중 에러:", error);
    throw error;
  }
};

export async function fetchMeetings(meeting_id: string): Promise<any | null> {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/projects/meeting/result/${meeting_id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch project metadata:", error);
    return null;
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // 필요 시 인증 토큰 추가
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "프로젝트 삭제에 실패했습니다.");
    }

    const result = await response.json();
    console.log("프로젝트 삭제 성공:", result.message);
  } catch (error) {
    console.error("프로젝트 삭제 중 오류:", error);
    throw error;
  }
}
