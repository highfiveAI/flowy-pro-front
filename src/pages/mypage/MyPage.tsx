import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { postLogin } from '../../api/fetchMypage';
import {
  Button,
  ErrorText,
  FormArea,
  FormContainer,
  Input,
  InputGroup,
  Label,
  MyPageWrapper,
  PageTitle,
} from './MyPage.styles';

const MyPage: React.FC = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await postLogin({
      login_id: user?.login_id || '',
      password,
    });

    if (result) {
      console.log('로그인 성공:', result);
      setError('');
      navigate('/mypage/alterInfo');
    } else {
      setError('입력하신 비밀번호가 올바르지 않습니다.');
      console.log('로그인 실패');
    }
  };

  return (
    <MyPageWrapper>
      <PageTitle>마이페이지</PageTitle>
      <FormArea>
        <FormContainer>
          <InputGroup>
            <Label htmlFor="id">아이디</Label>
            <Input type="text" id="id" value={user?.login_id} readOnly />
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
          <Button onClick={() => handleLogin()}>내 정보 확인하기</Button>
        </FormContainer>
      </FormArea>
    </MyPageWrapper>
  );
};

export default MyPage;
