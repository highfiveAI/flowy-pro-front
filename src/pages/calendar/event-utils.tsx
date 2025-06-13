let eventGuid = 0;
// let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  type: 'meeting' | 'todo';
  completed?: boolean; // todo용
};

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: '기능 정의 Kick-off',
    start: new Date(2025, 5, 2, 10, 0),
    end: new Date(2025, 5, 2, 11, 0),
    type: 'meeting',
  },
  {
    id: '2',
    title: '초기 화면 흐름 UX 회의',
    start: new Date(2025, 5, 5, 11, 0),
    end: new Date(2025, 5, 5, 12, 0),
    type: 'meeting',
  },
  {
    id: '3',
    title: 'UI 디자인 시안 만들기',
    start: new Date(2025, 5, 5, 0, 0),
    type: 'todo',
    completed: false,
  },
  {
    id: '4',
    title: 'API 명세서 작성',
    start: new Date(2025, 5, 5, 0, 0),
    type: 'todo',
    completed: true,
  },
  {
    id: '5',
    title: 'DB 설계 초안 작성',
    start: new Date(2025, 5, 6, 0, 0),
    type: 'todo',
    completed: false,
  },
  {
    id: '6',
    title: '회의록 정리',
    start: new Date(2025, 5, 7, 0, 0),
    type: 'todo',
    completed: false,
  },
  {
    id: '7',
    title: '프로토타입 피드백 정리',
    start: new Date(2025, 5, 8, 0, 0),
    type: 'todo',
    completed: true,
  },
  {
    id: '8',
    title: '테스트 케이스 작성',
    start: new Date(2025, 5, 9, 0, 0),
    type: 'todo',
    completed: false,
  },
];

export function createEventId() {
  return String(eventGuid++);
}
