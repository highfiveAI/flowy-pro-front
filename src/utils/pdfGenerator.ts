// @ts-ignore
import NanumHumanRegularBase64 from '../static/fonts/NanumHumanRegular.ttf.base64.js';
// @ts-ignore
import NanumHumanBoldBase64 from '../static/fonts/NanumHumanBold.ttf.base64.js';

/**
 * 회의 결과 PDF 생성 (window.pdfMake 직접 사용, vfs 오류 0%)
 * @param checked - 각 항목별 포함 여부
 * @param meetingInfo - 회의 기본 정보
 * @param summary - 회의 요약
 * @param tasks - 작업 목록
 * @param feedback - 피드백
 * @param recommendFiles - 추천 문서
 */
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
  // @ts-ignore
  const pdfMake = window.pdfMake;

  if (typeof pdfMake !== 'undefined') {
    if (!pdfMake.vfs) {
      pdfMake.vfs = {};
    }
    if (!pdfMake.fonts) {
      pdfMake.fonts = {};
    }

    pdfMake.vfs['NanumHumanRegular.ttf'] = NanumHumanRegularBase64;
    pdfMake.vfs['NanumHumanBold.ttf'] = NanumHumanBoldBase64;

    pdfMake.fonts['NanumHuman'] = {
      normal: 'NanumHumanRegular.ttf',
      bold: 'NanumHumanBold.ttf'
    };

    // 파일명 동적 생성
    const projectName = (meetingInfo.project || '').replace(/\s/g, '');
    const meetingTitle = (meetingInfo.title || '').replace(/\s/g, '');
    const meetingDate = (meetingInfo.date || '').split('T')[0];
    const itemMap: Record<string, string> = {
      info: '기본정보',
      basic: '기본정보',
      summary: '요약',
      tasks: '작업목록',
      feedback: '피드백',
      recommend: '추천문서',
      recommendFiles: '추천문서',
    };
    let included = Object.entries(checked)
      .filter(([key, value]) => value && itemMap[key])
      .map(([key]) => itemMap[key])
      .filter((v, i, arr) => arr.indexOf(v) === i);
    const allItems = ['기본정보', '요약', '작업목록', '피드백', '추천문서'];
    let includedStr = included.join('_');
    if (included.length === allItems.length && allItems.every(item => included.includes(item))) {
      includedStr = '전체';
    }
    const fileName = `${projectName}_${meetingTitle}_${meetingDate}_${includedStr}.pdf`;

    // PDF 본문 content 배열
    const content: any[] = [];

    // [회의 기본 정보]
    if (checked.info && meetingInfo) {
      const infoSection: any[] = [
        { text: '[ 회의 기본 정보 ]', style: 'sectionTitle' },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, lineColor: '#aaa' }] },
        { text: `프로젝트: ${meetingInfo.project || ''}`, style: 'body' },
        { text: `회의 제목: ${meetingInfo.title || ''}`, style: 'body' },
        { text: `일시: ${meetingInfo.date ? formatDateTime(meetingInfo.date) : ''}`, style: 'body' },
        { text: `참석자: ${(Array.isArray(meetingInfo.attendees) ? meetingInfo.attendees.map((a: any) => a.user_name || a.name || a.toString()).join(', ') : '')}`, style: 'body' }
      ];
      if (meetingInfo.agenda) {
        infoSection.push({ text: `안건: ${meetingInfo.agenda}`, style: 'body' });
      }
      infoSection.push({ text: '', margin: [0, 0, 0, 10] as [number, number, number, number] });
      content.push(...infoSection);
    }

    // [회의 요약]
    if (checked.summary && summary?.updated_summary_contents) {
      const summaryTableBody: any[] = [
        [
          { text: '항목', style: 'tableHeader' },
          { text: '내용', style: 'tableHeader' }
        ]
      ];
      Object.entries(summary.updated_summary_contents).forEach(([section, arr]) => {
        summaryTableBody.push([
          section,
          Array.isArray(arr) ? arr.join('\n') : arr
        ]);
      });
      content.push(
        { text: '[ 회의 요약 ]', style: 'sectionTitle' },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, lineColor: '#aaa' }] },
        {
          table: {
            headerRows: 1,
            widths: ['25%', '*'],
            body: summaryTableBody
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#e6e6fa' : null
          },
          margin: [0, 6, 0, 10] as [number, number, number, number]
        }
      );
    }

    // [작업 목록]
    if (checked.tasks && tasks && typeof tasks === 'object') {
      const taskTableBody: any[] = [
        [
          { text: '작업 내용', style: 'tableHeader' },
          { text: '담당자', style: 'tableHeader' },
          { text: '일정', style: 'tableHeader' },
          { text: '비고', style: 'tableHeader' }
        ]
      ];
      Object.entries(tasks).forEach(([status, arr]) => {
        if (!Array.isArray(arr) || arr.length === 0) return;
        arr.forEach((task: any) => {
          taskTableBody.push([
            task.action || '',
            task.assignee || '',
            task.schedule || '',
            status
          ]);
        });
      });
      content.push(
        { text: '[ 작업 목록 ]', style: 'sectionTitle' },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, lineColor: '#aaa' }] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '15%', '20%', '15%'],
            body: taskTableBody
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#e6e6fa' : null
          },
          margin: [0, 6, 0, 10] as [number, number, number, number]
        }
      );
    }

    // [회의 피드백]
    if (checked.feedback && Array.isArray(feedback)) {
      content.push(
        { text: '[ 회의 피드백 ]', style: 'sectionTitle' },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, lineColor: '#aaa' }] }
      );
      let feedbackCount = 1;
      feedback.forEach((fbObj: any) => {
        const details = fbObj.feedback_detail;
        if (Array.isArray(details)) {
          details.forEach((fbDetail: string) => {
            content.push({ text: `${feedbackCount}. ${fbDetail}`, style: 'body' });
            feedbackCount++;
          });
        } else if (typeof details === 'string') {
          content.push({ text: `${feedbackCount}. ${details}`, style: 'body' });
          feedbackCount++;
        }
      });
      if (feedbackCount === 1) {
        content.push({ text: '피드백이 없습니다.', style: 'body' });
      }
      content.push({ text: '', margin: [0, 0, 0, 10] as [number, number, number, number] });
    }

    // [추천 문서]
    if ((checked.recommend || checked.recommendFiles)) {
      content.push(
        { text: '[ 추천 문서 ]', style: 'sectionTitle' },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, lineColor: '#aaa' }] }
      );
      if (!Array.isArray(recommendFiles) || recommendFiles.length === 0) {
        content.push({ text: '추천된 문서가 없습니다.', style: 'body' });
      } else {
        recommendFiles.forEach((file: any, idx: number) => {
          const fileName = typeof file === 'string' ? file : file.file_name || file.toString();
          content.push({ text: `${idx + 1}. ${fileName}`, style: 'body' });
        });
      }
      content.push({ text: '', margin: [0, 0, 0, 10] as [number, number, number, number] });
    }

    // pdfMake 문서 정의
    const docDefinition = {
      content,
      styles: {
        sectionTitle: { fontSize: 16, bold: true, color: '#000080', margin: [0, 10, 0, 6] as [number, number, number, number] },
        tableHeader: { fillColor: '#e6e6fa', bold: true, color: '#000080' },
        body: { fontSize: 12, margin: [0, 2, 0, 2] as [number, number, number, number] }
      },
      defaultStyle: { font: 'NanumHuman' }
    };

    pdfMake.createPdf(docDefinition).download(fileName);
  } else {
    alert('PDF 엔진이 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.');
  }
}

// 날짜 포맷 함수
function formatDateTime(dateString: string) {
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