import React from "react";
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
  return (
    <Nav>
      <Logo onClick={() => navigate("/")}>PAGE</Logo>
      <Menu>
        <MenuItem>ABOUT</MenuItem>
        <MenuItem onClick={() => navigate("/dashboard")}>DASHBOARD</MenuItem>
        <MenuItem onClick={() => navigate("/insert_info")}>COMMENCE</MenuItem>
        <MenuItem onClick={() => navigate("/result")}>RESULT</MenuItem>
        <MenuItem onClick={() => navigate("/docs_agent_test")}>Docs</MenuItem>
        <MenuItem onClick={() => navigate("/admin/user")}>User</MenuItem>
        <MenuItem onClick={() => navigate("/admin/company")}>Company</MenuItem>
        <MenuItem onClick={() => navigate("/admin/position")}>Position</MenuItem>
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
