import React from "react";
import DashboardContents from "./DashBoardContents";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  background-color: #f7f7f7;
`;

const Dashboard: React.FC = () => {
  return (
    <Container>
      <DashboardContents />
    </Container>
  );
};

export default Dashboard;
