import os
import uuid
import pyttsx3

AUDIO_DIR = "out/visual/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

# Initialize engine ONCE
engine = pyttsx3.init()

# Optional: slow speech for accessibility
engine.setProperty("rate", 150)   # default ~200
engine.setProperty("volume", 1.0)

def generate_tts_audio(text: str) -> str:
    if not text.strip():
        raise ValueError("Empty text for TTS")

    filename = f"{uuid.uuid4().hex}.wav"
    output_path = os.path.join(AUDIO_DIR, filename)

    engine.save_to_file(text, output_path)
    engine.runAndWait()

    return output_path
