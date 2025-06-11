import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MyPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  min-height: 100%; /* 부모 (MainContent)의 높이를 꽉 채우도록 */
  height: 100vh; /* 뷰포트 전체 높이를 사용 */
  width: 100%;
  position: relative; /* PageTitle 절대 위치를 위한 기준 */
`;

const FormArea = styled.div`
  flex-grow: 1; /* MyPageWrapper의 남은 세로 공간을 채우도록 */
  display: flex;
  flex-direction: column;
  align-items: center; /* FormContainer를 수평 중앙에 배치 */
  justify-content: center; /* FormContainer를 수직 중앙에 배치 */
  width: 100%;
`;

const PageTitle = styled.h1`
  color: #351745;
  font-size: 2rem;
  position: absolute; /* 절대 위치 */
  top: 30px; /* MyPageWrapper의 상단으로부터의 거리 */
  left: 40px; /* MyPageWrapper의 좌측으로부터의 거리 */
  margin: 0; /* 모든 마진 제거 */
  padding: 0; /* 모든 패딩 제거 */
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 내부 요소들을 수평 중앙에 배치 */
  gap: 20px;
  width: 100%;
  max-width: 500px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 0px;
  padding: 10px 15px;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  margin-bottom: 30px; /* 간격 증가 */
`;

const Label = styled.label`
  color: #555;
  font-weight: normal;
  flex-shrink: 0;
  width: 80px;
  margin-right: 15px;
`;

const Input = styled.input`
  border: none;
  font-size: 1rem;
  flex-grow: 1;
  padding: 0;
  outline: none;
`;

const Button = styled.button`
  background-color: #480b6a;
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  margin-top: 20px;

  &:hover {
    background-color: #351745;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const MyPage: React.FC = () => {
  // const [id, setId] = useState("");
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (true) {
      setError('');
      navigate('/mypage/alterInfo');
    } else {
      setError('입력하신 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <MyPageWrapper>
      <PageTitle>마이페이지</PageTitle>
      <FormArea>
        <FormContainer>
          <form
            onSubmit={handleSubmit}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <InputGroup>
              <Label htmlFor="id">아이디</Label>
              <Input type="text" id="id" value={user?.email} readOnly />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            {error && <ErrorText>{error}</ErrorText>}
            <Button type="submit">내 정보 확인하기</Button>
          </form>
        </FormContainer>
      </FormArea>
    </MyPageWrapper>
  );
};

export default MyPage;
