import React, { useState, useEffect } from 'react';
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

interface Position {
  position_id: string;
  position_code: string;
  position_name: string;
  position_detail: string;
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

const AdminPosition: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
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

  // 직급 목록 조회
  const fetchPositions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/`
      );
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error('직급 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/positions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        fetchPositions();
        setFormData({
          position_code: '',
          position_name: '',
          position_detail: '',
        });
      }
    } catch (error) {
      console.error('직급 생성 실패:', error);
    }
  };

  // 직급 수정
  const handleUpdate = async (positionId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/${positionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        fetchPositions();
        setSelectedPositionId(null);
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

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>직급 관리</h1>
          <CreateButton onClick={() => setIsCreateModalOpen(true)}>
            + 새 직급 등록
          </CreateButton>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <th>직급 코드</th>
              <th>직급명</th>
              <th>레벨</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
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
        <Modal $isOpen={isCreateModalOpen}>
          <ModalContent>
            <ModalHeader>
              <h2>새 직급 등록</h2>
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
                <label>직급 코드</label>
                <input
                  type="text"
                  name="position_code"
                  value={formData.position_code}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>직급명</label>
                <input
                  type="text"
                  name="position_name"
                  value={formData.position_name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>레벨</label>
                <input
                  type="text"
                  name="position_detail"
                  value={formData.position_detail}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit">등록</Button>
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
        <Modal $isOpen={isEditModalOpen}>
          <ModalContent>
            <ModalHeader>
              <h2>직급 정보 수정</h2>
              <CloseButton onClick={() => setIsEditModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedPositionId) {
                  handleUpdate(selectedPositionId);
                  setIsEditModalOpen(false);
                }
              }}
            >
              <FormGroup>
                <label>직급 코드</label>
                <input
                  type="text"
                  name="position_code"
                  value={formData.position_code}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>직급명</label>
                <input
                  type="text"
                  name="position_name"
                  value={formData.position_name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>레벨</label>
                <input
                  type="text"
                  name="position_detail"
                  value={formData.position_detail}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit">수정</Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => {
                    if (selectedPositionId) {
                      handleDelete(selectedPositionId);
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

export default AdminPosition;
