import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    sans-serif;
`;

const MessageContainer = styled.div`
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  min-height: 100px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
`;

const UserMessage = styled.div`
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 10px;
  max-width: 70%;
  margin-left: auto;
  word-wrap: break-word;
`;

const BotMessage = styled.div`
  background: white;
  color: #333;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 10px;
  max-width: 70%;
  border: 1px solid #e0e0e0;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #007bff;
  animation: bounce 1.4s infinite both;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  &:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const StreamingChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      type: 'bot',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);

    try {
      // EventSource를 사용하여 스트리밍 연결
      const eventSource = new EventSource(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/chatbot/chat/stream?query=${encodeURIComponent(
          userMessage.content
        )}`
      );

      eventSourceRef.current = eventSource;
      setIsStreaming(true);
      setIsLoading(false);

      eventSource.onmessage = (event) => {
        const char = event.data;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content: msg.content + char }
              : msg
          )
        );
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        eventSource.close();
        setIsStreaming(false);

        // 에러 발생 시 에러 메시지 표시
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  content:
                    msg.content ||
                    '죄송합니다. 응답을 가져오는 중 오류가 발생했습니다.',
                }
              : msg
          )
        );
      };

      eventSource.onopen = () => {
        console.log('EventSource connection opened');
      };

      // 연결이 자동으로 닫힐 때 처리
      const originalClose = eventSource.close;
      eventSource.close = function () {
        setIsStreaming(false);
        originalClose.call(this);
      };
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      setIsStreaming(false);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                content:
                  '죄송합니다. 메시지를 전송하는 중 오류가 발생했습니다.',
              }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
    setIsLoading(false);
  };

  // 컴포넌트 언마운트 시 연결 정리
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <ChatContainer>
      <h1>AI 챗봇</h1>

      <MessageContainer>
        {messages.map((message) =>
          message.type === 'user' ? (
            <UserMessage key={message.id}>{message.content}</UserMessage>
          ) : (
            <BotMessage key={message.id}>
              {message.content}
              {isStreaming &&
                message.id === messages[messages.length - 1]?.id && (
                  <span style={{ opacity: 0.5 }}>▊</span>
                )}
            </BotMessage>
          )
        )}

        {isLoading && (
          <LoadingIndicator>
            <Dot />
            <Dot />
            <Dot />
            <span>응답을 기다리는 중...</span>
          </LoadingIndicator>
        )}

        <div ref={messagesEndRef} />
      </MessageContainer>

      <InputContainer>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          disabled={isLoading || isStreaming}
        />

        {isStreaming ? (
          <SendButton onClick={handleStopStreaming}>중지</SendButton>
        ) : (
          <SendButton
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            전송
          </SendButton>
        )}
      </InputContainer>
    </ChatContainer>
  );
};

export default StreamingChatComponent;
