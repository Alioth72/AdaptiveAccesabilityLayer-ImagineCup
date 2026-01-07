from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import yt_dlp
import re
import os
import time
import google.generativeai as genai
from dotenv import load_dotenv

# Load Env
load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Gemini Setup ---
api_key = os.getenv("GEMINI_API_KEY")
print(f"Loaded API Key: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")

if api_key:
    genai.configure(api_key=api_key)
    # USER REQUESTED MODEL
    model = genai.GenerativeModel('gemini-2.5-flash-lite')
else:
    print("WARNING: GEMINI_API_KEY not found in .env file.")
    model = None

# --- Helpers ---

def extract_video_id(url):
    regex = r"(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*"
    match = re.search(regex, url)
    if match and len(match.group(1)) == 11:
        return match.group(1)
    return None

def parse_timestamps(text):
    regex = r'(\d{1,2}:\d{2}(?::\d{2})?)\s+([^\n]+)'
    return re.findall(regex, text)

# --- Routes ---

@app.route('/analyze_structure', methods=['POST'])
def analyze_structure():
    """
    Step 1: Fetches video data, parses timestamps, and generates a Summary.
    Returns the 'skeleton' of the flashcards (titles/times) instantly.
    """
    data = request.json
    video_url = data.get('url')
    video_id = extract_video_id(video_url)
    
    if not video_id:
        return jsonify({'error': 'Invalid URL'}), 400

    print(f"Analyzing Structure for {video_id}...")
    
    # 1. Get Text
    full_text = ""
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([t['text'] for t in transcript_list])
    except:
        try:
            ydl_opts = {'quiet': True, 'skip_download': True}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(video_url, download=False)
                full_text = info.get('description', '')
        except:
            full_text = "No content found."

    # 2. Extract Structure (Timestamps)
    timestamps = parse_timestamps(full_text)
    flashcards = []
    
    if not timestamps:
        if len(full_text) > 100:
             flashcards.append({"title": "Core Topic", "timestamp": "00:00"})
             flashcards.append({"title": "Deep Dive", "timestamp": "01:30"})
             flashcards.append({"title": "Key Takeaways", "timestamp": "03:00"})
    else:
        # Return ALL timestamps now (Frontend will queue them)
        for t in timestamps:
            flashcards.append({"title": t[1], "timestamp": t[0]})

    # 3. Generate Summary (1 AI Call)
    summary = "Summary loading..."
    if model:
        try:
            prompt = f"Summarize this video transcript in 3 concise sentences. Context: {full_text[:3000]}"
            response = model.generate_content(prompt)
            summary = response.text
        except Exception as e:
            print(f"Summary Error: {e}")
            summary = "Summary unavailable (Rate Limit)."

    return jsonify({
        "summary": summary,
        "flashcards": flashcards, # Content is missing, Frontend will fetch it
        "raw_clean": full_text[:5000] # Send context for frontend to pass back (stateless)
    })

@app.route('/generate_card', methods=['POST'])
def generate_card():
    """
    Step 2: Frontend calls this 1-by-1 to fill in the cards.
    """
    data = request.json
    title = data.get('title')
    full_context = data.get('context', '')
    
    if not model:
        return jsonify({"content": "<p>No API Key</p>"})

    prompt = f"""
    You are an expert tutor creating detailed study notes.
    Task: Explain the concept "{title}" based on the video context.
    Video Context: {full_context[:1000]}...
    
    Output Format: return ONLY raw HTML (no markdown backticks) with this structure:
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
        return jsonify({"content": text})
    except Exception as e:
        print(f"Card Gen Error: {e}")
        return jsonify({"error": str(e)}), 429 # Return specific code

@app.route('/solve_doubt', methods=['POST'])
def solve_doubt():
    data = request.json
    question = data.get('question', '')
    context = data.get('context', '')
    
    if not model:
        return jsonify({"answer": "API Key Missing."})
        
    prompt = f"""
    You are a helpful Physics/Coding tutor.
    Context from video: {context[:2000]}...
    
    Student Question: {question}
    
    Answer clearly and concisely (max 2 sentences).
    """
    
    try:
        response = model.generate_content(prompt)
        return jsonify({"answer": response.text})
    except Exception as e:
        return jsonify({"answer": f"Thinking failed: {str(e)}"})

if __name__ == '__main__':
    app.run(port=5000)
