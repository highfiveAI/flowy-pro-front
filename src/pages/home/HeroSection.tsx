import React from 'react';
import styled from 'styled-components';

const Hero = styled.section`
  width: 100%;
  height: 100vh;
  background-image: url('https://your-image-url.com/hero.jpg'); // 대체 이미지 URL
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 70px; // navbar 높이 보정
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  position: relative;
  text-align: center;
  color: white;
  z-index: 10;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
`;

const Logo = styled.img`
`

const HeroSection: React.FC = () => {
  return (
    <Hero>
      <Overlay />
      <Content>
        <img src="/images/logo.png" alt="Logo" style={{ width: 400, marginBottom: '1rem' }} />
        <Title>Flowy-Pro</Title>
        <Subtitle>모든 회의들을 서포트 해주는 웹서비스</Subtitle>
      </Content>
    </Hero>
  );
};

export default HeroSection;
