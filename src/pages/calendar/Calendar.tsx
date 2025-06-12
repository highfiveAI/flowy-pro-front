// react-big-calendar와 moment가 설치되어 있어야 합니다.
// 설치 명령: npm install react-big-calendar moment
// 타입: npm install --save-dev @types/react-big-calendar @types/moment

import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import styled from 'styled-components'
import { INITIAL_EVENTS } from './event-utils'
import type { CalendarEvent } from './event-utils'
import { isSameDay } from 'date-fns'

const CalendarWrapper = styled.div`
  max-width: 1100px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(80,0,80,0.06);
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
    border: 1px solid #C7B8D9;
    border-radius: 0;
    box-shadow: none;
    position: relative;
  }
  .react-calendar__tile abbr {
    display: none !important;
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
    box-shadow: 0 2px 8px rgba(80,0,80,0.04);
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
    color: #5E5553;
    padding: 8px 0;
    border: 1px solid #C7B8D9;
    border-bottom: none;
    background: #f8f6fa;
  }
  .react-calendar__month-view__weekdays__weekday:first-child {
    color: #C00F0CB2;
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
`

export default function CalendarPage() {
  const [value, setValue] = useState(new Date(2025, 5, 1))
  const [events, setEvents] = useState(INITIAL_EVENTS)

  const handleToggleTodo = (id: string) => {
    setEvents(prevEvents => prevEvents.map(ev =>
      ev.id === id && ev.type === 'todo'
        ? { ...ev, completed: !ev.completed }
        : ev
    ));
  }

  return (
    <CalendarWrapper>
      <Calendar
        value={value}
        onChange={v => setValue(v as Date)}
        tileContent={({ date, view }) => {
          if (view === 'month') {
            const day = date.getDate().toString().padStart(2, '0');
            const dayTodos = events.filter(ev => ev.type === 'todo' && isSameDay(new Date(ev.start), date));
            const dayMeetings = events.filter(ev => ev.type === 'meeting' && isSameDay(new Date(ev.start), date));
            return (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <span style={{
                  position: 'absolute',
                  top: 8,
                  right: 10,
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  color: '#333',
                  zIndex: 2
                }}>{day}</span>
                <div style={{ width: '100%', paddingTop: 35 }}>
                  {dayMeetings.map(m => (
                    <div key={m.id} className="calendar-event">{m.title}</div>
                  ))}
                  {dayTodos.map(t => (
                    <div key={t.id} className="calendar-todo">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => handleToggleTodo(t.id)}
                        style={{ marginRight: 4 }}
                      />
                      <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</span>
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
  )
}