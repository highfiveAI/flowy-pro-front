import React, { useState } from "react";
import EditEventPop from "./edit_utils";
import {
  CloseBtn,
  LargeCheckbox,
  MeetingBox,
  MeetingTimeBox,
  Overlay,
  PopContainer,
  Section,
  TodoBox,
} from "./calendarPop.styles";
import { Title } from "../Calendar.styles";

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
    type: "todo" | "meeting";
    event: any;
  }>(null);

  return (
    <Overlay onClick={onClose}>
      <PopContainer onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>✕</CloseBtn>
        <Title>
          {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일 일정
        </Title>
        <Section>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>회의</div>
          {meetings.length === 0 ? (
            <div style={{ color: "#aaa" }}>회의 없음</div>
          ) : (
            meetings.map((m) => {
              let timeStr = "";
              if (m.start) {
                const d =
                  typeof m.start === "string" ? new Date(m.start) : m.start;
                if (!isNaN(d.getTime())) {
                  const h = d.getHours();
                  const min = d.getMinutes();
                  const ampm = h < 12 ? "오전" : "오후";
                  let hour12 = h % 12;
                  if (hour12 === 0) hour12 = 12;
                  timeStr = `${ampm} ${hour12.toString().padStart(2, "0")}:${min
                    .toString()
                    .padStart(2, "0")}`;
                }
              }
              return (
                <MeetingBox
                  key={m.id}
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
            <div style={{ color: "#aaa" }}>할 일 없음</div>
          ) : (
            todos.map((t) => (
              <TodoBox
                key={t.id}
                onClick={(e) => {
                  if (e.target === e.currentTarget)
                    setEditTarget({ type: "todo", event: t });
                }}
                style={{ cursor: "pointer" }}
              >
                <LargeCheckbox
                  checked={t.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(t.id, !t.completed);
                  }}
                />
                <span
                  style={{
                    textDecoration: t.completed ? "line-through" : "none",
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
