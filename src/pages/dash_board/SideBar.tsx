import React from 'react';
import styled from 'styled-components';

const Sidebar = styled.div`
  width: 200px;
  background-color: #ddd;
  padding: 20px;
`;

const SidebarGroup = styled.div`
  margin-bottom: 20px;
`;

const SidebarItem = styled.div`
  margin: 10px 0;
  font-size: 14px;
  cursor: pointer;
`;

const SideBar: React.FC = () => {
  return (
    <Sidebar>
      <SidebarGroup>
        <SidebarItem>사이트요약</SidebarItem>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarItem>주문관리</SidebarItem>
        <SidebarItem>회원관리</SidebarItem>
        <SidebarItem>상품관리</SidebarItem>
        <SidebarItem>디자인관리</SidebarItem>
        <SidebarItem>게시판관리</SidebarItem>
        <SidebarItem>설정관리</SidebarItem>
      </SidebarGroup>
    </Sidebar>
  );
};

export default SideBar;
