import React, { useState } from "react";
import styled from 'styled-components';

type Attendee = { user_id: string; name: string; email: string; user_jobname: string };

interface ProjectUser {
  user_id: string;
  name: string;
  email: string;
  user_jobname: string;
}

interface AttendInfoProps {
  attendees: Attendee[];
  setAttendees: (a: Attendee[]) => void;
  projectUsers: ProjectUser[];
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

const StyledSelect = styled.select`
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  min-width: 180px;
  box-sizing: border-box;
  margin-right: 0;
  &::placeholder {
    color: #999;
  }
`;

const AttendInfo: React.FC<AttendInfoProps> = ({ attendees, setAttendees, projectUsers = [] }) => {
  const [hostId, setHostId] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [hostJobname, setHostJobname] = useState('');

  const handleAttendeeChange = (idx: number, field: string, value: string) => {
    const updated = [...attendees];
    updated[idx] = { ...updated[idx], [field]: value };
    setAttendees(updated);
  };

  const handleRemoveAttendee = (idx: number) => {
    setAttendees(attendees.filter((_, i) => i !== idx));
  };

  const handleUserSelect = (idx: number, user_id: string) => {
    const selectedUser = projectUsers.find(u => u.user_id === user_id);
    if (selectedUser) {
      const updated = [...attendees];
      updated[idx] = {
        user_id: selectedUser.user_id,
        name: selectedUser.name,
        email: selectedUser.email || '',
        user_jobname: selectedUser.user_jobname || ''
      };
      setAttendees(updated);
    } else {
      // 사용자가 선택되지 않은 경우 빈 값으로 초기화
      const updated = [...attendees];
      updated[idx] = {
        user_id: '',
        name: '',
        email: '',
        user_jobname: ''
      };
      setAttendees(updated);
    }
  };

  const handleHostSelect = (user_id: string) => {
    setHostId(user_id);
    const selectedUser = projectUsers.find(u => u.user_id === user_id);
    if (selectedUser) {
      setHostEmail(selectedUser.email || '');
      setHostJobname(selectedUser.user_jobname || '');
    } else {
      setHostEmail('');
      setHostJobname('');
    }
  };

  return (
    <AttendInfoWrapper>
      <AttendeeInputGroup>
        <StyledSelect
          value={hostId}
          onChange={e => handleHostSelect(e.target.value)}
        >
          <option value="">회의장 선택</option>
          {projectUsers.map(user => (
            <option key={user.user_id} value={user.user_id}>{user.name}</option>
          ))}
        </StyledSelect>
        <EmailInput
          type="email"
          placeholder="이메일"
          value={hostEmail}
          readOnly
        />
        <RoleInput
          type="text"
          placeholder="역할"
          value={hostJobname}
          readOnly
        />
      </AttendeeInputGroup>
      {attendees.map((att, idx) => (
        <AttendeeInputGroup key={idx}>
          <StyledSelect
            value={att.user_id}
            onChange={e => handleUserSelect(idx, e.target.value)}
          >
            <option value="">참석자 선택</option>
            {projectUsers
              .filter(user => user.user_id !== hostId)
              .map(user => (
                <option key={user.user_id} value={user.user_id}>{user.name}</option>
              ))}
          </StyledSelect>
          <EmailInput
            type="email"
            placeholder="이메일"
            value={att.email}
            onChange={e => handleAttendeeChange(idx, "email", e.target.value)}
          />
          <RoleInput
            type="text"
            placeholder="역할"
            value={att.user_jobname}
            onChange={e => handleAttendeeChange(idx, "user_jobname", e.target.value)}
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