import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import type { Feedback, SummaryLog } from '../Dashboard.types';
import type { Todo } from '../../../types/project';
import { postSummaryTask } from '../../../api/fetchProject';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;
const ModalBox = styled.div`
  background: #fff;
  border-radius: 50px;
  border: 1px solid #351745;
  box-shadow: 4px 0px 4px 0px rgba(75, 13, 110, 0.21);
  padding: 48px 40px 40px 40px;
  min-width: 420px;
  max-width: 95vw;
  min-height: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TopRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  margin-top: 28px;
`;
const MailIcon = styled.img`
  width: 38px;
  height: 38px;
  margin-right: 16px;
`;
const Title = styled.h2`
  font-size: 1.8rem;
  color: #4b2067;
  font-weight: 700;
  margin: 0;
`;
const ReceiverBox = styled.div`
  width: 90%;
  max-width: 340px;
  margin: 0 auto;
  background: #fff;
  border: 2px solid #7c5ba6;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SectionLabel = styled.div`
  font-size: 1.34rem;
  color: #4b2067;
  font-weight: 700;
  margin-bottom: 18px;
  margin-top: 0;
  text-align: center;
  align-self: center;
`;
// const InfoBox = styled.div`
//   background: #ededed;
//   border-radius: 16px;
//   padding: 20px 16px;
//   min-height: 40px;
//   max-height: 120px;
//   margin-bottom: 24px;
//   overflow-y: auto;
//   color: #333;
// `;
const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 24px;
  margin-top: 24px;
  align-items: flex-start;
`;
const CheckboxLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.13rem;
  color: #4b2067;
  font-weight: 700;
  cursor: pointer;
  gap: 8px;
  width: 100%;
`;
const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 10px;
  accent-color: #4b2067;
  width: 18px;
  height: 18px;
`;
const ReceiverInput = styled.input`
  width: 65%;
  border: none;
  background: #ededed;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
  margin-left: 0;
  color: #4b2067;
`;
const SelectedReceiver = styled.span`
  display: inline-flex;
  align-items: center;
  background: #e6f7f7;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #00b6b6;
`;
const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #00b6b6;
  margin-left: 4px;
  padding: 0 4px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    color: #008080;
  }
`;
const BottomButton = styled.button`
  width: 100%;
  background: #00b6b6;
  color: #fff;
  border: none;
  border-radius: 32px;
  padding: 18px 0;
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;
const NoticeText = styled.span`
  display: block; /* 간격 주려면 block 또는 margin-top */
  margin-top: 0.5rem; /* 위 간격 */
  color: #007bff; /* 파란색 (Bootstrap 기준 파랑) */
  font-size: 0.875rem; /* 선택적으로 글씨 조금 작게 */
`;

// Tooltip 스타일 추가
// const TooltipWrapper = styled.div`
//   position: relative;
//   display: flex;
//   width: 100%;
//   justify-content: center;
// `;
// const TooltipText = styled.div<{ $show?: boolean }>`
//   visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
//   opacity: ${(props) => (props.$show ? 1 : 0)};
//   position: absolute;
//   bottom: 100%;
//   left: 50%;
//   transform: translateX(-50%);
//   background-color: rgba(78, 42, 132, 0.6);
//   color: white;
//   padding: 8px 12px;
//   border-radius: 8px;
//   font-size: 13px;
//   white-space: nowrap;
//   z-index: 10;
//   transition: opacity 0.2s;
//   pointer-events: none;
//
//   &::after {
//     content: '';
//     position: absolute;
//     top: 100%;
//     left: 50%;
//     transform: translateX(-50%);
//     border-width: 14px;
//     border-style: solid;
//     border-color: rgba(78, 42, 132, 0.5) transparent transparent transparent;
//   }
// `;

interface MailingDashboardProps {
  offModify: () => void;
  onClose: () => void;
  summary: SummaryLog | null;
  tasks: any;
  feedback: Feedback[];
  meetingInfo: {
    project: string;
    title: string;
    date: string;
    attendees: { user_id: string; user_name: string }[];
    agenda: string;
    project_users: { user_id: string; user_name: string; user_email: string }[];
    meeting_id: string;
  };
  meetingId: string | undefined;
}

