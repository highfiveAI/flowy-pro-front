import React from "react";
import styled from "styled-components";
import AddVoiceFileIcon from "/images/addvoicefile.svg";

const InputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: transparent;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1rem;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 24px;
    height: 24px;
  }
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
    <div>
      <InputLabel htmlFor="file-upload">
        <img src={AddVoiceFileIcon} alt="파일 선택" />
      </InputLabel>
      <HiddenInput
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
