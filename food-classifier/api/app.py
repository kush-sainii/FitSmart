# ============================================================================
# FOOD-101 CLASSIFICATION - FASTAPI BACKEND
# ============================================================================
# REST API for food classification with nutrition information
# 
# Endpoints:
#   POST /predict - Upload an image and get food prediction
#   GET /health - Health check
#   GET / - API info
# 
# Usage:
#   python app.py
#   Server runs on http://127.0.0.1:8000
#   API docs available at http://127.0.0.1:8000/docs
# ============================================================================

import os
import sys
import json
import numpy as np
import tensorflow as tf
from io import BytesIO
from PIL import Image
import warnings
warnings.filterwarnings('ignore')

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.nutrition import get_nutrition

# ============================================================================
# CONFIGURATION
# ============================================================================
IMAGE_SIZE = 224
MODEL_PATH = "./model/food_model_full.h5"
CLASS_NAMES_PATH = "./model/class_names.json"

# ============================================================================
# DATA MODELS
# ============================================================================

class PredictionResult(BaseModel):
    """Model for single prediction result"""
    food: str
    confidence: float
    calories: int
    protein: int
    fat: int
    carbs: int


class PredictionResponse(BaseModel):
    """Model for API response"""
    status: str
    top_prediction: PredictionResult
    top_5_predictions: List[PredictionResult]
    message: Optional[str] = None


class HealthResponse(BaseModel):
    """Model for health check response"""
    status: str
    model_loaded: bool
    classes_count: int


class InfoResponse(BaseModel):
    """Model for API info response"""
    name: str
    version: str
    description: str
    endpoints: dict


# ============================================================================
# GLOBAL VARIABLES
# ============================================================================

# Global model and class names (loaded on startup)
model = None
class_names = None

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def load_model_and_classes():
    """
    Load the trained model and class names at startup
    """
    global model, class_names
    
    print("\n" + "="*70)
    print("LOADING MODEL AND CLASS NAMES...")
    print("="*70)
    
    # Load model
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Model not found at {MODEL_PATH}")
        print("Please train the model first using: python scripts/train.py")
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    
    print(f"Loading model from {MODEL_PATH}...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✓ Model loaded successfully!")
    
    # Load class names
    if not os.path.exists(CLASS_NAMES_PATH):
        print(f"ERROR: Class names not found at {CLASS_NAMES_PATH}")
        raise FileNotFoundError(f"Class names not found at {CLASS_NAMES_PATH}")
    
    print(f"Loading class names from {CLASS_NAMES_PATH}...")
    with open(CLASS_NAMES_PATH, 'r') as f:
        class_names = json.load(f)
    print(f"✓ Loaded {len(class_names)} food classes!")
    
    print("="*70 + "\n")


def preprocess_image(image_bytes):
    """
    Load, resize, and preprocess image for model input
    
    Args:
        image_bytes: Image bytes from upload
    
    Returns:
        np.ndarray: Preprocessed image as array
    
    Raises:
        ValueError: If image cannot be processed
    """
    
    try:
        # Open image from bytes
        img = Image.open(BytesIO(image_bytes)).convert('RGB')
        
        # Resize to model input size
        img_resized = img.resize((IMAGE_SIZE, IMAGE_SIZE))
        
        # Convert to array and normalize to [0, 1]
        img_array = np.array(img_resized, dtype=np.float32) / 255.0
        
        # Add batch dimension: (HEIGHT, WIDTH, 3) -> (1, HEIGHT, WIDTH, 3)
        img_batch = np.expand_dims(img_array, axis=0)
        
        return img_batch
    
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")


def predict_food(image_bytes):
    """
    Make prediction on image
    
    Args:
        image_bytes: Image bytes from upload
    
    Returns:
        dict: Prediction results
    
    Raises:
        ValueError: If prediction fails
    """
    
    # Check if model is loaded
    if model is None:
        raise ValueError("Model not loaded. Please start the server properly.")
    
    # Preprocess image
    img_batch = preprocess_image(image_bytes)
    
    # Get predictions
    predictions = model.predict(img_batch, verbose=0)
    
    # Get top 5 predictions
    top_5_idx = np.argsort(predictions[0])[-5:][::-1]
    
    results = {
        "top_prediction": {
            "food": class_names[top_5_idx[0]],
            "confidence": float(predictions[0][top_5_idx[0]])
        },
        "top_5_predictions": []
    }
    
    # Add nutrition info for each prediction
    for idx in top_5_idx:
        confidence = float(predictions[0][idx])
        food_name = class_names[idx]
        nutrition = get_nutrition(food_name)
        
        results["top_5_predictions"].append({
            "food": food_name,
            "confidence": confidence,
            "calories": nutrition["calories"],
            "protein": nutrition["protein"],
            "fat": nutrition["fat"],
            "carbs": nutrition["carbs"]
        })
    
    return results


# ============================================================================
# CREATE FASTAPI APP
# ============================================================================

app = FastAPI(
    title="Food-101 Classification API",
    description="API for food classification and nutritional analysis",
    version="1.0.0"
)

# Add CORS middleware (allow requests from any origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# STARTUP/SHUTDOWN EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Load model when server starts"""
    load_model_and_classes()
    print("✓ API Server started successfully!")


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/", response_model=InfoResponse)
async def root():
    """
    API information endpoint
    """
    return InfoResponse(
        name="Food-101 Classification API",
        version="1.0.0",
        description="Classify food images and get nutritional information",
        endpoints={
            "POST /predict": "Upload image and get food prediction",
            "GET /health": "Check API health status",
            "GET /docs": "Interactive API documentation"
        }
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    """
    return HealthResponse(
        status="healthy" if model is not None else "unhealthy",
        model_loaded=model is not None,
        classes_count=len(class_names) if class_names is not None else 0
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict_image(file: UploadFile = File(...)):
    """
    Predict food from uploaded image
    
    Parameters:
        file: Image file (JPG, PNG, BMP, GIF)
    
    Returns:
        PredictionResponse: Top prediction and top 5 predictions with confidence and nutrition info
    
    Example:
        curl -X POST "http://localhost:8000/predict" \\
             -F "file=@/path/to/image.jpg"
    """
    
    try:
        # Check file extension
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.gif'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file format. Supported: {allowed_extensions}"
            )
        
        # Read image bytes
        image_bytes = await file.read()
        
        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Empty file provided"
            )
        
        # Make prediction
        results = predict_food(image_bytes)
        
        # Format response
        top_pred = results["top_prediction"]
        top_5_preds = results["top_5_predictions"]
        
        return PredictionResponse(
            status="success",
            top_prediction=PredictionResult(**top_5_preds[0]),
            top_5_predictions=[PredictionResult(**p) for p in top_5_preds],
            message=f"Successfully classified as {top_pred['food']} with {top_pred['confidence']:.1%} confidence"
        )
    
    except HTTPException:
        raise
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*70)
    print("STARTING FOOD-101 CLASSIFICATION API")
    print("="*70)
    print("\nServer will start on: http://127.0.0.1:8000")
    print("API Documentation: http://127.0.0.1:8000/docs")
    print("Health Check: http://127.0.0.1:8000/health")
    print("\nPress Ctrl+C to stop the server")
    print("="*70 + "\n")
    
    # Start server
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info"
    )
