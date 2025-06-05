import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Box = styled.div`
  width: 400px;
  min-height: 100px;
  border: 2px solid #ccc;
  border-radius: 12px;
  margin: 1rem 0;
  background-color: #ffffff;
  padding: 1rem;
  box-sizing: border-box;
`;

const LinkItem = styled.a`
  display: block;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ResultContents: React.FC<{ result: any }> = ({ result }) => {
  if (!result) return null;

  return (
    <Wrapper>
      요약
      <Box>{result.summary || '요약 정보가 없습니다.'}</Box>
      역할분담
      <Box>{result.roles || '역할 정보가 없습니다.'}</Box>
      추천 문서
      <Box>
        {Array.isArray(result.search_result) &&
        result.search_result.length > 0 ? (
          result.search_result.map((url: string, index: number) => (
            <LinkItem
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 관련 문서 {index + 1}.{url}
            </LinkItem>
          ))
        ) : (
          <div>추천 문서가 없습니다.</div>
        )}
      </Box>
    </Wrapper>
  );
};

export default ResultContents;
