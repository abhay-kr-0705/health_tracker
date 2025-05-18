import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  accentColor?: string;
}

const CardContainer = styled.div<{ accentColor?: string }>`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  border-top: ${props => props.accentColor ? `3px solid ${props.accentColor}` : 'none'};
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    background: ${props => props.accentColor ? props.accentColor : 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'};
    opacity: 0.1;
    transition: height 0.3s ease;
  }
  
  &:hover::before {
    height: 100%;
  }
`;

const CardTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
  color: #2c3e50;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  
  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #3498db, #2980b9);
    position: absolute;
    bottom: -1px;
    left: 0;
    border-radius: 3px;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Card: React.FC<CardProps> = ({ title, children, className, accentColor }) => {
  return (
    <CardContainer className={className} accentColor={accentColor}>
      {title && <CardTitle>{title}</CardTitle>}
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};

export default Card; 