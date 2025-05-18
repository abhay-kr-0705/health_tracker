import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import Card from '../Layout/Card';
import MoodCalendar from './MoodCalendar';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

interface MoodEntry {
  date: string; // ISO string
  mood: string;
}

const MOODS = [
  { emoji: '😊', label: 'Happy', color: '#FFD700' },
  { emoji: '😐', label: 'Neutral', color: '#A9A9A9' },
  { emoji: '😢', label: 'Sad', color: '#6495ED' },
  { emoji: '😡', label: 'Angry', color: '#FF6347' },
  { emoji: '🥰', label: 'Loved', color: '#FF69B4' },
];

const LOCAL_STORAGE_KEY = 'moodTrackerData';

const MoodButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const MoodButton = styled.button<{ selected: boolean }>`
  background: ${props => props.selected ? '#f0f0f0' : 'transparent'};
  border: ${props => props.selected ? '2px solid #2c3e50' : '1px solid #ddd'};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  cursor: pointer;
  margin: 0.5rem;
  transition: transform 0.2s, border 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const MoodLabel = styled.div`
  font-size: 0.8rem;
  text-align: center;
  margin-top: 0.25rem;
`;

const DateDisplay = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const MoodContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MoodItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const MoodIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const MoodDate = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  useEffect(() => {
    // Load mood entries from localStorage
    const savedEntries = loadFromLocalStorage<MoodEntry[]>(LOCAL_STORAGE_KEY, []);
    setMoodEntries(savedEntries);
    
    // Check if there's an entry for today
    const todayMoodEntry = savedEntries.find(entry => entry.date.startsWith(today));
    if (todayMoodEntry) {
      setTodayEntry(todayMoodEntry);
      setSelectedMood(todayMoodEntry.mood);
    }
  }, [today]);
  
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    
    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      mood,
    };
    
    let updatedEntries: MoodEntry[];
    
    if (todayEntry) {
      // Update today's entry
      updatedEntries = moodEntries.map(entry => 
        entry.date.startsWith(today) ? newEntry : entry
      );
    } else {
      // Add new entry
      updatedEntries = [...moodEntries, newEntry];
    }
    
    setMoodEntries(updatedEntries);
    setTodayEntry(newEntry);
    saveToLocalStorage(LOCAL_STORAGE_KEY, updatedEntries);
  };
  
  const getMoodColor = (mood: string) => {
    const moodObj = MOODS.find(m => m.emoji === mood);
    return moodObj ? moodObj.color : '#ccc';
  };
  
  return (
    <>
      <Card title="How are you feeling today?">
        <DateDisplay>{format(new Date(), 'EEEE, MMMM d, yyyy')}</DateDisplay>
        <MoodButtonsContainer>
          {MOODS.map(mood => (
            <div key={mood.emoji}>
              <MoodButton
                selected={selectedMood === mood.emoji}
                onClick={() => handleMoodSelect(mood.emoji)}
              >
                {mood.emoji}
              </MoodButton>
              <MoodLabel>{mood.label}</MoodLabel>
            </div>
          ))}
        </MoodButtonsContainer>
        
        {selectedMood && (
          <div style={{ textAlign: 'center' }}>
            <p>You're feeling {MOODS.find(m => m.emoji === selectedMood)?.label} today!</p>
          </div>
        )}
      </Card>
      
      <Card title="Monthly Mood Calendar">
        <MoodCalendar 
          moodEntries={moodEntries} 
          getMoodColor={getMoodColor}
        />
      </Card>
      
      <Card title="Recent Moods">
        <MoodContainer>
          {moodEntries.length === 0 ? (
            <p>No mood entries yet. Start tracking your mood above!</p>
          ) : (
            moodEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 7)
              .map(entry => (
                <MoodItem key={entry.date}>
                  <MoodIcon>{entry.mood}</MoodIcon>
                  <MoodDate>{format(new Date(entry.date), 'MMM d, yyyy')}</MoodDate>
                </MoodItem>
              ))
          )}
        </MoodContainer>
      </Card>
    </>
  );
};

export default MoodTracker; 