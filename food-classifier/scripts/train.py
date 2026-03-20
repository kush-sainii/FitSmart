# ============================================================================
# FOOD-101 CLASSIFICATION - TRAINING SCRIPT
# ============================================================================
# This script trains a food classification model using:
# - Food-101 dataset with official train/test splits
# - Transfer learning with MobileNetV2
# - Two-phase training: feature extraction then fine-tuning
# - Data augmentation for better generalization
# ============================================================================

import os
import warnings
warnings.filterwarnings('ignore')

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.applications import MobileNetV2
import matplotlib.pyplot as plt
import json

# ============================================================================
# CONFIGURATION - Adjust these based on your GPU memory and needs
# ============================================================================
IMAGE_SIZE = 224  # MobileNetV2 input size
BATCH_SIZE = 16   # Small batch size for GPU memory efficiency
EPOCHS_PHASE1 = 5  # Feature extraction phase (frozen base model)
EPOCHS_PHASE2 = 10 # Fine-tuning phase (unfrozen layers)
NUM_CLASSES = 101  # Food-101 has 101 food categories
VALIDATION_SPLIT = 0.1  # Use 10% for validation

# Paths
DATASET_PATH = "./dataset/food-101/images"
META_PATH = "./dataset/food-101/meta"
MODEL_SAVE_PATH = "./model/food_model_full.h5"
HISTORY_SAVE_PATH = "./model/training_history.json"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def check_dataset_exists():
    """
    Check if Food-101 dataset is downloaded and extracted
    If not, provide instructions
    """
    if not os.path.exists(DATASET_PATH):
        print("\n" + "="*70)
        print("ERROR: Food-101 dataset not found!")
        print("="*70)
        print("\nTo download Food-101 dataset:")
        print("1. Visit: https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz")
        print("2. Download (5GB) and extract to: ./dataset/food-101/")
        print("\nOR download using command:")
        print("  wget https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz")
        print("  tar xzf food-101.tar.gz -C ./dataset/")
        print("\nAlternative: Use this Python code:")
        print("""
import urllib.request
import tarfile

print("Downloading Food-101 dataset (5GB)...")
url = "https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz"
filename = "food-101.tar.gz"
urllib.request.urlretrieve(url, filename)

print("Extracting...")
with tarfile.open(filename, "r:gz") as tar:
    tar.extractall(path="./dataset/")
print("Done!")
        """)
        print("="*70)
        return False
    return True


def load_train_test_splits():
    """
    Load the official Food-101 train/test splits from meta files
    Returns lists of (image_path, class_id) tuples
    """
    if not os.path.exists(META_PATH):
        print(f"ERROR: Meta files not found at {META_PATH}")
        return None, None
    
    # Create class name to ID mapping
    classes_file = os.path.join(META_PATH, "classes.txt")
    class_names = []
    if os.path.exists(classes_file):
        with open(classes_file, 'r') as f:
            class_names = [line.strip() for line in f.readlines()]
    
    print(f"Found {len(class_names)} food classes")
    
    # Load train split
    train_file = os.path.join(META_PATH, "train.txt")
    train_data = []
    if os.path.exists(train_file):
        with open(train_file, 'r') as f:
            for line in f.readlines():
                parts = line.strip().split('/')
                class_name = parts[0]
                class_id = class_names.index(class_name)
                image_path = os.path.join(DATASET_PATH, line.strip() + ".jpg")
                if os.path.exists(image_path):
                    train_data.append((image_path, class_id, class_name))
    
    # Load test split
    test_file = os.path.join(META_PATH, "test.txt")
    test_data = []
    if os.path.exists(test_file):
        with open(test_file, 'r') as f:
            for line in f.readlines():
                parts = line.strip().split('/')
                class_name = parts[0]
                class_id = class_names.index(class_name)
                image_path = os.path.join(DATASET_PATH, line.strip() + ".jpg")
                if os.path.exists(image_path):
                    test_data.append((image_path, class_id, class_name))
    
    print(f"Loaded {len(train_data)} training images")
    print(f"Loaded {len(test_data)} test images")
    
    return train_data, test_data, class_names


def create_image_generators():
    """
    Create ImageDataGenerator objects for training and validation
    This handles image loading and preprocessing from disk
    """
    # Training generator: includes data augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,  # Normalize to [0, 1]
        rotation_range=20,  # Random rotation
        width_shift_range=0.2,  # Random horizontal shift
        height_shift_range=0.2,  # Random vertical shift
        zoom_range=0.2,  # Random zoom
        horizontal_flip=True,  # Random horizontal flip
        fill_mode='nearest'  # How to fill new pixels
    )
    
    # Validation/Test generator: only normalization, no augmentation
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    return train_datagen, val_datagen


