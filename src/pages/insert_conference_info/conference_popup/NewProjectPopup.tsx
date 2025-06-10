import React from 'react';
import styled from 'styled-components';
// import AddProjectIcon from "/images/addprojecticon.svg"; // AddProjectIcon 임포트
import AddProjectIcon2 from '/images/addprojecticon2.svg'; // AddProjectIcon2 임포트

interface PopupProps {
  onClose: () => void;
}

const NewProjectPopup: React.FC<PopupProps> = ({ onClose }) => {
  // 팝업 내부 상태
  const [projectName, setProjectName] = React.useState('');
  const [projectAttendees, setProjectAttendees] = React.useState('');

  const handleCreateProject = () => {
    // 프로젝트 생성 로직 (예시)
    console.log('프로젝트명:', projectName);
    console.log('프로젝트 참여자:', projectAttendees);
    onClose(); // 팝업 닫기
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <PopupHeader>
          <ProjectIcon src={AddProjectIcon2} alt="새 프로젝트 생성" />{' '}
          {/* 아이콘을 AddProjectIcon2로 변경 */}
          <PopupTitle>새 프로젝트 생성하기</PopupTitle>
          {/* <CloseButton onClick={onClose}>×</CloseButton> */}
        </PopupHeader>
        <FormGroup>
          <StyledLabel htmlFor="new-project-name">프로젝트명</StyledLabel>
          <StyledInput
            type="text"
            id="new-project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="프로젝트명을 입력해주세요."
          />
        </FormGroup>
        <FormGroup>
          <StyledLabel htmlFor="project-attendees">프로젝트 참여자</StyledLabel>
          <StyledTextarea
            id="project-attendees"
            value={projectAttendees}
            onChange={(e) => setProjectAttendees(e.target.value)}
            placeholder="프로젝트 참여자를 선택해주세요."
          />
        </FormGroup>
        <CreateProjectButton onClick={handleCreateProject}>
          프로젝트 생성
        </CreateProjectButton>
      </PopupContent>
    </PopupOverlay>
  );
};

export default NewProjectPopup;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 40px; /* 패딩 조정 */
  border-radius: 20px; /* border-radius 조정 */
  width: 450px; /* 너비 조정 */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PopupHeader = styled.div`
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  gap: 10px; /* 아이콘과 텍스트 간격 */
  /* border-bottom: 1px solid #eee; */ /* 이미지에 없음 */
  padding-bottom: 0px; /* 패딩 제거 */
  margin-bottom: 30px; /* 제목 아래 여백 추가 */
`;

const ProjectIcon = styled.img`
  width: 28px;
  height: 28px;
  /* margin-top: 2px; */ /* 아이콘을 텍스트와 시각적으로 정렬하기 위해 약간 아래로 내림 */
  /* vertical-align: middle; */ /* 텍스트와 수직 중앙 정렬 */
  transform: translateY(
    2px
  ); /* 아이콘을 텍스트와 시각적으로 정렬하기 위해 미세 조정 */
`;

const PopupTitle = styled.h2`
  margin: 0;
  color: #351745; /* 색상 변경 */
  font-size: 1.8rem; /* 폰트 사이즈 조정 */
  font-weight: 600; /* 폰트 굵기 조정 */
`;

const FormGroup = styled.div`
  margin-bottom: 15px; /* 각 폼 그룹 간 간격 */
  width: 100%;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0; /* 배경색 변경 */
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
  background-color: #f0f0f0; /* 배경색 변경 */
  color: #333;
  font-size: 1rem;
  font-family: 'Rethink Sans', sans-serif; /* 폰트 변경 */
  box-sizing: border-box;
  min-height: 120px; /* 높이 조정 */
  resize: vertical;

  &::placeholder {
    color: #999;
  }
`;

const CreateProjectButton = styled.button`
  padding: 15px 30px;
  background-color: #00b4ba; /* 보라색 계열 */
  color: white;
  border: none;
  border-radius: 50px; /* 둥근 버튼 */
  font-size: 1.2rem;
  cursor: pointer;
  width: 100%;
  margin-top: 20px; /* 상단 여백 조정 */

  &:hover {
    background-color: #00939a; /* hover 색상 조정 */
  }
`;
