// FileUpload.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Loading from '../../components/Loading';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const UploadWrapper = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 500px;
  padding: 2rem;
  border: 2px dashed #ccc;
  border-radius: 12px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FileItem = styled.li`
  margin-top: 0.5rem;
  color: #333;
`;

const UploadButton = styled.button`
  margin-top: 2rem;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');
  const [attendees, setAttendees] = useState([
    { name: '', email: '', role: '' },
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles([event.target.files[0]]);
    }
  };

  const handleAttendeeChange = (idx: number, field: string, value: string) => {
    setAttendees((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleAddAttendee = () => {
    setAttendees((prev) => [...prev, { name: '', email: '', role: '' }]);
  };

  const handleRemoveAttendee = (idx: number) => {
    setAttendees((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('파일을 선택해주세요.');
      return;
    }
    if (!subject) {
      alert('subject를 입력해주세요.');
      return;
    }
    if (
      attendees.length === 0 ||
      attendees.some((a) => !a.name || !a.email || !a.role)
    ) {
      alert('모든 참석자 정보를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('subject', subject);
    attendees.forEach((a) => {
      formData.append('attendees_name', a.name);
      formData.append('attendees_email', a.email);
      formData.append('attendees_role', a.role);
    });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stt`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log('업로드 성공! 결과:', data);
        alert('업로드 성공!');
        setFiles([]);
        setSubject('');
        setAttendees([{ name: '', email: '', role: '' }]);
      } else {
        alert('업로드 실패');
      }
    } catch (error) {
      alert('에러 발생: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Container>
        <Title>파일 업로드</Title>
        <InputLabel htmlFor="file-upload">파일 선택</InputLabel>
        <HiddenInput id="file-upload" type="file" onChange={handleFileChange} />
        {files.length > 0 && (
          <FileList>
            {files.map((file, idx) => (
              <FileItem key={idx}>{file.name}</FileItem>
            ))}
          </FileList>
        )}
        <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>subject: </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '80%',
                padding: '6px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              참석자 정보
            </div>
            {attendees.map((att, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  placeholder="이름"
                  value={att.name}
                  onChange={(e) =>
                    handleAttendeeChange(idx, 'name', e.target.value)
                  }
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                  }}
                />
                <input
                  type="email"
                  placeholder="이메일"
                  value={att.email}
                  onChange={(e) =>
                    handleAttendeeChange(idx, 'email', e.target.value)
                  }
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                  }}
                />
                <input
                  type="text"
                  placeholder="역할"
                  value={att.role}
                  onChange={(e) =>
                    handleAttendeeChange(idx, 'role', e.target.value)
                  }
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                  }}
                />
                {attendees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAttendee(idx)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAttendee}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              참석자 추가
            </button>
          </div>
        </div>
      </Container>

      <UploadWrapper>
        <UploadButton onClick={handleUpload}>업로드</UploadButton>
      </UploadWrapper>
    </Wrapper>
  );
};

export default FileUpload;
