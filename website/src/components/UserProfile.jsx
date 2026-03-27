import React, { useState, useEffect } from 'react'
import { loadUserEmail, saveUserEmail } from '../utils/trackingUtils'
import './UserProfile.css'

function UserProfile({ onProfileUpdate }) {
  const [email, setEmail] = useState(loadUserEmail)
  const [isEditing, setIsEditing] = useState(!email)

  useEffect(() => {
    saveUserEmail(email)
    if (onProfileUpdate) {
      onProfileUpdate({ email })
    }
  }, [email, onProfileUpdate])

  const handleInputChange = (value) => {
    setEmail(value)
  }

  const handleSave = () => {
    if (email && email.includes('@')) {
      setIsEditing(false)
    } else {
      alert('Please enter a valid email address')
    }
  }

  const handleReset = () => {
    setEmail('')
    setIsEditing(true)
  }

  return (
    <section className="profile-card" aria-label="User email profile">
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
            <label>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter your email"
            />
            <small>Your email will be used to fetch your fitness profile from our system</small>
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Save Email
            </button>
            <button className="btn btn-outline" onClick={handleReset}>
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-display">
          <div className="profile-stat">
            <span className="stat-label">📧</span>
            <div>
              <p className="stat-value">{email}</p>
              <p className="stat-detail">Linked to your fitness profile</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default UserProfile
