import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import NewCompany from './popup/newCompany';
import EditCompany from './popup/editCompany';

// 스타일 컴포넌트 재사용
const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(80, 0, 80, 0.06);
  padding: 48px 40px 40px 40px;
  min-height: 80vh;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  margin-bottom: 2rem;
  font-size: 1.05rem;
  th, td {
    padding: 1.2rem 0.5rem;
    text-align: left;
    border: none;
    font-size: 1.05rem;
  }
  th {
    color: #5E5553;
    font-weight: 700;
    font-size: 1.08rem;
    background: #fff;
    border-bottom: 2px solid #eee;
  }
  td {
    color: #5E5553;
    border-bottom: 1.5px solid #eee;
    background: #fff;
  }
  tr:last-child td {
    border-bottom: none;
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
  admin_account: string;
}

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: #351745;
    margin: 0;
  }
`;

const AddButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #351745;
  color: #fff;
  border: none;
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(80,0,80,0.08);
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #4b2067; }
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
  padding: 0.4rem 1.1rem 0.4rem 0.9rem;
  border-radius: 1.2rem;
  font-size: 1.02rem;
  font-weight: 600;
  background: #f5f5f7;
  color: #5E5553;
  border: none;
  box-shadow: none;
  &::before {
    content: '';
    width: 9px;
    height: 9px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: ${(props) => (props.$status ? '#16a34a' : '#dc2626')};
    display: inline-block;
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
  color: ${(props) => (props.$status ? '#480B6A' : '#dc2626')};

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
  color: #480B6A;
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
      ${(props) => (props.$direction === 'asc' ? '#480B6A' : '#cbd5e1')};
    margin-bottom: 2px;
  }

  &::after {
    border-top: 4px solid
      ${(props) => (props.$direction === 'desc' ? '#480B6A' : '#cbd5e1')};
  }
`;

// 날짜를 yyyy-MM-dd로 변환하는 함수
const toDateInputValue = (dateString: string) => {
  if (!dateString) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  return dateString.split('T')[0];
};

const AdminCompany: React.FC = () => {
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
    service_startdate: '',
    service_enddate: '',
    service_status: true,
    admin_account: '',
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
          service_startdate: '',
          service_enddate: '',
          service_status: true,
          admin_account: '',
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
            // 비활성화로 변경할 때만 서비스 종료일 설정, 활성화로 변경할 때는 종료일 초기화
            ...(currentStatus
              ? { service_enddate: today }
              : { service_enddate: null }
            )
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
      admin_account: company.admin_account || '',
    });
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setFormData({
      company_name: '',
      company_scale: '',
      service_startdate: '',
      service_enddate: '',
      service_status: true,
      admin_account: '',
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
          <AddButton onClick={handleCreateClick}>+</AddButton>
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
                <td>{toDateInputValue(company.service_startdate)}</td>
                <td>{toDateInputValue(company.service_enddate)}</td>
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

        <NewCompany
          visible={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleInputChange}
        />
        <EditCompany
          visible={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={selectedCompanyId ? (e) => { e.preventDefault(); handleUpdate(selectedCompanyId); } : () => {}}
          onDelete={selectedCompanyId ? () => { handleDelete(selectedCompanyId); setIsEditModalOpen(false); } : () => {}}
          formData={formData}
          onChange={handleInputChange}
        />
      </MainContent>
    </Container>
  );
};

export default AdminCompany;
