import React, { useState, useEffect } from 'react'
import '../styles/ProgressPage.css'

function ProgressPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [workouts, setWorkouts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Cardio',
    duration: 30,
    calories: 200
  })

  // Load workouts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fitness_workouts')
    if (saved) {
      setWorkouts(JSON.parse(saved))
    }
  }, [])

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fitness_workouts', JSON.stringify(workouts))
  }, [workouts])

  const addWorkout = (e) => {
    e.preventDefault()
    const newWorkout = {
      id: Date.now(),
      date: formData.date,
      type: formData.type,
      duration: parseInt(formData.duration),
      calories: parseInt(formData.calories)
    }
    setWorkouts([newWorkout, ...workouts])
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'Cardio',
      duration: 30,
      calories: 200
    })
    setShowForm(false)
  }

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id))
  }

  // Calculate stats
  const stats = {
    totalWorkouts: workouts.length,
    totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0),
    totalMinutes: workouts.reduce((sum, w) => sum + w.duration, 0),
    currentStreak: calculateStreak()
  }

  function calculateStreak() {
    if (workouts.length === 0) return 0
    const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date))
    let streak = 1
    let lastDate = new Date(sorted[0].date)
    
    for (let i = 1; i < sorted.length; i++) {
      const currentDate = new Date(sorted[i].date)
      const diffDays = Math.floor((lastDate - currentDate) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        streak++
        lastDate = currentDate
      } else {
        break
      }
    }
    return streak
  }

  // Get weekly progress
  const getWeeklyProgress = () => {
    const today = new Date()
    const weekDays = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      weekDays.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        date: date.toISOString().split('T')[0],
        calories: 0,
        workouts: 0
      })
    }

    workouts.forEach(workout => {
      const dayData = weekDays.find(d => d.date === workout.date)
      if (dayData) {
        dayData.calories += workout.calories
        dayData.workouts += 1
      }
    })

    return weekDays
  }

  const weeklyProgress = getWeeklyProgress()
  const maxCalories = Math.max(...weeklyProgress.map(w => w.calories), 1)

  // Get calendar info
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getWorkoutDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const days = []
    
    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date)
      if (workoutDate.getFullYear() === year && workoutDate.getMonth() === month) {
        days.push(workoutDate.getDate())
      }
    })
    
    return days
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const workoutDays = getWorkoutDaysInMonth()
  const calendarDays = []

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const recentWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  return (
    <div className="progress-page">
      {/* Header */}
      <div className="progress-header">
        <h1>📊 Your Progress</h1>
        <p>Track your fitness journey and celebrate your wins</p>
        <button 
          className="add-workout-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Log Workout'}
        </button>
      </div>

      {/* Add Workout Form */}
      {showForm && (
        <section className="add-workout-form">
          <h3>Log a New Workout</h3>
          <form onSubmit={addWorkout}>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Workout Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Cardio</option>
                <option>Strength</option>
                <option>HIIT</option>
                <option>Yoga</option>
                <option>Flexibility</option>
                <option>Sports</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="480"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Calories Burned</label>
              <input
                type="number"
                min="1"
                max="2000"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Log Workout</button>
          </form>
        </section>
      )}

      {/* Main Stats */}
      <section className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalWorkouts}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCalories.toLocaleString()}</div>
            <div className="stat-label">Calories Burned</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalMinutes}</div>
            <div className="stat-label">Total Minutes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
      </section>

      {/* Weekly Chart */}
      <section className="weekly-chart">
        <h2>Weekly Activity</h2>
        <div className="chart-container">
          {weeklyProgress.map((day, idx) => (
            <div key={idx} className="chart-bar">
              <div className="bar-visual">
                <div 
                  className="bar" 
                  style={{ 
                    height: day.calories > 0 ? `${(day.calories / maxCalories) * 100}%` : '5px',
                    background: day.calories === 0 ? '#e0e0e0' : 'linear-gradient(135deg, #667eea, #764ba2)'
                  }}
                  title={`${day.calories} cal`}
                />
              </div>
              <div className="bar-label">{day.day}</div>
              <div className="bar-value">{day.calories} cal</div>
            </div>
          ))}
        </div>
      </section>

      <div className="progress-content">
        {/* Calendar Section */}
        <section className="workout-calendar">
          <div className="calendar-header">
            <button onClick={prevMonth} className="calendar-nav-btn">←</button>
            <h2>{monthName}</h2>
            <button onClick={nextMonth} className="calendar-nav-btn">→</button>
          </div>
          <div className="calendar-weekdays">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
          </div>
          <div className="calendar-days">
            {calendarDays.map((day, idx) => (
              <div 
                key={idx} 
                className={`calendar-day ${day ? 'active' : 'empty'} ${workoutDays.includes(day) ? 'has-workout' : ''}`}
              >
                {day ? (
                  <>
                    <span className="day-number">{day}</span>
                    {workoutDays.includes(day) && <span className="workout-indicator">✓</span>}
                  </>
                ) : null}
              </div>
            ))}
          </div>
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-box has-workout"></div>
              <span>Workout Day</span>
            </div>
            <div className="legend-item">
              <div className="legend-box"></div>
              <span>Rest Day</span>
            </div>
          </div>
        </section>

        {/* Recent Workouts Summary */}
        {recentWorkouts.length > 0 && (
          <section className="achievements">
            <h2>💪 Quick Stats</h2>
            <div className="achievement-grid">
              <div className="stat-summary">
                <div className="summary-icon">🎯</div>
                <div className="summary-text">
                  <div className="summary-value">{recentWorkouts.length}</div>
                  <div className="summary-label">Recent Workouts</div>
                </div>
              </div>
              <div className="stat-summary">
                <div className="summary-icon">⏱️</div>
                <div className="summary-text">
                  <div className="summary-value">{recentWorkouts.reduce((sum, w) => sum + w.duration, 0)}</div>
                  <div className="summary-label">Minutes (Last 5)</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Workout History */}
      {recentWorkouts.length > 0 && (
        <section className="workout-history">
          <h2>📝 Recent Workouts</h2>
          <div className="history-list">
            {recentWorkouts.map((workout) => (
              <div key={workout.id} className="history-item">
                <div className="history-left">
                  <div className="history-date">{new Date(workout.date).toLocaleDateString()}</div>
                  <div className="history-type">{workout.type}</div>
                </div>
                <div className="history-right">
                  <div className="history-duration">⏱️ {workout.duration} min</div>
                  <div className="history-calories">🔥 {workout.calories} cal</div>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteWorkout(workout.id)}
                    title="Delete workout"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {workouts.length === 0 && (
        <div className="empty-state">
          <h2>No workouts yet! 🏃</h2>
          <p>Start logging your workouts to track your progress and see your stats grow.</p>
          <button 
            className="add-workout-btn"
            onClick={() => setShowForm(true)}
          >
            + Log Your First Workout
          </button>
        </div>
      )}
    </div>
  )
}

export default ProgressPage
