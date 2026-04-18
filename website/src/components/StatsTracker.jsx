import React, { useState, useEffect } from 'react'
import { 
  getWorkoutStreak, 
  getWorkoutStats, 
  loadAchievements, 
  getNewAchievements,
  getAllAchievements
} from '../utils/trackingUtils'
import './StatsTracker.css'

function StatsTracker() {
  const [streak, setStreak] = useState(0)
  const [stats, setStats] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [newAchievements, setNewAchievements] = useState([])
  const [showAllAchievements, setShowAllAchievements] = useState(false)

  useEffect(() => {
    const updateData = () => {
      setStreak(getWorkoutStreak())
      setStats(getWorkoutStats())
      setAchievements(loadAchievements())
      setNewAchievements(getNewAchievements(3))
    }

    updateData()
    const interval = setInterval(updateData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return <div className="stats-loading">Loading stats...</div>

  const getStreakMessage = () => {
    if (streak === 0) return 'Start your streak today!'
    if (streak === 1) return 'Great start!'
    if (streak < 7) return `${streak} day streak - keep going!`
    if (streak === 7) return '🔥 One week streak!'
    if (streak >= 30) return '🏆 One month consistent!'
    return `${streak} day streak - amazing!`
  }

  const getStreakColor = () => {
    if (streak === 0) return 'gray'
    if (streak < 3) return 'yellow'
    if (streak < 7) return 'orange'
    return 'fire'
  }

  const percentComplete = Math.round((achievements.length / getAllAchievements().length) * 100)

  return (
    <section className="stats-tracker" aria-label="Achievements and streaks">
      <div className="stats-header">
        <h3>🏅 Achievements & Streaks</h3>
      </div>

      {/* Streak Section */}
      <div className="streak-section">
        <div className={`streak-indicator ${getStreakColor()}`}>
          <div className="streak-number">{streak}</div>
          <div className="streak-label">Day Streak</div>
        </div>
        
        <div className="streak-message">
          <p className="message-text">{getStreakMessage()}</p>
          <p className="message-detail">
            Last workout: {stats.lastWorkoutDate 
              ? new Date(stats.lastWorkoutDate).toLocaleDateString()
              : 'Never'}
          </p>
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="achievement-progress">
        <div className="progress-header">
          <span className="progress-label">Achievement Progress</span>
          <span className="progress-count">{achievements.length} / {getAllAchievements().length}</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          <div className="progress-text">{percentComplete}% Complete</div>
        </div>
      </div>

      {/* New Achievements */}
      {newAchievements.length > 0 && (
        <div className="new-achievements">
          <p className="new-label">🎉 Recently Unlocked</p>
          <div className="achievement-cards">
            {newAchievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card new">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <p className="achievement-name">{achievement.name}</p>
                  <p className="achievement-desc">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Achievements Section */}
      <div className="all-achievements-section">
        <button 
          className="btn btn-outline btn-sm"
          onClick={() => setShowAllAchievements(!showAllAchievements)}
        >
          {showAllAchievements ? '▼ Hide All Achievements' : '▶ View All Achievements'}
        </button>

        {showAllAchievements && (
          <div className="achievement-grid">
            {getAllAchievements().map((achievement) => {
              const isUnlocked = achievements.some(a => a.id === achievement.id)
              return (
                <div 
                  key={achievement.id} 
                  className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  title={achievement.description}
                >
                  <div className={`achievement-icon ${isUnlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <p className="achievement-name">{achievement.name}</p>
                  {!isUnlocked && <div className="locked-overlay">🔒</div>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-icon">📊</span>
          <div>
            <p className="summary-label">Month Stats</p>
            <p className="summary-value">{stats.thisMonthWorkouts} workouts</p>
          </div>
        </div>
        
        <div className="summary-item">
          <span className="summary-icon">🎯</span>
          <div>
            <p className="summary-label">Plans Completed</p>
            <p className="summary-value">{new Set(Array.from({length: stats.totalWorkouts}, (_, i) => i)).size} unique</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsTracker
