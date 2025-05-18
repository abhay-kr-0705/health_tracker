import React, { useState, useEffect, FormEvent } from 'react';
import styled from 'styled-components';
import { format, subDays, isAfter, parseISO, differenceInDays } from 'date-fns';
import Card from '../Layout/Card';
import ChartWrapper from '../Layout/ChartWrapper';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

interface WeightEntry {
  id: string;
  date: string; // ISO string
  weight: number;
  notes?: string;
}

interface WeightGoal {
  value: number;
  target_date?: string; // ISO string
}

interface WeightSettings {
  unit: 'kg' | 'lbs';
  goal?: WeightGoal;
}

const LOCAL_STORAGE_KEY_ENTRIES = 'weightTrackerData';
const LOCAL_STORAGE_KEY_SETTINGS = 'weightTrackerSettings';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  min-width: 200px;
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
`;

const SubmitButton = styled.button`
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #16a085;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatItem = styled.div<{ trend?: 'up' | 'down' | 'neutral' }>`
  flex: 1;
  min-width: 150px;
  background-color: white;
  border-radius: 8px;
  border-left: 4px solid ${props => {
    if (props.trend === 'down') return '#2ecc71';
    if (props.trend === 'up') return '#e74c3c';
    return '#3498db';
  }};
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.div`
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TrendIcon = styled.span<{ trend: 'up' | 'down' | 'neutral' }>`
  color: ${props => {
    if (props.trend === 'down') return '#2ecc71';
    if (props.trend === 'up') return '#e74c3c';
    return '#3498db';
  }};
  font-size: 1.2rem;
`;

const SettingsContainer = styled.div`
  margin-top: 1rem;
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const UnitToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
`;

const GoalDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const GoalValue = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const GoalDate = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const GoalProgress = styled.div`
  margin-top: 0.5rem;
  height: 8px;
  background-color: #f1f1f1;
  border-radius: 4px;
  overflow: hidden;
`;

const GoalFill = styled.div<{ percent: number; positive: boolean }>`
  height: 100%;
  width: ${props => Math.min(100, Math.abs(props.percent))}%;
  background-color: ${props => props.positive ? '#2ecc71' : '#e74c3c'};
  transition: width 0.3s ease;
`;

const EntryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const EntryItem = styled.div<{ trend?: 'up' | 'down' | 'neutral' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 4px;
  border-left: 4px solid ${props => {
    if (props.trend === 'down') return '#2ecc71';
    if (props.trend === 'up') return '#e74c3c';
    return '#ddd';
  }};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EntryDate = styled.div`
  font-weight: 500;
