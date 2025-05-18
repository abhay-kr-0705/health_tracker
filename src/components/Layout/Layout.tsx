import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-light);
  background-image: linear-gradient(to bottom, #f9fafc, #f5f7fa);
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 10% 10%, rgba(52, 152, 219, 0.03) 0%, transparent 20%),
      radial-gradient(circle at 90% 30%, rgba(46, 204, 113, 0.03) 0%, transparent 20%),
      radial-gradient(circle at 30% 70%, rgba(155, 89, 182, 0.03) 0%, transparent 20%),
      radial-gradient(circle at 80% 90%, rgba(241, 196, 15, 0.03) 0%, transparent 20%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Footer = styled.footer`
  background: linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(26, 48, 64, 0.95) 100%);
  color: white;
  padding: 1.2rem;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoIcon = styled.span`
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  background: var(--danger-gradient);
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(231, 76, 60, 0.4);
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      <Navbar />
      <Main id="main-content">{children}</Main>
      <Footer>
        <FooterContent>
          <FooterLogo>
            <LogoIcon role="img" aria-label="Health tracker logo">❤️</LogoIcon>
            <span>Health Tracker</span>
          </FooterLogo>
          
          <Copyright>
            &copy; {new Date().getFullYear()} Health Tracker App
          </Copyright>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default Layout; 