import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

// 스타일 컴포넌트 재사용
const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #f7f7f7;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 2rem;

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
  background-color: ${(props) =>
    props.variant === 'danger' ? '#dc3545' : '#007bff'};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

const Form = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

interface Company {
  company_id: string;
  company_name: string;
  company_scale: string;
  service_startdate: string;
  service_enddate: string;
  service_status: boolean;
}

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.5rem;
    color: #333;
  }
`;

const CreateButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const StatusBadge = styled.div<{ $status: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  background-color: ${(props) =>
    props.$status ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${(props) => (props.$status ? '#16a34a' : '#dc2626')};
  border: 1px solid
    ${(props) =>
      props.$status ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};

  &:hover {
    opacity: 0.8;
  }

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    background-color: ${(props) => (props.$status ? '#16a34a' : '#dc2626')};
  }
`;

const StatusDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 150px;
  margin-top: 4px;
`;

const StatusOption = styled.div<{ $status: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  color: ${(props) => (props.$status ? '#16a34a' : '#dc2626')};

  &:hover {
    background-color: #f8fafc;
  }
`;

const StatusContainer = styled.div`
  position: relative;
`;

// 정렬 방향을 위한 타입 추가
type SortDirection = 'asc' | 'desc' | null;

// 정렬 상태를 위한 인터페이스
interface SortState {
  field: string;
  direction: SortDirection;
}

// 테이블 헤더 스타일 컴포넌트 추가
const TableHeader = styled.th`
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  user-select: none;
  position: relative;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const SortIcon = styled.span<{ $direction: SortDirection }>`
  display: inline-block;
  margin-left: 4px;
  vertical-align: middle;

  &::before,
  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  &::before {
    border-bottom: 4px solid
      ${(props) => (props.$direction === 'asc' ? '#2563eb' : '#cbd5e1')};
    margin-bottom: 2px;
  }

  &::after {
    border-top: 4px solid
      ${(props) => (props.$direction === 'desc' ? '#2563eb' : '#cbd5e1')};
  }
