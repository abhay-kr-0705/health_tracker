import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Card from '../Layout/Card';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

interface Stretch {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  image: string; // URL or emoji
}

interface StretchSequenceData {
  stretches: Stretch[];
  lastModified: string;
}

const LOCAL_STORAGE_KEY = 'stretchSequenceData';

// Default stretches
const DEFAULT_STRETCHES: Stretch[] = [
  {
    id: 's1',
    name: 'Neck Stretch',
    description: 'Gently tilt your head to each side, holding for 10 seconds each.',
    duration: 30,
    image: '🧠',
  },
  {
    id: 's2',
    name: 'Shoulder Rolls',
    description: 'Roll your shoulders forward and backward in a circular motion.',
    duration: 30,
    image: '💪',
  },
  {
    id: 's3',
    name: 'Chest Opener',
    description: 'Clasp hands behind back, squeeze shoulder blades together, and lift arms.',
    duration: 30,
    image: '🫁',
  },
  {
    id: 's4',
    name: 'Standing Side Bend',
    description: 'Raise one arm over head and lean to the opposite side.',
    duration: 30,
    image: '🧘',
  },
  {
    id: 's5',
    name: 'Hamstring Stretch',
    description: 'Sit with legs extended and reach for toes.',
    duration: 30,
    image: '🦵',
  },
  {
    id: 's6',
    name: 'Quad Stretch',
    description: 'Stand on one leg, bring heel to buttocks and hold with hand.',
    duration: 30,
    image: '🦵',
  },
  {
    id: 's7',
    name: 'Calf Stretch',
    description: 'Step forward with one leg and press heel of back leg into the floor.',
    duration: 30,
    image: '🦶',
  },
];

const SequenceContainer = styled.div`
  margin-bottom: 2rem;
`;

const StretchItem = styled.div<{ isDragging: boolean }>`
  padding: 1rem;
  background-color: ${props => props.isDragging ? '#f0f7fb' : 'white'};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  box-shadow: ${props => 
    props.isDragging 
      ? '0 4px 12px rgba(52, 152, 219, 0.3)' 
      : '0 1px 3px rgba(0, 0, 0, 0.1)'
  };
  transition: box-shadow 0.3s, transform 0.2s, background-color 0.3s;
  position: relative;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const DragHandle = styled.div`
  width: 16px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 1rem;
  cursor: grab;
  color: #aaa;
  
  &:before, &:after {
    content: "";
    width: 16px;
    height: 2px;
    background-color: currentColor;
    margin: 2px 0;
    border-radius: 1px;
  }
  
  &:before {
    box-shadow: 0 -4px 0 currentColor, 0 4px 0 currentColor;
  }
`;

const StretchIcon = styled.div`
  font-size: 2rem;
  margin-right: 1rem;
  width: 40px;
  display: flex;
  justify-content: center;
`;

const StretchInfo = styled.div`
  flex: 1;
`;

const StretchName = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
`;

const StretchDescription = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #666;
`;

const StretchDuration = styled.div`
  font-weight: bold;
  padding-left: 1rem;
  color: #3498db;
  white-space: nowrap;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ResetButton = styled(Button)`
  background-color: #e74c3c;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const ActiveSessionContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f0f7fb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const CurrentStretchName = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #2c3e50;
`;

const CurrentStretchIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const TimerCircle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 1.5rem auto;
  position: relative;
  
  &:after {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    border: 2px dashed rgba(255, 255, 255, 0.5);
  }
`;

const CurrentStretchDescription = styled.p`
  margin: 1rem 0;
  color: #7f8c8d;
  font-size: 1rem;
`;

const NextUpText = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 2rem;
`;

const NextStretchName = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

const FinishText = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #27ae60;
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f1f1f1;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1.5rem;
`;

const ProgressFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => `${props.percent}%`};
  background-color: #3498db;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
`;

