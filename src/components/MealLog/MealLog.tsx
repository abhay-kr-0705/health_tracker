import React, { useState, useEffect, FormEvent } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import Card from '../Layout/Card';
import ChartWrapper from '../Layout/ChartWrapper';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

interface Meal {
  id: string;
  name: string;
  calories: number;
  date: string; // ISO date string
  time: string; // HH:MM format
}

const LOCAL_STORAGE_KEY = 'mealLogData';

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

const SubmitButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #219653;
  }
`;

const MealList = styled.div`
  margin-top: 1.5rem;
`;

const MealItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #27ae60;
`;

const MealInfo = styled.div`
  flex: 1;
`;

const MealName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const MealDetails = styled.div`
  font-size: 0.85rem;
  color: #666;
  display: flex;
  gap: 1rem;
`;

const CalorieCount = styled.div`
  font-weight: 600;
  color: #27ae60;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1.1rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const CalorieSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const TotalCalories = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.color || '#333'};
`;

const CalorieLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const MealLog: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
  });
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  useEffect(() => {
    // Load meals from localStorage
    const savedMeals = loadFromLocalStorage<Meal[]>(LOCAL_STORAGE_KEY, []);
    setMeals(savedMeals);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.calories.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    const now = new Date();
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: formData.name,
      calories: parseInt(formData.calories),
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm'),
    };
    
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    saveToLocalStorage(LOCAL_STORAGE_KEY, updatedMeals);
    
    // Reset form
    setFormData({
      name: '',
      calories: '',
    });
  };
  
  const handleDelete = (id: string) => {
    const updatedMeals = meals.filter(meal => meal.id !== id);
    setMeals(updatedMeals);
    saveToLocalStorage(LOCAL_STORAGE_KEY, updatedMeals);
  };
  
  // Filter today's meals
  const todayMeals = meals.filter(meal => meal.date === today);
  
  // Calculate total calories for today
  const totalCaloriesToday = todayMeals.reduce(
    (sum, meal) => sum + meal.calories, 
    0
  );
  
  // Get data for the weekly chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();
  
  const caloriesByDay = last7Days.map(date => {
    const dayMeals = meals.filter(meal => meal.date === date);
    return dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  });
  
  const chartData = {
    labels: last7Days.map(date => format(new Date(date), 'EEE')),
    datasets: [
      {
        label: 'Calories',
        data: caloriesByDay,
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        borderColor: 'rgba(39, 174, 96, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
  
  // Determine color based on calorie intake
  const getCalorieColor = (calories: number) => {
    if (calories < 1500) return '#3498db'; // Under target
    if (calories > 2500) return '#e74c3c'; // Over target
    return '#27ae60'; // Within target range
  };
  
  return (
    <>
      <Card title="Add Meal">
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">Food Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Grilled Chicken Salad"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="calories">Calories</Label>
              <Input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                placeholder="e.g., 350"
                min="0"
              />
            </FormGroup>
          </FormRow>
          <SubmitButton type="submit">Add Meal</SubmitButton>
        </Form>
      </Card>
      
      <Card title="Today's Meals">
        {todayMeals.length > 0 ? (
          <MealList>
            {todayMeals.map(meal => (
              <MealItem key={meal.id}>
                <MealInfo>
                  <MealName>{meal.name}</MealName>
                  <MealDetails>
                    <span>Time: {meal.time}</span>
                  </MealDetails>
                </MealInfo>
                <CalorieCount>{meal.calories} cal</CalorieCount>
                <DeleteButton onClick={() => handleDelete(meal.id)}>×</DeleteButton>
              </MealItem>
            ))}
            
            <CalorieSummary>
              <CalorieLabel>Total Calories Today</CalorieLabel>
              <TotalCalories color={getCalorieColor(totalCaloriesToday)}>
                {totalCaloriesToday} cal
              </TotalCalories>
            </CalorieSummary>
          </MealList>
        ) : (
          <EmptyState>
            No meals logged for today. Add your first meal using the form above!
          </EmptyState>
        )}
      </Card>
      
      <Card title="Weekly Calorie Intake">
        <ChartWrapper 
          type="line" 
          data={chartData} 
          height={250}
        />
      </Card>
    </>
  );
};

export default MealLog; 