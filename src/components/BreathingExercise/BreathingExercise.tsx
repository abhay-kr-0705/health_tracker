import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Card from '../Layout/Card';

type BreathState = 'inhale' | 'exhale' | 'hold' | 'paused';

interface BreathingPattern {
  id: string;
  name: string;
  inhaleTime: number;
  exhaleTime: number;
  holdTime: number;
  description: string;
}

const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'balanced',
    name: 'Balanced Breathing',
    inhaleTime: 4,
    exhaleTime: 4,
    holdTime: 0,
    description: 'Simple equal breathing pattern for balance and calm'
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    inhaleTime: 4,
    exhaleTime: 8,
    holdTime: 7,
    description: 'Breathe in for 4, hold for 7, exhale for 8. Great for relaxation and sleep'
  },
  {
    id: 'box',
    name: 'Box Breathing',
    inhaleTime: 4,
    exhaleTime: 4,
    holdTime: 4,
    description: 'Equal parts inhale, hold, exhale, and hold again. Used by Navy SEALs for stress management'
  }
];

const breatheAnimation = (scale: number) => keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(${scale});
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PatternSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PatternButton = styled.button<{ selected: boolean }>`
  background-color: ${props => props.selected ? '#3498db' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: 1px solid #3498db;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: ${props => props.selected ? '#2980b9' : '#eaf2fa'};
  }
`;

const CircleContainer = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BreathCircle = styled.div<{ 
  breathing: BreathState; 
  inhaleTime: number; 
  exhaleTime: number;
}>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 0 15px rgba(52, 152, 219, 0.5);
  
  ${props => {
    if (props.breathing === 'inhale') {
      return css`
        animation: ${breatheAnimation(1.4)} ${props.inhaleTime}s linear infinite;
      `;
    } else if (props.breathing === 'exhale') {
      return css`
        animation: ${breatheAnimation(0.7)} ${props.exhaleTime}s linear infinite;
      `;
    } else if (props.breathing === 'hold') {
      return css`
        transform: scale(1.4);
      `;
    } else {
      return css`
        transform: scale(1);
      `;
    }
  }}
`;

const Instructions = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin: 1rem 0;
  min-height: 2rem;
`;

const ControlButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const PatternDescription = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  font-style: italic;
  color: #666;
`;

const BreathingExercise: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [breathState, setBreathState] = useState<BreathState>('paused');
  const [timerCount, setTimerCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimerCount(prevCount => {
          const newCount = prevCount + 1;
          
          // Determine the breath state based on the current timer count
          if (breathState === 'inhale' && newCount >= selectedPattern.inhaleTime) {
            if (selectedPattern.holdTime > 0) {
              setBreathState('hold');
              return 0;
            } else {
              setBreathState('exhale');
              return 0;
            }
          } else if (breathState === 'hold' && newCount >= selectedPattern.holdTime) {
            setBreathState('exhale');
            return 0;
          } else if (breathState === 'exhale' && newCount >= selectedPattern.exhaleTime) {
            setBreathState('inhale');
            return 0;
          }
          
          return newCount;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, breathState, selectedPattern]);
  
  const toggleExercise = () => {
    if (!isActive) {
      setBreathState('inhale');
      setTimerCount(0);
      setIsActive(true);
    } else {
      setBreathState('paused');
      setTimerCount(0);
      setIsActive(false);
    }
  };
  
  const handlePatternSelect = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    if (isActive) {
      // Reset the exercise with the new pattern
      setBreathState('inhale');
      setTimerCount(0);
    }
  };
  
  return (
    <Card title="Breathing Exercise">
      <Container>
        <PatternSelector>
          {BREATHING_PATTERNS.map(pattern => (
            <PatternButton
              key={pattern.id}
              selected={selectedPattern.id === pattern.id}
              onClick={() => handlePatternSelect(pattern)}
            >
              {pattern.name}
            </PatternButton>
          ))}
        </PatternSelector>
        
        <PatternDescription>
          {selectedPattern.description}
        </PatternDescription>
        
        <CircleContainer>
          <BreathCircle
            breathing={breathState}
            inhaleTime={selectedPattern.inhaleTime}
            exhaleTime={selectedPattern.exhaleTime}
          />
        </CircleContainer>
        
        <Instructions>
          {breathState === 'inhale' && 'Inhale...'}
          {breathState === 'exhale' && 'Exhale...'}
          {breathState === 'hold' && 'Hold...'}
          {breathState === 'paused' && 'Press Start to begin'}
        </Instructions>
        
        <ControlButton onClick={toggleExercise}>
          {isActive ? 'Stop' : 'Start'}
        </ControlButton>
      </Container>
    </Card>
  );
};

export default BreathingExercise; 