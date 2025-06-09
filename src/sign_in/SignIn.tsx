import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #b58ee0, #4a1168);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormBox = styled.div`
  background: #fff;
  padding: 3rem 2rem;
  border-radius: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #4a1168;
  margin-bottom: 2rem;

  sup {
    font-size: 0.8rem;
    font-weight: 600;
    vertical-align: super;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  font-size: 1rem;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

const LoginButton = styled.button`
  background-color: #4a1168;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.8rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #3a0d54;
  }
`;

const GoogleButton = styled.button`
  width: 25rem;
  margin-top: 1rem;
  border: 1px solid #4a1168;
  background: white;
  color: #4a1168;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.8rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }
`;

const BottomLinks = styled.div`
  margin-top: 1.5rem;
  font-size: 0.85rem;

  a {
    color: #4a1168;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// 폼 입력 데이터 타입 정의
interface FormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();

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
      navigate('/');
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/v1/users/auth/google/login`;
    // fetch('http://localhost:8000/auth/google/login', {
    //   method: 'GET',
    //   credentials: 'include', // 이게 핵심입니다
    // });
  };

  return (
    <Container>
      <FormBox>
        <Logo>
          Flowy <sup>PRO</sup>
        </Logo>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <LoginButton type="submit">로그인</LoginButton>
        </Form>
        <GoogleButton onClick={() => handleGoogleLogin()}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: '20px', marginRight: '8px' }}
          />
          구글 이메일로 로그인
        </GoogleButton>
        <BottomLinks>
          <a href="#">아이디 찾기</a> | <a href="#">비밀번호 찾기</a> |{' '}
          <a href="#">회원가입</a>
        </BottomLinks>
      </FormBox>
    </Container>
  );
};

export default SignIn;