`;

const EntryWeight = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EntryNotes = styled.div`
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const WeightTracker: React.FC = () => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [settings, setSettings] = useState<WeightSettings>({
    unit: 'kg',
    goal: undefined,
  });
  const [formData, setFormData] = useState({
    weight: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });
  const [goalFormData, setGoalFormData] = useState({
    value: '',
    targetDate: '',
  });
  const [showGoalForm, setShowGoalForm] = useState(false);
  
  useEffect(() => {
    // Load entries and settings
    const savedEntries = loadFromLocalStorage<WeightEntry[]>(LOCAL_STORAGE_KEY_ENTRIES, []);
    const savedSettings = loadFromLocalStorage<WeightSettings>(
      LOCAL_STORAGE_KEY_SETTINGS, 
      { unit: 'kg' }
    );
    
    setEntries(savedEntries);
    setSettings(savedSettings);
  }, []);
  
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleGoalFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGoalFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleUnitChange = (unit: 'kg' | 'lbs') => {
    const newSettings = { ...settings, unit };
    setSettings(newSettings);
    saveToLocalStorage(LOCAL_STORAGE_KEY_SETTINGS, newSettings);
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.weight || !formData.date) {
      alert('Please enter weight and date');
      return;
    }
    
    const weight = parseFloat(formData.weight);
    if (isNaN(weight) || weight <= 0) {
      alert('Please enter a valid weight');
      return;
    }
    
    const existingEntry = entries.find(entry => 
      entry.date.startsWith(formData.date)
    );
    
    let updatedEntries: WeightEntry[];
    const newEntry: WeightEntry = {
      id: existingEntry?.id || Date.now().toString(),
      date: new Date(formData.date).toISOString(),
      weight,
      notes: formData.notes || undefined,
    };
    
    if (existingEntry) {
      if (!window.confirm('An entry for this date already exists. Update it?')) {
        return;
      }
      updatedEntries = entries.map(entry => 
        entry.id === existingEntry.id ? newEntry : entry
      );
    } else {
      updatedEntries = [...entries, newEntry];
    }
    
    // Sort by date (newest first)
    updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setEntries(updatedEntries);
    saveToLocalStorage(LOCAL_STORAGE_KEY_ENTRIES, updatedEntries);
    
    // Reset form except for date
    setFormData(prev => ({
      ...prev,
      weight: '',
      notes: '',
    }));
  };
  
  const handleSetGoal = (e: FormEvent) => {
    e.preventDefault();
    
    if (!goalFormData.value) {
      alert('Please enter a target weight');
      return;
    }
    
    const goalValue = parseFloat(goalFormData.value);
    if (isNaN(goalValue) || goalValue <= 0) {
      alert('Please enter a valid weight goal');
      return;
    }
    
    const newGoal: WeightGoal = {
      value: goalValue,
      target_date: goalFormData.targetDate 
        ? new Date(goalFormData.targetDate).toISOString() 
        : undefined,
    };
    
    const newSettings = { ...settings, goal: newGoal };
    setSettings(newSettings);
    saveToLocalStorage(LOCAL_STORAGE_KEY_SETTINGS, newSettings);
    
    setShowGoalForm(false);
    setGoalFormData({ value: '', targetDate: '' });
  };
  
  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      saveToLocalStorage(LOCAL_STORAGE_KEY_ENTRIES, updatedEntries);
    }
  };
  
  const handleClearGoal = () => {
    if (window.confirm('Are you sure you want to clear your weight goal?')) {
      const newSettings = { ...settings, goal: undefined };
      setSettings(newSettings);
      saveToLocalStorage(LOCAL_STORAGE_KEY_SETTINGS, newSettings);
    }
  };
  
  // Calculate stats and trends
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const lastEntry = sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1] : null;
  
  // Get entries from the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();
  
  const chartEntries = last30Days.map(day => {
    const entry = entries.find(e => e.date.startsWith(day));
    return entry?.weight || null;
  });
  
  // Get change trend
  const getWeightTrend = (current: number, previous: number): 'up' | 'down' | 'neutral' => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  };
  
  // Stat calculations
  const currentWeight = lastEntry?.weight || 0;
  
  const previousEntry = sortedEntries.length > 1 ? sortedEntries[sortedEntries.length - 2] : null;
  const weightChange = previousEntry ? currentWeight - previousEntry.weight : 0;
  const changeTrend = previousEntry ? getWeightTrend(currentWeight, previousEntry.weight) : 'neutral';
  
  // Average weekly change (over 4 weeks if data available)
  let weeklyChange = 0;
  if (sortedEntries.length >= 2) {
    const fourWeeksAgo = subDays(new Date(), 28);
    const oldestEntryWithinRange = sortedEntries.find(entry => 
      isAfter(new Date(entry.date), fourWeeksAgo)
    );
    
    if (oldestEntryWithinRange) {
      const totalChange = currentWeight - oldestEntryWithinRange.weight;
      const daysBetween = differenceInDays(
        new Date(lastEntry!.date), 
        new Date(oldestEntryWithinRange.date)
      );
      
      if (daysBetween > 0) {
        weeklyChange = (totalChange / daysBetween) * 7;
      }
    }
  }
  
  const weeklyTrend = weeklyChange === 0 
    ? 'neutral' 
    : weeklyChange < 0 ? 'down' : 'up';
  
  // Goal progress
  const goalProgress = settings.goal 
    ? ((currentWeight - settings.goal.value) / settings.goal.value) * 100 
    : 0;
  
  const isGoalAchieved = settings.goal && settings.goal.value === currentWeight;
  
  // Format the data for the chart
  const chartData = {
    labels: last30Days.map(date => format(new Date(date), 'MMM d')),
    datasets: [
      {
        label: `Weight (${settings.unit})`,
        data: chartEntries,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        tension: 0.4,
        pointBackgroundColor: '#3498db',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };
  
  // Add goal line if set
  if (settings.goal) {
    chartData.datasets.push({
      label: 'Goal',
      data: Array(last30Days.length).fill(settings.goal.value),
      borderColor: '#2ecc71',
      backgroundColor: 'rgba(46, 204, 113, 0.1)',
      tension: 0,
      pointBackgroundColor: '#2ecc71',
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: true,
    } as any);
  }
  
  return (
    <Container>
      <Card title="Track Your Weight">
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="weight">Weight ({settings.unit})</Label>
              <Input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleFormChange}
                step="0.1"
                min="0"
                placeholder={`Enter your weight in ${settings.unit}`}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                max={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <TextArea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              placeholder="Any notes about your weight measurement..."
            />
          </FormGroup>
          <SubmitButton type="submit">Save Entry</SubmitButton>
        </Form>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 style={{ margin: 0 }}>Weight Trend</h2>
          <UnitToggle>
            <RadioLabel>
              <input
                type="radio"
                checked={settings.unit === 'kg'}
                onChange={() => handleUnitChange('kg')}
              />
              kg
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                checked={settings.unit === 'lbs'}
                onChange={() => handleUnitChange('lbs')}
              />
              lbs
            </RadioLabel>
          </UnitToggle>
        </CardHeader>
        
        <ChartWrapper
          type="line"
          data={chartData}
          height={300}
        />
        
        <StatsContainer>
          <StatItem>
            <StatTitle>Current Weight</StatTitle>
            <StatValue>
              {currentWeight ? `${currentWeight} ${settings.unit}` : 'No data'}
            </StatValue>
          </StatItem>
          <StatItem trend={changeTrend}>
            <StatTitle>Last Change</StatTitle>
            <StatValue>
              {previousEntry ? (
                <>
                  {weightChange > 0 && '+'}
                  {weightChange.toFixed(1)} {settings.unit}
                  <TrendIcon trend={changeTrend}>
                    {changeTrend === 'up' ? '↑' : changeTrend === 'down' ? '↓' : '→'}
                  </TrendIcon>
                </>
              ) : (
                'No data'
              )}
            </StatValue>
          </StatItem>
          <StatItem trend={weeklyTrend}>
            <StatTitle>Weekly Average</StatTitle>
            <StatValue>
              {weeklyChange !== 0 ? (
                <>
                  {weeklyChange > 0 && '+'}
                  {weeklyChange.toFixed(1)} {settings.unit}
                  <TrendIcon trend={weeklyTrend}>
                    {weeklyTrend === 'up' ? '↑' : weeklyTrend === 'down' ? '↓' : '→'}
                  </TrendIcon>
                </>
              ) : (
                'No data'
              )}
            </StatValue>
          </StatItem>
        </StatsContainer>
        
        <SettingsContainer>
          <h3>Weight Goal</h3>
          {settings.goal ? (
            <div>
              <GoalDisplay>
                <GoalValue>
                  {settings.goal.value} {settings.unit}
                </GoalValue>
                {settings.goal.target_date && (
                  <GoalDate>
                    by {format(parseISO(settings.goal.target_date), 'MMMM d, yyyy')}
                  </GoalDate>
                )}
                <DeleteButton onClick={handleClearGoal}>✕</DeleteButton>
              </GoalDisplay>
              
              {currentWeight > 0 && (
                <>
                  <GoalProgress>
                    <GoalFill 
                      percent={Math.abs(goalProgress)} 
                      positive={currentWeight <= settings.goal.value}
                    />
                  </GoalProgress>
                  <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    {isGoalAchieved ? (
                      <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                        Goal achieved! 🎉
                      </span>
                    ) : (
                      <span>
                        {Math.abs(currentWeight - settings.goal.value).toFixed(1)} {settings.unit} to go
                        {currentWeight > settings.goal.value ? ' (lose)' : ' (gain)'}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            showGoalForm ? (
              <Form onSubmit={handleSetGoal}>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="goalWeight">Target Weight ({settings.unit})</Label>
                    <Input
                      type="number"
                      id="goalWeight"
                      name="value"
                      value={goalFormData.value}
                      onChange={handleGoalFormChange}
                      step="0.1"
                      min="0"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="targetDate">Target Date (Optional)</Label>
                    <Input
                      type="date"
                      id="targetDate"
                      name="targetDate"
                      value={goalFormData.targetDate}
                      onChange={handleGoalFormChange}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </FormGroup>
                </FormRow>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <SubmitButton type="submit">Set Goal</SubmitButton>
                  <button 
                    type="button" 
                    onClick={() => setShowGoalForm(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            ) : (
              <button 
                onClick={() => setShowGoalForm(true)}
                style={{ 
                  background: 'none', 
                  border: '1px dashed #ccc', 
                  borderRadius: '4px', 
                  padding: '0.75rem', 
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'center',
                  color: '#7f8c8d'
                }}
              >
                + Set a weight goal
              </button>
            )
          )}
        </SettingsContainer>
      </Card>
      
      <Card title="Weight History">
        {entries.length > 0 ? (
          <EntryList>
            {entries.map((entry, index) => {
              const prevEntry = entries[index + 1];
              const trend = prevEntry 
                ? getWeightTrend(entry.weight, prevEntry.weight) 
                : 'neutral';
              
              return (
                <EntryItem key={entry.id} trend={trend}>
                  <div>
                    <EntryDate>{format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</EntryDate>
                    {entry.notes && <EntryNotes>{entry.notes}</EntryNotes>}
                  </div>
                  <EntryWeight>
                    {entry.weight} {settings.unit}
                    {prevEntry && (
                      <TrendIcon trend={trend}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                      </TrendIcon>
                    )}
                    <DeleteButton onClick={() => handleDeleteEntry(entry.id)}>✕</DeleteButton>
                  </EntryWeight>
                </EntryItem>
              );
            })}
          </EntryList>
        ) : (
          <EmptyState>
            No weight entries yet. Start tracking your weight using the form above!
          </EmptyState>
        )}
      </Card>
    </Container>
  );
};

export default WeightTracker; 