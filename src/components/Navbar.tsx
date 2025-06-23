import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../utils/auth";
import {
  DropdownItem,
  DropdownMenu,
  FilledButton,
  Left,
  LogoImg,
  LogoutText,
  Menu,
  MenuIcon,
  MenuItem,
  NavbarContainer,
  ProfileIcon,
  ProfileIconCircle,
  ProfileSection,
  Right,
  TextButton,
} from "./Navbar.styles";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);
  const [role, setRole] = useState<
    "user" | "companyAdmin" | "superAdmin" | null
  >(null);

  const systemMenuItems = [
    { name: "문서 에이전트", path: "/docs_agent_test" },
    { name: "사용자 관리", path: "/admin/user" },
    // { name: "회사 관리", path: "/admin/company" },
    { name: "직책 관리", path: "/admin/position" },
    { name: "템플릿 관리", path: "/admin/template" },
    // { name: "관리자 관리", path: "/admin/admin" },
  ];

  const superSystemMenuItems = [
    // { name: "문서 에이전트", path: "/docs_agent_test" },
    // { name: "사용자 관리", path: "/admin/user" },
    { name: "회사 관리", path: "/admin/company" },
    // { name: "직책 관리", path: "/admin/position" },
    // { name: "템플릿 관리", path: "/admin/template" },
    { name: "관리자 관리", path: "/admin/admin" },
  ];

  const roleMap: Record<string, "user" | "companyAdmin" | "superAdmin"> = {
    "4864c9d2-7f9c-4862-9139-4e8b0ed117f4": "user",
    "f3d23b8c-6e7b-4f5d-a72d-8a9622f94084": "companyAdmin",
    "c4cb5e53-617e-463f-8ddb-67252f9a9742": "superAdmin",
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      console.log("로그아웃 성공");
      setUser(null);
      navigate("/");
    } else {
      alert("로그아웃에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (!user?.sysrole) return;

    setRole(roleMap[user.sysrole] ?? null);
  }, [user]);

  return (
    <NavbarContainer>
      <Left>
        <LogoImg
          src="/images/flowyLogo.svg"
          alt="Flowy Logo"
          onClick={() => navigate("/")}
        />
        <Menu>
          {!user || role === "user" ? (
            <>
              <MenuItem onClick={() => navigate("/")}>
                Flowy
                <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
              </MenuItem>
              <MenuItem onClick={() => navigate("/insert_info")}>
                새 회의
                <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
              </MenuItem>
              <MenuItem onClick={() => navigate("/projectlist")}>
                회의 관리
                <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
              </MenuItem>
              <MenuItem onClick={() => navigate("/calendar")}>
                작업 관리
                <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
              </MenuItem>
              {/* <MenuItem onClick={() => navigate("/admin/dashboard")}>
                대시보드
                <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
              </MenuItem> */}
              {/* <MenuItem
                onMouseEnter={() => setIsSystemMenuOpen(true)}
                onMouseLeave={() => setIsSystemMenuOpen(false)}
                style={{ position: "relative" }}
              >
                시스템 관리
                <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
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
              </MenuItem> */}
              <MenuItem onClick={() => navigate("/mypage")}>
                마이페이지
                <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
              </MenuItem>
            </>
          ) : null}

          {user && role === "companyAdmin" && (
            <>
              <MenuItem
                onMouseEnter={() => setIsSystemMenuOpen(true)}
                onMouseLeave={() => setIsSystemMenuOpen(false)}
                style={{ position: "relative" }}
              >
                시스템 관리
                <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
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
              <MenuItem onClick={() => navigate("/admin/dashboard")}>
                대시보드
                <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
              </MenuItem>
            </>
          )}
          {user && role === "superAdmin" && (
            <MenuItem
              onMouseEnter={() => setIsSystemMenuOpen(true)}
              onMouseLeave={() => setIsSystemMenuOpen(false)}
              style={{ position: "relative" }}
            >
              시스템 관리
              <MenuIcon src="/images/navibaricon.svg" alt="menu icon" />
              <DropdownMenu $isOpen={isSystemMenuOpen}>
                {superSystemMenuItems.map((item, index) => (
                  <DropdownItem key={index} onClick={() => navigate(item.path)}>
                    {item.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </MenuItem>
          )}
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
            <Link to="/login" style={{ textDecoration: "none" }}>
              <TextButton>로그인</TextButton>
            </Link>
            <Link to="/sign_up" style={{ textDecoration: "none" }}>
              <FilledButton>회원가입</FilledButton>
            </Link>
          </>
        )}
      </Right>
    </NavbarContainer>
  );
};

export default Navbar;
