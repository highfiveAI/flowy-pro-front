import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const DashboardContainer = styled.div`
  padding: 40px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Rethink Sans', sans-serif;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #351745;
  margin-bottom: 30px;
  font-family: 'Rethink Sans', sans-serif;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 20px;
  font-family: 'Rethink Sans', sans-serif;
`;

const Tab = styled.button<{ $isActive?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.$isActive ? '#351745' : '#f5f5f5'};
  color: ${props => props.$isActive ? '#fff' : '#666'};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Rethink Sans', sans-serif;

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }

  &:hover {
    background: ${props => props.$isActive ? '#351745' : '#e0e0e0'};
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-family: 'Rethink Sans', sans-serif;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 16px;
  font-family: 'Rethink Sans', sans-serif;
`;

const FilterSelect = styled.div`
  position: relative;
  min-width: 200px;
  font-family: 'Rethink Sans', sans-serif;
`;

const SelectLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-family: 'Rethink Sans', sans-serif;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
  font-family: 'Rethink Sans', sans-serif;

  &:focus {
    outline: none;
    border-color: #351745;
  }
`;

const ApplyButton = styled.button`
  padding: 8px 24px;
  background: #351745;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'Rethink Sans', sans-serif;

  &:hover {
    background: #4a1168;
  }
`;

// Summary Section
const SummarySection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px 24px 24px 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-family: 'Rethink Sans', sans-serif;
`;

const SummaryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 0;
  color: #351745;
  text-align: left;
  font-family: 'Rethink Sans', sans-serif;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  font-family: 'Rethink Sans', sans-serif;
`;

const SummaryCard = styled.div`
  text-align: center;
  font-family: 'Rethink Sans', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SummaryCardTitle = styled.h3`
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 20px;
  display: inline-block;
  font-family: 'Rethink Sans', sans-serif;
`;

const ComparisonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  font-family: 'Rethink Sans', sans-serif;
  text-align: center;
  width: auto;
`;

const ComparisonItem = styled.div`
  text-align: center;
  font-family: 'Rethink Sans', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ComparisonValue = styled.div<{ $isPrimary?: boolean }>`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.$isPrimary ? '#351745' : '#666'};
  margin-bottom: 8px;
  font-family: 'Rethink Sans', sans-serif;
`;

const ComparisonLabel = styled.div`
  font-size: 14px;
  color: #666;
  font-family: 'Rethink Sans', sans-serif;
`;

// Feedback Section
const FeedbackSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-family: 'Rethink Sans', sans-serif;
`;

const FeedbackTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 0;
  color: #351745;
  text-align: left;
  font-family: 'Rethink Sans', sans-serif;
`;

const FeedbackSubTitle = styled.div`
  display: inline-block;
  background: #f5f3f8;
  color: #351745;
  font-size: 15px;
  font-weight: 700;
  padding: 8px 32px;
  border-radius: 32px;
  text-align: center;
  margin-bottom: 2px;
  font-family: 'Rethink Sans', sans-serif;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 24px;
  font-family: 'Rethink Sans', sans-serif;
`;

// 테이블 스타일링
const TableContainer = styled.div`
  margin-top: 24px;
  overflow-x: auto;
  font-family: 'Rethink Sans', sans-serif;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-family: 'Rethink Sans', sans-serif;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  background-color: #f8f6fa;
  color: #351745;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  font-family: 'Rethink Sans', sans-serif;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  font-family: 'Rethink Sans', sans-serif;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f6fa;
  }
  font-family: 'Rethink Sans', sans-serif;
`;

type PeriodType = 'year' | 'quarter' | 'month' | 'week' | 'day';

interface ChartData {
  year: string;
  발생빈도: number;
  처리시간: number;
  period: string;  // 기간 정보 추가
}

// 테이블 데이터 타입
interface TableData {
  period: string;
  target: string;
  value: string;
  pop: string;
  prevValue: string;
  growth: string;
}

// 날짜 선택 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: 'Rethink Sans', sans-serif;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Rethink Sans', sans-serif;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #351745;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Rethink Sans', sans-serif;
`;

const DateRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  font-family: 'Rethink Sans', sans-serif;
`;

const DateInputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Rethink Sans', sans-serif;
`;

const DateLabel = styled.label`
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
  font-family: 'Rethink Sans', sans-serif;
`;

const DateInput = styled.input`
  width: 66%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  font-family: 'Rethink Sans', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #351745;
    box-shadow: 0 0 0 2px rgba(53, 23, 69, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  font-family: 'Rethink Sans', sans-serif;
`;

