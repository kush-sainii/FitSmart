# QUICK START GUIDE - Food-101 Classification

This guide will get you up and running in 15 minutes (assuming dataset is downloaded).

---

## ⚡ 5-Minute Overview

This project teaches you:
1. **Transfer Learning** - Use pretrained models, not training from scratch
2. **Data Augmentation** - Make models robust to different images
3. **Two-Phase Training** - Feature extraction then fine-tuning
4. **FastAPI** - Build web APIs for machine learning
5. **Production ML** - Real-world project structure

---

## 🛠️ One-Time Setup (5 minutes)

### Step 1: Python Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

Installation will take 3-5 minutes. You'll see TensorFlow downloading.

### Step 3: Download Food-101 Dataset

This is the only manual step. Dataset is 5GB.

**Option A: Google Colab (Recommended)**
- Get free GPU
- Dataset downloads to cloud
- No local storage needed
- [Jump to Colab setup](#google-colab-setup)

**Option B: Local Download**
```bash
cd dataset

# Windows PowerShell
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri "https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz" -OutFile "food-101.tar.gz"
tar -xzf food-101.tar.gz

# macOS/Linux
wget https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz
tar xzf food-101.tar.gz

cd ..
```

**Download takes 10-30 minutes depending on internet speed.**

---

## 🎓 Understanding the Code (Beginner Friendly)

### File: `scripts/train.py` - What it does:

```python
# Step 1: Load data
train_data, test_data = load_train_test_splits()
# Reads 75,750 training images from official list

# Step 2: Create generators (load images on the fly)
train_generator = create_image_generators()
# Rotate, zoom, flip images to create variations

# Step 3: Build model
model = build_model()
# MobileNetV2 (pretrained) + custom head
# Pretrained = Already knows edges, textures, shapes from 1.2M images

# Step 4: Phase 1 - Train only the head (frozen base)
history1 = train_phase1(model, train_generator, val_generator)
# Takes ~20 mins, accuracy goes up to ~80%

# Step 5: Phase 2 - Fine-tune (unfreeze top 20%)
history2 = train_phase2(model, base_model, train_generator, val_generator)
# Takes ~20 mins, accuracy goes up to ~88%

# Step 6: Evaluate
evaluate_model(model, test_generator, test_data)
# Check accuracy on test set (data model never saw)
```

### File: `scripts/predict.py` - What it does:

```python
# Load trained model
model = load_model()

# Load an image
image = preprocess_image("pizza.jpg")
# Resize to 224x224, normalize to [0, 1]

# Predict
predictions = model.predict(image)
# Get probability for each of 101 food classes

# Show top 5
print_top_5(predictions)
# Pizza: 92%, Focaccia: 4%, Nachos: 2%, ...
```

### File: `api/app.py` - What it does:

```python
# Create FastAPI server
app = FastAPI()

# When you POST an image
@app.post("/predict")
async def predict_image(file: UploadFile):
    # 1. Read image bytes
    image_bytes = await file.read()
    
    # 2. Preprocess
    image = preprocess_image(image_bytes)
    
    # 3. Predict
    prediction = model.predict(image)
    
    # 4. Get nutrition from database
    nutrition = get_nutrition(food_name)
    
    # 5. Return JSON response
    return {
        "food": "pizza",
        "confidence": 0.92,
        "calories": 285,
        "protein": 12
    }
```

---

## 🚀 Running the Project

### Run 1: Train Model (30 minutes)

```bash
python scripts/train.py
```

**Output you'll see:**
```
=====================================
Loading dataset...
Training set: 75,750 images
Validation set: 8,415 images  
Test set: 25,250 images
=====================================

Phase 1: Feature Extraction
Epoch 1/5: accuracy: 0.75, val_accuracy: 0.78
Epoch 2/5: accuracy: 0.82, val_accuracy: 0.84
...
Phase 1 complete!

Phase 2: Fine-tuning
Epoch 6/15: accuracy: 0.85, val_accuracy: 0.86
...
Test Accuracy: 0.8735

✓ Model saved to model/food_model_full.h5
```

**What happens:**
1. Load 84,165 training+validation images
2. Create data augmentation (rotation, zoom, flip)
3. Train classification head with frozen base (5 epochs, ~20 min)
4. Unfreeeze top layers, fine-tune (10 epochs, ~20 min)
5. Evaluate on 25,250 test images (never seen during training)
6. Save model

**After training, you'll have:**
- `model/food_model_full.h5` (30MB trained model)
- `model/class_names.json` (101 food names)
- `model/training_history.png` (accuracy/loss plots)

---

### Run 2: Test on Single Image (1 minute)

```bash
# Use any image from the dataset
python scripts/predict.py dataset/food-101/images/pizza/123456.jpg

# Or use your own image
python scripts/predict.py my_pizza_photo.jpg
```

**Output:**
```
========================================
PREDICTION RESULTS
========================================

Top Prediction: PIZZA
Confidence: 92.45%

Nutrition (per serving):
  Calories: 285 kcal
  Protein: 12g
  Fat: 10g
  Carbs: 36g

Top 5 Predictions:
1. PIZZA - 92.45%
2. FOCACCIA - 4.32%
3. FALAFEL - 2.18%
4. NACHOS - 0.92%
5. BURRITO - 0.13%
```

---

### Run 3: Start API Server (interactive)

```bash
python api/app.py
```

**Output:**
```
========================================
STARTING FOOD-101 CLASSIFICATION API
========================================

Server running on: http://127.0.0.1:8000
API Docs: http://127.0.0.1:8000/docs
Press Ctrl+C to stop
```

**Open in browser:** http://127.0.0.1:8000/docs

You'll see:
- Interactive API documentation
- Try buttons for each endpoint
- Request/response examples
- Live testing

---

## 📡 Testing the API

### From Browser
1. Open http://127.0.0.1:8000/docs
2. Click on POST `/predict`
3. Click "Try it out"
4. Upload image
5. Click "Execute"
6. See JSON response

### From Command Line
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@pizza.jpg"
```

### From Python
```python
import requests

with open('pizza.jpg', 'rb') as f:
    response = requests.post(
        "http://127.0.0.1:8000/predict",
        files={'file': f}
    )
    print(response.json())
```

### From JavaScript
```javascript
const formData = new FormData();
formData.append('file', imageFile);

fetch('http://127.0.0.1:8000/predict', {
    method: 'POST',
    body: formData
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## 🐙 Google Colab Setup

No GPU? Use Google Colab's free GPU!

1. Go to https://colab.research.google.com
2. Create new notebook
3. Change runtime to GPU: Runtime → Change runtime type → GPU
4. Run these cells:

```python
# Cell 1: Install
!pip install tensorflow keras pillow fastapi uvicorn

# Cell 2: Download dataset (takes 10-15 min)
!cd /content && wget https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz
!tar xzf food-101.tar.gz

# Cell 3: Check GPU
!nvidia-smi

# Cell 4: Create files
# Upload your Python files or copy-paste the code
```

**Benefits:**
- Free GPU (NVIDIA T4 or V100)
- 12GB RAM
- Training ~5x faster
- Can close browser and keep running

---

## 🎯 Learning Path

### Beginner (First Run)
1. ✅ Setup environment
2. ✅ Download dataset
3. ✅ Run training
4. ✅ Test predictions
5. ✅ Run API

### Intermediate (Experiment)
- Modify `BATCH_SIZE` (8, 16, 32) → see memory/speed trade-off
- Modify `EPOCHS` → more epochs = better accuracy (but slower)
- Modify `IMAGE_SIZE` (128, 224, 256) → smaller/larger images
- Train on subset of classes (10 classes, not 101) → 5x faster

### Advanced (Customize)
- Change base model (ResNet50, EfficientNet)
- Custom data augmentation (brightness, contrast, saturation)
- Model quantization (compress for mobile)
- Deploy to cloud (Azure, AWS, GCP)

---

## 💾 Project Files Explained

```
scripts/
  train.py         → 300 lines, complete training pipeline
  predict.py       → Test model on single image
  nutrition.py     → Nutrition database (calories, protein, etc)

api/
  app.py           → 300 lines, FastAPI server with REST endpoints

model/             → (Generated after training)
  food_model_full.h5      → 30MB trained model
  class_names.json        → List of 101 food classes
  training_history.png    → Accuracy/loss plots

dataset/           → (Download required)
  food-101/
    images/        → 101 folders with images
    meta/          → Official train/test splits

requirements.txt   → 10 packages needed
README.md          → Full documentation
SETUP_AND_USAGE.md → Detailed setup guide
```

---

## 🔥 Performance Tips

### Make Training Faster
```python
# In train.py
BATCH_SIZE = 32        # Faster (needs more GPU memory)
IMAGE_SIZE = 128       # Faster (less accurate)
EPOCHS_PHASE2 = 5      # Fewer epochs (less accurate)
```

### Make Inference Faster
```python
# Use GPU
import tensorflow as tf
print(tf.config.list_physical_devices('GPU'))

# Check it's using GPU during prediction
```

### Improve Accuracy
```python
# Train longer
EPOCHS_PHASE2 = 20

# More augmentation
rotation_range = 40  # Instead of 20
zoom_range = 0.4     # Instead of 0.2

# Fine-tune more layers
fine_tune_at = int(num_layers * 0.5)  # Unfreeze 50% instead of 20%
```

---

## ❓ Common Issues

**Q: Model not found?**
A: Run `python scripts/train.py` first

**Q: Dataset not found?**
A: Download to `dataset/food-101/`

**Q: Out of memory?**
A: Reduce `BATCH_SIZE` from 16 to 8

**Q: Slow training?**
A: Use GPU: https://colab.research.google.com

**Q: Low accuracy (< 80%)?**
A: Train for more epochs, use GPU

---

## 📚 What You Learned

1. **Machine Learning:** Transfer learning, data augmentation, train/validation/test split
2. **TensorFlow:** Loading models, building architectures, training loops
3. **Web Development:** REST APIs, file uploads, JSON responses
4. **Python:** Generators, preprocessing, best practices
5. **Production:** Checkpoints, callbacks, saving models

---

## 🎓 Next Steps

✅ **Now you can:**
- Train ML models with TensorFlow
- Build APIs with FastAPI
- Understand transfer learning
- Deploy ML to production

✅ **Try next:**
- Deploy API to cloud (Azure Container Instances)
- Convert to TensorFlow Lite for mobile
- Build frontend (React/Vue) for your fitness app
- Add more food classes or fine-tune predictions

---

## 📞 Need Help?

- **Setup issues?** → Read SETUP_AND_USAGE.md
- **Code questions?** → Check comments in .py files
- **API docs?** → Open http://127.0.0.1:8000/docs
- **Dataset questions?** → See SETUP_AND_USAGE.md § Dataset Setup

---

## 🎉 Have Fun!

You're now learning state-of-the-art machine learning!

Start with: `python scripts/train.py`

Happy coding! 🚀
