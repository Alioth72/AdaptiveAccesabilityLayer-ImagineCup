import os
import uuid
import torch
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

# ------------------------
# Load model ONCE (IMPORTANT)
# ------------------------

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print(f"🔊 Loading ChatterboxTTS on {DEVICE}...")

tts_model = ChatterboxTTS.from_pretrained(device=DEVICE)

print("✅ TTS model loaded")

AUDIO_DIR = "out/visual/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)


def generate_tts_audio(text: str) -> str:
    """
    Generates speech audio from text.
    Returns relative path to WAV file.
    """

    if not text.strip():
        raise ValueError("Empty text passed to TTS")

    # Generate waveform
    wav = tts_model.generate(text)

    filename = f"{uuid.uuid4().hex}.wav"
    output_path = os.path.join(AUDIO_DIR, filename)

    # Save audio
    ta.save(output_path, wav.cpu(), tts_model.sr)

    return output_path
