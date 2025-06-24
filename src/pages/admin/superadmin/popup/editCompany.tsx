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
  flex: 1;
  height: 48px;
  border-radius: 2rem;
  background: ${(props) =>
    props.variant === 'danger' ? '#dc3545' : '#13c7c1'};
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0.5rem 0 0;
  display: inline-block;
  box-shadow: 0 6px 18px #13c7c133;
  border: none;
  transition: background 0.18s;
  cursor: pointer;
  &:last-child { margin-right: 0; }
  &:hover { background: ${(props) =>
    props.variant === 'danger' ? '#b52a37' : '#0fa7a2'}; }
`;

interface EditCompanyProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
  formData: {
    company_name: string;
    company_scale: string;
    service_startdate: string;
    service_enddate: string;
    service_status: boolean;
    admin_account?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  adminUser?: { user_name: string; user_email: string } | null;
}

const EditCompany: React.FC<EditCompanyProps> = ({ visible, onClose, onSubmit, onDelete, formData, onChange, adminUser }) => (
  <Modal $isOpen={visible}>
    <ModalContent>
      <ModalHeader>
        <h2>회사 정보 수정</h2>
        <CloseButton onClick={onClose}>×</CloseButton>
      </ModalHeader>
      <Form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(e);
          onClose();
        }}
      >

        <FormGroup>
          <InputBox>
            <label htmlFor="company_name">회사명</label>
            <input type="text" id="company_name" name="company_name" value={formData.company_name} onChange={onChange} required />
          </InputBox>
        </FormGroup>
        <FormGroup>
          <InputBox>
            <label htmlFor="company_scale">기업 규모</label>
            <input type="text" id="company_scale" name="company_scale" value={formData.company_scale} onChange={onChange} required />
          </InputBox>
        </FormGroup>
        <FormGroup>
          <InputBox>
            <label htmlFor="service_startdate">서비스 시작일</label>
            <input type="date" id="service_startdate" name="service_startdate" value={formData.service_startdate} onChange={onChange} required />
          </InputBox>
        </FormGroup>
        <FormGroup>
          <InputBox>
            <label htmlFor="service_enddate">서비스 종료일</label>
            <input type="date" id="service_enddate" name="service_enddate" value={formData.service_enddate} onChange={onChange} />
          </InputBox>
        </FormGroup>
        <FormGroup>
        {/* 관리자 이름/이메일 표시 */}
        {adminUser && (
          <>
            <FormGroup>
              <InputBox>
                <label>관리자 이름</label>
                <input type="text" value={adminUser.user_name} disabled />
              </InputBox>
            </FormGroup>
            <FormGroup>
              <InputBox>
                <label>관리자 이메일</label>
                <input type="text" value={adminUser.user_email} disabled />
              </InputBox>
            </FormGroup>
          </>
        )}
        </FormGroup>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
          <Button type="submit">수정</Button>
          <Button type="button" variant="danger" onClick={onDelete}>삭제</Button>
        </div>
      </Form>
    </ModalContent>
  </Modal>
);

export default EditCompany; 