export async function sendChatMessage(message: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/chatbot/chat`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    }
  );

  if (!res.ok) throw new Error('서버 오류');
  return res.json(); // { type: 'scenario' | 'ai', response: string }
}
