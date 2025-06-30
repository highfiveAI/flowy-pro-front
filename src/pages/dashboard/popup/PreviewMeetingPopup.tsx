import React, { useState } from 'react';
import styled from 'styled-components';

interface PreviewMeetingPopupProps {
  meeting: {
    meeting_id: string;
    meeting_title: string;
    meeting_date: string;
    meeting_agenda?: string;
  };
  onConfirm: (data: any) => void;
  onReject: () => void;
  onClose: () => void;
}

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  min-width: 500px;
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #351745;
    box-shadow: 0 0 0 2px rgba(53, 23, 69, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #351745;
    box-shadow: 0 0 0 2px rgba(53, 23, 69, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 25px;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #351745;
          color: white;
          &:hover { background-color: #2a1236; }
        `;
      case 'danger':
        return `
          background-color: #dc3545;
          color: white;
          &:hover { background-color: #c82333; }
        `;
      case 'secondary':
      default:
        return `
          background-color: #6c757d;
          color: white;
          &:hover { background-color: #5a6268; }
        `;
    }
  }}
`;

const PreviewMeetingPopup: React.FC<PreviewMeetingPopupProps> = ({
  meeting,
  onConfirm,
  onReject,
  onClose,
}) => {
  // 한국 시간대로 변환하여 datetime-local 형식으로 만드는 함수
  const formatToDatetimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    // 한국 시간대로 변환
    const kstDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (9 * 3600000));
    const year = kstDate.getFullYear();
    const month = String(kstDate.getMonth() + 1).padStart(2, '0');
    const day = String(kstDate.getDate()).padStart(2, '0');
    const hours = String(kstDate.getHours()).padStart(2, '0');
    const minutes = String(kstDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [editData, setEditData] = useState({
    meeting_title: meeting.meeting_title,
    meeting_date: formatToDatetimeLocal(meeting.meeting_date),
    meeting_agenda: meeting.meeting_agenda || '',
  });

  const handleConfirm = () => {
    // datetime-local 값을 한국 시간대 기준 ISO 형식으로 변환
    const localDate = new Date(editData.meeting_date);
    // 로컬 시간을 한국 시간대로 해석하여 ISO 문자열 생성
    const kstIsoString = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000)).toISOString();
    
    const confirmData = {
      ...editData,
      meeting_date: kstIsoString,
    };
    onConfirm(confirmData);
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <Title>
          🤖 예정된 회의가 있습니다
        </Title>
        
        <FormGroup>
          <Label>회의 제목</Label>
          <Input
            type="text"
            value={editData.meeting_title}
            onChange={(e) => setEditData(prev => ({
              ...prev,
              meeting_title: e.target.value
            }))}
            placeholder="회의 제목을 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>회의 일시</Label>
          <Input
            type="datetime-local"
            value={editData.meeting_date}
            onChange={(e) => setEditData(prev => ({
              ...prev,
              meeting_date: e.target.value
            }))}
          />
        </FormGroup>

        <FormGroup>
          <Label>회의 안건</Label>
          <TextArea
            value={editData.meeting_agenda}
            onChange={(e) => setEditData(prev => ({
              ...prev,
              meeting_agenda: e.target.value
            }))}
            placeholder="회의 안건을 입력하세요..."
          />
        </FormGroup>

        <ButtonGroup>
          <Button variant="primary" onClick={handleConfirm}>
            📅 캘린더에 등록
          </Button>
          
          <Button variant="danger" onClick={onReject}>
            ❌ 등록 안 함
          </Button>
          
          <Button variant="secondary" onClick={onClose}>
            ⏰ 나중에
          </Button>
        </ButtonGroup>
      </PopupContent>
    </PopupOverlay>
  );
};

export default PreviewMeetingPopup; 