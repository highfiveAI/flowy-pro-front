import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { checkAuth } from '../../api/fetchAuthCheck';
import { useAuth } from '../../contexts/AuthContext';
import { fetchMeetingsWithUsers } from '../../api/fetchProject';

const ConferenceListPage: React.FC = () => {
  const { user, setUser, setLoading } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
      <Title>회의 관리</Title>
      <SectionTitle>
        <SectionTitleLink onClick={() => navigate('/projectlist')}>
          프로젝트 목록
        </SectionTitleLink>
        {' > '}회의 목록
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
              <Tr key={i} onClick={() => navigate(`/dashboard/${c.meeting_id}`)}>
                <Td>{c.meeting_title}</Td>
                <Td>
                  {new Date(c.meeting_date)
                    .toISOString()
                    .replace('T', ' ')
                    .slice(0, 16)}
                </Td>
                <Td>
                  {/* meeting_users 안의 user 이름 나열 */}
                  {c.meeting_users
                    .map((mu: any) => mu.user.user_name)
                    .join(', ')}
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

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 0 0 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #4b2067;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 18px;
`;

const SectionTitleLink = styled.span`
  color: inherit;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3eef7;
  }
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(80, 0, 80, 0.04);
  padding: 24px 24px 24px 24px;
  position: relative;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #333;
  background-color: #fff;
  min-width: 200px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #351745;
  }

  &:focus {
    outline: none;
    border-color: #351745;
    box-shadow: 0 0 0 2px rgba(53, 23, 69, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const NoResultsMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 40px;
  font-size: 0.9375rem;
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
