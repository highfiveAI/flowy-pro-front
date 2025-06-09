import React from 'react'
import type {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core'
// import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils.tsx'

interface DemoAppState {
  weekendsVisible: boolean
  currentEvents: EventApi[]
}

export default class DemoApp extends React.Component<{}, DemoAppState> {

  state: DemoAppState = {
    weekendsVisible: true,
    currentEvents: []
  }

  render() {
    return (
        <div className='demo-app'>
        <div className='demo-app-main'>
            <h1>캘린더</h1>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // 사용할 플러그인
            headerToolbar={{ // 헤더에 넣을 버튼들 (왼쪽, 가운데, 오른쪽 배치 가능)
              left: 'prev,next today', // 이전달, 다음달, 오늘달
              center: 'title', // 오늘 날짜
              right: 'dayGridMonth,timeGridWeek,timeGridDay' // 월별,주별,일별 뷰
            }}
            initialView='dayGridMonth' // 첫 화면 뷰어 설정
            editable={true} // 수정 가능 여부
            selectable={true} // 선택 가능 여부
            selectMirror={true} // TimeGrid 뷰에서 자리 표시자 여부
            dayMaxEvents={true} // 한 셀에 최대 이벤트(more) 표시 여부
            weekends={this.state.weekendsVisible} // 주말 표시 여부
            initialEvents={INITIAL_EVENTS} // 초기값
            select={this.handleDateSelect} // 선택 시 기능 추가
            eventContent={renderEventContent} // 이벤트 컨텐츠 랜더링 설정
            eventClick={this.handleEventClick} // 이벤트 클릭 기능 설정
            eventsSet={this.handleEvents} // 이벤트가 초기화/추가/변경/제거된 후에 호출되는 기능
            // 한글 변환 및 날짜 표시 설정
            locale="kr"
            dayCellContent={(info) => {
                return info.date.getDate();
              }}
            /* 데이터 베이스 업뎃 함수
            eventAdd={function(){}} // 이벤트 추가
            eventChange={function(){}} // 이벤트 수정
            eventRemove={function(){}} // 이벤트 삭제
            */
          />
        </div>
      </div>
    )
  }

  handleDateSelect = (selectInfo: DateSelectArg) => {
    let title = prompt('새 일정의 제목을 입력해주세요')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // 날짜 선택 해제

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`'${clickInfo.event.title}' 일정을 삭제하시겠습니까?`)) {
      clickInfo.event.remove()
    }
  }

  handleEvents = (events: EventApi[]) => {
    this.setState({
      currentEvents: events
    })
  }

}

function renderEventContent(eventContent: EventContentArg) {
  return (
    <>
      <b>{eventContent.timeText}</b>&nbsp;
      <i>{eventContent.event.title}</i>
    </>
  )
}