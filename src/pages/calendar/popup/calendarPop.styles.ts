import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
export const PopContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 350px;
  height: 400px;
  padding: 32px 28px 24px 28px;
  box-shadow: 0 4px 24px rgba(80, 0, 80, 0.13);
  position: relative;
  overflow-y: auto;
`;
export const Title = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  color: #351745;
  margin-bottom: 18px;
`;
export const Section = styled.div`
  margin-bottom: 18px;
`;
export const MeetingBox = styled.div`
  color: #5e5553;
  border-radius: 3px;
  font-weight: 600;
  padding: 4px 8px;
  margin-bottom: 4px;
  display: block;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.04);
`;
export const TodoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
  font-weight: 600;
  color: #5e5553;
  font-size: 0.9rem;
`;
export const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
`;
export const LargeCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  margin-right: 6px;
  cursor: pointer;
  accent-color: #351745;
`;
export const MeetingTimeBox = styled.span`
  background: rgba(190, 32, 116, 0.14);
  color: #5e5553;
  border-radius: 3px;
  font-weight: 600;
  padding: 2px 6px;
  margin-right: 6px;
  font-size: 0.9rem;
`;

export const PopupFloatingAddButton = styled.button`
  position: absolute;
  right: 24px;
  bottom: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #351745;
  color: #fff;
  font-size: 2rem;
  border: none;
  box-shadow: 0 2px 8px rgba(80,0,80,0.13);
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  &:hover {
    background: #5a2a84;
  }
`;

export const PopupTooltip = styled.div`
  position: absolute;
  right: 80px;
  bottom: 36px;
  background: #351745;
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  white-space: nowrap;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(80,0,80,0.13);
  pointer-events: none;
  opacity: 0.95;
`;
