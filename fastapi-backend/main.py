from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
import cv2
from io import BytesIO
from PIL import Image

app = FastAPI()

# Enable CORS for MERN + Firebase frontend to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = tf.keras.models.load_model("pcos_detection_model.h5")

# Constants
IMG_SIZE = 224
CLASSES = ["normal", "pcos"]

def apply_sobel(image):
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
    magnitude = np.sqrt(sobelx**2 + sobely**2)
    norm = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)
    return norm.astype(np.uint8)

def preprocess_image(file: UploadFile):
    contents = file.file.read()
    image = Image.open(BytesIO(contents)).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))
    image_np = np.array(image)
    sobel = apply_sobel(image_np)
    image_4ch = np.dstack((image_np, sobel))
    image_4ch = image_4ch.astype("float32") / 255.0
    return np.expand_dims(image_4ch, axis=0)

@app.post("/scan")
async def predict(file: UploadFile = File(...)):
    try:
        image = preprocess_image(file)
        prediction = model.predict(image)[0]
        predicted_class = int(np.argmax(prediction))
        confidence = float(np.max(prediction))
        return {
            "class": CLASSES[predicted_class],
            "confidence": round(confidence * 100, 2)
        }
    except Exception as e:
        return {"error": str(e)}
