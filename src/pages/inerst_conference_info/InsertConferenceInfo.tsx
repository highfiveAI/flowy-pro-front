import React from 'react';
import FileUpload from './FileUpload';
import styled from 'styled-components';
import AttendInfo from './AttendInfo';
import Loading from '../../components/Loading';
import RecordInfoUpload from './RecordInfoUpload';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ResultContents from '../result/ResultContents';
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const LeftPanel = styled.div`
  flex: 1;
  background-color: #f7f7f7; /* 좌측 패널 배경색 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 2rem;
  /* 추후 프로젝트 목록 등 내용 추가 */
`;

const RightPanel = styled.div`
  width: 600px;
  background-color: #351745; /* 우측 패널 배경색 */
  padding: 40px;
  display: flex;
  flex-direction: column;
  color: white;
  position: relative;
  overflow-y: auto;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 20px;

  &:hover {
    opacity: 0.8;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  flex-grow: 1;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 25px; /* 각 폼 그룹 간 간격 */
  width: 100%;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1.1rem;
  color: #fff;

  span {
    color: #ffcc00; /* 필수 입력 표시를 위한 색상 */
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;

  &::placeholder {
    color: #999;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  box-sizing: border-box;
  -webkit-appearance: none; /* 기본 select 스타일 제거 */
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13%205.1L146.2%20202.7%2018.5%2074.5a17.6%2017.6%200%200%200-25.1%2024.9l130.2%20129.8c6.8%206.7%2017.7%206.7%2024.5%200l130.2-129.8a17.6%2017.6%200%200%200-11.9-29.4z%22%2F%3E%3C%2Fsvg%3E'); /* 커스텀 화살표 */
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 12px;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  .custom-datepicker {
    width: 100%;
    padding: 12px 15px;
    border: none;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 1rem;
    box-sizing: border-box;

    &::placeholder {
      color: #999;
    }
  }
`;

const StyledUploadSection = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 20px;
  position: relative; /* 아이콘 배치를 위해 추가 */
  min-height: 100px; /* 아이콘을 포함할 수 있도록 최소 높이 설정 */

  h2 {
    color: #351745;
  }
`;

const FileUploadWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

const RecordUploadWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

const StyledUploadButton = styled.button`
  padding: 15px 30px;
  background-color: #00B4BA; /* 보라색 계열 */
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  width: 100%;
  margin-top: 30px;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover {
    background-color: #00939a; /* hover 색상 조정 */
  }
`;

const StyledErrorMessage = styled.div`
  color: #ffeb3b; /* 밝은 노란색으로 변경 */
  margin-top: 15px;
  font-size: 0.9rem;
  text-align: center;