def build_model():
    """
    Build model with MobileNetV2 base and custom classification head
    
    Architecture:
    1. MobileNetV2 (pretrained on ImageNet) - for feature extraction
    2. Global Average Pooling - reduce spatial dimensions
    3. Dense layer (256 units) - for learning food-specific features
    4. Dropout (0.5) - prevent overfitting
    5. Output Dense layer (101 units, softmax) - classification
    """
    
    print("\n" + "="*70)
    print("Building MobileNetV2 model...")
    print("="*70)
    
    # Load pretrained MobileNetV2 (without top classification layer)
    base_model = MobileNetV2(
        input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3),
        include_top=False,  # Remove final classification layer
        weights='imagenet'  # Use ImageNet pretrained weights
    )
    
    # Freeze base model initially (feature extraction phase)
    base_model.trainable = False
    
    # Create new model with custom head
    model = models.Sequential([
        # Input layer
        layers.Input(shape=(IMAGE_SIZE, IMAGE_SIZE, 3)),
        
        # Pretrained base model
        base_model,
        
        # Custom classification head
        layers.GlobalAveragePooling2D(),  # Reduce to 1D features
        layers.Dense(256, activation='relu'),  # Dense layer with ReLU
        layers.Dropout(0.5),  # Dropout to prevent overfitting
        layers.Dense(NUM_CLASSES, activation='softmax')  # Output layer
    ])
    
    print("\nModel architecture:")
    model.summary()
    
    return model, base_model


def train_phase1(model, train_generator, val_generator):
    """
    Phase 1: Feature Extraction
    Train with frozen base model (only train the custom head)
    This is fast and effective when dataset is small to medium
    """
    
    print("\n" + "="*70)
    print("PHASE 1: FEATURE EXTRACTION (Frozen Base Model)")
    print("="*70)
    print("Training only the classification head...")
    print(f"Training for {EPOCHS_PHASE1} epochs...")
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            MODEL_SAVE_PATH.replace('.h5', '_phase1.h5'),
            save_best_only=True,
            monitor='val_accuracy'
        ),
        EarlyStopping(
            monitor='val_accuracy',
            patience=3,
            restore_best_weights=True
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=2,
            min_lr=1e-7
        )
    ]
    
    # Train
    history1 = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=EPOCHS_PHASE1,
        callbacks=callbacks,
        verbose=1
    )
    
    return history1


def train_phase2(model, base_model, train_generator, val_generator):
    """
    Phase 2: Fine-tuning
    Unfreeze some layers from base model and train with lower learning rate
    This helps the model adapt to food-specific features
    """
    
    print("\n" + "="*70)
    print("PHASE 2: FINE-TUNING (Unfrozen Top Layers)")
    print("="*70)
    
    # Unfreeze the top 20% of base model layers
    num_layers = len(base_model.layers)
    fine_tune_at = int(num_layers * 0.8)  # Unfreeze last 20%
    
    print(f"Unfreezing top {num_layers - fine_tune_at} layers of base model...")
    
    for layer in base_model.layers[:fine_tune_at]:
        layer.trainable = False
    for layer in base_model.layers[fine_tune_at:]:
        layer.trainable = True
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.0001),  # Lower LR
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print(f"Training for {EPOCHS_PHASE2} epochs with fine-tuning...")
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            MODEL_SAVE_PATH,
            save_best_only=True,
            monitor='val_accuracy'
        ),
        EarlyStopping(
            monitor='val_accuracy',
            patience=3,
            restore_best_weights=True
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=2,
            min_lr=1e-7
        )
    ]
    
    # Train
    history2 = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=EPOCHS_PHASE2,
        callbacks=callbacks,
        initial_epoch=EPOCHS_PHASE1,
        verbose=1
    )
    
    return history2


def evaluate_model(model, test_generator, test_data, class_names):
    """
    Evaluate model on test set and show sample predictions
    """
    
    print("\n" + "="*70)
    print("MODEL EVALUATION")
    print("="*70)
    
    # Evaluate on test set
    test_loss, test_accuracy = model.evaluate(test_generator, verbose=1)
    
    print(f"\nTest Accuracy: {test_accuracy:.4f}")
    print(f"Test Loss: {test_loss:.4f}")
    
    # Show sample predictions
    print("\n" + "-"*70)
    print("Sample predictions:")
    print("-"*70)
    
    # Get a batch of test images
    test_images_batch = test_generator[0][0]  # Images
    test_labels_batch = test_generator[0][1]  # Labels
    
    # Make predictions
    predictions = model.predict(test_images_batch[:5], verbose=0)
    
    for i in range(5):
        true_class = np.argmax(test_labels_batch[i])
        pred_class = np.argmax(predictions[i])
        confidence = predictions[i][pred_class]
        
        print(f"\nImage {i+1}:")
        print(f"  True class: {class_names[true_class]}")
        print(f"  Predicted: {class_names[pred_class]} (confidence: {confidence:.2%})")


