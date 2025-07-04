import styled from "styled-components";
import { Outlet /*, useLocation*/ } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./Loading";
import StickyIcon from "./StickyIcon";

const NAVBAR_HEIGHT = "70px";

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(
      100% 100% at 50% 0%,
      #e3cfee 0%,
      #a480b8 29.81%,
      #654477 51.92%,
      #351745 75.48%,
      #170222 93.75%
    ),
    #2e0446;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding-top: ${NAVBAR_HEIGHT};
  min-height: calc(100vh - ${NAVBAR_HEIGHT});
  background-color: #ffffff;
`;

// const PublicLayoutWrapper = styled.div`
//   min-height: 100vh;
//   background: radial-gradient(
//       100% 100% at 50% 0%,
//       #e3cfee 0%,
//       #a480b8 29.81%,
//       #654477 51.92%,
//       #351745 75.48%,
//       #170222 93.75%
//     ),
//     #2e0446;
// `;

const Layout: React.FC = () => {
  const { user, loading } = useAuth();
  // const location = useLocation();

  // 로딩 중일 때는 Loading 컴포넌트 표시
  if (loading) {
    return <Loading />;
  }

  // 로그인하지 않은 상태에서 보호된 라우트에 접근하려고 할 때
  // if (
  //   !user &&
  //   location.pathname !== '/' &&
  //   location.pathname !== '/login' &&
  //   location.pathname !== '/sign_up'
  // ) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  // 로그인한 상태일 때는 기존 레이아웃 사용
  if (user) {
    return (
      <LayoutWrapper>
        <Navbar />
        <MainContent>
          <Outlet />
        </MainContent>
      </LayoutWrapper>
    );
  }

  // 로그인하지 않은 상태일 때는 공개 레이아웃 사용 (로그인, 회원가입 페이지 등)
  return (
    <LayoutWrapper>
      <Navbar />
      <MainContent>
        <Outlet />
      </MainContent>
      <StickyIcon />
    </LayoutWrapper>
  );
};

export default Layout;
