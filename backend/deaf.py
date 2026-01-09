from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import yt_dlp
import requests
import os
import sys
from urllib.parse import unquote
from dotenv import load_dotenv
load_dotenv()

# =========================
# NEW: Optional Gemini setup
# =========================
try:
    import google.generativeai as genai
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel("gemini-2.0-flash")
    else:
        gemini_model = None
except Exception:
    gemini_model = None

print("Gemini active:", gemini_model is not None, flush=True)


app = FastAPI()

# Allow frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# NEW: punctuation helper
# =========================
import time

def punctuate_paragraph(paragraph: str) -> str:
    """
    Uses Gemini to add punctuation & capitalization.
    Splits long paragraphs into chunks to avoid token limits/timeouts.
    Adds delays to respect rate limits.
    """
    if not gemini_model:
        return paragraph

    # 1. Chunking settings
    MAX_CHUNK_SIZE = 1000  # characters roughly
    chunks = []
    
    # Simple chunking by space to avoid cutting words
    words = paragraph.split(' ')
    current_chunk = []
    current_length = 0
    
    for word in words:
        if current_length + len(word) + 1 > MAX_CHUNK_SIZE and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_length = 0
        current_chunk.append(word)
        current_length += len(word) + 1
        
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    print(f"[punctuate_paragraph] Split into {len(chunks)} chunks.", flush=True)

    punctuated_parts = []
    
    for i, chunk in enumerate(chunks):
        # Rate limit delay: Google Free Tier is often ~15 RPM (1 req / 4 sec) or similar.
        # Let's be safe with 2 seconds, but rely on retries for 429s.
        if i > 0:
            print("[punctuate_paragraph] Sleeping 2s...", flush=True)
            time.sleep(2.0)

        prompt = f"""
You are a text editor.

Task:
Add proper punctuation and capitalization to the text below.

Rules:
- Do NOT summarize
- Do NOT add new content
- Do NOT remove content
- Preserve meaning exactly
- Return ONLY the punctuated text

Example -
RAW :  "this became the fundamental conclusion of the theory of relativity a theory proposed by Albert Einstein in 1905 this Theory broke the traditional understanding of time as a constant entity and proved that time in fact is different for different observers the theory of relativity led to many other invaluable findings the most famous of which is the equation eal MC squ but more on that later [Music]"
PUNCT: "This became the fundamental conclusion of the theory of relativity, a theory proposed by Albert Einstein in 1905. This Theory broke the traditional understanding of time as a constant entity and proved that time in fact is different for different observers. The theory of relativity led to many other invaluable findings - the most famous of which is the equation e=MC squared, but more on that later [Music]

Text:
{chunk}
"""
        # Retry loop
        max_retries = 3
        success = False
        
        for attempt in range(max_retries):
            try:
                print(f"[punctuate_paragraph] Chunk {i+1}/{len(chunks)} Attempt {attempt+1}...", flush=True)
                response = gemini_model.generate_content(prompt)
                result = response.text.strip()
                punctuated_parts.append(result)
                success = True
                break
            except Exception as e:
                # check if it is a quota error (429)
                error_str = str(e)
                if "429" in error_str or "quota" in error_str.lower():
                    wait_time = 15 * (attempt + 1) # 15s, 30s, 45s
                    print(f"[punctuate_paragraph] 429 Quota Exceeded. Sleeping {wait_time}s...", flush=True)
                    time.sleep(wait_time)
                else:
                    print(f"[punctuate_paragraph] Valid error: {e}", flush=True)
                    # Non-retriable error? Maybe just break. 
                    # But for safety let's just break and fallback.
                    break
        
        if not success:
            print(f"[punctuate_paragraph] Failed to punctuate chunk {i+1} after retries. Using raw.", flush=True)
            punctuated_parts.append(chunk)

    return " ".join(punctuated_parts)


