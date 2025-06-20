import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 50px; /* 패딩 조정 */
  border-radius: 24px; /* 더 둥근 테두리 */
  min-width: 400px; /* 팝업 너비 조절 */
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`;

export const Title = styled.h2`
  color: #351745;
  font-size: 1.8rem;
  margin-bottom: 10px;
`;

export const Description = styled.p`
  color: #555;
  font-size: 1rem;
  margin-bottom: 30px;
`;

export const ConfirmButton = styled.button`
  background-color: #480b6a;
  color: #fff;
  padding: 12px 40px;
  border: none;
  border-radius: 48px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 80%; /* 버튼 너비 조정 */

  &:hover {
    background-color: #351745;
  }
`;
