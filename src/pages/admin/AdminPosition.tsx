import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import NewPosition from './popup/newposition';
import EditPosition from './popup/editposition';

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

// const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
//   padding: 0.5rem 1rem;
//   border-radius: 4px;
//   border: none;
//   cursor: pointer;
//   margin-right: 0.5rem;
//   background-color: ${(props) =>
//     props.variant === 'danger' ? '#dc3545' : '#007bff'};
//   color: white;
//   &:hover {
//     opacity: 0.9;
//   }
// `;

// const Form = styled.form`
//   background-color: white;
//   padding: 2rem;
//   border-radius: 8px;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//   margin-bottom: 2rem;
// `;

// const FormGroup = styled.div`
//   margin-bottom: 1rem;

//   label {
//     display: block;
//     margin-bottom: 0.5rem;
//     font-weight: 500;
//   }

//   input {
//     width: 100%;
//     padding: 0.5rem;
//     border: 1px solid #ddd;
//     border-radius: 4px;
//     font-size: 1rem;

//     &:focus {
//       outline: none;
//       border-color: #007bff;
//     }
//   }
// `;

interface Position {
  position_id: string;
  position_code: string;
  position_name: string;
  position_detail: string;
  position_company_id: string;
}

interface Company {
  company_id: string;
  company_name: string;
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
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.08);
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #4b2067;
  }
`;

// 정렬 방향을 위한 타입
type SortDirection = 'asc' | 'desc' | null;

// 정렬 상태를 위한 인터페이스
interface SortState {
  field: string;
  direction: SortDirection;
}

// 테이블 헤더 스타일 컴포넌트
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
      ${(props) => (props.$direction === 'asc' ? '#47096A' : '#cbd5e1')};
    margin-bottom: 2px;
  }

  &::after {
    border-top: 4px solid
      ${(props) => (props.$direction === 'desc' ? '#47096A' : '#cbd5e1')};
  }
`;

const AdminPosition: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentUserCompany, setCurrentUserCompany] = useState<Company | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    position_code: '',
    position_name: '',
    position_detail: '',
  });

  // 정렬 상태 추가
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null,
  });

  // 현재 로그인한 사용자의 정보 가져오기
  const fetchCurrentUser = async () => {
    try {
      console.log('사용자 정보 요청 시작');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/one`,
        {
          credentials: 'include',
        }
      );
      console.log('사용자 정보 응답:', response.status);
      if (!response.ok) {
        throw new Error('사용자 정보 조회에 실패했습니다.');
      }
      const data = await response.json();
      console.log('받아온 사용자 데이터:', data);
      if (data.user_company_id) {
        setCurrentUserCompany({
          company_id: data.user_company_id,
          company_name: data.company_name || '',
        });
        console.log('설정된 회사 정보:', {
          company_id: data.user_company_id,
          company_name: data.company_name,
        });
      }
    } catch (error) {
      console.error('현재 사용자 정보 조회 실패:', error);
    }
  };

  // 직급 목록 조회
  const fetchPositions = async () => {
    try {
      console.log('직급 목록 요청 시작');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/`,
        {
          credentials: 'include',
        }
      );
      console.log('직급 목록 응답:', response.status);
      const data = await response.json();
      console.log('받아온 직급 데이터:', data);
      setPositions(data);
    } catch (error) {
      console.error('직급 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchPositions();
  }, []);

  // 입력 폼 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 직급 생성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserCompany) {
      console.error('회사 정보가 없습니다.');
      return;
    }

    try {
      const positionData = {
        ...formData,
        position_company_id: currentUserCompany.company_id,
      };
      console.log('생성할 직급 데이터:', positionData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(positionData),
        }
      );
      if (response.ok) {
        fetchPositions();
        setFormData({
          position_code: '',
          position_name: '',
          position_detail: '',
        });
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('직급 생성 실패:', error);
    }
  };

  // 직급 수정
  const handleUpdate = async (positionId: string) => {
    if (!currentUserCompany) {
      console.error('회사 정보가 없습니다.');
      return;
    }

    try {
      const positionData = {
        ...formData,
        position_company_id: currentUserCompany.company_id,
      };
      console.log('수정할 직급 데이터:', positionData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/${positionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(positionData),
        }
      );
      if (response.ok) {
        fetchPositions();
        setSelectedPositionId(null);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('직급 수정 실패:', error);
    }
  };

  // 직급 삭제
  const handleDelete = async (positionId: string) => {
    if (window.confirm('정말로 이 직급을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/admin/positions/${positionId}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );
        if (response.ok) {
          fetchPositions();
        }
      } catch (error) {
        console.error('직급 삭제 실패:', error);
      }
    }
  };

  const handleRowClick = (position: Position) => {
    setSelectedPositionId(position.position_id);
    setFormData({
      position_code: position.position_code,
      position_name: position.position_name,
      position_detail: position.position_detail,
    });
    setIsEditModalOpen(true);
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

  // 정렬된 직급 목록 계산 (회사별 필터링 추가)
  const sortedPositions = useMemo(() => {
    let sorted = [...positions];
    console.log('정렬 전 전체 직급:', sorted);
    console.log('현재 회사 정보:', currentUserCompany);

    // 현재 사용자의 회사에 속한 직급만 필터링
    if (currentUserCompany) {
      sorted = sorted.filter((position) => {
        console.log('직급의 회사 ID:', position.position_company_id);
        console.log('현재 회사 ID:', currentUserCompany.company_id);
        return position.position_company_id === currentUserCompany.company_id;
      });
    }
    console.log('필터링 후 직급:', sorted);

    if (sortState.direction !== null) {
      sorted.sort((a, b) => {
        const aValue = String(a[sortState.field as keyof Position] || '');
        const bValue = String(b[sortState.field as keyof Position] || '');

        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }
    console.log('최종 정렬된 직급:', sorted);
    return sorted;
  }, [positions, sortState, currentUserCompany]);

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>직급 관리</h1>
          <AddButton onClick={() => setIsCreateModalOpen(true)}>+</AddButton>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <TableHeader onClick={() => handleSort('position_code')}>
                직급 코드
                <SortIcon
                  $direction={
                    sortState.field === 'position_code'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('position_name')}>
                직급명
                <SortIcon
                  $direction={
                    sortState.field === 'position_name'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('position_detail')}>
                직급 설명
                <SortIcon
                  $direction={
                    sortState.field === 'position_detail'
                      ? sortState.direction
                      : null
                  }
                />
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedPositions.map((position) => (
              <tr
                key={position.position_id}
                onClick={() => handleRowClick(position)}
                style={{ cursor: 'pointer' }}
              >
                <td>{position.position_code}</td>
                <td>{position.position_name}</td>
                <td>{position.position_detail}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* 생성 모달 */}
        <NewPosition
          isOpen={isCreateModalOpen}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            setIsCreateModalOpen(false);
          }}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* 수정 모달 */}
        <EditPosition
          visible={isEditModalOpen}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedPositionId) {
              handleUpdate(selectedPositionId);
              setIsEditModalOpen(false);
            }
          }}
          onDelete={() => {
            if (selectedPositionId) {
              handleDelete(selectedPositionId);
              setIsEditModalOpen(false);
            }
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      </MainContent>
    </Container>
  );
};

export default AdminPosition;
