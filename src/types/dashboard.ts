// 대시보드 데이터 타입 정의
export interface DashboardSummary {
  title: string;
  unit: string;
  target: number;
  average: number;
  labelTarget: string;
  labelAvg: string;
  color: string;
  colorAvg: string;
  yMax: number;
}

export interface ChartData {
  year: string;
  feedback_type: string;
  count: number;
  period: string;
}

export interface TableData {
  period: string;
  feedback_type: string;
  filtered_avg: string;  // 조회 평균 (필터링된 결과)
  pop: string;           // PoP (이전 기간 대비 현재 기간)
  total_avg: string;     // 전체 평균
  vs_total: string;      // 전체 대비 (조회 평균 vs 전체 평균)
}

export interface DashboardResponse {
  summary: DashboardSummary[];
  chartData: ChartData[];
  tableData: TableData[];
}

export interface FilterOptions {
  projects: Array<{ id: string; name: string }>;
  departments: string[];
  users: Array<{ id: string; name: string; login_id: string; department: string }>;
  selected_user_department?: string;
} 