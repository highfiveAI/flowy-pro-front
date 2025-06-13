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
import AddUserIcon from '/images/adduser.svg'; // adduser.svg 임포트
import NewMeetingIcon from '/images/newmeetingicon.svg'; // newmeetingicon.svg 임포트
import AddProjectIcon from '/images/addprojecticon.svg'; // addprojecticon.svg 임포트
import NewProjectPopup from './conference_popup/NewProjectPopup'; // Popup 컴포넌트 임포트
import { useAuth } from '../../contexts/AuthContext';
import { checkAuth } from '../../api/fetchAuthCheck';

const StyledErrorMessage = styled.div`
  color: #dc3545; /* 밝은 노란색에서 붉은색으로 변경 */
  margin-top: 15px;
  font-size: 0.9rem;
  text-align: left;
  width: 100%; /* 중앙 정렬을 위해 너비 100% 설정 */
`;

const ProjectListTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center; /* 중앙 정렬 */
  width: 100%; /* 중앙 정렬을 위해 너비 100% 설정 */
`;

const SortWrapper = styled.div`
  display: flex;
  justify-content: flex-end; /* 우측 정렬 */
  width: 100%; /* 부모 너비에 맞춤 */
  padding-right: 20px; /* 스크롤바 공간 확보 */
`;

const SortText = styled.span`
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ProjectListContainer = styled.div`
  background-color: #f0f0f0; /* 리스트 전체 상자의 배경색 */
  border-radius: 8px;
  padding: 20px; /* 리스트 상자 내부 패딩 */
  width: 700px; /* LeftPanel 내용 영역의 전체 너비 차지 */
  box-sizing: border-box; /* 패딩을 너비 계산에 포함 */
  height: 800px; /* 고정 높이 설정 */
  overflow-y: auto; /* 내용이 넘치면 스크롤 */
`;

const ProjectList = styled.ul`
  list-style: disc; /* 글머리 기호 표시 */
  padding-left: 20px; /* 글머리 기호 가시성을 위한 패딩 조정 */
  margin: 0;
`;

const ProjectListItem = styled.li`
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    opacity: 0.8; /* 호버 시 투명도 조절 */
  }
`;

const NewProjectTextTop = styled.span`
  color: rgba(30, 30, 30, 0.78);
  font-size: 11px;
  font-style: normal;
  font-weight: 450;
  line-height: 15px; /* 줄 간격 더 좁힘 */
`;

const NewProjectTextBottom = styled.span`
  color: #00b4ba;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 줄 간격 더 좁힘 */
`;

const NewProjectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px; /* 아이콘과 텍스트 간 간격 조정 */
  margin-bottom: 0px;
  cursor: pointer;
  width: 100%;
  justify-content: flex-end; /* 우측 정렬 */
  padding-right: 250px; /* 우측에 30px 간격 추가 */

  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const NewProjectTextsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px; /* 텍스트 간격 조정 */
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
  const { user, setUser, setLoading } = useAuth();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [subject, setSubject] = React.useState('');
  const [attendees, setAttendees] = React.useState([
    { user_id: '', name: '', email: '', user_jobname: '' },
  ]);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>('');
  const [agenda, setAgenda] = React.useState('');
  const [meetingDate, setMeetingDate] = React.useState<Date | null>(null);
  const [result, setResult] = React.useState<any>(null);
  const [projectName, setProjectName] = React.useState<string>('');
  const [projectId, setProjectId] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');

  const [showPopup, setShowPopup] = React.useState<boolean>(false); // 팝업 표시 상태 추가

  const [projects, setProjects] = React.useState<{userName: string, projectName: string, projectId: string}[]>([]); // projectId 필드 추가
  const [projectUsers, setProjectUsers] = React.useState<{user_id: string, name: string, email: string, user_jobname: string}[]>([]); // 프로젝트 참여자 목록 상태 추가
  const [hostId, setHostId] = React.useState('');

  React.useEffect(() => {
    setUsername(user?.name || '');
  }, [user]);
    
   React.useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (user) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);
  

  // user.id로 프로젝트 목록과 사용자 이름 불러오기
  React.useEffect(() => {
    if (!user?.id) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/projects/${user.id}`, {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('전체 응답 데이터:', data);
        console.log('프로젝트 목록 데이터:', data.projects);
        if (data.projects && data.projects.length > 0) {
          console.log('첫 번째 프로젝트 데이터:', data.projects[0]);
        }
        setProjects(data.projects);
        // projects에서 첫 번째 userName을 username으로 저장
        // if (data.projects && data.projects.length > 0) {

        //   setUsername(data.projects[0].userName || data.projects[0][0] || '알 수 없음');

        // } else {
        //   setUsername('알 수 없음');
        // }
      });
  }, [user?.id]);

  const handleAddAttendee = () => {
    setAttendees([
      ...attendees,
      { user_id: '', name: '', email: '', user_jobname: '' },
    ]);
  };

  const validateForm = (): boolean => {
    if (!projectName.trim() || !projectId.trim()) {
      setError('프로젝트를 선택해주세요.');
      return false;
    }

    if (!subject.trim()) {
      setError('입력하지 않은 필수 항목이 있습니다.');
      return false;
    }

    const hasEmptyFields = attendees.some(
      (attendee) =>
        !attendee.name.trim() ||
        !attendee.email.trim() ||
        !attendee.user_jobname.trim()
    );

    if (hasEmptyFields) {
      setError('입력하지 않은 필수 항목이 있습니다.');
      return false;
    }

    if (!meetingDate) {
      setError('입력하지 않은 필수 항목이 있습니다.');
      return false;
    }

    setError('');
    return true;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    console.log('함수 실행중...');
    // const formData = new FormData();

    if (file) {
      // STT API용 FormData
      const hostUser = projectUsers.find(u => u.user_id === hostId);
      const hostName = hostUser?.name || '';
      const hostEmail = hostUser?.email || '';
      const hostRole = hostUser?.user_jobname || '';

      // 참석자 정보(회의장 제외)
      const filteredAttendees = attendees.filter(a => a.user_id && a.user_id !== hostId);
      const attendeesName = filteredAttendees.map(a => a.name);
      const attendeesEmail = filteredAttendees.map(a => a.email);
      const attendeesRole = filteredAttendees.map(a => a.user_jobname);

      const sttFormData = new FormData();
      sttFormData.append('file', file, file.name);
      sttFormData.append('subject', subject);
      sttFormData.append('agenda', agenda);
      sttFormData.append('meeting_date', meetingDate ? formatDateToKST(meetingDate) : '');
      sttFormData.append('project_name', projectName);
      // host 정보
      sttFormData.append('host_name', hostName);
      sttFormData.append('host_email', hostEmail);
      sttFormData.append('host_role', hostRole);
      // 참석자 정보 (각각 여러 번 append)
      attendeesName.forEach(name => sttFormData.append('attendees_name', name));
      attendeesEmail.forEach(email => sttFormData.append('attendees_email', email));
      attendeesRole.forEach(role => sttFormData.append('attendees_role', role));

      // Meeting Upload API용 FormData
      const meetingFormData = new FormData();
      meetingFormData.append('file', file);
      meetingFormData.append('project_id', projectId);
      meetingFormData.append('meeting_title', subject);
      meetingFormData.append('meeting_agenda', agenda);
      if (meetingDate) {
        meetingFormData.append('meeting_date', formatDateToKST(meetingDate));
      }
      // host 정보
      meetingFormData.append('host_name', hostName);
      meetingFormData.append('host_email', hostEmail);
      meetingFormData.append('host_role', hostRole);
      // 참석자 정보
      attendeesName.forEach(name => meetingFormData.append('attendees_name', name));
      attendeesEmail.forEach(email => meetingFormData.append('attendees_email', email));
      attendeesRole.forEach(role => meetingFormData.append('attendees_role', role));

      
      // 콘솔로 값 확인
      console.log('hostId:', hostId);
      console.log('hostName:', hostName);
      console.log('hostEmail:', hostEmail);
      console.log('hostRole:', hostRole);
      console.log('attendeesName:', attendeesName);
      console.log('attendeesEmail:', attendeesEmail);
      console.log('attendeesRole:', attendeesRole);

      try {
        // STT API 호출
        const sttResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/stt/`,
          {
            method: 'POST',
            body: sttFormData,
          }
        );

        if (!sttResponse.ok) {
          const errorData = await sttResponse.json().catch(() => null);
          throw new Error(errorData?.detail || 'STT 업로드에 실패했습니다.');
        }

        // Meeting Upload API 호출
        const meetingResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/stt/meeting-upload/`,
          {
            method: 'POST',
            body: meetingFormData,
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!meetingResponse.ok) {
          const errorData = await meetingResponse.json().catch(() => null);
          throw new Error(
            errorData?.detail || '회의 정보 업로드에 실패했습니다.'
          );
        }

        const sttResult = await sttResponse.json();
        const meetingResult = await meetingResponse.json();
        console.log('STT 서버 응답:', sttResult);
        console.log('Meeting 서버 응답:', meetingResult);

        // === analyze-meeting 연속 호출 추가 ===
        const meetingId = meetingResult.meeting_id;
        if (meetingId) {
          const analyzeFormData = new FormData();
          analyzeFormData.append('meeting_id', meetingId);
          analyzeFormData.append('project_name', projectName);
          analyzeFormData.append('subject', subject);

          analyzeFormData.append('chunks', JSON.stringify(sttResult.chunks || []));
          analyzeFormData.append('host_name', hostName);
          analyzeFormData.append('host_email', hostEmail);
          analyzeFormData.append('host_role', hostRole);

          analyzeFormData.append('attendees_list', JSON.stringify(attendees));
          analyzeFormData.append('agenda', agenda);
          if (meetingDate) {
            analyzeFormData.append(
              'meeting_date',
              formatDateToKST(meetingDate)
            );
          } else {
            analyzeFormData.append('meeting_date', '');
          }
          

          const analyzeResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/stt/analyze-meeting/`,
            {
              method: 'POST',
              body: analyzeFormData,
              credentials: 'include',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          const analyzeData = await analyzeResponse.json();
          console.log('분석 결과:', analyzeData);

          alert('업로드가 완료되었습니다.');
          setSubject('');
          setAttendees([
            { user_id: '', name: '', email: '', user_jobname: '' },
          ]);
          setFile(null);
          setAgenda('');
          setMeetingDate(null);
          setResult(analyzeData); // 분석 결과를 결과로 설정
          setIsCompleted(true);
        } else {
          alert('업로드가 완료되었지만, 분석 결과를 가져오지 못했습니다.');
          setResult(null);
          setIsCompleted(true);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '업로드 중 오류가 발생했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 프로젝트 선택 핸들러 함수
  const handleProjectSelect = async (
    projectId: string,
    projectName: string
  ) => {
    setProjectId(projectId);
    setProjectName(projectName);
    // 참여자 목록 불러오기
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/stt/project-users/${projectId}`,
        {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await res.json();
      console.log('API 응답 데이터:', data); // 디버깅을 위한 로그
      setProjectUsers(
        data.users.map((u: any) => ({
          user_id: u.user_id,
          name: u.name,
          email: u.email,
          user_jobname: u.user_jobname,
        }))
      );
      setAttendees([{ user_id: '', name: '', email: '', user_jobname: '' }]); // 항상 1개 이상 입력란 유지
    } catch (e) {
      console.error('프로젝트 사용자 정보를 가져오는데 실패했습니다:', e);
      setProjectUsers([]);
      setAttendees([{ user_id: '', name: '', email: '', user_jobname: '' }]);
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <LeftPanel>
          <ProjectListTitle>
            [ {username} ] 님이 참여 중인 프로젝트 목록
          </ProjectListTitle>
          <NewProjectWrapper onClick={() => setShowPopup(true)}>
            <img src={AddProjectIcon} alt="신규 프로젝트 추가" />
            <NewProjectTextsContainer>
              <NewProjectTextTop>찾는 프로젝트가 없나요?</NewProjectTextTop>
              <NewProjectTextBottom>
                신규 프로젝트 추가하기
              </NewProjectTextBottom>
            </NewProjectTextsContainer>
          </NewProjectWrapper>
          <ProjectListContainer>
            <SortWrapper>
              <SortText>최신순 으로 정렬</SortText>
            </SortWrapper>
            {/* db에서 불러오기 */}
            <ProjectList>
              {projects.length > 0 ? (
                projects.map((proj, index) => (
                  <ProjectListItem
                    key={index}
                    onClick={() => {
                      handleProjectSelect(proj.projectId, proj.projectName);
                    }}
                  >
                    <span>{proj.projectName}</span>
                  </ProjectListItem>
                ))
              ) : (
                <ProjectListItem>프로젝트가 없습니다.</ProjectListItem>
              )}
            </ProjectList>
          </ProjectListContainer>
        </LeftPanel>
        <RightPanel>
          <FormHeader>
            <BackButton onClick={() => navigate(-1)}>
              ← 메인 화면으로 돌아가기
            </BackButton>
          </FormHeader>
          <PageTitle>
            <img src={NewMeetingIcon} alt="새 회의" />새 회의 정보 입력하기
          </PageTitle>
          {isCompleted ? (
            <ResultContents result={result} />
          ) : isLoading ? (
            <Loading />
          ) : (
            <>
              <FormGroup>
                <StyledLabel htmlFor="project-name">
                  프로젝트명 <span>*</span>
                </StyledLabel>
                <StyledInput
                  type="text"
                  id="project-name"
                  value={projectName}
                  readOnly
                  placeholder="프로젝트 목록에서 선택해주세요."
                  onClick={() => alert('프로젝트 목록중에서 선택해주세요')}
                />
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="meeting-subject">
                  회의 제목 <span>*</span>
                </StyledLabel>
                <StyledInput
                  type="text"
                  id="meeting-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="회의 제목을 입력해주세요."
                />
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="meeting-date">
                  회의 일시 <span>*</span>
                </StyledLabel>
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
                <LabelButtonWrapper>
                  <StyledLabel>
                    회의 참석자 <span>*</span>
                  </StyledLabel>
                  <StyledAddAttendeeButton
                    type="button"
                    onClick={handleAddAttendee}
                  >
                    <img src={AddUserIcon} alt="참석자 추가" />
                  </StyledAddAttendeeButton>
                </LabelButtonWrapper>
                <AttendInfo
                  attendees={attendees}
                  setAttendees={setAttendees}
                  projectUsers={projectUsers}
                  hostId={hostId}
                  setHostId={setHostId}
                />
              </FormGroup>

              <FormGroup>
                <StyledLabel>
                  회의 음성 <span>*</span>
                </StyledLabel>
                <StyledUploadSection>
                  {file ? (
                    <div
                      style={{
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        color: '#351745',
                      }}
                    >
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

              <StyledUploadButton onClick={handleUpload}>
                회의 분석하기
              </StyledUploadButton>
              {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
            </>
          )}
        </RightPanel>
      </ContentWrapper>
      {showPopup && <NewProjectPopup onClose={() => setShowPopup(false)} />}{' '}
      {/* 팝업 렌더링 */}
    </PageWrapper>
  );
};

export default InsertConferenceInfo;

const StyledAddAttendeeButton = styled.button`
  background-color: transparent; /* 배경색 투명하게 */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0; /* 패딩 제거 */
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: auto; /* 레이블과 버튼 사이 간격 조절 */

  &:hover {
    background-color: transparent; /* 호버 시에도 배경 투명 유지 */
    opacity: 0.8; /* 호버 시 투명도 조절 */
  }

  img {
    width: 24px; /* 아이콘 크기 조정 */
    height: 24px;
  }
`;

const LabelButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* StyledLabel의 margin-bottom과 동일하게 */
`;

const PageWrapper = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh; /* height를 min-height로 변경하여 내용에 따라 확장 가능하게 함 */
  /* overflow: hidden; */ /* 삼각형 테스트를 위해 제거 */
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const LeftPanel = styled.div`
  width: 940px; /* 좌측 패널 고정 너비 */
  background-color: #f7f7f7; /* 좌측 패널 배경색 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 위에서부터 정렬 */
  align-items: center; /* 자식 요소들을 가운데로 정렬 */
  gap: 1rem; /* 간격 줄임 */
  padding: 40px; /* 전체 패널 패딩 */
  position: relative; /* 자식 요소의 절대 위치 지정을 위해 추가 */
  /* height: 100%; */ /* 높이 고정 */
  /* overflow-y: auto; */ /* 스크롤 활성화 */
`;

const RightPanel = styled.div`
  width: 800px;
  background-color: #351745; /* 우측 패널 배경색 */
  padding: 40px;
  display: flex;
  flex-direction: column;
  color: white;
  position: relative;
  min-height: 110vh; /* 전체 높이를 차지하도록 설정 */
  /* overflow-y: auto; */ /* 삼각형 테스트를 위해 제거 */

  &::before {
    content: '';
    position: fixed; /* fixed 유지 */
    left: 1000px; /* LeftPanel 너비에 맞춰 조정 */
    top: 200px; /* 고정 위치에 맞게 상단 여백 조정 */
    width: 0;
    height: 0;
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    border-right: 30px solid #351745; /* RightPanel 배경색과 동일 */
    /* margin-left: -30px; */ /* LeftPanel 쪽으로 돌출되는 margin 제거 */
    z-index: 9999;
  }
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
  font-size: 1rem;
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
  margin-bottom: 25px;
  text-align: left;
  display: flex; /* 아이콘과 텍스트를 나란히 정렬 */
  align-items: center; /* 세로 중앙 정렬 */

  img {
    width: 28px; /* 아이콘 크기 조정 */
    height: 28px;
    margin-right: 10px; /* 아이콘과 텍스트 사이 간격 */
  }
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
    color: #ed6e00; /* 필수 입력 표시를 위한 색상 변경 */
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
  font-family: 'Rethink Sans', sans-serif; /* 폰트 변경 */
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;

  &::placeholder {
    color: #999;
  }
`;

// const StyledSelect = styled.select`
//   width: 100%;
//   padding: 12px 15px;
//   border: none;
//   border-radius: 8px;
//   background-color: rgba(255, 255, 255, 0.9);
//   color: #333;
//   font-size: 1rem;
//   box-sizing: border-box;
//   -webkit-appearance: none; /* 기본 select 스타일 제거 */
//   -moz-appearance: none;
//   appearance: none;
//   background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13%205.1L146.2%20202.7%2018.5%2074.5a17.6%2017.6%200%200%200-25.1%2024.9l130.2%20129.8c6.8%206.7%2017.7%206.7%2024.5%200l130.2-129.8a17.6%2017.6%200%200%200-11.9-29.4z%22%2F%3E%3C%2Fsvg%3E"); /* 커스텀 화살표 */
//   background-repeat: no-repeat;
//   background-position: right 15px center;
//   background-size: 12px;
// `;

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
  padding: 20px; /* 이전 값으로 복원 */
  position: relative;
  min-height: 50px;

  h2 {
    color: #351745;
  }
`;

const FileUploadWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  left: 15px;
`;

const RecordUploadWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  right: 15px;
`;

const StyledUploadButton = styled.button`
  padding: 15px 30px;
  background-color: #00b4ba; /* 보라색 계열 */
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 40px; /* 하단 여백 추가 */

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover {
    background-color: #00939a; /* hover 색상 조정 */
  }
`;
