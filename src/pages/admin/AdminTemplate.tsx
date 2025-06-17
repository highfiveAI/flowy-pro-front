import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EditTemplateModal from './popup/edittemp';
import NewTemplateModal from './popup/newtemp';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
`;

const MainContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 2.5rem 2rem 2rem 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #4b1864;
    margin: 0;
  }
`;

// const TopBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;
// `;

const AddTemplateBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  border: 1px solid #4b1864;
  color: #4b1864;
  font-weight: 500;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  transition: background 0.15s;
  &:hover {
    background: rgb(231, 216, 243);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FilterLabel = styled.label`
  font-size: 1rem;
  color: #4b1864;
  font-weight: 500;
  margin-right: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1.5rem 0.5rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  min-width: 120px;
  font-size: 1rem;
  color: #4b1864;
  background: #fff;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem 1.5rem;
`;

const TemplateCard = styled.div`
  background: #faf8fb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(75, 24, 100, 0.04);
  position: relative;
  padding: 1.5rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 210px;
`;

const CardActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: #f3eaf7;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  color: #4b1864;
  font-size: 1rem;
  transition: background 0.15s;
  &:hover {
    background: #e2d0ee;
  }
`;

const TemplatePreview = styled.div`
  width: 110px;
  height: 110px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 1px solid #eee;
`;

const TemplateInfo = styled.div`
  text-align: center;
  width: 100%;
  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    color: #4b1864;
    font-weight: 600;
    word-break: break-all;
  }
  .type {
    font-size: 0.95rem;
    color: #7d5a99;
    margin-bottom: 0.25rem;
  }
  .date {
    font-size: 0.85rem;
    color: #b1a1c7;
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
//   padding: 2rem;
//   border-radius: 8px;
//   width: 100%;
//   max-width: 600px;
//   max-height: 80vh;
//   overflow-y: auto;
// `;

// const ModalHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;

//   h2 {
//     margin: 0;
//     font-size: 1.5rem;
//   }
// `;

const CloseButton = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.6rem;
  background: none;
  border: none;
  color: #5a2172;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  &:hover {
    color: #351745;
  }
`;

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

// const Button = styled.button<{ variant?: 'danger' }>`
//   padding: 0.5rem 1rem;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-weight: 500;
//   background-color: ${(props) =>
//     props.variant === 'danger' ? '#dc3545' : '#007bff'};
//   color: white;

//   &:hover {
//     background-color: ${(props) =>
//       props.variant === 'danger' ? '#c82333' : '#0056b3'};
//   }
// `;

const DeleteModal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.18);
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const DeleteModalContent = styled.div`
  background: #fff;
  border: 1px solid #351745;
  border-radius: 50px;
  box-shadow: 4px 0px 4px 0px rgba(75, 13, 110, 0.21);
  padding: 3.2rem 1.6rem 2.4rem 1.6rem;
  min-width: 384px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DeleteTitle = styled.div`
  color: #5a2172;
  font-size: 1.6rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
`;

const DeleteDesc = styled.div`
  color: #222;
  font-size: 0.92rem;
  text-align: center;
  margin-bottom: 2.8rem;
