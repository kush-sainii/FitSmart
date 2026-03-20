# FOOD-101 Classification System for Fitness App

A comprehensive, production-ready deep learning system for food classification with nutritional analysis. Powered by TensorFlow, MobileNetV2, and FastAPI.

## 🎯 Features

✅ **Complete Food-101 Dataset:** 101 food classes, ~101,000 images  
✅ **Transfer Learning:** MobileNetV2 with two-phase training (feature extraction + fine-tuning)  
✅ **Data Augmentation:** Rotation, zoom, flip for robust predictions  
✅ **Official Train/Test Split:** Uses Food-101's official splits (not random)  
✅ **Efficient Memory Usage:** Image generators for on-the-fly loading  
✅ **REST API:** FastAPI with Swagger UI documentation  
✅ **Nutrition Database:** Calories, protein, fat, carbs for each food  
✅ **Beginner-Friendly:** Clean code with detailed comments  
✅ **Cross-Platform:** Works on Windows, macOS, Linux  
✅ **GPU Support:** Optimized for NVIDIA GPUs (CUDA)  

## 📊 Project Structure

```
food-classifier/
├── dataset/
│   └── food-101/                    # Food-101 dataset (download required)
│       ├── images/                  # 101 food categories
│       └── meta/                    # Official train/test splits
├── model/
│   ├── food_model_full.h5           # Trained model
│   ├── class_names.json             # 101 food classes
│   ├── training_history.json        # Training metrics
│   └── training_history.png         # Loss/accuracy plots
├── api/
│   └── app.py                       # FastAPI server
├── scripts/
│   ├── train.py                     # Training pipeline
│   ├── predict.py                   # Single image prediction
│   └── nutrition.py                 # Nutrition database
└── requirements.txt                 # Python dependencies
```

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 2. Download Dataset
```bash
# Option A: Direct download
cd dataset
wget https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz
tar xzf food-101.tar.gz
cd ..

# Option B: Python script (see SETUP_AND_USAGE.md for details)
```

### 3. Train Model
```bash
python scripts/train.py
```
This will:
- Load Food-101 dataset with official splits
- Train with data augmentation
- Phase 1: Feature extraction (frozen base model)
- Phase 2: Fine-tuning (unfreeze top layers)
- Save model as `model/food_model_full.h5`
- Generate training history plots

### 4. Test on Image
```bash
python scripts/predict.py dataset/food-101/images/pizza/123456.jpg
```

### 5. Run API Server
```bash
python api/app.py
```
Visit: http://127.0.0.1:8000/docs for interactive API documentation

## 📡 API Usage

### Health Check
```bash
curl http://127.0.0.1:8000/health
```

### Make Prediction
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@food_image.jpg"
```

### Response Example
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
    ...
  ],
  "message": "Successfully classified as pizza with 92.5% confidence"
}
```

## 🎓 Key Concepts Explained

### Transfer Learning
Using pre-trained MobileNetV2 (trained on ImageNet) instead of training from scratch.
- **Benefit:** 90% faster training, better accuracy on small datasets
- **How:** Base model learns general features, we specialize for food classification

### Two-Phase Training

**Phase 1: Feature Extraction**
- Freeze base model layers
- Train only classification head
- Fast, effective initial training

**Phase 2: Fine-tuning**
- Unfreeze top 20% of base model
- Use lower learning rate (0.0001 vs 0.001)
- Adapt model to food-specific features

### Data Augmentation
Randomly transform training images:
- Rotation (±20°)
- Zoom (±20%)
- Horizontal flip
- Width/height shift (±20%)

**Effect:** 5-10% accuracy improvement, better generalization

## 💻 System Requirements

### Minimum
- RAM: 8GB
- Disk: 10GB (5GB dataset + 2GB model + 3GB dependencies)
- Python 3.8+

### Recommended
- RAM: 16GB
- GPU: NVIDIA with CUDA (4GB+ VRAM)
- Disk: 20GB SSD

### Training Time
- **CPU:** 4-8 hours
- **GPU (NVIDIA T4):** 1-2 hours
- **GPU (NVIDIA V100):** 30-45 minutes

## 📈 Expected Performance

