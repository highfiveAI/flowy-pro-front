import React from 'react';
import { Link } from 'react-router-dom';
import {
  GoogleIcon,
  LogoImg,
  MobileIcon,
  OptionCard,
  SelectionOptions,
  SelectionTitle,
  SignUpContainer,
  SignUpWrapper,
} from './choose_method_styles';

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
          <Link to="/sign_up/form" style={{ textDecoration: 'none' }}>
            <OptionCard $primary={true}>
              <MobileIcon src="/images/mobile-icon.svg" alt="Mobile Icon" />
              휴대폰 번호로
              <br />
              회원가입
            </OptionCard>
          </Link>
          <div
            onClick={() => handleGoogleLogin()}
            style={{ textDecoration: 'none' }}
          >
            <OptionCard $primary={false}>
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
