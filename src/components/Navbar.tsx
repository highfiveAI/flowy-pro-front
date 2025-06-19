import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../utils/auth';

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
  background: white;
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
  position: relative;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f5ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  /* 선택된 상태 */
  &.selected {
    background-color: #e5e0ee;
    border-left: 3px solid #4b2067;
  }
  
  &.selected:hover {
    background-color: #d4c7e8;
  }
`;

const MenuIcon = styled.img`
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
  
  ${MenuItem}:hover & {
    transform: rotate(180deg);
  }
`;

const TextButton = styled.button`
  background: none;
  color: #351745;
  border: none;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f5ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FilledButton = styled.button`
  background: #480b6a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #351745;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(72, 11, 106, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LogoImg = styled.img`
  width: 93.273px;
  height: 44.591px;
  margin-right: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
  
  &:active {
    transform: scale(1.02);
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f5ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(80, 0, 80, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ProfileIconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  
  ${ProfileSection}:hover & {
    background-color: #e5e0ee;
    transform: scale(1.1);
  }
`;

const ProfileIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: #351745;
  transition: all 0.2s ease;
  
  ${ProfileSection}:hover & {
    fill: #4b2067;
  }
`;

const LogoutText = styled.span`
  color: #351745;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  transition: all 0.2s ease;
  
  ${ProfileSection}:hover & {
    color: #4b2067;
    font-weight: 600;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  min-width: 150px;
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  color: #351745;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f5ff;
    color: #4b2067;
    transform: translateX(4px);
    font-weight: 600;
  }
  
  &:active {
    background-color: #e5e0ee;
  }
`;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);

  const systemMenuItems = [
    { name: '문서 에이전트', path: '/docs_agent_test' },
    { name: '사용자 관리', path: '/admin/user' },
    { name: '회사 관리', path: '/admin/company' },
    { name: '직책 관리', path: '/admin/position' },
    { name: '템플릿 관리', path: '/admin/template' },
    { name: '관리자 관리', path: '/admin/admin' },
  ];

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      console.log('로그아웃 성공');
      setUser(null);
      navigate('/');
    } else {
      alert('로그아웃에 실패했습니다.');
    }
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
          <MenuItem onClick={() => navigate('/')}>
            Flowy
            <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
          </MenuItem>
          <MenuItem onClick={() => navigate('/insert_info')}>
            새 회의
            <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
          </MenuItem>
          <MenuItem onClick={() => navigate('/projectlist')}>
            회의 관리
            <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
          </MenuItem>
          <MenuItem onClick={() => navigate('/calendar')}>
            작업 관리
            <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
          </MenuItem>
          <MenuItem onClick={() => navigate('/admin/dashboard')}>
            대시보드
            <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
          </MenuItem>
          <MenuItem
            onMouseEnter={() => setIsSystemMenuOpen(true)}
            onMouseLeave={() => setIsSystemMenuOpen(false)}
            style={{ position: 'relative' }}
          >
            시스템 관리
            <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
            <DropdownMenu $isOpen={isSystemMenuOpen}>
              {systemMenuItems.map((item, index) => (
                <DropdownItem key={index} onClick={() => navigate(item.path)}>
                  {item.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </MenuItem>
          <MenuItem onClick={() => navigate('/mypage')}>
            마이페이지
            <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
          </MenuItem>
        </Menu>
      </Left>
      <Right>
        {user ? (
          <ProfileSection>
            <ProfileIconCircle>
              <ProfileIcon viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </ProfileIcon>
            </ProfileIconCircle>
            <LogoutText onClick={() => handleLogout()}>로그아웃</LogoutText>
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