const InstructionText = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin: 1rem 0;
`;

const StretchSequence: React.FC = () => {
  const [stretches, setStretches] = useState<Stretch[]>(DEFAULT_STRETCHES);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentStretchIndex, setCurrentStretchIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Load stretch sequence from localStorage or use default
    const savedData = loadFromLocalStorage<StretchSequenceData>(
      LOCAL_STORAGE_KEY, 
      { stretches: DEFAULT_STRETCHES, lastModified: new Date().toISOString() }
    );
    setStretches(savedData.stretches);
  }, []);
  
  useEffect(() => {
    if (isSessionActive && !isPaused) {
      // Start or resume the timer
      setTimer(stretches[currentStretchIndex].duration);
      
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            // Move to next stretch
            clearInterval(intervalRef.current as NodeJS.Timeout);
            
            if (currentStretchIndex < stretches.length - 1) {
              setCurrentStretchIndex(prevIndex => prevIndex + 1);
              return stretches[currentStretchIndex + 1].duration;
            } else {
              // Session complete
              setIsSessionActive(false);
              return 0;
            }
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSessionActive, isPaused, currentStretchIndex, stretches]);
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    
    // If dropped outside the list
    if (!destination) return;
    
    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Reorder the list
    const newStretches = Array.from(stretches);
    const [removed] = newStretches.splice(source.index, 1);
    newStretches.splice(destination.index, 0, removed);
    
    setStretches(newStretches);
    saveStretchesToStorage(newStretches);
  };
  
  const saveStretchesToStorage = (stretchList: Stretch[]) => {
    saveToLocalStorage(LOCAL_STORAGE_KEY, {
      stretches: stretchList,
      lastModified: new Date().toISOString(),
    });
  };
  
  const startSession = () => {
    setIsSessionActive(true);
    setCurrentStretchIndex(0);
    setIsPaused(false);
    setTimer(stretches[0].duration);
  };
  
  const stopSession = () => {
    setIsSessionActive(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const resetToDefault = () => {
    if (window.confirm('Reset stretch sequence to default?')) {
      setStretches(DEFAULT_STRETCHES);
      saveStretchesToStorage(DEFAULT_STRETCHES);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const currentStretch = isSessionActive ? stretches[currentStretchIndex] : null;
  const nextStretch = isSessionActive && currentStretchIndex < stretches.length - 1 
    ? stretches[currentStretchIndex + 1] 
    : null;
  
  const progressPercent = isSessionActive 
    ? ((currentStretchIndex + 1) / stretches.length) * 100 
    : 0;
  
  return (
    <>
      <Card title="Stretch Sequence">
        <SequenceContainer>
          <InstructionText>
            Drag and drop to reorder stretches. Each stretch will be timed during the sequence.
          </InstructionText>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="stretches">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {stretches.map((stretch, index) => (
                    <Draggable
                      key={stretch.id}
                      draggableId={stretch.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <StretchItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          isDragging={snapshot.isDragging}
                        >
                          <div {...provided.dragHandleProps}>
                            <DragHandle />
                          </div>
                          <StretchIcon>{stretch.image}</StretchIcon>
                          <StretchInfo>
                            <StretchName>{stretch.name}</StretchName>
                            <StretchDescription>{stretch.description}</StretchDescription>
                          </StretchInfo>
                          <StretchDuration>{formatTime(stretch.duration)}</StretchDuration>
                        </StretchItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <ButtonContainer>
            <ResetButton onClick={resetToDefault}>
              Reset to Default
            </ResetButton>
            <Button
              onClick={startSession}
              disabled={isSessionActive}
            >
              Start Sequence
            </Button>
          </ButtonContainer>
        </SequenceContainer>
        
        {isSessionActive && currentStretch && (
          <ActiveSessionContainer>
            <CurrentStretchName>{currentStretch.name}</CurrentStretchName>
            <CurrentStretchIcon>{currentStretch.image}</CurrentStretchIcon>
            <CurrentStretchDescription>{currentStretch.description}</CurrentStretchDescription>
            
            <TimerCircle>{formatTime(timer)}</TimerCircle>
            
            <ButtonContainer>
              <Button onClick={togglePause}>
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <ResetButton onClick={stopSession}>
                Stop Session
              </ResetButton>
            </ButtonContainer>
            
            {nextStretch ? (
              <NextUpText>
                Next up: <NextStretchName>{nextStretch.name}</NextStretchName>
              </NextUpText>
            ) : (
              <FinishText>Last stretch!</FinishText>
            )}
            
            <ProgressBar>
              <ProgressFill percent={progressPercent} />
            </ProgressBar>
            <ProgressText>
              Stretch {currentStretchIndex + 1} of {stretches.length}
            </ProgressText>
          </ActiveSessionContainer>
        )}
      </Card>
    </>
  );
};

export default StretchSequence; 