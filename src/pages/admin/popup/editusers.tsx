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
  &:hover {
    color: #351745;
  }
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
  transition: box-shadow 0.18s, border 0.18s, background 0.18s;

  input:enabled {
    background: #fff;
    border: none;
    color: #351745;
  }
  input:disabled {
    background: #f5f5f5;
    border: none;
    color: #b0b0b0;
    box-shadow: none;
  }
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
    height: 100%;
    padding: 0;
    margin: 0;
    &::placeholder {
      color: #b0b0b0;
      font-weight: 500;
    }
  }
`;
const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.2rem;
`;
const ActionButton = styled.button<{ color?: string }>`
  width: 170px;
  height: 56px;
  border-radius: 2rem;
  background: ${({ color }) => color || '#13c7c1'};
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  box-shadow: 0 6px 18px #13c7c133;
  border: none;
  transition: background 0.18s;
  cursor: pointer;
  &:hover {
    opacity: 0.92;
  }
`;

interface EditUsersProps {
  isOpen: boolean;
  user: {
    user_id?: string;
    user_name?: string;
    user_login_id?: string;
    user_email?: string;
    user_phonenum?: string;
    user_dept_name?: string;
    user_team_name?: string;
    user_jobname?: string;
  };
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

const EditUsers: React.FC<EditUsersProps> = ({
  isOpen,
  user,
  onApprove,
  /*onReject,*/ onClose,
}) => {
  if (!isOpen) return null;
  return (
    <Modal $isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>
          <h2>사용자 정보 수정</h2>
        </ModalHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <FormGroup>
            <InputBox>
              <label>이름</label>
              <input type="text" value={user.user_name || ''} disabled />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label>이메일</label>
              <input type="email" value={user.user_email || ''} disabled />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label>로그인 ID</label>
              <input type="text" value={user.user_login_id || ''} disabled />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label>전화번호</label>
              <input type="tel" value={user.user_phonenum || ''} disabled />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label>부서명</label>
              <input
                type="text"
                name="user_dept_name"
                value={user.user_dept_name || ''}
              />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label>팀명</label>
              <input
                type="text"
                name="user_team_name"
                value={user.user_team_name || ''}
              />
            </InputBox>
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label>직무</label>
              <input
                type="text"
                name="user_jobname"
                value={user.user_jobname || ''}
              />
            </InputBox>
          </FormGroup>
          <ButtonRow>
            <ActionButton type="button" color="#13c7c1" onClick={onApprove}>
              수정
            </ActionButton>
          </ButtonRow>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditUsers;
