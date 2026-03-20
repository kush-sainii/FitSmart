# ============================================================================
# INTEGRATION EXAMPLE - Using Food Classification in Your Fitness App
# ============================================================================
# This file shows how to integrate the food classification API into your
# fitness application (web, mobile, standalone)
# ============================================================================

"""
INTEGRATION SCENARIOS
=====================

1. Web Application (Flask/Django/FastAPI backend)
2. Mobile Application (iOS/Android)
3. Desktop Application (Electron/PyQt)
4. Command-line Tool
5. Chatbot/Assistant Integration
"""

# ============================================================================
# SCENARIO 1: PYTHON BACKEND (Flask / Django)
# ============================================================================

"""
When user uploads food image from web UI:

1. Send to your Python backend
2. Call our API
3. Store nutrition data in database
4. Log to user's daily intake
"""

# example_flask_integration.py

from flask import Flask, request, jsonify
import requests
from datetime import datetime

app = Flask(__name__)

# URL of our Food-101 API (running locally or in cloud)
FOOD_API_URL = "http://127.0.0.1:8000/predict"


@app.route('/api/log-food', methods=['POST'])
def log_food():
    """
    User uploads food image, we predict and log to database
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image_file = request.files['image']
    user_id = request.form.get('user_id')
    meal_type = request.form.get('meal_type')  # breakfast, lunch, dinner, snack
    
    try:
        # 1. Call our Food-101 API
        files = {'file': (image_file.filename, image_file.stream, image_file.content_type)}
        response = requests.post(FOOD_API_URL, files=files)
        
        if response.status_code != 200:
            return jsonify({'error': 'Prediction failed'}), 500
        
        prediction = response.json()
        
        # 2. Extract nutrition info
        food_name = prediction['top_prediction']['food']
        confidence = prediction['top_prediction']['confidence']
        nutrition = prediction['top_prediction']  # Has calories, protein, fat, carbs
        
        # 3. Log to database
        log_entry = {
            'user_id': user_id,
            'food': food_name,
            'confidence': confidence,
            'calories': nutrition['calories'],
            'protein': nutrition['protein'],
            'fat': nutrition['fat'],
            'carbs': nutrition['carbs'],
            'meal_type': meal_type,
            'timestamp': datetime.now().isoformat(),
            'top_5': prediction['top_5_predictions']  # Alternative predictions
        }
        
        # Save to your database (MongoDB, PostgreSQL, etc.)
        # db.food_log.insert_one(log_entry)
        
        # 4. Return response to frontend
        return jsonify({
            'success': True,
            'food': food_name,
            'confidence': f"{confidence:.1%}",
            'calories': nutrition['calories'],
            'message': f"Logged {food_name} to your {meal_type}"
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/daily-summary/<user_id>', methods=['GET'])
def daily_summary(user_id):
    """
    Get user's daily nutrition summary
    """
    # Query database for today's foods
    # today_foods = db.food_log.find({
    #     'user_id': user_id,
    #     'date': today
    # })
    
    # Calculate totals
    total_calories = sum([f['calories'] for f in today_foods])
    total_protein = sum([f['protein'] for f in today_foods])
    total_fat = sum([f['fat'] for f in today_foods])
    total_carbs = sum([f['carbs'] for f in today_foods])
    
    return jsonify({
        'date': str(today),
        'meals': len(today_foods),
        'total_calories': total_calories,
        'total_protein': total_protein,
        'total_fat': total_fat,
        'total_carbs': total_carbs,
        'foods': [f['food'] for f in today_foods]
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)


# ============================================================================
# SCENARIO 2: JAVASCRIPT/REACT FRONTEND
# ============================================================================

"""
// React component for food logging
"""

# example_react_component.jsx

import React, { useState } from 'react';
import axios from 'axios';

function FoodLogger() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPrediction(null);
    setError(null);
  };

  // Upload and predict
  const handlePredict = async () => {
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use FastAPI endpoint
      const formData = new FormData();
      formData.append('file', image);

      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data);

      // Show prediction to user
      console.log(`Food: ${data.top_prediction.food}`);
      console.log(`Confidence: ${(data.top_prediction.confidence * 100).toFixed(1)}%`);
      console.log(`Calories: ${data.top_prediction.calories}`);

    } catch (err) {
      setError('Failed to predict. Make sure API is running on http://127.0.0.1:8000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Log food to backend
  const handleLogFood = async () => {
    if (!prediction) return;

    try {
      const response = await axios.post('/api/log-food', {
        food_name: prediction.top_prediction.food,
        confidence: prediction.top_prediction.confidence,
        nutrition: prediction.top_prediction,
        meal_type: 'lunch'  // or user selection
      });

      console.log('Food logged:', response.data);
      alert(`✓ Logged ${prediction.top_prediction.food}`);
      setImage(null);
      setPrediction(null);

    } catch (err) {
      setError('Failed to log food');
    }
  };

  return (
    <div className="food-logger">
      <h2>📸 Log Your Food</h2>

      {/* Image input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Image preview */}
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          style={{ width: '200px', marginTop: '10px' }}
        />
      )}

      {/* Predict button */}
      <button
        onClick={handlePredict}
        disabled={!image || loading}
      >
        {loading ? 'Predicting...' : 'Predict Food'}
      </button>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Prediction results */}
      {prediction && (
        <div className="prediction-results">
          <h3>Prediction: {prediction.top_prediction.food.toUpperCase()}</h3>
          <p>Confidence: {(prediction.top_prediction.confidence * 100).toFixed(1)}%</p>

          <div className="nutrition-info">
            <p>📊 Nutrition (per serving):</p>
            <ul>
              <li>Calories: {prediction.top_prediction.calories}</li>
              <li>Protein: {prediction.top_prediction.protein}g</li>
              <li>Fat: {prediction.top_prediction.fat}g</li>
              <li>Carbs: {prediction.top_prediction.carbs}g</li>
            </ul>
          </div>

          <button onClick={handleLogFood}>✓ Log This Food</button>

          {/* Alternative predictions */}
          <details>
            <summary>Top 5 Predictions</summary>
            <ul>
              {prediction.top_5_predictions.map((pred, idx) => (
                <li key={idx}>
                  {idx + 1}. {pred.food} ({(pred.confidence * 100).toFixed(1)}%)
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}

export default FoodLogger;


# ============================================================================
# SCENARIO 3: MOBILE APP (React Native / Flutter)
# ============================================================================

"""
// React Native Example
"""

# example_mobile_app.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function FoodLoggerScreen() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick image from device
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setPrediction(null);
    }
  };

  // Predict food using API
  const predictFood = async () => {
    if (!image) return;

    setLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: 'food.jpg',
      });

      // Call API
      const response = await fetch('http://YOUR-API-URL:8000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setPrediction(data);

    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logFood = async () => {
    if (!prediction) return;

    try {
      // Send to your backend
      const response = await fetch('http://YOUR-BACKEND-URL/api/log-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_name: prediction.top_prediction.food,
          nutrition: prediction.top_prediction,
          user_id: 'user123', // From auth context
        }),
      });

      if (response.ok) {
        alert(`✓ Logged ${prediction.top_prediction.food}`);
        setImage(null);
        setPrediction(null);
      }
    } catch (error) {
      console.error('Failed to log:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>📸 Log Food</Text>

      {/* Image picking button */}
      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
          Pick Image
        </Text>
      </TouchableOpacity>

      {/* Image preview */}
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: 300, marginTop: 20, borderRadius: 8 }}
        />
      )}

      {/* Predict button */}
      <TouchableOpacity
        onPress={predictFood}
        disabled={!image || loading}
        style={{
          backgroundColor: '#34C759',
          padding: 15,
          borderRadius: 8,
          marginTop: 15,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
          {loading ? 'Predicting...' : 'Predict Food'}
        </Text>
      </TouchableOpacity>

      {/* Loading indicator */}
      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {/* Prediction results */}
      {prediction && (
        <View style={{ marginTop: 30, backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {prediction.top_prediction.food.toUpperCase()}
          </Text>
          <Text style={{ fontSize: 16, color: '#666', marginTop: 5 }}>
            Confidence: {(prediction.top_prediction.confidence * 100).toFixed(1)}%
          </Text>

          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 15 }}>
            Nutrition:
          </Text>
          <Text>🔥 Calories: {prediction.top_prediction.calories}</Text>
          <Text>💪 Protein: {prediction.top_prediction.protein}g</Text>
          <Text>🥑 Fat: {prediction.top_prediction.fat}g</Text>
          <Text>🍞 Carbs: {prediction.top_prediction.carbs}g</Text>

          {/* Log button */}
          <TouchableOpacity
            onPress={logFood}
            style={{
              backgroundColor: '#FF3B30',
              padding: 12,
              borderRadius: 8,
              marginTop: 15,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
              ✓ Log This Food
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}


# ============================================================================
# SCENARIO 4: RUNNING AS MULTIPLE SERVICES
# ============================================================================

"""
Docker Compose setup to run API and web frontend together:

