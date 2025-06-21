import styled from "styled-components";
import type { StyledUploadSectionProps } from "./InsertConferenceInfo.types";

// <editor-fold desc="Layout Components">
export const EditIcon = styled.div`
  cursor: pointer;
  width: 16px;
  height: 16px;
  background-image: url("/images/edit.svg");
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

export const StyledErrorMessage = styled.div`
  background-color: #ffe6e6;
  color: #cc0000;
  margin-top: 15px;
  font-size: 0.9rem;
  text-align: left;
  width: 100%; /* 중앙 정렬을 위해 너비 100% 설정 */
`;

export const ProjectListTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center; /* 중앙 정렬 */
  width: 100%; /* 중앙 정렬을 위해 너비 100% 설정 */
`;

export const SortWrapper = styled.div`
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

export const SortText = styled.span`
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const ProjectListContainer = styled.div`
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

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin-top: 16px;
  margin-bottom: 8px;
  &:first-child {
    margin-top: 0;
  }
`;

export const ExpandedArea = styled.div`
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

export const ProjectList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`;

export const ProjectListItem = styled.li`
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

export const NewProjectTextTop = styled.span`
  color: rgba(30, 30, 30, 0.78);
  font-size: 11px;
  font-style: normal;
  font-weight: 450;
  line-height: 15px; /* 줄 간격 더 좁힘 */
`;

export const NewProjectTextBottom = styled.span`
  color: #00b4ba;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 줄 간격 더 좁힘 */
`;

export const NewProjectWrapper = styled.div`
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

export const NewProjectTextsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px; /* 텍스트 간격 조정 */
`;

export const MeetingList = styled.div`
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

export const StyledUploadButton = styled.button`
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

export const PageWrapper = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  padding-top: 30px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export const LeftPanel = styled.div`
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

export const RightPanel = styled.div`
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

export const TabsWrapper = styled.div`
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

export const StyledAddAttendeeButton = styled.button`
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

export const LabelButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* StyledLabel의 margin-bottom과 동일하게 */
`;

export const PageTitle = styled.h1`
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

export const FormGroup = styled.div`
  margin-bottom: 22px;
`;

export const StyledLabel = styled.label`
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

export const StyledInput = styled.input`
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

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 13px 18px;
  border: none;
  border-radius: 8px;
  background: #f7f7f7;
  color: #351745;
  font-size: 1.05rem;
  font-weight: 500;
  font-family: "Rethink Sans", sans-serif; /* 폰트 적용 */
  box-sizing: border-box;
  height: 120px; /* 고정 높이 설정 */
  resize: none; /* 사이즈 조정 비활성화 */
  &::placeholder {
    color: #bdbdbd;
    font-weight: 400;
    font-size: 1.02rem;
  }
`;

export const DatePickerWrapper = styled.div`
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

export const StyledUploadSection = styled.div<StyledUploadSectionProps>`
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
    ${({ $isDragging }) => ($isDragging ? "#00b4ba" : "transparent")};
  transform: ${({ $isDragging }) => ($isDragging ? "scale(1.02)" : "scale(1)")};

  h2 {
    color: #351745;
  }
`;

export const FileUploadWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  left: 15px;
`;

export const RecordUploadWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  right: 15px;
`;

export const DropZoneMessage = styled.div`
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

export const FileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 1rem;
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const FileLabel = styled.span`
  font-weight: 600;
  color: #351745;
  margin-right: 8px;
`;

export const FileName = styled.span`
  color: #351745;
  font-weight: 500;
`;

export const RemoveFileButton = styled.button`
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

export const ContainerWrapper = styled.div`
  position: relative;
  margin-top: 60px; /* ProjectListTitle과 버튼 사이 간격 추가 */
`;

export const TabBtn = styled.button<{ active: boolean }>`
  flex: 1;
  height: 56px;
  background: ${({ active }) => (active ? "#e5e0ee" : "transparent")};
  color: ${({ active }) => (active ? "#351745" : "#fff")};
  border: none;
  font-size: 1.18rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-top-left-radius: ${({ active }) => (active ? "16px" : "0")};
  border-top-right-radius: ${({ active }) => (active ? "16px" : "0")};
  margin-right: 2px;
  outline: none;
  letter-spacing: -0.5px;
  z-index: ${({ active }) => (active ? 2 : 1)};
  &:last-child {
    margin-right: 0;
  }
`;

export const StyledSelect = styled.select`
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

export const TabPanel = styled.div`
  flex: 1;
  background: #351745;
  border-radius: 0 0 16px 16px;
  padding: 36px 36px 32px 36px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const TabSectionWrapper = styled.div`
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  background: #351745;
  width: 100%;
  position: relative;
  z-index: 1;
`;
