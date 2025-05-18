# Health Tracker App

A comprehensive wellness tracking application designed to help users monitor and improve their health habits. 

![Health Tracker Preview](https://via.placeholder.com/800x400?text=Health+Tracker+App)

## 🌟 Features

- **Dashboard** - Overview of all health metrics in one place, with sync support for wearable devices
- **Mood Tracker** - Track daily mood with emoji selections and view mood patterns on a color-coded calendar
- **Water Intake** - Monitor daily hydration with interactive cup visuals and goal tracking
- **Breathing Exercises** - Guided breathing animations with customizable patterns for stress reduction
- **Meal Log** - Record meals with calorie counting and nutritional summaries
- **Sleep Tracker** - Log sleep hours and view sleep quality trends over time
- **Fitness Routines** - Create and track workout routines with exercise timers
- **Stretch Sequences** - Visual guides for stretching with drag-and-drop customization
- **Mental Health Journal** - Document thoughts with mood tagging and keyword analysis
- **Weight Tracker** - Chart weight changes and set milestone goals

## 🚀 Technologies Used

- React 19
- TypeScript
- React Router v7
- Styled Components
- Chart.js for data visualization
- date-fns for date manipulation
- react-beautiful-dnd for drag-and-drop functionality
- Local Storage for data persistence
- Responsive design for all device sizes

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## 🔧 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/health-tracker.git
   cd health-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
health-tracker/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── MoodTracker/
│   │   ├── WaterTracker/
│   │   ├── BreathingExercise/
│   │   ├── MealLog/
│   │   ├── SleepTracker/
│   │   ├── FitnessRoutine/
│   │   ├── StretchSequence/
│   │   ├── MentalHealthJournal/
│   │   ├── WeightTracker/
│   │   └── Layout/
│   ├── styles/
│   │   └── GlobalStyles.tsx
│   ├── utils/
│   │   └── localStorage.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── README.md
```

## 🚢 Deployment

The app is deployed and accessible at: [https://health-tracker-app.netlify.app/](https://health-tracker-app.netlify.app/)

### Deploying your own version:

1. Build the production-ready application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy to Netlify, Vercel, or your preferred hosting platform.
   - The project includes a `netlify.toml` file for Netlify deployment configuration.

## 🔒 Data Privacy

All user data is stored locally in the browser's localStorage and never sent to any server, ensuring complete privacy.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Design inspiration from various health and wellness applications
- Icons and emojis used for intuitive visual representation
- All contributors who have helped improve the application

---

Built with ❤️ for better health tracking
