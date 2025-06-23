// import styled from 'styled-components';
// import type { Feedback, SummaryLog } from '../Dashboard.types';

// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   background: rgba(0, 0, 0, 0.2);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 2100;
// `;
// const ModalBox = styled.div`
//   background: #fff;
//   border-radius: 50px;
//   border: 1px solid #351745;
//   box-shadow: 4px 0px 4px 0px rgba(75, 13, 110, 0.21);
//   padding: 48px 40px 40px 40px;
//   min-width: 420px;
//   max-width: 95vw;
//   max-height: 90vh;
//   position: relative;
//   display: flex;
//   flex-direction: column;
// `;
// const Title = styled.h2`
//   font-size: 1.5rem;
//   color: #4b2067;
//   font-weight: 700;
//   margin-bottom: 24px;
//   display: flex;
//   align-items: center;
//   gap: 16px;
// `;
// const MailIcon = styled.img`
//   width: 32px;
//   height: 32px;
// `;
// const SectionLabel = styled.div`
//   font-size: 1.08rem;
//   color: #4b2067;
//   font-weight: 600;
//   margin-bottom: 10px;
//   margin-top: 32px;
// `;
// const InfoBox = styled.div`
//   background: #f8f9fa;
//   border-radius: 16px;
//   padding: 24px 20px;
//   min-height: 60px;
//   margin-bottom: 24px;
//   color: #333;
//   font-size: 1rem;
// `;
// const CloseBtn = styled.button`
//   position: absolute;
//   top: 24px;
//   right: 28px;
//   background: none;
//   border: none;
//   font-size: 22px;
//   color: #4b2067;
//   cursor: pointer;
// `;

// const SendButton = styled.button`
//   width: 100%;
//   background: #00b6b6;
//   color: #fff;
//   border: none;
//   border-radius: 32px;
//   padding: 18px 0;
//   font-size: 1.25rem;
//   font-weight: 500;
//   margin-top: 20px;
//   cursor: pointer;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//   &:hover {
//     background: #009999;
//   }
//   &:disabled {
//     background: #cccccc;
//     cursor: not-allowed;
//   }
// `;

// const ContentWrapper = styled.div`
//   flex: 1;
//   overflow-y: auto;
//   padding-right: 8px;
//   margin-right: -8px;

//   /* 스크롤바 스타일링 */
//   &::-webkit-scrollbar {
//     width: 8px;
//   }
//   &::-webkit-scrollbar-track {
//     background: #f1f1f1;
//     border-radius: 4px;
//   }
//   &::-webkit-scrollbar-thumb {
//     background: #00b6b6;
//     border-radius: 4px;
//   }
//   &::-webkit-scrollbar-thumb:hover {
//     background: #009999;
//   }
// `;

// const ButtonWrapper = styled.div`
//   margin-top: 24px;
//   padding-top: 16px;
//   border-top: 1px solid #eee;
// `;

// const ContentSection = styled.div`
//   margin-bottom: 32px;
//   &:last-child {
//     margin-bottom: 0;
//   }
// `;

// const ContentTitle = styled.div`
//   font-size: 1.1rem;
//   color: #4b2067;
//   font-weight: 600;
//   margin-bottom: 12px;
//   display: flex;
//   align-items: center;
//   gap: 8px;

//   &::before {
//     content: '';
//     display: inline-block;
//     width: 4px;
//     height: 16px;
//     background: #00b6b6;
//     border-radius: 2px;
//   }
// `;

// const TaskItem = styled.div`
//   margin-bottom: 4px;
//   color: #333;
//   line-height: 1.5;
//   display: flex;
//   align-items: flex-start;
//   gap: 8px;

//   &::before {
//     content: '•';
//     color: #333;
//     display: inline-block;
//     width: 1em;
//     margin-left: 1em;
//   }
// `;

// const TaskDate = styled.span`
//   color: #666;
//   font-size: 0.9em;
//   white-space: nowrap;
// `;

// // const FeedbackItem = styled.div`
// //   margin-bottom: 4px;
// //   color: #333;
// //   line-height: 1.5;
// //   display: flex;
// //   align-items: flex-start;
// //   gap: 8px;

