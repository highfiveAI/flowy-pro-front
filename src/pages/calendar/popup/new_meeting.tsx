import React, { useState } from "react";
import styled from "styled-components";
import { CloseButton, FormGroup, StyledLabel, StyledInput, StyledTextarea, CreateProjectButton, PopupOverlay, PopupContent } from "../../insert_conference_info/conference_popup/EditProjectPopup.styles";

const AddAttendeeButton = styled.button`
  background: #771277;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 16px;
  margin-left: 8px;
`;
const AttendeeRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;
const RemoveAttendeeButton = styled.button`
  background: #eee;
  color: #333;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  cursor: pointer;
  font-size: 13px;
  margin-left: 4px;
`;

interface NewMeetingPopupProps {
  onClose: () => void;
  onSuccess?: () => void;
  projectName: string;
  projectId: string;
  userId: string;
  user: { name: string; email: string; role: string };
}

const NewMeetingPopup: React.FC<NewMeetingPopupProps> = ({ onClose, onSuccess, projectName, projectId, userId, user }) => {
  const [subject, setSubject] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [agenda, setAgenda] = useState("");
  const [attendees, setAttendees] = useState([
    { name: user.name, email: user.email, role: user.role },
  ]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAttendee = () => {
    setAttendees([...attendees, { name: "", email: "", role: "" }]);
  };
  const handleRemoveAttendee = (idx: number) => {
    if (idx === 0) return; // 본인은 삭제 불가
    setAttendees(attendees.filter((_, i) => i !== idx));
  };
  const handleAttendeeChange = (idx: number, key: string, value: string) => {
    // 본인 정보는 수정 불가
    if (idx === 0) return;
    setAttendees(attendees.map((a, i) => i === idx ? { ...a, [key]: value } : a));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!subject.trim() || !meetingDate) {
      setError("필수 항목을 입력해주세요.");
      return;
    }

    // 참석자 유효성 검사 (본인 제외)
    const invalidAttendees = attendees.slice(1).some(a => !a.name.trim() || !a.email.trim());
    if (invalidAttendees) {
      setError("모든 참석자의 이름과 이메일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // datetime-local 값을 ISO 문자열로 변환
      const startDate = new Date(meetingDate);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 기본 1시간

      const meetingData = {
        id: `temp_${Date.now()}`, // 임시 ID 생성
        user_id: userId,
        project_id: projectId,
        title: subject,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        type: 'meeting',
        agenda: agenda,
        attendees: attendees,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 백엔드 API가 없으므로 임시로 프론트엔드에서만 저장
      console.log("회의 등록 데이터:", meetingData);
      
      // 성공 처리
      alert("회의가 성공적으로 등록되었습니다! (임시 저장)");
      onClose();
      if (onSuccess) {
        onSuccess();
      }
      
      // TODO: 백엔드 API가 구현되면 실제 API 호출로 교체
      // 현재는 프론트엔드에서만 저장되므로 페이지 새로고침 시 사라집니다.
    } catch (error) {
      console.error("회의 등록 실패:", error);
      setError("회의 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PopupOverlay>
      <PopupContent style={{ minWidth: 420, maxWidth: 520 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <h2 style={{ margin: 0, color: "#351745", fontSize: "1.3rem", fontWeight: 600 }}>새 회의 일정 등록</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </div>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <StyledLabel>프로젝트명</StyledLabel>
            <StyledInput type="text" value={projectName} readOnly />
          </FormGroup>
          <FormGroup>
            <StyledLabel>회의 제목 <span style={{ color: '#dc3545' }}>*</span></StyledLabel>
            <StyledInput type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="회의 제목을 입력하세요" />
          </FormGroup>
          <FormGroup>
            <StyledLabel>회의 일시 <span style={{ color: '#dc3545' }}>*</span></StyledLabel>
            <StyledInput type="datetime-local" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <StyledLabel>회의 안건</StyledLabel>
            <StyledTextarea value={agenda} onChange={e => setAgenda(e.target.value)} placeholder="회의 안건을 입력하세요" />
          </FormGroup>
          <FormGroup>
            <StyledLabel>회의 참석자 <span style={{ color: '#dc3545' }}>*</span></StyledLabel>
            {attendees.map((a, idx) => (
              <AttendeeRow key={idx}>
                <StyledInput
                  type="text"
                  placeholder="이름"
                  value={a.name}
                  onChange={e => handleAttendeeChange(idx, "name", e.target.value)}
                  style={{ flex: 1 }}
                />
                <StyledInput
                  type="email"
                  placeholder="이메일"
                  value={a.email}
                  onChange={e => handleAttendeeChange(idx, "email", e.target.value)}
                  style={{ flex: 2 }}
                />
                <StyledInput
                  type="text"
                  placeholder="역할"
                  value={a.role}
                  onChange={e => handleAttendeeChange(idx, "role", e.target.value)}
                  style={{ flex: 1 }}
                />
                {idx !== 0 && (
                  <RemoveAttendeeButton type="button" onClick={() => handleRemoveAttendee(idx)}>
                    ×
                  </RemoveAttendeeButton>
                )}
              </AttendeeRow>
            ))}
            <AddAttendeeButton type="button" onClick={handleAddAttendee}>+</AddAttendeeButton>
          </FormGroup>
          {error && <div style={{ color: '#dc3545', marginBottom: 10 }}>{error}</div>}
          <CreateProjectButton type="submit" disabled={isSubmitting}>등록</CreateProjectButton>
        </form>
      </PopupContent>
    </PopupOverlay>
  );
};

export default NewMeetingPopup; 