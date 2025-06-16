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
const Button = styled.button`
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

interface NewAdminProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    admin_name: string;
    admin_id: string;
    admin_email: string;
    admin_phone: string;
    company_name: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewAdmin: React.FC<NewAdminProps> = ({ visible, onClose, onSubmit, formData, onChange }) => (
  <Modal $isOpen={visible}>
    <ModalContent>
      <CloseButton onClick={onClose}>×</CloseButton>
      <ModalHeader>
        <h2>관리자 계정 등록</h2>
      </ModalHeader>
      <form onSubmit={onSubmit}>
        <FormGroup>
          <InputBox>
            <label htmlFor="admin_name">이름</label>
            <input type="text" id="admin_name" name="admin_name" value={formData.admin_name} onChange={onChange} required />
          </InputBox>
        </FormGroup>
        <FormGroup>
          <InputBox>
            <label htmlFor="admin_id">ID</label>
            <input type="text" id="admin_id" name="admin_id" value={formData.admin_id} onChange={onChange} required />
          </InputBox>
        </FormGroup>
        <FormGroup>
          <InputBox>
            <label htmlFor="admin_email">이메일주소</label>
            <input type="email" id="admin_email" name="admin_email" value={formData.admin_email} onChange={onChange} required />
          </InputBox>
        </FormGroup>
        <FormGroup>
          <InputBox>
            <label htmlFor="admin_phone">연락처</label>
            <input type="text" id="admin_phone" name="admin_phone" value={formData.admin_phone} onChange={onChange} required />
          </InputBox>
        </FormGroup>
        <FormGroup>
          <InputBox>
            <label htmlFor="company_name">회사명</label>
            <input type="text" id="company_name" name="company_name" value={formData.company_name} onChange={onChange} required />
          </InputBox>
        </FormGroup>
        <Button type="submit">등록</Button>
      </form>
    </ModalContent>
  </Modal>
);

export default NewAdmin; 