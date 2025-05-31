// ThreeBoxes.tsx
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center; // 수평 중앙 정렬
  justify-content: center; // 수직 중앙 정렬
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Box = styled.div`
  width: 400px;
  height: 100px;
  border: 2px solid #ccc;
  border-radius: 12px;
  margin: 1rem 0;
  background-color: #ffffff;
`;

const ResultContents: React.FC = () => {
  return (
    <Wrapper>
      <Box>요약</Box>
      <Box>역할분담</Box>
      <Box>추천 문서</Box>
    </Wrapper>
  );
};

export default ResultContents;
