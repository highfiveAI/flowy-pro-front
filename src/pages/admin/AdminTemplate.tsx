import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  min-width: 120px;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
`;

const TemplateCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const TemplatePreview = styled.div`
  height: 150px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
`;

const TemplateInfo = styled.div`
  padding: 1rem;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }

  .date {
    font-size: 0.875rem;
    color: #666;
    margin-top: 0.5rem;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-top: 1px solid #eee;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
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

const Button = styled.button<{ variant?: 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  background-color: ${(props) =>
    props.variant === 'danger' ? '#dc3545' : '#007bff'};
  color: white;

  &:hover {
    background-color: ${(props) =>
      props.variant === 'danger' ? '#c82333' : '#0056b3'};
  }
`;

interface Template {
  interdocs_id: string;
  interdocs_type_name: string;
  interdocs_filename: string;
  interdocs_contents: string;
  interdocs_path: string;
  interdocs_uploaded_date: string;
  interdocs_updated_date?: string;
  interdocs_update_user_id: string;
}

// 파일 확장자에 따른 이미지 경로를 반환하는 함수
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'docx':
      return '/images/word.png'; // 슬래시(/)로 시작하는 절대 경로
    case 'xlsx':
      return '/images/excel.png'; // 슬래시(/)로 시작하는 절대 경로
    default:
      return '/images/file.png'; // 기본 아이콘
  }
};

const AdminTemplate: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('HDX');
  const [selectedOrder, setSelectedOrder] = useState('최신순');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createDocType, setCreateDocType] = useState<string>('');
  const [editDocType, setEditDocType] = useState<string>('');

  // 템플릿 목록 조회
  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/docs/`
      );
      if (!response.ok) {
        throw new Error('템플릿 목록 조회에 실패했습니다.');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('템플릿 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 템플릿 생성
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('doc_type', createDocType);
    formData.append('update_user_id', '7f2d2784-b12b-4b8d-a9fc-3857e52f9e96');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/docs/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '템플릿 생성에 실패했습니다.');
      }

      await fetchTemplates();
      setIsCreateModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('템플릿 생성 실패:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('템플릿 생성에 실패했습니다.');
      }
    }
  };

  // 템플릿 수정
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedTemplate) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('doc_type', editDocType);
    formData.append('update_user_id', '7f2d2784-b12b-4b8d-a9fc-3857e52f9e96');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/docs/${
          selectedTemplate.interdocs_id
        }`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '템플릿 수정에 실패했습니다.');
      }

      await fetchTemplates();
      setIsEditModalOpen(false);
      setSelectedTemplate(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('템플릿 수정 실패:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('템플릿 수정에 실패했습니다.');
      }
    }
  };

  // 템플릿 삭제
  const handleDelete = async (templateId: string) => {
    if (window.confirm('정말로 이 템플릿을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/docs/${templateId}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || '템플릿 삭제에 실패했습니다.');
        }

        await fetchTemplates();
        setIsEditModalOpen(false);
        setSelectedTemplate(null);
      } catch (error) {
        console.error('템플릿 삭제 실패:', error);
        alert(
          error instanceof Error ? error.message : '템플릿 삭제에 실패했습니다.'
        );
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>템플릿 관리</h1>
          <CreateButton onClick={() => setIsCreateModalOpen(true)}>
            + 템플릿 추가하기
          </CreateButton>
        </PageHeader>

        <FilterSection>
          <FilterSelect
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="HDX">HDX</option>
          </FilterSelect>

          <FilterSelect
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option value="최신순">최신순</option>
          </FilterSelect>
        </FilterSection>

        <TemplateGrid>
          {templates.map((template) => (
            <TemplateCard
              key={template.interdocs_id}
              onClick={() => {
                setSelectedTemplate(template);
                setIsEditModalOpen(true);
              }}
            >
              <TemplatePreview>
                <img
                  src={getFileIcon(template.interdocs_filename)}
                  alt="File icon"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain', // 이미지 비율 유지
                  }}
                />
              </TemplatePreview>
              <TemplateInfo>
                <h3>{template.interdocs_filename}</h3>
                <div className="date">
                  {new Date(
                    template.interdocs_uploaded_date
                  ).toLocaleDateString()}
                </div>
              </TemplateInfo>
              <CardActions>
                <ActionButton>✓ 선택</ActionButton>
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(template.interdocs_path, '_blank');
                  }}
                >
                  ⬇ 다운로드
                </ActionButton>
              </CardActions>
            </TemplateCard>
          ))}
        </TemplateGrid>

        {/* 생성 모달 */}
        <Modal $isOpen={isCreateModalOpen}>
          <ModalContent>
            <ModalHeader>
              <h2>새 템플릿 추가</h2>
              <CloseButton onClick={() => setIsCreateModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <form onSubmit={handleCreate}>
              <FormGroup>
                <label>문서 타입</label>
                <input
                    type="text"
                    value={createDocType}
                    onChange={(e) => setCreateDocType(e.target.value)}
                    required
                    placeholder="문서 타입을 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <label>템플릿 파일</label>
                <input type="file" onChange={handleFileChange} required />
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
            </form>
          </ModalContent>
        </Modal>

        {/* 수정 모달 */}
        <Modal $isOpen={isEditModalOpen}>
          <ModalContent>
            <ModalHeader>
              <h2>템플릿 수정</h2>
              <CloseButton onClick={() => setIsEditModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <form onSubmit={handleUpdate}>
              <FormGroup>
                <label>문서 타입</label>
                <input
                    type="text"
                    value={editDocType}
                    onChange={(e) => setEditDocType(e.target.value)}
                    required
                    placeholder="문서 타입을 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <label>템플릿 파일</label>
                <input type="file" onChange={handleFileChange} required />
              </FormGroup>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit">수정</Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() =>
                    selectedTemplate &&
                    handleDelete(selectedTemplate.interdocs_id)
                  }
                >
                  삭제
                </Button>
                <Button type="button" onClick={() => setIsEditModalOpen(false)}>
                  취소
                </Button>
              </div>
            </form>
          </ModalContent>
        </Modal>
      </MainContent>
    </Container>
  );
};

export default AdminTemplate;
