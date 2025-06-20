import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NewAdmin from './popup/newAdmin';
import {
  fetchSignupInfos,
  fetchUsersByCompany,
  putAdminUser,
} from '../../../api/fetchSignupInfos';

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
  th,
  td {
    padding: 1.2rem 0.5rem;
    text-align: left;
    border: none;
    font-size: 1.05rem;
  }
  th {
    color: #5e5553;
    font-weight: 700;
    font-size: 1.08rem;
    background: #fff;
    border-bottom: 2px solid #eee;
  }
  td {
    color: #5e5553;
    border-bottom: 1.5px solid #eee;
    background: #fff;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

// const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
//   padding: 0.5rem 1rem;
//   border-radius: 4px;
//   border: none;
//   cursor: pointer;
//   margin-right: 0.5rem;
//   background-color: ${(props) =>
//     props.$variant === 'danger' ? '#dc3545' : '#007bff'};
//   color: white;
//   &:hover {
//     opacity: 0.9;
//   }
// `;

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
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.08);
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #4b2067;
  }
`;

// const Modal = styled.div<{ $isOpen: boolean }>`
//   display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   justify-content: center;
//   align-items: center;
//   z-index: 1000;
// `;

// const ModalContent = styled.div`
//   background-color: white;
//   padding: 3.5rem 3rem 2.5rem 3rem;
//   border-radius: 36px;
//   width: 100%;
//   max-width: 520px;
//   max-height: 80vh;
//   overflow-y: auto;
//   border: 2px solid #351745;
//   display: flex;
//   flex-direction: column;
//   align-items: stretch;
//   position: relative;
//   box-sizing: border-box;
// `;

// const ModalHeader = styled.div`
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   margin-bottom: 2.2rem;
//   h2 {
//     margin: 0;
//     font-size: 1.4rem;
//     color: #351745;
//     font-weight: 700;
//   }
// `;
// const CloseButton = styled.button`
//   position: absolute;
//   top: 32px;
//   right: 32px;
//   z-index: 1100;
//   background: none;
//   border: none;
//   font-size: 2.2rem;
//   cursor: pointer;
//   padding: 0.5rem;
//   color: #666;
//   &:hover {
//     color: #351745;
//   }
// `;
// const InputBox = styled.div`
//   display: flex;
//   align-items: center;
//   width: 100%;
//   height: 56px;
//   border: 1.5px solid #ccc;
//   border-radius: 4px;
//   background: #fff;
//   box-sizing: border-box;
//   padding: 0 1.2rem;
// `;
// const FormGroup = styled.div`
//   margin-bottom: 1.5rem;
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   box-sizing: border-box;
//   label {
//     min-width: 100px;
//     font-size: 1.08rem;
//     color: #888;
//     font-weight: 500;
//     margin-right: 1.2rem;
//     white-space: nowrap;
//   }
//   input {
//     flex: 1;
//     border: none;
//     outline: none;
//     background: transparent;
//     font-size: 1.1rem;
//     color: #351745;
//     font-weight: 500;
//     font-family: 'Rethink Sans', sans-serif;
//     height: 100%;
//     padding: 0;
//     margin: 0;
//     &::placeholder {
//       color: #b0b0b0;
//       font-weight: 500;
//     }
//   }
// `;

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
  company_name: string;
}

// 정렬 방향을 위한 타입 추가
type SortDirection = 'asc' | 'desc' | null;

// 정렬 상태를 위한 인터페이스
interface SortState {
  field: string;
  direction: SortDirection;
}

const TableHeader = styled.th`
  background-color: #f8fafc;
  color: #480b6a;
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

// Button 스타일 popup에서 복사
const PopupButton = styled.button`
  width: 140px;
  height: 48px;
  border-radius: 2rem;
  background: #13c7c1;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0.5rem 0 0;
  display: inline-block;
  box-shadow: 0 6px 18px #13c7c133;
  border: none;
  transition: background 0.18s;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    background: #0fa7a2;
  }