- **Training Accuracy:** ~90-92%
- **Validation Accuracy:** ~87-89%
- **Test Accuracy:** ~87-88%
- **Inference Time:** ~50-100ms per image (CPU), ~10-20ms (GPU)

## 🔧 Configuration

Edit `scripts/train.py`:
```python
IMAGE_SIZE = 224          # Input size for MobileNetV2
BATCH_SIZE = 16           # Adjust for GPU memory
EPOCHS_PHASE1 = 5         # Feature extraction epochs
EPOCHS_PHASE2 = 10        # Fine-tuning epochs
VALIDATION_SPLIT = 0.1    # 10% for validation
```

## 📚 What You'll Learn

1. **Machine Learning Fundamentals**
   - Transfer learning
   - Data augmentation
   - Train/validation/test splits
   - Callbacks (ModelCheckpoint, EarlyStopping)

2. **Deep Learning with TensorFlow**
   - Loading pretrained models
   - Building custom models
   - Training and evaluation
   - Model inference

3. **Web APIs with FastAPI**
   - Building REST APIs
   - File uploads
   - Request/response validation
   - CORS middleware

4. **Data Processing**
   - Image loading and preprocessing
   - Batch processing with generators
   - Data normalization

## 🐛 Troubleshooting

### "Model not found"
```bash
# Train first
python scripts/train.py
```

### "Dataset not found"
Download Food-101 to `dataset/food-101/` (see SETUP_AND_USAGE.md)

### "Out of memory"
Reduce `BATCH_SIZE` in `train.py`:
```python
BATCH_SIZE = 8  # Instead of 16
```

### Predictions are inaccurate
- Train for more epochs
- Use GPU for better training
- Check if model file is corrupted

See **SETUP_AND_USAGE.md** for detailed troubleshooting section.

## 🌐 Deployment Options

### Google Colab (Free GPU)
```python
# Install
!pip install tensorflow keras pillow fastapi uvicorn

# Download dataset
!wget https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz
!tar xzf food-101.tar.gz

# Train
!python train.py
```

### Docker
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "api/app.py"]
```

### Cloud Platforms
- Azure Container Instances
- AWS Lambda
- Google Cloud Run
- Heroku

## 📚 Resources

- [Food-101 Dataset](https://data.vision.ee.ethz.ch/cvl/food-101.html)
- [MobileNetV2 Paper](https://arxiv.org/abs/1801.04381)
- [TensorFlow Documentation](https://www.tensorflow.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 📋 File Descriptions

| File | Purpose |
|------|---------|
| `scripts/train.py` | Complete training pipeline (data loading, model building, training, evaluation) |
| `scripts/predict.py` | Single image prediction with top-5 results and nutrition info |
| `scripts/nutrition.py` | Nutrition database mapping (calories, protein, fat, carbs) |
| `api/app.py` | FastAPI server with `/predict` endpoint |
| `requirements.txt` | Python package dependencies |
| `SETUP_AND_USAGE.md` | Comprehensive setup and usage guide |
| `README.md` | This file |

## 🎯 Next Steps

1. ✅ Setup environment and install dependencies
2. ✅ Download Food-101 dataset
3. ✅ Train model using Phase 1 + Phase 2 approach
4. ✅ Evaluate performance on test set
5. ✅ Test predictions on individual images
6. ✅ Run FastAPI server
7. ✅ Integrate API into fitness app
8. 🔄 (Optional) Deploy to cloud platform

## 💡 Tips for Success

- **Start with CPU:** Test on CPU before GPU to verify setup
- **Monitor GPU:** Use `nvidia-smi` to check GPU usage during training
- **Use Colab:** Free GPU on Google Colab if local GPU unavailable
- **Start small:** Train on subset of data first to verify pipeline
- **Save checkpoints:** Model checkpoints automatically save best weights

## 📞 Support

For detailed instructions, troubleshooting, and advanced topics:
→ Read **SETUP_AND_USAGE.md**

For quick setup:
→ Follow Quick Start section above

## 📄 License

This project uses Food-101 dataset which is publicly available for research.

---

**Happy Coding! 🚀**

Build amazing AI-powered fitness apps with accurate food classification!
