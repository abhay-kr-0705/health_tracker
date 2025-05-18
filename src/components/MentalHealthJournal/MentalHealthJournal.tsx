import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import Card from '../Layout/Card';
import ChartWrapper from '../Layout/ChartWrapper';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface JournalEntry {
  id: string;
  date: string; // ISO string
  content: string;
  tags: string[];
  mood: number; // 1-5 scale
}

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😊'];

const PREDEFINED_TAGS = [
  { id: 'anxious', label: 'Anxious', color: '#e74c3c' },
  { id: 'calm', label: 'Calm', color: '#3498db' },
  { id: 'stressed', label: 'Stressed', color: '#e67e22' },
  { id: 'grateful', label: 'Grateful', color: '#27ae60' },
  { id: 'motivated', label: 'Motivated', color: '#9b59b6' },
  { id: 'tired', label: 'Tired', color: '#95a5a6' },
  { id: 'excited', label: 'Excited', color: '#f1c40f' },
  { id: 'sad', label: 'Sad', color: '#34495e' },
];

const LOCAL_STORAGE_KEY = 'mentalHealthJournalData';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 150px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.button<{ selected: boolean; color: string }>`
  background-color: ${props => props.selected ? props.color : 'transparent'};
  color: ${props => props.selected ? 'white' : props.color};
  border: 1px solid ${props => props.color};
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? props.color : `${props.color}22`};
  }
`;

const MoodSelector = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const MoodOption = styled.button<{ selected: boolean }>`
  background-color: ${props => props.selected ? '#f5f5f5' : 'transparent'};
  border: ${props => props.selected ? '2px solid #3498db' : '1px solid #ddd'};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
    border-color: #3498db;
  }
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EntryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const EntryDate = styled.div`
  font-weight: 600;
  color: #2c3e50;
`;

const EntryMood = styled.div`
  font-size: 1.5rem;
`;

const EntryContent = styled.div`
  margin-bottom: 1rem;
  white-space: pre-wrap;
  color: #333;
`;

const EntryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const EntryTag = styled.span<{ color: string }>`
  background-color: ${props => props.color};
  color: white;
  border-radius: 50px;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterLabel = styled.span`
  font-weight: 600;
  margin-right: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #7f8c8d;
`;

const MentalHealthJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [formData, setFormData] = useState({
    content: '',
    tags: [] as string[],
    mood: 2, // Default to neutral mood (index 2)
  });
  const [filterTag, setFilterTag] = useState<string | null>(null);
  
  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = loadFromLocalStorage<JournalEntry[]>(LOCAL_STORAGE_KEY, []);
    setEntries(savedEntries);
  }, []);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value,
    }));
  };
  
  const handleTagToggle = (tagId: string) => {
    setFormData(prev => {
      const isSelected = prev.tags.includes(tagId);
      
      if (isSelected) {
        return {
          ...prev,
          tags: prev.tags.filter(id => id !== tagId),
        };
      } else {
        return {
          ...prev,
          tags: [...prev.tags, tagId],
        };
      }
    });
  };
  
  const handleMoodSelect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mood: index,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      alert('Please enter some journal content');
      return;
    }
    
    const newEntry: JournalEntry = {
      id: uuidv4(),
      date: new Date().toISOString(),
      content: formData.content.trim(),
      tags: formData.tags,
      mood: formData.mood,
    };
    
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveToLocalStorage(LOCAL_STORAGE_KEY, updatedEntries);
    
    // Reset form
    setFormData({
      content: '',
      tags: [],
      mood: 2,
    });
  };
  
  const handleFilterTagClick = (tagId: string) => {
    setFilterTag(prev => prev === tagId ? null : tagId);
  };
  
  // Filter entries by tag if a filter is active
  const filteredEntries = filterTag
    ? entries.filter(entry => entry.tags.includes(filterTag))
    : entries;
  
  // Get data for the mood frequency chart
  const tagFrequency = PREDEFINED_TAGS.map(tag => {
    const count = entries.filter(entry => entry.tags.includes(tag.id)).length;
    return {
      id: tag.id,
      label: tag.label,
      count,
      color: tag.color,
    };
  }).filter(tag => tag.count > 0);
  
  const tagChartData = {
    labels: tagFrequency.map(tag => tag.label),
    datasets: [
      {
        label: 'Frequency',
        data: tagFrequency.map(tag => tag.count),
        backgroundColor: tagFrequency.map(tag => tag.color),
        borderWidth: 1,
      },
    ],
  };
  
  // Get data for the mood distribution chart
  const moodCounts = Array(5).fill(0);
  
  entries.forEach(entry => {
    moodCounts[entry.mood]++;
  });
  
  const moodChartData = {
    labels: ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'],
    datasets: [
      {
        label: 'Mood Distribution',
        data: moodCounts,
        backgroundColor: [
          '#e74c3c', // Red
          '#e67e22', // Orange
          '#f1c40f', // Yellow
          '#27ae60', // Green
          '#2ecc71', // Light Green
        ],
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <Container>
      <Card title="New Journal Entry">
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <Label htmlFor="content">How are you feeling today?</Label>
            <TextArea
              id="content"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your thoughts here..."
            />
          </FormSection>
          
          <FormSection>
            <Label>Add tags to describe your feelings</Label>
            <TagsContainer>
              {PREDEFINED_TAGS.map(tag => (
                <Tag
                  key={tag.id}
                  selected={formData.tags.includes(tag.id)}
                  color={tag.color}
                  onClick={() => handleTagToggle(tag.id)}
                  type="button"
                >
                  {tag.label}
                </Tag>
              ))}
            </TagsContainer>
          </FormSection>
          
          <FormSection>
            <Label>Rate your mood</Label>
            <MoodSelector>
              {MOOD_EMOJIS.map((emoji, index) => (
                <MoodOption
                  key={index}
                  selected={formData.mood === index}
                  onClick={() => handleMoodSelect(index)}
                  type="button"
                >
                  {emoji}
                </MoodOption>
              ))}
            </MoodSelector>
          </FormSection>
          
          <SubmitButton type="submit">Save Journal Entry</SubmitButton>
        </Form>
      </Card>
      
      <Card title="Mood & Tag Analysis">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ChartWrapper
            type="bar"
            data={tagChartData}
            height={250}
            title="Tag Frequency"
          />
          
          <ChartWrapper
            type="bar"
            data={moodChartData}
            height={250}
            title="Mood Distribution"
          />
        </div>
      </Card>
      
      <Card title="Journal Entries">
        <FilterContainer>
          <FilterLabel>Filter by tag:</FilterLabel>
          {PREDEFINED_TAGS.map(tag => (
            <Tag
              key={tag.id}
              selected={filterTag === tag.id}
              color={tag.color}
              onClick={() => handleFilterTagClick(tag.id)}
              type="button"
            >
              {tag.label}
            </Tag>
          ))}
        </FilterContainer>
        
        <EntriesContainer>
          {filteredEntries.length > 0 ? (
            filteredEntries.map(entry => {
              const entryDate = new Date(entry.date);
              
              return (
                <EntryCard key={entry.id}>
                  <EntryHeader>
                    <EntryDate>{format(entryDate, 'EEEE, MMMM d, yyyy h:mm a')}</EntryDate>
                    <EntryMood>{MOOD_EMOJIS[entry.mood]}</EntryMood>
                  </EntryHeader>
                  <EntryContent>{entry.content}</EntryContent>
                  <EntryTags>
                    {entry.tags.map(tagId => {
                      const tag = PREDEFINED_TAGS.find(t => t.id === tagId);
                      if (!tag) return null;
                      
                      return (
                        <EntryTag key={tagId} color={tag.color}>
                          {tag.label}
                        </EntryTag>
                      );
                    })}
                  </EntryTags>
                </EntryCard>
              );
            })
          ) : (
            <EmptyState>
              {filterTag 
                ? `No journal entries found with the selected tag.`
                : `No journal entries yet. Start journaling to track your mental health!`
              }
            </EmptyState>
          )}
        </EntriesContainer>
      </Card>
    </Container>
  );
};

export default MentalHealthJournal; 