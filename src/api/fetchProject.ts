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
