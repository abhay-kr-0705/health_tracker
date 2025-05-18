import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

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
  animation: fadeIn 0.5s ease-out;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Footer = styled.footer`
  background: var(--header-gradient);
  color: white;
  padding: 2rem 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  
  a {
    color: #ecf0f1;
    text-decoration: none;
    position: relative;
    padding: 0.25rem 0;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #ecf0f1;
      transition: width 0.3s ease;
      border-radius: 2px;
    }
    
    &:hover {
      text-decoration: none;
      color: white;
      
      &::after {
        width: 100%;
      }
    }
  }
`;

const FooterLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.span`
  font-size: 1.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--danger-gradient);
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(231, 76, 60, 0.4);
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      <Navbar />
      <Main>{children}</Main>
      <Footer>
        <FooterContent>
          <FooterLogo>
            <LogoIcon role="img" aria-label="Health tracker logo">❤️</LogoIcon>
            Health Tracker
          </FooterLogo>
          <div>
            Track and improve your daily wellness habits with our simple tools
          </div>
          <FooterLinks>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy would go here'); }}>
              Privacy Policy
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms of Service would go here'); }}>
              Terms of Service
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Contact information would go here'); }}>
              Contact
            </a>
          </FooterLinks>
          <Copyright>
            &copy; {new Date().getFullYear()} Health Tracker App. All rights reserved.
          </Copyright>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default Layout; 