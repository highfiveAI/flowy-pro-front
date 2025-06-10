import React from "react";
import styled from 'styled-components';

type Attendee = { name: string; email: string; role: string };

interface AttendInfoProps {
  attendees: Attendee[];
  setAttendees: (a: Attendee[]) => void;
}

const AttendInfoWrapper = styled.div`
  margin-bottom: 25px; /* FormGroup과 유사한 간격 */
  width: 100%;
`;

const AttendeeInputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

const StyledAttendeeInput = styled.input`
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  flex-shrink: 0; /* 축소 방지 */
  box-sizing: border-box; /* 패딩과 테두리가 너비에 포함되도록 */

  &::placeholder {
    color: #999;
  }
`;

const NameInput = styled(StyledAttendeeInput)`
  flex-grow: 0;
  width: calc((90% - 20px) * 1 / 6); /* 이름: 전체 너비의 중 차지하는 비율로 표시, 20px는 gap 총합 (10px * 2) */
`;

const EmailInput = styled(StyledAttendeeInput)`
  flex-grow: 0;
  width: calc((90% - 20px) * 3 / 6); /* 이메일: 전체 너비의 중 차지하는 비율로 표시 */
`;

const RoleInput = styled(StyledAttendeeInput)`
  flex: 2 0 0; 
  width: calc((90% - 20px) * 2 / 6); /* 역할: 전체 너비의 중 차지하는 비율로 표시 */
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #c82333;
  }
`;

const AttendInfo: React.FC<AttendInfoProps> = ({ attendees, setAttendees }) => {
  const handleAttendeeChange = (idx: number, field: string, value: string) => {
    const updated = [...attendees];
    updated[idx] = { ...updated[idx], [field]: value };
    setAttendees(updated);
  };

  const handleRemoveAttendee = (idx: number) => {
    setAttendees(attendees.filter((_, i) => i !== idx));
  };

  return (
    <AttendInfoWrapper>
      {attendees.map((att, idx) => (
        <AttendeeInputGroup key={idx}>
          <NameInput
            type="text"
            placeholder="이름"
            value={att.name}
            onChange={e => handleAttendeeChange(idx, "name", e.target.value)}
          />
          <EmailInput
            type="email"
            placeholder="이메일"
            value={att.email}
            onChange={e => handleAttendeeChange(idx, "email", e.target.value)}
          />
          <RoleInput
            type="text"
            placeholder="역할"
            value={att.role}
            onChange={e => handleAttendeeChange(idx, "role", e.target.value)}
          />
          {attendees.length > 1 && (
            <RemoveButton type="button" onClick={() => handleRemoveAttendee(idx)}>삭제</RemoveButton>
          )}
        </AttendeeInputGroup>
      ))}
    </AttendInfoWrapper>
  );
};

export default AttendInfo; 