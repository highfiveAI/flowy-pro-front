import React from "react";
import styled from "styled-components";

// Main container for the whole page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f7f7;
`;

// Main content area, takes available space
const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 1200px; /* Limit width for better readability */
  margin: 0 auto; /* Center the content */
  width: 100%;
`;

// Header for the entire dashboard page (e.g., "회의 관리")
const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

// Section for "회의 분석 결과 조회"
const MeetingAnalysisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const MeetingAnalysisTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;

  svg {
    margin-left: 8px;
  }
`;

const DropdownGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DropdownLabel = styled.label`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const Dropdown = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #333;
  appearance: none; /* Remove default arrow */
  background-image: url('''data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%20197.6L155.1%2065.7c-5.2-5.2-13.7-5.2-18.9%200L5.4%20197.6c-5.2%205.2-5.2%2013.7%200%2018.9l16.1%2016.1c5.2%205.2%2013.7%205.2%2018.9%200l118.8-118.8c5.2-5.2%2013.7-5.2%2018.9%200l118.8%20118.8c5.2%205.2%2013.7%205.2%2018.9%200l16.1-16.1c5.3-5.2%205.3-13.7%200.1-18.9z%22%2F%3E%3C%2Fsvg%3E''');
  background-repeat: no-repeat;
  background-position: right 8px top 50%;
  background-size: 12px auto;
  min-width: 150px;
`;

const Section = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 0;
`;

const EditButton = styled.button`
  background-color: #6a0dad;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #5a0c9c;
  }
`;

const BasicInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 10px;
`;

const InfoLabel = styled.div`
  font-weight: bold;
  color: #555;
`;

const InfoContent = styled.div`
  color: #333;
`;

const PlaceholderContent = styled.div`
  color: #888;
  text-align: center;
  padding: 30px;
  border: 1px dashed #ddd;
  border-radius: 8px;
`;

const Dashboard: React.FC = () => {
  return (
    <Container>
      <DashboardHeader>
        <PageTitle>회의 관리</PageTitle>
        <div></div>
      </DashboardHeader>

      <MainContent>
        <MeetingAnalysisHeader>
          <MeetingAnalysisTitle>
            회의 분석 결과 조회
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
            </svg>
          </MeetingAnalysisTitle>
          <DropdownGroup>
            <DropdownWrapper>
              <DropdownLabel htmlFor="parent-project">상위 프로젝트</DropdownLabel>
              <Dropdown id="parent-project">
                <option>InsightLog...</option>
              </Dropdown>
            </DropdownWrapper>
            <DropdownWrapper>
              <DropdownLabel htmlFor="meeting-title">회의 제목</DropdownLabel>
              <Dropdown id="meeting-title">
                <option>기능 정의 Kick-off</option>
              </Dropdown>
            </DropdownWrapper>
          </DropdownGroup>
        </MeetingAnalysisHeader>

        <Section>
          <SectionHeader>
            <SectionTitle>회의 기본 정보</SectionTitle>
          </SectionHeader>
          <BasicInfoGrid>
            <InfoLabel>회의 제목</InfoLabel>
            <InfoContent>기능 정의 Kick-off</InfoContent>

            <InfoLabel>회의 일시</InfoLabel>
            <InfoContent>2025-06-03 10:00</InfoContent>

            <InfoLabel>회의 참석자</InfoLabel>
            <InfoContent>김다연, 김시훈, 정다희, 윤지환, 박예빈</InfoContent>

            <InfoLabel>회의 안건</InfoLabel>
            <InfoContent>
              <div>전체 서비스 플로우 설명</div>
              <div>기능 우선순위 정의</div>
              <div>기술적 제한 사항 공유</div>
              <div>초기 화면 구성 및 정보 흐름</div>
            </InfoContent>
          </BasicInfoGrid>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>회의 요약</SectionTitle>
            <EditButton>수정</EditButton>
          </SectionHeader>
          <PlaceholderContent>회의 요약 내용이 여기에 표시됩니다.</PlaceholderContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>작업 목록</SectionTitle>
            <EditButton>수정</EditButton>
          </SectionHeader>
          <PlaceholderContent>작업 목록이 여기에 표시됩니다.</PlaceholderContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>회의 피드백</SectionTitle>
          </SectionHeader>
          <PlaceholderContent>회의 피드백 내용이 여기에 표시됩니다.</PlaceholderContent>
        </Section>
      </MainContent>
    </Container>
  );
};

export default Dashboard;