docker-compose.yml:

version: '3'
services:
  api:
    build: ./food-classifier
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/model/food_model_full.h5
    volumes:
      - ./model:/app/model

  frontend:
    build: ./web-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://api:8000
    depends_on:
      - api

Then run: docker-compose up
"""


# ============================================================================
# SCENARIO 5: COMMAND-LINE INTEGRATION
# ============================================================================

"""
Monitoring tool to log foods from command line:

cli_food_logger.py

import argparse
import requests
import json
from datetime import datetime

def log_food(image_path, user_id, meal_type):
    '''Log a food from command line'''
    
    # Predict
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post('http://127.0.0.1:8000/predict', files=files)
    
    prediction = response.json()
    food = prediction['top_prediction']
    
    # Log entry
    entry = {
        'timestamp': datetime.now().isoformat(),
        'user_id': user_id,
        'meal_type': meal_type,
        'food': food['food'],
        'confidence': food['confidence'],
        'calories': food['calories'],
        'protein': food['protein'],
    }
    
    # Save to file or database
    with open('food_log.json', 'a') as f:
        f.write(json.dumps(entry) + '\\n')
    
    print(f"✓ Logged {food['food']} ({food['confidence']:.1%} confidence)")
    print(f"  Calories: {food['calories']}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Log food from command line')
    parser.add_argument('image', help='Path to food image')
    parser.add_argument('--user', default='default', help='User ID')
    parser.add_argument('--meal', default='lunch', help='Meal type (breakfast/lunch/dinner/snack)')
    
    args = parser.parse_args()
    log_food(args.image, args.user, args.meal)

Usage:
  python cli_food_logger.py pizza.jpg --user john --meal lunch
"""


# ============================================================================
# DEPLOYMENT OPTIONS
# ============================================================================

"""
1. LOCAL DEPLOYMENT
   - Run API on your machine: python api/app.py
   - Access from same network: http://machine-ip:8000
   - Good for: Development, testing

2. AWS EC2
   - Deploy API on EC2 instance
   - Connect from mobile/web app
   - Cost: ~$10-30/month

3. AZURE CONTAINER INSTANCES
   - Deploy Docker container
   - Serverless pricing
   - Cost: ~$20-50/month

4. GOOGLE CLOUD RUN
   - Serverless deployment
   - Pay per request
   - Cost: ~$5-20/month

5. HEROKU
   - Simple deployment
   - Free tier available
   - Cost: Free or $7-50/month

6. ON-DEVICE (Mobile)
   - Convert to TensorFlow Lite
   - Run model on device
   - No internet needed
   - Better privacy
"""

# ============================================================================
# EXAMPLE: CONVERT TO TENSORFLOW LITE FOR MOBILE
# ============================================================================

"""
convert_to_tflite.py

import tensorflow as tf

# Load model
model = tf.keras.models.load_model('model/food_model_full.h5')

# Convert to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Save
with open('model/food_model.tflite', 'wb') as f:
    f.write(tflite_model)

print("✓ Converted to TensorFlow Lite")
print("  File size: 10MB (smaller than 30MB .h5)")
print("  Can now run on mobile devices!")

Then use with TensorFlow Lite:

// Swift (iOS)
import TensorFlowLite

let interpreter = try Interpreter(modelPath: "food_model.tflite")
try interpreter.allocateTensors()
// Feed input and get predictions

// Kotlin (Android)
import org.tensorflow.lite.Interpreter

val interpreter = Interpreter(File("food_model.tflite"))
// Feed input and get predictions
"""

print("\n" + "="*70)
print("INTEGRATION COMPLETE!")
print("="*70)
print("""
You now have examples for:
✓ Flask/Django backend integration
✓ React frontend component
✓ React Native mobile app
✓ Docker deployment
✓ Command-line tools
✓ TensorFlow Lite conversion

Choose the integration that fits your use case!
""")
