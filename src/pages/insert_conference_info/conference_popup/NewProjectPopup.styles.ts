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
  width: 27rem;
  height: 15rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow-y: auto;
  padding: 8px;
  margin-bottom: 3rem;
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
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
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

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
`;

export const StyledInput = styled.input`
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

export const StyledTextarea = styled.textarea`
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

export const CreateProjectButton = styled.button`
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
