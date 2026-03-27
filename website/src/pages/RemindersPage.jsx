import React from 'react'
import SmartReminders from '../components/SmartReminders'
import '../styles/RemindersPage.css'

function RemindersPage() {
  return (
    <div className="reminders-page">
      <div className="page-header">
        <h1>Smart Reminders</h1>
        <p>Stay on track with personalized notifications</p>
      </div>

      <div className="reminders-container">
        <SmartReminders />
      </div>

      <div className="reminders-info">
        <div className="info-card">
          <h3>💡 Pro Tip</h3>
          <p>Set reminders for your workouts to stay consistent. Regular notifications help build habits and keep you accountable.</p>
        </div>
        <div className="info-card">
          <h3>⏰ Best Practices</h3>
          <ul>
            <li>Set reminders 30 minutes before your workout</li>
            <li>Enable notifications for breakthrough moments</li>
            <li>Track reminder compliance for better insights</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RemindersPage
