"""
Travel Mirror AI — Voice API Routes.

Mounts under /api/voice on the main FastAPI app.
Single endpoint for the demo: POST /api/voice/speak

Frontend usage:
    POST /api/voice/speak
    Content-Type: application/json
    { "text": "Your journey to Lisbon awaits...", "session_id": "abc123" }

    Response: audio/mpeg stream — play directly with <audio> or the Web Audio API.
"""

from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

from ai.voice_service import generate_speech, is_voice_available

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api/voice", tags=["voice"])

# ── Max chars guard — ElevenLabs charges per character ─────────────────
_MAX_CHARS = 1000


class SpeakRequest(BaseModel):
    text:       str = Field(..., description="Narration text to convert to speech")
    session_id: str = Field(default="", description="Optional session reference")


class VoiceStatusResponse(BaseModel):
    available: bool
    voice_id:  str
    note:      str


# ══════════════════════════════════════════════════════════════════════
# POST /api/voice/speak
# ══════════════════════════════════════════════════════════════════════

@router.post(
    "/speak",
    response_class=Response,
    responses={
        200: {"content": {"audio/mpeg": {}}, "description": "MP3 audio stream"},
        503: {"description": "ElevenLabs not configured"},
        500: {"description": "TTS generation failed"},
    },
    summary="Convert AI narration text to speech (MP3)",
)
async def speak(req: SpeakRequest):
    """
    Takes the AI explanation text and returns playable MP3 audio.

    - Trims text to MAX_CHARS to avoid runaway charges.
    - Returns audio/mpeg directly so the frontend can play it inline.
    - API key stays server-side only.
    """
    if not is_voice_available():
        raise HTTPException(
            status_code=503,
            detail="Voice service not configured. Set ELEVENLABS_API_KEY in ai/.env.",
        )

    # Trim to guard against runaway charges
    text = req.text.strip()[:_MAX_CHARS]
    if not text:
        raise HTTPException(status_code=400, detail="text field is empty")

    try:
        audio_bytes = await generate_speech(text)
    except RuntimeError as e:
        log.exception("TTS failed for session=%s", req.session_id)
        raise HTTPException(status_code=500, detail=str(e))

    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": "inline; filename=travel_mirror_narration.mp3",
            "Cache-Control":       "no-store",
        },
    )


# ══════════════════════════════════════════════════════════════════════
# GET /api/voice/status  — health check for voice layer
# ══════════════════════════════════════════════════════════════════════

@router.get("/status", response_model=VoiceStatusResponse)
async def voice_status():
    """Quick check: is the voice service configured and ready?"""
    from ai.config import ELEVENLABS_VOICE_ID
    return VoiceStatusResponse(
        available=is_voice_available(),
        voice_id=ELEVENLABS_VOICE_ID or "not-set",
        note="Add ELEVENLABS_API_KEY to ai/.env to enable voice." if not is_voice_available() else "Voice ready.",
    )