`;

const UserListItem = styled.li`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const AdminAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  // const [, isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [selectedAdminId, setSelectedAdminId] = useState<string | null>(
  //   null
  // );
  // const [formData, setFormData] = useState({
  //   user_id: '',
  //   user_name: '',
  //   user_email: '',
  //   user_phonenum: '',
  //   company_name: '',
  //   is_active: true,
  // });
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null,
  });
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const navigate = useNavigate();

  // 검색어 입력값과 실제 검색 결과 분리
  const [userSearchInput, setUserSearchInput] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  // 관리자 목록 조회 (더미 데이터 사용, 실제 API 연결 시 아래 코드 사용)
  const fetchAdmins = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/admin_users`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        let errorMsg = '관리자 목록 조회에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        navigate('/');
        throw new Error(errorMsg);
      }
      const data = await response.json();
      console.log('받아 온 데이터: ', data);
      if (Array.isArray(data)) {
        setAdmins(data);
      } else if (Array.isArray(data.admins)) {
        setAdmins(data.admins);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error('관리자 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 입력 폼 핸들러
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value,
  //   }));
  // };

  // 관리자 생성
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/v1/admin/accounts/`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(formData),
  //       }
  //     );
  //     if (response.ok) {
  //       // fetchAdmins();
  //       setFormData({
  //         user_id: '',
  //         user_name: '',
  //         user_email: '',
  //         user_phonenum: '',
  //         company_name: '',
  //         is_active: true,
  //       });
  //       setIsCreateModalOpen(false);
  //     }
  //   } catch (error) {
  //     console.error('관리자 생성 실패:', error);
  //   }
  // };

  // 관리자 수정
  // const handleUpdate = async (adminId: string) => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/v1/admin/accounts/${adminId}`,
  //       {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(formData),
  //       }
  //     );
  //     if (response.ok) {
  //       setAdmins((prev) =>
  //         prev.map((admin) =>
  //           admin.admin_id === adminId ? { ...admin, ...formData } : admin
  //         )
  //       );
  //       setSelectedAdminId(null);
  //       setIsEditModalOpen(false);
  //     } else {
  //       const errorData = await response.json().catch(() => ({}));
  //       alert(errorData.message || '수정에 실패했습니다.');
  //     }
  //   } catch (error) {
  //     alert('네트워크 오류 또는 서버 오류로 수정에 실패했습니다.');
  //     console.error('관리자 수정 실패:', error);
  //   }
  // };

  // 관리자 삭제
  // const handleDelete = async (adminId: string) => {
  //   if (window.confirm('정말로 이 관리자를 삭제하시겠습니까?')) {
  //     try {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/v1/admin/accounts/${adminId}`,
  //         {
  //           method: 'DELETE',
  //         }
  //       );
  //       if (response.ok) {
  //         // fetchAdmins();
  //       }
  //     } catch (error) {
  //       console.error('관리자 삭제 실패:', error);
  //     }
  //   }
  // };

  // const handleRowClick = (admin: AdminAccount) => {
  //   setSelectedAdminId(admin.admin_id);
  //   setFormData({
  //     admin_id: admin.admin_id,
  //     admin_name: admin.admin_name,
  //     admin_email: admin.admin_email,
  //     admin_phone: admin.admin_phone,
  //     company_name: admin.company_name,
  //     is_active: admin.is_active,
  //   });
  //   setIsEditModalOpen(true);
  // };

  const handleCreateClick = () => {
    setSelectedCompany(null);
    setUserList([]);
    setUserSearch('');
    setSelectedUser(null);
    setIsCompanyModalOpen(true);
    loadCompanyList();
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

  // 정렬된 관리자 목록 계산
  const sortedAdmins = useMemo(() => {
    let sorted = [...admins];
    if (sortState.direction !== null) {
      sorted.sort((a, b) => {
        // const aValue = String(a[sortState.field as keyof AdminAccount] || '');
        // const bValue = String(b[sortState.field as keyof AdminAccount] || '');
        const aValue = String(a[sortState.field as keyof User] || '');
        const bValue = String(b[sortState.field as keyof User] || '');
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }
    return sorted;
  }, [admins, sortState]);

  // 회사 목록 불러오기
  const loadCompanyList = async () => {
    const { companies } = await fetchSignupInfos();
    setCompanyList(companies);
  };

  // 회사별 사용자 목록 불러오기
  const loadUserList = async (company_id: string) => {
    const users = await fetchUsersByCompany(company_id);
    setUserList(users);
  };

  // 회사 선택 시 사용자 목록/검색 UI로 전환
  const handleCompanySelect = (company: any) => {
    setSelectedCompany(company);
    setUserSearch('');
    setSelectedUser(null);
    setIsCompanyModalOpen(false);
    loadUserList(company.company_id);
  };

  // 검색 버튼 클릭 시만 검색
  const handleSearch = () => {
    setUserSearch(userSearchInput);
    setSearchTriggered(true);
  };

  // 검색 input 엔터 시에도 검색
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // 검색 결과 필터
  const filteredUsers = userList.filter((u: any) => {
    if (!searchTriggered || !userSearch.trim()) return true;
    const q = userSearch.trim().toLowerCase();
    return (
      (u.user_name && u.user_name.toLowerCase().includes(q)) ||
      (u.user_phonenum && u.user_phonenum.includes(q)) ||
      (u.user_email && u.user_email.toLowerCase().includes(q))
    );
  });

  // 관리자로 등록 버튼 클릭 시
  const handleAdminRegister = (user: any) => {
    setSelectedUser(user);
    setIsAdminModalOpen(true);
  };

  // 실제 관리자 등록 API 호출
  const handleAdminSubmit = async (e: React.FormEvent, force = false) => {
    e.preventDefault();
    if (!selectedUser) return;
    const result = await putAdminUser(selectedUser.user_id, force);
    if (result.success) {
      alert('관리자로 등록되었습니다.');
      setIsAdminModalOpen(false);
      setSelectedUser(null);
      fetchAdmins(); // 관리자 목록 새로고침
    } else if (result.already_admin) {
      if (
        window.confirm(
          result.message ||
            '이미 관리자가 있습니다. 해당 사용자를 관리자로 변경하시겠습니까?'
        )
      ) {
        // 강제 변경
        await handleAdminSubmit(e, true);
      }
    } else {
      alert(result.message || '관리자 등록에 실패했습니다.');
    }
  };

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>관리자 계정 관리</h1>
          <AddButton onClick={handleCreateClick}>+</AddButton>
        </PageHeader>

        {/* 회사 선택 모달 */}
        {isCompanyModalOpen && (
          <ModalBg>
            <ModalBox>
              <h2>회사 선택</h2>
              <ul
                style={{
                  maxHeight: 300,
                  overflowY: 'auto',
                  margin: 0,
                  padding: 0,
                }}
              >
                {companyList.map((c) => (
                  <li
                    key={c.company_id}
                    style={{
                      padding: 12,
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleCompanySelect(c)}
                  >
                    {c.company_name}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 16,
                }}
              >
                <PopupButton
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                  style={{
                    background: '#eee',
                    color: '#351745',
                    fontWeight: 600,
                  }}
                >
                  닫기
                </PopupButton>
              </div>
            </ModalBox>
          </ModalBg>
        )}

        {/* 사용자 목록/검색 UI */}
        {selectedCompany && !isAdminModalOpen && (
          <ModalBg>
            <ModalBox>
              <h2>사용자 선택 - {selectedCompany.company_name}</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="이름, 전화번호, 이메일로 검색"
                  value={userSearchInput}
                  onChange={(e) => setUserSearchInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  style={{
                    flex: 1,
                    padding: 8,
                    fontSize: 16,
                    borderRadius: 8,
                    border: '1.5px solid #ccc',
                  }}
                />
                <PopupButton type="button" onClick={handleSearch}>
                  검색
                </PopupButton>
              </div>
              <ul
                style={{
                  maxHeight: 300,
                  overflowY: 'auto',
                  margin: 0,
                  padding: 0,
                }}
              >
                {filteredUsers.length === 0 && (
                  <li style={{ color: '#888' }}>검색 결과가 없습니다.</li>
                )}
                {filteredUsers.map((u: any) => (
                  <UserListItem
                    onClick={() => handleAdminRegister(u)}
                    key={u.user_id}
                  >
                    <span>
                      {u.user_name} ({u.user_email}, {u.user_phonenum})
                    </span>
                  </UserListItem>
                ))}
              </ul>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <PopupButton
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  style={{
                    background: '#eee',
                    color: '#351745',
                    fontWeight: 600,
                  }}
                >
                  뒤로가기
                </PopupButton>
                <PopupButton
                  type="button"
                  onClick={() => {
                    setSelectedCompany(null);
                    setIsCompanyModalOpen(false);
                  }}
                  style={{
                    background: '#eee',
                    color: '#351745',
                    fontWeight: 600,
                  }}
                >
                  닫기
                </PopupButton>
              </div>
            </ModalBox>
          </ModalBg>
        )}

        {/* 관리자 등록 모달 */}
        {isAdminModalOpen && selectedUser && (
          <NewAdmin
            visible={isAdminModalOpen}
            onClose={() => {
              setIsAdminModalOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={handleAdminSubmit}
            formData={{
              user_id: selectedUser.user_id,
              user_name: selectedUser.user_name,
              user_email: selectedUser.user_email,
              user_phonenum: selectedUser.user_phonenum,
              company_name: selectedCompany?.company_name || '',
            }}
          />
        )}

        {/* 기존 관리자 목록 테이블 */}
        <Table>
          <thead>
            <tr>
              <TableHeader onClick={() => handleSort('user_id')}>
                USER ID
                <SortIcon
                  $direction={
                    sortState.field === 'user_id' ? sortState.direction : null
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
              <TableHeader onClick={() => handleSort('user_email')}>
                이메일 주소
                <SortIcon
                  $direction={
                    sortState.field === 'user_email'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('user_phonenum')}>
                연락처
                <SortIcon
                  $direction={
                    sortState.field === 'user_phonenum'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('company_name')}>
                회사명
                <SortIcon
                  $direction={
                    sortState.field === 'company_name'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedAdmins.map((admin) => (
              <tr key={admin.user_id} style={{ cursor: 'pointer' }}>
                <td>{admin.user_id}</td>
                <td>{admin.user_name}</td>
                <td>{admin.user_email}</td>
                <td>{admin.user_phonenum}</td>
                <td>{admin.company_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </MainContent>
    </Container>
  );
};

// 모달 스타일
const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalBox = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(80, 0, 80, 0.12);
  padding: 36px 32px 28px 32px;
  min-width: 340px;
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

export default AdminAdmin;
