import React from 'react';
import styled from 'styled-components';

const Modal = styled.div<{ $visible: boolean }>`
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-x: hidden;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 3.5rem 3rem 2.5rem 3rem;
  border-radius: 36px;
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  border: 2px solid #351745;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  box-sizing: border-box;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 2.2rem;
  h2 {
    margin: 0;
    font-size: 1.4rem;
    color: #351745;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 32px;
  right: 32px;
  z-index: 1100;
  background: none;
  border: none;
  font-size: 2.2rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  &:hover { color: #351745; }
`;

const Form = styled.form`
  background: none;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  border: 1.5px solid #ccc;
  border-radius: 4px;
  background: #fff;
  box-sizing: border-box;
  padding: 0 1.2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  label {
    min-width: 100px;
    font-size: 1.08rem;
    color: #888;
    font-weight: 500;
    margin-right: 1.2rem;
    white-space: nowrap;
  }
  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1.1rem;
    color: #351745;
    font-weight: 500;
    font-family: 'Rethink Sans', sans-serif;
    height: 100%;
    padding: 0;
    margin: 0;
    &::placeholder {
      color: #b0b0b0;
      font-weight: 500;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2.2rem;
`;

const Button = styled.button`
  width: 200px;
  height: 60px;
  border-radius: 2rem;
  background: #4b1864;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  display: block;
  box-shadow: 0 6px 18px #4b186433;
  border: none;
  transition: background 0.18s;
  cursor: pointer;
  &:hover { background: #351745; }
`;

interface NewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (e: React.FormEvent) => void;
  createDocType: string;
  setCreateDocType: (v: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  createDocType,
  setCreateDocType,
  handleFileChange,
}) => {
  return (
    <Modal $visible={isOpen}>
      <ModalContent>
        <ModalHeader>
          <h2>새 템플릿 추가</h2>
        </ModalHeader>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Form onSubmit={onCreate}>
          <FormGroup>
            <InputBox>
              <label htmlFor="doc_type">문서 양식</label>
              <input type="text" id="doc_type" name="doc_type" value={createDocType} onChange={(e) => setCreateDocType(e.target.value)} required />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label htmlFor="file">템플릿</label>
              <input type="file" id="file" name="file" onChange={handleFileChange} required />
            </InputBox>
          </FormGroup>
          <ButtonGroup>
            <Button type="submit">등록</Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default NewTemplateModal; 