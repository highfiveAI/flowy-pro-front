// src/components/Chatbot.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { sendChatMessage } from '../../api/fetchChatbot';
// import { sendChatMessage } from "../api/chat";

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
  background: ${({ isUser }) => (isUser ? '#d0ebff' : '#ffffff')};
  color: #333;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 75%;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.4;
  min-width: 0;

  display: inline-block;

  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  margin-left: ${({ isUser }) => (isUser ? 'auto' : '0')};

  text-align: ${({ isUser }) => (isUser ? 'right' : 'left')};

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  border-bottom-right-radius: ${({ isUser }) => (isUser ? '0' : '12px')};
  border-bottom-left-radius: ${({ isUser }) => (isUser ? '12px' : '0')};
`;

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input } as const;
    setMessages((prev) => [...prev, userMsg]);

    try {
      setInput('');
      const res = await sendChatMessage(input);
      const botMsg = {
        sender: 'bot',
        text: res.content,
      } as const;

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '오류가 발생했어요. 다시 시도해주세요.' },
      ]);
    }
  };

  return (
    <Container>
      <Messages>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} isUser={msg.sender === 'user'}>
            {msg.text}
          </MessageBubble>
        ))}
      </Messages>
      <InputArea onSubmit={handleSubmit}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton type="submit">전송</SendButton>
      </InputArea>
    </Container>
  );
};

export default Chatbot;
