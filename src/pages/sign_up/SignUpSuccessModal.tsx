// src/components/SignUpSuccessModal.tsx
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  border: 2px solid #7c3aed;
  border-radius: 2rem;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: #4a1168;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  color: #333;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  background-color: #4a1168;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: #3a0d54;
  }
`;

const SignUpSuccessModal: React.FC<Props> = ({ visible, onClose }) => {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <Overlay>
      <ModalBox>
        <Title>회원가입이 완료되었습니다.</Title>
        <Text>관리자의 승인 후 서비스를 이용하실 수 있습니다.</Text>
        <Text>승인 결과는 등록하신 이메일로 안내드립니다.</Text>
        <Button
          onClick={() => {
            onClose(); // optional close
            navigate("/");
          }}
        >
          메인으로 돌아가기
        </Button>
      </ModalBox>
    </Overlay>
  );
};

export default SignUpSuccessModal;
