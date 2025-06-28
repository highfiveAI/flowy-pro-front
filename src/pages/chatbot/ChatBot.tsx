import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { sendChatMessage } from "../../api/fetchChatbot";

const Container = styled.div`
  max-width: 400px;
  margin: 40px auto;
  border: 1px solid #ccc;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  height: 600px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const InputArea = styled.form`
  display: flex;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 16px;
  font-size: 16px;
  outline: none;
`;

const SendButton = styled.button`
  padding: 0 20px;
  background: #4a90e2;
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #3578c0;
  }

  &:disabled {
    background: #a0c1f7;
    cursor: not-allowed;
  }
`;

const LinkButton = styled.button`
  width: 100%;
  margin-top: 12px;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;

  &:hover {
    background-color: #3578c0;
  }
`;

const Messages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f9f9f9;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageBubble = styled.div<{ isUser?: boolean }>`
  background: ${({ isUser }) => (isUser ? "#d0ebff" : "#ffffff")};
  color: #333;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 75%;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.4;
  min-width: 0;

  display: inline-block;

  align-self: ${({ isUser }) => (isUser ? "flex-end" : "flex-start")};
  margin-left: ${({ isUser }) => (isUser ? "auto" : "0")};

  text-align: ${({ isUser }) => (isUser ? "right" : "left")};

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  border-bottom-right-radius: ${({ isUser }) => (isUser ? "0" : "12px")};
  border-bottom-left-radius: ${({ isUser }) => (isUser ? "12px" : "0")};
`;

// ... types

type Message = {
  sender: "user" | "bot";
  text?: string;
  doc?: string;
  link?: string;
  summary?: string;
  loading?: boolean; // 로딩 표시용 플래그
};

// ... 점 애니메이션

const DotWrapper = styled.span`
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 4px;
  display: inline-block;
  width: 24px; /* 고정된 너비 지정 */
  white-space: nowrap; /* 줄바꿈 방지 */
`;

const LoadingDots: React.FC = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => (c === 3 ? 1 : c + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <DotWrapper>
      {Array.from({ length: 3 }, (_, i) => (i < count ? "." : " "))}
    </DotWrapper>
  );
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // 유저 메시지 추가
    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 로딩 메시지 추가
    const loadingMsg: Message = { sender: "bot", loading: true };
    setMessages((prev) => [...prev, loadingMsg]);
    setLoading(true);

    try {
      const res = await sendChatMessage(input);
      const cleaned = res.replace(/```json\n?/, "").replace(/\n?```$/, "");
      const parsed = JSON.parse(cleaned);
      const result = parsed.results?.[0];

      if (!result) throw new Error("결과가 비어 있습니다.");

      const doc = result.document || "문서 없음";
      let link = result.metadata?.link || "";
      const summary = parsed.llm_summary || "";

      if (link.startsWith("http:") && !link.startsWith("http://")) {
        link = link.replace(/^http:/, "http://");
      }

      const botMsg: Message = {
        sender: "bot",
        doc,
        link,
        summary,
      };

      // 로딩 메시지 제거 후 봇 메시지 추가
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.loading);
        return [...filtered, botMsg];
      });
    } catch (err) {
      console.error("에러 발생:", err);
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.loading);
        return [
          ...filtered,
          {
            sender: "bot",
            text: "❗ 결과를 이해하지 못했어요. JSON 파싱에 실패했거나 예상치 못한 형식이에요.",
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Messages>
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user";

          // 로딩 메시지일 경우 점 애니메이션 표시
          if (msg.loading) {
            return (
              <MessageBubble key={idx} isUser={false}>
                🕐 응답 중 <LoadingDots />
              </MessageBubble>
            );
          }

          return (
            <MessageBubble key={idx} isUser={isUser}>
              {isUser ? (
                msg.text
              ) : (
                <>
                  {msg.doc && <div>📄 안내: {msg.doc}</div>}
                  {msg.summary && <div>📝 챗봇 응답: {msg.summary}</div>}
                  {msg.link && (
                    <LinkButton onClick={() => window.open(msg.link, "_blank")}>
                      링크 열기
                    </LinkButton>
                  )}
                </>
              )}
            </MessageBubble>
          );
        })}
      </Messages>

      <InputArea onSubmit={handleSubmit}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={loading}
        />
        <SendButton type="submit" disabled={loading}>
          {loading ? "전송 중..." : "전송"}
        </SendButton>
      </InputArea>
    </Container>
  );
};

export default Chatbot;
