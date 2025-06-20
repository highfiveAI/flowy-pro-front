import React, { useState } from 'react';
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
import { fetchMeetingsWithUsers } from '../../api/fetchProject';
import EditProjectPopup from './conference_popup/EditProjectPopup.tsx';

const EditIcon = styled.div`
  cursor: pointer;
  width: 16px;
  height: 16px;
  background-image: url('/images/edit.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-left: auto;
`;

// const ProjectHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 20px;
//   position: relative;
// `;

const StyledErrorMessage = styled.div`
  background-color: #ffe6e6;
  color: #cc0000;
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
  padding-bottom: 20px;
`;

// const ContainerHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 20px;
//   width: 100%;
// `;

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
  overflow-x: hidden; /* 가로 스크롤 비활성화 */
  margin-top: 10px; /* 버튼을 위한 상단 여백 추가 */
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin-top: 16px;
  margin-bottom: 8px;
  &:first-child {
    margin-top: 0;
  }
`;

const ExpandedArea = styled.div`
  padding: 20px 24px;
  background-color: #fafafa;
  border-left: 3px solid #351745;
  margin: 0 0 10px 10px;
  font-size: 15px;
  color: #555;

  animation: fadeIn 0.3s ease;
  max-height: 250px;
  overflow-y: auto;

  .user-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .user-name {
    background-color: #ebe8ed;
    padding: 6px 14px;
    border-radius: 16px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
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
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  z-index: 10;

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

const MeetingList = styled.div`
  .meeting-list {
    margin-top: 10px;
  }

  .meeting-item {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e9ecef;
      border-color: #00b4ba;
    }

    &.selected {
      background: #e3f2fd;
      border-color: #00b4ba;
      border-width: 2px;
    }

    .meeting-title {
      font-weight: 600;
      color: #351745;
      margin-bottom: 4px;
      font-size: 0.95rem;
    }

    .meeting-date {
      color: #6c757d;
      font-size: 0.85rem;
      margin-bottom: 4px;
    }

    .meeting-attendees {
      color: #495057;
      font-size: 0.85rem;
    }
  }
`;

// const TabBtn = styled.button<{ active: boolean }>`
//   flex: 1;
//   height: 56px;
//   background: ${({ active }) => (active ? '#e5e0ee' : 'transparent')};
//   color: ${({ active }) => (active ? '#351745' : '#fff')};
//   border: none;
//   font-size: 1.18rem;
//   font-weight: 700;
//   cursor: pointer;
//   transition: background 0.2s, color 0.2s;
//   margin-right: 2px;
//   outline: none;
//   letter-spacing: -0.5px;
//   z-index: ${({ active }) => (active ? 2 : 1)};
//   &:last-child { margin-right: 0; }
// `;

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

// <editor-fold desc="Layout Components">
const PageWrapper = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  padding-top: 30px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const LeftPanel = styled.div`
  flex: 1.5;
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
  flex: 1;
  min-width: 420px;
  background: #351745;
  padding: 0;
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 0 0 16px 0; /* 상단 우측 모서리 radius 제거 */
  box-shadow: 0 2px 16px rgba(53, 23, 69, 0.04);
`;

// const TabSectionWrapper = styled.div`
//   /* border-radius: 16px 16px 0 0; */ /* 제거 */
//   overflow: hidden;
//   background: #351745;
//   width: 100%;
//   position: relative;
//   z-index: 1;
// `;

const TabsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
  background: #351745;
  /* border-radius: 16px 16px 0 0; */ /* 제거 */
  overflow: hidden;
  position: relative;
`;

// const TabPanel = styled.div`
//   flex: 1;
//   background: #351745;
//   border-radius: 0 0 16px 16px;
//   padding: 36px 36px 32px 36px;
//   min-height: 600px;
//   display: flex;
//   flex-direction: column;
//   align-items: stretch;
// `;

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

  const [projectMeetings, setProjectMeetings] = React.useState<any[]>([]); // 프로젝트 회의 목록 상태 추가
  const [selectedMeeting, setSelectedMeeting] = React.useState<any>(null); // 선택된 회의 상태 추가
  const [hostId, setHostId] = React.useState('');
  const [showAnalysisRequestedPopup, setShowAnalysisRequestedPopup] =
    React.useState(false);

  const [hostEmail, setHostEmail] = useState('');
  const [hostJobname, setHostJobname] = useState('');
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  // 정렬 함수
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.projectCreatedDate).getTime();
    const dateB = new Date(b.projectCreatedDate).getTime();
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  // const [isSortedByLatest, setIsSortedByLatest] = useState(false);

  const [activeTab, setActiveTab] = useState<'new' | 'load'>('new');
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 추가
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(
    null
  );

  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);
  // const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
  //   null
  // );

  const [showEditProjectPopup, setShowEditProjectPopup] = useState(false);

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

  // 프로젝트 선택 핸들러 함수
  const handleProjectSelect = async (
    projectId: string,
    projectName: string
  ) => {
    console.log('프로젝트 선택됨:', { projectId, projectName }); // 디버깅 로그
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

    // 기존 회의 불러오기 탭일 때 회의 목록도 불러오기
    if (activeTab === 'load') {
      try {
        const meetingsData = await fetchMeetingsWithUsers(projectId);
        if (meetingsData) {
          setProjectMeetings(meetingsData);
        } else {
          setProjectMeetings([]);
        }
      } catch (e) {
        console.error('프로젝트 회의 목록을 가져오는데 실패했습니다:', e);
        setProjectMeetings([]);
      }
    }
  };

  React.useEffect(() => {
    setUsername(user?.name || '');
  }, [user]);

  // user.id로 프로젝트 목록과 사용자 이름 불러오기
  React.useEffect(() => {
    if (!user?.id) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/projects/${user.id}`, {
      credentials: 'include',
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem('token')}`,
      // },
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

  // 탭 변경 시 회의 목록 업데이트
  React.useEffect(() => {
    if (activeTab === 'load' && projectId) {
      fetchMeetingsWithUsers(projectId)
        .then((meetingsData) => {
          if (meetingsData) {
            setProjectMeetings(meetingsData);
          } else {
            setProjectMeetings([]);
          }
        })
        .catch((e) => {
          console.error('프로젝트 회의 목록을 가져오는데 실패했습니다:', e);
          setProjectMeetings([]);
        });
    } else if (activeTab === 'new') {
      setProjectMeetings([]);
      setSelectedMeeting(null);
      // 새 회의 만들기 탭으로 돌아갈 때 폼 초기화
      setSubject('');
      setAgenda('');
      setMeetingDate(null);
      setAttendees([{ user_id: '', name: '', email: '', user_jobname: '' }]);
      setFile(null);
      // 프로젝트 선택 상태는 유지 (사용자가 다시 선택할 필요 없도록)
    }
  }, [activeTab]); // projectId 의존성 제거

  // 회의 선택 시 폼에 정보 자동 입력
  const handleMeetingSelect = (meeting: any) => {
    setSelectedMeeting(meeting);
    setSubject(meeting.meeting_title || '');
    setAgenda(meeting.meeting_agenda || '');
    setMeetingDate(
      meeting.meeting_date ? new Date(meeting.meeting_date) : null
    );

    // 참석자 정보 설정
    if (meeting.meeting_users && meeting.meeting_users.length > 0) {
      const attendeesData = meeting.meeting_users.map((mu: any) => ({
        user_id: mu.user.user_id || '',
        name: mu.user.user_name || '',
        email: mu.user.user_email || '',
        user_jobname: mu.user.user_jobname || '',
      }));
      setAttendees(attendeesData);
    } else {
      setAttendees([{ user_id: '', name: '', email: '', user_jobname: '' }]);
    }

    // 파일 상태 초기화 (새로운 음성 파일을 업로드할 수 있도록)
    setFile(null);
  };

  // --- 드래그 앤 드롭 핸들러 ---
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const openEditPopup = (project: ProjectResponse) => {
    setEditingProject(project);
    setShowEditProjectPopup(true);
  };

  const closeEditPopup = () => {
    setEditingProject(null);
    setShowEditProjectPopup(false);
    fetchProjects(); // 수정 후 목록 새로고침
  };

  const fetchProjects = async () => {
    // ... existing code ...
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <LeftPanel>
          <ProjectListTitle>
            [ {username} ] 님이 참여 중인 프로젝트 목록
          </ProjectListTitle>

          <ContainerWrapper>
            <NewProjectWrapper onClick={() => setShowNewProjectPopup(true)}>
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
                정렬 기준:
                <SortText>
                  <StyledSelect
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as 'latest' | 'oldest')
                    }
                    style={{ marginLeft: '0.5rem' }}
                  >
                    <option value="latest">최신순</option>
                    <option value="oldest">오래된순</option>
                  </StyledSelect>
                </SortText>
              </SortWrapper>
              <ProjectList>
                {sortedProjects.length > 0 ? (
                  sortedProjects.map((proj, index) => (
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
                        <EditIcon
                          onClick={(e) => {
                            e.stopPropagation(); // 이벤트 버블링 방지
                            openEditPopup(proj);
                          }}
                        />
                        <span className="date">
                          {new Date(proj.projectCreatedDate)
                            .toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })
                            .replace('T', ' ')
                            .slice(0, 16)}
                        </span>
                      </ProjectListItem>

                      {expandedIndex === index && (
                        <ExpandedArea>
                          {activeTab === 'new' ? (
                            <>
                              <SectionTitle>프로젝트 참여자</SectionTitle>
                              <div className="user-list">
                                {projectUsers.length > 0 ? (
                                  projectUsers.map((user) => (
                                    <span
                                      key={user.user_id}
                                      className="user-name"
                                    >
                                      {user.name}
                                    </span>
                                  ))
                                ) : (
                                  <span>참여자가 없습니다.</span>
                                )}
                              </div>
                              <SectionTitle>프로젝트 내용</SectionTitle>
                              {proj.projectDetail ? (
                                <span style={{ lineHeight: 1.6 }}>
                                  {proj.projectDetail}
                                </span>
                              ) : (
                                <span style={{ color: '#888' }}>
                                  상세 내용이 없습니다.
                                </span>
                              )}
                            </>
                          ) : (
                            <MeetingList>
                              <SectionTitle>회의 목록</SectionTitle>
                              <div className="meeting-list">
                                {projectMeetings.length > 0 ? (
                                  projectMeetings.map(
                                    (meeting, meetingIndex) => (
                                      <div
                                        key={meetingIndex}
                                        className={`meeting-item ${
                                          selectedMeeting?.meeting_id ===
                                          meeting.meeting_id
                                            ? 'selected'
                                            : ''
                                        }`}
                                        onClick={() =>
                                          handleMeetingSelect(meeting)
                                        }
                                      >
                                        <div className="meeting-title">
                                          {meeting.meeting_title}
                                        </div>
                                        <div className="meeting-date">
                                          {new Date(meeting.meeting_date)
                                            .toLocaleString('sv-SE', {
                                              timeZone: 'Asia/Seoul',
                                            })
                                            .replace('T', ' ')
                                            .slice(0, 16)}
                                        </div>
                                        <div className="meeting-attendees">
                                          참석자:{' '}
                                          {meeting.meeting_users
                                            ?.map(
                                              (mu: any) => mu.user.user_name
                                            )
                                            .join(', ') || '없음'}
                                        </div>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <span>회의가 없습니다.</span>
                                )}
                              </div>
                            </MeetingList>
                          )}
                        </ExpandedArea>
                      )}
                    </div>
                  ))
                ) : (
                  <ProjectListItem>프로젝트가 없습니다.</ProjectListItem>
                )}
              </ProjectList>
            </ProjectListContainer>
          </ContainerWrapper>

          <NewProjectWrapper onClick={() => setShowPopup(true)}>
            <img src={AddProjectIcon} alt="신규 프로젝트 추가" />
            <NewProjectTextsContainer>
              <NewProjectTextTop>찾는 프로젝트가 없나요?</NewProjectTextTop>
              <NewProjectTextBottom>
                신규 프로젝트 추가하기
              </NewProjectTextBottom>
            </NewProjectTextsContainer>
          </NewProjectWrapper>
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
              {activeTab === 'new' ? (
                <>
                  <PageTitle>
                    <img src={NewMeetingIcon} alt="새 회의" />새 회의 정보
                    입력하기
                  </PageTitle>
                  {!projectId ? (
                    <div
                      style={{
                        color: '#fff',
                        marginTop: 40,
                        fontSize: '1.1rem',
                        textAlign: 'center',
                      }}
                    >
                      좌측 프로젝트 목록에서 프로젝트를 선택해주세요.
                    </div>
                  ) : isCompleted ? (
                    <ResultContents result={result} />
                  ) : isLoading ? (
                    <Loading />
                  ) : (
                    <>
                      {/* 회의 등록 폼 */}
                      {/* 프로젝트명 */}
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

                      {/* 회의 제목 */}
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

                      {/* 회의 일시 */}
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

                      {/* 회의 안건 */}
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

                      {/* 참석자 */}
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

                      {/* 파일 업로드 */}
                      <FormGroup>
                        <StyledLabel>
                          회의 음성 <span>*</span>
                        </StyledLabel>
                        <StyledUploadSection
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          $isDragging={isDragging}
                        >
                          {file ? (
                            <FileInfoContainer>
                              <FileInfo>
                                <FileLabel>파일명:</FileLabel>
                                <FileName>{file.name}</FileName>
                              </FileInfo>
                              <RemoveFileButton onClick={() => setFile(null)}>
                                ✕
                              </RemoveFileButton>
                            </FileInfoContainer>
                          ) : (
                            <>
                              <DropZoneMessage>
                                이곳에 파일을 드래그하거나 아이콘을 클릭하세요.
                              </DropZoneMessage>
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
              ) : activeTab === 'load' ? (
                <>
                  <PageTitle>
                    <img src={NewMeetingIcon} alt="기존 회의" />
                    기존 회의 정보 수정하기
                  </PageTitle>
                  {!selectedMeeting ? (
                    <div
                      style={{
                        color: '#fff',
                        marginTop: 40,
                        fontSize: '1.1rem',
                        textAlign: 'center',
                      }}
                    >
                      좌측 프로젝트 목록에서 회의를 선택해주세요.
                    </div>
                  ) : isCompleted ? (
                    <ResultContents result={result} />
                  ) : isLoading ? (
                    <Loading />
                  ) : (
                    <>
                      {/* 기존 회의 수정 폼 (new 탭과 거의 동일) */}
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
                        <StyledUploadSection
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          $isDragging={isDragging}
                        >
                          {file ? (
                            <FileInfoContainer>
                              <FileInfo>
                                <FileLabel>파일명:</FileLabel>
                                <FileName>{file.name}</FileName>
                              </FileInfo>
                              <RemoveFileButton onClick={() => setFile(null)}>
                                ✕
                              </RemoveFileButton>
                            </FileInfoContainer>
                          ) : (
                            <>
                              <DropZoneMessage>
                                이곳에 파일을 드래그하거나 아이콘을 클릭하세요.
                              </DropZoneMessage>
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
      {showNewProjectPopup && (
        <NewProjectPopup onClose={() => setShowNewProjectPopup(false)} />
      )}
      {showAnalysisRequestedPopup && (
        <AnalysisRequestedPopup
          onClose={() => {
            setShowAnalysisRequestedPopup(false);
            navigate('/'); // 홈으로 이동
          }}
        />
      )}
      {showEditProjectPopup && editingProject && (
        <EditProjectPopup
          onClose={closeEditPopup}
          projectToEdit={editingProject}
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
  font-family: 'Rethink Sans', sans-serif; /* 폰트 적용 */
  box-sizing: border-box;
  height: 120px; /* 고정 높이 설정 */
  resize: none; /* 사이즈 조정 비활성화 */
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

interface StyledUploadSectionProps {
  $isDragging: boolean;
}

const StyledUploadSection = styled.div<StyledUploadSectionProps>`
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 20px;
  position: relative;
  min-height: 50px;
  transition: all 0.2s ease-in-out;
  border: 2px dashed
    ${({ $isDragging }) => ($isDragging ? '#00b4ba' : 'transparent')};
  transform: ${({ $isDragging }) => ($isDragging ? 'scale(1.02)' : 'scale(1)')};

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

const DropZoneMessage = styled.div`
  color: #888;
  font-size: 0.95rem;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  pointer-events: none; /* 메시지가 드래그 이벤트를 방해하지 않도록 */
`;

const FileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 1rem;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const FileLabel = styled.span`
  font-weight: 600;
  color: #351745;
  margin-right: 8px;
`;

const FileName = styled.span`
  color: #351745;
  font-weight: 500;
`;

const RemoveFileButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background: #c82333;
  }
`;

const ContainerWrapper = styled.div`
  position: relative;
  margin-top: 60px; /* ProjectListTitle과 버튼 사이 간격 추가 */
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

const StyledSelect = styled.select`
  padding: 6px 12px;
  margin-left: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #888;
  }

  &:focus {
    border-color: #5a2a84;
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
