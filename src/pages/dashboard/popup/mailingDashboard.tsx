import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MailPreviewDashboard from "./mailpreviewDashboard";

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
  min-height: 600px;
  position: relative;
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
const SectionLabel = styled.div`
  font-size: 1.08rem;
  color: #4b2067;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 32px;
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
  gap: 14px;
  margin-bottom: 24px;
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  cursor: pointer;
`;
const Checkbox = styled.input.attrs({ type: "checkbox" })`
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
`;

interface MailingDashboardProps {
  onClose: () => void;
  summary: { section: string; items: string[] }[];
  tasks: any;
  feedback: { section: string; items: string[] }[];
  meetingInfo: {
    project: string;
    title: string;
    date: string;
    attendees: string[];
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
    customValue: "",
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
      if (name === "unassigned") {
        if (taskArr.length > 0)
          mailPreview.push({
            section: "[ 미할당 작업 목록 ]",
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
      setReceivers((r) => ({ ...r, selectedAttendees: meetingInfo.attendees }));
    } else {
      setReceivers((r) => ({ ...r, selectedAttendees: [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivers.allAttendees, meetingInfo.attendees]);

  // 개별 수신자 자동완성 후보
  const filteredCandidates = meetingInfo.attendees.filter(
    (name) =>
      receivers.customValue &&
      name.includes(receivers.customValue) &&
      !receivers.selectedCustom.includes(name)
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      receivers.customValue &&
      filteredCandidates.length > 0
    ) {
      const selectedName = filteredCandidates[0];
      setReceivers((r) => ({
        ...r,
        selectedCustom: [...r.selectedCustom, selectedName],
        customValue: "",
      }));
    }
  };

  const removeReceiver = (nameToRemove: string) => {
    setReceivers((r) => ({
      ...r,
      selectedCustom: r.selectedCustom.filter((name) => name !== nameToRemove),
    }));
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <TopRow>
          <MailIcon src="/images/sendmail.svg" alt="메일" />
          <Title>회의 분석 결과 메일 발송</Title>
        </TopRow>
        <SectionLabel>회의 기본 정보</SectionLabel>
        <InfoBox>
          <div>
            <b>상위 프로젝트:</b> {meetingInfo.project}
          </div>
          <div>
            <b>회의 제목:</b> {meetingInfo.title}
          </div>
          <div>
            <b>회의 일시:</b> {meetingInfo.date}
          </div>
          <div>
            <b>참석자:</b> {meetingInfo.attendees.join(", ")}
          </div>
          <div>
            <b>회의 안건:</b>
            <div>{meetingInfo.agenda}</div>
          </div>
        </InfoBox>
        <SectionLabel>메일 발송 항목 선택</SectionLabel>
        <CheckboxGroup>
          <CheckboxLabel>
            <Checkbox
              checked={mailItems.summary}
              onChange={(e) =>
                setMailItems((m) => ({ ...m, summary: e.target.checked }))
              }
            />{" "}
            회의 요약
          </CheckboxLabel>
          <CheckboxLabel>
            <Checkbox
              checked={mailItems.tasks}
              onChange={(e) =>
                setMailItems((m) => ({ ...m, tasks: e.target.checked }))
              }
            />{" "}
            작업 목록
          </CheckboxLabel>
          <CheckboxLabel>
            <Checkbox
              checked={mailItems.feedback}
              onChange={(e) =>
                setMailItems((m) => ({ ...m, feedback: e.target.checked }))
              }
            />{" "}
            회의 피드백
          </CheckboxLabel>
        </CheckboxGroup>

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
              <div style={{ marginLeft: 12, color: "#00b6b6", fontSize: 13 }}>
                {meetingInfo.attendees.join(", ")}
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
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
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
                      background: "#fff",
                      border: "1px solid #eee",
                      borderRadius: 6,
                      marginTop: 2,
                      zIndex: 10,
                      position: "absolute",
                    }}
                  >
                    {filteredCandidates.map((name) => (
                      <div
                        key={name}
                        style={{ padding: "4px 8px", cursor: "pointer" }}
                        onClick={() =>
                          setReceivers((r) => ({
                            ...r,
                            selectedCustom: [...r.selectedCustom, name],
                            customValue: "",
                          }))
                        }
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                )}
                <div
                  style={{ marginTop: 4, display: "flex", flexWrap: "wrap" }}
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
        <BottomButton onClick={() => setShowPreview(true)}>
          메일 발송
        </BottomButton>
        {showPreview && (
          <MailPreviewDashboard
            onClose={() => setShowPreview(false)}
            onSend={() => {
              // TODO: 실제 메일 발송 로직 구현
              alert("메일이 발송되었습니다.");
              setShowPreview(false);
              onClose();
            }}
            summary={summary}
            tasks={tasks}
            feedback={feedback}
            mailItems={mailItems}
            receivers={receivers}
            meetingInfo={meetingInfo}
          />
        )}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 24,
            right: 28,
            background: "none",
            border: "none",
            fontSize: 22,
            color: "#4B2067",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </ModalBox>
    </ModalOverlay>
  );
};

export default MailingDashboard;
