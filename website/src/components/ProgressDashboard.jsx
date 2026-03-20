import React, { useState, useEffect } from 'react'
import { getWorkoutStats, getTodayNutritionSummary } from '../utils/trackingUtils'
import './ProgressDashboard.css'

function ProgressDashboard() {
  const [stats, setStats] = useState(null)
  const [nutrition, setNutrition] = useState(null)

  useEffect(() => {
    const updateStats = () => {
      setStats(getWorkoutStats())
      setNutrition(getTodayNutritionSummary())
    }

    updateStats()
    const interval = setInterval(updateStats, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  if (!stats) return <div className="progress-loading">Loading progress...</div>

  return (
    <section className="progress-dashboard" aria-label="Progress dashboard">
      <div className="dashboard-header">
        <h3>📊 Your Progress</h3>
        <p>This Week's Summary</p>
      </div>

      <div className="progress-grid">
        {/* Workouts This Week */}
        <div className="progress-card">
          <div className="card-icon">🏃</div>
          <div className="card-content">
            <p className="card-label">Workouts This Week</p>
            <p className="card-value">{stats.thisWeekWorkouts}</p>
            <p className="card-meta">
              {stats.thisWeekMinutes} min total
            </p>
          </div>
          <div className="card-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min((stats.thisWeekWorkouts / 5) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round((stats.thisWeekWorkouts / 5) * 100)}% of goal</span>
          </div>
        </div>

        {/* Total Stats */}
        <div className="progress-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <p className="card-label">All Time</p>
            <p className="card-value">{stats.totalWorkouts} workouts</p>
            <p className="card-meta">
              {Math.round(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m total
            </p>
          </div>
        </div>

        {/* Average Workout Duration */}
        <div className="progress-card">
          <div className="card-icon">⏱️</div>
          <div className="card-content">
            <p className="card-label">Avg Workout Time</p>
            <p className="card-value">{stats.averageWorkoutDuration}m</p>
            <p className="card-meta">
              This week
            </p>
          </div>
        </div>

        {/* Nutrition Today */}
        <div className="progress-card">
          <div className="card-icon">🍎</div>
          <div className="card-content">
            <p className="card-label">Today's Nutrition</p>
            <p className="card-value">{nutrition.totalCalories} cal</p>
            <p className="card-meta">
              {nutrition.mealCount} meals logged
            </p>
          </div>
          <div className="card-progress">
            <div className="nutrition-macros">
              <span>P: {nutrition.totalProtein}g</span>
              <span>C: {nutrition.totalCarbs}g</span>
              <span>F: {nutrition.totalFat}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Workout Info */}
      {stats.lastWorkoutDate && (
        <div className="last-workout">
          <p className="last-workout-label">Last Workout:</p>
          <p className="last-workout-time">
            {new Date(stats.lastWorkoutDate).toLocaleDateString()} at {new Date(stats.lastWorkoutDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
    </section>
  )
}

export default ProgressDashboard
