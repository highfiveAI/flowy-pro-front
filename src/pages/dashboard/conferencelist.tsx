import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { checkAuth } from '../../api/fetchAuthCheck';
import { useAuth } from '../../contexts/AuthContext';
import { fetchMeetingsWithUsers } from '../../api/fetchProject';

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
      <Breadcrumb>프로젝트 목록 {'>'} 회의 목록</Breadcrumb>
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
              <Tr key={i} onClick={() => navigate(`/dashboard/${c.meeting_id}`)}>
                <Td>{c.meeting_title}</Td>
                <Td>
                  {new Date(c.meeting_date)
                    .toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })
                    .replace('T', ' ')
                    .slice(0, 16)}
                </Td>
                <Td>
                  {/* meeting_users 안의 user 이름 나열 */}
                  {c.meeting_users
                    .map((mu: any) => mu.user.user_name)
                    .join(', ')}
                </Td>
                <Td>
                  <IconBtn>
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
  transition: all 0.2s ease;
  
  &:hover {
    background: #4b2067;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(80, 0, 80, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;
