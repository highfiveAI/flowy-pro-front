// react-big-calendar와 moment가 설치되어 있어야 합니다.
// 설치 명령: npm install react-big-calendar moment
// 타입: npm install --save-dev @types/react-big-calendar @types/moment

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { CalendarEvent } from "./event-utils";
import { isSameDay } from "date-fns";
import { FaRegFileAlt } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CalendarPop from "./popup/calendarPop";
import {
  ApplyButton,
  CalendarCheckbox,
  CalendarWrapper,
  FilterArea,
  FilterSelect,
  FilterSelectBox,
  HeaderBar,
  MonthNav,
  MonthText,
  NavButton,
  RightBox,
  Title,
  TodayButton,
} from "./Calendar.styles";

function formatYearMonth(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
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
        position: "absolute",
        top: 60,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1.5px solid #C7B8D9",
        borderRadius: 8,
        padding: 16,
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(80,0,80,0.08)",
        width: 270,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ fontSize: "1rem", marginRight: 8 }}
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
          style={{ fontSize: "1rem", marginRight: 16 }}
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
            padding: "0 18px",
            height: 36,
            fontSize: "0.8rem",
            marginLeft: 0,
          }}
        >
          이동
        </ApplyButton>
        <button
          onClick={onClose}
          style={{
            marginLeft: 8,
            background: "none",
            border: "none",
            color: "#351745",
            fontWeight: 600,
            fontSize: "0.8rem",
            cursor: "pointer",
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
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user_id) setUserId(data.user_id);
      })
      .catch((err) => {
        console.error("유저 정보 불러오기 실패:", err);
      });
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects/user_id/${userId}`, {
      credentials: "include",
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
        credentials: "include",
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
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
        <div style={{ position: "relative" }}>
          <Title>작업 관리</Title>
          <MonthNav>
            <NavButton onClick={handlePrevMonth}>
              <FiChevronLeft />
            </NavButton>
            <MonthText
              onClick={handleYearMonthClick}
              style={{ cursor: "pointer" }}
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
              <FaRegFileAlt style={{ fontSize: "1.2rem", opacity: 0.7 }} />
              <FilterSelect
                value={selectedProjectId || ""}
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
          if (view === "month") {
            const day = date.getDate().toString().padStart(2, "0");
            const dayTodos = events.filter(
              (ev) => ev.type === "todo" && isSameDay(new Date(ev.start), date)
            );
            const dayMeetings = events.filter(
              (ev) =>
                ev.type === "meeting" && isSameDay(new Date(ev.start), date)
            );
            const dayOfWeek = date.getDay(); // 0: 일, 6: 토
            const isCurrentMonth = date.getMonth() === value.getMonth();
            let dayClass = "";
            if (isCurrentMonth) {
              if (dayOfWeek === 0) dayClass = "calendar-sunday";
              if (dayOfWeek === 6) dayClass = "calendar-saturday";
            }
            return (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupDate(date);
                }}
              >
                <span
                  className={dayClass}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 10,
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    zIndex: 2,
                  }}
                >
                  {day}
                </span>
                <div style={{ width: "100%", paddingTop: 35 }}>
                  {dayMeetings.map((m) => {
                    let timeStr = "";
                    if (m.start) {
                      const d =
                        typeof m.start === "string"
                          ? new Date(m.start)
                          : m.start;
                      if (!isNaN(d.getTime())) {
                        timeStr = d.toTimeString().slice(0, 5) + " ";
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
                          textDecoration: t.completed ? "line-through" : "none",
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
        formatDay={(_, date) => date.getDate().toString().padStart(2, "0")}
        locale="ko-KR"
        calendarType="gregory"
      />
      {popupDate && (
        <CalendarPop
          date={popupDate}
          todos={events.filter(
            (ev) =>
              ev.type === "todo" && isSameDay(new Date(ev.start), popupDate)
          )}
          meetings={events.filter(
            (ev) =>
              ev.type === "meeting" && isSameDay(new Date(ev.start), popupDate)
          )}
          onClose={handleClosePopup}
          onEdit={handleEditCompleted}
        />
      )}
    </CalendarWrapper>
  );
}
