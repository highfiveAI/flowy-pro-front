import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkAuth } from "../../api/fetchAuthCheck";
import { useAuth } from "../../contexts/AuthContext";
import { fetchMeetingsWithUsers } from "../../api/fetchProject";
import {
  Container,
  NoResultsMessage,
  SearchContainer,
  SearchInput,
  SectionTitle,
  SectionTitleLink,
  Table,
  TableHeader,
  TableWrapper,
  Td,
  Th,
  Title,
  Tr,
} from "./conferencelist.styles";

const ConferenceListPage: React.FC = () => {
  const { user, setUser, setLoading } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { projectId } = useParams<{ projectId: string }>();

  // 페이징 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // 검색어에 따른 회의 필터링
  const filteredMeetings = meetings.filter((meeting) =>
    meeting.meeting_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이징 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeetings = filteredMeetings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);

  // 페이지네이션 그룹 계산
  const pageGroupSize = 5;
  const pageGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = pageGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    if (projectId) {
      fetchMeetingsWithUsers(projectId).then((data) => {
        if (data) {
          console.log(data);
          setMeetings(data);
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

  return (
    <Container>
      <Title>분석결과 조회</Title>
      <SectionTitle>
        <SectionTitleLink onClick={() => navigate("/projectlist")}>
          프로젝트 목록
        </SectionTitleLink>
        {" > "}회의 목록
      </SectionTitle>
      <TableWrapper>
        <TableHeader>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="회의명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>회의명</Th>
              <Th>회의 일시</Th>
              <Th>참석자</Th>
            </tr>
          </thead>
          <tbody>
            {currentMeetings.map((c, i) => (
              <Tr
                key={i + indexOfFirstItem}
                onClick={() => navigate(`/dashboard/${c.meeting_id}`)}
              >
                <Td>{c.meeting_title}</Td>
                <Td>
                  {new Date(c.meeting_date)
                    .toISOString()
                    .replace("T", " ")
                    .slice(0, 16)}
                </Td>
                <Td>
                  {/* meeting_users 안의 user 이름 나열 */}
                  {c.meeting_users
                    .map((mu: any) => mu.user.user_name)
                    .join(", ")}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        {filteredMeetings.length === 0 && searchTerm && (
          <NoResultsMessage>검색 결과가 없습니다.</NoResultsMessage>
        )}
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
      </TableWrapper>
    </Container>
  );
};

export default ConferenceListPage;
