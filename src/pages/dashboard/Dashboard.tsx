import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MailingDashboard from './popup/mailingDashboard';
import PDFPopup from './popup/PDFPopup';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  fetchMeetings,
  postAssignedTodos,
  postSummaryLog,
  fetchDraftLogs,
} from '../../api/fetchProject';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { checkAuth } from '../../api/fetchAuthCheck';
import type { Todo } from '../../types/project';

import type {
  Feedback,
  Meeting,
  meetingInfo,
  Project,
  ProjectUser,
  SummaryLog,
} from './Dashboard.types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  background-color: #f8f9fa;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 24px;
  padding-top: 100px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  @media (max-width: 768px) {
    padding: 16px;
    padding-top: 80px;
  }
`;

// const PageTitle = styled.h1`
//   color: #351745;
//   font-size: 2rem;
//   font-weight: 600;
//   position: absolute;
//   top: 24px;
//   left: 40px;
//   margin: 0;
//   padding: 0;
//   @media (max-width: 768px) {
//     font-size: 2rem;
//     left: 24px;
//   }
// `;

const MeetingAnalysisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const MeetingAnalysisTitle = styled.h2`
  font-size: 1.5rem;
  color: #351745;
  margin: 0;
  font-weight: 600;
`;

const Section = styled.div`
  background: #fff;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #351745;
  margin: 0;
  font-weight: 600;
`;

const SectionBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  max-height: none;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const EditButton = styled.button`
  background-color: #351745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  margin-left: 16px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #480b6a;
  }
`;

const BasicInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  @media (max-width: 768px) {
    grid-template-columns: 100px 1fr;
    gap: 12px;
  }
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #351745;
  font-size: 0.9375rem;
`;

const InfoContent = styled.div`
  color: #333;
  font-size: 0.9375rem;
  line-height: 1.5;
`;

const SummaryContent = styled.div`
  padding: 0;
`;

const SummarySection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SummarySectionHeader = styled.h4`
  color: #351745;
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SummaryListItem = styled.li`
  margin-bottom: 12px;
  color: #333;
  line-height: 1.6;
  font-size: 0.9375rem;
  padding-left: 20px;
  position: relative;

  &:before {
    content: '•';
    color: #351745;
    position: absolute;
    left: 0;
    font-size: 1.2em;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TaskGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const TaskCard = styled.div<{ $isUnassigned?: boolean }>`
  border-radius: 12px;
  border: 1px solid
    ${(props) => (props.$isUnassigned ? 'rgba(210, 0, 0, 0.3)' : '#e0e0e0')};
  background: ${(props) =>
    props.$isUnassigned ? 'rgba(210, 0, 0, 0.02)' : '#fff'};
  padding: 20px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

const TaskCardTitle = styled.h4<{ $isUnassigned?: boolean }>`
  font-size: 1.125rem;
  margin: 0;
  color: ${(props) => (props.$isUnassigned ? '#d20000' : '#351745')};
  font-weight: 600;
`;

const TaskCardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const TaskCardListItem = styled.li`
  margin-bottom: 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  line-height: 1.5;
  font-size: 0.9375rem;
  padding-left: 20px;
  position: relative;

  &:before {
    content: '•';
    color: #351745;
    position: absolute;
    left: 0;
    font-size: 1.2em;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TaskCardDate = styled.span`
  color: #666;
  font-size: 0.875rem;
  margin-left: 12px;
  white-space: nowrap;
  padding: 2px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;

const RecommendFileItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const SpeechBubbleButton = styled.button`
  position: relative;
  background: #f3eef8;
  border: none;
  border-radius: 16px;
  padding: 8px 20px 8px 18px;
  margin-left: 12px;
  font-weight: 500;
  color: #351745;
  font-size: 15px;
  box-shadow: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 2px 8px rgba(53, 23, 69, 0.08);
  }
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 10px solid #f3eef8;
  }
`;

// const RectButton = styled.button`
//   background: #f3eef8;
//   border: none;
//   border-radius: 4px;
//   padding: 8px 20px 8px 18px;
//   margin-left: 8px;
//   font-weight: 500;
//   color: #351745;
//   font-size: 15px;
//   box-shadow: none;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   transition: box-shadow 0.15s;
//   &:hover {
//     box-shadow: 0 2px 8px rgba(53, 23, 69, 0.08);
//   }
// `;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding: 0 24px;
  width: 96%;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
