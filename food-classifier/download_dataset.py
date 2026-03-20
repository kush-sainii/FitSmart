# ============================================================================
# FOOD-101 DATASET DOWNLOADER
# ============================================================================
# This script downloads the Food-101 dataset (5GB) and extracts it
# Run: python download_dataset.py
# ============================================================================

import os
import tarfile
import urllib.request
import shutil
from pathlib import Path

# Configuration
DATASET_URL = "https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz"
DOWNLOAD_PATH = "./food-101.tar.gz"
EXTRACT_PATH = "./dataset/"
FINAL_PATH = "./dataset/food-101"

print("\n" + "="*70)
print("FOOD-101 DATASET DOWNLOADER")
print("="*70)

# Check if dataset already exists
if os.path.exists(FINAL_PATH):
    print(f"\n✓ Dataset already exists at: {FINAL_PATH}")
    print("  No need to download again!")
    print("  You can start training: python scripts/train.py")
    print("="*70 + "\n")
    exit(0)

# Create dataset directory if it doesn't exist
os.makedirs(EXTRACT_PATH, exist_ok=True)

# Check if already downloaded
if os.path.exists(DOWNLOAD_PATH):
    print(f"\n✓ Dataset file already downloaded: {DOWNLOAD_PATH}")
    print("  Proceeding to extraction...")
else:
    # Download dataset
    print(f"\n📥 Downloading Food-101 dataset from:")
    print(f"   {DATASET_URL}")
    print(f"\n⚠️  This is 5GB and will take 10-30 minutes depending on internet speed")
    print("   Please be patient...\n")
    
    try:
        # Download with progress indicator
        def download_progress(block_num, block_size, total_size):
            downloaded = block_num * block_size
            percent = min(downloaded * 100 // total_size, 100)
            bar_length = 50
            filled = int(bar_length * downloaded // total_size)
            bar = "█" * filled + "░" * (bar_length - filled)
            
            mb_downloaded = downloaded / (1024 * 1024)
            mb_total = total_size / (1024 * 1024)
            
            print(f"\r   Progress: |{bar}| {percent}% ({mb_downloaded:.0f}MB / {mb_total:.0f}MB)", end="")
        
        urllib.request.urlretrieve(DATASET_URL, DOWNLOAD_PATH, download_progress)
        print("\n\n✓ Download complete!")
    
    except Exception as e:
        print(f"\n\n❌ Download failed: {e}")
        print("\nPlease try one of these alternatives:")
        print("1. Download manually: https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz")
        print("2. Use Google Colab (has better internet): https://colab.research.google.com")
        print("3. Or run: wget https://data.vision.ee.ethz.ch/cvl/food-101.tar.gz")
        print("="*70 + "\n")
        exit(1)

# Extract dataset
print(f"\n📦 Extracting dataset to: {EXTRACT_PATH}")
print("   This may take 5-10 minutes...\n")

try:
    with tarfile.open(DOWNLOAD_PATH, "r:gz") as tar:
        # Get total files for progress
        members = tar.getmembers()
        total_members = len(members)
        
        for i, member in enumerate(tar.getmembers()):
            tar.extract(member, path=EXTRACT_PATH)
            
            if (i + 1) % 100 == 0 or (i + 1) == total_members:
                percent = ((i + 1) * 100) // total_members
                print(f"\r   Extracted: {i + 1}/{total_members} files ({percent}%)", end="")
        
        print(f"\r   Extracted: {total_members}/{total_members} files (100%)")

except Exception as e:
    print(f"\n\n❌ Extraction failed: {e}")
    print("\nTroubleshooting:")
    print("1. Make sure you have 10GB free disk space")
    print("2. Close any programs accessing these files")
    print("3. Try extracting manually: tar xzf food-101.tar.gz -C dataset/")
    print("="*70 + "\n")
    exit(1)

# Verify extraction
if os.path.exists(FINAL_PATH):
    images_path = os.path.join(FINAL_PATH, "images")
    meta_path = os.path.join(FINAL_PATH, "meta")
    
    if os.path.exists(images_path) and os.path.exists(meta_path):
        num_classes = len([d for d in os.listdir(images_path) if os.path.isdir(os.path.join(images_path, d))])
        print(f"\n✓ Extraction successful!")
        print(f"  Found {num_classes} food classes")
        print(f"  Dataset location: {FINAL_PATH}")
    else:
        print(f"\n⚠️  Dataset extracted but structure seems wrong")
        print(f"  Please verify: {FINAL_PATH}")
else:
    print(f"\n❌ Dataset not found after extraction")
    print(f"  Expected location: {FINAL_PATH}")
    print("  Please check extraction manually")

# Clean up tar file (optional)
if os.path.exists(DOWNLOAD_PATH):
    try:
        print(f"\n🧹 Cleaning up tar file: {DOWNLOAD_PATH}")
        os.remove(DOWNLOAD_PATH)
        print("   Removed to save disk space")
    except:
        print(f"\n⚠️  Could not remove tar file: {DOWNLOAD_PATH}")
        print("   You can manually delete it to free up space")

print("\n" + "="*70)
print("✅ DATASET DOWNLOAD COMPLETE!")
print("="*70)
print("\nNext steps:")
print("1. Train model: python scripts/train.py")
print("2. This will take 1-2 hours on your RTX 4050")
print("="*70 + "\n")
