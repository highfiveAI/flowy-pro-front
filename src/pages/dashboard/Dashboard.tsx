import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { DndContext, closestCenter } from '@dnd-kit/core';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MailingDashboard from './popup/mailingDashboard';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  fetchMeetings,
  postAssignedTodos,
  postSummaryLog,
} from '../../api/fetchProject';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { checkAuth } from '../../api/fetchAuthCheck';
import type { Todo } from '../../types/project';
// const UNASSIGNED_LABEL = '미지정';

// Main container for the whole page
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
  font-weight: 600;
  position: absolute;
  top: 24px;
  left: 40px;
  margin: 0;
  padding: 0;
  @media (max-width: 768px) {
    font-size: 2rem;
    left: 24px;
  }
`;

// Section for "회의 분석 결과 조회"
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

// const DropdownGroup = styled.div`
//   display: flex;
//   gap: 20px;
//   @media (max-width: 768px) {
//     width: 100%;
//     flex-direction: column;
//     gap: 12px;
//   }
// `;

// const DropdownWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   min-width: 200px;
//   @media (max-width: 768px) {
//     width: 100%;
//   }
// `;

// const DropdownLabel = styled.label`
//   font-size: 0.875rem;
//   color: #666;
//   margin-bottom: 6px;
//   font-weight: 500;
// `;

// const Dropdown = styled.select`
//   padding: 10px 16px;
//   border: 1px solid #e0e0e0;
//   border-radius: 8px;
//   background-color: #fff;
//   font-size: 0.9375rem;
//   color: #333;
//   appearance: none;
//   background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23351745%22%20d%3D%22M287%20197.6L155.1%2065.7c-5.2-5.2-13.7-5.2-18.9%200L5.4%20197.6c-5.2%205.2-5.2%2013.7%200%2018.9l16.1%2016.1c5.2%205.2%2013.7%205.2%2018.9%200l118.8-118.8c5.2-5.2%2013.7-5.2%2018.9%200l118.8%20118.8c5.2%205.2%2013.7%205.2%2018.9%200l16.1-16.1c5.3-5.2%205.3-13.7%200.1-18.9z%22%2F%3E%3C%2Fsvg%3E");
//   background-repeat: no-repeat;
//   background-position: right 12px top 50%;
//   background-size: 12px auto;
//   transition: border-color 0.2s, box-shadow 0.2s;

//   &:hover {
//     border-color: #351745;
//   }

//   &:focus {
//     outline: none;
//     border-color: #351745;
//     box-shadow: 0 0 0 2px rgba(53, 23, 69, 0.1);
//   }
// `;

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
  cursor: pointer;
  font-size: 0.875rem;
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

// const PlaceholderContent = styled.div`
//   color: #888;
//   text-align: center;
//   padding: 30px;
//   /* border: 1px dashed #ddd; */
//   /* border-radius: 8px; */
// `;

const SummaryContent = styled.div`
  padding: 0;
`;

// const TaskListContent = styled.div`
//   color: #888;
//   text-align: center;
//   padding: 30px;
// `;

// const FeedbackContent = styled.div`
//   color: #666;
//   text-align: center;
//   padding: 32px;
//   font-size: 0.9375rem;
//   background-color: #f8f9fa;
//   border-radius: 8px;
//   border: 1px dashed #e0e0e0;
// `;

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

const TaskCard = styled.div<{ isUnassigned?: boolean }>`
  border-radius: 12px;
  border: 1px solid
    ${(props) => (props.isUnassigned ? 'rgba(210, 0, 0, 0.3)' : '#e0e0e0')};
  background: ${(props) =>
    props.isUnassigned ? 'rgba(210, 0, 0, 0.02)' : '#fff'};
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

const TaskCardTitle = styled.h4<{ isUnassigned?: boolean }>`
  font-size: 1.125rem;
  margin: 0;
  color: ${(props) => (props.isUnassigned ? '#d20000' : '#351745')};
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

