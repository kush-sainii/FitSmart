import React, { useState, useEffect } from 'react'
import { getWorkoutRecommendations } from '../utils/trackingUtils'
import './WorkoutRecommendations.css'

function WorkoutRecommendations({ allPlans, onSelectPlan }) {
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const recs = getWorkoutRecommendations(allPlans)
    setRecommendations(recs)
  }, [allPlans])

  if (recommendations.length === 0) {
    return (
      <section className="recommendations-card" aria-label="Workout recommendations">
        <div className="recommendations-header">
          <h3>💡 Recommended for You</h3>
        </div>
        <div className="no-recommendations">
          <p>🎉 Amazing! You've tried all recommended workouts.</p>
          <p>Keep pushing yourself or explore new difficulty levels!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="recommendations-card" aria-label="Workout recommendations">
      <div className="recommendations-header">
        <h3>💡 Recommended for You</h3>
        <p>Based on your profile and fitness goals</p>
      </div>

      <div className="recommendations-list">
        {recommendations.map((plan) => (
          <div key={plan.id} className="recommendation-item">
            <div className="rec-icon">{plan.icon}</div>
            
            <div className="rec-content">
              <h4>{plan.name}</h4>
              <p className="rec-description">{plan.description}</p>
              
              <div className="rec-meta">
                <span className="meta-badge difficulty">{plan.difficulty}</span>
                <span className="meta-badge duration">⏱️ {plan.duration}</span>
                <span className="meta-badge exercises">
                  🏋️ {plan.exercises.length} exercises
                </span>
              </div>
            </div>

            <div className="rec-action">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onSelectPlan?.(plan.id)}
              >
                Start
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="recommendations-footer">
        <p className="recommendation-tip">
          💪 Tip: Try the recommended workouts to build a diverse fitness routine and unlock achievements!
        </p>
      </div>
    </section>
  )
}

export default WorkoutRecommendations
