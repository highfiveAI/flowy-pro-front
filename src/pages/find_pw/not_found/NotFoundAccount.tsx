// NotFoundAccount.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  max-width: 360px;
  margin: 80px auto;
  text-align: center;
  padding: 32px;
  border: 1px solid #ddd;
  border-radius: 16px;
`;

const Title = styled.h2`
  margin-bottom: 16px;
`;

const Button = styled.button`
  margin-top: 24px;
  padding: 12px 24px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 8px;
  cursor: pointer;
`;

const NotFoundAccount = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Title>존재하지 않는 계정입니다</Title>
      <p>입력한 아이디 또는 이메일을 다시 확인해주세요.</p>
      <Button onClick={() => navigate('/reset-password')}>돌아가기</Button>
    </Wrapper>
  );
};

export default NotFoundAccount;
