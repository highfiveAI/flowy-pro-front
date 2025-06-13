// react-big-calendar와 moment가 설치되어 있어야 합니다.
// 설치 명령: npm install react-big-calendar moment
// 타입: npm install --save-dev @types/react-big-calendar @types/moment

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { INITIAL_EVENTS } from './event-utils';
import { isSameDay } from 'date-fns';
import { FaRegFileAlt } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CalendarWrapper = styled.div`
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
  .react-calendar__month-view__days {
    min-height: 600px;
  }
  .react-calendar__tile {
    height: 135px;
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
  }
  .react-calendar__tile abbr {
    display: none !important;
  }
  .calendar-event,
  .calendar-todo {
    font-size: 0.85rem;
    margin-top: 0;
  }
  .calendar-event {
    background: #e9d6f7;
    color: #351745;
    border-radius: 8px;
    font-weight: 700;
    padding: 4px 8px;
    margin-bottom: 4px;
    display: inline-block;
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.04);
  }
  .calendar-todo {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
    color: #351745;
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
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #4b2067;
  margin: 0 0 16px 0;
`;
const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;
const NavButton = styled.button`
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
  transition: background 0.15s;
  &:hover {
    background: #f3e6ff;
  }
`;
const MonthText = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  min-width: 120px;
  text-align: center;
  user-select: none;
`;
const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const FilterArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const FilterSelectBox = styled.div`
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
const FilterSelect = styled.select`
  border: none;
  background: transparent;
  font-size: 1.08rem;
  color: #351745;
  outline: none;
  padding: 0 8px;
`;
const ApplyButton = styled.button`
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
  transition: background 0.15s;
  &:hover {
    background: #4b2067;
  }
`;

function formatYearMonth(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
}

type TileContentProps = {
  date: Date;
  view: 'month' | 'year' | 'decade' | 'century';
};

export default function CalendarPage() {
  const [value, setValue] = useState(new Date(2025, 5, 1));
  const [events, setEvents] = useState(INITIAL_EVENTS);

  const handleToggleTodo = (id: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === id && ev.type === 'todo'
          ? { ...ev, completed: !ev.completed }
          : ev
      )
    );
  };

  // 월 이동 함수
  const handlePrevMonth = () => {
    setValue((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };
  const handleNextMonth = () => {
    setValue((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  return (
    <CalendarWrapper>
      <HeaderBar>
        <div>
          <Title>작업 관리</Title>
          <MonthNav>
            <NavButton onClick={handlePrevMonth}>
              <FiChevronLeft />
            </NavButton>
            <MonthText>{formatYearMonth(value)}</MonthText>
            <NavButton onClick={handleNextMonth}>
              <FiChevronRight />
            </NavButton>
          </MonthNav>
        </div>
        <RightBox>
          <FilterArea>
            <FilterSelectBox>
              <FaRegFileAlt style={{ fontSize: '1.2rem', opacity: 0.7 }} />
              <FilterSelect>
                <option value="Insightlog">Insightlog</option>
                <option value="projectname1">projectname1</option>
                <option value="projectname2">projectname2</option>
              </FilterSelect>
            </FilterSelectBox>
            <ApplyButton>적용</ApplyButton>
          </FilterArea>
        </RightBox>
      </HeaderBar>
      <Calendar
        value={value}
        onChange={(v) => {
          if (v && v instanceof Date) {
            setValue(v);
          }
        }}
        tileContent={(props: TileContentProps) => {
          const { date, view } = props;

          if (view === 'month') {
            const day = date.getDate().toString().padStart(2, '0');
            const dayTodos = events.filter(
              (ev) => ev.type === 'todo' && isSameDay(new Date(ev.start), date)
            );
            const dayMeetings = events.filter(
              (ev) =>
                ev.type === 'meeting' && isSameDay(new Date(ev.start), date)
            );

            return (
              <div
                style={{ position: 'relative', width: '100%', height: '100%' }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 10,
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    color: '#333',
                    zIndex: 2,
                  }}
                >
                  {day}
                </span>
                <div style={{ width: '100%', paddingTop: 35 }}>
                  {dayMeetings.map((m) => (
                    <div key={m.id} className="calendar-event">
                      {m.title}
                    </div>
                  ))}
                  {dayTodos.map((t) => (
                    <div key={t.id} className="calendar-todo">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => handleToggleTodo(t.id)}
                        style={{ marginRight: 4 }}
                      />
                      <span
                        style={{
                          textDecoration: t.completed ? 'line-through' : 'none',
                        }}
                      >
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        }}
        formatDay={(_, date) => date.getDate().toString().padStart(2, '0')}
        locale="ko-KR"
      />
    </CalendarWrapper>
  );
}
