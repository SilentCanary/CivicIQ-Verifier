# -*- coding: utf-8 -*-
from ultralytics import YOLO
from PIL import Image
import cv2
import subprocess
import os
import numpy as np
from skimage.restoration import denoise_tv_chambolle
from scipy.signal import convolve2d

model = YOLO("best2.pt")

WECHAT_PATHS = {
    "det_prototxt": "detect.prototxt",
    "det_model": "detect.caffemodel",
    "sr_prototxt": "sr.prototxt",
    "sr_model": "sr.caffemodel"
}

def detect_and_crop_qr(img_path):
    os.makedirs("qr_crops", exist_ok=True)
    image = Image.open(img_path).convert("RGB")
    results = model(image)
    boxes = results[0].boxes.xyxy
    if len(boxes) == 0:
        return None
    x1, y1, x2, y2 = map(int, boxes[0].tolist())
    qr_crop = image.crop((x1, y1, x2, y2))
    crop_path = os.path.join("qr_crops", "qr_crop.jpg")
    qr_crop.save(crop_path)
    return crop_path

def denoise_and_deblur(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return None
    img = img.astype(np.float32) / 255.0
    kernel = np.array([[1, 4, 6, 4, 1],
                       [4, 16, 24, 16, 4],
                       [6, 24, 36, 24, 6],
                       [4, 16, 24, 16, 4],
                       [1, 4, 6, 4, 1]], dtype=np.float32)
    kernel /= np.sum(kernel)
    blurred = convolve2d(img, kernel, mode='same', boundary='wrap')
    sharpened = img + (img - blurred)
    cleaned = denoise_tv_chambolle(sharpened, weight=0.1)
    cleaned = (cleaned * 255).clip(0, 255).astype(np.uint8)
    output_path = img_path.replace(".jpg", "_cleaned.jpg")
    cv2.imwrite(output_path, cleaned)
    return output_path

def enchance_with_Real_esrgan(img_path):
    output_path = img_path.replace(".jpg", "_enhanced.jpg")
    result = subprocess.run([
        "realesrgan-ncnn-vulkan.exe",
        "-i", img_path, "-o", output_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True)
    return output_path if os.path.exists(output_path) else None

def decode_wit_wechat(img_path):
    detector = cv2.wechat_qrcode_WeChatQRCode(
        WECHAT_PATHS["det_prototxt"],
        WECHAT_PATHS["det_model"],
        WECHAT_PATHS["sr_prototxt"],
        WECHAT_PATHS["sr_model"])
    img = cv2.imread(img_path)
    if img is None:
        return []
    decoded, _ = detector.detectAndDecode(img)
    return decoded

def process_document(img_path):
    qr_path = detect_and_crop_qr(img_path)
    if not qr_path:
        print("No QR code detected")
        return

    print("Trying denoise/deblur...")
    cleaned_path = denoise_and_deblur(qr_path)
    if cleaned_path:
        data = decode_wit_wechat(cleaned_path)
        if data:
            print("Decoded after denoise:")
            for content in data:
                print(content)
            return

    print("Trying Real-ESRGAN...")
    enhanced_path = enchance_with_Real_esrgan(qr_path)
    if enhanced_path:
        data = decode_wit_wechat(enhanced_path)
        if data:
            print("Decoded after ESRGAN:")
            for content in data:
                print(content)
            return

    print("Could not decode QR")

if __name__ == "__main__":
    process_document("pancard.jpeg")
