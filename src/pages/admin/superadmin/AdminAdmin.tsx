import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const AdminAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const navigate = useNavigate();

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
        navigate('/')
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
  //         admin_id: '',
  //         admin_name: '',
  //         admin_email: '',
  //         admin_phone: '',
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

  // const handleCreateClick = () => {
  //   setFormData({
  //     admin_id: '',
  //     admin_name: '',
  //     admin_email: '',
  //     admin_phone: '',
  //     company_name: '',
  //     is_active: true,
  //   });
  //   setIsCreateModalOpen(true);
  // };

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

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>관리자 계정 관리</h1>
          <AddButton onClick={/*handleCreateClick*/ () => console.log('dummy')}>
            +
          </AddButton>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <TableHeader onClick={() => handleSort('user_id')}>
                USER ID
                {/* <SortIcon
                  $direction={
                     sortState.field === 'admin_id' ? sortState.direction : null */}
                <SortIcon
                  $direction={
                    sortState.field === 'user_id' ? sortState.direction : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('user_name')}>
                이름
                {/* <SortIcon
                   $direction={
                     sortState.field === 'admin_name'
                       ? sortState.direction
                       : null
                   } */}
                <SortIcon
                  $direction={
                    sortState.field === 'user_name' ? sortState.direction : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('user_email')}>
                이메일 주소
                {/* <SortIcon
                  $direction={
                     sortState.field === 'admin_email'
                       ? sortState.direction
                       : null
                   }
                 /> */}
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
                {/* <SortIcon
                  $direction={
                    sortState.field === 'admin_phone'
                      ? sortState.direction
                      : null
                  }
                /> */}
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
              //               <tr
              //                 key={admin.admin_id}
              //                 onClick={() => handleRowClick(admin)}
              //                 style={{ cursor: 'pointer' }}
              //               >
              //                 <td>{admin.admin_id}</td>
              //                 <td>{admin.admin_name}</td>
              //                 <td>{admin.admin_email}</td>
              //                 <td>{admin.admin_phone}</td>

              <tr
                key={admin.user_id}
                onClick={() => /*handleRowClick(admin)*/ console.log('dummy')}
                style={{ cursor: 'pointer' }}
              >
                <td>{admin.user_id}</td>
                <td>{admin.user_name}</td>
                <td>{admin.user_email}</td>
                <td>{admin.user_phonenum}</td>

                <td>{admin.company_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* 생성 모달
        <NewAdmin
          visible={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleInputChange}
        /> */}

        {/* 수정 모달
        <EditAdmin
          visible={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={
            selectedAdminId
              ? async (e) => {
                  e.preventDefault();
                  await handleUpdate(selectedAdminId);
                }
              : () => {}
          }
          formData={formData}
          onChange={handleInputChange}
        /> */}
      </MainContent>
    </Container>
  );
};

export default AdminAdmin;
