import React from "react";
import styled from "styled-components";
import { DndContext, closestCenter } from '@dnd-kit/core';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Main container for the whole page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative; /* PageTitle 절대 위치를 위한 기준 */
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  padding-top: 120px; /* PageTitle 높이를 고려하여 조정 */
  max-width: 1200px; /* Limit width for better readability */
  margin: 0 auto; /* Center the content */
  width: 100%;
`;

// Header for the entire dashboard page (e.g., "회의 관리")
// const DashboardHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 20px;
//   background-color: #fff;
//   border-bottom: 1px solid #eee;
// `;

const PageTitle = styled.h1`
  color: #351745;
  font-size: 2rem;
  position: absolute; /* 절대 위치 */
  top: 30px; /* Container의 상단으로부터의 거리 */
  left: 40px; /* Container의 좌측으로부터의 거리 */
  margin: 0;
  padding: 0;
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
  background: #fff; /* 배경색 다시 추가 */
  border-radius: 8px; /* 모서리 둥글게 */
  /* padding: 20px; */ /* 내부 패딩 제거 */
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 그림자 효과 다시 추가 */
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 15px; */ /* 본문과의 간격 조절 */
  background-color: #f0f0f0;
  padding: 10px 20px;
  border-radius: 0 0 0 0;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); */ /* 전체 섹션에 그림자 있으므로 제거 */
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 0;
`;

const SectionBody = styled.div`
  padding: 20px; /* 본문 내부 패딩 */
  overflow-y: auto; /* 내용이 넘치면 세로 스크롤 */
  max-height: 400px; /* 최대 높이 설정 (필요에 따라 조정) */
`;

const EditButton = styled.button`
  background-color: #480B6A;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    background-color: #480B6A;
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
  /* border: 1px dashed #ddd; */
  /* border-radius: 8px; */
`;

const SummaryContent = styled.div`
  padding: 0;
  text-align: left;
`;

const TaskListContent = styled.div`
  color: #888;
  text-align: center;
  padding: 30px;
`;

const FeedbackContent = styled.div`
  color: #888;
  text-align: center;
  padding: 30px;
`;

const SummarySection = styled.div`
  margin-bottom: 20px;
`;

const SummarySectionHeader = styled.h4`
  color: #480B6A;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SummaryListItem = styled.li`
  margin-bottom: 8px;
  color: #333;
  line-height: 1.5;
`;

const TaskGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
`;

const TaskCard = styled.div<{ isUnassigned?: boolean }>`
  border-radius: 8px;
  border: 1px solid ${props => props.isUnassigned ? 'rgba(210, 0, 0, 0.80)' : 'rgba(108, 108, 108, 0.80)'};
  background: ${props => props.isUnassigned ? 'rgba(255, 255, 255, 0.10)' : 'rgba(255, 255, 255, 0.10)'};
  padding: 15px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TaskCardTitle = styled.h4<{ isUnassigned?: boolean }>`
  font-size: 1rem;
  margin: 0;
  color: ${props => props.isUnassigned ? 'rgba(210, 0, 0, 0.80)' : '#480B6A'};
