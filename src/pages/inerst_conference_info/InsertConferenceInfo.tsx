import React from "react";
import FileUpload from "./FileUpload";
import SideBar from "../../components/SideBar";
import styled from "styled-components";

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

const InsertConferenceInfo: React.FC = () => {
  return (
    <Container>
      <SideBar />
      <MainContent>
        <FileUpload />
      </MainContent>
    </Container>
  );
};

export default InsertConferenceInfo;
