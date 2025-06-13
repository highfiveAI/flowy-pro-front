import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { checkAuth } from "../../api/fetchAuthCheck";
import { useAuth } from "../../contexts/AuthContext";
import { fetchMeetingsWithUsers } from "../../api/fetchProject";

const dummyConferences = Array.from({ length: 10 }).map((/*_, i*/) => ({
  name: "기능 정의 kick-off",
  date: "2025-06-03 10:00",
  attendees: "김다연, 김시훈, 정다희, ...",
}));

const ConferenceListPage: React.FC = () => {
  const { user, setUser, setLoading } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const navigate = useNavigate();

  const { projectId } = useParams<{ projectId: string }>();

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
      <Title>회의 관리</Title>
      <Breadcrumb>프로젝트 목록 {">"} 회의 목록</Breadcrumb>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>회의명</Th>
              <Th>회의 일시</Th>
              <Th>참석자</Th>
              <Th style={{ width: 60 }}></Th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((c, i) => (
              <Tr key={i}>
                <Td>{c.meeting_title}</Td>
                <Td>
                  {new Date(c.meeting_date)
                    .toISOString()
                    .replace("T", " ")
                    .slice(0, 16)}
                </Td>
                <Td>
                  {/* meeting_users 안의 user 이름 나열 */}
                  {c.meeting_users.map((mu) => mu.user.user_name).join(", ")}
                </Td>
                <Td>
                  <IconBtn onClick={() => navigate("/dashboard")}>
                    <FiArrowRight />
                  </IconBtn>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default ConferenceListPage;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 0 0 0;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #4b2067;
  margin-bottom: 40px;
`;
const Breadcrumb = styled.div`
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 24px;
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
`;
const Td = styled.td`
  font-size: 1rem;
  color: #333;
  padding: 16px 0;
`;
const IconBtn = styled.button`
  background: #351745;
  border: none;
  border-radius: 50%;
  padding: 6px 8px;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:hover {
    background: #4b2067;
  }
`;
