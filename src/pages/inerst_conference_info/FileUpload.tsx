// FileUpload.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Loading from "../../components/Loading";

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = () => {
    alert(`${files.length}개 파일 업로드 준비됨`);
    setIsLoading(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Container>
        <Title>파일 업로드</Title>
        <InputLabel htmlFor="file-upload">파일 선택</InputLabel>
        <HiddenInput
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        {files.length > 0 && (
          <FileList>
            {files.map((file, idx) => (
              <FileItem key={idx}>{file.name}</FileItem>
            ))}
          </FileList>
        )}
      </Container>

      <UploadWrapper>
        <UploadButton onClick={handleUpload}>업로드</UploadButton>
      </UploadWrapper>
    </Wrapper>
  );
};

export default FileUpload;