// //   &::before {
// //     content: '•';
// //     color: #333;
// //     display: inline-block;
// //     width: 1em;
// //     margin-left: 1em;
// //   }
// // `;

// // const SummaryItem = styled.div`
// //   margin-bottom: 4px;
// //   color: #333;
// //   line-height: 1.5;
// //   display: flex;
// //   align-items: flex-start;
// //   gap: 8px;

// //   &::before {
// //     content: '•';
// //     color: #333;
// //     display: inline-block;
// //     width: 1em;
// //     margin-left: 1em;
// //   }
// // `;

// const SectionContent = styled.div`
//   margin-bottom: 12px;
//   padding-left: 1em;
// `;

// const SectionTitle = styled.div`
//   font-weight: 600;
//   color: #333;
//   margin-bottom: 8px;
// `;

// const TaskInfoBox = styled.div`
//   background: #f8f9fa;
//   border-radius: 16px;
//   padding: 12px 0;
//   color: #333;
//   font-size: 1rem;
// `;

// interface MailPreviewProps {
//   onClose: () => void;
//   onSend: () => void;
//   summary: SummaryLog | null;
//   tasks: any;
//   feedback: Feedback[];
//   mailItems: { summary: boolean; tasks: boolean; feedback: boolean };
//   receivers: any;
//   meetingInfo: {
//     project: string;
//     title: string;
//     date: string;
//     attendees: { user_id: string; user_name: string }[];
//     agenda: string[];
//   };
// }

// const MailPreviewDashboard = ({
//   onClose,
//   onSend,
//   summary,
//   tasks,
//   feedback,
//   mailItems,
//   receivers,
//   meetingInfo,
// }: MailPreviewProps) => {
//   const mailPreview: {}[] = [];
//   if (mailItems.summary && summary) mailPreview.push(summary);
//   if (mailItems.tasks && tasks) {
//     Object.entries(tasks).forEach(([name, items]) => {
//       const taskArr = items as any[];
//       if (name === 'unassigned') {
//         if (taskArr.length > 0)
//           mailPreview.push({
//             section: '[ 미할당 작업 목록 ]',
//             items: taskArr.map((t: any) => t.description),
//           });
//       } else {
//         if (taskArr.length > 0)
//           mailPreview.push({
//             section: `[ ${name} ]`,
//             items: taskArr.map((t: any) => t.description),
//           });
//       }
//     });
//   }
//   if (mailItems.feedback && feedback) mailPreview.push(...feedback);

//   // 메일 내용을 섹션별로 분리
//   const summaryContent = mailItems.summary ? summary : [];
//   const tasksContent = mailItems.tasks
//     ? Object.entries(tasks)
//         .map(([name, items]) => {
//           const taskArr = items as any[];
//           if (name === 'unassigned') {
//             return taskArr.length > 0
//               ? {
//                   section: '[ 미할당 작업 목록 ]',
//                   items: taskArr.map(
//                     (t: any) => `${t.description} (${t.date})`
//                   ),
//                 }
//               : null;
//           }
//           return taskArr.length > 0
//             ? {
//                 section: `[ ${name} ]`,
//                 items: taskArr.map((t: any) => `${t.description} (${t.date})`),
//               }
//             : null;
//         })
//         .filter(
//           (item): item is { section: string; items: string[] } => item !== null
//         )
//     : [];
//   const feedbackContent = mailItems.feedback ? feedback : [];

//   const hasContent =
//     summaryContent || tasksContent.length > 0 || feedbackContent.length > 0;

//   const canSendMail = () => {
//     if (mailPreview.length === 0) return false;
//     if (receivers.allProject || receivers.allAttendees) return true;
//     if (receivers.custom && receivers.selectedCustom.length > 0) return true;
//     return false;
//   };

