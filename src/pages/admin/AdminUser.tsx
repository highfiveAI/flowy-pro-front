import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import EditUsers from './popup/editusers';
import ManageUsers from './popup/manageusers';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: #fff;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px 60px 0 60px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    font-size: 2rem;
    color: #480b6a;
    font-weight: 700;
    letter-spacing: -1px;
  }
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  font-size: 1.05rem;

  th,
  td {
    padding: 20px 16px;
    text-align: left;
    border-bottom: 1px solid #ececec;
    font-size: 1.05rem;
    color: #222;
    font-weight: 400;
  }

  th {
    background: #fff;
    color: #351745;
    font-weight: 600;
    border-bottom: 2px solid #ececec;
    font-size: 1.08rem;
    letter-spacing: -0.5px;
  }

  tbody tr:hover {
    background: #f8f5ff;
  }
`;

// status 드롭다운바
const StatusBadge = styled.div<{ $status: string }>`
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;

  ${(props) => {
    switch (props.$status) {
      case 'Approved':
        return `
                    background-color: rgba(34, 197, 94, 0.1);
                    color: #16a34a;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                `;
      case 'Pending':
        return `
                    background-color: rgba(234, 179, 8, 0.1);
                    color: #b45309;
                    border: 1px solid rgba(234, 179, 8, 0.2);
                `;
      case 'Rejected':
        return `
                    background-color: rgba(239, 68, 68, 0.1);
                    color: #dc2626;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                `;
      default:
        return `
                    background-color: rgba(148, 163, 184, 0.1);
                    color: #64748b;
                    border: 1px solid rgba(148, 163, 184, 0.2);
                `;
    }
  }}

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;

    ${(props) => {
      switch (props.$status) {
        case 'Approved':
          return `background-color: #16a34a;`;
        case 'Pending':
          return `background-color: #b45309;`;
        case 'Rejected':
          return `background-color: #dc2626;`;
        default:
          return `background-color: #64748b;`;
      }
    }}
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

const StatusOption = styled.div<{ $status: string }>`
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: #f8fafc;
  }

  ${(props) => {
    switch (props.$status) {
      case 'Approved':
        return `color: #16a34a;`;
      case 'Pending':
        return `color: #b45309;`;
      case 'Rejected':
        return `color: #dc2626;`;
      default:
        return `color: #64748b;`;
    }
  }}
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

interface User {
  user_id: string;
  user_login_id: string;
  user_email: string;
  user_name: string;
  user_phonenum: string;
  user_dept_name: string;
  user_team_name: string;
  user_jobname: string;
  user_company_id: string;
  user_position_id: string;
  user_sysrole_id: string;
  signup_completed_status: string;
  company_name: string;
  position_name: string;
  sysrole_name: string;
}

interface Company {
  company_id: string;
  company_name: string;
}

interface Position {
  position_id: string;
  position_name: string;
}

// const CreateButton = styled.button`
//   padding: 0.5rem 1rem;
//   background-color: #480B6A;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-weight: 500;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;

//   &:hover {
//     background-color: #480B6A;
//   }
// `;

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

// 정렬 방향을 위한 타입
type SortDirection = 'asc' | 'desc' | null;

// 정렬 상태를 위한 인터페이스
interface SortState {
  field: string;
  direction: SortDirection;
}

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
      ${(props) => (props.$direction === 'asc' ? '#480B6A' : '#cbd5e1')};
    margin-bottom: 2px;
  }

  &::after {
    border-top: 4px solid
      ${(props) => (props.$direction === 'desc' ? '#480B6A' : '#cbd5e1')};
  }
`;

// 필터 버튼 스타일
const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: ${(props) => (props.$isActive ? '#480b6a' : 'white')};
  color: ${(props) => (props.$isActive ? 'white' : '#351745')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#3a0854' : '#f8f5ff')};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [companies/*, setCompanies*/] = useState<Company[]>([]);

  // const [positions, setPositions] = useState<Position[]>([]);
  const [companyPositions, setCompanyPositions] = useState<{
    [key: string]: Position[];
  }>({});
  const [currentUserCompany, setCurrentUserCompany] = useState<Company | null>(
    null
  );

  // 모달 상태 관리
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // 폼 데이터 초기 상태
  const initialFormData = {
    user_name: '',
    user_email: '',
    user_login_id: '',
    user_password: '',
    user_phonenum: '',
    user_dept_name: '',
    user_team_name: '',
    user_jobname: '',
    user_company_id: '',
    user_position_id: '',
    user_sysrole_id: '',
    signup_completed_status: '',
    company_name: '',
    position_name: '',
    sysrole_name: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeStatusDropdown, setActiveStatusDropdown] = useState<
    string | null
  >(null);
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null,
  });
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [showRejectedOnly, setShowRejectedOnly] = useState(false);

  // API 호출 함수
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/`,
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      // console.log('API 응답 데이터:', data); // 데이터 확인용 로그
      setUsers(data);
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
    }
  };

  // // 회사, 직급, 역할 데이터 가져오기
  // const fetchCompanies = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/`,
  //       {
  //         credentials: 'include',
  //       }
  //     );
  //     const data = await response.json();
  //     setCompanies(data);
  //   } catch (error) {
  //     console.error('회사 목록 조회 실패:', error);
  //   }
  // };

  // const fetchPositions = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/`,
  //       {
  //         credentials: 'include',
  //       }
  //     );
  //     const data = await response.json();
  //     setPositions(data);
  //     console.log(positions);
  //   } catch (error) {
  //     console.error('직급 목록 조회 실패:', error);
  //   }
  // };

  // 회사별 직급 데이터 가져오기
  const fetchCompanyPositions = async (companyId: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/admin/companies/${companyId}/positions/`,
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      setCompanyPositions((prev) => ({
        ...prev,
        [companyId]: data,
      }));
    } catch (error) {
      console.error('회사별 직급 목록 조회 실패:', error);
    }
  };

  // 현재 로그인한 사용자의 정보 가져오기
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/one`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('사용자 정보 조회에 실패했습니다.');
      }
      const data = await response.json();
      // 사용자의 회사 정보 설정
      if (data.user_company_id) {
        const company = companies.find(
          (c) => c.company_id === data.user_company_id
        );
        setCurrentUserCompany(company || null);
        // 회사의 직급 정보도 미리 가져오기
        fetchCompanyPositions(data.user_company_id);
      }
    } catch (error) {
      console.error('현재 사용자 정보 조회 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchUsers();
    // fetchCompanies();
    // fetchPositions();
    fetchCurrentUser();
  }, []);

  // companies가 변경될 때 현재 사용자의 회사 정보 업데이트
  useEffect(() => {
    if (companies.length > 0) {
      fetchCurrentUser();
    }
  }, [companies]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회사 선택 시 해당 회사의 직급 목록 가져오기
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value;
    handleInputChange(e);

    // 회사가 선택되었을 때만 직급 목록 가져오기
    if (companyId) {
      fetchCompanyPositions(companyId);
      // 직급 초기화
      setFormData((prev) => ({
        ...prev,
        user_position_id: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        fetchUsers();
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('사용자 생성 실패:', error);
    }
  };

  const handleUpdate = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        fetchUsers();
        setSelectedUserId(null);
      }
    } catch (error) {
      console.error('사용자 수정 실패:', error);
    }
  };

  // const handleDelete = async (userId: string) => {
  //   if (window.confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
  //     try {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`,
  //         {
  //           method: "DELETE",
  //           credentials: "include",
  //         }
  //       );
  //       if (response.ok) {
  //         fetchUsers();
  //       }
  //     } catch (error) {
  //       console.error("사용자 삭제 실패:", error);
  //     }
  //   }
  // };

  // const handleCreateClick = () => {
  //   setFormData({
  //     ...initialFormData,
  //     user_company_id: currentUserCompany?.company_id || "",
  //   });
  //   setIsCreateModalOpen(true);
  // };

  const handleRowClick = (user: User) => {
    if (showRejectedOnly) return; // 반려 목록에서는 팝업 없음
    setSelectedUserId(user.user_id);
    setFormData({
      user_name: user.user_name,
      user_email: user.user_email,
      user_login_id: user.user_login_id,
      user_password: '',
      user_phonenum: user.user_phonenum,
      user_dept_name: user.user_dept_name || '',
      user_team_name: user.user_team_name || '',
      user_jobname: user.user_jobname || '',
      user_company_id: currentUserCompany?.company_id || '',
      user_position_id: user.user_position_id || '',
      user_sysrole_id: '4864c9d2-7f9c-4862-9139-4e8b0ed117f4',
      signup_completed_status: user.signup_completed_status || '',
      company_name: user.company_name || '',
      position_name: user.position_name || '',
      sysrole_name: user.sysrole_name || '',
    });
    if (currentUserCompany?.company_id) {
      fetchCompanyPositions(currentUserCompany.company_id);
    }
    if (showPendingOnly) {
      setIsManageModalOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
  };

  // 상태 변경 핸들러
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchUsers(); // 목록 새로고침
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
    setActiveStatusDropdown(null); // 드롭다운 닫기
  };

  // 정렬 핸들러
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

  // 필터링된 사용자 목록 계산
  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    if (currentUserCompany) {
      filtered = filtered.filter(
        (user) => user.user_company_id === currentUserCompany.company_id
      );
    }
    if (showPendingOnly) {
      filtered = filtered.filter(
        (user) => user.signup_completed_status === 'Pending'
      );
    } else if (showRejectedOnly) {
      filtered = filtered.filter(
        (user) => user.signup_completed_status === 'Rejected'
      );
    } else {
      filtered = filtered.filter(
        (user) => user.signup_completed_status === 'Approved'
      );
    }
    if (sortState.direction !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortState.field as keyof User] || '';
        const bValue = b[sortState.field as keyof User] || '';
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }
    return filtered;
  }, [users, showPendingOnly, showRejectedOnly, sortState, currentUserCompany]);

  const handleManageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>사용자 관리</h1>
        </PageHeader>

        <FilterContainer>
          <FilterButton
            $isActive={!showPendingOnly && !showRejectedOnly}
            onClick={() => {
              setShowPendingOnly(false);
              setShowRejectedOnly(false);
            }}
          >
            승인된 사용자 목록
          </FilterButton>
          <FilterButton
            $isActive={showPendingOnly}
            onClick={() => {
              setShowPendingOnly(true);
              setShowRejectedOnly(false);
            }}
          >
            승인 대기 중인 사용자 목록
          </FilterButton>
          <FilterButton
            $isActive={showRejectedOnly}
            onClick={() => {
              setShowPendingOnly(false);
              setShowRejectedOnly(true);
            }}
          >
            반려된 사용자 목록
          </FilterButton>
        </FilterContainer>

        <UserTable>
          <thead>
            <tr>
              <TableHeader onClick={() => handleSort('user_id')}>
                Requested ID
                <SortIcon
                  $direction={
                    sortState.field === 'user_id' ? sortState.direction : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('user_login_id')}>
                아이디
                <SortIcon
                  $direction={
                    sortState.field === 'user_login_id'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('user_name')}>
                이름
                <SortIcon
                  $direction={
                    sortState.field === 'user_name' ? sortState.direction : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('user_dept_name')}>
                소속 부서명
                <SortIcon
                  $direction={
                    sortState.field === 'user_dept_name'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('user_team_name')}>
                소속 팀명
                <SortIcon
                  $direction={
                    sortState.field === 'user_team_name'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
              <TableHeader
                onClick={() => handleSort('signup_completed_status')}
              >
                가입 상태
                <SortIcon
                  $direction={
                    sortState.field === 'signup_completed_status'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.user_id}
                onClick={() => handleRowClick(user)}
                style={{ cursor: 'pointer' }}
              >
                <td>{user.user_id}</td>
                <td>{user.user_login_id}</td>
                <td>{user.user_name}</td>
                <td>{user.user_dept_name}</td>
                <td>{user.user_team_name}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  {/* 행 클릭 이벤트와 분리 */}
                  <StatusBadge
                    $status={user.signup_completed_status}
                    onClick={
                      showRejectedOnly
                        ? undefined
                        : () =>
                            setActiveStatusDropdown(
                              activeStatusDropdown === user.user_id
                                ? null
                                : user.user_id
                            )
                    }
                    style={showRejectedOnly ? { cursor: 'default' } : {}}
                  >
                    {user.signup_completed_status || 'Unknown'}
                    {!showRejectedOnly &&
                      activeStatusDropdown === user.user_id && (
                        <StatusDropdown>
                          <StatusOption
                            $status="Approved"
                            onClick={() =>
                              handleStatusChange(user.user_id, 'Approved')
                            }
                          >
                            승인
                          </StatusOption>
                          <StatusOption
                            $status="Rejected"
                            onClick={() =>
                              handleStatusChange(user.user_id, 'Pending')
                            }
                          >
                            반려
                          </StatusOption>
                        </StatusDropdown>
                      )}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </UserTable>

        {/* 생성 모달 */}
        <Modal $isOpen={isCreateModalOpen}>
          <ModalContent>
            <ModalHeader>
              <h2>새 사용자 생성</h2>
              <button onClick={() => setIsCreateModalOpen(false)}>×</button>
            </ModalHeader>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
                setIsCreateModalOpen(false);
              }}
            >
              <FormGroup>
                <label>이름</label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>이메일</label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>로그인 ID</label>
                <input
                  type="text"
                  name="user_login_id"
                  value={formData.user_login_id}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>비밀번호</label>
                <input
                  type="password"
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>전화번호</label>
                <input
                  type="tel"
                  name="user_phonenum"
                  value={formData.user_phonenum}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>회사</label>
                <Select
                  name="user_company_id"
                  value={currentUserCompany?.company_id || ''}
                  onChange={handleCompanyChange}
                  required
                  disabled
                >
                  <option value="">회사 선택</option>
                  {currentUserCompany && (
                    <option value={currentUserCompany.company_id}>
                      {currentUserCompany.company_name}
                    </option>
                  )}
                </Select>
              </FormGroup>
              <FormGroup>
                <label>직급</label>
                <Select
                  name="user_position_id"
                  value={formData.user_position_id}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.user_company_id}
                >
                  <option value="">직급 선택</option>
                  {formData.user_company_id &&
                    companyPositions[formData.user_company_id]?.map(
                      (position) => (
                        <option
                          key={position.position_id}
                          value={position.position_id}
                        >
                          {position.position_name}
                        </option>
                      )
                    )}
                </Select>
              </FormGroup>
              <FormGroup>
                <label>부서명</label>
                <input
                  type="text"
                  name="user_dept_name"
                  value={formData.user_dept_name}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <label>팀명</label>
                <input
                  type="text"
                  name="user_team_name"
                  value={formData.user_team_name}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <label>직무</label>
                <input
                  type="text"
                  name="user_jobname"
                  value={formData.user_jobname}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit">생성</Button>
                <Button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  취소
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>

        {/* 수정 모달 */}
        {!showPendingOnly && (
          <Modal $isOpen={isEditModalOpen}>
            <EditUsers
              isOpen={isEditModalOpen}
              user={formData}
              onApprove={() => {
                if (selectedUserId)
                  handleStatusChange(selectedUserId, 'Approved');
                setIsEditModalOpen(false);
              }}
              onReject={() => {
                if (selectedUserId)
                  handleStatusChange(selectedUserId, 'Rejected');
                setIsEditModalOpen(false);
              }}
              onClose={() => setIsEditModalOpen(false)}
            />
          </Modal>
        )}

        {/* 대기 사용자 관리 모달 */}
        {showPendingOnly && (
          <Modal $isOpen={isManageModalOpen}>
            <ManageUsers
              isOpen={isManageModalOpen}
              user={formData}
              onApprove={() => {
                if (selectedUserId) {
                  handleUpdate(selectedUserId); // 변경된 정보 저장
                  handleStatusChange(selectedUserId, 'Approved');
                }
                setIsManageModalOpen(false);
              }}
              onReject={() => {
                if (selectedUserId)
                  handleStatusChange(selectedUserId, 'Rejected');
                setIsManageModalOpen(false);
              }}
              onClose={() => setIsManageModalOpen(false)}
              onChange={handleManageInputChange}
            />
          </Modal>
        )}
      </MainContent>
    </Container>
  );
};

export default AdminUser;
