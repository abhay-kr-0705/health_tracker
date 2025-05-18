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
  subMonths,
  getMonth,
  getYear
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
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
`;

const MonthNavButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  color: var(--text-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-color);
    background-color: rgba(52, 152, 219, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MonthTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: var(--text-primary);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MonthYearSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MonthIcon = styled.span`
  font-size: 1.4rem;
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  text-align: center;
  padding: 0 0.5rem;
`;

const Weekday = styled.div`
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  padding: 0.5rem;
`;

const DayCell = styled.div<{ 
  isCurrentMonth: boolean; 
  isToday: boolean;
  bgColor?: string;
  hasMood: boolean;
}>`
  position: relative;
  height: 0;
  padding-bottom: 100%;
  background-color: ${props => props.bgColor ? 
    `${props.bgColor}${props.isCurrentMonth ? '30' : '15'}` : 
    props.isCurrentMonth ? '#f9f9f9' : '#f5f5f5'
  };
  opacity: ${props => props.isCurrentMonth ? 1 : 0.5};
  border: ${props => props.isToday ? '2px solid var(--primary-color)' : '1px solid #eee'};
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: ${props => props.hasMood ? 'pointer' : 'default'};
  
  &:hover {
    transform: ${props => props.isCurrentMonth ? 'scale(1.05)' : 'none'};
    box-shadow: ${props => props.isCurrentMonth ? '0 3px 10px rgba(0, 0, 0, 0.1)' : 'none'};
    z-index: 5;
  }
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
  padding: 0.25rem;
`;

const DayNumber = styled.span<{ isCurrentMonth: boolean }>`
  font-size: 0.85rem;
  font-weight: ${props => props.isCurrentMonth ? '600' : '400'};
  color: ${props => props.isCurrentMonth ? 'var(--text-primary)' : 'var(--text-secondary)'};
`;

const MoodEmoji = styled.span`
  font-size: 1.25rem;
  margin-top: 0.2rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition: transform 0.2s ease;
  
  ${DayCell}:hover & {
    transform: scale(1.2);
  }
`;

const MoodTooltip = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  background-color: #333;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 10;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
  
  ${DayCell}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
`;

const CalendarFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
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

  // Function to get month emoji
  const getMonthEmoji = (month: number) => {
    const emojis = ['❄️', '💘', '🌱', '🌷', '🌞', '☀️', '🏖️', '🍉', '🍂', '🎃', '🦃', '🎄'];
    return emojis[month];
  };
  
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

  // Get unique mood emojis to display in legend
  const uniqueMoods = Array.from(new Set(moodEntries.map(entry => entry.mood)));
  
  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavButton onClick={handlePrevMonth} aria-label="Previous month">&lt;</MonthNavButton>
        <MonthYearSelector>
          <MonthTitle>
            <MonthIcon>{getMonthEmoji(getMonth(currentDate))}</MonthIcon>
            {format(currentDate, 'MMMM yyyy')}
          </MonthTitle>
        </MonthYearSelector>
        <MonthNavButton onClick={handleNextMonth} aria-label="Next month">&gt;</MonthNavButton>
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
          const hasMood = !!moodEntry;
          
          return (
            <DayCell 
              key={day.toString()}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              bgColor={moodEntry ? getMoodColor(moodEntry.mood) : undefined}
              hasMood={hasMood}
            >
              <DayContent>
                <DayNumber isCurrentMonth={isCurrentMonth}>{format(day, 'd')}</DayNumber>
                {moodEntry && (
                  <>
                    <MoodEmoji>{moodEntry.mood}</MoodEmoji>
                    <MoodTooltip>
                      {format(day, 'MMMM d, yyyy')}: {moodEntry.mood}
                    </MoodTooltip>
                  </>
                )}
              </DayContent>
            </DayCell>
          );
        })}
      </DaysGrid>
      
      {uniqueMoods.length > 0 && (
        <CalendarFooter>
          {uniqueMoods.map(mood => (
            <LegendItem key={mood}>
              <LegendColor color={getMoodColor(mood)} />
              <span>{mood}</span>
            </LegendItem>
          ))}
        </CalendarFooter>
      )}
    </CalendarContainer>
  );
};

export default MoodCalendar; 