import React from 'react';
import styled from 'styled-components';

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background-color: white;
  padding: 3.5rem 3rem 2.5rem 3rem;
  border-radius: 36px;
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  overflow-y: auto;
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
const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  width: 270px;
  height: 60px;
  border-radius: 2rem;
  background: #13c7c1;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 2.2rem auto 0 auto;
  display: block;
  box-shadow: 0 6px 18px #13c7c133;
  border: none;
  transition: background 0.18s;
  cursor: pointer;
  &:hover { background: #0fa7a2; }
`;

interface NewPositionProps {
  isOpen: boolean;
  formData: {
    position_code: string;
    position_name: string;
    position_detail: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const NewPosition: React.FC<NewPositionProps> = ({ isOpen, formData, onChange, onSubmit, onClose }) => {
  return (
    <Modal $isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>
          <h2>새 직급 등록</h2>
        </ModalHeader>
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <InputBox>
              <label>직급 코드</label>
              <input
                type="text"
                name="position_code"
                value={formData.position_code}
                onChange={onChange}
                required
              />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label>직급명</label>
              <input
                type="text"
                name="position_name"
                value={formData.position_name}
                onChange={onChange}
                required
              />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label>레벨</label>
              <input
                type="text"
                name="position_detail"
                value={formData.position_detail}
                onChange={onChange}
                required
              />
            </InputBox>
          </FormGroup>
          <Button type="submit">등록</Button>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default NewPosition; 