`;

const AddButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 12px 20px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #2563eb;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// const RoleContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 16px;
//   padding: 16px;
// `;

// const Card = styled.div<{ highlight?: boolean }>`
//   border: 1px solid ${({ highlight }) => (highlight ? 'red' : '#ccc')};
//   padding: 16px;
//   border-radius: 8px;
//   background-color: ${({ highlight }) => (highlight ? '#fff6f6' : '#fff')};
// `;

// const Title = styled.h3`
//   font-size: 16px;
//   font-weight: bold;
// `;

// const TaskItem = styled.div`
//   margin-top: 8px;
//   font-size: 14px;
// `;

const Dashboard: React.FC = () => {
  const [project, setProject] = useState<Project>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [projectUser, setProjectUser] = useState<ProjectUser[]>([]);
  const [summaryLog, setSummaryLog] = useState<SummaryLog | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [assignRole, setAssignRole] = useState<Record<string, Todo[]>>({});
  const [newTodoText, setNewTodoText] = useState('');
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user, setUser, setLoading } = useAuth();
  const [editingDate, setEditingDate] = React.useState<{
    col: string;
    idx: number;
  } | null>(null);
  const [isEditingTasks, setIsEditingTasks] = useState(false);
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [showPDFPopup, setShowPDFPopup] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [recommendFiles, setRecommendFiles] = useState<any[]>([]);

  const FEEDBACK_LABELS: Record<string, string> = {
    'e508d0b2-1bfd-42a2-9687-1ae6cd36c648': '총평',
    '6cb5e437-bc6b-4a37-a3c4-473d9c0bebe2': '불필요한 대화',
    'ab5a65c6-31a4-493b-93ff-c47e00925d17': '논의되지 않은 안건',
    '0a5a835d-53d0-43a6-b821-7c36f603a071': '회의 시간 분석',
    '73c0624b-e1af-4a2b-8e54-c1f8f7dab827': '개선 가이드',
  };

  const handleAddTodo = () => {
    const trimmed = newTodoText.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      action: trimmed,
      context: '',
      assignee: '미할당',
      schedule: '미정',
    };

    setAssignRole((prev) => ({
      ...prev,
      ['미할당']: [...(prev['미할당'] ?? []), newTodo],
    }));

    setNewTodoText('');
  };

  useEffect(() => {
    if (meetingId) {
      fetchMeetings(meetingId).then((data) => {
        if (data) {
          setProject({ ...data.project, project_users: data.project_users });

          const meeting_data: Meeting = {
            meeting_id: data.meeting_id,
            meeting_title: data.meeting_title,
            meeting_agenda: data.meeting_agenda,
            meeting_date: data.meeting_date,
          };
          setMeeting(meeting_data);

          const extractedUsers =
            data?.meeting_users?.map((mu: any) => ({
              user_id: mu.user.user_id,
              user_name: mu.user.user_name,
            })) ?? [];

          const userNames = extractedUsers.map((u: any) => u.user_name);

          setProjectUser(extractedUsers);
          setSummaryLog(data.summary_log ?? null);
          setFeedback(data.feedback ?? []);

          const grouped: Record<string, Todo[]> = {};
          userNames.forEach((name: string) => {
            grouped[name] = [];
          });
          grouped['미할당'] = [];

          if (data.task_assign_role) {
            const todos: Todo[] =
              data.task_assign_role.updated_task_assign_contents.assigned_todos;

            todos.forEach((todo) => {
              const assigneeName = todo.assignee;
              const key =
                assigneeName && userNames.includes(assigneeName)
                  ? assigneeName
                  : '미할당';
              grouped[key].push(todo);
            });
          }

          setAssignRole(grouped);

          console.log(data);
        }
      });
      fetchDraftLogs(meetingId).then((data) => {
        if (data) setRecommendFiles(data);
      });
    }
  }, [user, meetingId]);

  const mailMeetingInfo: meetingInfo = {
    project: project?.project_name || '',
    title: meeting?.meeting_title || '',
    date: meeting?.meeting_date || '',
    attendees: projectUser.map((user) => ({
      user_id: user.user_id,
      user_name: user.user_name,
    })),
    agenda: meeting?.meeting_agenda || '',
    project_users: (
      (project?.project_users ?? []) as {
        user: {
          user_id: string;
          user_name: string;
          user_email: string;
        };
      }[]
    ).map((pUser) => ({
      user_id: pUser.user.user_id,
      user_name: pUser.user.user_name,
      user_email: pUser.user.user_email,
    })),
  };

  useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (user) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);

  const handleEditSummaryItem = (
    section: string,
    index: number,
    newValue: string
  ) => {
    setSummaryLog((prev: any) => {
      const updated = { ...prev };
      if (!Array.isArray(updated.updated_summary_contents[section]))
        return prev;

      updated.updated_summary_contents = {
        ...updated.updated_summary_contents,
        [section]: updated.updated_summary_contents[section].map(
          (item: string, i: number) => (i === index ? newValue : item)
        ),
      };

      return updated;
    });
  };

  const handleDragEndTwo = (event: any) => {
    const { active, over } = event;
    if (!over || !active.id) return;

    const [fromCol, fromIdxStr] = active.id.split('__');
    const toCol = over.id.split('__')[0];

    if (fromCol === toCol && active.id === over.id) return;

    const fromIdx = parseInt(fromIdxStr, 10);
    const movingTask = assignRole[fromCol]?.[fromIdx];
    if (!movingTask) return;

    const updatedFrom = assignRole[fromCol].filter((_, i) => i !== fromIdx);
    const updatedTo = [
      ...(assignRole[toCol] ?? []),
      {
        ...movingTask,
        assignee: toCol,
      },
    ];

    setAssignRole((prev) => ({
      ...prev,
      [fromCol]: updatedFrom,
      [toCol]: updatedTo,
    }));
  };

  const isValidDate = (dateStr: any): boolean => {
    if (!dateStr || typeof dateStr !== 'string') return false;
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d.getTime());
  };

  const getPostPayload = () => {
    const allTodos: Todo[] = assignRole ? Object.values(assignRole).flat() : [];

    return {
      updated_task_assign_contents: {
        assigned_todos: allTodos,
      },
    };
  };

  const handleEditSummary = () => {
    setIsEditingSummary(true);
  };
  const handleSaveSummary = async () => {
    setIsEditingSummary(false);

    if (!summaryLog || !summaryLog.updated_summary_contents) {
      console.error('summaryLog가 정의되지 않았습니다.');
      return;
    }

    try {
      await postSummaryLog(meetingId, summaryLog.updated_summary_contents);
      console.log('저장 완료');
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  const handleSaveTasks = async () => {
    setIsEditingTasks(false);
    const payload = getPostPayload();
    console.log(payload);
    try {
      await postAssignedTodos(meetingId, payload.updated_task_assign_contents);
      console.log('저장 완료');
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  return (
    <Container>
      <MainContent>
        <MeetingAnalysisHeader>
          <MeetingAnalysisTitle>회의 분석 결과 조회</MeetingAnalysisTitle>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src="/images/recommendfile.svg"
              alt="PDF"
              style={{ width: 22, height: 22, marginRight: 6 }}
            />
            <SpeechBubbleButton
              onClick={() => setShowPDFPopup(true)}
              style={{ marginLeft: 8 }}
            >
              PDF 다운로드
            </SpeechBubbleButton>

            <EditButton onClick={() => setShowMailPopup(true)}>
              수정하기
            </EditButton>
          </div>
        </MeetingAnalysisHeader>

        {showMailPopup && (
          <MailingDashboard
            onClose={() => setShowMailPopup(false)}
            summary={summaryLog}
            tasks={assignRole}
            feedback={feedback}
            meetingInfo={mailMeetingInfo}
          />
        )}
        {showPDFPopup && (
          <PDFPopup
            onClose={() => setShowPDFPopup(false)}
            summary={summaryLog}
            tasks={assignRole}
            feedback={feedback}
            meetingInfo={mailMeetingInfo}
          />
        )}
        <Section>
          <SectionHeader>
            <SectionTitle>회의 기본 정보</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <BasicInfoGrid>
              <InfoLabel>상위 프로젝트</InfoLabel>
              <InfoContent>{project?.project_name}</InfoContent>
              <InfoLabel>회의 제목</InfoLabel>
              <InfoContent>{meeting?.meeting_title}</InfoContent>
              <InfoLabel>회의 일시</InfoLabel>
              <InfoContent>
                {meeting?.meeting_date
                  ? new Date(meeting.meeting_date)
                      .toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })
                      .replace('T', ' ')
                      .slice(0, 16)
                  : '날짜 없음'}
              </InfoContent>
              <InfoLabel>회의 참석자</InfoLabel>
              <InfoContent>
                {projectUser.length > 0
                  ? projectUser.map((user) => user.user_name).join(', ')
                  : '참석자 없음'}
              </InfoContent>

              <InfoLabel>회의 안건</InfoLabel>
              <InfoContent>{meeting?.meeting_agenda}</InfoContent>
            </BasicInfoGrid>
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>회의 요약</SectionTitle>
            {isEditingSummary ? (
              <EditButton onClick={handleSaveSummary}>저장</EditButton>
            ) : (
              <EditButton onClick={handleEditSummary}>수정</EditButton>
            )}
          </SectionHeader>
          <SectionBody>
            {summaryLog &&
            Object.keys(summaryLog.updated_summary_contents).length > 0 ? (
              <>
                {isEditingSummary ? (
                  <div className="space-y-6">
                    {Object.entries(summaryLog.updated_summary_contents).map(
                      ([key, value]) => (
                        <div key={key} className="space-y-2">
                          <h3 className="text-lg font-semibold">{key}</h3>
                          <ul className="space-y-1">
                            {(Array.isArray(value)
                              ? value
                              : [String(value)]
                            ).map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) =>
                                    handleEditSummaryItem(
                                      key,
                                      itemIndex,
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded p-2"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <SummaryContent>
                    {Object.entries(summaryLog.updated_summary_contents).map(
                      ([section, items], index) => (
                        <SummarySection key={index}>
                          <SummarySectionHeader>{section}</SummarySectionHeader>
                          <SummaryList>
                            {(Array.isArray(items)
                              ? items
                              : [String(items)]
                            ).map((item, idx) => (
                              <SummaryListItem key={idx}>
                                {item}
                              </SummaryListItem>
                            ))}
                          </SummaryList>
                        </SummarySection>
                      )
                    )}
                  </SummaryContent>
                )}
              </>
            ) : (
              <p className="text-gray-500">요약된 내용이 없습니다.</p>
            )}
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>작업 목록</SectionTitle>
            {isEditingTasks ? (
              <EditButton onClick={handleSaveTasks}>저장</EditButton>
            ) : (
              <EditButton onClick={() => setIsEditingTasks(true)}>
                수정
              </EditButton>
            )}
          </SectionHeader>
          <SectionBody>
            {isEditingTasks ? (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndTwo}
              >
                <TaskGridContainer>
                  {[
                    '미할당',
                    ...Object.keys(assignRole ?? {}).filter(
                      (key) => key !== '미할당'
                    ),
                  ].map((col) => (
                    <div key={col} style={{ height: '100%' }}>
                      <TaskCard
                        $isUnassigned={col === '미할당'}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const from = e.dataTransfer.getData('text/plain');
                          if (!from) return;

                          const [fromCol, fromIdx] = from.split('__');
                          if (fromCol === col) return;
                          if (!assignRole[fromCol] || !assignRole[col]) return;

                          const originalTask =
                            assignRole[fromCol][parseInt(fromIdx, 10)];
                          const movingTask = {
                            ...originalTask,
                            assignee: col,
                          };

                          const newFrom = assignRole[fromCol].filter(
                            (_, i) => i !== parseInt(fromIdx, 10)
                          );
                          const newTo = [...assignRole[col], movingTask];

                          setAssignRole({
                            ...assignRole,
                            [fromCol]: newFrom,
                            [col]: newTo,
                          });
                        }}
                      >
                        <TaskCardHeader>
                          <TaskCardTitle $isUnassigned={col === '미할당'}>
                            {col === '미할당' ? '미할당 작업 목록' : col}
                          </TaskCardTitle>
                        </TaskCardHeader>
                        <TaskCardList>
                          {(assignRole[col] ?? []).map((todo, idx) => (
                            <div
                              key={`${col}__${idx}`}
                              id={`${col}__${idx}`}
                              style={{ cursor: 'grab' }}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData(
                                  'text/plain',
                                  `${col}__${idx}`
                                );
                              }}
                            >
                              <TaskCardListItem>
                                {todo.action}
                                <TaskCardDate
                                  style={{ cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDate({ col, idx });
                                  }}
                                >
                                  {editingDate?.col === col &&
                                  editingDate?.idx === idx ? (
                                    <DatePicker
                                      selected={
                                        isValidDate(todo.schedule)
                                          ? new Date(todo.schedule!)
                                          : null
                                      }
                                      onChange={(date) => {
                                        const updatedTodos = [
                                          ...assignRole[col],
                                        ];
                                        updatedTodos[idx] = {
                                          ...updatedTodos[idx],
                                          schedule: date
                                            ?.toISOString()
                                            .split('T')[0],
                                        };
                                        setAssignRole((prev) => ({
                                          ...prev,
                                          [col]: updatedTodos,
                                        }));
                                      }}
                                      onBlur={() => setEditingDate(null)}
                                      dateFormat="yyyy-MM-dd"
                                      autoFocus
                                      open
                                      onClickOutside={() =>
                                        setEditingDate(null)
                                      }
                                      placeholderText="날짜 선택"
                                    />
                                  ) : todo.schedule ? (
                                    todo.schedule
                                  ) : (
                                    '미정'
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
            ) : (
              <TaskGridContainer>
                {[
                  '미할당',
                  ...Object.keys(assignRole ?? {}).filter(
                    (key) => key !== '미할당'
                  ),
                ].map((col) => (
                  <div key={col} style={{ height: '100%' }}>
                    <TaskCard $isUnassigned={col === '미할당'}>
                      <TaskCardHeader>
                        <TaskCardTitle $isUnassigned={col === '미할당'}>
                          {col === '미할당' ? '미할당 작업 목록' : col}
                        </TaskCardTitle>
                      </TaskCardHeader>

                      <TaskCardList>
                        {(assignRole[col] ?? []).map((todo, idx) => (
                          <TaskCardListItem key={`${col}__${idx}`}>
                            {todo.action}
                            <TaskCardDate>
                              {todo.schedule ?? '미정'}
                            </TaskCardDate>
                          </TaskCardListItem>
                        ))}
                      </TaskCardList>
                    </TaskCard>
                  </div>
                ))}
              </TaskGridContainer>
            )}
            {isEditingTasks && (
              <InputWrapper>
                <StyledInput
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="작업 내용을 입력하세요"
                />
                <AddButton
                  onClick={handleAddTodo}
                  disabled={!newTodoText.trim()}
                >
                  +
                </AddButton>
              </InputWrapper>
            )}
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>회의 피드백</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <SummaryContent>
              <div>
                {Object.entries(FEEDBACK_LABELS).map(([id, title]) => {
                  const matchedItems =
                    feedback?.filter((item) => item.feedbacktype_id === id) ||
                    [];

                  const allDetails = matchedItems.flatMap((item) => {
                    const details = Array.isArray(item.feedback_detail)
                      ? item.feedback_detail
                      : [item.feedback_detail];
                    return details.filter((d) => d && d.trim() !== '');
                  });

                  return (
                    <div key={id} style={{ marginBottom: '1.5rem' }}>
                      <h3>{title}</h3>
                      {allDetails.length > 0 ? (
                        <ul>
                          {allDetails.map((detail, idx) => (
                            <li key={`${id}-${idx}`}>{detail}</li>
                          ))}
                        </ul>
                      ) : (
                        <ul>
                          <li>내용이 없습니다.</li>
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </SummaryContent>
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>추천 문서</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recommendFiles.length === 0 ? (
                <li style={{ color: '#888' }}>추천 문서가 없습니다.</li>
              ) : (
                recommendFiles.map((file: any) => (
                  <RecommendFileItem key={file.draft_id}>
                    <img
                      src="/images/recommendfile.svg"
                      alt="추천문서"
                      style={{ width: 20, height: 20, marginRight: 8 }}
                    />
                    <a
                      href={file.ref_interdoc_id}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#351745',
                        textDecoration: 'underline',
                        fontWeight: 500,
                      }}
                    >
                      {file.draft_title}
                    </a>
                  </RecommendFileItem>
                ))
              )}
            </ul>
          </SectionBody>
        </Section>
      </MainContent>
    </Container>
  );
};

export default Dashboard;
