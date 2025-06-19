// react-big-calendar와 moment가 설치되어 있어야 합니다.
// 설치 명령: npm install react-big-calendar moment
// 타입: npm install --save-dev @types/react-big-calendar @types/moment

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import type { CalendarEvent } from './event-utils';
import { isSameDay } from 'date-fns';
import { FaRegFileAlt } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import CalendarPop from './popup/calendarPop';

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
const TodayButton = styled.button`
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

const CalendarCheckbox = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
  accent-color: #351745;
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
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        border: '1.5px solid #C7B8D9',
        borderRadius: 8,
        padding: 16,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(80,0,80,0.08)',
        width: 270,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ fontSize: '1rem', marginRight: 8 }}
        >
          {Array.from({ length: 20 }, (_, i) => 2015 + i).map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          style={{ fontSize: '1rem', marginRight: 16 }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>
        <ApplyButton
          onClick={() => onChange(year, month)}
          style={{
            padding: '0 18px',
            height: 36,
            fontSize: '0.8rem',
            marginLeft: 0,
          }}
        >
          이동
        </ApplyButton>
        <button
          onClick={onClose}
          style={{
            marginLeft: 8,
            background: 'none',
            border: 'none',
            color: '#351745',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [value, setValue] = useState<Date>(new Date(2025, 5, 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [popupDate, setPopupDate] = useState<Date | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [projects, setProjects] = useState<
    { project_id: string; project_name: string }[]
  >([]);

  // 1. 로그인한 사용자의 user_id를 먼저 가져온다
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/one`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user_id) setUserId(data.user_id);
      })
      .catch((err) => {
        console.error('유저 정보 불러오기 실패:', err);
      });
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects/user_id/${userId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        // 중첩된 구조에서 project_id, project_name만 추출
        const projectList = data.map((item: any) => ({
          project_id: item.project.project_id,
          project_name: item.project.project_name,
        }));
        setProjects(projectList);
        if (projectList.length > 0)
          setSelectedProjectId(projectList[0].project_id);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId || !selectedProjectId) return;
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/calendar/${userId}/${selectedProjectId}`,
      {
        credentials: 'include',
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setEvents(
          data.map((ev: any) => ({
            id: ev.calendar_id,
            user_id: ev.user_id,
            project_id: ev.project_id,
            title: ev.title,
            start: ev.start ? new Date(ev.start) : undefined,
            end: ev.end ? new Date(ev.end) : undefined,
            type: ev.calendar_type,
            completed: ev.completed,
            created_at: ev.created_at,
            updated_at: ev.updated_at,
          }))
        );
      });
  }, [userId, selectedProjectId]);

  // const handleToggleTodo = (id: string) => {
  //   setEvents((prevEvents) =>
  //     prevEvents.map((ev) =>
  //       ev.id === id && ev.type === 'todo'
  //         ? { ...ev, completed: !ev.completed }
  //         : ev
  //     )
  //   );
  // };

  // 월 이동 함수
  const handlePrevMonth = () => {
    setValue((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setValue((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleYearMonthClick = () => setShowPicker(true);
  const handleYearMonthChange = (year: number, month: number) => {
    setValue(new Date(year, month - 1, 1));
    setShowPicker(false);
  };

  const handleToday = () => {
    setValue(new Date());
    setShowPicker(false);
  };

  // completed만 수정하는 간단한 핸들러
  const handleEditCompleted = (id: string, completed: boolean) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/calendar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        calendar_id: id,
        completed: completed,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === id ? { ...ev, completed: data.completed } : ev
          )
        );
      });
  };

  // 팝업 닫기 함수 추가 (팝업이 닫힐 때 포커스 해제)
  const handleClosePopup = () => {
    setPopupDate(null);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <CalendarWrapper>
      <HeaderBar>
        <div style={{ position: 'relative' }}>
          <Title>작업 관리</Title>
          <MonthNav>
            <NavButton onClick={handlePrevMonth}>
              <FiChevronLeft />
            </NavButton>
            <MonthText
              onClick={handleYearMonthClick}
              style={{ cursor: 'pointer' }}
            >
              {formatYearMonth(value)}
            </MonthText>
            <NavButton onClick={handleNextMonth}>
              <FiChevronRight />
            </NavButton>
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
              <FilterSelect
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map((proj) => (
                  <option key={proj.project_id} value={proj.project_id}>
                    {proj.project_name}
                  </option>
                ))}
              </FilterSelect>
            </FilterSelectBox>
            <ApplyButton>적용</ApplyButton>
          </FilterArea>
        </RightBox>
      </HeaderBar>
      <Calendar
        value={value}
        onChange={(v) => setValue(v as Date)}
        tileContent={({ date, view }) => {
          if (!date) return null;
          if (view === 'month') {
            const day = date.getDate().toString().padStart(2, '0');
            const dayTodos = events.filter(
              (ev) => ev.type === 'todo' && isSameDay(new Date(ev.start), date)
            );
            const dayMeetings = events.filter(
              (ev) =>
                ev.type === 'meeting' && isSameDay(new Date(ev.start), date)
            );
            const dayOfWeek = date.getDay(); // 0: 일, 6: 토
            const isCurrentMonth = date.getMonth() === value.getMonth();
            let dayClass = '';
            if (isCurrentMonth) {
              if (dayOfWeek === 0) dayClass = 'calendar-sunday';
              if (dayOfWeek === 6) dayClass = 'calendar-saturday';
            }
            return (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupDate(date);
                }}
              >
                <span
                  className={dayClass}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 10,
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    zIndex: 2,
                  }}
                >
                  {day}
                </span>
                <div style={{ width: '100%', paddingTop: 35 }}>
                  {dayMeetings.map((m) => {
                    let timeStr = '';
                    if (m.start) {
                      const d =
                        typeof m.start === 'string'
                          ? new Date(m.start)
                          : m.start;
                      if (
                        !isNaN(d.getTime()) &&
                        (d.getHours() !== 0 || d.getMinutes() !== 0)
                      ) {
                        timeStr = d.toTimeString().slice(0, 5) + ' ';
                      }
                    }
                    return (
                      <div key={m.id} className="calendar-event">
                        {timeStr}
                        {m.title}
                      </div>
                    );
                  })}
                  {dayTodos.map((t) => (
                    <div key={t.id} className="calendar-todo">
                      <CalendarCheckbox
                        checked={t.completed}
                        onChange={(e) => {
                          e.stopPropagation(); // 체크박스 클릭 시 상위 이벤트 전파 중단
                          handleEditCompleted(t.id, !t.completed);
                        }}
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
      {popupDate && (
        <CalendarPop
          date={popupDate}
          todos={events.filter(
            (ev) =>
              ev.type === 'todo' && isSameDay(new Date(ev.start), popupDate)
          )}
          meetings={events.filter(
            (ev) =>
              ev.type === 'meeting' && isSameDay(new Date(ev.start), popupDate)
          )}
          onClose={handleClosePopup}
          onEdit={handleEditCompleted}
        />
      )}
    </CalendarWrapper>
  );
}
