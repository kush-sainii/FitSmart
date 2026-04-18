import React, { useState, useEffect } from 'react'
import { generateWeeklyPlan } from '../utils/trackingUtils'
import './WeeklyPlanGenerator.css'

function WeeklyPlanGenerator({ allPlans, onSelectPlan }) {
  const [weekPlan, setWeekPlan] = useState(null)

  useEffect(() => {
    const plan = generateWeeklyPlan(allPlans)
    setWeekPlan(plan)
  }, [allPlans])

  const regeneratePlan = () => {
    const plan = generateWeeklyPlan(allPlans)
    setWeekPlan(plan)
  }

  if (!weekPlan || weekPlan.length === 0) {
    return (
      <section className="weekly-plan-card" aria-label="Weekly workout plan">
        <div className="plan-header">
          <h3>📋 Your Weekly Plan</h3>
        </div>
        <div className="plan-loading">
          <p>No plan available. Complete your profile to generate a personalized plan.</p>
        </div>
      </section>
    )
  }

  const getTotalWorkouts = () => weekPlan.filter(d => d.plan !== 'Rest Day').length
  const getTotalMinutes = () => weekPlan.reduce((sum, d) => sum + d.duration, 0)

  return (
    <section className="weekly-plan-card" aria-label="Weekly workout plan">
      <div className="plan-header">
        <h3>📋 Your Weekly Plan</h3>
        <button 
          className="btn btn-outline btn-sm"
          onClick={regeneratePlan}
          title="Generate a new plan"
        >
          🔄 New Plan
        </button>
      </div>

      <div className="plan-summary">
        <div className="summary-stat">
          <span className="stat-icon">🏋️</span>
          <div>
            <p className="stat-label">Workouts</p>
            <p className="stat-value">{getTotalWorkouts()} days</p>
          </div>
        </div>
        <div className="summary-stat">
          <span className="stat-icon">⏱️</span>
          <div>
            <p className="stat-label">Total Time</p>
            <p className="stat-value">{getTotalMinutes()}m</p>
          </div>
        </div>
        <div className="summary-stat">
          <span className="stat-icon">😴</span>
          <div>
            <p className="stat-label">Rest Days</p>
            <p className="stat-value">{7 - getTotalWorkouts()}</p>
          </div>
        </div>
      </div>

      <div className="week-schedule">
        {weekPlan.map((dayPlan, index) => (
          <div 
            key={index} 
            className={`day-plan ${dayPlan.plan === 'Rest Day' ? 'rest-day' : ''}`}
          >
            <div className="day-name">{dayPlan.day.slice(0, 3)}</div>
            
            <div className="day-content">
              <div className="plan-icon">{dayPlan.icon}</div>
              
              <div className="plan-details">
                <p className="plan-name">{dayPlan.plan}</p>
                
                {dayPlan.plan !== 'Rest Day' && (
                  <div className="plan-info">
                    <span className="info-item">
                      ⏱️ {dayPlan.duration}m
                    </span>
                    <span className="info-item intensity">
                      {dayPlan.intensity}
                    </span>
                  </div>
                )}
                
                {dayPlan.plan === 'Rest Day' && (
                  <p className="rest-message">Recover and recharge</p>
                )}
              </div>
            </div>

            {dayPlan.plan !== 'Rest Day' && (
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onSelectPlan?.(dayPlan.plan)}
                title={`Start ${dayPlan.plan}`}
              >
                →
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="plan-tips">
        <p className="tips-title">💡 Pro Tips:</p>
        <ul className="tips-list">
          <li>Rest days are important for recovery and muscle growth</li>
          <li>Feel free to swap workout days based on your schedule</li>
          <li>Follow the suggested intensity for best results</li>
          <li>Generate a new plan weekly to keep variety in your routine</li>
        </ul>
      </div>
    </section>
  )
}

export default WeeklyPlanGenerator
