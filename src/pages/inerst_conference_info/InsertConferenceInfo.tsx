import React from "react";
import FileUpload from "./FileUpload";
import SideBar from "../../components/SideBar";
import styled from "styled-components";
import RecordUpload from "./RecordUpload";
import AttendInfo from "./AttendInfo";
const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #f7f7f7;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column; /* ⭐⭐⭐ 세로 방향으로 변경 */
  justify-content: center; /* 수직 중앙 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
  gap: 2rem; /* 두 컴포넌트 사이 간격 주기 (선택) */
`;

const InsertConferenceInfo: React.FC = () => {
  const [subject, setSubject] = React.useState("");
  const [attendees, setAttendees] = React.useState([{ name: "", email: "", role: "" }]);
  const [file, setFile] = React.useState<File | null>(null);

  return (
    <Container>
      <SideBar />
      <MainContent>
        <AttendInfo 
          subject={subject}
          attendees={attendees}
          setSubject={setSubject}
          setAttendees={setAttendees}
        />
        {file ? (
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "1rem" }}>파일명: {file.name}</div>
            {/* 업로드 UI 등 필요시 여기에 추가 */}
          </div>
        ) : (
          <>
            <FileUpload setFile={setFile} />
            <RecordUpload setFile={setFile} />
          </>
        )}
      </MainContent>
    </Container>
  );
};

export default InsertConferenceInfo;
