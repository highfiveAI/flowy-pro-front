import React from "react";
import styled from "styled-components";
import { FiEdit2, FiTrash2, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const dummyProjects = Array.from({ length: 10 }).map((/*_, i*/) => ({
  name: "Pitchpal",
  created: "2025-05-15",
  end: "2025-08-31",
}));

const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Title>회의 관리</Title>
      <SectionTitle>프로젝트 목록</SectionTitle>
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
            {dummyProjects.map((p, i) => (
              <Tr key={i}>
                <Td>{p.name}</Td>
                <Td>{p.created}</Td>
                <Td>{p.end}</Td>
                <Td>
                  <IconGroup>
                    <IconBtn>
                      <FiEdit2 />
                    </IconBtn>
                    <IconBtn>
                      <FiTrash2 />
                    </IconBtn>
                    <ArrowBtn onClick={() => navigate("/conferencelist")}>
                      <FiArrowRight />
                    </ArrowBtn>
                  </IconGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default ProjectListPage;

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
`;
const Td = styled.td`
  font-size: 1rem;
  color: #333;
  padding: 16px 0;
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
  transition: background 0.15s;
  &:hover {
    background: #e5e0ee;
  }
`;
const ArrowBtn = styled.button`
  background: #351745;
  border: none;
  border-radius: 50%;
  padding: 6px 8px;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:hover {
    background: #4b2067;
  }
`;
const IconGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: -100px;
`;
