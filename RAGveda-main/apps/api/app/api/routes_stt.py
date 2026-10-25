from fastapi import APIRouter, UploadFile, File, Form, Header
from typing import Optional, Dict, Any
from app.engines.stt_service import stt_service

router = APIRouter(prefix="/stt", tags=["Speech to Text"])

@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form("en"),
    x_stt_api_key: Optional[str] = Header(None, alias="X-STT-Api-Key")
):
    """
    Transcribes audio file to text.
    Uses user-supplied API key (Whisper/Gemini) if provided in X-STT-Api-Key header,
    or falls back gracefully to local audio processor.
    """
    audio_content = await file.read()
    result = await stt_service.transcribe_audio(
        audio_bytes=audio_content,
        filename=file.filename or "recording.webm",
        language=language,
        api_key=x_stt_api_key
    )
    return result
