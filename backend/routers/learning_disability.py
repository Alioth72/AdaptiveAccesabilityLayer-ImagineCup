from fastapi import APIRouter
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
import yt_dlp
import re
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables
load_dotenv()

router = APIRouter()

# -------- Gemini Model Setup --------
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash-lite")
else:
    print("❗ WARNING: GEMINI_API_KEY missing in .env")
    model = None


# -------- Helper Functions --------

def extract_video_id(url: str):
    regex = r"(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*"
    match = re.search(regex, url)
    if match and len(match.group(1)) == 11:
        return match.group(1)
    return None


def parse_timestamps(text: str):
    regex = r"(\d{1,2}:\d{2}(?::\d{2})?)\s+([^\n]+)"
    return re.findall(regex, text)


# -------- Pydantic Models --------

class AnalyzeReq(BaseModel):
    url: str


class CardReq(BaseModel):
    title: str
    context: str


class DoubtReq(BaseModel):
    question: str
    context: str


# -------- ROUTES --------

@router.post("/analyze_structure")
async def analyze_structure(body: AnalyzeReq):
    url = body.url
    video_id = extract_video_id(url)

    if not video_id:
        return {"error": "Invalid YouTube URL"}

    print(f"Analyzing Structure for video: {video_id}")

    # ---- 1. Fetch Transcript or Description ----
    full_text = ""
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([t["text"] for t in transcript])
    except:
        try:
            ydl_opts = {"quiet": True, "skip_download": True}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                full_text = info.get("description", "")
        except:
            full_text = "No content found."

    # ---- 2. Extract Timestamps ----
    timestamps = parse_timestamps(full_text)
    flashcards = []

    if not timestamps:
        if len(full_text) > 100:
            flashcards = [
                {"title": "Core Topic", "timestamp": "00:00"},
                {"title": "Deep Dive", "timestamp": "01:30"},
                {"title": "Key Takeaways", "timestamp": "03:00"},
            ]
    else:
        for t in timestamps:
            flashcards.append({"title": t[1], "timestamp": t[0]})

    # ---- 3. Generate Summary ----
    summary = "Summary loading..."
    if model:
        try:
            prompt = (
                f"Summarize this video in 3 concise sentences. "
                f"Context: {full_text[:3000]}"
            )
            response = model.generate_content(prompt)
            summary = response.text
        except Exception as e:
            print(f"Summary Error: {e}")
            summary = "Summary unavailable (Rate Limit)."

    return {
        "summary": summary,
        "flashcards": flashcards,
        "raw_clean": full_text[:5000],
    }


@router.post("/generate_card")
async def generate_card(body: CardReq):
    if not model:
        return {"content": "<p>No API Key</p>"}

    title = body.title
    context = body.context

    prompt = f"""
    You are an expert tutor creating detailed study notes.
    Task: Explain the concept "{title}" using the video context.
    
    Video Context: {context[:1000]}...

    Output Format (raw HTML only):
    <div>
      <h3 class='text-xl font-bold text-indigo-900 mb-2'>Core Concept</h3>
      <p class='text-gray-700 leading-relaxed mb-4'>[Simple definition]</p>
      
      <div class='bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-4'>
         <h4 class='font-bold text-indigo-800 text-sm mb-1'>💡 Key Insight</h4>
         <p class='text-indigo-900 text-sm'>[One crucial takeaway]</p>
      </div>

      <h4 class='font-bold text-gray-500 uppercase text-xs tracking-wider mb-1'>Why it Matters</h4>
      <p class='text-gray-600'>[Practical application]</p>
    </div>
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```html", "").replace("```", "")
        return {"content": text}
    except Exception as e:
        return {"error": str(e)}


@router.post("/solve_doubt")
async def solve_doubt(body: DoubtReq):
    if not model:
        return {"answer": "API Key Missing"}

    prompt = f"""
    You are a helpful tutor.
    Video Context: {body.context[:2000]}...
    
    Student Question: {body.question}
    
    Answer clearly and concisely in 2 sentences maximum.
    """

    try:
        response = model.generate_content(prompt)
        return {"answer": response.text}
    except Exception as e:
        return {"answer": f"Thinking failed: {str(e)}"}
