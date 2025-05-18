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
  padding: 3rem 1.5rem 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      to right,
      rgba(255,255,255,0),
      rgba(255,255,255,0.2),
      rgba(255,255,255,0)
    );
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const FooterColumns = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 3rem;
  margin-bottom: 1rem;
  text-align: left;
`;

const FooterColumn = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ColumnTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  position: relative;
  padding-bottom: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    position: relative;
    padding: 0.25rem 0;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      text-decoration: none;
      color: white;
      transform: translateX(5px);
    }
  }
`;

const FooterLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
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
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  justify-content: center;
`;

const SocialIcon = styled.a`
  font-size: 1.5rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--primary-color);
    transform: translateY(-5px);
  }
`;

const FooterTagline = styled.p`
  margin-top: 0.5rem;
  max-width: 400px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
`;

const FooterDivider = styled.div`
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  margin: 1rem auto;
  border-radius: 3px;
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
            Health Tracker
          </FooterLogo>
          <FooterTagline>
            Track and improve your daily wellness habits with our comprehensive suite of health tools.
          </FooterTagline>
          <FooterDivider />
          <SocialLinks>
            <SocialIcon href="#" aria-label="Facebook">📘</SocialIcon>
            <SocialIcon href="#" aria-label="Twitter">🐦</SocialIcon>
            <SocialIcon href="#" aria-label="Instagram">📷</SocialIcon>
            <SocialIcon href="#" aria-label="YouTube">🎬</SocialIcon>
          </SocialLinks>
          
          <FooterColumns>
            <FooterColumn>
              <ColumnTitle>Features</ColumnTitle>
              <FooterLinks>
                <a href="/mood">😊 Mood Tracking</a>
                <a href="/water">💧 Water Intake</a>
                <a href="/sleep">😴 Sleep Analysis</a>
                <a href="/fitness">💪 Fitness Routines</a>
              </FooterLinks>
            </FooterColumn>
            
            <FooterColumn>
              <ColumnTitle>Help & Support</ColumnTitle>
              <FooterLinks>
                <a href="/faq">FAQ</a>
                <a href="/contact">Contact Us</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
              </FooterLinks>
            </FooterColumn>
          </FooterColumns>
          
          <Copyright>
            &copy; {new Date().getFullYear()} Health Tracker App. All rights reserved.
          </Copyright>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default Layout; 