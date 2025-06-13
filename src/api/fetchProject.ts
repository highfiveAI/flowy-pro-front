// 프로젝트 메타데이터
export async function fetchProjectMetaData(): Promise<any | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/projects/meta`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
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
