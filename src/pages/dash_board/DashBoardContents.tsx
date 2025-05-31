import React from "react";
import styled from "styled-components";

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const Section = styled.div`
  background: rgb(212, 212, 212);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  margin-bottom: 10px;
`;

const StatBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const StatBox = styled.div`
  background: rgb(173, 173, 173);
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
`;

const DashboardContents: React.FC = () => {
  return (
    <MainContent>
      <Section>
        <SectionTitle>전체 프로젝트</SectionTitle>
        <StatBoxContainer>
          <StatBox>
            <div>프로젝트</div>
            <div>1</div>
          </StatBox>
          <StatBox>
            <div>프로젝트</div>
            <div>2</div>
          </StatBox>
          <StatBox>
            <div>프로젝트</div>
            <div>3</div>
          </StatBox>
        </StatBoxContainer>
      </Section>

      <Section>
        <SectionTitle>전체 회의</SectionTitle>
        <StatBoxContainer>
          <StatBox>
            <div>회의</div>
            <div>1</div>
          </StatBox>
          <StatBox>
            <div>회의</div>
            <div>2</div>
          </StatBox>
          <StatBox>
            <div>회의</div>
            <div>3</div>
          </StatBox>
          <StatBox>
            <div>회의</div>
            <div>4</div>
          </StatBox>
        </StatBoxContainer>
      </Section>

      <Section>
        <SectionTitle>회의 내용</SectionTitle>
        <StatBoxContainer>
          <StatBox>내용</StatBox>
        </StatBoxContainer>
      </Section>
    </MainContent>
  );
};

export default DashboardContents;