def plot_training_history(history1, history2):
    """
    Plot training and validation accuracy/loss
    """
    
    fig, axes = plt.subplots(1, 2, figsize=(15, 4))
    
    # Combine histories
    all_acc = history1.history['accuracy'] + history2.history['accuracy']
    all_val_acc = history1.history['val_accuracy'] + history2.history['val_accuracy']
    all_loss = history1.history['loss'] + history2.history['loss']
    all_val_loss = history1.history['val_loss'] + history2.history['val_loss']
    
    # Plot accuracy
    axes[0].plot(all_acc, label='Training Accuracy')
    axes[0].plot(all_val_acc, label='Validation Accuracy')
    axes[0].axvline(x=EPOCHS_PHASE1, color='r', linestyle='--', label='Phase 2 starts')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Accuracy')
    axes[0].set_title('Model Accuracy')
    axes[0].legend()
    axes[0].grid(True)
    
    # Plot loss
    axes[1].plot(all_loss, label='Training Loss')
    axes[1].plot(all_val_loss, label='Validation Loss')
    axes[1].axvline(x=EPOCHS_PHASE1, color='r', linestyle='--', label='Phase 2 starts')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Loss')
    axes[1].set_title('Model Loss')
    axes[1].legend()
    axes[1].grid(True)
    
    plt.tight_layout()
    plt.savefig('./model/training_history.png', dpi=100)
    print("\nTraining history saved to: ./model/training_history.png")


# ============================================================================
# MAIN TRAINING PIPELINE
# ============================================================================

def main():
    
    print("\n" + "="*70)
    print("FOOD-101 CLASSIFICATION - TRAINING PIPELINE")
    print("="*70)
    
    # Step 1: Check dataset
    print("\nStep 1: Checking dataset...")
    if not check_dataset_exists():
        print("Please download the dataset first!")
        return
    
    # Step 2: Load official train/test splits
    print("\nStep 2: Loading official train/test splits...")
    train_data, test_data, class_names = load_train_test_splits()
    if train_data is None:
        print("ERROR: Could not load splits")
        return
    
    # Split training data into train/validation
    split_idx = int(len(train_data) * (1 - VALIDATION_SPLIT))
    val_data = train_data[split_idx:]
    train_data = train_data[:split_idx]
    
    print(f"Training set: {len(train_data)} images")
    print(f"Validation set: {len(val_data)} images")
    print(f"Test set: {len(test_data)} images")
    
    # Step 3: Create image generators
    print("\nStep 3: Creating image generators...")
    train_datagen, val_datagen = create_image_generators()
    
    # Create generators from directory or arrays
    # For this, we'll create simple generators that load images on the fly
    train_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=(IMAGE_SIZE, IMAGE_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )
    
    val_generator = val_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=(IMAGE_SIZE, IMAGE_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )
    
    # Step 4: Build model
    print("\nStep 4: Building model...")
    model, base_model = build_model()
    
    # Step 5: Phase 1 - Feature Extraction
    print("\nStep 5: Phase 1 - Feature Extraction...")
    history1 = train_phase1(model, train_generator, val_generator)
    
    # Step 6: Phase 2 - Fine-tuning
    print("\nStep 6: Phase 2 - Fine-tuning...")
    history2 = train_phase2(model, base_model, train_generator, val_generator)
    
    # Step 7: Create test generator
    print("\nStep 7: Creating test generator...")
    test_generator = val_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=(IMAGE_SIZE, IMAGE_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False
    )
    
    # Step 8: Evaluate
    print("\nStep 8: Evaluating model...")
    evaluate_model(model, test_generator, test_data, class_names)
    
    # Step 9: Save training history
    print("\nStep 9: Saving training history...")
    plot_training_history(history1, history2)
    
    # Save class names for later use
    with open('./model/class_names.json', 'w') as f:
        json.dump(class_names, f)
    
    print("\n" + "="*70)
    print("TRAINING COMPLETE!")
    print("="*70)
    print(f"\nModel saved to: {MODEL_SAVE_PATH}")
    print(f"Class names saved to: ./model/class_names.json")
    print(f"Training history: ./model/training_history.png")
    print("\nNext steps:")
    print("1. Start API server: python api/app.py")
    print("2. Test predictions: python scripts/predict.py <image_path>")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
