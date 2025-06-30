import styled from 'styled-components';

export const SignUpWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(45, 17, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(45, 17, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(45, 17, 85, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const SignUpContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 40px;
  border-radius: 30px;
  width: 90%;
  max-width: 700px;
  box-shadow: 
    0 20px 40px rgba(45, 17, 85, 0.1),
    0 10px 20px rgba(45, 17, 85, 0.05);
  border: 1px solid rgba(45, 17, 85, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
`;

export const LogoImg = styled.img`
  width: 140px;
  height: auto;
  margin-bottom: 30px;
  filter: drop-shadow(0 4px 8px rgba(45, 17, 85, 0.1));
`;

export const SelectionTitle = styled.div`
  color: #2d1155;
  font-size: 24px;
  font-weight: 700;
  margin: 40px 0;
  position: relative;
  width: 100%;
  text-align: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 25%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #2d1155 50%, transparent 100%);
  }

  &::before {
    left: 0;
    margin-left: 10%;
  }

  &::after {
    right: 0;
    margin-right: 10%;
  }
`;

export const SelectionOptions = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 40px;
  width: 100%;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const OptionCard = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 220px;
  height: 220px;
  border-radius: 25px;
  border: ${(props) => (props.$primary ? 'none' : '2px solid #2d1155')};
  background: ${(props) => 
    props.$primary 
      ? 'linear-gradient(135deg, #2d1155 0%, #4a1e75 100%)' 
      : 'rgba(255, 255, 255, 0.9)'};
  color: ${(props) => (props.$primary ? 'white' : '#2d1155')};
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => 
      props.$primary 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(45, 17, 85, 0.05)'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 25px 50px rgba(45, 17, 85, 0.2),
      0 15px 30px rgba(45, 17, 85, 0.1);
    border-color: ${(props) => (props.$primary ? 'none' : '#4a1e75')};

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }
`;

export const MobileIcon = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;

  ${OptionCard}:hover & {
    transform: scale(1.1);
  }
`;

export const GoogleIcon = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
  border-radius: 50%;
  transition: transform 0.3s ease;

  ${OptionCard}:hover & {
    transform: scale(1.1);
  }
`;
