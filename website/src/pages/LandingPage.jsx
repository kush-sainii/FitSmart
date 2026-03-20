import React, { useState, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SmartReminders from '../components/SmartReminders'
import ProgressDashboard from '../components/ProgressDashboard'
import WorkoutRecommendations from '../components/WorkoutRecommendations'
import WeeklyPlanGenerator from '../components/WeeklyPlanGenerator'
import WorkoutCalendar from '../components/WorkoutCalendar'
import '../styles/LandingPage.css'

function LandingPage() {
  const [showCamera, setShowCamera] = useState(false)
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // All exercise plans (same as ExercisePlanner)
  const exercisePlans = useMemo(() => [
    {
      id: 1,
      name: 'Weight Loss Program',
      description: 'Burn calories and lose weight effectively',
      icon: '🔥',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      exercises: [
        { name: 'Running', sets: '3', reps: '20 mins', intensity: 'High' },
        { name: 'Burpees', sets: '3', reps: '15', intensity: 'High' },
        { name: 'Jump Rope', sets: '3', reps: '60 secs', intensity: 'High' },
        { name: 'Mountain Climbers', sets: '3', reps: '20', intensity: 'High' },
        { name: 'High Knees', sets: '3', reps: '45 secs', intensity: 'Medium' }
      ]
    },
    {
      id: 2,
      name: 'Muscle Building',
      description: 'Build strength and muscle mass',
      icon: '💪',
      difficulty: 'Advanced',
      duration: '12 weeks',
      exercises: [
        { name: 'Bench Press', sets: '4', reps: '8-10', intensity: 'High' },
        { name: 'Deadlifts', sets: '3', reps: '5-8', intensity: 'High' },
        { name: 'Squats', sets: '4', reps: '8-10', intensity: 'High' },
        { name: 'Pull-ups', sets: '3', reps: '8-12', intensity: 'High' },
        { name: 'Barbell Rows', sets: '3', reps: '8-10', intensity: 'High' }
      ]
    },
    {
      id: 3,
      name: 'Flexibility & Mobility',
      description: 'Improve flexibility and range of motion',
      icon: '🧘',
      difficulty: 'Beginner',
      duration: '4 weeks',
      exercises: [
        { name: 'Yoga - Sun Salutation', sets: '1', reps: '10 rounds', intensity: 'Low' },
        { name: 'Deep Stretching', sets: '1', reps: '20 mins', intensity: 'Low' },
        { name: 'Pilates', sets: '1', reps: '30 mins', intensity: 'Low' },
        { name: 'Dynamic Stretching', sets: '3', reps: '15 mins', intensity: 'Low' },
        { name: 'Foam Rolling', sets: '1', reps: '15 mins', intensity: 'Low' }
      ]
    },
    {
      id: 4,
      name: 'Cardio Endurance',
      description: 'Build cardiovascular strength and stamina',
      icon: '🏃',
      difficulty: 'Intermediate',
      duration: '6 weeks',
      exercises: [
        { name: 'Cycling', sets: '1', reps: '30 mins', intensity: 'Medium' },
        { name: 'Swimming', sets: '1', reps: '25 mins', intensity: 'Medium' },
        { name: 'Rowing', sets: '3', reps: '15 mins', intensity: 'High' },
        { name: 'Elliptical Machine', sets: '1', reps: '20 mins', intensity: 'Medium' },
        { name: 'HIIT Training', sets: '4', reps: '30 secs on/30 secs off', intensity: 'High' }
      ]
    },
    {
      id: 5,
      name: 'Core Strengthening',
      description: 'Build a strong and stable core',
      icon: '🎯',
      difficulty: 'Intermediate',
      duration: '5 weeks',
      exercises: [
        { name: 'Planks', sets: '3', reps: '60 secs', intensity: 'Medium' },
        { name: 'Crunches', sets: '3', reps: '20', intensity: 'Medium' },
        { name: 'Russian Twists', sets: '3', reps: '15 per side', intensity: 'Medium' },
        { name: 'Leg Raises', sets: '3', reps: '12', intensity: 'Medium' },
        { name: 'Dead Bugs', sets: '3', reps: '15', intensity: 'Low' }
      ]
    },
    {
      id: 6,
      name: 'Beginner Full Body',
      description: 'Start your fitness journey with basics',
      icon: '⭐',
      difficulty: 'Beginner',
      duration: '4 weeks',
      exercises: [
        { name: 'Walking', sets: '1', reps: '20 mins', intensity: 'Low' },
        { name: 'Push-ups', sets: '2', reps: '10', intensity: 'Low' },
        { name: 'Bodyweight Squats', sets: '3', reps: '15', intensity: 'Low' },
        { name: 'Lunges', sets: '2', reps: '10 per leg', intensity: 'Low' },
        { name: 'Arm Circles', sets: '2', reps: '20', intensity: 'Low' }
      ]
    },
    {
      id: 7,
      name: 'HIIT Blast',
      description: 'High-intensity interval training for maximum calorie burn and cardiovascular improvement. Perfect for busy schedules - get fit in 20 minutes',
      icon: '⚡',
      difficulty: 'Advanced',
      duration: '6 weeks',
      exercises: [
        { name: 'Jumping Jacks', sets: '4', reps: '45 secs', intensity: 'High' },
        { name: 'Sprint in Place', sets: '4', reps: '30 secs', intensity: 'High' },
        { name: 'Box Jumps', sets: '3', reps: '12', intensity: 'High' },
        { name: 'Kettlebell Swings', sets: '4', reps: '30 secs', intensity: 'High' },
        { name: 'Rest', sets: '4', reps: '30 secs', intensity: 'Low' }
      ]
    },
    {
      id: 8,
      name: 'Yoga Flow',
      description: 'Calming yoga sequences designed to reduce stress, improve balance, and increase mental clarity. Ideal for relaxation and injury recovery',
      icon: '🕉️',
      difficulty: 'Beginner',
      duration: '4 weeks',
      exercises: [
        { name: 'Child\'s Pose', sets: '1', reps: '1 min', intensity: 'Low' },
        { name: 'Downward Dog Flow', sets: '1', reps: '10 reps', intensity: 'Low' },
        { name: 'Warrior Poses', sets: '1', reps: '5 each side', intensity: 'Medium' },
        { name: 'Tree Pose', sets: '1', reps: '30 secs each', intensity: 'Low' },
        { name: 'Savasana', sets: '1', reps: '5 mins', intensity: 'Low' }
      ]
    },
    {
      id: 9,
      name: 'Boxing & Kickboxing',
      description: 'Dynamic boxing combinations that improve hand-eye coordination, upper body strength, and explosive power. Great stress relief workout',
      icon: '🥊',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      exercises: [
        { name: 'Jab-Cross Combos', sets: '4', reps: '60 secs', intensity: 'High' },
        { name: 'Roundhouse Kicks', sets: '3', reps: '15 per side', intensity: 'High' },
        { name: 'Speed Bag', sets: '3', reps: '45 secs', intensity: 'Medium' },
        { name: 'Hook Punches', sets: '3', reps: '20 per side', intensity: 'High' },
        { name: 'Heavy Bag Work', sets: '3', reps: '2 mins', intensity: 'High' }
      ]
    },
    {
      id: 10,
      name: 'Swimming Workout',
      description: 'Full-body low-impact cardio that builds endurance and muscle definition. Perfect for joint health and all-around fitness',
      icon: '🏊',
      difficulty: 'Intermediate',
      duration: '6 weeks',
      exercises: [
        { name: 'Freestyle Swim', sets: '4', reps: '200m', intensity: 'High' },
        { name: 'Backstroke', sets: '3', reps: '150m', intensity: 'Medium' },
        { name: 'Breaststroke', sets: '3', reps: '150m', intensity: 'Medium' },
        { name: 'Butterfly Strokes', sets: '2', reps: '100m', intensity: 'High' },
        { name: 'Water Treading', sets: '2', reps: '2 mins', intensity: 'Low' }
      ]
    },
    {
      id: 11,
      name: 'Calisthenics Strength',
      description: 'Bodyweight exercises for building lean muscle and functional strength. No equipment needed - perfect for home workouts',
      icon: '🤸',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      exercises: [
        { name: 'Pull-ups', sets: '4', reps: '8-12', intensity: 'High' },
        { name: 'Dips', sets: '4', reps: '10-15', intensity: 'High' },
        { name: 'Handstand Holds', sets: '3', reps: '20-30 secs', intensity: 'High' },
        { name: 'Diamond Push-ups', sets: '3', reps: '12-15', intensity: 'Medium' },
        { name: 'Muscle-ups', sets: '3', reps: '5-8', intensity: 'High' }
      ]
    },
    {
      id: 12,
      name: 'Dance Cardio',
      description: 'Fun, energetic dance-based cardio that improves coordination and burns calories while having a blast. Great for beginners and all fitness levels',
      icon: '💃',
      difficulty: 'Beginner',
      duration: '4 weeks',
      exercises: [
        { name: 'Basic Dance Steps', sets: '1', reps: '5 mins', intensity: 'Medium' },
        { name: 'Hip Circles', sets: '1', reps: '3 mins', intensity: 'Low' },
        { name: 'Zumba Combination', sets: '1', reps: '8 mins', intensity: 'Medium' },
        { name: 'Freestyle Dancing', sets: '1', reps: '5 mins', intensity: 'Medium' },
        { name: 'Cool Down Stretching', sets: '1', reps: '3 mins', intensity: 'Low' }
      ]
    },
    {
      id: 13,
      name: 'Pilates Core',
      description: 'Targeted pilates exercises that develop core strength, stability, and improve posture. Low impact but highly effective',
      icon: '✨',
      difficulty: 'Beginner',
      duration: '5 weeks',
      exercises: [
        { name: 'The Hundred', sets: '1', reps: '100 beats', intensity: 'Medium' },
        { name: 'Roll Up', sets: '2', reps: '10', intensity: 'Medium' },
        { name: 'Single Leg Circle', sets: '2', reps: '10 per leg', intensity: 'Medium' },
        { name: 'Spine Stretch Forward', sets: '2', reps: '10', intensity: 'Low' },
        { name: 'Saw', sets: '2', reps: '10 per side', intensity: 'Medium' }
      ]
    },
    {
      id: 14,
      name: 'CrossFit Circuit',
      description: 'Functional fitness combining strength, power, and conditioning. Improves athletic performance and builds functional strength for real-world activities',
      icon: '🏋️',
      difficulty: 'Advanced',
      duration: '8 weeks',
      exercises: [
        { name: 'Kettlebell Thrusters', sets: '5', reps: '10', intensity: 'High' },
        { name: 'Box Jumps', sets: '5', reps: '8', intensity: 'High' },
        { name: 'Wall Balls', sets: '4', reps: '15', intensity: 'High' },
        { name: 'Barbell Cleans', sets: '4', reps: '8', intensity: 'High' },
        { name: 'Row Machine Sprints', sets: '3', reps: '500m', intensity: 'High' }
      ]
    },
    {
      id: 15,
      name: 'Active Recovery',
      description: 'Gentle, restorative exercises designed to aid recovery and prevent injury. Perfect for rest days to keep blood flowing and reduce soreness',
      icon: '🌿',
      difficulty: 'Beginner',
      duration: '4 weeks',
      exercises: [
        { name: 'Easy Walking', sets: '1', reps: '20 mins', intensity: 'Low' },
        { name: 'Light Stretching', sets: '1', reps: '15 mins', intensity: 'Low' },
        { name: 'Mobility Work', sets: '1', reps: '10 mins', intensity: 'Low' },
        { name: 'Foam Rolling', sets: '1', reps: '10 mins', intensity: 'Low' },
        { name: 'Breathing Exercises', sets: '1', reps: '5 mins', intensity: 'Low' }
      ]
    },
    {
      id: 16,
      name: 'Functional Training',
      description: 'Workouts that improve strength for everyday activities and movement patterns. Enhances balance, stability, and practical fitness',
      icon: '⚙️',
      difficulty: 'Intermediate',
      duration: '6 weeks',
      exercises: [
        { name: 'Goblet Squats', sets: '3', reps: '12', intensity: 'Medium' },
        { name: 'Single-Leg Deadlifts', sets: '3', reps: '10 per leg', intensity: 'Medium' },
        { name: 'Farmer\'s Carry', sets: '3', reps: '40m', intensity: 'Medium' },
        { name: 'Landmine Rotations', sets: '3', reps: '12 per side', intensity: 'Medium' },
        { name: 'Battle Ropes', sets: '3', reps: '30 secs', intensity: 'High' }
      ]
    }
  ], [])

  const handleSelectPlan = (planId) => {
    navigate('/exercises')
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      })
      videoRef.current.srcObject = stream
      setShowCamera(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const closeCamera = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)
      
      const imageData = canvasRef.current.toDataURL('image/jpeg')
      console.log('Photo captured:', imageData)
      alert('Photo captured! This would be sent to analyze calories and nutrition.')
    }
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Personal Fitness Coach</h1>
          <p>Get personalized workout plans and nutrition guidance tailored to your goals</p>
          <div className="hero-buttons">
            <Link to="/exercises" className="btn btn-primary">
              Explore Workouts
            </Link>
            <button 
              onClick={startCamera}
              className="btn btn-secondary"
            >
              📸 Scan Food
            </button>
          </div>
        </div>
      </section>

      {/* Personalized Dashboard */}
      <ProgressDashboard />

      {/* Weekly Plan Generator */}
      <WeeklyPlanGenerator allPlans={exercisePlans} onSelectPlan={handleSelectPlan} />

      {/* Workout Calendar */}
      <WorkoutCalendar />

      {/* Workout Recommendations */}
      <WorkoutRecommendations allPlans={exercisePlans} onSelectPlan={handleSelectPlan} />

      {/* Smart Reminders */}
      <SmartReminders />

      {/* Camera Modal */}
      {showCamera && (
        <div className="camera-modal">
          <div className="camera-container">
            <div className="camera-header">
              <h2>🍽️ Food Scanner</h2>
              <button className="close-btn" onClick={closeCamera} aria-label="Close camera">✕</button>
            </div>
            <div className="camera-body">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="video-feed"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            <div className="camera-controls">
              <button onClick={capturePhoto} className="btn btn-primary btn-capture" aria-label="Capture photo">
                📸 Capture Photo
              </button>
              <button onClick={closeCamera} className="btn btn-outline" aria-label="Cancel camera">
                Cancel
              </button>
            </div>
            <p className="scanner-info">
              Point your camera at your food to analyze calories and nutritional value
            </p>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Transform Your Fitness?</h2>
        <p>Start with personalized workout recommendations</p>
        <Link to="/exercises" className="btn btn-primary btn-large">
          Get Started
        </Link>
      </section>
    </div>
  )
}

export default LandingPage
