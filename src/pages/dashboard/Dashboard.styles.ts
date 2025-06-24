import styled, { css, keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  background-color: #f8f9fa;
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 24px;
  padding-top: 100px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  @media (max-width: 768px) {
    padding: 16px;
    padding-top: 80px;
  }
`;

export const MeetingAnalysisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

export const MeetingAnalysisTitle = styled.h2`
  font-size: 1.5rem;
  color: #351745;
  margin: 0;
  font-weight: 600;
`;

export const Section = styled.div`
  background: #fff;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #351745;
  margin: 0;
  font-weight: 600;
`;

export const SectionBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  max-height: none;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const EditButton = styled.button`
  background-color: #351745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  margin-left: 16px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #480b6a;
  }
`;

export const BasicInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  @media (max-width: 768px) {
    grid-template-columns: 100px 1fr;
    gap: 12px;
  }
`;

export const InfoLabel = styled.div`
  font-weight: 600;
  color: #351745;
  font-size: 0.9375rem;
`;

export const InfoContent = styled.div`
  color: #333;
  font-size: 0.9375rem;
  line-height: 1.5;
`;

export const SummaryContent = styled.div`
  padding: 0;
`;

export const SummarySection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SummarySectionHeader = styled.h4`
  color: #351745;
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;

export const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SummaryListItem = styled.li`
  margin-bottom: 12px;
  color: #333;
  line-height: 1.6;
  font-size: 0.9375rem;
  padding-left: 20px;
  position: relative;

  &:before {
    content: '•';
    color: #351745;
    position: absolute;
    left: 0;
    font-size: 1.2em;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TaskGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const TaskCard = styled.div<{ $isUnassigned?: boolean }>`
  border-radius: 12px;
  border: 1px solid
    ${(props) => (props.$isUnassigned ? 'rgba(210, 0, 0, 0.3)' : '#e0e0e0')};
  background: ${(props) =>
    props.$isUnassigned ? 'rgba(210, 0, 0, 0.02)' : '#fff'};
  padding: 20px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

export const TaskCardTitle = styled.h4<{ $isUnassigned?: boolean }>`
  font-size: 1.125rem;
  margin: 0;
  color: ${(props) => (props.$isUnassigned ? '#d20000' : '#351745')};
  font-weight: 600;
`;

export const TaskCardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

export const TaskCardListItem = styled.li`
  margin-bottom: 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  line-height: 1.5;
  font-size: 0.9375rem;
  padding-left: 20px;
  position: relative;

  &:before {
    content: '•';
    color: #351745;
    position: absolute;
    left: 0;
    font-size: 1.2em;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TaskCardDate = styled.span`
  color: #666;
  font-size: 0.875rem;
  margin-left: 12px;
  white-space: nowrap;
  padding: 2px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;

export const RecommendFileItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const SpeechBubbleButton = styled.button`
  position: relative;
  background: #f3eef8;
  border: none;
  border-radius: 16px;
  padding: 8px 20px 8px 18px;
  margin-left: 12px;
  font-weight: 500;
  color: #351745;
  font-size: 15px;
  box-shadow: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 2px 8px rgba(53, 23, 69, 0.08);
  }
`;

// const RectButton = styled.button`
//   background: #f3eef8;
//   border: none;
//   border-radius: 4px;
//   padding: 8px 20px 8px 18px;
//   margin-left: 8px;
//   font-weight: 500;
//   color: #351745;
//   font-size: 15px;
//   box-shadow: none;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   transition: box-shadow 0.15s;
//   &:hover {
//     box-shadow: 0 2px 8px rgba(53, 23, 69, 0.08);
//   }
// `;

export const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding: 0 24px;
  width: 96%;
`;

export const StyledInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
`;

export const AddButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 12px 20px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #2563eb;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// const RoleContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 16px;
//   padding: 16px;
// `;

// const Card = styled.div<{ highlight?: boolean }>`
//   border: 1px solid ${({ highlight }) => (highlight ? 'red' : '#ccc')};
//   padding: 16px;
//   border-radius: 8px;
//   background-color: ${({ highlight }) => (highlight ? '#fff6f6' : '#fff')};
// `;

// const Title = styled.h3`
//   font-size: 16px;
//   font-weight: bold;
// `;

// const TaskItem = styled.div`
//   margin-top: 8px;
//   font-size: 14px;
// `;

const moveDash = keyframes`
  0% {
    background-position: 0 0, 0 0, 0 100%, 100% 0;
  }
  100% {
    background-position: 40px 0, 0 40px, -40px 100%, 100% -40px;
  }
`;

export const RedSection = styled.div<{ isEditing?: boolean }>`
  padding: 1rem;
  border-radius: 0.5rem;
  position: relative;
  z-index: 1;

  ${({ isEditing }) =>
    isEditing &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border-radius: 0.75rem;
        z-index: -1;

        background-image: repeating-linear-gradient(
            90deg,
            red 0 10px,
            transparent 10px 20px
          ),
          repeating-linear-gradient(180deg, red 0 10px, transparent 10px 20px),
          repeating-linear-gradient(270deg, red 0 10px, transparent 10px 20px),
          repeating-linear-gradient(0deg, red 0 10px, transparent 10px 20px);

        background-size: 100% 2px, 2px 100%, 100% 2px, 2px 100%;
        background-repeat: no-repeat;
        background-position: top left, top right, bottom right, bottom left;

        animation: ${moveDash} 2s linear infinite;
        mask-image: linear-gradient(#000, #000); /* 깔끔한 mask fallback */
        mask-composite: intersect;
        pointer-events: none;
      }
    `}
`;
