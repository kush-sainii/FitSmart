import React, { useState, useEffect } from 'react'
import { loadUserProfile, saveUserProfile, isProfileComplete, getDefaultProfile } from '../utils/trackingUtils'
import './UserProfile.css'

function UserProfile({ onProfileUpdate }) {
  const [profile, setProfile] = useState(loadUserProfile)
  const [isEditing, setIsEditing] = useState(!isProfileComplete(profile))

  useEffect(() => {
    saveUserProfile(profile)
    if (onProfileUpdate) {
      onProfileUpdate(profile)
    }
  }, [profile, onProfileUpdate])

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    if (profile.name && profile.age && profile.weight && profile.height) {
      setIsEditing(false)
    } else {
      alert('Please fill in all required fields')
    }
  }

  const handleReset = () => {
    setProfile(getDefaultProfile())
    setIsEditing(true)
  }

  return (
    <section className="profile-card" aria-label="User fitness profile">
      <div className="profile-header">
        <h3>Your Profile</h3>
        {!isEditing && (
          <button 
            className="btn btn-sm btn-secondary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="profile-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                min="13"
                max="120"
                value={profile.age}
                onChange={(e) => handleInputChange('age', Number(e.target.value))}
                placeholder="Age"
              />
            </div>

            <div className="form-group">
              <label>Weight (kg) *</label>
              <input
                type="number"
                min="20"
                max="500"
                step="0.5"
                value={profile.weight}
                onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                placeholder="Weight"
              />
            </div>

            <div className="form-group">
              <label>Height (cm) *</label>
              <input
                type="number"
                min="100"
                max="250"
                step="0.5"
                value={profile.height}
                onChange={(e) => handleInputChange('height', Number(e.target.value))}
                placeholder="Height"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Fitness Goal</label>
            <select 
              value={profile.fitnessGoal}
              onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}
            >
              <option value="balanced">Balanced Fitness</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-building">Muscle Building</option>
              <option value="flexibility">Flexibility & Mobility</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Difficulty Level</label>
              <select 
                value={profile.difficultyLevel}
                onChange={(e) => handleInputChange('difficultyLevel', e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Available Time Per Week (hours)</label>
              <select 
                value={profile.availableTimePerWeek}
                onChange={(e) => handleInputChange('availableTimePerWeek', Number(e.target.value))}
              >
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="5">5 hours</option>
                <option value="6">6+ hours</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Preferred Exercise Time</label>
            <select 
              value={profile.preferredExerciseTime}
              onChange={(e) => handleInputChange('preferredExerciseTime', e.target.value)}
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Save Profile
            </button>
            <button className="btn btn-outline" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-display">
          <div className="profile-stat">
            <span className="stat-label">👤</span>
            <div>
              <p className="stat-value">{profile.name}</p>
              <p className="stat-detail">{profile.age} years old</p>
            </div>
          </div>

          <div className="profile-stat">
            <span className="stat-label">📏</span>
            <div>
              <p className="stat-value">{profile.height} cm</p>
              <p className="stat-detail">{profile.weight} kg</p>
            </div>
          </div>

          <div className="profile-stat">
            <span className="stat-label">🎯</span>
            <div>
              <p className="stat-value">{profile.fitnessGoal.replace('-', ' ')}</p>
              <p className="stat-detail">{profile.difficultyLevel}</p>
            </div>
          </div>

          <div className="profile-stat">
            <span className="stat-label">⏱️</span>
            <div>
              <p className="stat-value">{profile.availableTimePerWeek} hours/week</p>
              <p className="stat-detail">{profile.preferredExerciseTime}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default UserProfile
