import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SignUpWrapper = styled.div`
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
  font-family: "Rethink Sans", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SignUpContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 35px;
  width: 90%;
  max-width: 700px;
  box-shadow: 5px 5px 4px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LogoImg = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 20px;
`;

const SelectionTitle = styled.div`
  color: #333;
  font-size: 18px;
  font-weight: 500;
  margin: 30px 0;
  position: relative;
  width: 100%;
  text-align: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1px;
    background-color: #e0e0e0;
  }

  &::before {
    left: 0;
    margin-left: 10%;
  }

  &::after {
    right: 0;
    margin-right: 10%;
  }
`;

const SelectionOptions = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
  width: 100%;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const OptionCard = styled.div<{ primary?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border-radius: 20px;
  border: ${(props) => (props.primary ? "none" : "1px solid #480B6A")};
  background: ${(props) => (props.primary ? "#480B6A" : "#FFF")};
  color: ${(props) => (props.primary ? "white" : "#480B6A")};
  font-family: "Rethink Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => (props.primary ? "none" : "#A480B8")};
  }
`;

const MobileIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
`;

const GoogleIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
`;

const ChooseMethod: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/v1/users/auth/google/login`;
  };

  return (
    <SignUpWrapper>
      <SignUpContainer>
        <LogoImg src="/images/flowyLogo.svg" alt="Flowy PRO Logo" />
        <SelectionTitle>회원가입 방식 선택</SelectionTitle>
        <SelectionOptions>
          <Link to="/sign_up/form" style={{ textDecoration: "none" }}>
            <OptionCard primary={true}>
              <MobileIcon src="/images/mobile-icon.svg" alt="Mobile Icon" />
              휴대폰 번호로
              <br />
              회원가입
            </OptionCard>
          </Link>
          <div
            onClick={() => handleGoogleLogin()}
            style={{ textDecoration: "none" }}
          >
            <OptionCard primary={false}>
              <GoogleIcon
                src="https://www.google.com/favicon.ico"
                alt="Google Icon"
              />
              구글 이메일로
              <br />
              회원가입
            </OptionCard>
          </div>
        </SelectionOptions>
      </SignUpContainer>
    </SignUpWrapper>
  );
};

export default ChooseMethod;
