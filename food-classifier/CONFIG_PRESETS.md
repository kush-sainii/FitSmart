# ============================================================================
# TRAINING CONFIGURATION - Presets for Different Scenarios
# ============================================================================
# Copy desired configuration to scripts/train.py
# Each preset is optimized for different hardware and use cases
# ============================================================================

# ============================================================================
# PRESET 1: LOCAL CPU (Slow but works on any machine)
# ============================================================================
# Estimated training time: 6-8 hours
# RAM needed: 8GB
# GPU needed: No

CONFIG_CPU = {
    "IMAGE_SIZE": 128,          # Smaller image = faster processing
    "BATCH_SIZE": 8,            # Small batch = less memory
    "EPOCHS_PHASE1": 3,         # Fewer epochs = faster training
    "EPOCHS_PHASE2": 5,         # Fewer epochs = faster training
    "VALIDATION_SPLIT": 0.1,
    "LEARNING_RATE_PHASE1": 0.001,
    "LEARNING_RATE_PHASE2": 0.0001,
}

# ============================================================================
# PRESET 2: LOCAL GPU (NVIDIA with CUDA, 4GB VRAM)
# ============================================================================
# Estimated training time: 1.5-2 hours
# VRAM needed: 4GB (GTX 1050, older GPUs)
# Best for: Gaming laptops, older GPUs

CONFIG_GPU_4GB = {
    "IMAGE_SIZE": 224,
    "BATCH_SIZE": 8,            # Safer batch size for 4GB
    "EPOCHS_PHASE1": 5,
    "EPOCHS_PHASE2": 10,
    "VALIDATION_SPLIT": 0.1,
    "LEARNING_RATE_PHASE1": 0.001,
    "LEARNING_RATE_PHASE2": 0.0001,
}

# ============================================================================
# PRESET 3: LOCAL GPU (NVIDIA with CUDA, 8GB+ VRAM)
# ============================================================================
# Estimated training time: 1-1.5 hours
# VRAM needed: 8GB (RTX 3060, RTX 2080, etc.)
# Best for: Mid-range gaming GPUs

CONFIG_GPU_8GB = {
    "IMAGE_SIZE": 224,
    "BATCH_SIZE": 16,           # Recommended batch size
    "EPOCHS_PHASE1": 5,
    "EPOCHS_PHASE2": 10,
    "VALIDATION_SPLIT": 0.1,
    "LEARNING_RATE_PHASE1": 0.001,
    "LEARNING_RATE_PHASE2": 0.0001,
}

# ============================================================================
# PRESET 4: LOCAL GPU (NVIDIA High-End, 12GB+ VRAM)
# ============================================================================
# Estimated training time: 45 minutes - 1 hour
# VRAM needed: 12GB+ (RTX 4080, RTX 3090, professional GPUs)
# Best for: Workstation GPUs, high-end gaming GPUs

CONFIG_GPU_12GB = {
    "IMAGE_SIZE": 256,          # Larger image = more details
    "BATCH_SIZE": 32,           # Larger batch = faster training
    "EPOCHS_PHASE1": 5,
    "EPOCHS_PHASE2": 15,        # More epochs = better accuracy
    "VALIDATION_SPLIT": 0.1,
    "LEARNING_RATE_PHASE1": 0.001,
    "LEARNING_RATE_PHASE2": 0.0001,
}

# ============================================================================
# PRESET 5: GOOGLE COLAB (Free GPU T4)
# ============================================================================
# Estimated training time: 2-3 hours
# Benefits: Free, cloud-based, accessible from anywhere
# Requirements: Google account, internet connection

CONFIG_COLAB_T4 = {
    "IMAGE_SIZE": 224,
    "BATCH_SIZE": 16,
    "EPOCHS_PHASE1": 5,
    "EPOCHS_PHASE2": 10,
    "VALIDATION_SPLIT": 0.1,
    "LEARNING_RATE_PHASE1": 0.001,
    "LEARNING_RATE_PHASE2": 0.0001,
}

# ============================================================================
# PRESET 6: GOOGLE COLAB (Free GPU V100/A100)
# ============================================================================
# Estimated training time: 30-45 minutes
# Benefits: High-end GPU, very fast training
# Requirements: Colab Pro (optional) or get lucky with V100

CONFIG_COLAB_V100 = {
    "IMAGE_SIZE": 256,
    "BATCH_SIZE": 32,
    "EPOCHS_PHASE1": 5,
    "EPOCHS_PHASE2": 15,
    "VALIDATION_SPLIT": 0.1,
    "LEARNING_RATE_PHASE1": 0.001,
    "LEARNING_RATE_PHASE2": 0.00005,  # Even lower for better accuracy
}

# ============================================================================
# PRESET 7: KAGGLE (Pre-loaded dataset)
# ============================================================================
# Estimated training time: 1-2 hours
# Benefits: Food-101 already available, free GPU
# Requirements: Kaggle account

CONFIG_KAGGLE = {
    "IMAGE_SIZE": 224,
    "BATCH_SIZE": 16,
    "EPOCHS_PHASE1": 5,
    "EPOCHS_PHASE2": 10,
    "VALIDATION_SPLIT": 0.1,
    "LEARNING_RATE_PHASE1": 0.001,
    "LEARNING_RATE_PHASE2": 0.0001,
}

# ============================================================================
# PRESET 8: FAST TESTING (Verify pipeline on subset)
# ============================================================================
# Use this to test your setup before full training!
# Estimated time: 2-5 minutes
# Purpose: Verify everything works before 2-hour full training

