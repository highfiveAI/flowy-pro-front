import type { ProjectRequestBody } from '../types/project';

// 프로젝트 메타데이터
export async function fetchProjectMetaData(): Promise<any | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/meta`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch project metadata:', error);
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
    console.error('Failed to fetch projects:', error);
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
    console.error('Failed to fetch meetings with users:', error);
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
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '프로젝트 생성 실패');
    }

    return response;
  } catch (error) {
    console.error('프로젝트 생성 중 에러:', error);
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
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch project metadata:', error);
    return null;
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`, // 필요 시 인증 토큰 추가
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '프로젝트 삭제에 실패했습니다.');
    }

    const result = await response.json();
    console.log('프로젝트 삭제 성공:', result.message);
  } catch (error) {
    console.error('프로젝트 삭제 중 오류:', error);
    throw error;
  }
}

export async function updateProjectName(
  projectId: string,
  newName: string
): Promise<void> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`, // 필요 시 인증 토큰 추가
        },
        body: JSON.stringify({
          project_name: newName,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '프로젝트 이름 수정에 실패했습니다.');
    }

    const result = await response.json();
    console.log('프로젝트 이름 수정 성공:', result.message);
  } catch (error) {
    console.error('프로젝트 이름 수정 중 오류:', error);
    throw error;
  }
}

export async function postAssignedTodos(
  meeting_id: string | undefined,
  assignedTodos: any
): Promise<void> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/update_todos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요하면 인증 헤더 추가 가능
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          meeting_id: meeting_id,
          updated_task_assign_contents: assignedTodos,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || '할당된 작업 목록 전송에 실패했습니다.'
      );
    }

    const result = await response.json();
    console.log('할당된 작업 목록 전송 성공:', result);
  } catch (error) {
    console.log(meeting_id);
    console.log(assignedTodos);
    console.error('할당된 작업 목록 전송 중 오류:', error);
    throw error;
  }
}

export async function postSummaryLog(
  meeting_id: string | undefined,
  updatedSummaryContents: any
): Promise<void> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/update_summary`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요시 인증 토큰 추가
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          meeting_id: meeting_id,
          updated_summary_contents: updatedSummaryContents,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '회의 요약 전송에 실패했습니다.');
    }

    const result = await response.json();
    console.log('회의 요약 전송 성공:', result);
  } catch (error) {
    console.log(meeting_id);
    console.log(updatedSummaryContents);
    console.error('회의 요약 전송 중 오류:', error);
    throw error;
  }
}

// 추천문서(DraftLog) 조회 함수
export async function fetchDraftLogs(meeting_id: string): Promise<any[] | null> {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/docs/draft/${meeting_id}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: any[] = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch draft logs:', error);
        return null;
    }
}
