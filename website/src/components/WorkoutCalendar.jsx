import React, { useState, useEffect } from 'react'
import { loadWorkoutHistory, getWorkoutStreak } from '../utils/trackingUtils'
import './WorkoutCalendar.css'

function WorkoutCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [workoutDays, setWorkoutDays] = useState({})
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const history = loadWorkoutHistory()
    const days = {}
    
    // Group workouts by date
    history.forEach(workout => {
      days[workout.date] = (days[workout.date] || 0) + 1
    })
    
    setWorkoutDays(days)
    setStreak(getWorkoutStreak())
  }, [])

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const formatDateForComparison = (year, month, day) => {
    const d = new Date(year, month, day)
    return d.toLocaleDateString()
  }

  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && 
                         today.getFullYear() === currentDate.getFullYear()
  const todayDate = today.getDate()

  return (
    <section className="workout-calendar" aria-label="Workout calendar">
      <div className="calendar-header">
        <div>
          <h3>📅 Workout Calendar</h3>
          <p>Track your consistency and see your streak growth</p>
        </div>
        <div className="streak-badge">
          <span className="streak-number">{streak}</span>
          <span className="streak-label">Day Streak 🔥</span>
        </div>
      </div>

      <div className="calendar-controls">
        <button className="btn btn-sm btn-outline" onClick={handlePrevMonth}>
          ← Previous
        </button>
        <h4 className="month-year">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button className="btn btn-sm btn-outline" onClick={handleNextMonth}>
          Next →
        </button>
        <button className="btn btn-sm btn-secondary" onClick={handleToday}>
          Today
        </button>
      </div>

      <div className="calendar-container">
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
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="calendar-day empty"></div>
            }

            const dateStr = formatDateForComparison(currentDate.getFullYear(), currentDate.getMonth(), day)
            const hasWorkout = workoutDays[dateStr] > 0
            const isTodayDate = isCurrentMonth && day === todayDate
            const isPastDate = !isTodayDate && (
              day < todayDate ||
              currentDate.getMonth() < today.getMonth() ||
              currentDate.getFullYear() < today.getFullYear()
            )

            return (
              <div
                key={day}
                className={`calendar-day ${isTodayDate ? 'today' : ''} ${hasWorkout ? 'completed' : isPastDate ? 'missed' : 'future'}`}
                title={hasWorkout ? `${workoutDays[dateStr]} workout(s)` : ''}
              >
                <span className="day-number">{day}</span>
                {hasWorkout && <span className="workout-indicator">✓</span>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color completed"></div>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="legend-color today"></div>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <div className="legend-color missed"></div>
          <span>Rest/Missed</span>
        </div>
        <div className="legend-item">
          <div className="legend-color future"></div>
          <span>Upcoming</span>
        </div>
      </div>

      <div className="calendar-stats">
        <div className="stat">
          <span className="stat-icon">📊</span>
          <div>
            <p className="stat-label">Workouts This Month</p>
            <p className="stat-value">
              {Object.values(workoutDays).reduce((sum, count) => sum + count, 0)}
            </p>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">💪</span>
          <div>
            <p className="stat-label">Consistency</p>
            <p className="stat-value">{streak} days in a row</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkoutCalendar
