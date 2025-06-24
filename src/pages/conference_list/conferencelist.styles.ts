import styled from "styled-components";

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 0 0 0;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #4b2067;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 18px;
`;

export const SectionTitleLink = styled.span`
  color: inherit;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3eef7;
  }
`;

export const TableWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.04);
  padding: 24px 24px 24px 24px;
  position: relative;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #333;
  background-color: #fff;
  min-width: 200px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #351745;
  }

  &:focus {
    outline: none;
    border-color: #351745;
    box-shadow: 0 0 0 2px rgba(53, 23, 69, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

export const NoResultsMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 40px;
  font-size: 0.9375rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
export const Th = styled.th`
  text-align: left;
  font-size: 1rem;
  color: #7b5fa1;
  font-weight: 600;
  padding: 8px 0 12px 0;
  border-bottom: 1px solid #e5e0ee;
`;
export const Tr = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #f2f2f2;
  }

  /* 호버 효과 추가 */
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f8f5ff;
    transform: scale(1.01);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.1);
  }

  /* 선택된 상태 */
  &.selected {
    background-color: #e5e0ee;
    border-left: 4px solid #4b2067;
  }

  &.selected:hover {
    background-color: #d4c7e8;
  }
`;
export const Td = styled.td`
  font-size: 1rem;
  color: #333;
  padding: 16px 0;

  /* 셀 호버 효과 */
  transition: background-color 0.2s ease;
`;
