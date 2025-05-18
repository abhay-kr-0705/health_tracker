import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Card from '../Layout/Card';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  completed: boolean;
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

const LOCAL_STORAGE_KEY = 'fitnessRoutineData';

const WorkoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WorkoutTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
`;

const WorkoutTab = styled.button<{ selected: boolean }>`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.selected ? '#9b59b6' : '#f8f9fa'};
  color: ${props => props.selected ? 'white' : '#333'};
  font-weight: ${props => props.selected ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.selected ? '#8e44ad' : '#eee'};
  }
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ExerciseItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${props => props.completed ? '#f1f9f1' : '#f8f9fa'};
  border-radius: 4px;
  border-left: 4px solid ${props => props.completed ? '#27ae60' : '#ddd'};
  
  ${props => props.completed && `
    text-decoration: line-through;
    opacity: 0.7;
  `}
`;

const ExerciseName = styled.div`
  font-weight: 500;
`;

const ExerciseControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TimerDisplay = styled.div`
  font-family: monospace;
  font-size: 1.1rem;
  min-width: 80px;
  text-align: center;
`;

const ActionButton = styled.button`
  background-color: #9b59b6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #8e44ad;
  }
  
  &:disabled {
    background-color: #d1bcd8;
    cursor: not-allowed;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
`;

const WorkoutProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f1f1f1;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => `${props.percent}%`};
  background-color: #9b59b6;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
`;

const CompleteButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #219653;
  }
  
  &:disabled {
    background-color: #a8e6c1;
    cursor: not-allowed;
  }
