import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MailPreviewDashboard from './mailpreviewDashboard';

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
const InfoBox = styled.div`
  background: #ededed;
  border-radius: 16px;
  padding: 20px 16px;
  min-height: 40px;
  max-height: 120px;
  margin-bottom: 24px;
  overflow-y: auto;
  color: #333;
`;
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
  align-items: center;
  font-size: 1.13rem;
  color: #4b2067;
  font-weight: 700;
  cursor: pointer;
  gap: 8px;
`;
const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 10px;
  accent-color: #4b2067;
  width: 18px;
  height: 18px;
`;
const ReceiverInput = styled.input`
  flex: 1;
  border: none;
  background: #ededed;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
  margin-left: 10px;
  color: #4b2067;
`;
const SelectedReceiver = styled.span`
  display: inline-flex;
  align-items: center;
  background: #e6f7f7;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 4px;
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
  &:hover {
    background: #009999;
  }
`;

// Tooltip 스타일 추가
const TooltipWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: center;
`;
const TooltipText = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(78, 42, 132, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 10;
  transition: opacity 0.2s;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 14px;
    border-style: solid;
    border-color: rgba(78, 42, 132, 0.5) transparent transparent transparent;
  }

  ${TooltipWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

interface MailingDashboardProps {
  onClose: () => void;
  summary?: { section: string; items: string[] }[];
  tasks: any;
  feedback: { section: string; items: string[] }[];
  meetingInfo: {
    project: string;
    title: string;
    date: string;
    attendees: { user_id: string; user_name: string }[];
    agenda: string;
  };
}

const MailingDashboard = ({
  onClose,
  summary,
  tasks,
  feedback,
  meetingInfo,
}: MailingDashboardProps) => {
  console.log('meetingInfo:', meetingInfo);
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
    selectedCustom: string[];
  }>({
    allProject: false,
    allAttendees: false,
    custom: false,
    customValue: '',
    selectedAttendees: [],
    selectedCustom: [],
  });
  const [showPreview, setShowPreview] = useState(false);

  // 메일 미리보기용 데이터
  const mailPreview: { section: string; items: string[] }[] = [];
  if (mailItems.summary && summary) mailPreview.push(...summary);
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

  // 회의 참석자 전체 수신 체크 시 자동 할당
  useEffect(() => {
    if (receivers.allAttendees) {
      setReceivers((r) => ({
        ...r,
        selectedAttendees: meetingInfo.attendees.map((a) => a.user_name),
      }));
    } else {
      setReceivers((r) => ({ ...r, selectedAttendees: [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivers.allAttendees, meetingInfo.attendees]);

  const removeReceiver = (nameToRemove: string) => {
    setReceivers((r) => ({
      ...r,
      selectedCustom: r.selectedCustom.filter((name) => name !== nameToRemove),
    }));
  };

  const filteredCandidates = meetingInfo.attendees
    .map((a) => a.user_name)
    .filter(
      (name) =>
        receivers.customValue &&
        name.includes(receivers.customValue) &&
        !receivers.selectedCustom.includes(name)
    );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      receivers.customValue &&
      filteredCandidates.length > 0
    ) {
      const selectedName = filteredCandidates[0];
      setReceivers((r) => ({
        ...r,
        selectedCustom: [...r.selectedCustom, selectedName],
        customValue: '',
      }));
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
            <CheckboxLabel>
              <Checkbox
                checked={receivers.allProject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    setReceivers((prev) => ({
                      ...prev,
                      allProject: true,
                      allAttendees: false,
                      custom: false,
                      selectedCustom: [],
                    }));
                  } else {
                    setReceivers((prev) => ({ ...prev, allProject: false }));
                  }
                }}
              />
              프로젝트 참여자 전체 수신
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                checked={receivers.allAttendees}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    setReceivers((prev) => ({
                      ...prev,
                      allProject: false,
                      allAttendees: true,
                      custom: false,
                      selectedCustom: [],
                    }));
                  } else {
                    setReceivers((prev) => ({ ...prev, allAttendees: false }));
                  }
                }}
              />
              회의 참석자 전체 수신
              {receivers.allAttendees && (
                <div style={{ marginLeft: 12, color: '#00b6b6', fontSize: 13 }}>
                  {meetingInfo.attendees.map((a) => a.user_name).join(', ')}
                </div>
              )}
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                checked={receivers.custom || receivers.selectedCustom.length > 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
              {(receivers.custom || receivers.selectedCustom.length > 0) && (
                <div
                  style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                >
                  <ReceiverInput
                    placeholder="이름 검색"
                    value={receivers.customValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setReceivers((prev) => ({
                        ...prev,
                        customValue: e.target.value,
                      }))
                    }
                    onKeyPress={handleKeyPress}
                  />
                  {receivers.customValue && filteredCandidates.length > 0 && (
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #eee',
                        borderRadius: 6,
                        marginTop: 2,
                        zIndex: 10,
                        position: 'absolute',
                      }}
                    >
                      {filteredCandidates.map((name) => (
                        <div
                          key={name}
                          style={{ padding: '4px 8px', cursor: 'pointer' }}
                          onClick={() =>
                            setReceivers((r) => ({
                              ...r,
                              selectedCustom: [...r.selectedCustom, name],
                              customValue: '',
                            }))
                          }
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap' }}
                  >
                    {receivers.selectedCustom.map((name) => (
                      <SelectedReceiver key={name}>
                        {name}
                        <RemoveButton onClick={() => removeReceiver(name)}>
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
        <TooltipWrapper>
          <BottomButton onClick={() => setShowPreview(true)}>
            수정하고 메일 보내기
          </BottomButton>
          <TooltipText>
            수신 대상자를 선택하지 않으면 메일은 전송되지 않아요
          </TooltipText>
        </TooltipWrapper>
        {showPreview && (
          <MailPreviewDashboard
            onClose={() => setShowPreview(false)}
            onSend={() => {
              // TODO: 실제 메일 발송 로직 구현
              alert('메일이 발송되었습니다.');
              setShowPreview(false);
              onClose();
            }}
            summary={summary ?? []}
            tasks={tasks}
            feedback={feedback}
            mailItems={mailItems}
            receivers={receivers}
            meetingInfo={{
              ...meetingInfo,
              agenda: Array.isArray(meetingInfo.agenda)
                ? meetingInfo.agenda
                : [meetingInfo.agenda], // string이면 배열로 감싸기
            }}
          />
        )}
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
