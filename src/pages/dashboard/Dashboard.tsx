import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MailingDashboard from './popup/mailingDashboard';
import MailingDashboard_unedit from './popup/mailingDashboard_unedit';
import PDFPopup from './popup/PDFPopup';
import PreviewMeetingPopup from './popup/PreviewMeetingPopup';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  fetchMeetings,
  // postSummaryLog,
  fetchDraftLogs,
  fetchProjectMetaData,
} from '../../api/fetchProject';
import {
  fetchPendingPreviewMeeting,
  confirmPreviewMeeting,
  rejectPreviewMeeting,
} from '../../api/fetchPreviewMeeting';
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

import {
  AddButton,
  BasicInfoGrid,
  Container,
  EditButton,
  InfoContent,
  InfoLabel,
  InputWrapper,
  MainContent,
  MeetingAnalysisHeader,
  MeetingAnalysisTitle,
  RecommendFileItem,
  RedSection,
  Section,
  SectionBody,
  SectionHeader,
  SectionTitle,
  SpeechBubbleButton,
  StyledInput,
  SummaryContent,
  SummaryList,
  SummaryListItem,
  SummarySection,
  SummarySectionHeader,
  TaskCard,
  TaskCardDate,
  TaskCardHeader,
  TaskCardList,
  TaskCardListItem,
  TaskCardTitle,
  TaskGridContainer,
} from './Dashboard.styles';

