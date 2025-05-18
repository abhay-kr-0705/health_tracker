import React, { useState, useEffect, FormEvent } from 'react';
import styled from 'styled-components';
import { format, subDays } from 'date-fns';
import Card from '../Layout/Card';
import ChartWrapper from '../Layout/ChartWrapper';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

interface SleepEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  hours: number;
  quality: number; // 1-5 scale
  notes?: string;
}

const LOCAL_STORAGE_KEY = 'sleepTrackerData';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 150px;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 150px;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #3498db;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const QualityRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;

const QualityStar = styled.span<{ filled: boolean }>`
  color: ${props => props.filled ? '#f1c40f' : '#ddd'};
  font-size: 1.2rem;
`;

const EntryList = styled.div`
  margin-top: 1rem;
`;

const EntryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #3498db;
`;

const EntryInfo = styled.div`
  flex: 1;
`;

const EntryDate = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const EntryHours = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #3498db;
`;

const EntryDetails = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const SleepTracker: React.FC = () => {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [formData, setFormData] = useState({
    hours: '8',
    quality: '3',
    notes: '',
  });
  
  useEffect(() => {
    // Load sleep entries from localStorage
    const savedEntries = loadFromLocalStorage<SleepEntry[]>(LOCAL_STORAGE_KEY, []);
    setSleepEntries(savedEntries);
  }, []);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const existingEntry = sleepEntries.find(entry => entry.date === today);
    
    if (existingEntry) {
      if (!window.confirm('You already have a sleep entry for today. Replace it?')) {
        return;
      }
    }
    
    const newEntry: SleepEntry = {
      id: existingEntry?.id || Date.now().toString(),
      date: today,
      hours: parseFloat(formData.hours),
      quality: parseInt(formData.quality),
      notes: formData.notes.trim() || undefined,
    };
    
    let updatedEntries: SleepEntry[];
    
    if (existingEntry) {
      updatedEntries = sleepEntries.map(entry => 
        entry.id === existingEntry.id ? newEntry : entry
      );
    } else {
      updatedEntries = [...sleepEntries, newEntry];
    }
    
    setSleepEntries(updatedEntries);
    saveToLocalStorage(LOCAL_STORAGE_KEY, updatedEntries);
    
    // Reset notes field but keep hours and quality
    setFormData(prev => ({
      ...prev,
      notes: '',
    }));
  };
  
  // Get data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();
  
  const sleepHoursByDay = last7Days.map(date => {
    const entry = sleepEntries.find(entry => entry.date === date);
    return entry ? entry.hours : null;
  });
  
  const chartData = {
    labels: last7Days.map(date => format(new Date(date), 'EEE')),
    datasets: [
      {
        label: 'Hours Slept',
        data: sleepHoursByDay,
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgba(52, 152, 219, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
  
  const chartOptions = {
    scales: {
      y: {
        min: 0,
        max: 12,
        title: {
          display: true,
          text: 'Hours',
        },
      },
    },
  };
  
  // Calculate stats
  const recentEntries = sleepEntries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);
  
  const averageSleep = recentEntries.length > 0
    ? recentEntries.reduce((sum, entry) => sum + entry.hours, 0) / recentEntries.length
    : 0;
  
  const averageQuality = recentEntries.length > 0
    ? recentEntries.reduce((sum, entry) => sum + entry.quality, 0) / recentEntries.length
    : 0;
  
  const bestSleep = recentEntries.length > 0
    ? Math.max(...recentEntries.map(entry => entry.hours))
    : 0;
  
  return (
    <>
      <Card title="Track Your Sleep">
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="hours">Hours Slept</Label>
              <Input
                type="number"
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                step="0.5"
                min="0"
                max="24"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="quality">Sleep Quality</Label>
              <Select
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
              >
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </Select>
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <TextArea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="How did you sleep? Any disturbances? Dreams?"
            />
          </FormGroup>
          <SubmitButton type="submit">Save Sleep Entry</SubmitButton>
        </Form>
      </Card>
      
      <Card title="Sleep Stats">
        <StatsContainer>
          <StatCard>
            <StatValue>{averageSleep.toFixed(1)}</StatValue>
            <StatLabel>Avg. Hours</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              <QualityRating>
                {[1, 2, 3, 4, 5].map(star => (
                  <QualityStar key={star} filled={star <= Math.round(averageQuality)}>★</QualityStar>
                ))}
              </QualityRating>
            </StatValue>
            <StatLabel>Avg. Quality</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{bestSleep.toFixed(1)}</StatValue>
            <StatLabel>Best Sleep</StatLabel>
          </StatCard>
        </StatsContainer>
        
        <ChartWrapper
          type="line"
          data={chartData}
          options={chartOptions}
          height={250}
          title="Sleep Duration (Last 7 Days)"
        />
      </Card>
      
      <Card title="Recent Sleep Entries">
        {recentEntries.length > 0 ? (
          <EntryList>
            {recentEntries.map(entry => (
              <EntryItem key={entry.id}>
                <EntryInfo>
                  <EntryDate>{format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</EntryDate>
                  <EntryDetails>
                    Quality: {Array(entry.quality).fill('★').join('')}
                    {entry.notes && <div style={{ marginTop: '0.5rem' }}>{entry.notes}</div>}
                  </EntryDetails>
                </EntryInfo>
                <EntryHours>{entry.hours} hrs</EntryHours>
              </EntryItem>
            ))}
          </EntryList>
        ) : (
          <EmptyState>
            No sleep entries yet. Start tracking your sleep using the form above!
          </EmptyState>
        )}
      </Card>
    </>
  );
};

export default SleepTracker; 