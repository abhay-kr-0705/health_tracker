import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';

interface MoodEntry {
  date: string; // ISO string
  mood: string;
}

interface MoodCalendarProps {
  moodEntries: MoodEntry[];
  getMoodColor: (mood: string) => string;
}

const CalendarContainer = styled.div`
  width: 100%;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthNavButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #2c3e50;
  
  &:hover {
    color: #3498db;
  }
`;

const MonthTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;
  text-align: center;
`;

const Weekday = styled.div`
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: #666;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayCell = styled.div<{ 
  isCurrentMonth: boolean; 
  isToday: boolean;
  bgColor?: string;
}>`
  position: relative;
  height: 0;
  padding-bottom: 100%;
  background-color: ${props => props.bgColor || 'transparent'};
  opacity: ${props => props.isCurrentMonth ? 1 : 0.3};
  border: ${props => props.isToday ? '2px solid #3498db' : '1px solid #eee'};
  border-radius: 4px;
`;

const DayContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DayNumber = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`;

const MoodEmoji = styled.span`
  font-size: 1rem;
  margin-top: 0.2rem;
`;

const MoodCalendar: React.FC<MoodCalendarProps> = ({ moodEntries, getMoodColor }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get all days needed for the calendar grid (including days from prev/next months)
  const startDay = monthStart.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const endDay = 6 - monthEnd.getDay();
  
  // Add days from previous month
  const daysFromPrevMonth = [];
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (i + 1));
    daysFromPrevMonth.push(date);
  }
  
  // Add days from next month
  const daysFromNextMonth = [];
  for (let i = 1; i <= endDay; i++) {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + i);
    daysFromNextMonth.push(date);
  }
  
  const allDays = [...daysFromPrevMonth, ...daysInMonth, ...daysFromNextMonth];
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const getMoodForDay = (date: Date): MoodEntry | undefined => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return moodEntries.find(entry => entry.date.startsWith(formattedDate));
  };
  
  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavButton onClick={handlePrevMonth}>&lt;</MonthNavButton>
        <MonthTitle>{format(currentDate, 'MMMM yyyy')}</MonthTitle>
        <MonthNavButton onClick={handleNextMonth}>&gt;</MonthNavButton>
      </CalendarHeader>
      
      <WeekdayHeader>
        {weekdays.map(day => (
          <Weekday key={day}>{day}</Weekday>
        ))}
      </WeekdayHeader>
      
      <DaysGrid>
        {allDays.map(day => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const moodEntry = getMoodForDay(day);
          
          return (
            <DayCell 
              key={day.toString()}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              bgColor={moodEntry ? getMoodColor(moodEntry.mood) : undefined}
            >
              <DayContent>
                <DayNumber>{format(day, 'd')}</DayNumber>
                {moodEntry && <MoodEmoji>{moodEntry.mood}</MoodEmoji>}
              </DayContent>
            </DayCell>
          );
        })}
      </DaysGrid>
    </CalendarContainer>
  );
};

export default MoodCalendar; 