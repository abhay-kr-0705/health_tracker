import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

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
  padding: 1.5rem 1.2rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
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
  width: 28px;
  height: 28px;
  background: var(--danger-gradient);
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(231, 76, 60, 0.4);
`;

const QuickLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: white;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: white;
    transition: width 0.3s;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-color);
    transform: translateY(-2px);
  }
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
          
          <QuickLinks>
            <FooterLink to="/mood">Mood</FooterLink>
            <FooterLink to="/water">Water</FooterLink>
            <FooterLink to="/sleep">Sleep</FooterLink>
            <FooterLink to="/fitness">Fitness</FooterLink>
            <FooterLink to="/journal">Journal</FooterLink>
          </QuickLinks>
          
          <Copyright>
            <span>&copy; {new Date().getFullYear()}</span>
            <SocialIcons>
              <SocialIcon href="#" aria-label="Twitter">🐦</SocialIcon>
              <SocialIcon href="#" aria-label="Instagram">📷</SocialIcon>
              <SocialIcon href="#" aria-label="LinkedIn">🔗</SocialIcon>
            </SocialIcons>
          </Copyright>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default Layout; 