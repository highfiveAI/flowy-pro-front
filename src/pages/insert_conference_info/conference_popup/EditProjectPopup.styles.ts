import styled from 'styled-components';

export const ErrorMessageBox = styled.div`
  background-color: #ffe6e6;
  color: #cc0000;
  padding: 10px 15px;
  border-radius: 6px;
  margin-top: -10px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
`;

export const CloseButton = styled.button`
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

export const RoleSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  background-color: white;
`;

export const UserListBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow-y: auto;
  padding: 8px;
  flex-grow: 1;
`;

export const SearchContainer = styled.div`
  margin-bottom: 15px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #00b4ba;
    box-shadow: 0 0 0 2px rgba(0, 180, 186, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

export const SearchResultsContainer = styled.div`
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  flex-grow: 1;
`;

export const SearchResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const UserName = styled.span`
  font-size: 0.95rem;
  color: #333;
`;

export const SelectedUsersContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const SelectedUsersTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #888;
  margin-bottom: 5px;
  text-align: right;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow-y: auto;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  flex-grow: 1;
  align-content: flex-start;
`;

export const SelectedUserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border-radius: 16px;
`;

export const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #000;
  }
`;

export const NoResultsMessage = styled.div`
  padding: 15px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

export const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

export const AddButton = styled.button`
  background-color: #771277;
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
  transition: background-color 0.2s;

  &:hover {
    background-color: #5e0e5e;
  }
`;

export const PopupOverlay = styled.div`
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

export const PopupContent = styled.div`
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

export const PopupHeader = styled.div`
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  gap: 10px; /* 아이콘과 텍스트 간격 */
  /* border-bottom: 1px solid #eee; */ /* 이미지에 없음 */
  padding-bottom: 0px; /* 패딩 제거 */
  margin-bottom: 30px; /* 제목 아래 여백 추가 */
`;

export const ProjectIcon = styled.img`
  width: 28px;
  height: 28px;
  /* margin-top: 2px; */ /* 아이콘을 텍스트와 시각적으로 정렬하기 위해 약간 아래로 내림 */
  /* vertical-align: middle; */ /* 텍스트와 수직 중앙 정렬 */
  transform: translateY(
    2px
  ); /* 아이콘을 텍스트와 시각적으로 정렬하기 위해 미세 조정 */
`;

export const PopupTitle = styled.h2`
  margin: 0;
  color: #351745; /* 색상 변경 */
  font-size: 1.8rem; /* 폰트 사이즈 조정 */
  font-weight: 600; /* 폰트 굵기 조정 */
`;

export const FormGroup = styled.div`
  margin-bottom: 15px; /* 각 폼 그룹 간 간격 */
  width: 100%;
`;

export const UserManagementContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 1rem;
`;

export const UserPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 250px; /* 고정 높이 */
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 10px; /* 레이블과 입력 필드 간 간격 */
  font-size: 1rem; /* 폰트 사이즈 조정 */
  color: #333;
  font-weight: 500;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px 18px; /* 패딩 조정 */
  border: 1px solid #ddd;
  border-radius: 8px; /* border-radius 조정 */
  font-size: 1rem; /* 폰트 사이즈 조정 */
  font-family: 'Rethink Sans', sans-serif;
  background-color: #f8f9fa; /* 배경색 변경 */
  box-sizing: border-box;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #00b4ba; /* 포커스 색상 변경 */
    background-color: white;
    box-shadow: 0 0 0 3px rgba(0, 180, 186, 0.1);
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px 18px; /* 패딩 조정 */
  border: 1px solid #ddd;
  border-radius: 8px; /* border-radius 조정 */
  font-size: 1rem; /* 폰트 사이즈 조정 */
  font-family: 'Rethink Sans', sans-serif;
  box-sizing: border-box;
  height: 120px;
  resize: none;
  background-color: #f8f9fa; /* 배경색 변경 */
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #00b4ba; /* 포커스 색상 변경 */
    background-color: white;
    box-shadow: 0 0 0 3px rgba(0, 180, 186, 0.1);
  }
`;

export const CreateProjectButton = styled.button`
  padding: 15px 0;
  background-color: #00b4ba; /* 버튼 색상 변경 */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem; /* 폰트 사이즈 조정 */
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 15px; /* 버튼 위 간격 추가 */
  transition: background 0.2s;

  &:hover {
    background-color: #00939a;
  }
`; 