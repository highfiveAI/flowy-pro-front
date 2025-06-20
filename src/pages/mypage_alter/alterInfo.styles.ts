import styled from 'styled-components';

export const AlterInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

export const PageTitle = styled.h1`
  color: #351745;
  font-size: 2rem;
  position: absolute;
  top: 30px;
  left: 40px;
  margin: 0;
  padding: 0;
`;

export const FormArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px; /* 항목 간 간격 */
  width: 100%;
  max-width: 1000px; /* 폼 너비 조정 */
  padding: 20px;
  box-sizing: border-box;
  align-items: flex-start; /* FormContainer 내부 요소들을 좌측 정렬 */
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 입력란 박스들을 좌측 정렬 */
  width: 100%;
`;

export const Label = styled.label`
  color: #555;
  font-weight: normal;
  flex-shrink: 0;
  width: 150px; /* 레이블 너비 고정 */
  margin-right: 20px; /* 레이블과 입력 필드 사이 간격 */
`;

export const Input = styled.input<{ isEditing?: boolean }>`
  border: none;
  padding: 10px 15px;
  font-size: 1rem;
  outline: none;
  background: ${(props) =>
    props.isEditing ? '#f3eef7' : 'rgba(217, 217, 217, 0.3)'};
  width: 480px;
  flex-shrink: 0;
  transition: background-color 0.2s;

  &:focus {
    background: ${(props) =>
      props.isEditing ? '#e5e0ee' : 'rgba(217, 217, 217, 0.3)'};
  }
`;

export const Button = styled.button`
  background-color: #480b6a;
  color: #fff;
  padding: 8px 15px; /* 버튼 패딩 조정 */
  border: none;
  border-radius: 48px; /* 버튼 테두리 반경 변경 */
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: auto; /* 버튼을 오른쪽으로 밀어냅니다 */
  flex-shrink: 0; /* 버튼이 줄어들지 않도록 */

  &:hover {
    background-color: #351745;
  }
`;
