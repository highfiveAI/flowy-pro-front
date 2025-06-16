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
  &:hover {
    color: #351745;
  }
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

const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  width: 200px;
  height: 60px;
  border-radius: 2rem;
  background: ${(props) =>
    props.$variant === 'danger' ? '#dc3545' : '#4b1864'};
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  display: block;
  box-shadow: 0 6px 18px
    ${(props) =>
      props.$variant === 'danger' ? 'rgba(220, 53, 69, 0.2)' : '#4b186433'};
  border: none;
  transition: background 0.18s;
  cursor: pointer;
  &:hover {
    background: ${(props) =>
      props.$variant === 'danger' ? '#c82333' : '#351745'};
  }
`;

interface Template {
  interdocs_id: string;
  interdocs_type_name: string;
  interdocs_filename: string;
  interdocs_contents: string;
  interdocs_path: string;
  interdocs_uploaded_date: string;
  interdocs_updated_date?: string;
  interdocs_update_user_id: string;
}

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => void;
  onDelete: () => void;
  selectedTemplate: Template | null;
  editDocType: string;
  setEditDocType: (v: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  // selectedTemplate,
  editDocType,
  setEditDocType,
  handleFileChange,
}) => {
  return (
    <Modal $visible={isOpen}>
      <ModalContent>
        <ModalHeader>
          <h2>템플릿 수정</h2>
        </ModalHeader>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Form onSubmit={onUpdate}>
          <FormGroup>
            <InputBox>
              <label htmlFor="doc_type">문서 양식</label>
              <input
                type="text"
                id="doc_type"
                name="doc_type"
                value={editDocType}
                onChange={(e) => setEditDocType(e.target.value)}
                required
              />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label htmlFor="file">템플릿</label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                required
              />
            </InputBox>
          </FormGroup>
          <ButtonGroup>
            <Button type="submit">수정</Button>
            <Button type="button" $variant="danger" onClick={onDelete}>
              삭제
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default EditTemplateModal;
