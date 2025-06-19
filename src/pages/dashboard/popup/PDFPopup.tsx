import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateMeetingPDF } from '../../../utils/pdfGenerator';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 50px;
  border: 1px solid #351745;
  box-shadow: 4px 0px 4px 0px rgba(75, 13, 110, 0.21);
  padding: 48px 40px 40px 40px;
  min-width: 420px;
  max-width: 95vw;
  min-height: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  margin-top: 28px;
`;

const PDFIcon = styled.img`
  width: 38px;
  height: 38px;
  margin-right: 16px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #4b2067;
  font-weight: 700;
  margin: 0;
`;

const SectionLabel = styled.div`
  font-size: 1.15rem;
  color: #4b2067;
  font-weight: 700;
  margin-bottom: 18px;
  margin-top: 32px;
  text-align: left;
`;

const DownloadButton = styled.button`
  width: 100%;
  background: #00b6b6;
  color: #fff;
  border: none;
  border-radius: 32px;
  padding: 18px 0;
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  &:hover {
    background: #009999;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 28px;
  background: none;
  border: none;
  font-size: 22px;
  color: #4b2067;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 24px;
  align-items: flex-start;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1.13rem;
  color: #4b2067;
  font-weight: 700;
  cursor: pointer;
  gap: 8px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 10px;
  accent-color: #4b2067;
  width: 18px;
  height: 18px;
  &[readonly] {
    pointer-events: none;
  }
`;

interface PDFPopupProps {
  onClose: () => void;
  checkedData?: any; // 임시, 실제로는 상위에서 내려주는 데이터 타입에 맞게 수정
  meetingInfo?: any;
  summary?: any;
  tasks?: any;
  feedback?: any;
  recommendFiles?: any;
}

const PDF_ITEMS = [
  { key: 'all', label: '전체' },
  { key: 'info', label: '회의 기본 정보' },
  { key: 'summary', label: '회의 요약' },
  { key: 'tasks', label: '작업 목록' },
  { key: 'feedback', label: '회의 피드백' },
  { key: 'recommend', label: '추천 문서' },
];

// pdfMake 동적 로드 훅
function usePdfMakeScript() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.pdfMake) {
      const script1 = document.createElement('script');
      script1.src = '/libs/pdfmake.min.js';
      script1.type = 'text/javascript';
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = '/libs/vfs_fonts.js';
        script2.type = 'text/javascript';
        document.body.appendChild(script2);
      };
      document.body.appendChild(script1);
    }
  }, []);
}

const PDFPopup: React.FC<PDFPopupProps> = ({ onClose, meetingInfo, summary, tasks, feedback, recommendFiles }) => {
  usePdfMakeScript();
  const [checked, setChecked] = useState({
    all: false,
    info: false,
    summary: false,
    tasks: false,
    feedback: false,
    recommend: false,
  });

  // pdfMake 상태 콘솔 출력
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.pdfMake) {
        console.log('✅ window.pdfMake가 정상적으로 로드되었습니다.', window.pdfMake);
        if (window.pdfMake.vfs) {
          console.log('✅ window.pdfMake.vfs도 정상적으로 등록되어 있습니다.', window.pdfMake.vfs);
        } else {
          console.warn('⚠️ window.pdfMake는 있지만 vfs가 없습니다.');
        }
      } else {
        console.error('❌ window.pdfMake가 undefined입니다. PDF 엔진이 로드되지 않았습니다.');
      }
    }
  }, []);

  const handleCheck = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    if (key === 'all') {
      setChecked({
        all: value,
        info: value,
        summary: value,
        tasks: value,
        feedback: value,
        recommend: value,
      });
    } else {
      const newChecked = { ...checked, [key]: value };
      // '전체'는 하위 항목이 모두 true일 때만 true
      newChecked.all =
        newChecked.info &&
        newChecked.summary &&
        newChecked.tasks &&
        newChecked.feedback &&
        newChecked.recommend;
      setChecked(newChecked);
    }
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <TopRow>
          <PDFIcon src="/images/recommendfile.svg" alt="PDF" />
          <Title>회의 결과 PDF 다운로드</Title>
        </TopRow>
        <SectionLabel>PDF에 포함할 항목 선택</SectionLabel>
        <CheckboxGroup>
          {PDF_ITEMS.map((item) => (
            <CheckboxLabel key={item.key}>
              <Checkbox
                checked={
                  item.key === 'info'
                    ? true
                    : checked[item.key as keyof typeof checked]
                }
                onChange={
                  item.key === 'info'
                    ? undefined
                    : handleCheck(item.key)
                }
                readOnly={item.key === 'info'}
                onClick={item.key === 'info' ? () => alert('회의 기본 정보는 필수 사항입니다.') : undefined}
              />
              {item.label}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
        <div style={{ flex: 1 }} />
        <DownloadButton
          onClick={() => {
            console.log('PDF로 넘기는 feedback 값:', feedback);
            generateMeetingPDF({
              checked,
              meetingInfo,
              summary,
              tasks,
              feedback,
              recommendFiles,
            });
          }}
        >
          PDF 다운로드
        </DownloadButton>
        <CloseBtn onClick={onClose}>&times;</CloseBtn>
      </ModalBox>
    </ModalOverlay>
  );
};

export default PDFPopup; 