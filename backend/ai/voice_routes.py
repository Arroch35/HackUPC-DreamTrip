from _future_ import annotations

import logging
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import Response
from pydantic import BaseModel, Field

from ai.voice_service import generate_speech, transcribe_speech, is_voice_available

log = logging.getLogger(_name_)

router = APIRouter(prefix="/api/voice", tags=["voice"])

_MAX_CHARS = 1000


class SpeakRequest(BaseModel):
    text: str = Field(..., description="Narration text to convert to speech")
    session_id: str = Field(default="", description="Optional session reference")


class TranscribeResponse(BaseModel):
    text: str
    language_code: str
    filename: str


class VoiceStatusResponse(BaseModel):
    available: bool
    voice_id: str
    note: str


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
    if not is_voice_available():
        raise HTTPException(
            status_code=503,
            detail="Voice service not configured. Set ELEVENLABS_API_KEY in ai/.env.",
        )

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
            "Cache-Control": "no-store",
        },
    )


@router.post(
    "/transcribe",
    response_model=TranscribeResponse,
    summary="Convert uploaded speech audio to text",
)
async def transcribe(
    file: UploadFile = File(...),
    language_code: str = Form(default="en"),
):
    if not is_voice_available():
        raise HTTPException(
            status_code=503,
            detail="Voice service not configured. Set ELEVENLABS_API_KEY in ai/.env.",
        )

    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="uploaded file is empty")

    try:
        result = await transcribe_speech(
            audio_bytes=audio_bytes,
            filename=file.filename or "audio.webm",
            language_code=language_code,
        )
    except RuntimeError as e:
        log.exception("STT failed for filename=%s", file.filename)
        raise HTTPException(status_code=500, detail=str(e))

    return TranscribeResponse(
        text=result.get("text", ""),
        language_code=result.get("language_code", language_code),
        filename=file.filename or "audio.webm",
    )


@router.get("/status", response_model=VoiceStatusResponse)
async def voice_status():
    from ai.config import ELEVENLABS_VOICE_ID
    return VoiceStatusResponse(
        available=is_voice_available(),
        voice_id=ELEVENLABS_VOICE_ID or "not-set",
        note="Add ELEVENLABS_API_KEY to ai/.env to enable voice." if not is_voice_available() else "Voice ready.",
    )