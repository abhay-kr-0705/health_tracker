import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import MoodTracker from './components/MoodTracker/MoodTracker';
import WaterTracker from './components/WaterTracker/WaterTracker';
import BreathingExercise from './components/BreathingExercise/BreathingExercise';
import MealLog from './components/MealLog/MealLog';
import SleepTracker from './components/SleepTracker/SleepTracker';
import FitnessRoutine from './components/FitnessRoutine/FitnessRoutine';
import StretchSequence from './components/StretchSequence/StretchSequence';
import MentalHealthJournal from './components/MentalHealthJournal/MentalHealthJournal';
import WeightTracker from './components/WeightTracker/WeightTracker';
import GlobalStyles from './styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/water" element={<WaterTracker />} />
          <Route path="/breathing" element={<BreathingExercise />} />
          <Route path="/meals" element={<MealLog />} />
          <Route path="/sleep" element={<SleepTracker />} />
          <Route path="/fitness" element={<FitnessRoutine />} />
          <Route path="/stretch" element={<StretchSequence />} />
          <Route path="/journal" element={<MentalHealthJournal />} />
          <Route path="/weight" element={<WeightTracker />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
