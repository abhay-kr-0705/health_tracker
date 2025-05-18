import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Keyframes for animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NavContainer = styled.nav`
  background: linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(26, 48, 64, 0.95) 100%);
  color: white;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeInDown} 0.5s forwards;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const NavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const NavList = styled.ul<{ isOpen: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    display: ${props => props.isOpen ? 'flex' : 'none'};
    animation: ${props => props.isOpen ? 'slideUp 0.3s forwards' : 'none'};
    background: rgba(44, 62, 80, 0.9);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
`;

const NavItem = styled.li<{ active: boolean }>`
  & a {
    color: white;
    text-decoration: none;
    padding: 0.6rem 0.85rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.18)' : 'transparent'};
    transition: var(--transition-fast);
    font-weight: ${props => props.active ? '600' : '400'};
    position: relative;
    overflow: hidden;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: ${props => props.active ? '80%' : '0'};
      height: 2px;
      background-color: white;
      transform: translateX(-50%);
      transition: width 0.3s ease;
      border-radius: 2px;
    }
    
    &:hover::after {
      width: 80%;
    }
  }
`;

const AppTitle = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #ffffff, #ecf0f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const LogoIcon = styled.span`
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--danger-gradient);
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(231, 76, 60, 0.4);
  margin-right: 0.5rem;
  transition: transform 0.3s ease;
  animation: ${pulse} 2s infinite ease-in-out;
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  transition: transform 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;
  
  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavItemIcon = styled.span`
  font-size: 1.3rem;
  transition: transform 0.2s ease;
  
  ${NavItem}:hover & {
    transform: scale(1.2);
  }
`;

// New component for accessibility skip link
const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.3s ease;
  
  &:focus {
    top: 0;
  }
`;

interface NavLink {
  path: string;
  label: string;
  icon: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const links: NavLink[] = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/mood', label: 'Mood', icon: '😊' },
    { path: '/water', label: 'Water', icon: '💧' },
    { path: '/breathing', label: 'Breathing', icon: '🧘' },
    { path: '/meals', label: 'Meals', icon: '🍽️' },
    { path: '/sleep', label: 'Sleep', icon: '😴' },
    { path: '/fitness', label: 'Fitness', icon: '💪' },
    { path: '/stretch', label: 'Stretch', icon: '🤸' },
    { path: '/journal', label: 'Journal', icon: '📓' },
    { path: '/weight', label: 'Weight', icon: '⚖️' },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <NavContainer style={{ 
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.15)',
        padding: scrolled ? '0.7rem 1rem' : '1rem'
      }}>
        <NavContent>
          <NavHeader>
            <AppTitle>
              <LogoIcon role="img" aria-label="Health tracker logo">❤️</LogoIcon>
              Health Tracker
            </AppTitle>
            <MobileMenuButton 
              onClick={toggleMenu} 
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? '✕' : '☰'}
            </MobileMenuButton>
          </NavHeader>
          
          <NavList isOpen={isOpen} aria-hidden={!isOpen && window.innerWidth <= 768}>
            {links.map(link => (
              <NavItem 
                key={link.path} 
                active={location.pathname === link.path}
                onClick={() => setIsOpen(false)}
              >
                <Link to={link.path} aria-current={location.pathname === link.path ? 'page' : undefined}>
                  <NavItemIcon role="img" aria-hidden="true">{link.icon}</NavItemIcon>
                  {link.label}
                </Link>
              </NavItem>
            ))}
          </NavList>
        </NavContent>
      </NavContainer>
    </>
  );
};

export default Navbar; 