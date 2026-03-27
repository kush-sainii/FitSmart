/**
 * Utility functions for fitness tracking and data management
 */

const STORAGE_KEYS = {
  USER_EMAIL: 'fitUserEmail',
  WORKOUT_HISTORY: 'fitWorkoutHistory',
  NUTRITION_LOG: 'fitNutritionLog',
  ACHIEVEMENTS: 'fitAchievements'
}

// ============================================================================
// USER EMAIL MANAGEMENT
// ============================================================================

export function loadUserEmail() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
    return saved || ''
  } catch {
    return ''
  }
}

export function saveUserEmail(email) {
  localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email)
}

// ============================================================================
// DEPRECATED - Keeping for backward compatibility
// ============================================================================

export function loadUserProfile() {
  return { email: loadUserEmail() }
}

export function saveUserProfile(profile) {
  if (profile.email) {
    saveUserEmail(profile.email)
  }
}

export function isProfileComplete(profile) {
  return profile && profile.email && profile.email.includes('@')
}

export function getDefaultProfile() {
  return { email: '' }
}

// ============================================================================
// WORKOUT HISTORY MANAGEMENT
// ============================================================================

export function loadWorkoutHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY)
    if (!saved) return []
    return JSON.parse(saved)
  } catch {
    return []
  }
}

export function addWorkoutCompletion(planId, planName, exercises, duration) {
  const history = loadWorkoutHistory()
  const workout = {
    id: Date.now(),
    planId,
    planName,
    exerciseCount: exercises.length,
    duration, // minutes
    caloriesBurned: estimateCaloriesBurned(exercises, duration),
    completedAt: new Date().toISOString(),
    date: new Date().toLocaleDateString()
  }
  history.push(workout)
  localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history))
  checkAndUpdateAchievements(history)
  return workout
}

export function estimateCaloriesBurned(exercises, duration) {
  // Simple estimation: 5-8 calories per minute based on intensity
  let avgIntensity = 1
  const intensityMap = { 'Low': 1, 'Medium': 1.5, 'High': 2 }
  
  if (exercises.length > 0) {
    avgIntensity = exercises.reduce((sum, ex) => sum + (intensityMap[ex.intensity] || 1), 0) / exercises.length
  }
  
  return Math.round(duration * 6 * avgIntensity)
}

export function getWorkoutStats() {
  const history = loadWorkoutHistory()
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const thisWeek = history.filter(w => new Date(w.completedAt) >= weekAgo)
  const thisMonth = history.filter(w => new Date(w.completedAt) >= monthAgo)

  return {
    totalWorkouts: history.length,
    thisWeekWorkouts: thisWeek.length,
    thisMonthWorkouts: thisMonth.length,
    totalMinutes: history.reduce((sum, w) => sum + w.duration, 0),
    thisWeekMinutes: thisWeek.reduce((sum, w) => sum + w.duration, 0),
    totalCaloriesBurned: history.reduce((sum, w) => sum + w.caloriesBurned, 0),
    thisWeekCalories: thisWeek.reduce((sum, w) => sum + w.caloriesBurned, 0),
    averageWorkoutDuration: thisWeek.length > 0 ? Math.round(thisWeek.reduce((sum, w) => sum + w.duration, 0) / thisWeek.length) : 0,
    lastWorkoutDate: history.length > 0 ? history[history.length - 1].completedAt : null
  }
}

export function getWorkoutStreak() {
  const history = loadWorkoutHistory()
  if (history.length === 0) return 0

  const sortedByDate = [...history].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const workout of sortedByDate) {
    const workoutDate = new Date(workout.completedAt)
    workoutDate.setHours(0, 0, 0, 0)

    if (currentDate.getTime() - workoutDate.getTime() === 0 || 
        currentDate.getTime() - workoutDate.getTime() === 24 * 60 * 60 * 1000) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export function getCompletedPlanIds() {
  const history = loadWorkoutHistory()
  const uniqueIds = new Set(history.map(w => w.planId))
  return Array.from(uniqueIds)
}

// ============================================================================
// NUTRITION LOG MANAGEMENT
// ============================================================================

export function loadNutritionLog() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.NUTRITION_LOG)
    if (!saved) return []
    return JSON.parse(saved)
  } catch {
    return []
  }
}

export function addNutritionEntry(foodName, calories, protein, fat, carbs) {
  const log = loadNutritionLog()
  const entry = {
    id: Date.now(),
    foodName,
    calories,
    protein,
    fat,
    carbs,
    loggedAt: new Date().toISOString(),
    date: new Date().toLocaleDateString()
  }
  log.push(entry)
  localStorage.setItem(STORAGE_KEYS.NUTRITION_LOG, JSON.stringify(log))
  return entry
}

export function getTodayNutritionSummary() {
  const log = loadNutritionLog()
  const today = new Date().toLocaleDateString()
  const todayEntries = log.filter(entry => entry.date === today)

  return {
    totalCalories: todayEntries.reduce((sum, e) => sum + e.calories, 0),
    totalProtein: todayEntries.reduce((sum, e) => sum + e.protein, 0),
    totalFat: todayEntries.reduce((sum, e) => sum + e.fat, 0),
    totalCarbs: todayEntries.reduce((sum, e) => sum + e.carbs, 0),
    mealCount: todayEntries.length,
    entries: todayEntries
  }
}

export function getThisWeekCalories() {
  const log = loadNutritionLog()
  const weekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
  const today = new Date().toLocaleDateString()
  
  return log
    .filter(entry => new Date(entry.date) >= new Date(weekAgo))
    .reduce((sum, e) => sum + e.calories, 0)
}

// ============================================================================
// ACHIEVEMENTS & BADGES
// ============================================================================