// 말풍선 버튼 스타일
const SpeechBubbleButton = styled.button`
  position: relative;
  background: #f3eef8;
  border: none;
  border-radius: 16px;
  padding: 8px 20px 8px 18px;
  margin-left: 8px;
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

interface Project {
  project_name: string;
  project_id: string;
}

interface Meeting {
  meeting_agenda: string;
  meeting_date: string;
  meeting_id: string;
  meeting_title: string;
}

interface ProjectUser {
  user_id: string;
  user_name: string;
}

interface SummaryLog {
  summary_log_id: string;
  updated_summary_contents: Record<string, any>; // 어떤 키든 올 수 있는 JSON
}

interface Feedback {
  feedback_id: string;
  feedback_detail: Record<string, any>;
}

interface meetingInfo {
  project: string;
  title: string;
  date: string;
  attendees: { user_id: string; user_name: string }[];
  agenda: string;
}

// type TaskItem = {
//   description: string;
//   date: string;
// };

// type GroupedTaskState = Record<string, TaskItem[]>;

const Dashboard: React.FC = () => {
  const [project, setProject] = useState<Project>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [projectUser, setProjectUser] = useState<ProjectUser[]>([]);
  const [summaryLog, setSummaryLog] = useState<SummaryLog>();
  const [feedback, setFeedback] = useState<Feedback>();
  const [assignRole, setAssignRole] = useState<Record<string, Todo[]>>({});
  // const [groupedtasks, setGroupedTasks] = useState<GroupedTaskState>({});
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user, setUser, setLoading } = useAuth();

  // function convertTodosToTaskState(
  //   groupedTodos: Record<string, Todo[]>
  // ): GroupedTaskState {
  //   const result: GroupedTaskState = {};

  //   Object.entries(groupedTodos).forEach(([assignee, todos]) => {
  //     const key = assignee === '미지정' ? '미할당' : assignee;
  //     result[key] = todos.map((todo) => ({
  //       description: todo.action,
  //       date:
  //         !todo.schedule || todo.schedule === '언급 없음'
  //           ? '미정'
  //           : todo.schedule,
  //     }));
  //   });

  //   return result;
  // }

  useEffect(() => {
    if (meetingId) {
      fetchMeetings(meetingId).then((data) => {
        if (data) {
          setProject(data.project);

          const meeting_data: Meeting = {
            meeting_id: data.meeting_id,
            meeting_title: data.meeting_title,
            meeting_agenda: data.meeting_agenda,
            meeting_date: data.meeting_date,
          };
          setMeeting(meeting_data);

          // 유저 목록 추출
          const extractedUsers =
            data?.meeting_users?.map((mu: any) => ({
              user_id: mu.user.user_id,
              user_name: mu.user.user_name,
            })) ?? [];

          setProjectUser(extractedUsers);

          setSummaryLog(data.summary_log);
          setFeedback(data.feedback);

          if (data.task_assign_role) {
            const todos: Todo[] =
              data.task_assign_role.updated_task_assign_contents.assigned_todos;

            // 여기서 바로 user_name 배열 추출 (projectUser state를 기다릴 필요 없음)
            const userNames = extractedUsers.map((u: any) => u.user_name);

            const grouped = todos.reduce<Record<string, Todo[]>>(
              (acc, todo) => {
                const assigneeName = todo.assignee;

                const key =
                  assigneeName && userNames.includes(assigneeName)
                    ? assigneeName
                    : '미할당';

                if (!acc[key]) {
                  acc[key] = [];
                }

                acc[key].push(todo);
                return acc;
              },
              {}
            );

            // 참여자 이름 키 누락 방지
            userNames.forEach((name: any) => {
              if (!grouped[name]) {
                grouped[name] = [];
              }
            });

            // '미할당' 키 누락 방지
            if (!grouped['미할당']) {
              grouped['미할당'] = [];
            }

            setAssignRole(grouped);
          }

          console.log(data);
        }
      });
    }
  }, [user, meetingId]);

  // useEffect(() => {
  //   if (assignRole) {
  //     const converted = convertTodosToTaskState(assignRole);
  //     setGroupedTasks(converted);
  //   }
  // }, [assignRole]);

  const mailMeetingInfo: meetingInfo = {
    project: project?.project_name || '',
    title: meeting?.meeting_title || '',
    date: meeting?.meeting_date || '',
    attendees: projectUser.map((user) => ({
      user_id: user.user_id,
      user_name: user.user_name,
    })),
    agenda: meeting?.meeting_agenda || '',
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

  // const dummyTasks = {
  //   unassigned: [
  //     { description: '사용자 역할별 접근 제어 UI 설계', date: '미정' },
  //     { description: '요약 결과 화면 시각 디자인', date: '~6/9(월)' },
  //   ],
  //   김다연: [
  //     { description: '전체 서비스 구조도 및 PRD 초안 정리', date: '~6/5(목)' },
  //   ],
  //   김시훈: [{ description: 'API 구조 초안 설계', date: '~6/9(월)' }],
  //   정다희: [
  //     {
  //       description: '회의 업로드/요약 결과 화면 와이어프레임',
  //       date: '~6/9(월)',
  //     },
  //   ],
  //   윤지환: [
  //     { description: 'LLM 모델 연동 및 기술 제약 정리', date: '~6/5(목)' },
  //   ],
  //   박예빈: [],
  // };

  // const attendees = ['김다연', '김시훈', '정다희', '윤지환', '박예빈'];
  // const attendees = React.useMemo(
  //   () => Object.keys(groupedtasks).filter((k) => k !== '미할당'),
  //   [groupedtasks]
  // );
  // const attendees = Object.keys(groupedtasks).filter(
  //   (name) => name !== '미할당'
  // );

  // const [tasks, setTasks] = React.useState<typeof dummyTasks>(dummyTasks);
  // 날짜 편집 상태 관리
  const [editingDate, setEditingDate] = React.useState<{
    col: string;
    idx: number;
  } | null>(null);
  // 작업 목록 수정 모드 state
  const [isEditingTasks, setIsEditingTasks] = useState(false);
  const [showMailPopup, setShowMailPopup] = useState(false);

  // 회의 요약 state (여러 섹션, 리스트)
  const [summary, setSummary] = useState([
    {
      section: '[ 회의 내용 ]',
      items: [
        "전체 서비스 플로우를 설명하며 핵심 기능 흐름을 '회의 업로드 → 요약 → 업무 자동 추출 → 메일 공유'로 정리함",
        'STT(음성 인식), 요약, 역할 할당 기능을 우선 개발',
        'LLM 처리 속도와 GPU 사용 제한 등 기술적 제한사항을 간단히 공유함',
        '사용자 여정에 따른 첫 화면 구성안, 요약 결과 시각화 방식 제안함',
        '논의 안됨: 사용자별 역할/권한에 따른 UI 차별화 필요 여부 (시간 부족으로 다음 회의로 이월)',
      ],
    },
    {
      section: '[ 결정 사항 ]',
      items: [
        'MVP 범위: 회의 요약, 업무 추출, 메일 전송으로 한정',
        "'피드백' 기능: 기능 정의만 하고, 구현은 2차 버전으로 미룸",
        '사용자 역할 구분: 관리자 / 참석자 2단계로 단순화',
      ],
    },
  ]);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editSummaryText, setEditSummaryText] = useState('');

  // summary 배열을 textarea용 문자열로 변환
  const summaryToText = (summaryArr: typeof summary) => {
    return summaryArr
      .map(
        (sec) =>
          `${sec.section}\n${sec.items.map((item) => `- ${item}`).join('\n')}`
      )
      .join('\n\n');
  };
  // textarea 문자열을 summary 배열로 파싱
  const textToSummary = (text: string) => {
    const lines = text.split(/\r?\n/);
    const result: { section: string; items: string[] }[] = [];

    let currentSection: string | null = null;
    let currentItems: string[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('[')) {
        if (currentSection !== null) {
          result.push({ section: currentSection, items: currentItems });
        }
        currentSection = trimmedLine;
        currentItems = [];
      } else if (trimmedLine.startsWith('- ')) {
        currentItems.push(trimmedLine.slice(2));
      } else if (trimmedLine === '') {
        // 빈 줄은 무시
      } else {
        // 기타 텍스트 무시
      }
    });

    // 마지막 섹션 저장
    if (currentSection !== null) {
      result.push({ section: currentSection, items: currentItems });
    }

    return result;
  };

  // 날짜를 '~6/9(월)' 형식으로 변환
  // const formatDateToKR = (date: Date) => {
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
  //   const week = ['일', '월', '화', '수', '목', '금', '토'];
  //   const dayOfWeek = week[date.getDay()];
  //   return `~${month}/${day}(${dayOfWeek})`;
  // };

  // 날짜 변경 핸들러
  // const handleDateChange = (col: string, idx: number, date: Date | null) => {
  //   setTasks((prev) => {
  //     const newTasks = { ...prev };
  //     const taskList = [...(newTasks[col as keyof typeof newTasks] as any[])];

  //     const prevDate = parseDate(taskList[idx].date);
  //     if (
  //       date &&
  //       prevDate &&
  //       date.getFullYear() === prevDate.getFullYear() &&
  //       date.getMonth() === prevDate.getMonth() &&
  //       date.getDate() === prevDate.getDate()
  //     ) {
  //       taskList[idx] = {
  //         ...taskList[idx],
  //         date: '미정',
  //       };
  //     } else if (date) {
  //       taskList[idx] = {
  //         ...taskList[idx],
  //         date: formatDateToKR(date),
  //       };
  //     } else {
  //       taskList[idx] = {
  //         ...taskList[idx],
  //         date: '미정',
  //       };
  //     }

  //     // 이 부분만 수정
  //     (newTasks as Record<string, any[]>)[col] = taskList;

  //     return newTasks;
  //   });
  //   setEditingDate(null);
  // };

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

  // 드래그 종료 시 처리
  // const handleDragEnd = (event: any) => {
  //   const { active, over } = event;
  //   if (!over) return;
  //   const [fromColumn, fromIdx] = active.id.split('__');
  //   const [toColumn] = over.id.split('__');
  //   if (fromColumn === toColumn && active.id === over.id) return;

  //   // 이동할 task 정보
  //   const movingTask =
  //     tasks[fromColumn as keyof typeof tasks][parseInt(fromIdx, 10)];
  //   // 원래 위치에서 제거
  //   const newFrom = tasks[fromColumn as keyof typeof tasks].filter(
  //     (_: any, idx: number) => idx !== parseInt(fromIdx, 10)
  //   );
  //   // 새 위치에 추가 (맨 뒤에)
  //   const newTo = [...tasks[toColumn as keyof typeof tasks], movingTask];
  //   setTasks({
  //     ...tasks,
  //     [fromColumn]: newFrom,
  //     [toColumn]: newTo,
  //   });
  // };

  // 드래그 종료 시 처리 더미 x 버전
  const handleDragEndTwo = (event: any) => {
    const { active, over } = event;
    if (!over || !active.id) return;

    const [fromCol, fromIdxStr] = active.id.split('__');
    const toCol = over.id.split('__')[0];

    // 같은 컬럼 내 이동 + 같은 위치이면 무시
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

  // const parseDate = (dateStr: string): Date | null => {
  //   if (!dateStr || dateStr === '미정') return null;
  //   // YYYY-MM-DD 또는 YYYY-MM-DD HH:mm 등 형식만 파싱
  //   const match = dateStr.match(/\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?/);
  //   if (match) {
  //     return new Date(match[0]);
  //   }
  //   // ~6/9(월) 형식도 파싱 시도
  //   const tildeMatch = dateStr.match(/~(\d{1,2})\/(\d{1,2})/);
  //   if (tildeMatch) {
  //     const now = new Date();
  //     const year = now.getFullYear();
  //     const month = parseInt(tildeMatch[1], 10) - 1;
  //     const day = parseInt(tildeMatch[2], 10);
  //     return new Date(year, month, day);
  //   }
  //   return null;
  // };

  // 날짜에 유효한 데이터가 들어가는지
  const isValidDate = (dateStr: any): boolean => {
    if (!dateStr || typeof dateStr !== 'string') return false;
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d.getTime());
  };

  // 추천 문서 임시 데이터
  const recommendFiles = [
    {
      name: '서비스 기획서.pdf',
      url: 'https://example.com/service-plan.pdf',
    },
    {
      name: 'API 명세 초안.pdf',
      url: 'https://example.com/api-draft.pdf',
    },
  ];
  const getPostPayload = () => {
    const allTodos: Todo[] = assignRole ? Object.values(assignRole).flat() : [];

    return {
      updated_task_assign_contents: {
        assigned_todos: allTodos,
      },
    };
  };

  // 수정 버튼 클릭
  const handleEditSummary = () => {
    setEditSummaryText(summaryToText(summary));
    setIsEditingSummary(true);
  };
  // 저장 버튼 클릭
  const handleSaveSummary = async () => {
    setSummary(textToSummary(editSummaryText));
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

  // 작업 목록 저장 핸들러
  const handleSaveTasks = async () => {
    setIsEditingTasks(false);
    const payload = getPostPayload(); // { updated_task_assign_contents: { assigned_todos: Todo[] } }
    console.log(payload);
    try {
      await postAssignedTodos(meetingId, payload.updated_task_assign_contents);
      console.log('저장 완료');
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  // 피드백 메일페이지로 넘길 떼 반환해주는 함수
  const transformedFeedback = feedback?.feedback_detail
    ? Object.entries(feedback.feedback_detail).map(([key, value]) => ({
        section: key,
        items: Array.isArray(value)
          ? value
          : typeof value === 'string'
          ? [value]
          : [JSON.stringify(value, null, 2)],
      }))
    : [];
  // const orderedAssignRole = [
  //   '미할당',
  //   ...Object.keys(assignRole ?? {}).filter((key) => key !== '미할당'),
  // ];

  // 회의 피드백 데이터(더미)
  // const feedbackdummy = [
  //   {
  //     section: '[ 불필요한 대화 ]',
  //     items: [
  //       '회의 중 10:42~10:46 사이, 참석자 간 점심 메뉴에 대한 대화가 약 4분간 이어짐.',
  //       '회의 흐름에 큰 영향은 없었으나 집중력이 일시적으로 저하됨.',
  //     ],
  //   },
  //   {
  //     section: '[ 누락된 논의 발생 ]',
  //     items: [
  //       '사용자 권한에 따른 UI/UX 차별화 여부에 대한 논의는 회의 시간 부족으로 다루지 못함. 다음 회의에서 우선 논의할 필요 있음.',
  //     ],
  //   },
  //   {
  //     section: '[ 작업 담당자 미정 ]',
  //     items: [
  //       '주요 기능에 대한 역할 분담은 대체로 완료되었으나, 디자인 시각화 및 역할별 UI 설계 관련 작업은 담당자가 정해지지 않음.',
  //     ],
  //   },
  //   {
  //     section: '[ 회의 시간 분석 ]',
  //     items: [
  //       '회의는 약 1시간 진행되었으며, 실질적인 논의는 약 50분 정도였음.',
  //       '일부 논의에서 발언 중복이 있었고, 후반으로 갈수록 집중도가 낮아지는 경향이 나타남.',
  //     ],
  //   },
  // ];

  return (
    <Container>
      <PageTitle>회의 관리</PageTitle>

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
              src="/images/sendmail.svg"
              alt="메일"
              style={{ width: 28, height: 28 }}
            />
            <SpeechBubbleButton onClick={() => setShowMailPopup(true)}>
              클릭 한 번으로 메일 보내기
            </SpeechBubbleButton>
          </div>
        </MeetingAnalysisHeader>

        {showMailPopup && (
          <MailingDashboard
            onClose={() => setShowMailPopup(false)}
            summary={
              summaryLog?.updated_summary_contents?.structured_summary ?? []
            }
            tasks={assignRole}
            feedback={transformedFeedback}
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
                      .toISOString()
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
            {summaryLog && (
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
            )}
          </SectionBody>

          {/* <SectionBody>
            {summaryLog && (
              <div className="space-y-4">
                {Object.entries(summaryLog.updated_summary_contents).map(
                  ([key, value]) => (
                    <div key={key}>
                      <h3 className="text-lg font-semibold mb-1">{key}</h3>
                      {Array.isArray(value) ? (
                        <ul className="list-disc pl-5">
                          {value.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <pre className="bg-gray-100 p-2 rounded">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      )}
                    </div>
                  )
                )}
              </div>
            )} */}

          {/* {isEditingSummary ? (
              <textarea
                value={editSummaryText}
                onChange={(e) => setEditSummaryText(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: 200,
                  fontSize: "1rem",
                  color: "#333",
                  border: "1px solid #e0e0e0",
                  borderRadius: 4,
                  padding: 12,
                  fontFamily: "inherit",
                  marginBottom: 12,
                }}
              />
            ) : (
              <SummaryContent>
                {summary.map((sec, i) => (
                  <SummarySection key={i}>
                    <SummarySectionHeader>{sec.section}</SummarySectionHeader>
                    <SummaryList>
                      {sec.items.map((item, j) => (
                        <SummaryListItem key={j}>{item}</SummaryListItem>
                      ))}
                    </SummaryList>
                  </SummarySection>
                ))}
              </SummaryContent>
            )} */}
          {/* </SectionBody> */}
        </Section>

        {/* <Section>
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
                onDragEnd={handleDragEnd}
              >
                <TaskGridContainer>
                  {['unassigned', ...attendees].map((col) => (
                    <div key={col} style={{ height: '100%' }}>
                      <TaskCard
                        isUnassigned={col === 'unassigned'}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const from = e.dataTransfer.getData('text/plain');
                          if (!from) return;
                          const [fromCol, fromIdx] = from.split('__');
                          if (fromCol === col) return;
                          const movingTask =
                            tasks[fromCol as keyof typeof tasks][
                              parseInt(fromIdx, 10)
                            ];
                          const newFrom = tasks[
                            fromCol as keyof typeof tasks
                          ].filter(
                            (_: any, i: number) => i !== parseInt(fromIdx, 10)
                          );
                          const newTo = [
                            ...tasks[col as keyof typeof tasks],
                            movingTask,
                          ];
                          setTasks({
                            ...tasks,
                            [fromCol]: newFrom,
                            [col]: newTo,
                          });
                        }}
                      >
                        <TaskCardHeader>
                          <TaskCardTitle isUnassigned={col === 'unassigned'}>
                            {col === 'unassigned' ? '미할당 작업 목록' : col}
                          </TaskCardTitle>
                        </TaskCardHeader>
                        <TaskCardList>
                          {tasks[col as keyof typeof tasks].map((task, idx) => (
                            <div
                              key={col + '__' + idx}
                              id={col + '__' + idx}
                              style={{ cursor: 'grab' }}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData(
                                  'text/plain',
                                  col + '__' + idx
                                );
                              }}
                            >
                              <TaskCardListItem>
                                {task.description}
                                <TaskCardDate
                                  style={{ cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDate({ col, idx });
                                  }}
                                >
                                  {editingDate &&
                                  editingDate.col === col &&
                                  editingDate.idx === idx ? (
                                    <DatePicker
                                      selected={parseDate(task.date)}
                                      onChange={(date) =>
                                        handleDateChange(col, idx, date)
                                      }
                                      onBlur={() => setEditingDate(null)}
                                      dateFormat="yyyy-MM-dd"
                                      autoFocus
                                      open
                                      onClickOutside={() =>
                                        setEditingDate(null)
                                      }
                                      popperPlacement="bottom"
                                      placeholderText="날짜 선택"
                                    />
                                  ) : task.date && task.date !== '' ? (
                                    task.date
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
                {['unassigned', ...attendees].map((col) => (
                  <div key={col} style={{ height: '100%' }}>
                    <TaskCard isUnassigned={col === 'unassigned'}>
                      <TaskCardHeader>
                        <TaskCardTitle isUnassigned={col === 'unassigned'}>
                          {col === 'unassigned' ? '미할당 작업 목록' : col}
                        </TaskCardTitle>
                      </TaskCardHeader>
                      <TaskCardList>
                        {tasks[col as keyof typeof tasks].map((task, idx) => (
                          <TaskCardListItem key={col + '__' + idx}>
                            {task.description}
                            <TaskCardDate>{task.date}</TaskCardDate>
                          </TaskCardListItem>
                        ))}
                      </TaskCardList>
                    </TaskCard>
                  </div>
                ))}
              </TaskGridContainer>
            )}
          </SectionBody>
        </Section> */}

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
                        isUnassigned={col === '미할당'}
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
                          <TaskCardTitle isUnassigned={col === '미할당'}>
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
                    <TaskCard isUnassigned={col === '미할당'}>
                      <TaskCardHeader>
                        <TaskCardTitle isUnassigned={col === '미할당'}>
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
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>회의 피드백</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <SummaryContent>
              {/* <SummarySection>
                <SummarySectionHeader>[ 불필요한 대화 ]</SummarySectionHeader>
                <SummaryList>
                  <SummaryListItem>
                    회의 중 <b>10:42~10:46</b> 사이, 참석자 간 점심 메뉴에 대한
                    대화가 약 4분간 이어짐.
                  </SummaryListItem>
                  <SummaryListItem>
                    회의 흐름에 큰 영향은 없었으나 집중력이 일시적으로 저하됨.
                  </SummaryListItem>
                </SummaryList>
              </SummarySection>
              <SummarySection>
                <SummarySectionHeader>
                  [ 누락된 논의 발생 ]
                </SummarySectionHeader>
                <SummaryList>
                  <SummaryListItem>
                    사용자 권한에 따른 UI/UX 차별화 여부에 대한 논의는 회의 시간
                    부족으로 다루지 못함. 다음 회의에서 우선 논의할 필요 있음.
                  </SummaryListItem>
                </SummaryList>
              </SummarySection>
              <SummarySection>
                <SummarySectionHeader>
                  [ 작업 담당자 미정 ]
                </SummarySectionHeader>
                <SummaryList>
                  <SummaryListItem>
                    주요 기능에 대한 역할 분담은 대체로 완료되었으나, 디자인
                    시각화 및 역할별 UI 설계 관련 작업은 담당자가 정해지지 않음.
                  </SummaryListItem>
                </SummaryList>
              </SummarySection>
              <SummarySection>
                <SummarySectionHeader>[ 회의 시간 분석 ]</SummarySectionHeader>
                <SummaryList>
                  <SummaryListItem>
                    회의는 약 1시간 진행되었으며, 실질적인 논의는 약 50분
                    정도였음.
                  </SummaryListItem>
                  <SummaryListItem>
                    일부 논의에서 발언 중복이 있었고, 후반으로 갈수록 집중도가
                    낮아지는 경향이 나타남.
                  </SummaryListItem>
                </SummaryList>
              </SummarySection> */}
              {feedback && (
                <div className="space-y-4">
                  {/* 문자열로 바로 올 경우 */}
                  {typeof feedback === 'string' ? (
                    <p>{feedback}</p>
                  ) : Array.isArray(feedback) ? (
                    // feedback 자체가 배열일 경우
                    <ul className="list-disc pl-5">
                      {feedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : typeof feedback === 'object' &&
                    feedback.feedback_detail &&
                    typeof feedback.feedback_detail === 'object' ? (
                    Array.isArray(feedback.feedback_detail) ? (
                      // feedback_detail이 배열일 경우
                      <ul className="list-disc pl-5">
                        {feedback.feedback_detail.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      // feedback_detail이 객체일 경우
                      Object.entries(feedback.feedback_detail).map(
                        ([key, value]) => (
                          <div key={key}>
                            <h3 className="text-lg font-semibold mb-1">
                              {key}
                            </h3>
                            {Array.isArray(value) ? (
                              <ul className="list-disc pl-5">
                                {value.map((item, index) => (
                                  <li key={index}>
                                    {typeof item === 'object'
                                      ? JSON.stringify(item)
                                      : item}
                                  </li>
                                ))}
                              </ul>
                            ) : typeof value === 'string' ? (
                              <p>{value}</p>
                            ) : (
                              <pre className="bg-gray-100 p-2 rounded">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            )}
                          </div>
                        )
                      )
                    )
                  ) : null}
                </div>
              )}
            </SummaryContent>
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>추천 문서</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recommendFiles.map((file) => (
                <RecommendFileItem key={file.name}>
                  <img
                    src="/images/recommendfile.svg"
                    alt="추천문서"
                    style={{ width: 20, height: 20, marginRight: 8 }}
                  />
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#351745',
                      textDecoration: 'underline',
                      fontWeight: 500,
                    }}
                  >
                    {file.name}
                  </a>
                </RecommendFileItem>
              ))}
            </ul>
          </SectionBody>
        </Section>
      </MainContent>
    </Container>
  );
};

export default Dashboard;