`;

const TaskCardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const TaskCardListItem = styled.li`
  margin-bottom: 8px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  line-height: 1.4;

  &::before {
    content: '•';
    color: #333;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
`;

const TaskCardDate = styled.span`
  color: #888;
  font-size: 0.85rem;
  margin-left: 10px;
  white-space: nowrap;
`;

const Dashboard: React.FC = () => {
  const dummyTasks = {
    unassigned: [
      { description: "사용자 역할별 접근 제어 UI 설계", date: "미정" },
      { description: "요약 결과 화면 시각 디자인", date: "~6/9(월)" },
    ],
    김다연: [
      { description: "전체 서비스 구조도 및 PRD 초안 정리", date: "~6/5(목)" },
    ],
    김시훈: [
      { description: "API 구조 초안 설계", date: "~6/9(월)" },
    ],
    정다희: [
      { description: "회의 업로드/요약 결과 화면 와이어프레임", date: "~6/9(월)" },
    ],
    윤지환: [
      { description: "LLM 모델 연동 및 기술 제약 정리", date: "~6/5(목)" },
    ],
    박예빈: [],
  };

  const attendees = ["김다연", "김시훈", "정다희", "윤지환", "박예빈"];

  const [tasks, setTasks] = React.useState<typeof dummyTasks>(dummyTasks);
  // 날짜 편집 상태 관리
  const [editingDate, setEditingDate] = React.useState<{col: string, idx: number} | null>(null);

  // 날짜를 '~6/9(월)' 형식으로 변환
  const formatDateToKR = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = week[date.getDay()];
    return `~${month}/${day}(${dayOfWeek})`;
  };

  // 날짜 변경 핸들러
  const handleDateChange = (col: string, idx: number, date: Date | null) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      const taskList = [...(newTasks[col as keyof typeof newTasks] as any[])];
      // 이미 선택된 날짜와 같은 날짜를 다시 선택하면 '미정' 처리
      const prevDate = parseDate(taskList[idx].date);
      if (date && prevDate && date.getFullYear() === prevDate.getFullYear() && date.getMonth() === prevDate.getMonth() && date.getDate() === prevDate.getDate()) {
        taskList[idx] = {
          ...taskList[idx],
          date: '미정',
        };
      } else if (date) {
        taskList[idx] = {
          ...taskList[idx],
          date: formatDateToKR(date),
        };
      } else {
        taskList[idx] = {
          ...taskList[idx],
          date: '미정',
        };
      }
      newTasks[col as keyof typeof newTasks] = taskList;
      return newTasks;
    });
    setEditingDate(null);
  };

  // 드래그 종료 시 처리
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const [fromColumn, fromIdx] = active.id.split('__');
    const [toColumn] = over.id.split('__');
    if (fromColumn === toColumn && active.id === over.id) return;

    // 이동할 task 정보
    const movingTask = tasks[fromColumn as keyof typeof tasks][parseInt(fromIdx, 10)];
    // 원래 위치에서 제거
    const newFrom = tasks[fromColumn as keyof typeof tasks].filter((_: any, idx: number) => idx !== parseInt(fromIdx, 10));
    // 새 위치에 추가 (맨 뒤에)
    const newTo = [...tasks[toColumn as keyof typeof tasks], movingTask];
    setTasks({
      ...tasks,
      [fromColumn]: newFrom,
      [toColumn]: newTo,
    });
  };

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr || dateStr === '미정') return null;
    // YYYY-MM-DD 또는 YYYY-MM-DD HH:mm 등 형식만 파싱
    const match = dateStr.match(/\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?/);
    if (match) {
      return new Date(match[0]);
    }
    // ~6/9(월) 형식도 파싱 시도
    const tildeMatch = dateStr.match(/~(\d{1,2})\/(\d{1,2})/);
    if (tildeMatch) {
      const now = new Date();
      const year = now.getFullYear();
      const month = parseInt(tildeMatch[1], 10) - 1;
      const day = parseInt(tildeMatch[2], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  return (
    <Container>
      <PageTitle>회의 관리</PageTitle>

      <MainContent>
        <MeetingAnalysisHeader>
          <MeetingAnalysisTitle>
            회의 분석 결과 조회
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
          <SectionBody>
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
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>회의 요약</SectionTitle>
            <EditButton>수정</EditButton>
          </SectionHeader>
          <SectionBody>
            <SummaryContent>
              <SummarySection>
                <SummarySectionHeader>[ 회의 내용 ]</SummarySectionHeader>
                <SummaryList>
                  <SummaryListItem>전체 서비스 플로우를 설명하며 핵심 기능 흐름을 "회의 업로드 → 요약 → 업무 자동 추출 → 메일 공유"로 정리함</SummaryListItem>
                  <SummaryListItem>STT(음성 인식), 요약, 역할 할당 기능을 우선 개발</SummaryListItem>
                  <SummaryListItem>LLM 처리 속도와 GPU 사용 제한 등 기술적 제한사항을 간단히 공유함</SummaryListItem>
                  <SummaryListItem>사용자 여정에 따른 첫 화면 구성안, 요약 결과 시각화 방식 제안함</SummaryListItem>
                  <SummaryListItem>논의 안됨: 사용자별 역할/권한에 따른 UI 차별화 필요 여부 (시간 부족으로 다음 회의로 이월)</SummaryListItem>
                </SummaryList>
              </SummarySection>
              <SummarySection>
                <SummarySectionHeader>[ 결정 사항 ]</SummarySectionHeader>
                <SummaryList>
                  <SummaryListItem>MVP 범위: 회의 요약, 업무 추출, 메일 전송으로 한정</SummaryListItem>
                  <SummaryListItem>'피드백' 기능: 기능 정의만 하고, 구현은 2차 버전으로 미룸</SummaryListItem>
                  <SummaryListItem>사용자 역할 구분: 관리자 / 참석자 2단계로 단순화</SummaryListItem>
                </SummaryList>
              </SummarySection>
            </SummaryContent>
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>작업 목록</SectionTitle>
            <EditButton>수정</EditButton>
          </SectionHeader>
          <SectionBody>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <TaskGridContainer>
                {["unassigned", ...attendees].map((col) => (
                  <div key={col} style={{ height: '100%' }}>
                    <TaskCard
                      isUnassigned={col === "unassigned"}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        const from = e.dataTransfer.getData('text/plain');
                        if (!from) return;
                        const [fromCol, fromIdx] = from.split('__');
                        if (fromCol === col) return;
                        const movingTask = tasks[fromCol as keyof typeof tasks][parseInt(fromIdx, 10)];
                        const newFrom = tasks[fromCol as keyof typeof tasks].filter((_: any, i: number) => i !== parseInt(fromIdx, 10));
                        const newTo = [...tasks[col as keyof typeof tasks], movingTask];
                        setTasks({
                          ...tasks,
                          [fromCol]: newFrom,
                          [col]: newTo,
                        });
                      }}
                    >
                      <TaskCardHeader>
                        <TaskCardTitle isUnassigned={col === "unassigned"}>
                          {col === "unassigned" ? "미할당 작업 목록" : col}
                        </TaskCardTitle>
                      </TaskCardHeader>
                      <TaskCardList>
                        {tasks[col as keyof typeof tasks].map((task, idx) => (
                          <div
                            key={col + "__" + idx}
                            id={col + "__" + idx}
                            style={{ cursor: 'grab' }}
                            draggable
                            onDragStart={e => {
                              e.dataTransfer.setData('text/plain', col + "__" + idx);
                            }}
                          >
                            <TaskCardListItem>
                              {task.description}
                              <TaskCardDate style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setEditingDate({col, idx}); }}>
                                {editingDate && editingDate.col === col && editingDate.idx === idx ? (
                                  <DatePicker
                                    selected={parseDate(task.date)}
                                    onChange={date => handleDateChange(col, idx, date)}
                                    onBlur={() => setEditingDate(null)}
                                    dateFormat="yyyy-MM-dd"
                                    autoFocus
                                    open
                                    onClickOutside={() => setEditingDate(null)}
                                    popperPlacement="bottom"
                                    placeholderText="날짜 선택"
                                  />
                                ) : (
                                  task.date && task.date !== '' ? task.date : '미정'
                                )}
                              </TaskCardDate>
                            </TaskCardListItem>
                          </div>
                        ))}
                      </TaskCardList>
                    </TaskCard>
                  </div>
                ))}
              </TaskGridContainer>
            </DndContext>
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>회의 피드백</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <FeedbackContent>회의 피드백 내용이 여기에 표시됩니다.</FeedbackContent>
          </SectionBody>
        </Section>
      </MainContent>
    </Container>
  );
};

export default Dashboard;
