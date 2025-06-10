import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import NavbarSub from './NavbarSub';
import { useAuth } from '../contexts/AuthContext';

const NAVBAR_HEIGHT = '70px'; // 네비바 높이를 약 70px로 가정

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
  flex-grow: 1; /* 남은 공간을 채우도록 */
  padding-top: ${NAVBAR_HEIGHT}; /* 고정된 네비바 아래로 콘텐츠를 밀어냄 */
  min-height: calc(
    100vh - ${NAVBAR_HEIGHT}
  ); /* 네비바를 제외한 나머지 뷰포트 높이 */
  background-color: #ffffff;
`;

const Layout: React.FC = () => {
  const { user } = useAuth();
  return (
    <LayoutWrapper>
      {user ? <NavbarSub /> : <Navbar />}
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutWrapper>
  );
};

export default Layout;
