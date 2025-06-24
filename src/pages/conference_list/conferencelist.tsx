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

  // 검색어에 따른 회의 필터링
  const filteredMeetings = meetings.filter((meeting) =>
    meeting.meeting_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredMeetings.map((c, i) => (
              <Tr
                key={i}
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
      </TableWrapper>
    </Container>
  );
};

export default ConferenceListPage;
