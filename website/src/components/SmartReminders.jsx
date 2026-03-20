import React, { useEffect, useMemo, useState } from 'react'
import './SmartReminders.css'

const STORAGE_KEY = 'fitSmartReminderSettings'

const DEFAULT_SETTINGS = {
  enabled: false,
  waterEnabled: true,
  workoutEnabled: true,
  waterIntervalMin: 90,
  workoutTime: '18:00'
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_SETTINGS
    const parsed = JSON.parse(saved)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function SmartReminders() {
  const notificationsSupported = typeof window !== 'undefined' && 'Notification' in window
  const [settings, setSettings] = useState(loadSettings)
  const [permission, setPermission] = useState(
    notificationsSupported ? Notification.permission : 'unsupported'
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!notificationsSupported || permission !== 'granted' || !settings.enabled) {
      return undefined
    }

    const timers = []

    const showReminder = (title, body) => {
      const note = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: title
      })

      note.onclick = () => {
        window.focus()
        if (window.location.pathname !== '/exercises') {
          window.location.assign('/exercises')
        }
      }
    }

    if (settings.waterEnabled) {
      const waterIntervalMs = Math.max(15, Number(settings.waterIntervalMin)) * 60 * 1000
      const intervalId = window.setInterval(() => {
        showReminder('Hydration Reminder', 'Time to drink water and stay energized.')
      }, waterIntervalMs)
      timers.push({ type: 'interval', id: intervalId })
    }

    let workoutTimeoutId
    const scheduleWorkoutReminder = () => {
      if (!settings.workoutEnabled) return
      const [hours, minutes] = settings.workoutTime.split(':').map((item) => Number(item))
      const now = new Date()
      const next = new Date()
      next.setHours(hours, minutes, 0, 0)

      if (next <= now) {
        next.setDate(next.getDate() + 1)
      }

      workoutTimeoutId = window.setTimeout(() => {
        showReminder('Workout Time', 'Your workout plan is waiting. Ready to train?')
        scheduleWorkoutReminder()
      }, next.getTime() - now.getTime())
    }

    scheduleWorkoutReminder()
    if (workoutTimeoutId) {
      timers.push({ type: 'timeout', id: workoutTimeoutId })
    }

    return () => {
      timers.forEach((timer) => {
        if (timer.type === 'interval') {
          window.clearInterval(timer.id)
        }
        if (timer.type === 'timeout') {
          window.clearTimeout(timer.id)
        }
      })
    }
  }, [notificationsSupported, permission, settings])

  const permissionLabel = useMemo(() => {
    if (!notificationsSupported) return 'Not supported in this browser'
    if (permission === 'granted') return 'Allowed'
    if (permission === 'denied') return 'Blocked'
    return 'Not requested'
  }, [notificationsSupported, permission])

  const requestPermission = async () => {
    if (!notificationsSupported) return
    const result = await Notification.requestPermission()
    setPermission(result)

    if (result === 'granted') {
      new Notification('FitSmart Reminders Enabled', {
        body: 'You will now receive hydration and workout reminders.'
      })
    }
  }

  const sendTestReminder = (type) => {
    if (!notificationsSupported || permission !== 'granted') return
    if (type === 'water') {
      new Notification('Hydration Reminder', {
        body: 'Test: drink a glass of water.'
      })
      return
    }

    new Notification('Workout Time', {
      body: 'Test: jump into your workout plan now.'
    })
  }

  return (
    <section className="reminder-card" aria-label="Smart reminders settings">
      <div className="reminder-header">
        <h3>Smart Reminders</h3>
        <p>Get water and workout nudges directly in your browser.</p>
      </div>

      <div className="reminder-status-row">
        <span>Notification permission: <strong>{permissionLabel}</strong></span>
        <button className="btn btn-secondary" onClick={requestPermission}>
          Allow Notifications
        </button>
      </div>

      <div className="reminder-grid">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(event) => setSettings({ ...settings, enabled: event.target.checked })}
          />
          <span>Enable reminders</span>
        </label>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.waterEnabled}
            onChange={(event) => setSettings({ ...settings, waterEnabled: event.target.checked })}
            disabled={!settings.enabled}
          />
          <span>Water reminder</span>
        </label>

        <label className="field-row">
          <span>Water interval (minutes)</span>
          <input
            type="number"
            min="15"
            max="240"
            value={settings.waterIntervalMin}
            onChange={(event) =>
              setSettings({ ...settings, waterIntervalMin: Number(event.target.value || 15) })
            }
            disabled={!settings.enabled || !settings.waterEnabled}
          />
        </label>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.workoutEnabled}
            onChange={(event) => setSettings({ ...settings, workoutEnabled: event.target.checked })}
            disabled={!settings.enabled}
          />
          <span>Workout reminder</span>
        </label>

        <label className="field-row">
          <span>Workout time</span>
          <input
            type="time"
            value={settings.workoutTime}
            onChange={(event) => setSettings({ ...settings, workoutTime: event.target.value })}
            disabled={!settings.enabled || !settings.workoutEnabled}
          />
        </label>
      </div>

      {/* <div className="reminder-actions">
        <button
          className="btn btn-outline"
          onClick={() => sendTestReminder('water')}
          disabled={permission !== 'granted'}
        >
          Test Water Reminder
        </button>
        <button
          className="btn btn-outline"
          onClick={() => sendTestReminder('workout')}
          disabled={permission !== 'granted'}
        >
          Test Workout Reminder
        </button>
      </div> */}
    </section>
  )
}

export default SmartReminders
