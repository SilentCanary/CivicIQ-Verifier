# 🛂 Identity Verification System

This project performs automated verification of Indian identity documents like **Aadhaar** and **PAN** cards. 
📦 Python Package
Easily install it using pip:
```bash
pip install civic2Verifierrr==0.2.12
```
Use in your script 
```
from document_verifier_Silent_Canary import verify_document
result = verify_document("aadhar_front.png", "aadhar_back.png", "digilocker_data.json")
print(result)

```
  It supports:
- ✅ Text field extraction using **YOLOv8 + Tesseract OCR**
- ✅ Secure QR code decoding (Aadhaar)
- ✅ Face matching between document and live selfie using **face_recognition**
- ✅ Mock Digilocker response for cross verification of OCR details

  ## 🚀 Features
- 🎯 Detect structured fields (name, UID, DOB, gender) from Aadhaar/PAN using a fine-tuned **YOLOv8** model.
- 🔍 Detect **QR code region** using YOLOv8, then:
  - Enhance using **Real-ESRGAN**
  - Deblur & denoise with custom filters
  - Decode Secure Aadhaar QR (with fallback)
- 🤳 Match face from document with **live webcam selfie** using CV2 library
- 🔁 Automatically handles **mock DigiLocker responses**
- 🧪 End-to-end integration with Node.js + FastAPI 
- 📦 Ready-to-publish Python module `civic2verifierrr`

## 🧱 Tech Stack

| Component         | Library / Tool                |
|------------------|-------------------------------|
| Object Detection | [YOLOv8] (Ultralytics) fine tuned(for aadhar, pancard text as well as for detecting QR codes) |
| OCR              | [Tesseract] |
| QR Decoding      | OpenCV QR / WeChat Decoder / ESRGAN and Denoise and TV channel deblur for Enchancing QR quality for decoding. |
| Face Matching    | [face_recognition](https://github.com/ageitgey/face_recognition) |
| Backend (API)    | Python (FastAPI) + Node.js frontend |
| Mock Digilocker   | Node.js |


### 🔧 Requirements

- Python 3.10+
- Node.js 18+
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract/wiki)
- [CMake + Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) for Windows (to run `face_recognition`)


## ✅ How to Run
- Open cmd and navigate to the project directory then run the following bash script to install dependencies :-
  ```bash
  cd python_scripts
  pip install -r requirements.txt
  ```
  -Start the servers
  1)Inside backend for the main node server
  ```bash
  node server.js
  ```
  2)backend->mock_digilocker for digilocker server
  ```bash
  node server.js
  ```
  2)python_scripts->image_detection (Python QR & OCR pipeline)
  ```
  python main.py
  ```
  Navigate to the front-end directory and run the sb HTML file . Upload your documents for verification to get instant response.
