"""
Travel Mirror AI — Configuration.

Provider selection logic:
  1. Check env vars in order: GOOGLE_API_KEY → OPENAI_API_KEY → ANTHROPIC_API_KEY
  2. If none found, fall back to MOCK mode (deterministic test outputs)
  3. Override with LLM_PROVIDER env var: "openai" | "gemini" | "anthropic" | "mock"

All LLM settings are swappable via .env without code changes.
"""

import os
from dotenv import load_dotenv

# Load .env from the ai/ folder or project root
_env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(_env_path)
load_dotenv()  # also check project root

# ── Provider detection ─────────────────────────────────────────────────
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

# Model names per provider
OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
CLAUDE_MODEL: str = os.getenv("CLAUDE_MODEL", "claude-3-haiku-20240307")

# Explicit provider override (optional)
_provider_override = os.getenv("LLM_PROVIDER", "").lower().strip()


def _detect_provider() -> str:
    """Auto-detect which provider to use based on available keys."""
    if _provider_override in ("openai", "gemini", "anthropic", "mock"):
        return _provider_override

    # Priority: Gemini free tier first (user request), then OpenAI, then Anthropic
    if GOOGLE_API_KEY and GOOGLE_API_KEY != "your-key-here":
        return "gemini"
    if OPENAI_API_KEY and OPENAI_API_KEY != "your-key-here":
        return "openai"
    if ANTHROPIC_API_KEY and ANTHROPIC_API_KEY != "your-key-here":
        return "anthropic"

    return "mock"


LLM_PROVIDER: str = _detect_provider()

# Resolved model name for the active provider
MODEL_NAME: str = {
    "openai": OPENAI_MODEL,
    "gemini": GEMINI_MODEL,
    "anthropic": CLAUDE_MODEL,
    "mock": "mock-model",
}[LLM_PROVIDER]


# ── Temperatures per agent role ────────────────────────────────────────
TEMPERATURE_INTENT: float = 0.3   # deterministic extraction
TEMPERATURE_SCENARIO: float = 0.7 # creative diversity
TEMPERATURE_CRITIC: float = 0.2   # analytical
TEMPERATURE_EXPLAIN: float = 0.5  # balanced
TEMPERATURE_REFLECT: float = 0.4  # cautious update

# ── Reality constraints ────────────────────────────────────────────────
MIN_REALITIES: int = 3
MAX_REALITIES: int = 5

# ── Defaults ───────────────────────────────────────────────────────────
DEFAULT_ORIGIN: str = "BCN"          # Barcelona — HackUPC default
DEFAULT_MARKET: str = "ES"
DEFAULT_LOCALE: str = "en-US"
DEFAULT_CURRENCY: str = "EUR"
DEFAULT_ADULTS: int = 1
DEFAULT_CABIN_CLASS: str = "CABIN_CLASS_ECONOMY"

# ── Server ─────────────────────────────────────────────────────────────
CORS_ORIGINS: list[str] = ["*"]      # wide open for hackathon dev
SERVER_PORT: int = int(os.getenv("PORT", "8000"))

# ── Skyscanner Partner API ─────────────────────────────────────────────
SKYSCANNER_API_KEY: str = os.getenv("SKYSCANNER_API_KEY", "")
SKYSCANNER_BASE_URL: str = "https://partners.api.skyscanner.net"

# ── ElevenLabs Voice (TTS) ─────────────────────────────────────────────
# Required: set ELEVENLABS_API_KEY in ai/.env before using /api/voice/speak
# Voice IDs: https://elevenlabs.io/voice-library  (or use the default "Rachel")
ELEVENLABS_API_KEY:  str = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE_ID: str = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Rachel
ELEVENLABS_MODEL_ID: str = os.getenv("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")

# ── Data paths ─────────────────────────────────────────────────────────
DATA_DIR: str = os.path.join(os.path.dirname(__file__), "data")