function formatDateWithDay(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const day = week[date.getDay()];
  return `${yyyy}.${mm}.${dd}(${day})`;
}

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
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [showPDFPopup, setShowPDFPopup] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [recommendFiles, setRecommendFiles] = useState<any[]>([]);
  const [showMail_uneditPopup, setShowMail_uneditPopup] = useState(false);
  const [poRoleId, setPoRoleId] = useState<string>('');
  
  // 예정 회의 팝업 관련 state
  const [pendingPreviewMeeting, setPendingPreviewMeeting] = useState<any>(null);
  const [showPreviewMeetingPopup, setShowPreviewMeetingPopup] = useState(false);

  // 현재 사용자가 PO(회의장)인지 확인하는 함수
  const isCurrentUserPO = () => {
    // console.log('=== PO 권한 확인 ===');
    // console.log('현재 사용자 ID:', user?.id);
    // console.log('회의 참석자 수:', projectUser.length);
    // console.log('PO role_id:', poRoleId);
    
    if (!user?.id || !projectUser.length || !poRoleId) {
      // console.log('기본 조건 실패 - 권한 없음');
      return false;
    }
    
    const currentUserInMeeting = projectUser.find(pu => pu.user_id === user.id);
    // console.log('회의에서 현재 사용자 정보:', currentUserInMeeting);
    // console.log('현재 사용자의 역할 ID:', currentUserInMeeting?.role_id);
    // console.log('PO 역할 ID와 일치?', currentUserInMeeting?.role_id === poRoleId);
    // console.log('==================');
    
    return currentUserInMeeting?.role_id === poRoleId;
  };

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
        console.log('=== 대시보드 백엔드 데이터 ===');
        console.log('전체 데이터:', data);
        console.log('프로젝트 정보:', data?.project);
        console.log('회의 정보:', {
          meeting_id: data?.meeting_id,
          meeting_title: data?.meeting_title,
          meeting_agenda: data?.meeting_agenda,
          meeting_date: data?.meeting_date
        });
        console.log('회의 참석자들:', data?.meeting_users);
        console.log('요약 로그:', data?.summary_log);
        console.log('피드백 데이터:', data?.feedback);
        console.log('작업 할당:', data?.task_assign_role);
        console.log('============================');

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
              role_id: mu.role_id, // 역할 정보 추가
            })) ?? [];

          const userNames = extractedUsers.map((u: any) => u.user_name);

          setProjectUser(extractedUsers);
          setSummaryLog(data.summary_log ?? null);
          
          // 피드백 데이터 상세 로그
          if (data.feedback && Array.isArray(data.feedback)) {
            console.log('=== 피드백 상세 분석 ===');
            console.log('피드백 개수:', data.feedback.length);
            data.feedback.forEach((feedback: any, index: number) => {
              console.log(`피드백 ${index + 1}:`, {
                feedbacktype_id: feedback.feedbacktype_id,
                feedback_detail: feedback.feedback_detail,
                type: typeof feedback.feedback_detail,
                length: feedback.feedback_detail?.length || 0
              });
              
              // 회의 시간 분석 데이터 특별 확인
              if (feedback.feedbacktype_id === '0a5a835d-53d0-43a6-b821-7c36f603a071') {
                console.log('🕐 회의 시간 분석 원본 텍스트:', feedback.feedback_detail);
              }
            });
            console.log('======================');
          }
          
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

          // console.log('=== Dashboard 데이터 확인 ===');
          // console.log('전체 데이터:', data);
          // console.log('현재 사용자 ID:', user?.id);
          // console.log('회의 참석자들:', extractedUsers);
          // console.log('========================');
        }
      });
      fetchDraftLogs(meetingId).then((data) => {
        if (data) setRecommendFiles(data);
      });

      // 예정 회의 조회 (PO만)
      if (isCurrentUserPO()) {
        fetchPendingPreviewMeeting(meetingId)
          .then((data) => {
            console.log('예정 회의 조회 결과:', data);
            // 백엔드에서 배열로 반환하는 경우 처리
            if (Array.isArray(data) && data.length > 0) {
              // 첫 번째 회의만 표시 (중복 방지)
              setPendingPreviewMeeting(data[0]);
              setShowPreviewMeetingPopup(true);
            } else if (data && data.has_pending_meeting) {
              // 기존 예상 형식
              setPendingPreviewMeeting(data.pending_meeting);
              setShowPreviewMeetingPopup(true);
            }
          })
          .catch((error) => {
            console.error('예정 회의 조회 실패:', error);
          });
      }
    }
  }, [user, meetingId, poRoleId]); // poRoleId 추가 (isCurrentUserPO가 이를 사용)

  const mailMeetingInfo: meetingInfo = {
    project: project?.project_name || '',
    title: meeting?.meeting_title || '',
    date: meeting?.meeting_date || '',
    attendees: projectUser.map((user) => ({
      user_id: user.user_id,
      user_name: user.user_name,
    })),
    agenda: meeting?.meeting_agenda || '',
    project_users:
      (
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
      })) || [],
    meeting_id: meeting?.meeting_id || '',
  };

  useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (user) {
        setUser(user);
      }
      setLoading(false);
      
      // PO role_id 가져오기
      try {
        const metaData = await fetchProjectMetaData();
        // console.log('=== PO Role ID 확인 ===');
        // console.log('메타데이터:', metaData);
        // console.log('roles 배열:', metaData?.roles);
        if (metaData) {
          const poRole = metaData.roles?.find((r: any) => r.role_name === 'PO');
          // console.log('찾은 PO role:', poRole);
          if (poRole) {
            // console.log('설정할 PO role_id:', poRole.role_id);
            setPoRoleId(poRole.role_id);
          } else {
            // console.log('PO role을 찾을 수 없습니다');
          }
        }
        // console.log('==================');
      } catch (error) {
        console.error('Failed to fetch PO role ID:', error);
      }
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

  // 할 일을 리퀘스트에 형태 맞춰주는 메서드 -> 매일 대쉬보드로 이동
  // const getPostPayload = () => {
  //   const allTodos: Todo[] = assignRole ? Object.values(assignRole).flat() : [];

  //   return {
  //     updated_task_assign_contents: {
  //       assigned_todos: allTodos,
  //     },
  //   };
  // };

  const handleEditSummary = () => {
    setIsEditingSummary(true);
  };

  // 예정 회의 팝업 핸들러들
  const handleConfirmPreviewMeeting = async (confirmData: any) => {
    try {
      console.log('캘린더 등록 시작:', confirmData);
      await confirmPreviewMeeting(meetingId!, pendingPreviewMeeting.meeting_id, confirmData);
      
      // 성공 시 팝업 닫기
      setShowPreviewMeetingPopup(false);
      setPendingPreviewMeeting(null);
      alert('캘린더에 등록되었습니다!');
    } catch (error) {
      console.error('캘린더 등록 실패:', error);
      alert('캘린더 등록에 실패했습니다.');
    }
  };

  const handleRejectPreviewMeeting = async () => {
    try {
      console.log('예정 회의 거부 시작');
      await rejectPreviewMeeting(meetingId!, pendingPreviewMeeting.meeting_id);
      
      // 성공 시 팝업 닫기
      setShowPreviewMeetingPopup(false);
      setPendingPreviewMeeting(null);
      alert('예정 회의를 거부했습니다.');
    } catch (error) {
      console.error('예정 회의 거부 실패:', error);
      alert('거부 처리에 실패했습니다.');
    }
  };

  const handleClosePreviewMeetingPopup = () => {
    setShowPreviewMeetingPopup(false);
    // 데이터는 유지 (다음 진입 시 다시 팝업 표시)
  };
  // const handleSaveSummary = async () => {
  //   setIsEditingSummary(false);

  //   if (!summaryLog || !summaryLog.updated_summary_contents) {
  //     console.error('summaryLog가 정의되지 않았습니다.');
  //     return;
  //   }

  //   try {
  //     await postSummaryLog(meetingId, summaryLog.updated_summary_contents);
  //     console.log('저장 완료');
  //   } catch (error) {
  //     console.error('저장 실패:', error);
  //   }
  // };

  // const handleSaveTasks = async () => {
  //   setIsEditingTasks(false);
  //   const payload = getPostPayload();
  //   console.log(payload);
  //   try {
  //     await postAssignedTodos(meetingId, payload.updated_task_assign_contents);
  //     console.log('저장 완료');
  //   } catch (error) {
  //     console.error('저장 실패:', error);
  //   }
  // };

  // 메일로 이전
  // const handleSaveSummaryTasks = async () => {
  //   setIsEditingSummary(false);
  //   if (!summaryLog || !summaryLog.updated_summary_contents) {
  //     console.error('summaryLog가 정의되지 않았습니다.');
  //     return;
  //   }

  //   const payload = getPostPayload();

  //   if (!payload?.updated_task_assign_contents) {
  //     console.error('작업 할당 내용이 없습니다.');
  //     return;
  //   }

  //   try {
  //     await postSummaryTask(
  //       meetingId,
  //       summaryLog.updated_summary_contents,
  //       payload.updated_task_assign_contents
  //     );
  //     console.log('저장 완료');
  //     // 예: showToast('요약 및 작업이 성공적으로 저장되었습니다.');
  //   } catch (error) {
  //     console.error('저장 실패:', error);
  //     // 예: showToast('저장에 실패했습니다. 다시 시도해주세요.');
  //   }
  // };

  return (
    <Container>
      <style>
        {`
          #root > div > main > div > div > div:nth-child(4) > div.sc-jNkjTl.gyQyKm > div h3 {
            color: #351745 !important;
          }
        `}
      </style>
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
            <SpeechBubbleButton
              onClick={() => setShowPDFPopup(true)}
              style={{ marginLeft: 8 }}
            >
              <img
                src="/images/recommendfile.svg"
                alt="PDF"
                style={{
                  width: 22,
                  height: 22,
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}
              />
              PDF 다운로드
            </SpeechBubbleButton>
            &nbsp;&nbsp;&nbsp;

            {isCurrentUserPO() && (
              <SpeechBubbleButton
                onClick={() => setShowMail_uneditPopup(true)}
                style={{ marginLeft: 8 }}
              >
                <img
                  src="/images/sendmail.svg"
                  alt="메일"
                  style={{ width: 22, height: 22, marginRight: 6, verticalAlign: 'middle' }}
                />
                메일전송하기
              </SpeechBubbleButton>
            )}

            {/* <EditButton onClick={() => setShowMailPopup(true)}>
              수정하기
            </EditButton> */}
            {isCurrentUserPO() && (
              isEditingSummary ? (
                <EditButton onClick={() => setShowMailPopup(true)}>
                  저장하기
                </EditButton>
              ) : (
                <EditButton onClick={handleEditSummary}>수정하기</EditButton>
              )
            )}
          </div>
        </MeetingAnalysisHeader>

        {showMailPopup && (
          <MailingDashboard
            offModify={() => setIsEditingSummary(false)}
            onClose={() => setShowMailPopup(false)}
            summary={summaryLog}
            tasks={assignRole}
            feedback={feedback}
            meetingInfo={mailMeetingInfo}
            meetingId={meetingId}
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
        {showMail_uneditPopup && (
          <MailingDashboard_unedit
            offModify={() => {}}
            onClose={() => setShowMail_uneditPopup(false)}
            summary={summaryLog}
            tasks={assignRole}
            feedback={feedback}
            meetingInfo={mailMeetingInfo}
            meetingId={meetingId}
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

        <RedSection isEditing={isEditingSummary}>
          <Section>
            <SectionHeader>
              <SectionTitle>회의 요약</SectionTitle>
              {/* {isEditingSummary ? (
              <EditButton onClick={handleSaveSummary}>저장</EditButton>
            ) : (
              <EditButton onClick={handleEditSummary}>수정</EditButton>
            )} */}
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
                            <SummarySectionHeader>
                              {section}
                            </SummarySectionHeader>
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
              {/* {isEditingSummary ? (
              <EditButton onClick={handleSaveTasks}>저장</EditButton>
            ) : (
              <EditButton onClick={() => setIsEditingTasks(true)}>
                수정
              </EditButton>
            )} */}
            </SectionHeader>
            <SectionBody>
              {isEditingSummary ? (
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
                            if (!assignRole[fromCol] || !assignRole[col])
                              return;

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
                                    ) : String(todo.schedule).trim() ===
                                        '언급 없음' ||
                                      String(todo.schedule).trim() ===
                                        '언급없음' ||
                                      String(todo.schedule).trim() ===
                                        '미정' ? (
                                      '미정'
                                    ) : (
                                      formatDateWithDay(
                                        String(todo.schedule).trim()
                                      )
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
                                {String(todo.schedule).trim() === '언급 없음' ||
                                String(todo.schedule).trim() === '언급없음' ||
                                String(todo.schedule).trim() === '미정'
                                  ? '미정'
                                  : formatDateWithDay(
                                      String(todo.schedule).trim()
                                    )}
                              </TaskCardDate>
                            </TaskCardListItem>
                          ))}
                        </TaskCardList>
                      </TaskCard>
                    </div>
                  ))}
                </TaskGridContainer>
              )}
              {isEditingSummary && (
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
        </RedSection>

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
                          {allDetails.map((detail, idx) => {
                            // 회의 시간 분석인 경우 특별 처리
                            if (id === '0a5a835d-53d0-43a6-b821-7c36f603a071') {
                                                            // 회의 시간 분석 파싱 - 각 섹션을 별도 항목으로 반환
                              const parseTimeAnalysis = (text: string) => {
                                const items: string[] = [];
                                
                                // | 기준으로 섹션 분리
                                const sections = text.split('|').map(section => section.trim()).filter(section => section);
                                
                                sections.forEach(section => {
                                  // 총 주제 수
                                  if (section.startsWith('총 주제 수:')) {
                                    const match = section.match(/총 주제 수:\s*(\d+)/);
                                    if (match) {
                                      items.push(`<strong>총 주제 수:</strong> ${match[1]}개`);
                                    }
                                  }
                                  
                                  // 주요 주제별 소요 시간
                                  else if (section.startsWith('주요 주제별 소요 시간:')) {
                                    let content = '<strong>주요 주제별 소요 시간:</strong>\n';
                                    const timeContent = section.replace('주요 주제별 소요 시간:', '').trim();
                                    
                                    // 세미콜론으로 분리하여 각 항목 처리
                                    const timeItems = timeContent.split(';').map(item => item.trim()).filter(item => item);
                                    timeItems.forEach(item => {
                                      if (item.includes(':') && item.includes('%')) {
                                        content += `\t• ${item}\n`;
                                      }
                                    });
                                    items.push(content.trim());
                                  }
                                  
                                  // 주제 전환 빈도
                                  else if (section.startsWith('주제 전환 빈도:')) {
                                    const content = section.replace('주제 전환 빈도:', '').trim();
                                    items.push(`<strong>주제 전환 빈도:</strong> ${content}`);
                                  }
                                  
                                  // 주제별 편중
                                  else if (section.startsWith('주제별 편중:')) {
                                    const content = section.replace('주제별 편중:', '').trim();
                                    items.push(`<strong>주제별 편중:</strong> ${content}`);
                                  }
                                  
                                  // 효율 평가
                                  else if (section.startsWith('효율 평가:')) {
                                    let content = '<strong>효율 평가:</strong>\n';
                                    const evalContent = section.replace('효율 평가:', '').trim();
                                    
                                    // 문장별로 분리하여 추가
                                    const sentences = evalContent.split(/\.\s+/).filter(s => s.trim());
                                    sentences.forEach(sentence => {
                                      if (sentence.trim()) {
                                        content += `\t${sentence.trim()}${sentence.endsWith('.') ? '' : '.'}\n`;
                                      }
                                    });
                                    items.push(content.trim());
                                  }
                                });
                                
                                return items;
                              };
                              
                              const parsedItems = parseTimeAnalysis(detail);
                              
                              return (
                                <>
                                  {parsedItems.map((item, itemIdx) => (
                                    <li key={`${id}-${idx}-${itemIdx}`}>
                                      {item.includes('\n') ? (
                                        // 여러 줄인 경우 (주요 주제별 소요 시간, 효율 평가)
                                        item.split('\n').map((line, lineIdx) => (
                                          <div 
                                            key={`${id}-${idx}-${itemIdx}-${lineIdx}`} 
                                            style={{ marginBottom: '0.3rem' }}
                                            dangerouslySetInnerHTML={{ __html: line }}
                                          />
                                        ))
                                      ) : (
                                        // 한 줄인 경우 (총 주제 수, 주제 전환 빈도, 주제별 편중)
                                        <span dangerouslySetInnerHTML={{ __html: item }} />
                                      )}
                                    </li>
                                  ))}
                                </>
                              );
                            } else {
                              // 다른 피드백 타입들은 기존 로직 사용
                              const sentences = detail
                                .split(/([.!?]\s+)/)
                                .filter(sentence => sentence.trim() !== '')
                                .reduce((acc: string[], curr, index, array) => {
                                  if (index % 2 === 0) {
                                    // 문장 부분
                                    const nextPunctuation = array[index + 1] || '';
                                    acc.push((curr + nextPunctuation).trim());
                                  }
                                  return acc;
                                }, [] as string[])
                                .filter(sentence => sentence.length > 1);

                              return (
                                <li key={`${id}-${idx}`}>
                                  {sentences.length > 1 ? (
                                    sentences.map((sentence, sentenceIdx) => (
                                      <div key={`${id}-${idx}-${sentenceIdx}`} style={{ marginBottom: '0.5rem' }}>
                                        {sentence}
                                      </div>
                                    ))
                                  ) : (
                                    detail
                                  )}
                                </li>
                              );
                            }
                          })}
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
                    {file.draft_ref_reason}  &nbsp;
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

        {/* 예정 회의 팝업 */}
        {showPreviewMeetingPopup && pendingPreviewMeeting && (
          <PreviewMeetingPopup
            meeting={pendingPreviewMeeting}
            onConfirm={handleConfirmPreviewMeeting}
            onReject={handleRejectPreviewMeeting}
            onClose={handleClosePreviewMeetingPopup}
          />
        )}
      </MainContent>
    </Container>
  );
};

export default Dashboard;
