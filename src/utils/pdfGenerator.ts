import jsPDF from 'jspdf';
// @ts-ignore
import fontData from '../static/fonts/NanumHumanRegular.ttf.base64.js';

const PAGE_HEIGHT = 297; // A4 mm 단위
const BOTTOM_MARGIN = 20;

function checkAddPage(doc: any, y: number) {
  if (y > PAGE_HEIGHT - BOTTOM_MARGIN) {
    doc.addPage();
    return 20; // 새 페이지 y 시작 위치
  }
  return y;
}

// PDF 생성 함수
export function generateMeetingPDF({
  checked,
  meetingInfo,
  summary,
  tasks,
  feedback,
  recommendFiles,
}: {
  checked: { [key: string]: boolean };
  meetingInfo: any;
  summary: any;
  tasks: any;
  feedback: any;
  recommendFiles: any;
}) {
  const doc = new jsPDF();

  // 한글 폰트 등록
  doc.addFileToVFS('NanumHumanRegular.ttf', fontData);
  doc.addFont('NanumHumanRegular.ttf', 'NanumHuman', 'normal');
  doc.setFont('NanumHuman');

  let y = 15;

  // 데이터 콘솔 출력 (디버깅용)
  // console.log('[PDF] checked:', checked);
  // console.log('[PDF] meetingInfo:', meetingInfo);
  // console.log('[PDF] summary:', summary);
  // console.log('[PDF] tasks:', tasks);
  console.log('[PDF] feedback:', feedback);
  console.log('[PDF] recommendFiles:', recommendFiles);

  // 회의 기본 정보
  if (checked.info && meetingInfo) {
    doc.setFontSize(16);
    doc.text('회의 기본 정보', 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`프로젝트: ${meetingInfo.project || ''}`, 10, y);
    y += 7;
    y = checkAddPage(doc, y);
    doc.text(`회의 제목: ${meetingInfo.title || ''}`, 10, y);
    y += 7;
    y = checkAddPage(doc, y);
    doc.text(`일시: ${meetingInfo.date ? formatDateTime(meetingInfo.date) : ''}`, 10, y);
    y += 7;
    y = checkAddPage(doc, y);
    if (meetingInfo.location) {
      doc.text(`장소: ${meetingInfo.location}`, 10, y);
      y += 7;
      y = checkAddPage(doc, y);
    }
    if (Array.isArray(meetingInfo.attendees)) {
      const attendeeNames = meetingInfo.attendees.map((a: any) => a.user_name || a.name || a.toString()).join(', ');
      doc.text(`참석자: ${attendeeNames}`, 10, y);
      y += 7;
      y = checkAddPage(doc, y);
    }
    if (meetingInfo.agenda) {
      doc.text(`안건: ${meetingInfo.agenda}`, 10, y);
      y += 7;
      y = checkAddPage(doc, y);
    }
    y += 8;
    y = checkAddPage(doc, y);
  }

  // 회의 요약
  if (checked.summary && summary?.updated_summary_contents) {
    doc.setFontSize(16);
    doc.text('회의 요약', 10, y);
    y += 8;
    y = checkAddPage(doc, y);
    doc.setFontSize(12);
    const contents = summary.updated_summary_contents;
    Object.entries(contents).forEach(([section, arr]) => {
      doc.text(`- ${section}`, 10, y);
      y += 7;
      y = checkAddPage(doc, y);
      if (Array.isArray(arr)) {
        arr.forEach((item: string) => {
          doc.text(`  • ${item}`, 15, y);
          y += 7;
          y = checkAddPage(doc, y);
        });
      }
    });
    y += 10;
    y = checkAddPage(doc, y);
  }

  // 작업 목록
  if (checked.tasks && tasks && typeof tasks === 'object') {
    doc.setFontSize(16);
    doc.text('작업 목록', 10, y);
    y += 8;
    y = checkAddPage(doc, y);
    doc.setFontSize(12);
    Object.entries(tasks).forEach(([status, arr]) => {
      doc.text(`- ${status}`, 10, y);
      y += 7;
      y = checkAddPage(doc, y);
      if (Array.isArray(arr)) {
        arr.forEach((task: any, idx: number) => {
          // 각 작업의 주요 필드(action, context, assignee, schedule)를 보기 좋게 출력
          const action = task.action || '';
          const context = task.context || '';
          const assignee = task.assignee || '';
          const schedule = task.schedule || '';
          doc.text(`  ${idx + 1}. [작업] ${action}`, 15, y);
          y += 6;
          y = checkAddPage(doc, y);
          if (context) {
            doc.text(`      [내용] ${context}`, 15, y);
            y += 6;
            y = checkAddPage(doc, y);
          }
          if (assignee) {
            doc.text(`      [담당자] ${assignee}`, 15, y);
            y += 6;
            y = checkAddPage(doc, y);
          }
          if (schedule) {
            doc.text(`      [일정] ${schedule}`, 15, y);
            y += 6;
            y = checkAddPage(doc, y);
          }
          y += 2;
          y = checkAddPage(doc, y);
        });
      }
    });
    y += 5;
    y = checkAddPage(doc, y);
  }

  // 회의 피드백
  if (checked.feedback && feedback && Array.isArray(feedback.feedback_detail)) {
    doc.setFontSize(16);
    doc.text('회의 피드백', 10, y);
    y += 8;
    y = checkAddPage(doc, y);
    doc.setFontSize(12);
    if (feedback.feedback_detail.length === 0) {
      doc.text('피드백이 없습니다.', 10, y);
      y += 7;
      y = checkAddPage(doc, y);
    } else {
      feedback.feedback_detail.forEach((fb: string, idx: number) => {
        doc.text(`${idx + 1}. ${fb}`, 10, y);
        y += 7;
        y = checkAddPage(doc, y);
      });
    }
    y += 5;
    y = checkAddPage(doc, y);
  }

  // 추천 문서
  if ((checked.recommend || checked.recommendFiles)) {
    doc.setFontSize(16);
    doc.text('추천 문서', 10, y);
    y += 8;
    y = checkAddPage(doc, y);
    doc.setFontSize(12);
    if (!Array.isArray(recommendFiles) || recommendFiles.length === 0) {
      doc.text('추천된 문서가 없습니다.', 10, y);
      y += 7;
      y = checkAddPage(doc, y);
    } else {
      recommendFiles.forEach((file: any, idx: number) => {
        const fileName = typeof file === 'string' ? file : file.file_name || file.toString();
        doc.text(`${idx + 1}. ${fileName}`, 10, y);
        y += 7;
        y = checkAddPage(doc, y);
      });
    }
    y += 5;
    y = checkAddPage(doc, y);
  }

  doc.save('회의록.pdf');
}

// 파일 상단 또는 함수 내 적절한 위치에 formatDateTime 함수 추가
function formatDateTime(dateString: string) {
  // '2025-06-03T14:00:00' -> '2025-06-03 14:00'
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
} 