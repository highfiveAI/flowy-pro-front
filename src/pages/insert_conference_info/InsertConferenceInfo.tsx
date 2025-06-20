import React, { useState, useEffect } from 'react';
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
// import { checkAuth } from "../../api/fetchAuthCheck";
import AnalysisRequestedPopup from './conference_popup/AnalysisRequestedPopup'; // 팝업 컴포넌트 임포트
import type { ProjectResponse } from '../../types/project';

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

const ExpandedArea = styled.div`
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-left: 4px solid #007bff;
  margin-bottom: 10px;
  font-size: 16px;
  color: #444;
  animation: fadeIn 0.3s ease;

  .user-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 5px;
  }

  .user-name {
    background-color: #e0f0ff;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 14px;
    color: #007bff;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ProjectList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`;

const ProjectListItem = styled.li`
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .name {
    text-align: left;
    flex: 1;
  }

  .date {
    text-align: right;
    color: #666;
    font-size: 16px;
    flex-shrink: 0; /* 시간 줄어들지 않게 */
    width: 160px; /* 고정 너비로 오른쪽 정렬 안정화 */
  }

  &:hover {
    opacity: 0.8;
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCompleted /*, setIsCompleted*/] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [subject, setSubject] = React.useState('');
  const [attendees, setAttendees] = React.useState([
    { user_id: '', name: '', email: '', user_jobname: '' },
  ]);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>('');
  const [agenda, setAgenda] = React.useState('');
  const [meetingDate, setMeetingDate] = React.useState<Date | null>(null);
  const [result /*, setResult*/] = React.useState<any>(null);
  const [projectName, setProjectName] = React.useState<string>('');
  const [projectId, setProjectId] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');

  const [showPopup, setShowPopup] = React.useState<boolean>(false); // 팝업 표시 상태 추가

  const [projects, setProjects] = React.useState<ProjectResponse[]>([]); // projectId 필드 추가
  const [projectUsers, setProjectUsers] = React.useState<
    { user_id: string; name: string; email: string; user_jobname: string }[]
  >([]); // 프로젝트 참여자 목록 상태 추가
  const [hostId, setHostId] = React.useState('');
  const [showAnalysisRequestedPopup, setShowAnalysisRequestedPopup] =
    React.useState(false);
  const [hostEmail, setHostEmail] = useState('');
  const [hostJobname, setHostJobname] = useState('');
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const [isSortedByLatest, setIsSortedByLatest] = useState(false);

  const [activeTab, setActiveTab] = useState<'new' | 'load'>('new');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const [projectDetail, setProjectDetail] = useState<string>('');
  const [meetings, setMeetings] = useState<any[]>([]); // 회의 목록
  const [meetingInfo, setMeetingInfo] = useState<any>(null); // 회의 상세 정보

  // --- 더미 데이터 (테스트용) ---
  const dummyMeetings = [
    {
      meetingId: 'm1',
      meetingTitle: '여름 캠페인 킥오프',
      meetingDate: '2024-06-01',
    },
    {
      meetingId: 'm2',
      meetingTitle: '중간 점검 회의',
      meetingDate: '2024-06-10',
    },
    { meetingId: 'm3', meetingTitle: '최종 보고회', meetingDate: '2024-06-20' },
  ];
  const dummyMeetingInfo = {
    meetingId: 'm1',
    projectId: 'p1',
    projectName: '여름 캠페인',
    subject: '여름 캠페인 킥오프',
    agenda: '캠페인 목표 공유 및 역할 분담',
    meetingDate: '2024-06-01T10:00:00',
    attendees: [
      {
        user_id: 'u1',
        name: '홍길동',
        email: 'hong@test.com',
        user_jobname: 'PM',
      },
      {
        user_id: 'u2',
        name: '김철수',
        email: 'kim@test.com',
        user_jobname: '디자이너',
      },
    ],
    hostId: 'u1',
    hostEmail: 'hong@test.com',
    hostJobname: 'PM',
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

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
      const hostUser = projectUsers.find((u) => u.user_id === hostId);
      const hostName = hostUser?.name || '';
      // const hostEmail = hostUser?.email || "";
      // const hostJobname = hostUser?.user_jobname || "";

      // 참석자 정보(회의장 제외)
      const filteredAttendees = attendees.filter(
        (a) => a.user_id && a.user_id !== hostId
      );
      const attendeesName = filteredAttendees.map((a) => a.name);
      const attendeesEmail = filteredAttendees.map((a) => a.email);
      const attendeesRole = filteredAttendees.map((a) => a.user_jobname);

      const sttFormData = new FormData();
      sttFormData.append('file', file, file.name);
      sttFormData.append('subject', subject);
      sttFormData.append('agenda', agenda);
      sttFormData.append(
        'meeting_date',
        meetingDate ? formatDateToKST(meetingDate) : ''
      );
      sttFormData.append('project_name', projectName);
      // host 정보
      sttFormData.append('host_name', hostName);
      sttFormData.append('host_email', hostEmail);
      sttFormData.append('host_role', hostJobname);
      // 참석자 정보 (각각 여러 번 append)
      attendeesName.forEach((name) =>
        sttFormData.append('attendees_name', name)
      );
      attendeesEmail.forEach((email) =>
        sttFormData.append('attendees_email', email)
      );
      attendeesRole.forEach((role) =>
        sttFormData.append('attendees_role', role)
      );

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
      meetingFormData.append('host_role', hostJobname);
      // 참석자 정보
      attendeesName.forEach((name) =>
        meetingFormData.append('attendees_name', name)
      );
      attendeesEmail.forEach((email) =>
        meetingFormData.append('attendees_email', email)
      );
      attendeesRole.forEach((role) =>
        meetingFormData.append('attendees_role', role)
      );

      // 콘솔로 값 확인
      console.log('hostId:', hostId);
      console.log('hostName:', hostName);
      console.log('hostEmail:', hostEmail);
      console.log('hostJobname:', hostJobname);
      console.log('attendeesName:', attendeesName);
      console.log('attendeesEmail:', attendeesEmail);
      console.log('attendeesRole:', attendeesRole);

      try {
        // 1. STT API 호출
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

        // 2. Meeting Upload API 호출
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

        // 3. analyze-meeting API 호출 (결과는 기다리지 않음)
        const sttResult = await sttResponse.json();
        const meetingResult = await meetingResponse.json();

        console.log('STT 서버 응답:', sttResult);
        console.log('Meeting 서버 응답:', meetingResult);

        const meetingId = meetingResult.meeting_id;
        if (meetingId) {
          const analyzeFormData = new FormData();
          analyzeFormData.append('meeting_id', meetingId);
          analyzeFormData.append('project_name', projectName);
          analyzeFormData.append('subject', subject);

          analyzeFormData.append(
            'chunks',
            JSON.stringify(sttResult.chunks || [])
          );
          analyzeFormData.append('host_name', hostName);
          analyzeFormData.append('host_email', hostEmail);
          analyzeFormData.append('host_role', hostJobname);

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

          fetch(`${import.meta.env.VITE_API_URL}/api/v1/stt/analyze-meeting/`, {
            method: 'POST',
            body: analyzeFormData,
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          //           const analyzeData = await analyzeResponse.json();
          //           console.log('분석 결과:', analyzeData);

          //           alert('업로드가 완료되었습니다.');
          //           setSubject('');
          //           setAttendees([
          //             { user_id: '', name: '', email: '', user_jobname: '' },
          //           ]);
          //           setFile(null);
          //           setAgenda('');
          //           setMeetingDate(null);
          //           setResult(analyzeData); // 분석 결과를 결과로 설정
          //           setIsCompleted(true);
          //         } else {
          //           alert('업로드가 완료되었지만, 분석 결과를 가져오지 못했습니다.');
          //           setResult(null);
          //           setIsCompleted(true);
        }

        // 4. 성공 시 팝업 띄우기
        setShowAnalysisRequestedPopup(true);

        // 입력값 초기화
        setSubject('');
        setAttendees([{ user_id: '', name: '', email: '', user_jobname: '' }]);
        setFile(null);
        setAgenda('');
        setMeetingDate(null);
        setHostEmail('');
        setHostJobname('');
        setHostId('');
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

  // 프로젝트 선택 시 참여자/상세 fetch (activeTab에 따라 분기)
  const handleProjectSelect = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedMeetingId('');
    setMeetingInfo(null);
    if (activeTab === 'new') {
      // 기존 참여자 목록 fetch 코드 유지
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/stt/project-users/${projectId}`,
          {
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await res.json();
        setProjectUsers(
          data.users.map((u: any) => ({
            user_id: u.user_id,
            name: u.name,
            email: u.email,
            user_jobname: u.user_jobname,
          }))
        );
        setAttendees([{ user_id: '', name: '', email: '', user_jobname: '' }]);
      } catch (e) {
        setProjectUsers([]);
        setAttendees([{ user_id: '', name: '', email: '', user_jobname: '' }]);
      }
    } else if (activeTab === 'load') {
      // 더미 회의 목록 사용
      setMeetings(dummyMeetings);
    }
  };

  const handleSortByLatest = () => {
    setIsSortedByLatest((prev) => !prev);
    setExpandedIndex(null);
  };

  // 회의 선택 시 상세 fetch (load 탭)
  const handleMeetingSelect = async (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    // 더미 meetingInfo 사용
    setMeetingInfo({ ...dummyMeetingInfo, meetingId });
  };

  React.useEffect(() => {
    setUsername(user?.name || '');
  }, [user]);

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
  }, [user?.id, showPopup]);

  // 기존 회의 불러오기 탭에서 meetingInfo가 바뀔 때 폼 상태 자동 채우기
  useEffect(() => {
    if (activeTab === 'load' && meetingInfo) {
      setProjectName(meetingInfo.projectName || '');
      setProjectId(meetingInfo.projectId || '');
      setSubject(meetingInfo.subject || meetingInfo.meetingTitle || '');
      setAgenda(meetingInfo.agenda || '');
      setMeetingDate(
        meetingInfo.meetingDate ? new Date(meetingInfo.meetingDate) : null
      );
      setAttendees(meetingInfo.attendees || []);
      setHostId(meetingInfo.hostId || '');
      setHostEmail(meetingInfo.hostEmail || '');
      setHostJobname(meetingInfo.hostJobname || '');
      // 파일, result 등은 필요에 따라 추가
    }
  }, [activeTab, meetingInfo]);

  // 새 회의 만들기 탭으로 전환 시 폼 상태 초기화
  useEffect(() => {
    if (activeTab === 'new') {
      setProjectName('');
      setProjectId('');
      setSubject('');
      setAgenda('');
      setMeetingDate(null);
      setAttendees([{ user_id: '', name: '', email: '', user_jobname: '' }]);
      setHostId('');
      setHostEmail('');
      setHostJobname('');
      setFile(null);
      setError('');
    }
  }, [activeTab]);

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
              <SortText onClick={handleSortByLatest}>
                {isSortedByLatest ? '원래대로 보기' : '최신순으로 정렬'}
              </SortText>
            </SortWrapper>
            <ProjectList>
              {(projects.length > 0
                ? isSortedByLatest
                  ? [...projects].sort(
                      (a, b) =>
                        new Date(b.projectCreatedDate).getTime() -
                        new Date(a.projectCreatedDate).getTime()
                    )
                  : projects
                : []
              ).map((proj, index) => (
                <div key={index}>
                  <ProjectListItem
                    onClick={() => {
                      handleProjectSelect(proj.projectId, proj.projectName);
                      toggleExpanded(index);
                    }}
                  >
                    <span className="name">
                      {index + 1}. {proj.projectName}
                    </span>
                    <span className="date">
                      {new Date(proj.projectCreatedDate)
                        .toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })
                        .replace('T', ' ')
                        .slice(0, 16)}
                    </span>
                  </ProjectListItem>

                  {expandedIndex === index && (
                    <ExpandedArea>
                      <p>참여자:</p>
                      <div className="user-list">
                        {projectUsers.map((user) => (
                          <span key={user.user_id} className="user-name">
                            {user.name}
                          </span>
                        ))}
                      </div>
                      <p>
                        프로젝트 내용:&nbsp;
                        {proj.projectDetail ? (
                          <span>{proj.projectDetail}</span>
                        ) : (
                          <span>상세 내용이 없습니다.</span>
                        )}
                      </p>
                    </ExpandedArea>
                  )}
                </div>
              ))}
              {projects.length === 0 && (
                <ProjectListItem>프로젝트가 없습니다.</ProjectListItem>
              )}
            </ProjectList>
          </ProjectListContainer>
        </LeftPanel>
        <RightPanel>
          <TabSectionWrapper>
            <TabsWrapper>
              <TabBtn
                active={activeTab === 'new'}
                onClick={() => setActiveTab('new')}
              >
                새 회의 만들기
              </TabBtn>
              <TabBtn
                active={activeTab === 'load'}
                onClick={() => setActiveTab('load')}
              >
                기존 회의 불러오기
              </TabBtn>
            </TabsWrapper>
            <TabPanel>
              {activeTab === 'new' || (activeTab === 'load' && meetingInfo) ? (
                <>
                  <PageTitle>
                    <img src={NewMeetingIcon} alt="새 회의" />
                    {activeTab === 'new'
                      ? '새 회의 정보 입력하기'
                      : '회의 정보 확인/음성 업로드'}
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
                          onClick={() =>
                            alert('프로젝트 목록중에서 선택해주세요')
                          }
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
                            onChange={(date: Date | null) =>
                              setMeetingDate(date)
                            }
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
                        <StyledLabel htmlFor="meeting-agenda">
                          회의 안건
                        </StyledLabel>
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
                          hostEmail={hostEmail}
                          setHostEmail={setHostEmail}
                          hostJobname={hostJobname}
                          setHostJobname={setHostJobname}
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
                      {error && (
                        <StyledErrorMessage>{error}</StyledErrorMessage>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div
                  style={{ color: '#fff', marginTop: 40, fontSize: '1.1rem' }}
                >
                  {activeTab === 'load'
                    ? '회의를 선택하면 정보가 여기에 표시됩니다.'
                    : '불러올 회의 리스트 또는 검색 UI가 들어갑니다.'}
                </div>
              )}
            </TabPanel>
          </TabSectionWrapper>
        </RightPanel>
      </ContentWrapper>
      {showPopup && <NewProjectPopup onClose={() => setShowPopup(false)} />}{' '}
      {/* 팝업 렌더링 */}
      {showAnalysisRequestedPopup && (
        <AnalysisRequestedPopup
          onClose={() => {
            setShowAnalysisRequestedPopup(false);
            navigate('/'); // 홈으로 이동
          }}
        />
      )}
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
  min-height: 100vh;
  padding-top: 80px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const LeftPanel = styled.div`
  width: 940px;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding: 40px;
  position: relative;
`;

const RightPanel = styled.div`
  width: 540px;
  min-width: 420px;
  background: #351745;
  padding: 0;
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 0 16px 16px 0;
  box-shadow: 0 2px 16px rgba(53, 23, 69, 0.04);
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
  margin-bottom: 22px;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1.08rem;
  color: #fff;
  font-weight: 600;
  span {
    color: #ed6e00;
    font-weight: 700;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 13px 18px;
  border: none;
  border-radius: 8px;
  background: #f7f7f7;
  color: #351745;
  font-size: 1.05rem;
  font-weight: 500;
  box-sizing: border-box;
  margin-bottom: 2px;
  &::placeholder {
    color: #bdbdbd;
    font-weight: 400;
    font-size: 1.02rem;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 13px 18px;
  border: none;
  border-radius: 8px;
  background: #f7f7f7;
  color: #351745;
  font-size: 1.05rem;
  font-weight: 500;
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;
  &::placeholder {
    color: #bdbdbd;
    font-weight: 400;
    font-size: 1.02rem;
  }
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
    padding: 13px 18px;
    border: none;
    border-radius: 8px;
    background: #f7f7f7;
    color: #351745;
    font-size: 1.05rem;
    font-weight: 500;
    box-sizing: border-box;
    &::placeholder {
      color: #bdbdbd;
      font-weight: 400;
      font-size: 1.02rem;
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
  padding: 15px 0;
  background-color: #00b4ba;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 40px;
  transition: background 0.2s;
  &:hover {
    background-color: #00939a;
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
  background: #351745;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  position: relative;
`;
const TabBtn = styled.button<{ active: boolean }>`
  flex: 1;
  height: 56px;
  background: ${({ active }) => (active ? '#e5e0ee' : 'transparent')};
  color: ${({ active }) => (active ? '#351745' : '#fff')};
  border: none;
  font-size: 1.18rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-top-left-radius: ${({ active }) => (active ? '16px' : '0')};
  border-top-right-radius: ${({ active }) => (active ? '16px' : '0')};
  margin-right: 2px;
  outline: none;
  letter-spacing: -0.5px;
  z-index: ${({ active }) => (active ? 2 : 1)};
  &:last-child {
    margin-right: 0;
  }
`;
const TabPanel = styled.div`
  flex: 1;
  background: #351745;
  border-radius: 0 0 16px 16px;
  padding: 36px 36px 32px 36px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const TabSectionWrapper = styled.div`
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  background: #351745;
  width: 100%;
  position: relative;
  z-index: 1;
`;
