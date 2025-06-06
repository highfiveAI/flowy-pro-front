import React from "react";
import SideBar from "../../components/SideBar";
import DashboardContents from "./DashBoardContents";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #f7f7f7;
`;

const Dashboard: React.FC = () => {
  return (
    <Container>
      <SideBar />
      <DashboardContents />
    </Container>
  );
};

export default Dashboard;
