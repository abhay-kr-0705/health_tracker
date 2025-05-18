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

const MoodButton = styled.button<{ selected: boolean; color: string }>`
  background: ${props => props.selected ? props.color + '40' : 'white'};
  border: ${props => props.selected ? `3px solid ${props.color}` : '1px solid #ddd'};
  border-radius: 50%;
  width: 70px;
  height: 70px;
  font-size: 2.2rem;
  cursor: pointer;
  margin: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.selected ? `0 5px 15px ${props.color}40` : '0 3px 8px rgba(0,0,0,0.05)'};
  
  &:hover, &:focus {
    transform: ${props => props.selected ? 'scale(1.05)' : 'scale(1.1)'};
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    border-color: ${props => props.color};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  animation: ${props => props.selected ? 'pulse 1s' : 'none'};
`;

const MoodLabel = styled.div<{ selected: boolean; color: string }>`
  font-size: 0.85rem;
  text-align: center;
  margin-top: 0.5rem;
  font-weight: ${props => props.selected ? '600' : '400'};
  color: ${props => props.selected ? props.color : 'var(--text-secondary)'};
  transition: all 0.3s ease;
`;

const DateDisplay = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-primary);
  padding: 0.5rem;
  background-color: rgba(0,0,0,0.02);
  border-radius: 8px;
`;

const MoodContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MoodItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
  padding: 0.75rem 1rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  width: 100%;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 3px 15px rgba(0,0,0,0.08);
  }
`;

const MoodIcon = styled.span`
  font-size: 1.8rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
`;

const MoodDate = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
  flex: 1;
`;

const SelectedMoodMessage = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-weight: 500;
  animation: fadeIn 0.5s ease-out;
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
  
  const findMoodByEmoji = (emoji: string) => {
    return MOODS.find(m => m.emoji === emoji);
  };
  
  return (
    <>
      <Card title="How are you feeling today?" icon="😊" accentColor="#FFD700">
        <DateDisplay>{format(new Date(), 'EEEE, MMMM d, yyyy')}</DateDisplay>
        <MoodButtonsContainer>
          {MOODS.map(mood => {
            const isSelected = selectedMood === mood.emoji;
            return (
              <div key={mood.emoji}>
                <MoodButton
                  selected={isSelected}
                  onClick={() => handleMoodSelect(mood.emoji)}
                  color={mood.color}
                >
                  {mood.emoji}
                </MoodButton>
                <MoodLabel 
                  selected={isSelected}
                  color={mood.color}
                >
                  {mood.label}
                </MoodLabel>
              </div>
            );
          })}
        </MoodButtonsContainer>
        
        {selectedMood && (
          <SelectedMoodMessage>
            You're feeling {findMoodByEmoji(selectedMood)?.label} today!
          </SelectedMoodMessage>
        )}
      </Card>
      
      <Card title="Monthly Mood Calendar" icon="📅">
        <MoodCalendar 
          moodEntries={moodEntries} 
          getMoodColor={getMoodColor}
        />
      </Card>
      
      <Card title="Recent Moods" icon="📝">
        <MoodContainer>
          {moodEntries.length === 0 ? (
            <p>No mood entries yet. Start tracking your mood above!</p>
          ) : (
            moodEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 7)
              .map((entry, index) => (
                <MoodItem 
                  key={entry.date}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MoodIcon>{entry.mood}</MoodIcon>
                  <MoodDate>{format(new Date(entry.date), 'EEEE, MMM d, yyyy')}</MoodDate>
                </MoodItem>
              ))
          )}
        </MoodContainer>
      </Card>
    </>
  );
};

export default MoodTracker; 