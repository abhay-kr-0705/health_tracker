import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import Card from '../Layout/Card';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

const LOCAL_STORAGE_KEY = 'waterTrackerData';
const CUPS_GOAL = 8;

interface WaterTrackerData {
  date: string; // yyyy-MM-dd format
  cups: number;
}

const WaterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CupsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
`;

const Cup = styled.div<{ filled: boolean }>`
  width: 60px;
  height: 80px;
  border-radius: 0 0 20px 20px;
  border: 2px solid #3498db;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  background-color: ${props => props.filled ? '#3498db' : 'transparent'};
  transition: background-color 0.3s, transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    height: 10px;
    border: 2px solid #3498db;
    border-bottom: none;
    border-radius: 20px 20px 0 0;
  }
`;

const CupIcon = styled.span`
  color: ${props => props.color || 'white'};
  font-size: 1.5rem;
`;

const ProgressText = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => `${props.percent}%`};
  background-color: #3498db;
  transition: width 0.3s ease;
`;

const ResetButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const WaterTracker: React.FC = () => {
  const [cups, setCups] = useState(0);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  useEffect(() => {
    // Load water data from localStorage
    const savedData = loadFromLocalStorage<WaterTrackerData[]>(LOCAL_STORAGE_KEY, []);
    const todayData = savedData.find(data => data.date === today);
    
    if (todayData) {
      setCups(todayData.cups);
    } else {
      // Reset cups for a new day
      setCups(0);
    }
  }, [today]);
  
  const saveWaterData = (newCups: number) => {
    const savedData = loadFromLocalStorage<WaterTrackerData[]>(LOCAL_STORAGE_KEY, []);
    const todayDataIndex = savedData.findIndex(data => data.date === today);
    
    if (todayDataIndex !== -1) {
      savedData[todayDataIndex].cups = newCups;
    } else {
      savedData.push({
        date: today,
        cups: newCups
      });
    }
    
    saveToLocalStorage(LOCAL_STORAGE_KEY, savedData);
  };
  
  const handleCupClick = (index: number) => {
    // If the cup is already filled, fill all cups up to this cup
    // If the cup is not filled, fill this cup and all before it
    const newCups = index + 1;
    setCups(newCups);
    saveWaterData(newCups);
  };
  
  const resetCups = () => {
    setCups(0);
    saveWaterData(0);
  };
  
  const progressPercent = (cups / CUPS_GOAL) * 100;
  
  return (
    <>
      <Card title="Daily Water Intake">
        <WaterContainer>
          <ProgressText>{cups} of {CUPS_GOAL} cups</ProgressText>
          
          <ProgressBar>
            <Progress percent={progressPercent > 100 ? 100 : progressPercent} />
          </ProgressBar>
          
          <CupsContainer>
            {Array.from({ length: CUPS_GOAL }).map((_, index) => (
              <Cup 
                key={index} 
                filled={index < cups}
                onClick={() => handleCupClick(index)}
              >
                <CupIcon color={index < cups ? 'white' : '#3498db'}>💧</CupIcon>
              </Cup>
            ))}
          </CupsContainer>
          
          <ResetButton onClick={resetCups}>Reset Day</ResetButton>
          
          {cups >= CUPS_GOAL && (
            <p style={{ marginTop: '1rem', color: '#27ae60' }}>
              🎉 Congratulations! You've reached your daily water goal!
            </p>
          )}
        </WaterContainer>
      </Card>
      
      <Card title="Water Intake Tips">
        <ul>
          <li>Start your day with a glass of water</li>
          <li>Carry a water bottle with you</li>
          <li>Set reminders to drink water throughout the day</li>
          <li>Drink a glass of water before each meal</li>
          <li>Add flavor with fruits if you find water boring</li>
        </ul>
      </Card>
    </>
  );
};

export default WaterTracker; 