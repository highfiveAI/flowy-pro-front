import React, { useState } from 'react';
import styled from 'styled-components';
import {
  CloseButton,
  FormGroup,
  StyledLabel,
  StyledInput,
  StyledTextarea,
  CreateProjectButton,
  PopupOverlay,
  PopupContent,
} from '../../insert_conference_info/conference_popup/EditProjectPopup.styles';

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

const StyledSelect = styled.select`
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  min-width: 120px;
  box-sizing: border-box;
  margin-right: 0;
  height: 44px;
  &:focus {
    outline: 2px solid #771277;
  }
`;

interface ProjectUser {
  user_id: string;
  name: string;
  email: string;
  user_jobname: string;
}

interface Attendee {
  user_id: string;
  name: string;
  email: string;
  user_jobname: string;
}

interface NewMeetingPopupProps {
  onClose: () => void;
  onSuccess?: () => void;
  projectName: string;
  projectId: string;
  userId: string;
  projectUsers: ProjectUser[];
}

const ScrollablePopupContent = styled(PopupContent)`
  max-height: 80vh;
  overflow-y: auto;
`;

const NewMeetingPopup: React.FC<NewMeetingPopupProps> = ({
  onClose,
  onSuccess,
  projectName,
  projectId,
  userId,
  projectUsers,
}) => {
  const [subject, setSubject] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [agenda, setAgenda] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([
    (() => {
      const me = projectUsers.find((u) => u.user_id === userId);
      return me
        ? { ...me }
        : { user_id: userId, name: '', email: '', user_jobname: '' };
    })(),
  ]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  const handleAddAttendee = () => {
    setAttendees([
      ...attendees,
      { user_id: '', name: '', email: '', user_jobname: '' },
    ]);
  };

  const handleRemoveAttendee = (idx: number) => {
    if (idx === 0) return; // 본인은 삭제 불가
    setAttendees(attendees.filter((_, i) => i !== idx));
  };

  const handleUserSelect = (idx: number, user_id: string) => {
    if (idx === 0) return; // 본인 정보는 select 불가
    const selectedUser = projectUsers.find((u) => u.user_id === user_id);
    if (selectedUser) {
      const updated = [...attendees];
      updated[idx] = { ...selectedUser };
      setAttendees(updated);
    } else {
      const updated = [...attendees];
      updated[idx] = { user_id: '', name: '', email: '', user_jobname: '' };
      setAttendees(updated);
    }
  };

  // 전체 선택 체크박스 핸들러
  const handleSelectAll = () => {
    if (allSelected) {
      // 전체 해제: 본인만 남기고 나머지 빈 값
      setAttendees([
        attendees[0],
        ...attendees
          .slice(1)
          .map(() => ({ user_id: '', name: '', email: '', user_jobname: '' })),
      ]);
      setAllSelected(false);
    } else {
      // 전체 선택: 본인 제외 모든 줄에 남은 projectUsers를 순서대로 할당
      // const usedIds = [userId];
      const restUsers = projectUsers.filter((u) => u.user_id !== userId);
      const newAttendees = [attendees[0]];
      for (let i = 0; i < restUsers.length; i++) {
        newAttendees.push({ ...restUsers[i] });
      }
      setAttendees(newAttendees);
      setAllSelected(true);
    }
  };

  // 전체 선택 상태 동기화
  React.useEffect(() => {
    const restUsers = projectUsers.filter((u) => u.user_id !== userId);
    const selectedIds = attendees
      .slice(1)
      .map((a) => a.user_id)
      .filter(Boolean);
    setAllSelected(
      selectedIds.length === restUsers.length &&
        restUsers.length > 0 &&
        selectedIds.every((id) => restUsers.some((u) => u.user_id === id))
    );
  }, [attendees, projectUsers, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !meetingDate) {
      setError('필수 항목을 입력해주세요.');
      return;
    }
    // 본인 외 참석자 유효성 검사
    const invalid = attendees.slice(1).some((a) => !a.user_id);
    if (invalid) {
      setError('모든 참석자를 선택해주세요.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const meeting_date = new Date(meetingDate).toISOString();
      const users = attendees.map((a) => ({ user_id: a.user_id }));
      const body = {
        project_id: projectId,
        meeting_title: subject,
        meeting_agenda: agenda,
        meeting_date,
        meeting_audio_path: 'app/none',
        users,
      };
      // 실제 API 호출
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects/meeting/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || '회의 등록 실패');
      }
      alert('회의가 성공적으로 등록되었습니다!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      setError('회의 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PopupOverlay>
      <ScrollablePopupContent style={{ minWidth: 420, maxWidth: 520 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: '#351745',
              fontSize: '1.3rem',
              fontWeight: 600,
            }}
          >
            새 회의 일정 등록
          </h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </div>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <StyledLabel>프로젝트명</StyledLabel>
            <StyledInput type="text" value={projectName} readOnly />
          </FormGroup>
          <FormGroup>
            <StyledLabel>
              회의 제목 <span style={{ color: '#dc3545' }}>*</span>
            </StyledLabel>
            <StyledInput
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="회의 제목을 입력하세요"
            />
          </FormGroup>
          <FormGroup>
            <StyledLabel>
              회의 일시 <span style={{ color: '#dc3545' }}>*</span>
            </StyledLabel>
            <StyledInput
              type="datetime-local"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <StyledLabel>회의 안건</StyledLabel>
            <StyledTextarea
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="회의 안건을 입력하세요"
            />
          </FormGroup>
          <FormGroup>
            <StyledLabel>
              회의 참석자 <span style={{ color: '#dc3545' }}>*</span>
            </StyledLabel>
            <div
              style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                id="selectAllAttendees"
                style={{ marginRight: 8 }}
              />
              <label
                htmlFor="selectAllAttendees"
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                전체 선택
              </label>
            </div>
            {attendees.map((a, idx) => (
              <AttendeeRow key={idx}>
                {idx === 0 ? (
                  <StyledSelect
                    value={a.user_id}
                    disabled
                    style={{
                      flex: 1,
                      marginRight: 8,
                      color: '#888',
                      background: '#f5f5f5',
                    }}
                  >
                    <option value={a.user_id}>{a.name}</option>
                  </StyledSelect>
                ) : (
                  <StyledSelect
                    value={a.user_id}
                    onChange={(e) => handleUserSelect(idx, e.target.value)}
                    style={{ flex: 1, marginRight: 8 }}
                  >
                    <option value="">참석자 선택</option>
                    {projectUsers
                      .filter(
                        (u) =>
                          u.user_id !== userId &&
                          !attendees.some(
                            (att, i) => att.user_id === u.user_id && i !== idx
                          )
                      )
                      .map((u) => (
                        <option key={u.user_id} value={u.user_id}>
                          {u.name}
                        </option>
                      ))}
                  </StyledSelect>
                )}
                <StyledInput
                  type="email"
                  value={a.email}
                  readOnly
                  placeholder="이메일"
                  style={{ flex: 2 }}
                />
                <StyledInput
                  type="text"
                  value={a.user_jobname}
                  readOnly
                  placeholder="역할"
                  style={{ flex: 1 }}
                />
                {idx === 0 ? (
                  <span style={{ color: '#888', fontSize: 13, marginLeft: 8 }}>
                    본인
                  </span>
                ) : (
                  <RemoveAttendeeButton
                    type="button"
                    onClick={() => handleRemoveAttendee(idx)}
                  >
                    ×
                  </RemoveAttendeeButton>
                )}
              </AttendeeRow>
            ))}
            <AddAttendeeButton type="button" onClick={handleAddAttendee}>
              +
            </AddAttendeeButton>
          </FormGroup>
          {error && (
            <div style={{ color: '#dc3545', marginBottom: 10 }}>{error}</div>
          )}
          <CreateProjectButton type="submit" disabled={isSubmitting}>
            등록
          </CreateProjectButton>
        </form>
      </ScrollablePopupContent>
    </PopupOverlay>
  );
};

export default NewMeetingPopup;
