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

const HeroSection: React.FC = () => {
  return (
    <Hero>
      <Overlay />
      <Content>
        <img src="/assets/react.svg" alt="Logo" style={{ width: 80, marginBottom: '1rem' }} />
        <Title>A Great Place for Your Wedding</Title>
        <Subtitle>사람들의 결혼이야기</Subtitle>
      </Content>
    </Hero>
  );
};

export default HeroSection;
