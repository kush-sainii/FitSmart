import React from 'react'
import UserProfile from '../components/UserProfile'
import '../styles/ProfilePage.css'

function ProfilePage() {
  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your fitness profile and preferences</p>
      </div>

      <div className="profile-container">
        <UserProfile />
      </div>

      <div className="profile-info">
        <div className="info-section">
          <h3>Profile Management</h3>
          <p>Update your personal information, fitness goals, and preferences to get better recommendations.</p>
        </div>
        <div className="info-section">
          <h3>Privacy & Data</h3>
          <p>Your fitness data is private and secure. You control what information is shared.</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
