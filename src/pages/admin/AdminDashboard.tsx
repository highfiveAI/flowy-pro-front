import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const DashboardTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const DashboardCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <DashboardTitle>대시보드</DashboardTitle>
      <DashboardContent>
        <DashboardCard>{/* 대시보드 컨텐츠는 추후 추가 예정 */}</DashboardCard>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;
