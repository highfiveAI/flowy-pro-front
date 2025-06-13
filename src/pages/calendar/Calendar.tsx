// react-big-calendar와 moment가 설치되어 있어야 합니다.
// 설치 명령: npm install react-big-calendar moment
// 타입: npm install --save-dev @types/react-big-calendar @types/moment

import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import styled from 'styled-components'
import { INITIAL_EVENTS } from './event-utils'
import type { CalendarEvent } from './event-utils'
import { isSameDay, getWeek } from 'date-fns'
import { FaRegFileAlt } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

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
  .react-calendar__navigation {
    display: none;
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

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #bbb !important;
    background:rgb(224, 224, 224) !important;
    opacity: 0.7;
  }
  .calendar-event, .calendar-todo {

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
    color: #C00F0CB2 !important;
  }
  .calendar-saturday {
    color: #283990 !important;
  }
`


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
const TodayButton = styled(ApplyButton)`
  margin-left: 0;
`;

function formatYearMonth(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
}

function YearMonthPicker({
  currentDate,
  onChange,
  onClose,
}: {
  currentDate: Date;
  onChange: (year: number, month: number) => void;
  onClose: () => void;
}) {
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  return (
    <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1.5px solid #C7B8D9', borderRadius: 8, padding: 16, zIndex: 100, boxShadow: '0 2px 12px rgba(80,0,80,0.08)', width: 270 }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ fontSize: '1rem', marginRight: 8 }}>
          {Array.from({ length: 20 }, (_, i) => 2015 + i).map(y => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>
        <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ fontSize: '1rem', marginRight: 16 }}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </select>
        <ApplyButton onClick={() => onChange(year, month)} style={{ padding: '0 18px', height: 36, fontSize: '0.8rem', marginLeft: 0 }}>이동</ApplyButton>
        <button onClick={onClose} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#351745', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>닫기</button>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [value, setValue] = useState(new Date(2025, 5, 1))
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [showPicker, setShowPicker] = useState(false);


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

  const handleYearMonthClick = () => setShowPicker(true);
  const handleYearMonthChange = (year: number, month: number) => {
    setValue(new Date(year, month - 1, 1));
    setShowPicker(false);
  };

  const handleToday = () => {
    setValue(new Date());
  };

  return (
    <CalendarWrapper>
      <HeaderBar>
        <div style={{ position: 'relative' }}>
          <Title>작업 관리</Title>
          <MonthNav>
            <NavButton onClick={handlePrevMonth}><FiChevronLeft /></NavButton>
            <MonthText onClick={handleYearMonthClick} style={{ cursor: 'pointer' }}>{formatYearMonth(value)}</MonthText>
            <NavButton onClick={handleNextMonth}><FiChevronRight /></NavButton>
            {showPicker && (
              <YearMonthPicker
                currentDate={value}
                onChange={handleYearMonthChange}
                onClose={() => setShowPicker(false)}
              />
            )}
            <TodayButton onClick={handleToday}>오늘</TodayButton>

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
            const dayTodos = events.filter(ev => ev.type === 'todo' && isSameDay(new Date(ev.start), date));
            const dayMeetings = events.filter(ev => ev.type === 'meeting' && isSameDay(new Date(ev.start), date));
            const dayOfWeek = date.getDay(); // 0: 일, 6: 토
            const isCurrentMonth = date.getMonth() === value.getMonth();
            let dayClass = '';
            if (isCurrentMonth) {
              if (dayOfWeek === 0) dayClass = 'calendar-sunday';
              if (dayOfWeek === 6) dayClass = 'calendar-saturday';
            }
            return (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <span className={dayClass} style={{
                  position: 'absolute',
                  top: 8,
                  right: 10,
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  zIndex: 2
                }}>{day}</span>
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
        calendarType="gregory"
      />
    </CalendarWrapper>
  );
}
