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

const InsertConferenceInfo: React.FC = () => {
  const [subject, setSubject] = React.useState("");
  const [attendees, setAttendees] = React.useState([{ name: "", email: "", role: "" }]);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>("");

  const validateForm = (): boolean => {
    if (!subject.trim()) {
      setError("주제를 입력해주세요.");
      return false;
    }

    if (!file) {
      setError("파일을 업로드하거나 녹음을 완료해주세요.");
      return false;
    }

    const hasEmptyFields = attendees.some(
      attendee => !attendee.name.trim() || !attendee.email.trim() || !attendee.role.trim()
    );

    if (hasEmptyFields) {
      setError("모든 참석자의 정보를 입력해주세요.");
      return false;
    }

    setError("");
    return true;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    if (file) {
      formData.append("file", file, file.name);
      formData.append("subject", subject);

      // 참석자 정보 각각 반복해서 추가
      attendees.forEach(att => {
        formData.append("attendees_name", att.name);
        formData.append("attendees_email", att.email);
        formData.append("attendees_role", att.role);
      });

      try {
        const response = await fetch("http://127.0.0.1:8000/stt", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || "업로드에 실패했습니다.");
        }

        const result = await response.json();
        alert("업로드가 완료되었습니다.");
        setSubject("");
        setAttendees([{ name: "", email: "", role: "" }]);
        setFile(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : "업로드 중 오류가 발생했습니다.");
      }
    }
  };

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
          </div>
        ) : (
          <>
            <FileUpload setFile={setFile} />
            <RecordUpload setFile={setFile} />
          </>
        )}
        <UploadButton onClick={handleUpload}>
          업로드
        </UploadButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </MainContent>
    </Container>
  );
};

export default InsertConferenceInfo;
