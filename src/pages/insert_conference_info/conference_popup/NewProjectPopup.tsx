import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import AddProjectIcon from "/images/addprojecticon.svg"; // AddProjectIcon 임포트
import AddProjectIcon2 from "/images/addprojecticon2.svg"; // AddProjectIcon2 임포트
import { createProject, fetchProjectMetaData } from "../../../api/fetchProject";
import type {
  ProjectRequestBody,
  ProjectRoleIdName,
  ProjectUserIdName,
} from "../../../types/project";

interface PopupProps {
  onClose: () => void;
}

const NewProjectPopup: React.FC<PopupProps> = ({ onClose }) => {
  // 팝업 내부 상태
  const [projectName, setProjectName] = React.useState("");
  const [projectUsers, setProjectUsers] = useState<ProjectUserIdName[]>([]);
  const [selectedProjectUsers, setSelectedProjectUsers] = useState<
    ProjectUserIdName[]
  >([]);
  const [projectDetails, setProjectDetails] = useState<string>("");
  const [projectRoles, setProjectRoles] = useState<ProjectRoleIdName[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectMetaData().then((data) => {
      if (data) {
        setProjectUsers(data.users);
        setProjectRoles(data.roles);
        setCompanyId(data.company_id);
        console.log(data);
      }
    });
  }, []);

  const handleSelectUser = (user: ProjectUserIdName) => {
    const alreadySelected = selectedProjectUsers.some(
      (u) => u.user_id === user.user_id
    );
    if (!alreadySelected) {
      setSelectedProjectUsers([...selectedProjectUsers, user]);
    }
  };

  const handleDeselectUser = (user: ProjectUserIdName) => {
    const updatedUsers = selectedProjectUsers.filter(
      (u) => u.user_id !== user.user_id
    );
    setSelectedProjectUsers(updatedUsers);
  };

  const handleChangeUserRole = (userId: string, roleId: string) => {
    const updated = selectedProjectUsers.map((user) =>
      user.user_id === userId ? { ...user, role_id: roleId } : user
    );
    setSelectedProjectUsers(updated);
  };

  const handleCreateProject = async () => {
    // 유효성 검사
    if (!projectName.trim()) {
      setErrorMessage("프로젝트명을 입력해주세요.");
      return;
    }

    if (selectedProjectUsers.length === 0) {
      setErrorMessage("참여자를 한 명 이상 선택해주세요.");
      return;
    }

    const userWithoutRole = selectedProjectUsers.find(
      (user) => !user.role_id || user.role_id === ""
    );

    if (userWithoutRole) {
      setErrorMessage("모든 참여자에게 역할을 지정해주세요.");
      return;
    }

    // 에러 초기화 후 요청
    setErrorMessage(null);

    const requestBody: ProjectRequestBody = {
      company_id: companyId,
      project_name: projectName,
      project_detail: projectDetails,
      project_status: true,
      project_users: selectedProjectUsers.map((user) => ({
        user_id: user.user_id,
        role_id: user.role_id!,
      })),
    };

    try {
      const res = await createProject(requestBody);
      console.log("프로젝트 생성 성공:", await res.json());
      onClose(); // 팝업 닫기
    } catch (err) {
      setErrorMessage("프로젝트 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <PopupHeader>
          <ProjectIcon src={AddProjectIcon2} alt="새 프로젝트 생성" />{" "}
          {/* 아이콘을 AddProjectIcon2로 변경 */}
          <PopupTitle>새 프로젝트 생성하기</PopupTitle>
          {/* <CloseButton onClick={onClose}>×</CloseButton> */}
        </PopupHeader>
        <CloseButton onClick={onClose}>×</CloseButton>

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
          <StyledLabel htmlFor="project-attendees">
            프로젝트 참여자 선택
          </StyledLabel>
          <UserListBox>
            {projectUsers.map((user) => {
              const alreadySelected = selectedProjectUsers.some(
                (u) => u.user_id === user.user_id
              );
              return (
                <UserItem key={user.user_id}>
                  <span>{user.user_name}</span>
                  {!alreadySelected && (
                    <AddButton onClick={() => handleSelectUser(user)}>
                      +
                    </AddButton>
                  )}
                </UserItem>
              );
            })}
          </UserListBox>

          {/* 선택된 유저 목록 */}
          <UserListBox>
            {selectedProjectUsers.map((user) => (
              <UserItem key={user.user_id}>
                <span>{user.user_name}</span>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <RoleSelect
                    value={user.role_id || ""}
                    onChange={(e) =>
                      handleChangeUserRole(user.user_id, e.target.value)
                    }
                  >
                    <option value="">역할 선택</option>
                    {projectRoles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </RoleSelect>
                  <AddButton onClick={() => handleDeselectUser(user)}>
                    -
                  </AddButton>
                </div>
              </UserItem>
            ))}
          </UserListBox>
        </FormGroup>
        <FormGroup>
          <StyledLabel htmlFor="project-details">프로젝트 설명</StyledLabel>
          <StyledTextarea
            id="project-details"
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
            placeholder="프로젝트에 대한 설명을 입력해주세요."
          />
        </FormGroup>
        {errorMessage && <ErrorMessageBox>{errorMessage}</ErrorMessageBox>}
        <CreateProjectButton onClick={() => handleCreateProject()}>
          프로젝트 생성
        </CreateProjectButton>
      </PopupContent>
    </PopupOverlay>
  );
};

export default NewProjectPopup;

const ErrorMessageBox = styled.div`
  background-color: #ffe6e6;
  color: #cc0000;
  padding: 10px 15px;
  border-radius: 6px;
  margin-top: -10px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 25px;
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

const RoleSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  background-color: white;
`;

const UserListBox = styled.div`
  width: 27rem;
  height: 15rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow-y: auto;
  padding: 8px;
  margin-bottom: 3rem;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

const AddButton = styled.button`
  background-color: #771277;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
`;

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
  z-index: 9999;
`;

const PopupContent = styled.div`
  position: relative;
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
