from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision import models
import io
import base64
import warnings
import time
import os
from datetime import datetime

warnings.filterwarnings('ignore')

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={
    r"/classify": {"origins": "*"},
    r"/api/*": {"origins": "*"}
})

# Configuration
UPLOAD_FOLDER = 'uploaded_images'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load pre-trained ResNet50 model
device = torch.device('cpu')
model = models.resnet50(pretrained=True).to(device)
model.eval()
MODEL_NAME = "ResNet50"

# ImageNet classes
import urllib.request
url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
labels_path = "imagenet_classes.txt"
try:
    urllib.request.urlretrieve(url, labels_path)
    with open(labels_path) as f:
        classes = [line.strip() for line in f.readlines()]
except:
    classes = [f"Class {i}" for i in range(1000)]

# Image preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                        std=[0.229, 0.224, 0.225]),
])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/classify', methods=['POST'])
def classify():
    """
    Classify single or multiple food images.
    Supports both single image and batch processing.
    """
    start_time = time.time()
    
    try:
        # Handle batch processing
        files = request.files.getlist('image')
        save_images = request.form.get('save_images', 'false').lower() == 'true'
        
        if not files:
            return jsonify({'success': False, 'error': 'No image provided'}), 400
        
        results = []
        
        for file in files:
            if not file or file.filename == '':
                continue
            
            if not allowed_file(file.filename):
                results.append({
                    'filename': file.filename,
                    'success': False,
                    'error': 'Invalid file type'
                })
                continue
            
            try:
                # Open and process image
                image = Image.open(file.stream).convert('RGB')
                
                # Optionally save the image
                if save_images:
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    filename = f"{timestamp}_{file.filename}"
                    filepath = os.path.join(UPLOAD_FOLDER, filename)
                    image.save(filepath)
                else:
                    filename = file.filename
                
                # Preprocess and predict
                img_tensor = preprocess(image).unsqueeze(0).to(device)
                
                with torch.no_grad():
                    outputs = model(img_tensor)
                    probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                
                # Get top 5 predictions
                top5_prob, top5_idx = torch.topk(probabilities, 5)
                
                predictions = []
                for i in range(5):
                    prob_float = float(top5_prob[i].cpu().numpy())
                    predictions.append({
                        'rank': i + 1,
                        'class': classes[top5_idx[i]].title(),
                        'confidence_percentage': f"{prob_float*100:.2f}%",
                        'confidence_score': round(prob_float, 4)
                    })
                
                results.append({
                    'filename': filename,
                    'success': True,
                    'predictions': predictions,
                    'model': MODEL_NAME,
                    'image_saved': save_images
                })
            
            except Exception as e:
                results.append({
                    'filename': file.filename,
                    'success': False,
                    'error': str(e)
                })
        
        processing_time = round(time.time() - start_time, 3)
        
        # Return single result if one image, array if multiple
        if len(results) == 1:
            result = results[0]
            result['processing_time_seconds'] = processing_time
            return jsonify(result)
        else:
            return jsonify({
                'success': True,
                'batch_mode': True,
                'total_images': len(results),
                'results': results,
                'processing_time_seconds': processing_time
            })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/info', methods=['GET'])
def api_info():
    """Get API information"""
    return jsonify({
        'model': MODEL_NAME,
        'classes': len(classes),
        'supported_formats': list(ALLOWED_EXTENSIONS),
        'api_endpoints': {
            'classify': '/classify (POST)',
            'info': '/api/info (GET)'
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

if __name__ == '__main__':
    print("🍕 Food Classifier API")
    print("=" * 50)
    print(f"Model: {MODEL_NAME}")
    print(f"Classes: {len(classes)}")
    print("=" * 50)
    print("Endpoints:")
    print("  GET  http://localhost:5000/          - Web UI")
    print("  POST http://localhost:5000/classify  - Classify images")
    print("  GET  http://localhost:5000/api/info  - API information")
    print("=" * 50)
    print("Starting server at http://localhost:5000")
    app.run(debug=False, host='localhost', port=5000)