`;

const DeleteButton = styled.button`
  background: #5a2172;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 0;
  width: 80%;
  box-shadow: 0 4px 16px 0 rgba(90, 33, 114, 0.18);
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #3d1450;
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
  const [selectedOrder, setSelectedOrder] = useState('최신순');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createDocType, setCreateDocType] = useState<string>('');
  const [editDocType, setEditDocType] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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
        `${import.meta.env.VITE_API_URL}/api/v1/docs/${selectedTemplate.interdocs_id
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

  // 파일 다운로드
  const handleDownload = async (
    e: React.MouseEvent,
    interdocs_id: string
  ) => {
    e.stopPropagation();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/docs/download/${interdocs_id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('다운로드 링크 요청 실패');
      }

      // 백엔드에서 { download_url: "..." } 형태로 응답한다고 가정
      const { download_url } = await response.json();

      // 새 창으로 다운로드 링크 열기 (혹은 a 태그로 다운로드)
      window.open(download_url, '_blank');
      // 또는
      // const a = document.createElement('a');
      // a.href = download_url;
      // a.download = ''; // 파일명 지정 필요시 백엔드에서 Content-Disposition 헤더로 처리
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
    } catch (error) {
      alert('다운로드에 실패했습니다.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTemplate(null);
    setSelectedFile(null);
    setEditDocType('');
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedFile(null);
    setCreateDocType('');
  };

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <div style={{display:'flex',alignItems:'center'}}>
          <h1>템플릿 관리</h1>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '1rem',
            }}
          >
            <AddTemplateBtn onClick={() => setIsCreateModalOpen(true)}>
              <img
                src="/images/addtemps.svg"
                alt="add"
                style={{ width: 22, height: 22, marginRight: 6 }}
              />
              템플릿 추가하기
            </AddTemplateBtn>
            <FilterGroup>
              <FilterLabel htmlFor="order">정렬 기준</FilterLabel>
          <FilterSelect
                id="order"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option value="최신순">최신순</option>
          </FilterSelect>
            </FilterGroup>
          </div>
        </PageHeader>
        <TemplateGrid>
          {templates.map((template) => (
            <TemplateCard key={template.interdocs_id}>
              <CardActions>
                <ActionButton
                  title="수정"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template);
                    setEditDocType(template.interdocs_type_name);
                    setIsEditModalOpen(true);
                  }}
                >
                  <img
                    src="/images/edit.svg"
                    alt="edit"
                    style={{ width: 16, height: 16 }}
                  />
                </ActionButton>
                <ActionButton
                  title="다운로드"
                  onClick={(e) => handleDownload(e, template.interdocs_id)}
                >
                  <img
                    src="/images/download.svg"
                    alt="download"
                    style={{ width: 24, height: 24 }}
                  />
                </ActionButton>
                <ActionButton
                  title="삭제"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTargetId(template.interdocs_id);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <img
                    src="/images/trash.svg"
                    alt="delete"
                    style={{ width: 20, height: 20 }}
                  />
                </ActionButton>
              </CardActions>
              <TemplatePreview>
                <img
                  src={getFileIcon(template.interdocs_filename)}
                  alt="File icon"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                  }}
                />
              </TemplatePreview>
              <TemplateInfo>
                <h3>{template.interdocs_filename}</h3>
                <div className="type">{template.interdocs_type_name}</div>
                <div className="date">
                  {new Date(
                    template.interdocs_uploaded_date
                  ).toLocaleDateString()}
                </div>
              </TemplateInfo>
            </TemplateCard>
          ))}
        </TemplateGrid>

        {/* 생성 모달 */}
        <NewTemplateModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onCreate={handleCreate}
          createDocType={createDocType}
          setCreateDocType={setCreateDocType}
          handleFileChange={handleFileChange}
        />

        {/* 수정 모달 */}
        <EditTemplateModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={handleUpdate}
          onDelete={() =>
            selectedTemplate && handleDelete(selectedTemplate.interdocs_id)
          }
          selectedTemplate={selectedTemplate}
          editDocType={editDocType}
          setEditDocType={setEditDocType}
          handleFileChange={handleFileChange}
        />

        {/* 삭제 확인 모달 */}
        <DeleteModal $isOpen={isDeleteModalOpen}>
          <DeleteModalContent style={{ position: 'relative' }}>
            <CloseButton
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
              }}
            >
              ×
            </CloseButton>
            <DeleteTitle>정말 삭제하시겠습니까?</DeleteTitle>
            <DeleteDesc>삭제한 템플릿은 복원할 수 없습니다.</DeleteDesc>
            <DeleteButton
              onClick={async () => {
                if (deleteTargetId) {
                  await handleDelete(deleteTargetId);
                }
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
              }}
            >
              삭제
            </DeleteButton>
          </DeleteModalContent>
        </DeleteModal>
      </MainContent>
    </Container>
  );
};

export default AdminTemplate;
