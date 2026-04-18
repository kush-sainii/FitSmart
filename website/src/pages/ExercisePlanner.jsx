import React, { useEffect, useRef, useState } from 'react'
import { addWorkoutCompletion } from '../utils/trackingUtils'
import VideoViewer from '../components/VideoViewer'
import '../styles/ExercisePlanner.css'

function ExercisePlanner() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [completedExercises, setCompletedExercises] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const planDetailRef = useRef(null)

  const exercisePlans = [
    {
      id: 1,
      name: 'Weight Loss Program',
      description: 'Burn calories and lose weight effectively',
      icon: '🔥',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      exercises: [
        { name: 'Running', sets: '3', reps: '20 mins', intensity: 'High', videoUrl: 'dBHeiKvchsM' },
        { name: 'Burpees', sets: '3', reps: '15', intensity: 'High', videoUrl: 'JZQA0Fxu5W0' },
        { name: 'Jump Rope', sets: '3', reps: '60 secs', intensity: 'High', videoUrl: 'MSmlHG_RDWY' },
        { name: 'Mountain Climbers', sets: '3', reps: '20', intensity: 'High', videoUrl: 'nmwgirgXLYM' },
        { name: 'High Knees', sets: '3', reps: '45 secs', intensity: 'Medium', videoUrl: 'hDJdvPqJdMg' }
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
        { name: 'Bench Press', sets: '4', reps: '8-10', intensity: 'High', videoUrl: 'rT7DgCr-3pg' },
        { name: 'Deadlifts', sets: '3', reps: '5-8', intensity: 'High', videoUrl: 'r4MzxtBKyNE' },
        { name: 'Squats', sets: '4', reps: '8-10', intensity: 'High', videoUrl: 'Dy28eq2PjlU' },
        { name: 'Pull-ups', sets: '3', reps: '8-12', intensity: 'High', videoUrl: 'eGo4IYlbE5g' },
        { name: 'Barbell Rows', sets: '3', reps: '8-10', intensity: 'High', videoUrl: 'p2tP7nItVyU' }
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
        { name: 'Yoga - Sun Salutation', sets: '1', reps: '10 rounds', intensity: 'Low', videoUrl: 'vQp8LxFHePU' },
        { name: 'Deep Stretching', sets: '1', reps: '20 mins', intensity: 'Low', videoUrl: 'iI3K6VKL5W4' },
        { name: 'Pilates', sets: '1', reps: '30 mins', intensity: 'Low', videoUrl: 'OW7rynVX6-0' },
        { name: 'Dynamic Stretching', sets: '3', reps: '15 mins', intensity: 'Low', videoUrl: '8Y39nzvqBlc' },
        { name: 'Foam Rolling', sets: '1', reps: '15 mins', intensity: 'Low', videoUrl: 'wOz_tWhtgaE' }
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
        { name: 'Cycling', sets: '1', reps: '30 mins', intensity: 'Medium', videoUrl: 'L6h1j8H5-O4' },
        { name: 'Swimming', sets: '1', reps: '25 mins', intensity: 'Medium', videoUrl: 'e3EhSy0MvMA' },
        { name: 'Rowing', sets: '3', reps: '15 mins', intensity: 'High', videoUrl: 'OicNTT-8Nw4' },
        { name: 'Elliptical Machine', sets: '1', reps: '20 mins', intensity: 'Medium', videoUrl: 'XHY7kKQHyPA' },
        { name: 'HIIT Training', sets: '4', reps: '30 secs on/30 secs off', intensity: 'High', videoUrl: 'e80-Iso6laE' }
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
        { name: 'Planks', sets: '3', reps: '60 secs', intensity: 'Medium', videoUrl: 'p-4x-CQVJ-w' },
        { name: 'Crunches', sets: '3', reps: '20', intensity: 'Medium', videoUrl: 'sG7Ky4Q5lYg' },
        { name: 'Russian Twists', sets: '3', reps: '15 per side', intensity: 'Medium', videoUrl: 'Tz-xHaKvZ-4' },
        { name: 'Leg Raises', sets: '3', reps: '12', intensity: 'Medium', videoUrl: 'fnG4EB8lfmY' },
        { name: 'Dead Bugs', sets: '3', reps: '15', intensity: 'Low', videoUrl: 'kXDjZjOxFhk' }
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
        { name: 'Walking', sets: '1', reps: '20 mins', intensity: 'Low', videoUrl: 'OBuKVMg_ydg' },
        { name: 'Push-ups', sets: '2', reps: '10', intensity: 'Low', videoUrl: '_l0zFQwDh9s' },
        { name: 'Bodyweight Squats', sets: '3', reps: '15', intensity: 'Low', videoUrl: '9bW0XFmZGXU' },
        { name: 'Lunges', sets: '2', reps: '10 per leg', intensity: 'Low', videoUrl: 'nrhklvvNlEs' },
        { name: 'Arm Circles', sets: '2', reps: '20', intensity: 'Low', videoUrl: 'Nwv7y42WR0g' }
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
        { name: 'Jumping Jacks', sets: '4', reps: '45 secs', intensity: 'High', videoUrl: 'CwGhQ95qK1Q' },
        { name: 'Sprint in Place', sets: '4', reps: '30 secs', intensity: 'High', videoUrl: 'YPj56Z-bsGQ' },
        { name: 'Box Jumps', sets: '3', reps: '12', intensity: 'High', videoUrl: 'J_CfShlUDY4' },
        { name: 'Kettlebell Swings', sets: '4', reps: '30 secs', intensity: 'High', videoUrl: '3KqJXS5m5QI' },
        { name: 'Rest', sets: '4', reps: '30 secs', intensity: 'Low', videoUrl: 'oQ-i1j6VGGo' }
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
        { name: 'Child\'s Pose', sets: '1', reps: '1 min', intensity: 'Low', videoUrl: 'j8QLMxZ8QGE' },
        { name: 'Downward Dog Flow', sets: '1', reps: '10 reps', intensity: 'Low', videoUrl: 'L7Iuuu1VNX0' },
        { name: 'Warrior Poses', sets: '1', reps: '5 each side', intensity: 'Medium', videoUrl: 'uHxOmeOy-Ds' },
        { name: 'Tree Pose', sets: '1', reps: '30 secs each', intensity: 'Low', videoUrl: 'e4e4CPCh5e4' },
        { name: 'Savasana', sets: '1', reps: '5 mins', intensity: 'Low', videoUrl: 'jHplB6U0tO8' }
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
        { name: 'Jab-Cross Combos', sets: '4', reps: '60 secs', intensity: 'High', videoUrl: 'GnGvWYVMb8c' },
        { name: 'Roundhouse Kicks', sets: '3', reps: '15 per side', intensity: 'High', videoUrl: 'eMOl8tS2jeo' },
        { name: 'Speed Bag', sets: '3', reps: '45 secs', intensity: 'Medium', videoUrl: 'qDC_Aaq9qfQ' },
        { name: 'Hook Punches', sets: '3', reps: '20 per side', intensity: 'High', videoUrl: 'VgkMN8Y84A4' },
        { name: 'Heavy Bag Work', sets: '3', reps: '2 mins', intensity: 'High', videoUrl: 'tCFZ4KV_Aq0' }
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
        { name: 'Freestyle Swim', sets: '4', reps: '200m', intensity: 'High', videoUrl: 'jx6TYR7-nkc' },
        { name: 'Backstroke', sets: '3', reps: '150m', intensity: 'Medium', videoUrl: 'K7SBN4pCFRQ' },
        { name: 'Breaststroke', sets: '3', reps: '150m', intensity: 'Medium', videoUrl: 'AO7y5bLDqxw' },
        { name: 'Butterfly Strokes', sets: '2', reps: '100m', intensity: 'High', videoUrl: 'c-bRTLEJJB8' },
        { name: 'Water Treading', sets: '2', reps: '2 mins', intensity: 'Low', videoUrl: 'VBjQ5KJ6xEI' }
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
        { name: 'Pull-ups', sets: '4', reps: '8-12', intensity: 'High', videoUrl: '27EKnrjareI' },
        { name: 'Dips', sets: '4', reps: '10-15', intensity: 'High', videoUrl: 'SLRdP4jW3W8' },
        { name: 'Handstand Holds', sets: '3', reps: '20-30 secs', intensity: 'High', videoUrl: '2wHCk9xZvfU' },
        { name: 'Diamond Push-ups', sets: '3', reps: '12-15', intensity: 'Medium', videoUrl: '8Vs-UTMqMVk' },
        { name: 'Muscle-ups', sets: '3', reps: '5-8', intensity: 'High', videoUrl: 'kLfNzqjqEoA' }
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
        { name: 'Basic Dance Steps', sets: '1', reps: '5 mins', intensity: 'Medium', videoUrl: 'H3eWfZEaJo4' },
        { name: 'Hip Circles', sets: '1', reps: '3 mins', intensity: 'Low', videoUrl: 'gJpR3THEe9k' },
        { name: 'Zumba Combination', sets: '1', reps: '8 mins', intensity: 'Medium', videoUrl: 'msbLlXJfDhc' },
        { name: 'Freestyle Dancing', sets: '1', reps: '5 mins', intensity: 'Medium', videoUrl: 'K-SqUcJyDcU' },
        { name: 'Cool Down Stretching', sets: '1', reps: '3 mins', intensity: 'Low', videoUrl: 'SeVNLEajW94' }
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
        { name: 'The Hundred', sets: '1', reps: '100 beats', intensity: 'Medium', videoUrl: 'h7i4qM1GxdQ' },
        { name: 'Roll Up', sets: '2', reps: '10', intensity: 'Medium', videoUrl: 'HsNxEIxGtgg' },
        { name: 'Single Leg Circle', sets: '2', reps: '10 per leg', intensity: 'Medium', videoUrl: 'jI6GYCqEKHQ' },
        { name: 'Spine Stretch Forward', sets: '2', reps: '10', intensity: 'Low', videoUrl: 'AkOLCfMrWEo' },
        { name: 'Saw', sets: '2', reps: '10 per side', intensity: 'Medium', videoUrl: 'BLmPIx7WqyM' }
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
        { name: 'Kettlebell Thrusters', sets: '5', reps: '10', intensity: 'High', videoUrl: '8fMR_4gGm3g' },
        { name: 'Box Jumps', sets: '5', reps: '8', intensity: 'High', videoUrl: 'EzKxPaiA9Ng' },
        { name: 'Wall Balls', sets: '4', reps: '15', intensity: 'High', videoUrl: 'KM7EcqcMKr0' },
        { name: 'Barbell Cleans', sets: '4', reps: '8', intensity: 'High', videoUrl: 'xDR_LslkPvw' },
        { name: 'Row Machine Sprints', sets: '3', reps: '500m', intensity: 'High', videoUrl: 'zSf83hUqWYA' }
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
        { name: 'Easy Walking', sets: '1', reps: '20 mins', intensity: 'Low', videoUrl: 'XGXC4WvKbQE' },
        { name: 'Light Stretching', sets: '1', reps: '15 mins', intensity: 'Low', videoUrl: 'QP9K0PqKdB4' },
        { name: 'Mobility Work', sets: '1', reps: '10 mins', intensity: 'Low', videoUrl: 'iI3K6VKL5W4' },
        { name: 'Foam Rolling', sets: '1', reps: '10 mins', intensity: 'Low', videoUrl: 'wOz_tWhtgaE' },
        { name: 'Breathing Exercises', sets: '1', reps: '5 mins', intensity: 'Low', videoUrl: 'DGwL5V_nE3k' }
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
        { name: 'Goblet Squats', sets: '3', reps: '12', intensity: 'Medium', videoUrl: 'H-HG5ZtDA2c' },
        { name: 'Single-Leg Deadlifts', sets: '3', reps: '10 per leg', intensity: 'Medium', videoUrl: 'B-rDa3v6YhU' },
        { name: 'Farmer\'s Carry', sets: '3', reps: '40m', intensity: 'Medium', videoUrl: 'qvxhEpXPmNQ' },
        { name: 'Landmine Rotations', sets: '3', reps: '12 per side', intensity: 'Medium', videoUrl: 'fUScHKVMVWA' },
        { name: 'Battle Ropes', sets: '3', reps: '30 secs', intensity: 'High', videoUrl: 'p_k2cGBkRsA' }
      ]
    }
  ]

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  const filteredPlans = exercisePlans.filter((plan) => {
    const matchesDifficulty = difficultyFilter === 'All' || plan.difficulty === difficultyFilter
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDifficulty && matchesSearch
  })

  const startWorkout = (plan) => {
    setActiveWorkout(plan.id)
    if (!completedExercises[plan.id]) {
      setCompletedExercises({
        ...completedExercises,
        [plan.id]: new Array(plan.exercises.length).fill(false)
      })
    }
  }

  const finishWorkout = (planId) => {
    const plan = exercisePlans.find((item) => item.id === planId)
    if (plan) {
      const completed = completedExercises[planId]?.filter(Boolean).length || 0
      const total = plan.exercises.length
      
      // Estimate duration if all exercises completed
      let estimatedDuration = 30 // Default 30 minutes
      if (completed === total) {
        // Premium: could use actual timer in future
        estimatedDuration = Math.round(total * 3) // ~3 min per exercise
      }
      
      // Track the workout
      addWorkoutCompletion(planId, plan.name, plan.exercises, estimatedDuration)
    }
    
    setActiveWorkout(null)
  }

  const resetWorkout = (planId) => {
    const plan = exercisePlans.find((item) => item.id === planId)
    if (!plan) return
    setCompletedExercises({
      ...completedExercises,
      [planId]: new Array(plan.exercises.length).fill(false)
    })
  }

  const toggleExerciseComplete = (index) => {
    const workoutId = activeWorkout
    if (!workoutId) return
    const updated = [...(completedExercises[workoutId] || [])]
    updated[index] = !updated[index]
    setCompletedExercises({
      ...completedExercises,
      [workoutId]: updated
    })
  }

  const getProgressStats = () => {
    if (!activeWorkout) return { completed: 0, total: 0 }
    const plan = exercisePlans.find(p => p.id === activeWorkout)
    const completed = completedExercises[activeWorkout]?.filter(Boolean).length || 0
    return { completed, total: plan.exercises.length }
  }

  const progressStats = getProgressStats()
  const selectedProgress = selectedPlan
    ? completedExercises[selectedPlan.id]?.filter(Boolean).length || 0
    : 0
  const selectedTotal = selectedPlan ? selectedPlan.exercises.length : 0
  const selectedPercent = selectedTotal ? Math.round((selectedProgress / selectedTotal) * 100) : 0

  useEffect(() => {
    if (selectedPlan && planDetailRef.current) {
      planDetailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [selectedPlan])

  const handlePlanClick = (plan) => {
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(null)
      return
    }

    setSelectedPlan(plan)
  }

  return (
    <div className="exercise-planner">
      <div className="planner-header">
        <h1>Workout Studio</h1>
        <p>Pick a plan, start a session, and track completion exercise by exercise.</p>
      </div>

      <div className="planner-controls">
        <div className="search-wrap">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans..."
            aria-label="Search workout plans"
          />
        </div>
        <div className="difficulty-tabs">
          {difficulties.map((level) => (
            <button
              key={level}
              className={`tab-chip ${difficultyFilter === level ? 'active' : ''}`}
              onClick={() => setDifficultyFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="plans-container">
        <div className="plans-grid">
          {filteredPlans.map(plan => {
            const planCompleted = completedExercises[plan.id]?.filter(Boolean).length || 0
            const hasProgress = planCompleted > 0
            return (
            <div
              key={plan.id}
              className={`plan-card ${selectedPlan?.id === plan.id ? 'active' : ''}`}
              onClick={() => handlePlanClick(plan)}
            >
              <div className="plan-card-top">
              <div className="plan-icon">{plan.icon}</div>
                {hasProgress && <span className="progress-pill">{planCompleted}/{plan.exercises.length}</span>}
              </div>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="plan-info">
                <span className="badge difficulty">{plan.difficulty}</span>
                <span className="badge duration">⏱️ {plan.duration}</span>
              </div>
            </div>
            )
          })}
        </div>

        {filteredPlans.length === 0 && (
          <div className="empty-state">
            <h3>No plans found</h3>
            <p>Try another search term or choose a different difficulty filter.</p>
          </div>
        )}

        {selectedPlan && (
          <div ref={planDetailRef} className="exercises-detail">
            <div className="detail-header">
              <h2>
                <span>{selectedPlan.icon}</span>
                {selectedPlan.name}
              </h2>
              <button className="close-detail" onClick={() => setSelectedPlan(null)}>✕</button>
            </div>
            
            <div className="plan-meta">
              <div className="meta-item">
                <strong>Difficulty:</strong> {selectedPlan.difficulty}
              </div>
              <div className="meta-item">
                <strong>Duration:</strong> {selectedPlan.duration}
              </div>
              <div className="meta-item">
                <strong>Total Exercises:</strong> {selectedPlan.exercises.length}
              </div>
              <div className="meta-item">
                <strong>Progress:</strong> {selectedProgress}/{selectedTotal} ({selectedPercent}%)
              </div>
            </div>

            <div className="exercise-list">
              {selectedPlan.exercises.map((exercise, idx) => {
                const checked = completedExercises[selectedPlan.id]?.[idx] || false
                return (
                  <div
                    key={idx}
                    className={`exercise-item ${checked ? 'checked' : ''} ${activeWorkout !== selectedPlan.id ? 'locked' : ''}`}
                  >
                    <div className="exercise-actions">
                      {exercise.videoUrl && (
                        <button
                          className="btn-video"
                          onClick={() => {
                            setShowVideoModal(true)
                            setSelectedVideo({ name: exercise.name, url: exercise.videoUrl })
                          }}
                          title="Watch exercise form"
                        >
                          📹 Form
                        </button>
                      )}
                      <label className="exercise-checkbox-label">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleExerciseComplete(idx)}
                          className="exercise-checkbox"
                          disabled={activeWorkout !== selectedPlan.id}
                        />
                      </label>
                    </div>
                    <div className="exercise-content">
                      <div className="exercise-main-row">
                        <span className="exercise-name">{exercise.name}</span>
                        <span className={`intensity-badge ${exercise.intensity.toLowerCase()}`}>
                          {exercise.intensity}
                        </span>
                      </div>
                      <div className="exercise-sub-row">
                        <span>{exercise.sets} sets</span>
                        <span>{exercise.reps}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="detail-footer">
              {activeWorkout === selectedPlan.id ? (
                <>
                  <div className="workout-progress">
                    <div className="progress-info">
                      <span className="progress-text">Workout Progress</span>
                      <span className="progress-count">{progressStats.completed}/{progressStats.total} completed</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(progressStats.completed / progressStats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => finishWorkout(selectedPlan.id)}
                  >
                    Finish Workout
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => resetWorkout(selectedPlan.id)}
                  >
                    Reset Progress
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-primary"
                    onClick={() => startWorkout(selectedPlan)}
                  >
                    {completedExercises[selectedPlan.id]?.some(Boolean) ? 'Resume Workout' : 'Start This Plan'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSelectedPlan(null)}>Back to Plans</button>
                </>
              )}
            </div>

            {activeWorkout === selectedPlan.id && progressStats.completed === progressStats.total && (
              <div className="completion-banner">
                Great job! You completed this workout.
              </div>
            )}
          </div>
        )}
      </div>

      {showVideoModal && selectedVideo && (
        <VideoViewer 
          videoUrl={selectedVideo.url}
          exerciseName={selectedVideo.name}
          onClose={() => {
            setShowVideoModal(false)
            setSelectedVideo(null)
          }}
        />
      )}
    </div>
  )
}

export default ExercisePlanner
