import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const LayoutWrapper = styled.div`
  padding-top: 60px; // Navbar 높이만큼 꼭 줘야 함!
`;

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <LayoutWrapper>
        <Outlet />
      </LayoutWrapper>
    </>
  );
};

export default Layout;
