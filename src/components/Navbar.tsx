import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 70px;
  background-color: white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Menu = styled.ul`
  display: flex;
  list-style: none;
  gap: 1.5rem;
`;

const MenuItem = styled.li`
  cursor: pointer;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;

  &:hover {
    color: #002b5c;
  }
`;

const DropdownMenu = styled.ul<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 150px;
  list-style: none;
`;

const DropdownItem = styled.li`
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
    color: #002b5c;
  }
`;

const RightSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
  background-color: #002b5c;
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
`;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);

  const systemMenuItems = [
    { name: "문서 에이전트", path: "/docs_agent_test" },
    { name: "사용자 관리", path: "/admin/user" },
    { name: "회사 관리", path: "/admin/company" },
    { name: "직책 관리", path: "/admin/position" },
    { name: "템플릿 관리", path: "/admin/template" }
  ];

  return (
    <Nav>
      <Logo onClick={() => navigate("/")}>PAGE</Logo>
      <Menu>
        <MenuItem>ABOUT</MenuItem>
        <MenuItem onClick={() => navigate("/dashboard")}>DASHBOARD</MenuItem>
        <MenuItem onClick={() => navigate("/insert_info")}>COMMENCE</MenuItem>
        <MenuItem onClick={() => navigate("/result")}>RESULT</MenuItem>
        <MenuItem 
          onMouseEnter={() => setIsSystemMenuOpen(true)}
          onMouseLeave={() => setIsSystemMenuOpen(false)}
        >
          시스템관리
          <DropdownMenu $isOpen={isSystemMenuOpen}>
  {systemMenuItems.map((item, index) => (
    <DropdownItem 
      key={index}
      onClick={() => navigate(item.path)}
    >
      {item.name}
    </DropdownItem>
  ))}
</DropdownMenu>
        </MenuItem>
        <MenuItem>CONTACT</MenuItem>
      </Menu>
      <RightSection>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
          alt="Instagram"
          width="20"
        />
        <Button>RESERVATION</Button>
      </RightSection>
    </Nav>
  );
};

export default Navbar;
