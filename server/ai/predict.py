import sys
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import json
import os
import numpy as np

# --- 1. Model Configuration ---
class_names = [
    "JAS & MIT (Complex Stress)",           # tomato__JAS_MIT
    "Potassium Deficiency (K)",             # tomato__K
    "Leaf Mold (LM)",                       # tomato__LM
    "Mites (MIT)",                          # tomato__MIT
    "Nitrogen Deficiency (N)",              # tomato__N
    "Nitrogen & Potassium (N_K)",           # tomato__N_K
    "Healthy"                               # tomato__healthy
]

def build_model(num_classes):
    model = models.efficientnet_b3(weights=None)
    num_ftrs = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(num_ftrs, num_classes)
    )
    return model

# --- 2. Loading Model & Weights ---
device = torch.device("cpu")
base_path = os.path.dirname(os.path.abspath(__file__))
weights_path = os.path.join(base_path, 'best_efficientnet_b3_model.pth')

model = build_model(len(class_names))

try:
    if os.path.exists(weights_path):
        model.load_state_dict(torch.load(weights_path, map_location=device))
        model.eval()
    else:
        print(json.dumps({"error": "Weights file not found"}))
        sys.exit(1)
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

# --- 3. Image Processing Helpers ---
transform = transforms.Compose([
    transforms.Resize((300, 300)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def is_plant_content(img_pil):
    """
    دالة تتحقق مما إذا كانت الصورة تحتوي على ألوان مقاربة للنباتات 
    (الأخضر، الأصفر، البني) باستخدام تحليل البكسلات.
    """
    # تحويل الصورة إلى Numpy array للتعامل مع الألوان
    img_np = np.array(img_pil.convert('RGB'))
    
    # تحويل من RGB إلى HSV (أفضل لعزل الألوان)
    # ملاحظة: سنستخدم محاكاة بسيطة للـ HSV بدون OpenCV لتقليل الاعتمادية
    r, g, b = img_np[:,:,0], img_np[:,:,1], img_np[:,:,2]
    
    # شرط بسيط: في النباتات غالباً يكون اللون الأخضر أو الأصفر مسيطراً
    # أو يكون هناك توازن معين يختلف عن الألوان الرقمية الفاقعة (مثل شعار تيليجرام)
    green_mask = (g > r) & (g > b) & (g > 40) # البحث عن تدرجات الأخضر
    yellow_brown_mask = (r > 100) & (g > 80) & (b < 100) # البحث عن تدرجات الأصفر/البني
    
    plant_pixels = np.sum(green_mask | yellow_brown_mask)
    total_pixels = img_np.shape[0] * img_np.shape[1]
    
    plant_ratio = plant_pixels / total_pixels
    
    # إذا كانت نسبة ألوان النبات أقل من 8%، نعتبرها صورة غير صالحة
    return plant_ratio > 0.08

def predict(image_path):
    try:
        if not os.path.exists(image_path):
             print(json.dumps({"error": "Image file not found"}))
             return

        img = Image.open(image_path).convert('RGB')
        
        # --- التحقق من محتوى الصورة (الاقتراح الجديد) ---
        if not is_plant_content(img):
            print(json.dumps({
                "invalid": True, 
                "error": "The image does not appear to contain a plant. Please upload a clear photo of a tomato leaf."
            }))
            return
        # -----------------------------------------------

        img_t = transform(img).unsqueeze(0).to(device)
        
        with torch.no_grad():
            outputs = model(img_t)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)
        
        idx = predicted_idx.item()
        conf_percent = confidence.item() * 100
        
        # التحقق الإضافي من نسبة الثقة
        if conf_percent < 30.0:
            print(json.dumps({
                "invalid": True, 
                "error": "Low confidence. The image might not be clear enough."
            }))
            return

        stress_label = class_names[idx]
        damage_mapping = ["High", "Moderate", "Minimal", "High", "Moderate", "High", "None"]
        
        forecast_mapping = [
            f"Risk of complete leaf dehydration and crop loss within 10 days due to complex JAS/MIT stress (Confidence: {conf_percent:.2f}%).",
            f"Expected yellowing of leaf edges and reduced fruit size if Potassium levels aren't restored (Confidence: {conf_percent:.2f}%).",
            f"Potential spread of fungal spores to neighboring plants under high humidity conditions (Confidence: {conf_percent:.2f}%).",
            f"Severe leaf curling and stunting of new growth expected due to active mite infestation (Confidence: {conf_percent:.2f}%).",
            f"General chlorosis (yellowing) and stunted plant development leading to poor yield (Confidence: {conf_percent:.2f}%).",
            f"Major physiological collapse and failure to flower if N-K balance is not corrected (Confidence: {conf_percent:.2f}%).",
            f"Plant is currently stable. Maintain routine care to prevent future environmental stress (Confidence: {conf_percent:.2f}%)."
        ]
        
        actions_mapping = [
            ["Integrated pest management", "Soil salinity check"],
            ["Potassium-rich fertilizer", "Water pH adjustment"],
            ["Reduce humidity", "Improve airflow", "Fungicide"],
            ["Use miticides", "Isolate infected plants"],
            ["Nitrogen fertilizer (Urea)", "Organic matter addition"],
            ["Balanced NPK application", "Soil nutrient analysis"],
            ["Regular monitoring", "Standard irrigation"]
        ]

        result = {
            "stress": stress_label,
            "damage": damage_mapping[idx],
            "prediction": forecast_mapping[idx],
            "actions": actions_mapping[idx]
        }
        
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        predict(sys.argv[1])