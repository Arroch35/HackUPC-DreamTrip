"""
Travel Mirror AI — ElevenLabs Voice Service.

TTS: AI narration text → MP3 audio   (ElevenLabs /v1/text-to-speech)
STT: User audio input  → text prompt (ElevenLabs /v1/speech-to-text)

API key is server-side only; never exposed to the frontend.

Usage:
    from ai.voice_service import generate_speech, transcribe_speech
    audio_bytes = await generate_speech("Your trip to Lisbon awaits...")
    text = await transcribe_speech(audio_bytes, "recording.webm")
"""

from __future__ import annotations

import httpx
import logging
from .config import ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL_ID

log = logging.getLogger(__name__)

# ── TTS settings ──────────────────────────────────────────────────────
VOICE_CONFIG = {
    "voice_id":    ELEVENLABS_VOICE_ID,
    "model_id":    ELEVENLABS_MODEL_ID,
    "voice_settings": {
        "stability":        0.5,   # 0-1: lower = more expressive
        "similarity_boost": 0.75,  # 0-1: voice clarity
        "style":            0.0,
        "use_speaker_boost": True,
    },
}

# ── STT settings ──────────────────────────────────────────────────────
STT_MODEL = "scribe_v1"  # ElevenLabs Scribe — their STT model

_BASE_URL = "https://api.elevenlabs.io/v1"
_TTS_TIMEOUT = 30   # seconds
_STT_TIMEOUT = 60   # STT can take longer for bigger files


# ══════════════════════════════════════════════════════════════════════
# TTS — Text to Speech
# ══════════════════════════════════════════════════════════════════════

async def generate_speech(text: str) -> bytes:
    """
    Convert text → MP3 audio bytes using ElevenLabs TTS.

    Args:
        text: The narration string from the AI explanation agent.

    Returns:
        Raw MP3 bytes — stream or save directly.

    Raises:
        RuntimeError: if ElevenLabs returns a non-200 status.
    """
    if not ELEVENLABS_API_KEY:
        raise RuntimeError(
            "ELEVENLABS_API_KEY not set. Add it to ai/.env and restart."
        )

    url = f"{_BASE_URL}/text-to-speech/{VOICE_CONFIG['voice_id']}"

    headers = {
        "xi-api-key":   ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept":       "audio/mpeg",
    }

    payload = {
        "text":           text,
        "model_id":       VOICE_CONFIG["model_id"],
        "voice_settings": VOICE_CONFIG["voice_settings"],
    }

    async with httpx.AsyncClient(timeout=_TTS_TIMEOUT) as client:
        resp = await client.post(url, json=payload, headers=headers)

    if resp.status_code != 200:
        log.error("ElevenLabs TTS error %s: %s", resp.status_code, resp.text[:300])
        raise RuntimeError(
            f"ElevenLabs TTS failed ({resp.status_code}): {resp.text[:200]}"
        )

    log.info("ElevenLabs TTS OK — %d bytes for %d chars", len(resp.content), len(text))
    return resp.content  # raw MP3 bytes


# ══════════════════════════════════════════════════════════════════════
# STT — Speech to Text
# ══════════════════════════════════════════════════════════════════════

async def transcribe_speech(
    audio_bytes: bytes,
    filename: str = "audio.webm",
    language_code: str = "en",
) -> dict:
    """
    Convert audio → text using ElevenLabs STT (Scribe).

    Args:
        audio_bytes: Raw audio file content (webm, mp3, wav, m4a, ogg).
        filename:    Original filename — extension tells ElevenLabs the format.
        language_code: ISO 639-1 code. Default "en".

    Returns:
        dict with keys:
          - "text": the full transcription string
          - "language_code": detected or specified language

    Raises:
        RuntimeError: if ElevenLabs returns a non-200 status.
    """
    if not ELEVENLABS_API_KEY:
        raise RuntimeError(
            "ELEVENLABS_API_KEY not set. Add it to ai/.env and restart."
        )

    url = f"{_BASE_URL}/speech-to-text"

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
    }

    # Guess MIME type from filename extension
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "webm"
    mime_map = {
        "webm": "audio/webm",
        "mp3":  "audio/mpeg",
        "wav":  "audio/wav",
        "m4a":  "audio/mp4",
        "ogg":  "audio/ogg",
        "mp4":  "audio/mp4",
    }
    mime = mime_map.get(ext, "audio/webm")

    # Multipart form: file + model_id + optional language
    files = {
        "file": (filename, audio_bytes, mime),
    }
    data = {
        "model_id":      STT_MODEL,
        "language_code":  language_code,
    }

    async with httpx.AsyncClient(timeout=_STT_TIMEOUT) as client:
        resp = await client.post(url, headers=headers, files=files, data=data)

    if resp.status_code != 200:
        log.error("ElevenLabs STT error %s: %s", resp.status_code, resp.text[:300])
        raise RuntimeError(
            f"ElevenLabs STT failed ({resp.status_code}): {resp.text[:200]}"
        )

    result = resp.json()
    transcript = result.get("text", "").strip()
    detected_lang = result.get("language_code", language_code)

    log.info("ElevenLabs STT OK — '%s' (%s)", transcript[:80], detected_lang)
    return {"text": transcript, "language_code": detected_lang}


# ══════════════════════════════════════════════════════════════════════
# Status
# ══════════════════════════════════════════════════════════════════════

def is_voice_available() -> bool:
    """Return True if ElevenLabs is configured and ready."""
    return bool(ELEVENLABS_API_KEY and ELEVENLABS_API_KEY != "your_key_here")