//   return (
//     <ModalOverlay>
//       <ModalBox>
//         <Title>
//           <MailIcon src="/images/sendmail.svg" alt="메일" />
//           메일 미리보기
//         </Title>
//         <ContentWrapper>
//           <SectionLabel>회의 기본 정보</SectionLabel>
//           <InfoBox>
//             <div>
//               <b>상위 프로젝트:</b> {meetingInfo.project}
//             </div>
//             <div>
//               <b>회의 제목:</b> {meetingInfo.title}
//             </div>
//             <div>
//               <b>회의 일시:</b> {meetingInfo.date}
//             </div>
//             <div>
//               <b>참석자:</b> {meetingInfo.attendees.join(', ')}
//             </div>
//             <div>
//               <b>회의 안건:</b>
//               <ul style={{ margin: 0, paddingLeft: 18 }}>
//                 {meetingInfo.agenda.map((item, i) => (
//                   <li key={i}>{item}</li>
//                 ))}
//               </ul>
//             </div>
//           </InfoBox>
//           <SectionLabel>메일 내용</SectionLabel>
//           <InfoBox>
//             {!hasContent ? (
//               <div style={{ color: '#aaa' }}>선택된 항목이 없습니다.</div>
//             ) : (
//               <>
//                 {summaryContent && (
//                   <ContentSection>
//                     <ContentTitle>회의 요약</ContentTitle>
//                     {/* {summaryContent.map((sec, i) => (
//                       <SectionContent key={i}>
//                         <SectionTitle>{sec.section}</SectionTitle>
//                         <div>
//                           {sec.items.map((item, j) => (
//                             <SummaryItem key={j}>{item}</SummaryItem>
//                           ))}
//                         </div>
//                       </SectionContent>
//                     ))} */}
//                   </ContentSection>
//                 )}
//                 {tasksContent.length > 0 && (
//                   <ContentSection>
//                     <ContentTitle>작업 목록</ContentTitle>
//                     <TaskInfoBox>
//                       {tasksContent.map((section, idx) => (
//                         <SectionContent key={idx}>
//                           <SectionTitle>{section.section}</SectionTitle>
//                           {section.items.map((item, itemIdx) => {
//                             const [description, date] = item.split(' (');
//                             return (
//                               <TaskItem key={itemIdx}>
//                                 <span>{description}</span>
//                                 <TaskDate>({date}</TaskDate>
//                               </TaskItem>
//                             );
//                           })}
//                         </SectionContent>
//                       ))}
//                     </TaskInfoBox>
//                   </ContentSection>
//                 )}
//                 {feedbackContent.length > 0 && (
//                   <ContentSection>
//                     <ContentTitle>회의 피드백</ContentTitle>
//                     {/* {feedbackContent.map((sec, i) => (
//                       <SectionContent key={i}>
//                         <SectionTitle>{sec.section}</SectionTitle>
//                         <div>
//                           {sec.items.map((item, j) => (
//                             <FeedbackItem key={j}>{item}</FeedbackItem>
//                           ))}
//                         </div>
//                       </SectionContent>
//                     ))} */}
//                   </ContentSection>
//                 )}
//               </>
//             )}
//           </InfoBox>
//           <SectionLabel>수신 대상자</SectionLabel>
//           <InfoBox>
//             {receivers.allProject && <div>프로젝트 참여자 전체 수신</div>}
//             {receivers.allAttendees && <div>회의 참석자 전체 수신</div>}
//             {receivers.custom && receivers.selectedCustom.length > 0 && (
//               <div>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                   {receivers.selectedCustom.map(
//                     (name: string, index: number) => (
//                       <span
//                         key={index}
//                         style={{
//                           background: '#e6f7f7',
//                           padding: '4px 8px',
//                           borderRadius: 4,
//                           color: '#00b6b6',
//                           fontSize: 13,
//                         }}
//                       >
//                         {name}
//                       </span>
//                     )
//                   )}
//                 </div>
//               </div>
//             )}
//             {!receivers.allProject &&
//               !receivers.allAttendees &&
//               !(receivers.custom && receivers.selectedCustom.length > 0) && (
//                 <div style={{ color: '#aaa' }}>선택된 수신자가 없습니다.</div>
//               )}
//           </InfoBox>
//         </ContentWrapper>
//         <ButtonWrapper>
//           <SendButton onClick={onSend} disabled={!canSendMail()}>
//             메일 발송하기
//           </SendButton>
//         </ButtonWrapper>
//         <CloseBtn onClick={onClose}>&times;</CloseBtn>
//       </ModalBox>
//     </ModalOverlay>
//   );
// };

// export default MailPreviewDashboard;
