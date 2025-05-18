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
  background-color: #f5f7fa;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Footer = styled.footer`
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  a {
    color: #ecf0f1;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      <Navbar />
      <Main>{children}</Main>
      <Footer>
        <FooterContent>
          <div>
            Health Tracker - Track and improve your daily wellness habits
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
          <div>
            &copy; {new Date().getFullYear()} Health Tracker App
          </div>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default Layout; 