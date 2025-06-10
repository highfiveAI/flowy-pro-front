import React from 'react';
import styled from 'styled-components';

const Hero = styled.section`
  width: 100vw;
  height: 100vh;
  min-width: 320px;
  min-height: 600px;
  background: radial-gradient(
      100% 100% at 50% 0%,
      #e3cfee 0%,
      #a480b8 29.81%,
      #654477 51.92%,
      #351745 75.48%,
      #170222 93.75%
    ),
    #2e0446;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Content = styled.div`
  position: relative;
  text-align: center;
  color: white;
  z-index: 10;
`;

const CenteredText = styled.h1`
  color: #fff;
  text-align: center;
  font-family: 'Rethink Sans';
  font-size: 100px;
  font-style: normal;
  font-weight: 700;
  line-height: 120px;
  letter-spacing: -2px;
  margin-top: 120px;
`;

const HeroSection: React.FC = () => {
  return (
    <Hero>
      <Content>
        <CenteredText>
          회의하세요,
          <br />
          나머진 저희가 할게요.
        </CenteredText>
      </Content>
    </Hero>
  );
};

export default HeroSection;