export function loadAchievements() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)
    if (!saved) return []
    return JSON.parse(saved)
  } catch {
    return []
  }
}

export function getAllAchievements() {
  return [
    {
      id: 'first-workout',
      name: 'First Step',
      description: 'Complete your first workout',
      icon: '🎯',
      condition: (stats) => stats.totalWorkouts >= 1
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Complete 5 workouts in a week',
      icon: '⭐',
      condition: (stats) => stats.thisWeekWorkouts >= 5
    },
    {
      id: '3-day-streak',
      name: '3-Day Fire',
      description: 'Complete workouts 3 days in a row',
      icon: '🔥',
      condition: (stats, streak) => streak >= 3
    },
    {
      id: '7-day-streak',
      name: 'Week Beast',
      description: 'Complete workouts 7 days in a row',
      icon: '💪',
      condition: (stats, streak) => streak >= 7
    },
    {
      id: 'centurion',
      name: 'Centurion',
      description: 'Complete 100 total workouts',
      icon: '🏆',
      condition: (stats) => stats.totalWorkouts >= 100
    },
    {
      id: 'hour-hunter',
      name: 'Hour Hunter',
      description: 'Complete 60 minutes of workouts in a week',
      icon: '⏱️',
      condition: (stats) => stats.thisWeekMinutes >= 60
    },
    {
      id: 'plan-master',
      name: 'Plan Master',
      description: 'Complete 3 different workout plans',
      icon: '📋',
      condition: (stats, streak, completedIds) => completedIds.length >= 3
    },
    {
      id: 'calorie-crusher',
      name: 'Calorie Crusher',
      description: 'Burn 1000+ calories in a week',
      icon: '🔥🔥',
      condition: (stats) => stats.thisWeekCalories >= 1000
    }
  ]
}

export function checkAndUpdateAchievements(history) {
  const stats = getWorkoutStats()
  const streak = getWorkoutStreak()
  const completedIds = getCompletedPlanIds()
  const achievements = loadAchievements()
  const allAchievements = getAllAchievements()

  allAchievements.forEach(achievement => {
    const isUnlocked = achievement.condition(stats, streak, completedIds)
    const alreadyHas = achievements.some(a => a.id === achievement.id)

    if (isUnlocked && !alreadyHas) {
      achievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        unlockedAt: new Date().toISOString()
      })
    }
  })

  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements))
}

export function getNewAchievements(limit = 3) {
  const achievements = loadAchievements()
  return achievements.slice(-limit).reverse()
}

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

export function getWorkoutRecommendations(allPlans) {
  const profile = loadUserProfile()
  const completedIds = getCompletedPlanIds()
  const stats = getWorkoutStats()

  // Filter recommendations
  let recommendations = allPlans.filter(plan => !completedIds.includes(plan.id))

  // Prioritize based on profile difficulty
  const difficultyOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 }
  const userDifficultyIndex = difficultyOrder[profile.difficultyLevel] || 0

  recommendations = recommendations.filter(plan => {
    const planDiffIndex = difficultyOrder[plan.difficulty]
    return planDiffIndex <= userDifficultyIndex + 1 // Allow slightly harder plans
  })

  // Sort by relevance
  recommendations.sort((a, b) => {
    const aMatch = getGoalMatch(a, profile.fitnessGoal)
    const bMatch = getGoalMatch(b, profile.fitnessGoal)
    return bMatch - aMatch
  })

  return recommendations.slice(0, 2)
}

function getGoalMatch(plan, fitnessGoal) {
  const matches = {
    'weight-loss': ['Weight Loss Program', 'Cardio Endurance', 'HIIT'],
    'muscle-building': ['Muscle Building', 'Core Strengthening', 'Strength'],
    'flexibility': ['Flexibility & Mobility', 'Yoga', 'Pilates'],
    'balanced': ['Beginner Full Body', 'Core Strengthening']
  }

  const goalMatches = matches[fitnessGoal] || []
  let score = 0

  goalMatches.forEach(keyword => {
    if (plan.name.includes(keyword) || plan.description.includes(keyword)) {
      score += 10
    }
  })

  return score
}

// ============================================================================
// WEEKLY PLAN GENERATOR
// ============================================================================

export function generateWeeklyPlan(allPlans) {
  const profile = loadUserProfile()
  const recommendations = getWorkoutRecommendations(allPlans)

  if (recommendations.length === 0) {
    return null
  }

  const hoursToMinutes = profile.availableTimePerWeek * 60
  const workoutsPerWeek = Math.max(3, Math.min(6, Math.round(profile.availableTimePerWeek)))
  
  const weekPlan = []
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const restDays = Math.ceil(7 - workoutsPerWeek)

  let planIndex = 0
  let workoutsScheduled = 0

  for (let day = 0; day < 7 && workoutsScheduled < workoutsPerWeek; day++) {
    if (Math.random() > (restDays / 7)) {
      const plan = recommendations[planIndex % recommendations.length]
      weekPlan.push({
        day: daysOfWeek[day],
        plan: plan.name,
        icon: plan.icon,
        duration: estimateWorkoutDuration(plan),
        intensity: plan.difficulty
      })
      planIndex++
      workoutsScheduled++
    } else {
      weekPlan.push({
        day: daysOfWeek[day],
        plan: 'Rest Day',
        icon: '😴',
        duration: 0,
        intensity: 'Rest'
      })
    }
  }

  return weekPlan
}

function estimateWorkoutDuration(plan) {
  const durationMap = {
    '4 weeks': 30,
    '5 weeks': 35,
    '6 weeks': 40,
    '8 weeks': 45,
    '12 weeks': 50
  }
  return durationMap[plan.duration] || 30
}