`;

const AdminCom: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [activeStatusDropdown, setActiveStatusDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    company_scale: '',
    service_startdate: new Date().toISOString().split('T')[0],
    service_enddate: '',
    service_status: true,
  });

  // 정렬 상태 추가
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null,
  });

  // 회사 목록 조회
  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/`
      );
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('회사 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 입력 폼 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회사 생성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        fetchCompanies();
        setFormData({
          company_name: '',
          company_scale: '',
          service_startdate: new Date().toISOString().split('T')[0],
          service_enddate: '',
          service_status: true,
        });
      }
    } catch (error) {
      console.error('회사 생성 실패:', error);
    }
  };

  // 회사 수정
  const handleUpdate = async (companyId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/${companyId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        fetchCompanies();
        setSelectedCompanyId(null);
      }
    } catch (error) {
      console.error('회사 수정 실패:', error);
    }
  };

  // 회사 삭제
  const handleDelete = async (companyId: string) => {
    if (window.confirm('정말로 이 회사를 삭제하시겠습니까?')) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/${companyId}`,
          {
            method: 'DELETE',
          }
        );
        if (response.ok) {
          fetchCompanies();
        }
      } catch (error) {
        console.error('회사 삭제 실패:', error);
      }
    }
  };

  // 서비스 상태 변경 함수
  const handleStatusToggle = async (companyId: string, currentStatus: boolean) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/${companyId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            service_status: !currentStatus,
            // 비활성화로 변경할 때만 서비스 종료일 설정
            ...(currentStatus && { service_enddate: today })
          }),
        }
      );
      if (response.ok) {
        await fetchCompanies();
        setActiveStatusDropdown(null);
      }
    } catch (error) {
      console.error('서비스 상태 변경 실패:', error);
    }
  };

  const handleRowClick = (company: Company) => {
    setSelectedCompanyId(company.company_id);
    setFormData({
      company_name: company.company_name,
      company_scale: company.company_scale,
      service_startdate: company.service_startdate,
      service_enddate: company.service_enddate,
      service_status: company.service_status,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setFormData({
      company_name: '',
      company_scale: '',
      service_startdate: new Date().toISOString().split('T')[0],
      service_enddate: '',
      service_status: true,
    });
    setIsCreateModalOpen(true);
  };

  // 정렬 핸들러 추가
  const handleSort = (field: string) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field
          ? prev.direction === 'asc'
            ? 'desc'
            : prev.direction === 'desc'
            ? null
            : 'asc'
          : 'asc',
    }));
  };

  // 정렬된 회사 목록 계산
  const sortedCompanies = useMemo(() => {
    let sorted = [...companies];
    if (sortState.direction !== null) {
      sorted.sort((a, b) => {
        const aValue = String(a[sortState.field as keyof Company] || '');
        const bValue = String(b[sortState.field as keyof Company] || '');
        
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }
    return sorted;
  }, [companies, sortState]);

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>회사 관리</h1>
          <CreateButton onClick={handleCreateClick}>
            + 새 회사 등록
          </CreateButton>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <TableHeader onClick={() => handleSort('company_name')}>
                회사명
                <SortIcon
                  $direction={
                    sortState.field === 'company_name' ? sortState.direction : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('company_scale')}>
                규모
                <SortIcon
                  $direction={
                    sortState.field === 'company_scale' ? sortState.direction : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('service_startdate')}>
                서비스 시작일
                <SortIcon
                  $direction={
                    sortState.field === 'service_startdate' ? sortState.direction : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('service_enddate')}>
                서비스 종료일
                <SortIcon
                  $direction={
                    sortState.field === 'service_enddate' ? sortState.direction : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('service_status')}>
                서비스 상태
                <SortIcon
                  $direction={
                    sortState.field === 'service_status' ? sortState.direction : null
                  }
                />
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedCompanies.map((company) => (
              <tr
                key={company.company_id}
                onClick={() => handleRowClick(company)}
                style={{ cursor: 'pointer' }}
              >
                <td>{company.company_name}</td>
                <td>{company.company_scale}</td>
                <td>{new Date(company.service_startdate).toLocaleDateString()}</td>
                <td>
                  {company.service_enddate
                    ? new Date(company.service_enddate).toLocaleDateString()
                    : '-'}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <StatusContainer>
                    <StatusBadge
                      $status={company.service_status}
                      onClick={() =>
                        setActiveStatusDropdown(
                          activeStatusDropdown === company.company_id
                            ? null
                            : company.company_id
                        )
                      }
                    >
                      {company.service_status ? '활성' : '비활성'}
                    </StatusBadge>
                    {activeStatusDropdown === company.company_id && (
                      <StatusDropdown>
                        <StatusOption
                          $status={true}
                          onClick={() =>
                            handleStatusToggle(company.company_id, false)
                          }
                        >
                          활성화
                        </StatusOption>
                        <StatusOption
                          $status={false}
                          onClick={() =>
                            handleStatusToggle(company.company_id, true)
                          }
                        >
                          비활성화
                        </StatusOption>
                      </StatusDropdown>
                    )}
                  </StatusContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* 생성 모달 */}
        <Modal $isOpen={isCreateModalOpen}>
          <ModalContent>
            <ModalHeader>
              <h2>새 회사 등록</h2>
              <CloseButton onClick={() => setIsCreateModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
                setIsCreateModalOpen(false);
              }}
            >
              <FormGroup>
                <label>회사명</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>규모</label>
                <input
                  type="text"
                  name="company_scale"
                  value={formData.company_scale}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>서비스 시작일</label>
                <input
                  type="date"
                  name="service_startdate"
                  value={formData.service_startdate}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>서비스 종료일 (선택)</label>
                <input
                  type="date"
                  name="service_enddate"
                  value={formData.service_enddate}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit">등록</Button>
                <Button type="button" onClick={() => setIsCreateModalOpen(false)}>
                  취소
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>

        {/* 수정 모달 */}
        <Modal $isOpen={isEditModalOpen}>
          <ModalContent>
            <ModalHeader>
              <h2>회사 정보 수정</h2>
              <CloseButton onClick={() => setIsEditModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedCompanyId) {
                  handleUpdate(selectedCompanyId);
                  setIsEditModalOpen(false);
                }
              }}
            >
              <FormGroup>
                <label>회사명</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>규모</label>
                <input
                  type="text"
                  name="company_scale"
                  value={formData.company_scale}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>서비스 시작일</label>
                <input
                  type="date"
                  name="service_startdate"
                  value={formData.service_startdate}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>서비스 종료일 (선택)</label>
                <input
                  type="date"
                  name="service_enddate"
                  value={formData.service_enddate}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit">수정</Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => {
                    if (selectedCompanyId) {
                      handleDelete(selectedCompanyId);
                      setIsEditModalOpen(false);
                    }
                  }}
                >
                  삭제
                </Button>
                <Button type="button" onClick={() => setIsEditModalOpen(false)}>
                  취소
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      </MainContent>
    </Container>
  );
};

export default AdminCom;