`;

// Predefined workouts
const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: 'beginner',
    name: 'Beginner Workout',
    exercises: [
      { id: 'b1', name: 'Jumping Jacks', duration: 30, completed: false },
      { id: 'b2', name: 'Wall Sit', duration: 20, completed: false },
      { id: 'b3', name: 'Push-Ups', duration: 30, completed: false },
      { id: 'b4', name: 'Abdominal Crunches', duration: 30, completed: false },
      { id: 'b5', name: 'Plank', duration: 20, completed: false },
    ],
  },
  {
    id: 'intermediate',
    name: 'Intermediate Workout',
    exercises: [
      { id: 'i1', name: 'Jumping Jacks', duration: 45, completed: false },
      { id: 'i2', name: 'Wall Sit', duration: 40, completed: false },
      { id: 'i3', name: 'Push-Ups', duration: 45, completed: false },
      { id: 'i4', name: 'Abdominal Crunches', duration: 45, completed: false },
      { id: 'i5', name: 'Plank', duration: 40, completed: false },
      { id: 'i6', name: 'High Knees', duration: 30, completed: false },
      { id: 'i7', name: 'Lunges', duration: 40, completed: false },
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced Workout',
    exercises: [
      { id: 'a1', name: 'Jumping Jacks', duration: 60, completed: false },
      { id: 'a2', name: 'Wall Sit', duration: 60, completed: false },
      { id: 'a3', name: 'Push-Ups', duration: 45, completed: false },
      { id: 'a4', name: 'Abdominal Crunches', duration: 60, completed: false },
      { id: 'a5', name: 'Plank', duration: 60, completed: false },
      { id: 'a6', name: 'High Knees', duration: 45, completed: false },
      { id: 'a7', name: 'Lunges', duration: 60, completed: false },
      { id: 'a8', name: 'Push-Up and Rotation', duration: 45, completed: false },
      { id: 'a9', name: 'Side Plank', duration: 30, completed: false },
    ],
  },
];

const FitnessRoutine: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(DEFAULT_WORKOUTS);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('beginner');
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Load workouts from localStorage or use defaults
    const savedWorkouts = loadFromLocalStorage<Workout[]>(LOCAL_STORAGE_KEY, DEFAULT_WORKOUTS);
    setWorkouts(savedWorkouts);
  }, []);
  
  useEffect(() => {
    if (isRunning && activeExerciseId) {
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            // Timer completed
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsRunning(false);
            markExerciseComplete(activeExerciseId);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, activeExerciseId]);
  
  const selectedWorkout = workouts.find(workout => workout.id === selectedWorkoutId) || workouts[0];
  
  const handleSelectWorkout = (workoutId: string) => {
    if (isRunning) {
      if (window.confirm('Timer is running. Are you sure you want to switch workouts?')) {
        stopTimer();
        setSelectedWorkoutId(workoutId);
      }
    } else {
      setSelectedWorkoutId(workoutId);
    }
  };
  
  const startTimer = (exerciseId: string, duration: number) => {
    if (isRunning && activeExerciseId !== exerciseId) {
      stopTimer();
    }
    
    setActiveExerciseId(exerciseId);
    setTimer(duration);
    setIsRunning(true);
  };
  
  const stopTimer = () => {
    setIsRunning(false);
    setActiveExerciseId(null);
  };
  
  const markExerciseComplete = (exerciseId: string) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === selectedWorkoutId) {
        const updatedExercises = workout.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            return { ...exercise, completed: true };
          }
          return exercise;
        });
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });
    
    setWorkouts(updatedWorkouts);
    saveToLocalStorage(LOCAL_STORAGE_KEY, updatedWorkouts);
  };
  
  const toggleExerciseComplete = (exerciseId: string, isCompleted: boolean) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === selectedWorkoutId) {
        const updatedExercises = workout.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            return { ...exercise, completed: isCompleted };
          }
          return exercise;
        });
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });
    
    setWorkouts(updatedWorkouts);
    saveToLocalStorage(LOCAL_STORAGE_KEY, updatedWorkouts);
  };
  
  const resetWorkout = () => {
    if (window.confirm('Reset all exercises in this workout?')) {
      const updatedWorkouts = workouts.map(workout => {
        if (workout.id === selectedWorkoutId) {
          const updatedExercises = workout.exercises.map(exercise => ({
            ...exercise,
            completed: false,
          }));
          return { ...workout, exercises: updatedExercises };
        }
        return workout;
      });
      
      setWorkouts(updatedWorkouts);
      saveToLocalStorage(LOCAL_STORAGE_KEY, updatedWorkouts);
      
      if (isRunning) {
        stopTimer();
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const completedExercises = selectedWorkout.exercises.filter(ex => ex.completed).length;
  const totalExercises = selectedWorkout.exercises.length;
  const progressPercent = (completedExercises / totalExercises) * 100;
  
  return (
    <>
      <Card title="Fitness Routines">
        <WorkoutTabs>
          {workouts.map(workout => (
            <WorkoutTab
              key={workout.id}
              selected={selectedWorkoutId === workout.id}
              onClick={() => handleSelectWorkout(workout.id)}
            >
              {workout.name}
            </WorkoutTab>
          ))}
        </WorkoutTabs>
        
        <WorkoutContainer>
          <ExerciseList>
            {selectedWorkout.exercises.map(exercise => (
              <ExerciseItem key={exercise.id} completed={exercise.completed}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Checkbox 
                    checked={exercise.completed}
                    onChange={e => toggleExerciseComplete(exercise.id, e.target.checked)}
                  />
                  <ExerciseName>{exercise.name}</ExerciseName>
                </div>
                
                <ExerciseControls>
                  <TimerDisplay>
                    {activeExerciseId === exercise.id 
                      ? formatTime(timer)
                      : formatTime(exercise.duration)
                    }
                  </TimerDisplay>
                  
                  {!exercise.completed && (
                    <ActionButton
                      onClick={() => 
                        isRunning && activeExerciseId === exercise.id
                          ? stopTimer()
                          : startTimer(exercise.id, exercise.duration)
                      }
                      disabled={isRunning && activeExerciseId !== exercise.id}
                    >
                      {isRunning && activeExerciseId === exercise.id ? 'Pause' : 'Start'}
                    </ActionButton>
                  )}
                </ExerciseControls>
              </ExerciseItem>
            ))}
          </ExerciseList>
          
          <WorkoutProgressBar>
            <ProgressFill percent={progressPercent} />
          </WorkoutProgressBar>
          <ProgressText>
            {completedExercises} of {totalExercises} exercises completed ({Math.round(progressPercent)}%)
          </ProgressText>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <ActionButton
              onClick={resetWorkout}
              style={{ flex: 1, backgroundColor: '#e74c3c' }}
            >
              Reset Workout
            </ActionButton>
            
            <CompleteButton
              disabled={completedExercises < totalExercises}
              onClick={() => alert('Great job completing your workout!')}
            >
              Complete Workout
            </CompleteButton>
          </div>
        </WorkoutContainer>
      </Card>
    </>
  );
};

export default FitnessRoutine; 