import React from 'react';
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: transparent;
  font-family: "Rethink Sans", sans-serif;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 100px;
  height: auto;
  cursor: pointer;
`;

const Menu = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
`;

const MenuItem = styled.li`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const MenuIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ProfileIconCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileIcon = styled.svg`
  width: 24px;
  height: 24px;
`;

const LogoutText = styled.span`
  margin-left: 10px;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

const FilledButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <NavbarContainer>
      <Left>
        <LogoImg 
          src="/images/flowyLogo.svg" 
          alt="Flowy Logo" 
          onClick={() => navigate('/')}

        />
        <Menu>
          <MenuItem onClick={() => handleNavigation('/')}>Flowy<MenuIcon src="/images/navibaricon.svg" alt="menu icon" /></MenuItem>
          <MenuItem onClick={() => handleNavigation('/insert_info')}>새 회의<MenuIcon src="/images/navibaricon.svg" alt="menu icon" /></MenuItem>
          <MenuItem onClick={() => handleNavigation('/dashboard')}>회의 관리<MenuIcon src="/images/navibaricon.svg" alt="menu icon" /></MenuItem>
          <MenuItem onClick={() => handleNavigation('/calendar')}>작업 관리<MenuIcon src="/images/navibaricon.svg" alt="menu icon" /></MenuItem>
          <MenuItem onClick={() => handleNavigation('/mypage')}>마이페이지<MenuIcon src="/images/navibaricon.svg" alt="menu icon" /></MenuItem>
        </Menu>
      </Left>
      <Right>
        {isLoggedIn ? (
          <ProfileSection onClick={handleLogout}>
            <ProfileIconCircle>
              <ProfileIcon viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </ProfileIcon>
            </ProfileIconCircle>
            <LogoutText>로그아웃</LogoutText>
          </ProfileSection>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <TextButton>로그인</TextButton>
            </Link>
            <Link to="/sign_up" style={{ textDecoration: 'none' }}>
              <FilledButton>회원가입</FilledButton>
            </Link>
          </>
        )}
      </Right>
    </NavbarContainer>
  );
};

export default Navbar; 