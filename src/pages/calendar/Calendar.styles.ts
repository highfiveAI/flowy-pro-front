import styled from "styled-components";

export const CalendarWrapper = styled.div`
  max-width: 1100px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(80, 0, 80, 0.06);
  padding: 40px 32px 32px 32px;

  .react-calendar {
    width: 100% !important;
    min-width: 900px;
    max-width: 100%;
    font-size: 1.1rem;
    border: none;
    background: #fff;
  }
  .react-calendar__navigation {
    display: none;
  }
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-rows: repeat(6, 1fr);
    grid-template-columns: repeat(7, 1fr);
    min-height: 800px;
    height: 800px;
  }
  .react-calendar__tile {
    height: auto !important;
    min-height: 0;
    vertical-align: top;
    white-space: normal;
    word-break: keep-all;
    padding: 8px 6px 4px 6px;
    text-align: left;
    background: #fff;
    border: 1px solid #c7b8d9;
    border-radius: 0;
    box-shadow: none;
    position: relative;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .react-calendar__tile:hover {
    background: #f8f5ff !important;
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.1);
    z-index: 1;
  }
  .react-calendar__tile:active {
    transform: scale(0.98);
  }
  .react-calendar__tile abbr {
    display: none !important;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #bbb !important;
    background: rgb(224, 224, 224) !important;
    opacity: 0.7;
  }

  .calendar-event,
  .calendar-todo {
    font-size: 0.8rem;

    margin-top: 0;
  }
  .calendar-event {
    background: rgba(190, 32, 116, 0.14);
    color: #5e5553;
    border-radius: 3px;
    font-weight: 600;
    padding: 4px 8px;
    margin-bottom: 4px;
    display: inline-block;
    font-size: 0.8rem;
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.04);
  }
  .calendar-todo {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
    font-weight: 600;
    color: #5e5553;
  }
  .react-calendar__month-view__weekdays {
    font-weight: bold;
    font-size: 1.1rem;
    background: #f8f6fa;
  }
  .react-calendar__month-view__weekdays__weekday {
    color: #5e5553;
    padding: 8px 0;
    border: 1px solid #c7b8d9;
    border-bottom: none;
    background: #f8f6fa;
  }
  .react-calendar__month-view__weekdays__weekday:first-child {
    color: #c00f0cb2;
  }
  .react-calendar__month-view__weekdays__weekday:last-child {
    color: #283990;
  }
  .react-calendar__tile--now {
    background: #f3e6ff !important;
    border-radius: 8px;
  }
  .react-calendar__tile--active {
    background: #fff !important;
  }

  .react-calendar__month-view__weekNumbers {
    color: #351745;
    font-weight: 600;
    background: #f8f6fa;
  }
  .react-calendar__tile--weekNumber {
    color: #351745;
    font-weight: 600;
    background: #f8f6fa;
  }
  .calendar-sunday {
    color: #c00f0cb2 !important;
  }
  .calendar-saturday {
    color: #283990 !important;
  }
`;

export const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #4b2067;
  margin: 0 0 16px 0;
`;
export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;
export const NavButton = styled.button`
  border: 1.5px solid #c7b8d9;
  background: #fff;
  color: #351745;
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f3e6ff;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;
export const MonthText = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  min-width: 120px;
  text-align: center;
  user-select: none;
`;
export const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
export const FilterArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
export const FilterSelectBox = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid #e3d6f2;
  border-radius: 8px;
  padding: 0 18px 0 14px;
  height: 48px;
  min-width: 220px;
  font-size: 1.08rem;
  color: #351745;
  gap: 10px;
`;
export const FilterSelect = styled.select`
  border: none;
  background: transparent;
  font-size: 1.08rem;
  color: #351745;
  outline: none;
  padding: 0 8px;
`;
export const ApplyButton = styled.button`
  background: #351745;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 600;
  height: 48px;
  padding: 0 32px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #4b2067;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(80, 0, 80, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;
export const TodayButton = styled.button`
  background: white;
  color: #351745;
  border: 1.5px solid #351745;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 600;
  height: 48px;
  padding: 0 32px;
  cursor: pointer;
  margin-left: 0;
  transition: all 0.2s ease;

  &:hover {
    background: #f3e6ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(80, 0, 80, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CalendarCheckbox = styled.input.attrs({ type: "checkbox" })`
  cursor: pointer;
  accent-color: #351745;
`;

export const CalendarLayout = styled.div`
  position: relative;
  width: 100vw;
  min-height: 120vh;
  background: #f5f5f5;
`;

export const CalendarFixedBox = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 1100px;
  min-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

export const UnscheduledPanel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 200px;
  right: 50px;
  width: 250px;
  background: #f8f5ff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(80, 0, 80, 0.06);
  padding: 24px;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const TaskList = styled.div`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 8px;
`;

export const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(199, 184, 217, 0.1);
  }
`;

export const TaskCheckbox = styled.input.attrs({ type: "checkbox" })`
  margin-right: 10px;
  accent-color: #351745;
  width: 18px;
  height: 18px;
`;

export const TaskTitle = styled.span<{ completed?: boolean }>`
  font-size: 1.05rem;
  color: ${(props) => (props.completed ? "#b0a3c2" : "#351745")};
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  font-weight: 500;
  transition: color 0.18s;
  border-bottom: 1.5px solid transparent;
  ${TaskItem}:hover & {
    border-bottom: 1.5px solid #a48be0;
  }
`;
