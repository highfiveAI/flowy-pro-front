import { useMemo, useState, useCallback, useEffect } from 'react';
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
  Cell,
} from 'recharts';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  fetchDashboardStats,
  fetchDashboardFilterOptions,
} from '../../api/fetchDashboard';
import type {
  DashboardResponse,
  FilterOptions,
  TableData,
  DashboardSummary,
} from '../../types/dashboard';

const DashboardContainer = styled.div`
  padding: 40px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #351745;
  margin-bottom: 30px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ $isActive?: boolean }>`
  padding: 8px 16px;
  background: ${(props) => (props.$isActive ? '#351745' : '#f5f5f5')};
  color: ${(props) => (props.$isActive ? '#fff' : '#666')};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }

  &:hover {
    background: ${(props) => (props.$isActive ? '#351745' : '#e0e0e0')};
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
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const FilterSelect = styled.div`
  position: relative;
  min-width: 200px;
`;

const SelectLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
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

  &:focus {
    outline: none;
    border-color: #351745;
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
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
`;

const SummaryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 0;
  color: #351745;
  text-align: left;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const SummaryCard = styled.div`
  text-align: center;
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
`;

const ComparisonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  text-align: center;
  width: auto;
`;

const ComparisonItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ComparisonValue = styled.div<{ $isPrimary?: boolean }>`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => (props.$isPrimary ? '#351745' : '#666')};
  margin-bottom: 8px;
`;

const ComparisonLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

// Feedback Section
const FeedbackSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FeedbackTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 0;
  color: #351745;
  text-align: left;
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
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 24px;
`;

// 테이블 스타일링
const TableContainer = styled.div`
  margin-top: 24px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  background-color: #f8f6fa;
  color: #351745;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f6fa;
  }
`;

type PeriodType = 'year' | 'quarter' | 'month' | 'week' | 'day';

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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #351745;
  margin-bottom: 20px;
  text-align: center;
`;

const DateRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const DateInputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const DateLabel = styled.label`
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
`;

const DateInput = styled.input`
  width: 66%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;

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
`;

const ModalButton = styled.button<{ $isPrimary?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.$isPrimary
      ? `
    background: #351745;
    color: white;
    
    &:hover {
      background: #4a1168;
    }
  `
      : `
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
`;

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // API 데이터 상태
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태 - 기본값 "전체"
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');

  // 대시보드 데이터 로드 - 계층적 필터링 적용
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        period: selectedPeriod,
        start_date: startDate,
        end_date: endDate,
      };

      // 계층적 필터링: 프로젝트 → 부서 → 사용자 순서로 적용
      if (selectedProject) {
        params.project_id = selectedProject;
        console.log('▶ 대시보드 데이터 요청 (프로젝트 필터):', params);
      }
      if (selectedDepartment) {
        params.department = selectedDepartment;
        console.log('▶ 대시보드 데이터 요청 (부서 필터):', params);
      }
      if (selectedUser) {
        params.user_id = selectedUser;
        console.log('▶ 대시보드 데이터 요청 (사용자 필터):', params);
      }

      const data: DashboardResponse = await fetchDashboardStats(params);
      setDashboardData(data);
      console.log('▶ 대시보드 데이터 응답:', data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '데이터 로드에 실패했습니다.'
      );
      console.error('대시보드 데이터 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [
    selectedPeriod,
    startDate,
    endDate,
    selectedProject,
    selectedDepartment,
    selectedUser,
  ]);

  // 필터 옵션 로드 - 계층적 필터링을 위해 파라미터 전달
  const loadFilterOptions = useCallback(async () => {
    try {
      setFilterLoading(true);
      const params: any = {};

      // 계층적 필터링: 프로젝트 → 부서 → 사용자 순서로 적용
      if (selectedProject) {
        params.project_id = selectedProject;
        console.log('▶ 초기 필터 옵션 요청 (프로젝트 기반):', params);
      }
      if (selectedDepartment) {
        params.department = selectedDepartment;
        console.log('▶ 초기 필터 옵션 요청 (부서 기반):', params);
      }

      const options: FilterOptions = await fetchDashboardFilterOptions(params);
      setFilterOptions(options);
      console.log('▶ 초기 필터 옵션 응답:', options);
    } catch (err) {
      console.error('초기 필터 옵션 로드 오류:', err);
    } finally {
      setFilterLoading(false);
    }
  }, [selectedProject, selectedDepartment]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    loadFilterOptions();
    loadDashboardData();
  }, []);

  // 필터 변경 시 대시보드 데이터 갱신
  useEffect(() => {
    // 초기 로딩이 아닌 경우에만 대시보드 데이터 갱신
    if (dashboardData !== null) {
      loadDashboardData();
    }
  }, [selectedProject, selectedDepartment, selectedUser]);

  // 필터 변경 핸들러 - 계층적 연동 로직 구현
  const handleProjectChange = useCallback(async (projectId: string) => {
    console.log('▶ 프로젝트 선택 값:', projectId);
    setSelectedProject(projectId);

    // 프로젝트 변경 시 부서와 사용자 초기화
    setSelectedDepartment('');
    setSelectedUser('');

    // 프로젝트 선택 시 해당 프로젝트에 참여하는 부서/사용자만 가져오기
    try {
      setFilterLoading(true);
      const params: any = {};
      if (projectId) {
        params.project_id = projectId;
        console.log('▶ 프로젝트 기반 필터 옵션 요청:', params);
      }
      const options: FilterOptions = await fetchDashboardFilterOptions(params);
      setFilterOptions(options);
      console.log('▶ 프로젝트 기반 필터 옵션 응답:', options);
    } catch (err) {
      console.error('프로젝트 기반 필터 옵션 갱신 오류:', err);
    } finally {
      setFilterLoading(false);
    }
  }, []);

  const handleDepartmentChange = useCallback(
    async (department: string) => {
      console.log('▶ 부서 선택 값:', department);
      setSelectedDepartment(department);

      // 부서 변경 시 사용자 초기화
      setSelectedUser('');

      // 부서 선택 시 해당 부서의 사용자만 가져오기
      try {
        setFilterLoading(true);
        const params: any = {};
        if (selectedProject) params.project_id = selectedProject;
        if (department) {
          params.department = department;
          console.log('▶ 부서 기반 필터 옵션 요청:', params);
        }
        const options: FilterOptions = await fetchDashboardFilterOptions(
          params
        );
        setFilterOptions(options);
        console.log('▶ 부서 기반 필터 옵션 응답:', options);
      } catch (err) {
        console.error('부서 기반 필터 옵션 갱신 오류:', err);
      } finally {
        setFilterLoading(false);
      }
    },
    [selectedProject]
  );

  const handleUserChange = useCallback((userId: string) => {
    console.log('▶ 사용자 선택 값:', userId);
    setSelectedUser(userId);
  }, []);

  // 선택된 기간에 따라 데이터 필터링
  const filteredChartData = useMemo(() => {
    if (!dashboardData) return [];
    return dashboardData.chartData.filter(
      (data) => data.period === selectedPeriod
    );
  }, [selectedPeriod, dashboardData]);

  const handlePeriodChange = useCallback((period: PeriodType) => {
    setSelectedPeriod(period);
  }, []);

  // 기간별 레이블 매핑
  const periodLabels: Record<PeriodType, string> = useMemo(
    () => ({
      year: 'Year',
      quarter: 'Quarter',
      month: 'Month',
      week: 'Week',
      day: 'Day',
    }),
    []
  );

  // 기간 타입 배열을 안전하게 생성
  const periodTypes: PeriodType[] = useMemo(
    () => ['year', 'quarter', 'month', 'week', 'day'],
    []
  );

  // 테이블 컬럼 설정
  const columnHelper = useMemo(() => createColumnHelper<TableData>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor('period', {
        header: 'Period',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('target', {
        header: '피드백 항목',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('value', {
        header: '조회 결과',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('pop', {
        header: 'PoP',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('prevValue', {
        header: '전회 결과',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('growth', {
        header: '성장률',
        cell: (info) => info.getValue(),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: dashboardData?.tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 차트 컴포넌트 메모이제이션
  const chartComponent = useMemo(
    () => (
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
    ),
    [filteredChartData]
  );

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
    // 날짜 범위가 변경되면 데이터를 다시 로드
    loadDashboardData();
    setIsModalOpen(false);
  }, [loadDashboardData]);

  // 날짜 형식 변환 함수
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // 로딩 상태 표시
  if (loading) {
    return (
      <DashboardContainer>
        <PageTitle>대시보드</PageTitle>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          데이터를 불러오는 중...
        </div>
      </DashboardContainer>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <DashboardContainer>
        <PageTitle>대시보드</PageTitle>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          오류: {error}
        </div>
      </DashboardContainer>
    );
  }

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
            <Select
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
              disabled={filterLoading}
            >
              <option value="">전체</option>
              {filterOptions?.projects?.map(
                (project: { id: string; name: string }) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                )
              )}
            </Select>
            {filterLoading && (
              <div
                style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}
              >
                로딩 중...
              </div>
            )}
          </FilterSelect>

          <FilterSelect>
            <SelectLabel>부서별</SelectLabel>
            <Select
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              disabled={filterLoading}
            >
              <option value="">전체</option>
              {filterOptions?.departments?.map((dept: { name: string }) => (
                <option key={dept.name} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </Select>
            {filterLoading && (
              <div
                style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}
              >
                로딩 중...
              </div>
            )}
          </FilterSelect>

          <FilterSelect>
            <SelectLabel>사용자별</SelectLabel>
            <Select
              value={selectedUser}
              onChange={(e) => handleUserChange(e.target.value)}
              disabled={filterLoading}
            >
              <option value="">전체</option>
              {filterOptions?.users?.map(
                (user: { id: string; name: string; login_id: string }) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.login_id})
                  </option>
                )
              )}
            </Select>
            {filterLoading && (
              <div
                style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}
              >
                로딩 중...
              </div>
            )}
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
              <ModalButton onClick={handleCloseModal}>취소</ModalButton>
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
          {dashboardData?.summary.map((item: DashboardSummary) => (
            <SummaryCard key={item.title}>
              <SummaryCardTitle>{item.title}</SummaryCardTitle>
              <div
                style={{ width: 140, height: 180, margin: '0 auto 8px auto' }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: item.labelTarget,
                        value: item.target,
                        fill: item.color,
                      },
                      {
                        name: item.labelAvg,
                        value: item.average,
                        fill: item.colorAvg,
                      },
                    ]}
                    barCategoryGap={40}
                    maxBarSize={40}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ textAnchor: 'middle' }}
                    />
                    <YAxis domain={[0, item.yMax]} hide />
                    <Tooltip formatter={(v) => `${v}${item.unit}`} />
                    <Bar
                      dataKey="value"
                      radius={[8, 8, 0, 0]}
                      isAnimationActive={false}
                    >
                      {[
                        {
                          name: item.labelTarget,
                          value: item.target,
                          fill: item.color,
                        },
                        {
                          name: item.labelAvg,
                          value: item.average,
                          fill: item.colorAvg,
                        },
                      ].map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ComparisonContainer>
                <ComparisonItem>
                  <ComparisonValue $isPrimary>
                    {item.target}
                    {item.unit}
                  </ComparisonValue>
                  <ComparisonLabel>{item.labelTarget}</ComparisonLabel>
                </ComparisonItem>
                <ComparisonItem>
                  <ComparisonValue>
                    {item.average}
                    {item.unit}
                  </ComparisonValue>
                  <ComparisonLabel>{item.labelAvg}</ComparisonLabel>
                </ComparisonItem>
              </ComparisonContainer>
            </SummaryCard>
          ))}
        </SummaryGrid>
      </SummarySection>

      <FeedbackSection>
        <FeedbackTitle>Feedback</FeedbackTitle>
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <FeedbackSubTitle>유형별 발생 빈도</FeedbackSubTitle>
        </div>
        <ChartContainer>{chartComponent}</ChartContainer>
        <TableContainer>
          <Table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
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
