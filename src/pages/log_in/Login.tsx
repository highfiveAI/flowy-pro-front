import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import NavbarSub from "../../components/NavbarSub";

const LoginWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(100% 100% at 50% 0%, #E3CFEE 0%, #A480B8 29.81%, #654477 51.92%, #351745 75.48%, #170222 93.75%), #2E0446;
  color: white;
  font-family: "Rethink Sans", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginFormContainer = styled.div`
  max-width: 500px;
  width: 90%;
  padding: 40px;
  text-align: center;
  border-radius: 35px;
  background: #FFF;
  box-shadow: 5px 5px 4px 0px rgba(0, 0, 0, 0.20);
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
  border: 1px solid #C6C6C7;
  border-radius: 0px;
  background: transparent;
  padding: 0px 16px;
  height: 80px;
`;

const InputLabel = styled.label`
  color: #333;
  font-family: "Rethink Sans";
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
  font-family: "Rethink Sans";
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  flex-grow: 1;
  height: 100%;
  outline: none;
`;

const ErrorMessage = styled.p`
  color: #FF4D4F;
  font-family: "Rethink Sans";
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
  background: #480B6A;
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
  border: 1px solid #480B6A;
  background: #FFF;
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
    font-family: "Rethink Sans";
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

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showError, setShowError] = React.useState(false);

  return (
    <LoginWrapper>
      <NavbarSub isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <LoginFormContainer>
        <LogoImg src="/images/flowyLogo.svg" alt="Flowy PRO Logo" />

        <InputGroup>
          <InputLabel htmlFor="username">아이디</InputLabel>
          <InputField type="text" id="username" />
        </InputGroup>

        <InputGroup>
          <InputLabel htmlFor="password">비밀번호</InputLabel>
          <InputField type="password" id="password" />
          {showError && <ErrorMessage>입력하신 비밀번호가 올바르지 않습니다.</ErrorMessage>}
        </InputGroup>

        <LoginButton>로그인</LoginButton>

        <GoogleLoginButton>
          <img src="https://www.google.com/favicon.ico" alt="Google icon" />
          구글 이메일로 로그인
        </GoogleLoginButton>

        <LinkContainer>
          <Link to="/find-id">아이디 찾기</Link>
          <span>|</span>
          <Link to="/find-password">비밀번호 찾기</Link>
          <span>|</span>
          <Link to="/signup">회원가입</Link>
        </LinkContainer>
      </LoginFormContainer>
    </LoginWrapper>
  );
};

export default Login; 