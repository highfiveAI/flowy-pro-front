import styled from "styled-components";

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 0 0 0;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

export const AddButton = styled.button`
  background: #351745;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.2);

  &:hover {
    background: #4b2067;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(80, 0, 80, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #4b2067;
  margin-bottom: 40px;
`;
export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 18px;
`;
export const TableWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.04);
  padding: 32px 24px 24px 24px;
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

  &:hover {
    background-color: #f3eef7;
  }
`;
export const IconBtn = styled.button`
  background: #f3eef7;
  border: none;
  border-radius: 6px;
  padding: 6px 8px;
  margin-right: 6px;
  color: #7b5fa1;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e0ee;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;
export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 200px;
`;