CONFIG_QUICK_TEST = {
    "IMAGE_SIZE": 128,          # Small image
    "BATCH_SIZE": 8,
    "EPOCHS_PHASE1": 1,         # Just 1 epoch to test
    "EPOCHS_PHASE2": 1,         # Just 1 epoch to test
    "VALIDATION_SPLIT": 0.1,
    "LEARNING_RATE_PHASE1": 0.001,
    "LEARNING_RATE_PHASE2": 0.0001,
    "CLASSES_TO_USE": 10,       # Use only 10 classes instead of 101
}

# ============================================================================
# PRESET 9: HIGH ACCURACY (Trading time for better accuracy)
# ============================================================================
# Estimated training time: 3-4 hours (with GPU)
# Accuracy improvement: +2-3% over standard
# Use when: You want best possible accuracy

CONFIG_HIGH_ACCURACY = {
    "IMAGE_SIZE": 256,          # Larger images
    "BATCH_SIZE": 8,            # Smaller batch = more updates
    "EPOCHS_PHASE1": 10,        # More time to learn
    "EPOCHS_PHASE2": 20,        # More fine-tuning
    "VALIDATION_SPLIT": 0.15,   # More validation data
    "LEARNING_RATE_PHASE1": 0.0005,  # Lower LR
    "LEARNING_RATE_PHASE2": 0.00005, # Even lower LR
    "FINE_TUNE_AT": 50,         # Unfreeze more layers
}

# ============================================================================
# PRESET 10: BALANCED (Sweet spot for most users)
# ============================================================================
# Estimated training time: 1-2 hours (with GPU)
# Accuracy: 87-88%
# Use when: You're not sure which preset to use (RECOMMENDED)

CONFIG_BALANCED = {
    "IMAGE_SIZE": 224,
    "BATCH_SIZE": 16,
    "EPOCHS_PHASE1": 5,
    "EPOCHS_PHASE2": 10,
    "VALIDATION_SPLIT": 0.1,
    "LEARNING_RATE_PHASE1": 0.001,
    "LEARNING_RATE_PHASE2": 0.0001,
}

# ============================================================================
# HOW TO USE
# ============================================================================
"""
Step 1: Choose your preset based on your hardware
Step 2: Apply to train.py:

Example - Using GPU 8GB preset:

In scripts/train.py, replace:
    IMAGE_SIZE = 224
    BATCH_SIZE = 16
    EPOCHS_PHASE1 = 5
    EPOCHS_PHASE2 = 10
    
With values from CONFIG_GPU_8GB

OR simply type this at top of train.py:
    # Load preset
    from config import CONFIG_GPU_8GB as CONFIG
    IMAGE_SIZE = CONFIG["IMAGE_SIZE"]
    BATCH_SIZE = CONFIG["BATCH_SIZE"]
    ...

Step 3: Run training
    python scripts/train.py
"""

# ============================================================================
# TROUBLESHOOTING GUIDE
# ============================================================================
"""
ISSUE: "Out of memory" error
FIX: Use smaller BATCH_SIZE (8 instead of 16) or smaller IMAGE_SIZE

ISSUE: Training is too slow
FIX: Use larger BATCH_SIZE (32 instead of 16) on GPU or use Colab

ISSUE: Accuracy is low (< 80%)
FIX: Use CONFIG_HIGH_ACCURACY or train with GPU

ISSUE: Confused which preset to use
FIX: Start with CONFIG_BALANCED or QUICK_TEST first

ISSUE: "CUDA out of memory" on GPU
FIX: Reduce BATCH_SIZE: 32 → 16 → 8 → 4
"""

# ============================================================================
# PARAMETER EXPLANATION
# ============================================================================
"""
IMAGE_SIZE:
  - Larger (256) = Better accuracy but slower, needs more memory
  - Smaller (128) = Faster but less accurate
  - Sweet spot: 224 (MobileNetV2 default)

BATCH_SIZE:
  - Larger (32) = Faster training but needs more GPU memory
  - Smaller (8) = Slower training but uses less memory
  - Sweet spot: 16 (balanced)

EPOCHS_PHASE1:
  - More epochs = Better initial training but slower
  - Typical: 3-5
  - Phase 1 trains classification head only

EPOCHS_PHASE2:
  - More epochs = Better fine-tuning and accuracy
  - Typical: 10-15
  - Phase 2 fine-tunes top model layers

VALIDATION_SPLIT:
  - Percentage of training data used for validation
  - 0.1 = 10% for validation, 90% for training
  - Typical: 0.1 (10%)

LEARNING_RATE:
  - Phase 1: 0.001 (faster learning)
  - Phase 2: 0.0001 (slower learning, don't destroy weights)
  - Why different? Phase 2 already has learned weights
"""

# ============================================================================
# CHECKLIST FOR YOUR FIRST RUN
# ============================================================================
"""
Before training, verify:
☐ Python 3.8+ installed
☐ Virtual environment activated
☐ requirements.txt packages installed (pip install -r requirements.txt)
☐ Food-101 dataset downloaded to dataset/food-101/
☐ Dataset structure verified (images/ and meta/ folders exist)
☐ model/ folder is empty (will be created during training)
☐ At least 5GB free disk space
☐ 8GB+ RAM for CPU or 4GB+ VRAM for GPU

Ready to train!
Command: python scripts/train.py
"""
