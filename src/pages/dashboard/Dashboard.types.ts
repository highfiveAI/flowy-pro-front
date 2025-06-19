export type Feedback = {
  feedbacktype_id: string;
  meeting_id: string;
  feedback_id: string;
  feedback_detail: string | string[];
  feedback_created_date: string;
};

export type SummaryLog = {
  summary_log_id: string;
  updated_summary_contents: Record<string, any>; // 어떤 키든 올 수 있는 JSON
};
