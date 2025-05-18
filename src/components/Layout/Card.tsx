import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  accentColor?: string;
  icon?: string;
}

const CardContainer = styled.div<{ accentColor?: string }>`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: var(--transition-normal);
  border-top: ${props => props.accentColor ? `4px solid ${props.accentColor}` : 'none'};
  overflow: hidden;
  position: relative;
  animation: slideUp 0.5s ease-out forwards;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    background: ${props => props.accentColor 
      ? `linear-gradient(135deg, ${props.accentColor} 0%, ${props.accentColor}80 100%)`
      : 'var(--primary-gradient)'};
    opacity: 0.05;
    transition: height 0.4s ease;
  }
  
  &:hover::before {
    height: 100%;
  }
`;

const CardTitle = styled.h2<{ hasIcon: boolean }>`
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
  color: var(--text-primary);
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  gap: ${props => props.hasIcon ? '0.7rem' : '0'};
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: var(--primary-gradient);
    position: absolute;
    bottom: -1px;
    left: 0;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  ${CardContainer}:hover &::after {
    width: 120px;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const IconWrapper = styled.span`
  font-size: 1.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Card: React.FC<CardProps> = ({ title, children, className, accentColor, icon }) => {
  return (
    <CardContainer className={className} accentColor={accentColor}>
      {title && (
        <CardTitle hasIcon={!!icon}>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          {title}
        </CardTitle>
      )}
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};

export default Card; 