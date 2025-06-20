import React, { useState } from 'react';
import styled from 'styled-components';
import EditEventPop from './edit_utils';

interface CalendarPopProps {
  date: Date;
  todos: {
    id: string;
    title: string;
    completed?: boolean;
    start?: Date | string;
    end?: Date | string;
    comment?: string;
  }[];
  meetings: {
    id: string;
    title: string;
    start?: Date | string;
    end?: Date | string;
    comment?: string;
  }[];
  onClose: () => void;
  onEdit?: (id: string, completed: boolean) => void;
}

const Overlay = styled.div`
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
const PopContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  min-width: 320px;
  max-width: 90vw;
  padding: 32px 28px 24px 28px;
  box-shadow: 0 4px 24px rgba(80, 0, 80, 0.13);
  position: relative;
`;
const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #351745;
  margin-bottom: 18px;
`;
const Section = styled.div`
  margin-bottom: 18px;
`;
const MeetingBox = styled.div`
  color: #5e5553;
  border-radius: 3px;
  font-weight: 600;
  padding: 4px 8px;
  margin-bottom: 4px;
  display: inline-block;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.04);
`;
const TodoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
  font-weight: 600;
  color: #5e5553;
  font-size: 0.9rem;
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
`;
const LargeCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  margin-right: 6px;
  cursor: pointer;
  accent-color: #351745;
`;
const MeetingTimeBox = styled.span`
  background: rgba(190, 32, 116, 0.14);
  color: #5e5553;
  border-radius: 3px;
  font-weight: 600;
  padding: 2px 6px;
  margin-right: 6px;
  font-size: 0.9rem;
`;

// 12시간제 한글 시간 포맷 함수 추가
// function formatTime12(t: Date | string | undefined) {
//   if (!t) return '';
//   const d = typeof t === 'string' ? new Date(t) : t;
//   if (isNaN(d.getTime())) return '';
//   let h = d.getHours();
//   const m = d.getMinutes();
//   const ampm = h < 12 ? '오전' : '오후';
//   let hour12 = h % 12;
//   if (hour12 === 0) hour12 = 12;
//   return `${ampm} ${hour12.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
// }

const CalendarPop: React.FC<CalendarPopProps> = ({
  date,
  todos,
  meetings,
  onClose,
  onEdit,
}) => {
  const [editTarget, setEditTarget] = useState<null | {
    type: 'todo' | 'meeting';
    event: any;
  }>(null);

  return (
    <Overlay onClick={onClose}>
      <PopContainer onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>닫기 ✕</CloseBtn>
        <Title>
          {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일 일정
        </Title>
        <Section>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>회의</div>
          {meetings.length === 0 ? (
            <div style={{ color: '#aaa' }}>회의 없음</div>
          ) : (
            meetings.map((m) => {
              let timeStr = '';
              if (m.start) {
                const d =
                  typeof m.start === 'string' ? new Date(m.start) : m.start;
                if (!isNaN(d.getTime())) {
                  const h = d.getHours();
                  const min = d.getMinutes();
                  const ampm = h < 12 ? '오전' : '오후';
                  let hour12 = h % 12;
                  if (hour12 === 0) hour12 = 12;
                  timeStr = `${ampm} ${hour12.toString().padStart(2, '0')}:${min
                    .toString()
                    .padStart(2, '0')}`;
                }
              }
              return (
                <MeetingBox
                  key={
                    m.id
                  } /* onClick={() => setEditTarget({ type: 'meeting', event: m })} style={{cursor:'pointer'}}*/
                >
                  {timeStr && <MeetingTimeBox>{timeStr}</MeetingTimeBox>}
                  {m.title}
                </MeetingBox>
              );
            })
          )}
        </Section>
        <Section>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>할 일</div>
          {todos.length === 0 ? (
            <div style={{ color: '#aaa' }}>할 일 없음</div>
          ) : (
            todos.map((t) => (
              <TodoBox
                key={t.id}
                onClick={(e) => {
                  if (e.target === e.currentTarget)
                    setEditTarget({ type: 'todo', event: t });
                }}
                style={{ cursor: 'pointer' }}
              >
                <LargeCheckbox
                  checked={t.completed}
                  // onClick={e => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    console.log('체크박스 onEdit 호출', t.id, !t.completed);
                    onEdit && onEdit(t.id, !t.completed);
                  }}
                />
                <span
                  style={{
                    textDecoration: t.completed ? 'line-through' : 'none',
                  }}
                >
                  {t.title}
                </span>
              </TodoBox>
            ))
          )}
        </Section>
        {editTarget && (
          <EditEventPop
            type={editTarget.type}
            event={editTarget.event}
            onSave={(id: string, completed: boolean) => {
              onEdit && onEdit(id, completed);
              setEditTarget(null);
            }}
            onClose={() => setEditTarget(null)}
          />
        )}
      </PopContainer>
    </Overlay>
  );
};

export default CalendarPop;