@app.get("/captions")
def get_captions(url: str):
    """
    Fetch English captions from YouTube using yt-dlp.
    Tries automatic captions first, then manual subtitles.
    Returns raw events JSON.
    """
    print("=" * 50, flush=True)
    print("ENDPOINT CALLED - /captions", flush=True)
    print(f"URL received (raw): {url}", flush=True)
    # Decode URL in case it's double-encoded
    url = unquote(url)
    print(f"URL received (decoded): {url}", flush=True)
    print("=" * 50, flush=True)
    try:
        ydl_opts = {
            "skip_download": True,
            "writesubtitles": True,
            "writeautomaticsub": True,
            "subtitleslangs": ["en", "en-US", "en-GB"],
            "quiet": True,
            "no_warnings": True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        # Try automatic captions first, then manual subtitles
        captions = info.get("automatic_captions") or {}
        if not captions:
            captions = info.get("subtitles") or {}

        # Try different English language codes
        caption_data = None
        for lang_code in ["en", "en-US", "en-GB", "en-CA", "en-AU"]:
            if lang_code in captions and captions[lang_code]:
                caption_list = captions[lang_code]
                for caption_option in caption_list:
                    if caption_option.get("ext") in ("json3", "json"):
                        caption_data = caption_option
                        break
                if caption_data:
                    break

        if not caption_data:
            return {
                "error": "No English captions available for this video.",
                "events": [],
                "paragraphs": []
            }

        # Fetch caption JSON
        response = requests.get(caption_data["url"], timeout=10)
        response.raise_for_status()
        caption_json = response.json()

        events = caption_json.get("events") or caption_json.get("body") or []
        if not events:
            return {
                "error": "Could not parse caption format from YouTube.",
                "events": [],
                "paragraphs": []
            }

        # Extract caption text + timing
        captions_clean = []
        for event in events:
            if not event.get("segs"):
                continue

            text = "".join(seg.get("utf8", "") for seg in event["segs"]).strip()
            if not text:
                continue

            captions_clean.append({
                "start": event.get("tStartMs", 0) / 1000.0,
                "duration": event.get("dDurationMs", 0) / 1000.0,
                "text": text
            })

        if not captions_clean:
            return {
                "error": "No usable caption text found.",
                "events": [],
                "paragraphs": []
            }

        # Paragraph grouping
        PARAGRAPH_PAUSE = 0.6
        MAX_PARA_LENGTH = 1000
        raw_paragraphs = []
        current_para = ""

        for i, cap in enumerate(captions_clean):
            split_now = False
            
            # 1. Split by time gap
            if i > 0:
                prev = captions_clean[i - 1]
                gap = cap["start"] - (prev["start"] + prev["duration"])
                if gap > PARAGRAPH_PAUSE:
                    split_now = True

            # 2. Split by length (force split if too long)
            if len(current_para) > MAX_PARA_LENGTH:
                split_now = True

            if split_now:
                if current_para.strip():
                    raw_paragraphs.append(current_para.strip())
                current_para = ""

            current_para += " " + cap["text"]

        if current_para.strip():
            raw_paragraphs.append(current_para.strip())

        print("RAW PARAGRAPHS:", raw_paragraphs, flush=True)

        # =========================
        # NEW: punctuate paragraphs
        # =========================
        punctuated_paragraphs = []
        for para in raw_paragraphs:
            punctuated = punctuate_paragraph(para)
            print("RAW:", para, flush=True)
            print("PUNCT:", punctuated, flush=True)
            print("-" * 40, flush=True)
            punctuated_paragraphs.append(punctuated)

        return {
            "events": events,
            "paragraphs": punctuated_paragraphs,   # frontend uses this
            "paragraphs_raw": raw_paragraphs        # optional debug
        }

    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print("=" * 50, flush=True)
        print("ERROR CAUGHT:", flush=True)
        print(error_trace, flush=True)
        print("=" * 50, flush=True)
        return {
            "error": f"Error processing video: {str(e)}",
            "events": [],
            "paragraphs": []
        }
