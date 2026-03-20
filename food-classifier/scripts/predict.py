# ============================================================================
# FOOD-101 CLASSIFICATION - PREDICTION SCRIPT
# ============================================================================
# This script allows you to test the trained model on a single image
# Usage: python predict.py <path_to_image>
# ============================================================================

import os
import sys
import json
import numpy as np
import tensorflow as tf
from PIL import Image
import warnings
warnings.filterwarnings('ignore')

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
# HELPER FUNCTIONS
# ============================================================================

def load_model():
    """
    Load the trained model
    """
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Model not found at {MODEL_PATH}")
        print("Please train the model first using: python scripts/train.py")
        return None
    
    print(f"Loading model from {MODEL_PATH}...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully!")
    
    return model


def load_class_names():
    """
    Load class names from JSON file
    """
    if not os.path.exists(CLASS_NAMES_PATH):
        print(f"ERROR: Class names file not found at {CLASS_NAMES_PATH}")
        return None
    
    with open(CLASS_NAMES_PATH, 'r') as f:
        class_names = json.load(f)
    
    return class_names


def preprocess_image(image_path):
    """
    Load, resize, and preprocess image for model input
    
    Args:
        image_path (str): Path to the image file
    
    Returns:
        np.ndarray: Preprocessed image as array
        PIL.Image: Original image object
    """
    
    # Load image
    if not os.path.exists(image_path):
        print(f"ERROR: Image not found at {image_path}")
        return None, None
    
    print(f"\nLoading image: {image_path}")
    img = Image.open(image_path).convert('RGB')
    
    # Resize to model input size
    img_resized = img.resize((IMAGE_SIZE, IMAGE_SIZE))
    
    # Convert to array and normalize to [0, 1]
    img_array = np.array(img_resized, dtype=np.float32) / 255.0
    
    # Add batch dimension: (HEIGHT, WIDTH, 3) -> (1, HEIGHT, WIDTH, 3)
    img_batch = np.expand_dims(img_array, axis=0)
    
    return img_batch, img


def predict(model, image_batch, class_names):
    """
    Make prediction on preprocessed image
    
    Args:
        model: Trained TensorFlow model
        image_batch: Preprocessed image batch
        class_names: List of class names
    
    Returns:
        dict: Prediction results
    """
    
    print("\nMaking prediction...")
    
    # Get model predictions (probabilities for each class)
    predictions = model.predict(image_batch, verbose=0)
    
    # Get top 5 predictions
    top_5_idx = np.argsort(predictions[0])[-5:][::-1]
    
    results = {
        "top_prediction": {
            "food": class_names[top_5_idx[0]],
            "confidence": float(predictions[0][top_5_idx[0]])
        },
        "top_5_predictions": []
    }
    
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


def print_results(results):
    """
    Pretty print prediction results
    """
    print("\n" + "="*70)
    print("PREDICTION RESULTS")
    print("="*70)
    
    top_pred = results["top_prediction"]
    print(f"\nTop Prediction: {top_pred['food'].upper()}")
    print(f"Confidence: {top_pred['confidence']:.2%}")
    
    # Get nutrition for top prediction
    nutrition = get_nutrition(top_pred['food'])
    print(f"\nNutrition Information (per serving):")
    print(f"  Calories: {nutrition['calories']} kcal")
    print(f"  Protein: {nutrition['protein']}g")
    print(f"  Fat: {nutrition['fat']}g")
    print(f"  Carbs: {nutrition['carbs']}g")
    
    print(f"\n" + "-"*70)
    print("Top 5 Predictions:")
    print("-"*70)
    
    for i, pred in enumerate(results["top_5_predictions"], 1):
        print(f"\n{i}. {pred['food'].upper()}")
        print(f"   Confidence: {pred['confidence']:.2%}")
        print(f"   Calories: {pred['calories']} | Protein: {pred['protein']}g | " +
              f"Fat: {pred['fat']}g | Carbs: {pred['carbs']}g")
    
    print("\n" + "="*70 + "\n")


# ============================================================================
# MAIN PREDICTION PIPELINE
# ============================================================================

def main():
    
    # Check command line arguments
    if len(sys.argv) < 2:
        print("="*70)
        print("FOOD-101 CLASSIFICATION - SINGLE IMAGE PREDICTION")
        print("="*70)
        print("\nUsage: python predict.py <path_to_image>")
        print("\nExample:")
        print("  python predict.py sample_pizza.jpg")
        print("  python predict.py /path/to/food_image.png")
        print("\nSupported formats: JPG, PNG, BMP, GIF")
        print("="*70 + "\n")
        return
    
    image_path = sys.argv[1]
    
    # Step 1: Load model
    print("\n" + "="*70)
    print("LOADING MODEL AND PREPARING...")
    print("="*70)
    
    model = load_model()
    if model is None:
        return
    
    # Step 2: Load class names
    class_names = load_class_names()
    if class_names is None:
        return
    
    print(f"Number of food classes: {len(class_names)}")
    
    # Step 3: Preprocess image
    print("\nPreprocessing image...")
    img_batch, original_img = preprocess_image(image_path)
    if img_batch is None:
        return
    
    print(f"Image resized to: {IMAGE_SIZE}x{IMAGE_SIZE}")
    
    # Step 4: Make prediction
    results = predict(model, img_batch, class_names)
    
    # Step 5: Display results
    print_results(results)
    
    # Optional: Display image
    try:
        print(f"Image dimensions: {original_img.size}")
    except Exception as e:
        print(f"Could not display image info: {e}")


if __name__ == "__main__":
    main()
