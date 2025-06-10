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
  background: white; /* 배경을 흰색으로 변경 */
  font-family: "Rethink Sans", sans-serif;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #351745; /* 텍스트 색상 변경 */
`;

const Menu = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-left: 76px;
`;

const MenuItem = styled.div`
  color: #351745; /* 텍스트 색상 변경 */
  font-family: 'Rethink Sans', sans-serif;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const TextButton = styled.button`
  background: none;
  color: #351745; /* 텍스트 색상 변경 */
  border: none;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
`;

const FilledButton = styled.button`
  background: #480B6A;
  color: #FFF;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

const LogoImg = styled.img`
  width: 93.273px;
  height: 44.591px;
  margin-right: 12px;
  cursor: pointer;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
`;

const ProfileIconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #D9D9D9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: #351745; /* 사람 아이콘 색상 변경 */
`;

const LogoutText = styled.span`
  color: #351745; /* 텍스트 색상 변경 */
  font-family: "Rethink Sans", sans-serif;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;

const MenuIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 8px;
`;

interface NavbarSubProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const NavbarSub: React.FC<NavbarSubProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    // 실제 로그아웃 API 호출 로직 (예: fetch 또는 axios)
    // fetch('/api/logout', { method: 'POST' });
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
    navigate('/'); // 메인 화면으로 이동
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

export default NavbarSub; 