import React from 'react'
import { Link } from 'react-router-dom'
import ProgressDashboard from '../components/ProgressDashboard'
import '../styles/Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Welcome to FitSmart</h1>
        <p>Your personalized fitness companion</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <ProgressDashboard />
        </div>

        <div className="dashboard-section quick-stats">
          <h3>📈 Quick Stats</h3>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Workouts This Week</span>
              <span className="stat-value">3</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Current Streak</span>
              <span className="stat-value">5 days</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Calories Burned</span>
              <span className="stat-value">2.5k</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-full features-section">
        <h2>🎯 Features</h2>
        <p className="features-intro">Explore all the tools available to support your fitness journey</p>
      </div>

      <div className="quick-links">
        <Link to="/workouts" className="quick-link-btn">
          <span>🏋️</span> Browse Workouts
        </Link>
        <Link to="/progress" className="quick-link-btn">
          <span>📊</span> View Progress
        </Link>
        <Link to="/food" className="quick-link-btn">
          <span>🍎</span> Track Food
        </Link>
        <Link to="/reminders" className="quick-link-btn">
          <span>🔔</span> Set Reminders
        </Link>
        <Link to="/profile" className="quick-link-btn">
          <span>👤</span> My Profile
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
