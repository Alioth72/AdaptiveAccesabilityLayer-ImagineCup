from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
import tempfile
import time

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from services.tts_utils import generate_tts_audio
from services.etl_service import normalize_for_speech
from services.etl_service import ETLPipeline

# ------------------------
# Config
# ------------------------

PAGE_IMAGE_DIR = "out/visual/converted_images"
PARSED_SECTIONS_DIR = "out/visual/parsed_sections"
MODEL_PATH = "models/yolov12s-doclaynet.pt"

router = APIRouter()

etl_pipeline = ETLPipeline(
    model_path=MODEL_PATH,
    page_image_dir=PAGE_IMAGE_DIR,
    parsed_sections_dir=PARSED_SECTIONS_DIR
)

# ------------------------
# Upload & Parse Document
# ------------------------

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    start_time = time.time()
    print("📥 Upload received")
    print("📄 Filename:", file.filename)
    print("📄 Content-Type:", file.content_type)

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=os.path.splitext(file.filename)[1]
        ) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name

        output = []

        image_paths = etl_pipeline.convert_document_to_images(
            temp_path,
            file.filename
        )
        print("📁 Temp file saved at:", temp_path)
        print("📁 Temp file size:", os.path.getsize(temp_path), "bytes")

        for i, image_path in enumerate(image_paths):
            page_no = i + 1
            base_name = os.path.splitext(os.path.basename(image_path))[0]
            page_output_dir = os.path.join(PARSED_SECTIONS_DIR, base_name)

            parsed = etl_pipeline.parse_image_layout(
                image_path,
                page_output_dir
            )

            output.append({
                "page": page_no,
                "content": parsed
            })

        return JSONResponse({
            "filename": file.filename,
            "pages": output,
            "processing_time": round(time.time() - start_time, 2)
        })

    except Exception as e:
        print("❌ Error type:", type(e))
        print("❌ Error message:", e)
        raise

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# ------------------------
# Chat / Explain Content
# ------------------------

@router.post("/chat")
async def chat_with_document(payload: dict):
    """
    payload = {
      "content": "...extracted text...",
      "history": "previous messages",
      "question": "user query"
    }
    """

    try:
        gemini = genai.GenerativeModel(
            "gemini-2.0-flash",
            safety_settings={
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            },
        )

        prompt = f"""
You are an accessibility assistant for visually impaired users.

Document content:
{payload.get("content")}

Conversation history:
{payload.get("history")}

User question:
{payload.get("question")}
"""

        response = gemini.generate_content(prompt)

        return {"answer": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tts")
async def generate_audio_from_document(payload: dict):
    """
    payload = {
      "pages": [
        {
          "page": 1,
          "content": [
            {"tag": "List-item", "content": "Example"}
          ]
        }
      ]
    }
    """

    pages = payload.get("pages")
    if not pages:
        raise HTTPException(status_code=400, detail="Pages required")

    speech_lines = []

    for page in pages:
        speech_lines.append(f"Page {page['page']}.")

        for item in page["content"]:
            speech_text = normalize_for_speech(
                item["tag"],
                item["content"]
            )
            speech_lines.append(speech_text)

    final_text = " ".join(speech_lines)

    audio_path = generate_tts_audio(final_text)

    return {
        "audio_path": audio_path,
        "spoken_text": final_text
    }
