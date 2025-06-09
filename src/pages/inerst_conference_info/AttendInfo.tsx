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

const SectionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #fff;
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
  flex-grow: 1;

  &::placeholder {
    color: #999;
  }
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

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const AttendInfo: React.FC<AttendInfoProps> = ({ attendees, setAttendees }) => {
  const handleAttendeeChange = (idx: number, field: string, value: string) => {
    const updated = [...attendees];
    updated[idx] = { ...updated[idx], [field]: value };
    setAttendees(updated);
  };

  const handleAddAttendee = () => {
    setAttendees([...attendees, { name: "", email: "", role: "" }]);
  };

  const handleRemoveAttendee = (idx: number) => {
    setAttendees(attendees.filter((_, i) => i !== idx));
  };

  return (
    <AttendInfoWrapper>
      <SectionTitle>참석자 정보</SectionTitle>
      {attendees.map((att, idx) => (
        <AttendeeInputGroup key={idx}>
          <StyledAttendeeInput
            type="text"
            placeholder="이름"
            value={att.name}
            onChange={e => handleAttendeeChange(idx, "name", e.target.value)}
          />
          <StyledAttendeeInput
            type="email"
            placeholder="이메일"
            value={att.email}
            onChange={e => handleAttendeeChange(idx, "email", e.target.value)}
          />
          <StyledAttendeeInput
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
      <AddButton type="button" onClick={handleAddAttendee}>참석자 추가</AddButton>
    </AttendInfoWrapper>
  );
};

export default AttendInfo; 