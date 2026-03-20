# ============================================================================
# FOOD-101 CLASSIFICATION SYSTEM - COMPLETE SETUP & USAGE GUIDE
# ============================================================================

## PROJECT OVERVIEW

This is a production-ready food classification system that:
- Uses the full Food-101 dataset (101 food classes, ~101,000 images)
- Employs transfer learning with MobileNetV2 for efficient training
- Provides a REST API for real-time predictions
- Includes nutrition information mapping
- Works efficiently on both CPU and GPU

### Key Features:
✓ Two-phase training (feature extraction + fine-tuning)
✓ Data augmentation for better generalization
✓ Official train/test split (not random)
✓ Efficient memory usage with generators
✓ Complete API with Swagger documentation
✓ Beginner-friendly code with detailed comments

---

## TABLE OF CONTENTS

1. [Project Structure](#project-structure)
2. [Installation](#installation)
3. [Dataset Setup](#dataset-setup)
4. [Training](#training)
5. [Testing](#testing)
6. [Running the API](#running-the-api)
7. [API Usage Examples](#api-usage-examples)
8. [Performance Tips](#performance-tips)
9. [Troubleshooting](#troubleshooting)

---

## PROJECT STRUCTURE

```
food-classifier/
├── dataset/
│   └── food-101/                    # Food-101 dataset (download required)
│       ├── images/                  # Food images organized by class
│       │   ├── pizza/
│       │   ├── burger/
│       │   ├── pasta/
│       │   ├── ...
│       │   └── (101 food classes)
│       └── meta/
│           ├── classes.txt          # List of 101 food classes
│           ├── train.txt            # Training split (official)
│           ├── test.txt             # Test split (official)
│           └── labels.txt           # Label information
│
├── model/
│   ├── food_model_full.h5           # Trained model (created after training)
│   ├── class_names.json             # 101 class names (created after training)
│   ├── training_history.json        # Training metrics (created after training)
│   └── training_history.png         # Loss/accuracy plots (created after training)
│
├── api/
│   └── app.py                       # FastAPI server
│
├── scripts/
│   ├── train.py                     # Training script
│   ├── predict.py                   # Single image prediction script
│   └── nutrition.py                 # Nutrition database
│
└── requirements.txt                 # Python dependencies

```

---

## INSTALLATION

### Step 1: Python & Virtual Environment

Ensure you have Python 3.8+ installed.

**On Windows:**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Upgrade pip
python -m pip install --upgrade pip
```

**On macOS/Linux:**
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- TensorFlow 2.13 (deep learning framework)
- FastAPI (web API framework)
- Pillow (image processing)
- NumPy (numerical computing)
- Uvicorn (ASGI server)
- Matplotlib (plotting)

**Installation Time:** ~5-10 minutes (depends on internet speed)
**Disk Space Required:** ~1GB for dependencies

---

## DATASET SETUP

### Option 1: Download Food-101 Dataset

The Food-101 dataset is ~5GB. You have multiple options:

**Option A: Direct Download (Recommended)**
```bash
# On Windows (using PowerShell)
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri "https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz" -OutFile "food-101.tar.gz"

# Extract using 7-Zip or tar (if Windows 10+)
tar -xzf food-101.tar.gz -C dataset/
```

**Option B: Using wget/curl (macOS/Linux)**
```bash
cd dataset/
wget https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz
tar xzf food-101.tar.gz
cd ..
```

**Option C: Python Script**
```python
import urllib.request
import tarfile
import os

print("Downloading Food-101 dataset (5GB)...")
url = "https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz"
filename = "food-101.tar.gz"

# Download with progress
def download_hook(block_num, block_size, total_size):
    downloaded = block_num * block_size
    percent = min(downloaded * 100 // total_size, 100)
    print(f"Downloaded: {percent}%", end='\r')

urllib.request.urlretrieve(url, filename, download_hook)

print("\nExtracting...")
os.makedirs("dataset", exist_ok=True)
with tarfile.open(filename, "r:gz") as tar:
    tar.extractall(path="dataset/")

print("Done! Dataset extracted to dataset/food-101/")
```

**Option D: Google Colab (Recommended for GPU)**
```python
# Run in Colab cell
!cd /content && wget https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz
!tar xzf food-101.tar.gz
!ls -la food-101/images/ | head -20
```

### Expected Structure After Extraction
```
dataset/food-101/
├── images/                          # 101 food folders
│   ├── apple_pie/                  # 750 images per class
│   ├── baby_back_ribs/
│   ├── baklava/
│   ├── ... (101 total)
│   └── zucchini/
└── meta/
    ├── classes.txt                 # 101 class names
    ├── train.txt                   # 75,750 training images
    ├── test.txt                    # 25,250 test images
    └── labels.txt
```

### Verify Dataset
```bash
# Check if dataset is properly extracted
python scripts/train.py  # Will check dataset. If not found, it will show instructions
```

---

## TRAINING

### Option 1: Local Training (CPU/GPU on your machine)

**Requirements:**
- GPU: NVIDIA with CUDA (recommended, ~1 hour training)
- CPU: ~4-8 hours training (slower but works)
- RAM: 8GB minimum, 16GB recommended
- Disk space: 5GB dataset + 2GB for model

**Start Training:**
```bash
cd food-classifier
python scripts/train.py
```

**What happens during training:**
1. Loads Food-101 dataset from official splits
2. Creates image generators with augmentation
3. **Phase 1 (5 epochs):** Train classification head with frozen base model (~20 minutes)
4. **Phase 2 (10 epochs):** Fine-tune top layers with lower learning rate (~20 minutes)
5. Saves best model to `model/food_model_full.h5`
6. Creates training history plot

**Expected Output:**
```
========================================
Loading dataset...
Found 75,750 training images
Found 25,250 test images
Found 101 food classes
========================================

Phase 1: Feature Extraction (Frozen Base Model)
Epoch 1/5: accuracy: 0.75, val_accuracy: 0.78
Epoch 2/5: accuracy: 0.82, val_accuracy: 0.84
...

Phase 2: Fine-tuning
Epoch 6/15: accuracy: 0.85, val_accuracy: 0.86
...

Test Accuracy: 0.8735  (87.35%)
Test Loss: 0.4521

Model saved to: model/food_model_full.h5
```

### Option 2: Google Colab Training (Recommended for Free GPU)

**Advantages:**
- Free GPU (NVIDIA T4 or V100)
- 12GB RAM
- Pre-installed libraries
- Can run overnight

**Steps:**

1. Go to https://colab.research.google.com
2. New notebook
3. Run these cells:

```python
# Cell 1: Install dependencies
!pip install tensorflow keras pillow fastapi uvicorn

# Cell 2: Download dataset
import os
os.chdir('/content')
!wget https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz
!tar xzf food-101.tar.gz
!ls -la food-101/images/ | head -10

# Cell 3: Clone/create project files
!mkdir -p food-classifier/{dataset,model,api,scripts}
!cd food-classifier && pwd

# Cell 4: Upload your scripts (nutrition.py, train.py) or create them
# You can upload files or use !wget to download from github

# Cell 5: Run training
%cd food-classifier
!python scripts/train.py
```

**For Kaggle (similar to Colab):**
1. Create new notebook on https://www.kaggle.com/
2. Add Food-101 dataset from "Add Data"
3. Run training cells

### Option 3: Kaggle (Has Food-101 Dataset Pre-loaded)

Kaggle has Food-101 already available!

1. Go to: https://www.kaggle.com/code
2. Create new notebook
3. Add Food-101 dataset from "Input Data"
4. Run training code

---

## TESTING

### Option 1: Test on Single Image (Local)

**Find a test image:**
```bash
# From the dataset
python scripts/predict.py dataset/food-101/images/pizza/123456.jpg

# Or use any food image from internet
# Save as: test_image.jpg
python scripts/predict.py test_image.jpg
```

**Output Example:**
```
========================================
PREDICTION RESULTS
========================================

Top Prediction: PIZZA
Confidence: 92.45%

Nutrition Information (per serving):
  Calories: 285 kcal
  Protein: 12g
  Fat: 10g
  Carbs: 36g

----------------------------------------
Top 5 Predictions:
----------------------------------------

1. PIZZA
   Confidence: 92.45%
   Calories: 285 | Protein: 12g | Fat: 10g | Carbs: 36g

2. FOCACCIA
   Confidence: 4.32%
   Calories: 320 | Protein: 8g | Fat: 14g | Carbs: 42g

3. FALAFEL
   Confidence: 2.18%
   Calories: 333 | Protein: 11g | Fat: 17g | Carbs: 33g

4. NACHOS
   Confidence: 0.92%
   Calories: 470 | Protein: 17g | Fat: 20g | Carbs: 54g

5. BURRITO
   Confidence: 0.13%
   Calories: 380 | Protein: 15g | Fat: 12g | Carbs: 55g

========================================
```

### Option 2: Test Model Programmatically

```python
import sys
sys.path.insert(0, '.')

from scripts.predict import load_model, load_class_names, preprocess_image, predict, print_results

# Load model
model = load_model()
class_names = load_class_names()

# Predict
img_batch, _ = preprocess_image("test_image.jpg")
results = predict(model, img_batch, class_names)

# Print results
print_results(results)
```

---

## RUNNING THE API

### Start the FastAPI Server

```bash
python api/app.py
```

**Output:**
```
========================================
STARTING FOOD-101 CLASSIFICATION API
========================================

Server will start on: http://127.0.0.1:8000
API Documentation: http://127.0.0.1:8000/docs
Health Check: http://127.0.0.1:8000/health

Press Ctrl+C to stop the server
========================================

INFO: Started server process [12345]
INFO: Uvicorn running on http://127.0.0.1:8000
```

### Access API

**Interactive Documentation (Swagger UI):**
- Open browser: http://127.0.0.1:8000/docs
- Try out endpoints directly from browser
- See request/response examples

**ReDoc Documentation:**
- Open browser: http://127.0.0.1:8000/redoc

**Health Check:**
- Open browser: http://127.0.0.1:8000/health

---

## API USAGE EXAMPLES

### Method 1: Using curl (Command Line)

```bash
# Test health
curl http://127.0.0.1:8000/health

# Make prediction
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@/path/to/food_image.jpg"
```

### Method 2: Using Python requests

```python
import requests

# Health check
response = requests.get("http://127.0.0.1:8000/health")
print(response.json())

# Make prediction
with open('test_image.jpg', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        "http://127.0.0.1:8000/predict",
        files=files
    )
    print(response.json())
```

### Method 3: Using Postman

1. Open Postman
2. Create new POST request
3. URL: `http://127.0.0.1:8000/predict`
4. Go to "Body" tab → select "form-data"
5. Add key: `file` (type: File)
6. Select your image
7. Click "Send"

**Response Example:**
```json
{
  "status": "success",
  "top_prediction": {
    "food": "pizza",
    "confidence": 0.9245,
    "calories": 285,
    "protein": 12,
    "fat": 10,
    "carbs": 36
  },
  "top_5_predictions": [
    {
      "food": "pizza",
      "confidence": 0.9245,
      "calories": 285,
      "protein": 12,
      "fat": 10,
      "carbs": 36
    },
    {
      "food": "focaccia",
      "confidence": 0.0432,
      "calories": 320,
      "protein": 8,
      "fat": 14,
      "carbs": 42
    },
    ...
  ],
  "message": "Successfully classified as pizza with 92.5% confidence"
}
```

### Method 4: Using JavaScript/React

```javascript
// Send prediction request
async function predictFood(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch('http://127.0.0.1:8000/predict', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  console.log(result);
  
  return result;
}

// Example usage
const fileInput = document.getElementById('imageInput');
fileInput.addEventListener('change', async (e) => {
  const result = await predictFood(e.target.files[0]);
  console.log(`Predicted: ${result.top_prediction.food}`);
  console.log(`Confidence: ${(result.top_prediction.confidence * 100).toFixed(2)}%`);
});
```

### Method 5: Using cURL with Image from URL

```bash
# Download image and predict
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@$(wget -q -O- https://example.com/pizza.jpg | tee pizza.jpg)"
```

---

## PERFORMANCE OPTIMIZATION

### 1. Why MobileNetV2?

- **Small model size:** 30MB (vs 200MB+ for other models)
- **Fast inference:** Good balance of speed and accuracy
- **Low memory:** Fits on mobile devices and weak GPUs
- **Accuracy:** 87-90% on Food-101 (good enough for ML beginners)
- **Transfer learning:** Pretrained on ImageNet (1.2M images)

### 2. Batch Size Tuning

```python
# In train.py, modify BATCH_SIZE

BATCH_SIZE = 8   # Slower training, lower memory
BATCH_SIZE = 16  # Default (recommended)
BATCH_SIZE = 32  # Faster training, more memory needed
BATCH_SIZE = 64  # Very fast, requires 16GB+ RAM
```

**Memory Requirements:**
- Batch 8: ~2GB GPU RAM
- Batch 16: ~4GB GPU RAM (default)
- Batch 32: ~7GB GPU RAM
- Batch 64: ~12GB GPU RAM

### 3. Reduce Training Time

```python
# Phase 1 epochs
EPOCHS_PHASE1 = 3  # Faster (was 5)

# Phase 2 epochs
EPOCHS_PHASE2 = 5   # Faster (was 10)
```

### 4. Use GPU on Google Colab

In Colab:
- Runtime → Change runtime type → GPU
- Check GPU: `!nvidia-smi`
- Training ~4-5x faster than CPU

### 5. Reduce Image Size (Trade-off)

```python
# In train.py
IMAGE_SIZE = 128  # Smaller (faster but less accurate)
IMAGE_SIZE = 224  # Default (recommended)
IMAGE_SIZE = 256  # Larger (slower but more accurate)
```

### 6. Reduce Classes (For Testing)

If you're testing and want faster training:

```python
# Modify train.py to use subset of classes
NUM_CLASSES = 10  # Train on only 10 classes instead of 101
```

---

## TROUBLESHOOTING

### Error: "Model not found"

**Solution:**
```bash
# First, train the model
python scripts/train.py

# Then run predictions or API
python api/app.py
```

### Error: "Dataset not found"

**Solution:**
1. Download Food-101 to `dataset/food-101/`
2. Verify structure:
   ```bash
   ls dataset/food-101/images/  # Should show 101 folders
   ls dataset/food-101/meta/    # Should show classes.txt, train.txt, test.txt
   ```

### Error: "Out of Memory"

**Solutions:**
1. Reduce `BATCH_SIZE` in `train.py`
2. Reduce `IMAGE_SIZE` (from 224 to 128)
3. Use Google Colab with GPU
4. Restart Python kernel to free memory

### Error: "CUDA out of memory"

**Solutions:**
1. Reduce batch size: `BATCH_SIZE = 8`
2. Use CPU instead: Remove GPU selection code
3. Clear cache:
   ```python
   import tensorflow as tf
   tf.keras.backend.clear_session()
   ```

### Prediction Accuracy is Low (< 80%)

**Solutions:**
1. Train for more epochs (increase Phase 2 epochs)
2. Reduce learning rate (already low, may need custom tuning)
3. Use not enough training time
4. Check if dataset is properly loaded
5. Try different initial weights

### API Returns 500 Error

**Solutions:**
1. Check console error messages
2. Verify model file exists: `ls -la model/`
3. Restart API server
4. Check image format (must be JPG/PNG)
5. Check image size (not too large)

### Prediction is Very Slow

**Solutions:**
1. Use GPU instead of CPU
2. Reduce `IMAGE_SIZE`
3. Use model quantization (advanced)
4. Check if other processes using GPU

---

## TIPS FOR IMPROVING ACCURACY

1. **Train Longer**
   - Increase `EPOCHS_PHASE2` to 15-20
   - Use patience in EarlyStopping

2. **Better Data Augmentation**
   - Increase rotation_range, zoom_range
   - Add brightness/contrast changes

3. **Fine-tune More Layers**
   - Reduce `fine_tune_at` to unfreeze more layers
   - Use even lower learning rate

4. **Ensemble Multiple Models**
   - Train multiple models with different seeds
   - Average predictions

5. **Use Larger Model**
   - Switch to ResNet50 (better accuracy, slower)
   - Switch to EfficientNet (good balance)

---

## NEXT STEPS / DEPLOYMENT

### Convert to TensorFlow Lite (Mobile)

```python
import tensorflow as tf

# Load model
model = tf.keras.models.load_model('model/food_model_full.h5')

# Convert to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save
with open('model/food_model.tflite', 'wb') as f:
    f.write(tflite_model)

print("Converted to TensorFlow Lite: model/food_model.tflite")
```

### Deploy to Cloud (Azure/AWS/GCP)

1. **Docker containerization:**
   ```dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["python", "api/app.py"]
   ```

2. **Deploy to Azure Container Instances:**
   ```bash
   az container create --image food-classifier --port 8000
   ```

---

## QUESTIONS & LEARNING

### Key Concepts Explained

**Transfer Learning:** Using pretrained weights from ImageNet instead of training from scratch.
- Advantage: Faster training (hours vs days), better accuracy with small datasets
- How it works: Base model learns common features, we train on food-specific features

**Data Augmentation:** Creating variations of images (rotation, zoom, flip).
- Why: Helps model generalize to images in different orientations/lighting
- Effect: ~5-10% accuracy improvement

**Fine-tuning:** Unfreezing and retraining top layers with low learning rate.
- Why: Adapt base model to food classification task
- Learning rate: Lower (0.0001 vs 0.001) to not destroy learned features

**ImageNet Pretrained:** MobileNetV2 trained on 1.2M images of 1000 object classes.
- Benefit: Learns edges, textures, shapes that apply to any vision task
- Saves: 90% training time

---

## SUPPORT & RESOURCES

- **TensorFlow Documentation:** https://www.tensorflow.org/
- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **Food-101 Paper:** https://data.vision.ee.ethz.ch/cvl/food-101.html
- **MobileNetV2 Paper:** https://arxiv.org/abs/1801.04381

---

## CONCLUSION

You now have a complete, production-ready food classification system!

Next steps:
1. ✓ Set up environment
2. ✓ Download dataset
3. ✓ Train model (`python scripts/train.py`)
4. ✓ Test predictions (`python scripts/predict.py image.jpg`)
5. ✓ Run API (`python api/app.py`)
6. ✓ Integrate into your fitness app!

Happy coding! 🚀
