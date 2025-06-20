import React from 'react';
import type { ReactNode } from 'react';
import {
  ConfirmButton,
  Description,
  ModalContent,
  ModalOverlay,
  Title,
} from './InfoChangeModal.styles';

interface InfoChangeModalProps {
  onClose: () => void;
  title: string;
  description: ReactNode;
}

const InfoChangeModal: React.FC<InfoChangeModalProps> = ({
  onClose,
  title,
  description,
}) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InfoChangeModal;
