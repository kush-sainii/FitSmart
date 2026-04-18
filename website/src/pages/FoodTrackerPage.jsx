import React, { useState, useRef } from 'react'
import { loadUserEmail } from '../utils/trackingUtils'
import '../styles/FoodTrackerPage.css'

function FoodTrackerPage() {
  const [meals, setMeals] = useState([
    { id: 1, name: 'Breakfast', time: '8:00 AM', calories: 450, items: ['Oatmeal', 'Banana', 'Almonds'] },
    { id: 2, name: 'Lunch', time: '12:30 PM', calories: 650, items: ['Grilled Chicken', 'Brown Rice', 'Broccoli'] },
    { id: 3, name: 'Snack', time: '3:00 PM', calories: 200, items: ['Apple', 'Peanut Butter'] }
  ])
  const [showForm, setShowForm] = useState(false)
  const [newMeal, setNewMeal] = useState({ name: '', time: '', calories: '', items: '' })
  const [isScanning, setIsScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState('')
  const fileInputRef = useRef(null)

  const addMeal = () => {
    if (newMeal.name && newMeal.calories) {
      setMeals([...meals, {
        id: Date.now(),
        name: newMeal.name,
        time: newMeal.time || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        calories: parseInt(newMeal.calories),
        items: newMeal.items ? newMeal.items.split(',').map(item => item.trim()) : []
      }])
      setNewMeal({ name: '', time: '', calories: '', items: '' })
      setShowForm(false)
    }
  }

  const deleteMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id))
  }

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)

  const handleCameraCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsScanning(true)
      setScanStatus('Analyzing food image...')
      
      try {
        // Get user email from profile
        const userEmail = loadUserEmail()
        
        if (!userEmail) {
          throw new Error('Please add your email in the Profile section first')
        }
        
        // Create FormData to send the image
        const formData = new FormData()
        formData.append('image', file)
        
        // Send image to the classifier API
        const response = await fetch('http://localhost:5000/classify', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Log the response to see what the API returns
        console.log('API Response:', data)
        
        // Extract food classification from API response
        // The API returns predictions array with top prediction first
        const topPrediction = data.predictions && data.predictions.length > 0 ? data.predictions[0] : null
        
        if (!topPrediction) {
          throw new Error('No predictions returned from API')
        }
        
        const foodName = topPrediction.class || 'Unknown Food'
        const confidence = topPrediction.confidence_score || 0
        const calories = estimateFoodCalories(foodName)
        
        // Fetch user profile from Google Sheets based on email
        setScanStatus('Fetching your profile from Google Sheets...')
        const userInfo = await getUserFitnessInfo(userEmail)
        console.log('User Fitness Info:', userInfo)
        
        // Check if user should eat this food based on their profile (using Gemini API)
        setScanStatus('Asking AI if this food is right for you...')
        const recommendation = await checkFoodRecommendation(foodName, userInfo)
        
        // Add the scanned food as a new meal
        const newScannedMeal = {
          id: Date.now(),
          name: `Scanned: ${foodName}`,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          calories: calories,
          items: [foodName],
          confidence: confidence,
          recommendation: recommendation
        }
        
        setMeals([...meals, newScannedMeal])
        
        // Show recommendation along with detection
        const recommendationText = recommendation.canEat 
          ? `✅ Good choice! ${recommendation.reason}`
          : `⚠️ Be cautious: ${recommendation.reason}`
        
        setScanStatus(`${recommendationText} | Detected: ${foodName} (${Math.round(confidence * 100)}% confident)`)
        
        // Clear the status message after 5 seconds
        setTimeout(() => setScanStatus(''), 5000)
      } catch (error) {
        console.error('Error scanning food:', error)
        setScanStatus(`❌ Error: ${error.message}`)
        setTimeout(() => setScanStatus(''), 4000)
      } finally {
        setIsScanning(false)
        // Reset file input
        event.target.value = ''
      }
    }
  }

  const getUserFitnessInfo = async (email) => {
    try {
      // Replace with your actual backend endpoint that queries Google Sheets
      // For now, returning a default structure
      // Your backend should return something like:
      // {
      //   name: "John Doe",
      //   fitnessGoal: "weight-loss",
      //   dietaryRestrictions: ["vegetarian", "gluten-free"],
      //   allergies: ["peanut"],
      //   calorieGoal: 1800,
      //   dailyCalorieIntake: 450
      // }
      
      const response = await fetch('http://localhost:3001/api/user-fitness-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        return await response.json()
      }
      
      // Return default if endpoint doesn't exist
      return {
        name: 'User',
        fitnessGoal: 'balanced',
        dietaryRestrictions: [],
        allergies: [],
        calorieGoal: 2000,
        dailyCalorieIntake: 0
      }
    } catch (error) {
      console.warn('Could not fetch user fitness info:', error)
      return {
        name: 'User',
        fitnessGoal: 'balanced',
        dietaryRestrictions: [],
        allergies: [],
        calorieGoal: 2000,
        dailyCalorieIntake: 0
      }
    }
  }

  const checkFoodRecommendation = async (foodName, userInfo) => {
    try {
      // Use Gemini API to intelligently check if user should eat this food
      const prompt = `
You are a fitness nutrition advisor. Based on the user's profile, determine if they should eat the scanned food.

User Profile:
- Name: ${userInfo.name}
- Fitness Goal: ${userInfo.fitnessGoal}
- Dietary Restrictions: ${userInfo.dietaryRestrictions && userInfo.dietaryRestrictions.length > 0 ? userInfo.dietaryRestrictions.join(', ') : 'None'}
- Allergies: ${userInfo.allergies && userInfo.allergies.length > 0 ? userInfo.allergies.join(', ') : 'None'}
- Daily Calorie Goal: ${userInfo.calorieGoal} calories
- Already Consumed Today: ${userInfo.dailyCalorieIntake} calories
- Remaining Budget: ${userInfo.calorieGoal - userInfo.dailyCalorieIntake} calories

Scanned Food: ${foodName}

Please provide:
1. A clear YES or NO recommendation (start with "YES:" or "NO:")
2. A brief reason (max 50 words)

Format your response as: "YES: reason" or "NO: reason"
`

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.REACT_APP_GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        console.warn('Gemini API error, using fallback logic')
        return checkFoodRecommendationFallback(foodName, userInfo)
      }

      const data = await response.json()
      const recommendationText = data.contents[0].parts[0].text.trim()
      
      // Parse the response
      const canEat = recommendationText.toUpperCase().startsWith('YES')
      const reason = recommendationText.split(':')[1]?.trim() || recommendationText
      
      return {
        canEat,
        reason
      }
    } catch (error) {
      console.warn('Error calling Gemini API:', error)
      // Fallback to local logic if API fails
      return checkFoodRecommendationFallback(foodName, userInfo)
    }
  }

  const checkFoodRecommendationFallback = (foodName, userInfo) => {
    // Fallback logic if Gemini API is not available
    const foodLower = foodName.toLowerCase()
    
    // Check allergies
    if (userInfo.allergies && userInfo.allergies.length > 0) {
      for (const allergy of userInfo.allergies) {
        if (foodLower.includes(allergy.toLowerCase())) {
          return {
            canEat: false,
            reason: `Contains ${allergy} - you're allergic!`
          }
        }
      }
    }
    
    // Check dietary restrictions
    if (userInfo.dietaryRestrictions && userInfo.dietaryRestrictions.length > 0) {
      const restrictedFoods = {
        vegetarian: ['chicken', 'beef', 'pork', 'meat', 'fish', 'salmon', 'meat loaf'],
        vegan: ['chicken', 'beef', 'pork', 'meat', 'fish', 'salmon', 'meat loaf', 'milk', 'cheese', 'egg', 'yogurt'],
        'gluten-free': ['bread', 'pasta', 'wheat'],
        'dairy-free': ['milk', 'cheese', 'yogurt', 'ice cream']
      }
      
      for (const restriction of userInfo.dietaryRestrictions) {
        if (restrictedFoods[restriction.toLowerCase()]) {
          for (const restricted of restrictedFoods[restriction.toLowerCase()]) {
            if (foodLower.includes(restricted)) {
              return {
                canEat: false,
                reason: `${foodName} contains ${restricted}, which is restricted for your ${restriction} diet`
              }
            }
          }
        }
      }
    }
    
    // Check calorie intake
    if (userInfo.fitnessGoal === 'weight-loss') {
      const calorieEstimate = estimateFoodCalories(foodName)
      const remainingCalories = userInfo.calorieGoal - userInfo.dailyCalorieIntake
      
      if (calorieEstimate > remainingCalories) {
        return {
          canEat: false,
          reason: `${calorieEstimate} cal would exceed your goal (${remainingCalories} cal remaining)`
        }
      }
    }
    
    return {
      canEat: true,
      reason: `Fits your ${userInfo.fitnessGoal} goal`
    }
  }

  const estimateFoodCalories = (foodName) => {
    // Basic calorie estimation - you can enhance this with a more comprehensive database
    const foodCalories = {
      apple: 95,
      banana: 105,
      oatmeal: 150,
      chicken: 165,
      rice: 206,
      broccoli: 55,
      salmon: 280,
      bread: 79,
      egg: 78,
      milk: 149,
      cheese: 113,
      yogurt: 100,
      pizza: 285,
      burger: 354,
      salad: 150,
      pasta: 221,
      soup: 120,
      sandwich: 300,
    }
    
    const lowerFoodName = foodName.toLowerCase()
    for (const [key, calories] of Object.entries(foodCalories)) {
      if (lowerFoodName.includes(key)) {
        return calories
      }
    }
    return 200 // Default calorie estimate
  }


  return (
    <div className="food-tracker-page">
      <div className="page-header">
        <h1>Food Tracker</h1>
        <p>Track your meals and monitor daily calorie intake</p>
      </div>

      <div className="food-tracker-container">
        <div className="calorie-summary">
          <div className="summary-card">
            <h3>Total Calories Today</h3>
            <p className="calorie-amount">{totalCalories}</p>
            <span className="calorie-goal">Goal: 2000 cal/day</span>
          </div>
          <div className="summary-card">
            <h3>Meals Logged</h3>
            <p className="meal-count">{meals.length}</p>
            <span className="meal-status">Keep tracking!</span>
          </div>
          <div className="summary-card">
            <h3>Remaining</h3>
            <p className="remaining-cal">{Math.max(0, 2000 - totalCalories)}</p>
            <span className="remaining-status">Calories left</span>
          </div>
        </div>

        <div className="meals-section">
          <div className="meals-header">
            <h2>Today's Meals</h2>
            <div className="meal-actions">
              <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                ➕ Add Meal
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleCameraCapture}
                disabled={isScanning}
              >
                {isScanning ? '⏳ Scanning...' : '📷 Scan Food'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {scanStatus && (
            <div className={`scan-status-message ${scanStatus.includes('❌') ? 'error' : ''}`}>
              {scanStatus}
            </div>
          )}

          {showForm && (
            <div className="add-meal-form">
              <input
                type="text"
                placeholder="Meal name (e.g., Breakfast)"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              />
              <input
                type="time"
                value={newMeal.time}
                onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
              />
              <input
                type="number"
                placeholder="Calories"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
              />
              <input
                type="text"
                placeholder="Items (comma separated)"
                value={newMeal.items}
                onChange={(e) => setNewMeal({ ...newMeal, items: e.target.value })}
              />
              <div className="form-actions">
                <button className="btn btn-success" onClick={addMeal}>Save Meal</button>
                <button className="btn btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="meals-list">
            {meals.map(meal => (
              <div key={meal.id} className="meal-card">
                <div className="meal-info">
                  <h3>{meal.name}</h3>
                  <p className="meal-time">🕐 {meal.time}</p>
                  {meal.items.length > 0 && (
                    <p className="meal-items">{meal.items.join(', ')}</p>
                  )}
                  {meal.recommendation && (
                    <p className={`meal-recommendation ${meal.recommendation.canEat ? 'good' : 'caution'}`}>
                      {meal.recommendation.canEat ? '✅' : '⚠️'} {meal.recommendation.reason}
                    </p>
                  )}
                </div>
                <div className="meal-details">
                  <span className="meal-calories">{meal.calories} cal</span>
                  <button className="btn-delete" onClick={() => deleteMeal(meal.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="nutrition-tips">
          <h3>📖 Nutrition Tips</h3>
          <ul>
            <li>Eat balanced meals with protein, carbs, and healthy fats</li>
            <li>Drink plenty of water throughout the day</li>
            <li>Use the camera to quickly scan and identify foods</li>
            <li>Monitor portions for better calorie control</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FoodTrackerPage
