from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import shutil
import os
import json
from verifier import verify_document


app = FastAPI()

UPLOAD_FOLDER = "temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/verify_document")
async def verify_document_main(request:Request):
    data=await request.json()
    
    front_img_path=data.get("front_img_path")
    back_img_path=data.get("back_img_path")
    digilocker_path = data.get("digilocker_path")
    
    if not front_img_path or not os.path.exists(front_img_path):
        return JSONResponse(status_code=400,content={"err":"Document path is wrong"})
    
    if not digilocker_path or not os.path.exists(digilocker_path):
       return JSONResponse(status_code=400, content={"error": "Invalid digilocker path"})
    try:
        with open(digilocker_path, "r") as f:
            parsed_digilocker = json.load(f)
    except json.JSONDecodeError as e:
        return JSONResponse(status_code=400,content={"err":"invalid digilocker data"})
    result=verify_document(front_img_path, back_img_path, parsed_digilocker)
    return JSONResponse(content=result)
if __name__ == "__main__":
    import uvicorn
    import nest_asyncio
    nest_asyncio.apply()
    uvicorn.run(app, host="0.0.0.0", port=5000)