`;

// 날짜를 'YYYY-MM-DD HH:mm:ss' 형식으로 변환하는 함수
function formatDateToKST(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const InsertConferenceInfo: React.FC = () => {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [subject, setSubject] = React.useState('');
  const [attendees, setAttendees] = React.useState([
    { name: '', email: '', role: '' },
  ]);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>('');
  const [agenda, setAgenda] = React.useState('');
  const [meetingDate, setMeetingDate] = React.useState<Date | null>(null);
  const [result, setResult] = React.useState<any>(null);

  const validateForm = (): boolean => {
    if (!subject.trim()) {
      setError('회의 제목을 입력해주세요.');
      return false;
    }

    const hasEmptyFields = attendees.some(
      (attendee) =>
        !attendee.name.trim() || !attendee.email.trim() || !attendee.role.trim()
    );

    if (hasEmptyFields) {
      setError('모든 참석자의 정보를 입력해주세요.');
      return false;
    }

    if (!meetingDate) {
      setError('회의 일시를 선택해주세요.');
      return false;
    }

    if (!file) {
      setError('파일을 업로드하거나 녹음을 완료해주세요.');
      return false;
    }

    setError('');
    return true;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsLoading(true); // 로딩 시작
    console.log('함수 실행중...');
    const formData = new FormData();
    if (file) {
      formData.append('file', file, file.name);
      formData.append('subject', subject);
      formData.append('agenda', agenda);
      if (meetingDate) {
        formData.append('meeting_date', formatDateToKST(meetingDate)); // 'YYYY-MM-DD HH:mm:ss' 포맷
      }
      attendees.forEach((att) => {
        formData.append('attendees_name', att.name);
        formData.append('attendees_email', att.email);
        formData.append('attendees_role', att.role);
      });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/stt/`,
          {
            method: 'POST',
            body: formData,
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || '업로드에 실패했습니다.');
        }
        const result = await response.json();
        console.log('서버 응답:', result);
        alert('업로드가 완료되었습니다.');
        setSubject('');
        setAttendees([{ name: '', email: '', role: '' }]);
        setFile(null);
        setAgenda('');
        setMeetingDate(null);
        setResult(result);
        setIsCompleted(true);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '업로드 중 오류가 발생했습니다.'
        );
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <LeftPanel>{/* 프로젝트 목록 영역 */}</LeftPanel>
        <RightPanel>
          <FormHeader>
            <BackButton onClick={() => navigate(-1)}>← 메인 화면으로 돌아가기</BackButton>
            <PageTitle>새 회의 정보 입력하기</PageTitle>
          </FormHeader>
          {isCompleted ? (
            <ResultContents result={result} />
          ) : isLoading ? (
            <Loading />
          ) : (
            <>
              <FormGroup>
                <StyledLabel htmlFor="project-name">프로젝트명 <span>*</span></StyledLabel>
                <StyledSelect id="project-name">
                  <option value="">상위 프로젝트를 선택해주세요.</option>
                  {/* 프로젝트 목록 동적 생성 */} 
                </StyledSelect>
              </FormGroup>
              
              <FormGroup>
                <StyledLabel htmlFor="meeting-subject">회의 제목 <span>*</span></StyledLabel>
                <StyledInput
                  type="text"
                  id="meeting-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="회의 제목을 입력해주세요."
                />
                {/* <p style={{ color: '#ffeb3b', fontSize: '0.8rem', marginTop: '5px' }}>
                  * 이 프로젝트에서 사용 중인 회의 제목입니다.
                </p> */} {/* 이미지에 있는 노란색 텍스트 (주석 처리)*/}
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="meeting-date">회의 일시 <span>*</span></StyledLabel>
                <DatePickerWrapper>
                  <DatePicker
                    selected={meetingDate}
                    onChange={(date: Date | null) => setMeetingDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="회의 일시를 선택하세요."
                    className="custom-datepicker"
                  />
                </DatePickerWrapper>
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="meeting-agenda">회의 안건</StyledLabel>
                <StyledTextarea
                  id="meeting-agenda"
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="회의 안건을 입력하세요."
                />
              </FormGroup>

              <FormGroup>
                <StyledLabel>회의 참석자 <span>*</span></StyledLabel>
                {/* AttendInfo 컴포넌트 내부 스타일 조정 필요 시 여기에 Wrapper 적용 */} 
                <AttendInfo
                  attendees={attendees}
                  setAttendees={setAttendees}
                />
              </FormGroup>

              <FormGroup>
                <StyledLabel>회의 음성 <span>*</span></StyledLabel>
                <StyledUploadSection>
                  {file ? (
                    <div style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#351745' }}>
                      파일명: {file.name}
                    </div>
                  ) : (
                    <>
                      <FileUploadWrapper>
                        <FileUpload setFile={setFile} />
                      </FileUploadWrapper>
                      <RecordUploadWrapper>
                        <RecordInfoUpload setFile={setFile} />
                      </RecordUploadWrapper>
                    </>
                  )}
                </StyledUploadSection>
              </FormGroup>

              <StyledUploadButton onClick={handleUpload}>회의 분석하기</StyledUploadButton>
              {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
            </>
          )}
        </RightPanel>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default InsertConferenceInfo;
