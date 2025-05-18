import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from './Card';

interface ModuleCardData {
  path: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ModuleCard = styled(Link)<{ bgColor: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none;
  color: inherit;
  border-top: 4px solid ${props => props.bgColor};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ModuleIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ModuleTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const ModuleDescription = styled.p`
  text-align: center;
  color: #7f8c8d;
`;

const HomePageDashboard: React.FC = () => {
  const modules: ModuleCardData[] = [
    {
      path: '/mood',
      title: 'Mood Tracker',
      description: 'Track your mood with emojis and visualize patterns over time.',
      icon: '😊',
      color: '#f1c40f',
    },
    {
      path: '/water',
      title: 'Water Intake',
      description: 'Monitor your daily water consumption with a cup tracker.',
      icon: '💧',
      color: '#3498db',
    },
    {
      path: '/breathing',
      title: 'Breathing Exercise',
      description: 'Follow guided breathing animations to reduce stress and anxiety.',
      icon: '🧘',
      color: '#9b59b6',
    },
    {
      path: '/meals',
      title: 'Meal Log',
      description: 'Record your meals and track daily calorie intake.',
      icon: '🍽️',
      color: '#e67e22',
    },
    {
      path: '/sleep',
      title: 'Sleep Tracker',
      description: 'Track your sleep duration and quality for better rest.',
      icon: '😴',
      color: '#34495e',
    },
    {
      path: '/fitness',
      title: 'Fitness Routine',
      description: 'Follow workout routines with timed exercises and progress tracking.',
      icon: '💪',
      color: '#2ecc71',
    },
    {
      path: '/stretch',
      title: 'Stretch Sequence',
      description: 'Customize and follow guided stretching routines with timers.',
      icon: '🤸',
      color: '#1abc9c',
    },
    {
      path: '/journal',
      title: 'Mental Health Journal',
      description: 'Record your thoughts and feelings with tags for emotional tracking.',
      icon: '📓',
      color: '#8e44ad',
    },
    {
      path: '/weight',
      title: 'Weight Tracker',
      description: 'Track your weight changes and set goals for your journey.',
      icon: '⚖️',
      color: '#e74c3c',
    },
    {
      path: '/',
      title: 'Health Dashboard',
      description: 'View your health data in one place with comprehensive visualizations.',
      icon: '📊',
      color: '#2c3e50',
    },
  ];

  return (
    <Card title="Health & Wellness Modules">
      <DashboardContainer>
        {modules.map((module, index) => (
          <ModuleCard 
            key={index}
            to={module.path}
            bgColor={module.color}
          >
            <ModuleIcon>{module.icon}</ModuleIcon>
            <ModuleTitle>{module.title}</ModuleTitle>
            <ModuleDescription>{module.description}</ModuleDescription>
          </ModuleCard>
        ))}
      </DashboardContainer>
    </Card>
  );
};

export default HomePageDashboard;
