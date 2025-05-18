import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, subDays } from 'date-fns';
import Card from '../Layout/Card';
import ChartWrapper from '../Layout/ChartWrapper';
import { loadFromLocalStorage } from '../../utils/localStorage';

// Dashboard sections and styling
const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
`;

const GridSection = styled.div<{ cols: number }>`
  grid-column: span ${props => Math.min(props.cols, 12)};
  
  @media (max-width: 1200px) {
    grid-column: span ${props => Math.min(props.cols * 2, 12)};
  }
  
  @media (max-width: 768px) {
    grid-column: span 12;
  }
`;

const QuickStatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div<{ accentColor?: string }>`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${props => props.accentColor || '#3498db'};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #7f8c8d;
  text-align: center;
`;

const OverlayToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e50;
`;

const WearableStatus = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.connected ? '#27ae60' : '#e74c3c'};
  margin-bottom: 1rem;
`;

const StatusDot = styled.div<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.connected ? '#27ae60' : '#e74c3c'};
`;

const SyncButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #2980b9;
  }
`;

interface HealthData {
  mood?: { date: string; mood: string }[];
  water?: { date: string; cups: number }[];
  sleep?: { date: string; hours: number }[];
  weight?: { date: string; weight: number }[];
  steps?: { date: string; count: number }[];
  heartRate?: { date: string; rate: number }[];
}

const Dashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>({});
  const [wearableConnected, setWearableConnected] = useState(false);
  const [overlays, setOverlays] = useState({
    sleep: true,
    water: true,
    steps: true,
    heartRate: false,
  });
  
  useEffect(() => {
    // Load data from localStorage
    const moodData = loadFromLocalStorage('moodTrackerData', []);
    const waterData = loadFromLocalStorage('waterTrackerData', []);
    const sleepData = loadFromLocalStorage('sleepTrackerData', []);
    const weightData = loadFromLocalStorage('weightTrackerData', []);
    
    // Simulate wearable device data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();
    
    const simulatedSteps = last7Days.map(date => ({
      date,
      count: Math.floor(Math.random() * 6000) + 4000, // 4000-10000 steps
    }));
    
    const simulatedHeartRate = last7Days.map(date => ({
      date,
      rate: Math.floor(Math.random() * 30) + 60, // 60-90 bpm
    }));
    
    setHealthData({
      mood: moodData,
      water: waterData,
      sleep: sleepData,
      weight: weightData,
      steps: simulatedSteps,
      heartRate: simulatedHeartRate,
    });
  }, []);
  
  const handleToggleOverlay = (key: keyof typeof overlays) => {
    setOverlays(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const handleSyncWearable = () => {
    setWearableConnected(true);
    
    // Simulate new data from wearable
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const newSteps = [
      ...(healthData.steps || []).filter(item => item.date !== today),
      { date: today, count: Math.floor(Math.random() * 6000) + 4000 },
    ];
    
    const newHeartRate = [
      ...(healthData.heartRate || []).filter(item => item.date !== today),
      { date: today, rate: Math.floor(Math.random() * 30) + 60 },
    ];
    
    setHealthData(prev => ({
      ...prev,
      steps: newSteps,
      heartRate: newHeartRate,
    }));
    
    // Simulate a success message
    alert('Wearable device synced successfully!');
  };
  
  // Prepare data for the integrated chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();
  
  const sleepData = last7Days.map(date => {
    const entry = healthData.sleep?.find(s => s.date === date);
    return entry ? entry.hours : null;
  });
  
  const waterData = last7Days.map(date => {
    const entry = healthData.water?.find(w => w.date === date);
    return entry ? entry.cups : null;
  });
  
  const stepsData = last7Days.map(date => {
    const entry = healthData.steps?.find(s => s.date === date);
    return entry ? entry.count / 1000 : null; // Convert to thousands for scale
  });
  
  const heartRateData = last7Days.map(date => {
    const entry = healthData.heartRate?.find(h => h.date === date);
    return entry ? entry.rate : null;
  });
  
  const multiChartData = {
    labels: last7Days.map(date => format(new Date(date), 'EEE')),
    datasets: [
      ...(overlays.sleep ? [{
        label: 'Sleep (hours)',
        data: sleepData,
        borderColor: 'rgba(52, 152, 219, 1)',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        tension: 0.4,
        yAxisID: 'y1',
      }] : []),
      ...(overlays.water ? [{
        label: 'Water (cups)',
        data: waterData,
        borderColor: 'rgba(41, 128, 185, 1)',
        backgroundColor: 'rgba(41, 128, 185, 0.2)',
        tension: 0.4,
        yAxisID: 'y1',
      }] : []),
      ...(overlays.steps ? [{
        label: 'Steps (thousands)',
        data: stepsData,
        borderColor: 'rgba(39, 174, 96, 1)',
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        tension: 0.4,
        yAxisID: 'y2',
      }] : []),
      ...(overlays.heartRate ? [{
        label: 'Heart Rate (bpm)',
        data: heartRateData,
        borderColor: 'rgba(231, 76, 60, 1)',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        tension: 0.4,
        yAxisID: 'y3',
      }] : []),
    ],
  };
  
  const multiChartOptions = {
    scales: {
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        min: 0,
        max: 12,
        title: {
          display: true,
          text: 'Hours / Cups',
        },
      },
      y2: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 0,
        max: 12,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Steps (thousands)',
        },
      },
      y3: {
        type: 'linear' as const,
        display: overlays.heartRate,
        position: 'right' as const,
        min: 50,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'BPM',
        },
      },
    },
  };
  
  // Calculate stats for quick stats section
  const todaySleep = healthData.sleep?.find(s => 
    s.date === format(new Date(), 'yyyy-MM-dd')
  )?.hours || 0;
  
  const todayWater = healthData.water?.find(w => 
    w.date === format(new Date(), 'yyyy-MM-dd')
  )?.cups || 0;
  
  const todaySteps = healthData.steps?.find(s => 
    s.date === format(new Date(), 'yyyy-MM-dd')
  )?.count || 0;
  
  const todayHeartRate = healthData.heartRate?.find(h => 
    h.date === format(new Date(), 'yyyy-MM-dd')
  )?.rate || 0;
  
  const lastWeight = healthData.weight && healthData.weight.length > 0
    ? healthData.weight[0].weight
    : 0;
  
  return (
    <DashboardContainer>
      <GridSection cols={12}>
        <Card title="Health Dashboard">
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Today's Stats</h3>
            <QuickStatsContainer>
              <StatCard accentColor="#3498db">
                <StatIcon>💧</StatIcon>
                <StatValue>{todayWater}</StatValue>
                <StatLabel>Cups of Water</StatLabel>
              </StatCard>
              
              <StatCard accentColor="#9b59b6">
                <StatIcon>😴</StatIcon>
                <StatValue>{todaySleep}</StatValue>
                <StatLabel>Hours of Sleep</StatLabel>
              </StatCard>
              
              <StatCard accentColor="#27ae60">
                <StatIcon>👣</StatIcon>
                <StatValue>{todaySteps.toLocaleString()}</StatValue>
                <StatLabel>Steps</StatLabel>
              </StatCard>
              
              <StatCard accentColor="#e74c3c">
                <StatIcon>❤️</StatIcon>
                <StatValue>{todayHeartRate}</StatValue>
                <StatLabel>BPM</StatLabel>
              </StatCard>
              
              <StatCard accentColor="#f39c12">
                <StatIcon>⚖️</StatIcon>
                <StatValue>{lastWeight}</StatValue>
                <StatLabel>Weight</StatLabel>
              </StatCard>
            </QuickStatsContainer>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Weekly Health Trends</h3>
              <div>
                <WearableStatus connected={wearableConnected}>
                  <StatusDot connected={wearableConnected} />
                  {wearableConnected ? 'Wearable Connected' : 'Wearable Disconnected'}
                </WearableStatus>
                <SyncButton onClick={handleSyncWearable}>
                  {wearableConnected ? 'Sync Data' : 'Connect Wearable'}
                </SyncButton>
              </div>
            </div>
            
            <OverlayToggle>
              <ToggleLabel>
                <input
                  type="checkbox"
                  checked={overlays.sleep}
                  onChange={() => handleToggleOverlay('sleep')}
                />
                Sleep
              </ToggleLabel>
              <ToggleLabel>
                <input
                  type="checkbox"
                  checked={overlays.water}
                  onChange={() => handleToggleOverlay('water')}
                />
                Water
              </ToggleLabel>
              <ToggleLabel>
                <input
                  type="checkbox"
                  checked={overlays.steps}
                  onChange={() => handleToggleOverlay('steps')}
                />
                Steps
              </ToggleLabel>
              <ToggleLabel>
                <input
                  type="checkbox"
                  checked={overlays.heartRate}
                  onChange={() => handleToggleOverlay('heartRate')}
                />
                Heart Rate
              </ToggleLabel>
            </OverlayToggle>
            
            <ChartWrapper
              type="line"
              data={multiChartData}
              options={multiChartOptions}
              height={350}
            />
          </div>
        </Card>
      </GridSection>
    </DashboardContainer>
  );
};

export default Dashboard; 