// src/pages/insert_conference_info/conference_popup/AnalysisRequestedPopup.tsx
import React from 'react';
import styled from 'styled-components';

const PopupBackground = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.15);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupBox = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(53, 23, 69, 0.12);
  padding: 48px 32px 32px 32px;
  min-width: 400px;
  max-width: 90vw;
  text-align: center;
  border: 1.5px solid #351745;
`;

const Title = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #351745;
  margin-bottom: 12px;
`;

const Desc = styled.div`
  color: #444;
  font-size: 1rem;
  margin-bottom: 32px;
`;

const ConfirmButton = styled.button`
  background: #5a258c;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 14px 0;
  width: 80%;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(53, 23, 69, 0.12);
  cursor: pointer;
  margin-top: 12px;
`;

const AnalysisRequestedPopup = ({ onClose }: { onClose: () => void }) => (
  <PopupBackground>
    <PopupBox>
      <Title>회의 분석 요청이 완료되었습니다.</Title>
      <Desc>분석이 끝나면 [회의 관리]에서 결과를 확인하실 수 있습니다.</Desc>
      <ConfirmButton onClick={onClose}>확인</ConfirmButton>
    </PopupBox>
  </PopupBackground>
);

export default AnalysisRequestedPopup;