const ModalButton = styled.button<{ $isPrimary?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Rethink Sans', sans-serif;
  
  ${props => props.$isPrimary ? `
    background: #351745;
    color: white;
    
    &:hover {
      background: #4a1168;
    }
  ` : `
    background: #f5f5f5;
    color: #666;
    
    &:hover {
      background: #e0e0e0;
    }
  `}
`;

const SelectedDateRange = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  text-align: center;
  font-family: 'Rethink Sans', sans-serif;
`;

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // 차트 더미 데이터 - 컴포넌트 외부로 이동하거나 useMemo로 최적화
  const chartData: ChartData[] = useMemo(() => [
    // 연별 데이터
    { year: '2020', 발생빈도: 30, 처리시간: 40, period: 'year' },
    { year: '2021', 발생빈도: 45, 처리시간: 55, period: 'year' },
    { year: '2022', 발생빈도: 35, 처리시간: 45, period: 'year' },
    { year: '2023', 발생빈도: 50, 처리시간: 60, period: 'year' },
    { year: '2024', 발생빈도: 40, 처리시간: 50, period: 'year' },
    // 월별 데이터
    { year: '2024-01', 발생빈도: 15, 처리시간: 20, period: 'month' },
    { year: '2024-02', 발생빈도: 20, 처리시간: 25, period: 'month' },
    { year: '2024-03', 발생빈도: 25, 처리시간: 30, period: 'month' },
    // 주별 데이터
    { year: '2024-W1', 발생빈도: 5, 처리시간: 8, period: 'week' },
    { year: '2024-W2', 발생빈도: 7, 처리시간: 10, period: 'week' },
    // 일별 데이터
    { year: '2024-03-01', 발생빈도: 2, 처리시간: 3, period: 'day' },
    { year: '2024-03-02', 발생빈도: 3, 처리시간: 4, period: 'day' },
    // 분기별 데이터
    { year: '2024-Q1', 발생빈도: 30, 처리시간: 35, period: 'quarter' },
    { year: '2024-Q2', 발생빈도: 25, 처리시간: 30, period: 'quarter' },
  ], []);

  // 선택된 기간에 따라 데이터 필터링
  const filteredChartData = useMemo(() => {
    return chartData.filter(data => data.period === selectedPeriod);
  }, [selectedPeriod, chartData]);

  const handlePeriodChange = useCallback((period: PeriodType) => {
    setSelectedPeriod(period);
  }, []);

  // 기간별 레이블 매핑
  const periodLabels: Record<PeriodType, string> = useMemo(() => ({
    year: 'Year',
    quarter: 'Quarter',
    month: 'Month',
    week: 'Week',
    day: 'Day'
  }), []);

  // 기간 타입 배열을 안전하게 생성
  const periodTypes: PeriodType[] = useMemo(() => 
    ['year', 'quarter', 'month', 'week', 'day'], []
  );

  // 테이블 더미 데이터
  const tableData: TableData[] = useMemo(() => [
    {
      period: '2024',
      target: '불필요대화 30% 이상',
      value: '50.7건',
      pop: '-4.5%',
      prevValue: '51.7건',
      growth: '-1.9%',
    },
    {
      period: '2024',
      target: '화제 전환 미숙의',
      value: '41.2건',
      pop: '-24.5%',
      prevValue: '41.7건',
      growth: '-1.2%',
    },
  ], []);

  // 테이블 컬럼 설정
  const columnHelper = useMemo(() => createColumnHelper<TableData>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor('period', {
        header: 'Period',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('target', {
        header: '피드백 항목',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('value', {
        header: '조회 결과',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('pop', {
        header: 'PoP',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('prevValue', {
        header: '전회 결과',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('growth', {
        header: '성장률',
        cell: info => info.getValue(),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 차트 컴포넌트 메모이제이션
  const chartComponent = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={filteredChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="발생빈도"
          stroke="#351745"
          strokeWidth={2}
          dot={{ fill: '#351745' }}
        />
        <Line
          type="monotone"
          dataKey="처리시간"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ fill: '#8884d8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  ), [filteredChartData]);

  // 모달 열기
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // 모달 닫기
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // 날짜 적용
  const handleApplyDateRange = useCallback(() => {
    // 여기에 날짜 범위 적용 로직 추가
    console.log('적용된 날짜 범위:', { startDate, endDate });
    setIsModalOpen(false);
  }, [startDate, endDate]);

  // 날짜 형식 변환 함수
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Summary 데이터 구조 정의
  const summaryData = [
    {
      title: '평균 회의시간',
      unit: '분',
      target: 60.4,
      average: 40.8,
      labelTarget: '조회 대상 기준',
      labelAvg: '전체 평균',
      color: '#351745',
      colorAvg: '#bdbdbd',
      yMax: 70,
    },
    {
      title: '평균 회의빈도',
      unit: '회',
      target: 750.1,
      average: 698.9,
      labelTarget: '조회 대상 기준',
      labelAvg: '전체 평균',
      color: '#351745',
      colorAvg: '#bdbdbd',
      yMax: 800,
    },
    {
      title: '평균 참석자 수',
      unit: '명',
      target: 6.7,
      average: 7.1,
      labelTarget: '조회 대상 기준',
      labelAvg: '전체 평균',
      color: '#351745',
      colorAvg: '#bdbdbd',
      yMax: 10,
    },
  ];

  return (
    <DashboardContainer>
      <PageTitle>대시보드</PageTitle>
      
      <TabContainer>
        {periodTypes.map((period) => (
          <Tab
            key={period}
            $isActive={selectedPeriod === period}
            onClick={() => handlePeriodChange(period)}
          >
            {periodLabels[period]}
          </Tab>
        ))}
      </TabContainer>

      <FilterSection>
        <FilterGroup>
          <FilterSelect>
            <SelectLabel>프로젝트별</SelectLabel>
            <Select>
              <option value="">프로젝트를 선택하세요.</option>
              <option value="project1">프로젝트 1</option>
              <option value="project2">프로젝트 2</option>
            </Select>
          </FilterSelect>

          <FilterSelect>
            <SelectLabel>부서별</SelectLabel>
            <Select defaultValue="operating">
              <option value="operating">Operating Management</option>
              <option value="dev">Development</option>
              <option value="design">Design</option>
            </Select>
          </FilterSelect>

          <FilterSelect>
            <SelectLabel>사용자별</SelectLabel>
            <Select defaultValue="dazzang22">
              <option value="dazzang22">dazzang22</option>
              <option value="user2">User 2</option>
              <option value="user3">User 3</option>
            </Select>
          </FilterSelect>
        </FilterGroup>

        <ApplyButton onClick={handleOpenModal}>조회기간 설정</ApplyButton>
      </FilterSection>

      {/* 날짜 선택 모달 */}
      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>조회 기간 설정</ModalTitle>
            
            <DateRangeContainer>
              <DateInputGroup>
                <DateLabel>시작일</DateLabel>
                <DateInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                />
              </DateInputGroup>
              <DateInputGroup>
                <DateLabel>종료일</DateLabel>
                <DateInput
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </DateInputGroup>
            </DateRangeContainer>

            <SelectedDateRange>
              선택된 기간: {formatDate(startDate)} ~ {formatDate(endDate)}
            </SelectedDateRange>

            <ButtonGroup>
              <ModalButton onClick={handleCloseModal}>
                취소
              </ModalButton>
              <ModalButton $isPrimary onClick={handleApplyDateRange}>
                적용
              </ModalButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      <SummarySection>
        <SummaryTitle>Summary</SummaryTitle>
        <SummaryGrid>
          {summaryData.map((item, idx) => (
            <SummaryCard key={item.title}>
              <SummaryCardTitle>{item.title}</SummaryCardTitle>
              <div style={{ width: 140, height: 180, margin: '0 auto 8px auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: item.labelTarget, value: item.target, fill: item.color },
                      { name: item.labelAvg, value: item.average, fill: item.colorAvg },
                    ]}
                    barCategoryGap={40}
                    maxBarSize={40}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ textAnchor: 'middle' }} />
                    <YAxis domain={[0, item.yMax]} hide />
                    <Tooltip formatter={(v) => `${v}${item.unit}`} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                      {[
                        { name: item.labelTarget, value: item.target, fill: item.color },
                        { name: item.labelAvg, value: item.average, fill: item.colorAvg },
                      ].map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ComparisonContainer>
                <ComparisonItem>
                  <ComparisonValue $isPrimary>{item.target}{item.unit}</ComparisonValue>
                  <ComparisonLabel>{item.labelTarget}</ComparisonLabel>
                </ComparisonItem>
                <ComparisonItem>
                  <ComparisonValue>{item.average}{item.unit}</ComparisonValue>
                  <ComparisonLabel>{item.labelAvg}</ComparisonLabel>
                </ComparisonItem>
              </ComparisonContainer>
            </SummaryCard>
          ))}
        </SummaryGrid>
      </SummarySection>

      <FeedbackSection>
        <FeedbackTitle>Feedback</FeedbackTitle>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <FeedbackSubTitle>유형별 발생 빈도</FeedbackSubTitle>
        </div>
        <ChartContainer>
          {chartComponent}
        </ChartContainer>
        <TableContainer>
          <Table>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <Th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </FeedbackSection>
    </DashboardContainer>
  );
};

export default AdminDashboard; 