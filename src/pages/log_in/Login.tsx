import React, { useState } from 'react';
import styled from 'styled-components';
import type { ChangeEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';

const LoginWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(
      100% 100% at 50% 0%,
      #e3cfee 0%,
      #a480b8 29.81%,
      #654477 51.92%,
      #351745 75.48%,
      #170222 93.75%
    ),
    #2e0446;
  color: white;
  font-family: 'Rethink Sans', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginFormContainer = styled.form`
  max-width: 500px;
  width: 90%;
  padding: 40px;
  text-align: center;
  border-radius: 35px;
  background: #fff;
  box-shadow: 5px 5px 4px 0px rgba(0, 0, 0, 0.2);
  margin-top: 80px;
`;

const LogoImg = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border: 1px solid #c6c6c7;
  border-radius: 0px;
  background: transparent;
  padding: 0px 16px;
  height: 80px;
`;

const InputLabel = styled.label`
  color: #333;
  font-family: 'Rethink Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  width: 80px;
  flex-shrink: 0;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0px;
  border-radius: 0px;
  border: none;
  background: transparent;
  font-size: 18px;
  box-sizing: border-box;
  color: black;
  font-family: 'Rethink Sans';
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  flex-grow: 1;
  height: 100%;
  outline: none;
`;

const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-family: 'Rethink Sans';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 8px;
  margin-bottom: 0px;
  text-align: left;
`;

const LoginButton = styled.button`
  display: flex;
  height: 66px;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  border-radius: 8px;
  background: #480b6a;
  color: white;
  border: none;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 30px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #35084d;
  }
`;

const GoogleLoginButton = styled.button`
  width: 100%;
  height: 66px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #480b6a;
  background: #fff;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;

  img {
    width: 20px;
    height: 20px;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 14px;
  margin-top: 20px;

  a {
    color: #717171;
    text-align: center;
    font-family: 'Rethink Sans';
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

interface FormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // 기존 에러 초기화

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.username,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        } else {
          setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
        }
        return;
      }

      const data = await response.json();

      // 로그인 성공 처리

      console.log('로그인 성공:', data);
      setUser(data.user);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/v1/users/auth/google/login`;
  };

  return (
    <LoginWrapper>
      <Navbar />
        <InputGroup>
          <InputLabel htmlFor="username">아이디</InputLabel>
          <InputField
            type="text"
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <InputLabel htmlFor="password">비밀번호</InputLabel>
          <InputField
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputGroup>

        <LoginButton type="submit">로그인</LoginButton>

        <GoogleLoginButton onClick={() => handleGoogleLogin()}>
          <img src="https://www.google.com/favicon.ico" alt="Google icon" />
          구글 이메일로 로그인
        </GoogleLoginButton>

        <LinkContainer>
          <Link to="/find-id">아이디 찾기</Link>
          <span>|</span>
          <Link to="/find-password">비밀번호 찾기</Link>
          <span>|</span>
          <Link to="/sign_up">회원가입</Link>
        </LinkContainer>
      </LoginFormContainer>
    </LoginWrapper>
  );
};

export default Login;
