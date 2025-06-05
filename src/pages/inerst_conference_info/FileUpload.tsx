
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const Container = styled.div`
  width: 500px;
  padding: 2rem;
  border: none;
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

interface FileUploadProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}


const FileUpload: React.FC<FileUploadProps> = ({ setFile }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };



  return (
    <Wrapper>
      <Container>
        <Title>파일 업로드</Title>
        <InputLabel htmlFor="file-upload">파일 선택</InputLabel>
        <HiddenInput
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />

      </Container>
    </Wrapper>
  );
};

export default FileUpload;
