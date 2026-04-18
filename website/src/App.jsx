import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ExercisePlanner from './pages/ExercisePlanner'
import ProgressPage from './pages/ProgressPage'
import RemindersPage from './pages/RemindersPage'
import ProfilePage from './pages/ProfilePage'
import FoodTrackerPage from './pages/FoodTrackerPage'
import Navbar from './components/Navbar'
import BotChat from './components/BotChat'
import './styles/globals.css'

function App() {
  const [showBot, setShowBot] = useState(false)
  const BOT_URL = 'http://localhost:8000/'

  const toggleBot = () => {
    setShowBot(!showBot)
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<ExercisePlanner />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/food" element={<FoodTrackerPage />} />
        </Routes>
        
        {/* Floating Bot Chat Button */}
        <button 
          className="bot-toggle-btn"
          onClick={toggleBot}
          title="Open AI Assistant"
          aria-label="Toggle AI Assistant"
          aria-expanded={showBot}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/>
          </svg>
        </button>

        {showBot && <BotChat botUrl={BOT_URL} />}
      </div>
    </Router>
  )
}

export default App
