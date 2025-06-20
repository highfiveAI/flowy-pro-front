import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
  deleteProject,
  fetchProject,
  updateProjectName,
} from '../../api/fetchProject';
import type { ProjectUser, ProjectResponse } from '../../types/project';
import { checkAuth } from '../../api/fetchAuthCheck';
import { useAuth } from '../../contexts/AuthContext';
import EditProjectPopup from '../insert_conference_info/conference_popup/EditProjectPopup';
import NewProjectPopup from '../insert_conference_info/conference_popup/NewProjectPopup';

const ProjectListPage: React.FC = () => {
  // const { user } = useAuth();
  // const [projects, setProjects] = React.useState<Project[]>([]);
  // // user.id로 프로젝트 목록 불러오기
  // React.useEffect(() => {
  //   if (!user?.id) return;
  //   fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/projects/${user.id}`, {
  //     credentials: 'include',
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('token')}`
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.projects) {
  //         setProjects(data.projects);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('프로젝트 목록을 불러오는데 실패했습니다:', error);
  //     });
  // }, [user?.id]);

  const navigate = useNavigate();

  const { user, setUser, setLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectUser[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  // 프로젝트 수정 팝업 상태
  const [showEditProjectPopup, setShowEditProjectPopup] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);

  // 새 프로젝트 생성 팝업 상태
  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchProject(user?.id).then((data) => {
        if (data) {
          setProjects(data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (user) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      alert('삭제 성공');
      if (user?.id) {
        fetchProject(user?.id).then((data) => {
          if (data) {
            setProjects(data);
          }
        });
      }

      // 필요 시 상태 갱신 또는 리디렉션
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const handleEdit = (project: ProjectUser) => {
    // ProjectUser를 ProjectResponse 형태로 변환
    const projectResponse: ProjectResponse = {
      projectId: project.project.project_id,
      projectName: project.project.project_name,
      projectDetail: project.project.project_detail || '',
      projectCreatedDate: project.project.project_created_date,
    };
    setEditingProject(projectResponse);
    setShowEditProjectPopup(true);
  };

  const closeEditPopup = () => {
    setEditingProject(null);
    setShowEditProjectPopup(false);
    // 수정 후 목록 새로고침
    if (user?.id) {
      fetchProject(user.id).then((data) => {
        if (data) {
          setProjects(data);
        }
      });
    }
  };

  const handleEditSave = async (id: string) => {
    try {
      // 여기에 실제 API 호출 함수 작성 (예시)
      // await updateProjectName(id, editName);
      await updateProjectName(id, editName);
      alert('수정 완료');
      setEditId(null);

      // 데이터 새로고침
      if (user?.id) {
        const data = await fetchProject(user.id);
        if (data) setProjects(data);
      }
    } catch (err) {
      alert('수정 실패');
    }
  };

  const closeNewProjectPopup = () => {
    setShowNewProjectPopup(false);
    // 새 프로젝트 생성 후 목록 새로고침
    if (user?.id) {
      fetchProject(user.id).then((data) => {
        if (data) {
          setProjects(data);
        }
      });
    }
  };

  return (
    <Container>
      <Title>회의 관리</Title>
      <SectionHeader>
        <SectionTitle>프로젝트 목록</SectionTitle>
        <AddButton onClick={() => setShowNewProjectPopup(true)}>
          <FiPlus />
        </AddButton>
      </SectionHeader>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>프로젝트명</Th>
              <Th>생성일</Th>
              <Th>종료일</Th>
              <Th style={{ width: 80 }}></Th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <Tr key={i} onClick={() => navigate(`/conferencelist/${p.project.project_id}`)}>
                <Td>
                  {editId === p.project.project_id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter')
                          handleEditSave(p.project.project_id);
                        if (e.key === 'Escape') setEditId(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    p.project.project_name
                  )}
                </Td>
                <Td>
                  {new Date(p.project.project_created_date)
                    .toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })
                    .replace('T', ' ')
                    .slice(0, 16)}
                </Td>
                <Td>
                  {p.project.project_end_date
                    ? new Date(p.project.project_end_date)
                        .toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })
                        .replace('T', ' ')
                        .slice(0, 16)
                    : '미정'}
                </Td>
                <Td>
                  <IconGroup>
                    {editId === p.project.project_id ? (
                      <>
                        <IconBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSave(p.project.project_id);
                          }}
                        >
                          저장
                        </IconBtn>
                        <IconBtn onClick={(e) => {
                          e.stopPropagation();
                          setEditId(null);
                        }}>취소</IconBtn>
                      </>
                    ) : (
                      <>
                        <IconBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(p);
                          }}
                        >
                          <FiEdit2 />
                        </IconBtn>
                        <IconBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.project.project_id);
                          }}
                        >
                          <FiTrash2 />
                        </IconBtn>
                      </>
                    )}
                  </IconGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
      {showEditProjectPopup && editingProject && (
        <EditProjectPopup
          onClose={closeEditPopup}
          projectToEdit={editingProject}
        />
      )}
      {showNewProjectPopup && (
        <NewProjectPopup onClose={closeNewProjectPopup} />
      )}
    </Container>
  );
};

export default ProjectListPage;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 0 0 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const AddButton = styled.button`
  background: #351745;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.2);
  
  &:hover {
    background: #4b2067;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(80, 0, 80, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #4b2067;
  margin-bottom: 40px;
`;
const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 18px;
`;
const TableWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.04);
  padding: 32px 24px 24px 24px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  text-align: left;
  font-size: 1rem;
  color: #7b5fa1;
  font-weight: 600;
  padding: 8px 0 12px 0;
  border-bottom: 1px solid #e5e0ee;
`;
const Tr = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #f2f2f2;
  }
  
  /* 호버 효과 추가 */
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: #f8f5ff;
    transform: scale(1.01);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.1);
  }
  
  /* 선택된 상태 */
  &.selected {
    background-color: #e5e0ee;
    border-left: 4px solid #4b2067;
  }
  
  &.selected:hover {
    background-color: #d4c7e8;
  }
`;
const Td = styled.td`
  font-size: 1rem;
  color: #333;
  padding: 16px 0;
  
  /* 셀 호버 효과 */
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f3eef7;
  }
`;
const IconBtn = styled.button`
  background: #f3eef7;
  border: none;
  border-radius: 6px;
  padding: 6px 8px;
  margin-right: 6px;
  color: #7b5fa1;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e5e0ee;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.15);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;
const IconGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 200px;
`;
