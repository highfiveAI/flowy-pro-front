import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  deleteProject,
  fetchProject,
  updateProjectName,
} from "../../api/fetchProject";
import type { ProjectUser, ProjectResponse } from "../../types/project";
import { checkAuth } from "../../api/fetchAuthCheck";
import { useAuth } from "../../contexts/AuthContext";
import EditProjectPopup from "../insert_conference_info/conference_popup/EditProjectPopup";
import NewProjectPopup from "../insert_conference_info/conference_popup/NewProjectPopup";
import {
  AddButton,
  Container,
  IconBtn,
  IconGroup,
  SectionHeader,
  SectionTitle,
  Table,
  TableWrapper,
  Td,
  Th,
  Title,
  Tr,
} from "./projectlist.styles";

const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();

  const { user, setUser, setLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectUser[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");

  // 프로젝트 수정 팝업 상태
  const [showEditProjectPopup, setShowEditProjectPopup] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(
    null
  );

  // 새 프로젝트 생성 팝업 상태
  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 현재 페이지에 보여줄 프로젝트 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // 페이지네이션 관련
  const pageGroupSize = 5;
  const pageGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = pageGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

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
      alert("삭제 성공");
      if (user?.id) {
        fetchProject(user?.id).then((data) => {
          if (data) {
            setProjects(data);
          }
        });
      }

      // 필요 시 상태 갱신 또는 리디렉션
    } catch (err) {
      alert("삭제 실패");
    }
  };

  const handleEdit = (project: ProjectUser) => {
    // ProjectUser를 ProjectResponse 형태로 변환
    const projectResponse: ProjectResponse = {
      projectId: project.project.project_id,
      projectName: project.project.project_name,
      projectDetail: project.project.project_detail || "",
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
      alert("수정 완료");
      setEditId(null);

      // 데이터 새로고침
      if (user?.id) {
        const data = await fetchProject(user.id);
        if (data) setProjects(data);
      }
    } catch (err) {
      alert("수정 실패");
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
      <Title>분석결과 조회</Title>
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
            {currentProjects.map((p, i) => (
              <Tr
                key={i + indexOfFirstItem}
                onClick={() =>
                  navigate(`/conferencelist/${p.project.project_id}`)
                }
              >
                <Td>
                  {editId === p.project.project_id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleEditSave(p.project.project_id);
                        if (e.key === "Escape") setEditId(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    p.project.project_name
                  )}
                </Td>
                <Td>
                  {new Date(p.project.project_created_date)
                    .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
                    .replace("T", " ")
                    .slice(0, 16)}
                </Td>
                <Td>
                  {p.project.project_end_date
                    ? new Date(p.project.project_end_date)
                        .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
                        .replace("T", " ")
                        .slice(0, 16)
                    : "미정"}
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
                        <IconBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditId(null);
                          }}
                        >
                          취소
                        </IconBtn>
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
      {/* 페이지네이션 */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20, gap: 4 }}>
        {startPage > 1 && (
          <button
            onClick={() => setCurrentPage(startPage - 1)}
            style={{
              padding: "0 10px",
              height: 32,
              minWidth: 32,
              borderRadius: 16,
              background: "#fff",
              color: "#2D1155",
              border: "none",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            이전
          </button>
        )}
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: currentPage === num ? "#351745" : "transparent",
              color: currentPage === num ? "#fff" : "#2D1155",
              border: "none",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {num}
          </button>
        ))}
        {endPage < totalPages && (
          <button
            onClick={() => setCurrentPage(endPage + 1)}
            style={{
              padding: "0 10px",
              height: 32,
              minWidth: 32,
              borderRadius: 16,
              background: "#fff",
              color: "#2D1155",
              border: "none",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            다음
          </button>
        )}
      </div>
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