type MailSection =
  | SummaryLog
  | Feedback
  | {
      section: string;
      items: string[];
    };

const MailingDashboard = ({
  offModify,
  onClose,
  summary,
  tasks,
  feedback,
  meetingInfo,
  meetingId,
}: MailingDashboardProps) => {
  console.log('meetingInfo:', meetingInfo);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mailItems, setMailItems] = useState({
    summary: false,
    tasks: false,
    feedback: false,
  });
  const [receivers, setReceivers] = useState<{
    allProject: boolean;
    allAttendees: boolean;
    custom: boolean;
    customValue: string;
    selectedAttendees: string[];
    selectedCustom: {
      user_id: string;
      user_name: string;
      user_email: string;
    }[];
  }>({
    allProject: false,
    allAttendees: false,
    custom: false,
    customValue: '',
    selectedAttendees: [],
    selectedCustom: [],
  });
  // const [showPreview, setShowPreview] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = React.useRef<HTMLDivElement>(null);

  // 메일 미리보기용 데이터
  const mailPreview: MailSection[] = [];
  if (mailItems.summary && summary) mailPreview.push(summary);
  if (mailItems.tasks && tasks) {
    // tasks는 attendees별로 되어 있으니, 각 참석자별로 섹션화
    Object.entries(tasks).forEach(([name, items]) => {
      const taskArr = items as any[];
      if (name === 'unassigned') {
        if (taskArr.length > 0)
          mailPreview.push({
            section: '[ 미할당 작업 목록 ]',
            items: taskArr.map((t: any) => t.description),
          });
      } else {
        if (taskArr.length > 0)
          mailPreview.push({
            section: `[ ${name} ]`,
            items: taskArr.map((t: any) => t.description),
          });
      }
    });
  }
  if (mailItems.feedback && feedback) mailPreview.push(...feedback);

  const isRecipientMissing =
    (!receivers.allProject && !receivers.allAttendees && !receivers.custom) ||
    (receivers.custom && receivers.selectedCustom.length === 0);

  // 회의 참석자 또는 프로젝트 참여자 전체 수신 시 자동 할당
  useEffect(() => {
    if (receivers.allProject) {
      setReceivers((r) => ({
        ...r,
        selectedCustom: meetingInfo.project_users,
      }));
    } else if (receivers.allAttendees) {
      const attendeeUsers = meetingInfo.attendees
        .map((attendee) =>
          meetingInfo.project_users.find(
            (pUser) => pUser.user_id === attendee.user_id
          )
        )
        .filter(
          (
            user
          ): user is {
            user_id: string;
            user_name: string;
            user_email: string;
          } => Boolean(user)
        );
      setReceivers((r) => ({ ...r, selectedCustom: attendeeUsers }));
    } else if (!receivers.custom) {
      setReceivers((r) => ({ ...r, selectedCustom: [] }));
    }
  }, [
    receivers.allProject,
    receivers.allAttendees,
    receivers.custom,
    meetingInfo.attendees,
    meetingInfo.project_users,
  ]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const removeReceiver = (userIdToRemove: string) => {
    setReceivers((r) => ({
      ...r,
      selectedCustom: r.selectedCustom.filter(
        (user) => user.user_id !== userIdToRemove
      ),
    }));
  };

  const potentialCandidates = meetingInfo.project_users.filter(
    (user) =>
      !receivers.selectedCustom.some(
        (selected) => selected.user_id === user.user_id
      )
  );

  const filteredCandidates = receivers.customValue
    ? potentialCandidates.filter((user) =>
        user.user_name
          .toLowerCase()
          .includes(receivers.customValue.toLowerCase())
      )
    : potentialCandidates;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      receivers.customValue &&
      filteredCandidates.length > 0
    ) {
      const selectedUser = filteredCandidates[0];
      setReceivers((r) => ({
        ...r,
        selectedCustom: [...r.selectedCustom, selectedUser],
        customValue: '',
      }));
      setIsDropdownOpen(false);
    }
  };

  // meeting_info 데이터 구조 생성 함수 (roles 추가)
  const makeMeetingInfoForMail = () => {
    return {
      info_n: receivers.selectedCustom.map((user) => ({
        name: user.user_name,
        email: user.user_email,
        roles: (tasks && tasks[user.user_name] ? tasks[user.user_name] : []).map((todo: any) => ({
          action: todo.action,
          schedule: todo.schedule ?? null,
        })),
      })),
      dt: meetingInfo.date,
      subj: meetingInfo.title,
      update_dt: new Date().toISOString(),
      meeting_id: meetingInfo.meeting_id, // meetingInfo에 meeting_id가 반드시 있어야 함
    };
  };

  // db update용 함수(구현 예정)
  const handleDbUpdate = () => {
    // db에 update 기능 구현 예정
  };

  // 메일 발송 및 조건 분기 함수
  const handleSendMail = async () => {
    // 1) 아무것도 체크 안 한 경우
    if (!receivers.allProject && !receivers.allAttendees && !receivers.custom) {
      const mailList = meetingInfo.project_users.map((user) => ({
        name: user.user_name,
        email: user.user_email,
        roles: (tasks && tasks[user.user_name] ? tasks[user.user_name] : []).map((todo: any) => ({
          action: todo.action,
          schedule: todo.schedule ?? null,
        })),
      }));
      const now = new Date().toISOString(); // update_dt
      const payload = {
        info_n: mailList,
        dt: meetingInfo.date,
        subj: meetingInfo.title,
        update_dt: now,
        meeting_id: meetingInfo.meeting_id,
      };
      console.log('백엔드로 보낼 payload:', payload);
      try {
        await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/stt/meeting/send-update-email`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        onClose(); // 성공 시 팝업 닫기
      } catch (e) {
        alert('메일 발송에 실패했습니다.');
      }
      return;
    }
    // 2) 개별 수신자 지정만 체크하고 아무도 선택 안 한 경우
    if (receivers.custom && receivers.selectedCustom.length === 0) {
      handleDbUpdate();
      onClose();
      return;
    }
    // (기타: 개별 수신자 지정 등)
    const payload = makeMeetingInfoForMail();
    console.log('백엔드로 보낼 payload:', payload);
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/stt/meeting/send-update-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      onClose();
    } catch (e) {
      alert('메일 발송에 실패했습니다.');
    }
  };

  // 받아온 assignRole(할 일 목록) insert할 때 정형화 된 형태로 변경
  const getPostPayload = () => {
    const allTodos: Todo[] = tasks
      ? (Object.values(tasks).flat() as Todo[])
      : [];

    return {
      updated_task_assign_contents: {
        assigned_todos: allTodos,
      },
    };
  };

  // 데이터 fetch 함수
  const handleSaveSummaryTasks = async () => {
    // setIsEditingSummary(false);
    if (!summary || !summary.updated_summary_contents) {
      console.error('summaryLog가 정의되지 않았습니다.');
      return;
    }

    const payload = getPostPayload();

    if (!payload?.updated_task_assign_contents) {
      console.error('작업 할당 내용이 없습니다.');
      return;
    }

    try {
      await postSummaryTask(
        meetingId,
        summary.updated_summary_contents,
        payload.updated_task_assign_contents
      );
      console.log('저장 완료');
      // 예: showToast('요약 및 작업이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      // 예: showToast('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <TopRow>
          <MailIcon src="/images/sendmail.svg" alt="메일" />
          <Title>회의 결과 수정 및 메일 발송</Title>
        </TopRow>

        <ReceiverBox>
          <SectionLabel>수신 대상자 선택</SectionLabel>
          <CheckboxGroup>
            {/* 프로젝트 참여자 전체 */}
            <CheckboxLabel>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={receivers.allProject}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setReceivers((prev) => ({
                        ...prev,
                        allProject: true,
                        allAttendees: false,
                        custom: false,
                      }));
                    } else {
                      setReceivers((prev) => ({
                        ...prev,
                        allProject: false,
                      }));
                    }
                  }}
                />
                프로젝트 참여자 전체 수신
              </div>
              {receivers.allProject && (
                <div
                  style={{
                    paddingLeft: '36px',
                    color: '#00b6b6',
                    fontSize: 13,
                    width: '100%',
                    wordBreak: 'break-all',
                  }}
                >
                  {meetingInfo.project_users
                    .map((user) => user.user_name)
                    .join(', ')}
                </div>
              )}
            </CheckboxLabel>

            {/* 회의 참석자 전체 */}
            <CheckboxLabel>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={receivers.allAttendees}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setReceivers((prev) => ({
                        ...prev,
                        allProject: false,
                        allAttendees: true,
                        custom: false,
                      }));
                    } else {
                      setReceivers((prev) => ({
                        ...prev,
                        allAttendees: false,
                      }));
                    }
                  }}
                />
                회의 참석자 전체 수신
              </div>
              {receivers.allAttendees && (
                <div
                  style={{
                    paddingLeft: '36px',
                    color: '#00b6b6',
                    fontSize: 13,
                    width: '100%',
                    wordBreak: 'break-all',
                  }}
                >
                  {meetingInfo.attendees.map((a) => a.user_name).join(', ')}
                </div>
              )}
            </CheckboxLabel>

            {/* 개별 수신자 지정 */}
            <CheckboxLabel>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={receivers.custom}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setReceivers((prev) => ({
                        ...prev,
                        allProject: false,
                        allAttendees: false,
                        custom: true,
                      }));
                    } else {
                      setReceivers((prev) => ({
                        ...prev,
                        custom: false,
                        selectedCustom: [],
                      }));
                    }
                  }}
                />
                개별 수신자 지정
              </div>
              {receivers.custom && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    paddingLeft: '36px',
                    position: 'relative',
                  }}
                  ref={dropdownContainerRef}
                >
                  <ReceiverInput
                    placeholder="이름 검색"
                    value={receivers.customValue}
                    onChange={(e) =>
                      setReceivers((prev) => ({
                        ...prev,
                        customValue: e.target.value,
                      }))
                    }
                    onKeyPress={handleKeyPress}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                  />
                  {isDropdownOpen && filteredCandidates.length > 0 && (
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #eee',
                        borderRadius: 6,
                        marginTop: 2,
                        zIndex: 10,
                        position: 'absolute',
                        width: '65%',
                        maxHeight: '150px',
                        overflowY: 'auto',
                      }}
                    >
                      {filteredCandidates.map((user) => (
                        <div
                          key={user.user_id}
                          style={{ padding: '4px 8px', cursor: 'pointer' }}
                          onMouseDown={() => {
                            setReceivers((r) => ({
                              ...r,
                              selectedCustom: [...r.selectedCustom, user],
                              customValue: '',
                            }));
                            setIsDropdownOpen(false);
                          }}
                        >
                          {user.user_name}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: 4,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, auto)',
                      gap: '4px 8px',
                      justifyContent: 'start',
                    }}
                  >
                    {receivers.selectedCustom.map((user) => (
                      <SelectedReceiver key={user.user_id}>
                        {user.user_name}
                        <RemoveButton
                          onMouseDown={() => removeReceiver(user.user_id)}
                        >
                          ×
                        </RemoveButton>
                      </SelectedReceiver>
                    ))}
                  </div>
                </div>
              )}
            </CheckboxLabel>
          </CheckboxGroup>
        </ReceiverBox>

        {/* 안내 문구 */}
        <NoticeText>
          *수신 대상자를 선택하지 않으면 메일은 전송되지 않아요*
        </NoticeText>

        {/* 버튼 + 툴팁 */}
        <BottomButton
          onClick={() => {
            const payload = makeMeetingInfoForMail();
            console.log('==== [메일로 보낼 최종 meeting_info payload] ====');
            console.log(JSON.stringify(payload, null, 2));
            onClose();
            offModify();
            handleSaveSummaryTasks();
            handleSendMail();
          }}
        >
          수정하고 메일 보내기
        </BottomButton>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 24,
            right: 28,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#4B2067',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
      </ModalBox>
    </ModalOverlay>
  );
};

export default MailingDashboard;
