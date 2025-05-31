import React from "react";
import SideBar from "../../components/SideBar";
import styled from "styled-components";
import ResultContents from "./ResultContents";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #f7f7f7;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Result: React.FC = () => {
  return (
    <Container>
      <SideBar />
      <MainContent>
        <ResultContents />
      </MainContent>
    </Container>
  );
};

export default Result;
