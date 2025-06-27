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
  발생빈도: number;
  처리시간: number;
  period: string;
}

export interface TableData {
  period: string;
  target: string;
  value: string;
  pop: string;
  prevValue: string;
  growth: string;
}

export interface DashboardResponse {
  summary: DashboardSummary[];
  chartData: ChartData[];
  tableData: TableData[];
}

export interface FilterOptions {
  projects: Array<{ id: string; name: string }>;
  departments: Array<{ name: string }>;
  users: Array<{ id: string; name: string; login_id: string }>;
} 