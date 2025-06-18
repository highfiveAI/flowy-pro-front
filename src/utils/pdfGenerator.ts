import jsPDF from 'jspdf';
// @ts-ignore
import fontData from '../static/fonts/NanumHumanRegular.ttf.base64.js';

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

  // 회의 기본 정보
  if (checked.info) {
    doc.setFontSize(16);
    doc.text('회의 기본 정보', 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`프로젝트: ${meetingInfo?.project?.project_name || ''}`, 10, y);
    y += 7;
    doc.text(`회의 제목: ${meetingInfo?.meeting_title || ''}`, 10, y);
    y += 7;
    doc.text(`일시: ${meetingInfo?.meeting_date ? new Date(meetingInfo.meeting_date).toLocaleString() : ''}`, 10, y);
    y += 7;
    doc.text(`장소: ${meetingInfo?.meeting_location || ''}`, 10, y);
    y += 10;
  }

  // 회의 요약
  if (checked.summary && summary?.summary_log?.updated_summary_contents) {
    doc.setFontSize(16);
    doc.text('회의 요약', 10, y);
    y += 8;
    doc.setFontSize(12);
    const summaryText = summary.summary_log.updated_summary_contents.summary || '';
    doc.text(summaryText.toString(), 10, y);
    y += 15;
  }

  // 작업 목록
  if (checked.tasks) {
    doc.setFontSize(16);
    doc.text('작업 목록', 10, y);
    y += 8;
    doc.setFontSize(12);
    if (Array.isArray(tasks)) {
      tasks.forEach((task: any, idx: number) => {
        const taskText = typeof task === 'string' ? task : task.task_name || task.toString();
        doc.text(`${idx + 1}. ${taskText}`, 10, y);
        y += 7;
      });
    }
    y += 5;
  }

  // 회의 피드백
  if (checked.feedback && feedback?.feedback_detail) {
    doc.setFontSize(16);
    doc.text('회의 피드백', 10, y);
    y += 8;
    doc.setFontSize(12);
    feedback.feedback_detail.forEach((detail: any, idx: number) => {
      const feedbackText = detail.feedback_content || '';
      doc.text(`${idx + 1}. ${feedbackText}`, 10, y);
      y += 7;
    });
    y += 15;
  }

  // 추천 문서
  if ((checked.recommend || checked.recommendFiles) && Array.isArray(recommendFiles)) {
    doc.setFontSize(16);
    doc.text('추천 문서', 10, y);
    y += 8;
    doc.setFontSize(12);
    recommendFiles.forEach((file: any, idx: number) => {
      const fileName = typeof file === 'string' ? file : file.file_name || file.toString();
      doc.text(`${idx + 1}. ${fileName}`, 10, y);
      y += 7;
    });
    y += 5;
  }

  doc.save('회의록.pdf');
} 