import React from 'react';
import FileUpload from './FileUpload';
import SideBar from '../../components/SideBar';
import styled from 'styled-components';
import AttendInfo from './AttendInfo';
import Loading from '../../components/Loading';
import RecordInfoUpload from './RecordInfoUpload';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ResultContents from '../result/ResultContents';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #f7f7f7;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 위에서부터 정렬 */
  align-items: center;
  gap: 1rem; /* 간격 줄임 */
  padding-top: 2rem; /* 위쪽에 여유 공간 */
  overflow-y: auto; /* 필요시 스크롤 */
`;

const UploadButton = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 2rem;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 1rem;
  font-size: 14px;
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

const projects = ['프로젝트A', '프로젝트B', '프로젝트C']; // 예시 프로젝트명

const InsertConferenceInfo: React.FC = () => {
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
  const [selectedProject, setSelectedProject] = React.useState('');

  const validateForm = (): boolean => {
    if (!selectedProject) {
      setError('프로젝트를 선택하세요.');
      return false;
    }
    if (!subject.trim()) {
      setError('주제를 입력해주세요.');
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
      formData.append('project_name', selectedProject);
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

      // // formData 값 콘솔 출력
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }

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
        setSelectedProject('');
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
    <Container>
      <SideBar />
      <MainContent>
        {/* 프로젝트 선택 토글 */}
        {!(isCompleted || isLoading) && (
          <div style={{ width: '100%', maxWidth: 500, marginTop: '1rem' }}>
            <label style={{ fontWeight: 'bold', marginRight: 8 }}>프로젝트 선택</label>
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                minWidth: 150,
              }}
            >
              <option value="">프로젝트를 선택하세요</option>
              {projects.map((proj, idx) => (
                <option key={idx} value={proj}>{proj}</option>
              ))}
            </select>
          </div>
        )}
        {isCompleted ? (
          <ResultContents result={result} />
        ) : isLoading ? (
          <Loading />
        ) : (
          <>
            <AttendInfo
              subject={subject}
              attendees={attendees}
              setSubject={setSubject}
              setAttendees={setAttendees}
            />
            <div style={{ width: '100%', maxWidth: 500, marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold' }}>회의 안건 (선택)</label>
              <textarea
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="회의 안건을 입력하세요 (선택)"
                style={{
                  width: '100%',
                  minHeight: 60,
                  marginTop: 8,
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  padding: 8,
                }}
              />
            </div>
            <div style={{ width: '100%', maxWidth: 500 }}>
              <label style={{ fontWeight: 'bold' }}>
                회의 일시 <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div
                style={{
                  width: '100%',
                  marginTop: 8,
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  padding: 8,
                }}
              >

                <DatePicker
                  selected={meetingDate}
                  onChange={(date: Date | null) => setMeetingDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                  placeholderText="날짜와 시간을 선택하세요"
                  className="custom-datepicker"
                />
              </div>
            </div>
            {file ? (
              <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                파일명: {file.name}
              </div>
            ) : (
              <>
                <FileUpload setFile={setFile} />
                <RecordInfoUpload setFile={setFile} />
              </>
            )}
            <UploadButton onClick={handleUpload}>업로드</UploadButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </>
        )}
      </MainContent>
    </Container>
  );
};

export default InsertConferenceInfo;
