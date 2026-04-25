"""
Travel Mirror AI — FastAPI server.

Exposes all endpoints from docs/api_contract.md plus the convenience
/api/pipeline endpoint that the frontend will primarily use.
"""

from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.ai.config import CORS_ORIGINS
from ai.schemas import (
    IntentPlanRequest, IntentPlanResponse,
    IntentParseRequest, IntentParseResponse,
    RealityGenerateRequest, RealityGenerateResponse,
    ReflectRequest, ReflectResponse,
    PipelineRequest, PipelineResponse,
    IntentVector, QueryPlan,
)
from ai.orchestrator import run_pipeline, run_reflection, run_query_plan
from backend.ai.voice_routes import router as voice_router

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI(
    title="Travel Mirror AI",
    description="AI layer for Travel Mirror — intent parsing, reality generation, and reflection.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Voice layer (ElevenLabs TTS)
app.include_router(voice_router)


# ── Health ─────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "travel-mirror-ai"}


# ══════════════════════════════════════════════════════════════════════
# Endpoint 1: /api/intent/plan
# ══════════════════════════════════════════════════════════════════════

@app.post("/api/intent/plan", response_model=IntentPlanResponse)
async def intent_plan(req: IntentPlanRequest):
    """
    Lightweight: parse user text → query plan for Skyscanner search.
    The backend calls this FIRST to know what to search.
    """
    try:
        result = await run_query_plan(req.input_text, req.session_id)
        return IntentPlanResponse(query_plan=result["query_plan"])
    except Exception as e:
        log.exception("intent/plan failed")
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════
# Endpoint 2: /api/intent/parse
# ══════════════════════════════════════════════════════════════════════

@app.post("/api/intent/parse", response_model=IntentParseResponse)
async def intent_parse(req: IntentParseRequest):
    """
    Parse user text → full intent vector (no realities).
    """
    try:
        result = await run_query_plan(req.input_text, req.session_id)
        return IntentParseResponse(intent=result["intent"])
    except Exception as e:
        log.exception("intent/parse failed")
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════
# Endpoint 3: /api/reality/generate
# ══════════════════════════════════════════════════════════════════════

@app.post("/api/reality/generate", response_model=RealityGenerateResponse)
async def reality_generate(req: RealityGenerateRequest):
    """
    Given an intent + flight results → realities.
    Typically called by the backend after Skyscanner search completes.
    """
    try:
        intent = IntentVector.model_validate(req.intent)
        from ai.agents.scenario_agent import generate_realities
        from ai.agents.critic_agent import critique_realities
        from ai.agents.explanation_agent import explain_realities

        fallback_used = len(req.flight_results) == 0
        if fallback_used:
            from ai.fallback import get_fallback_flights
            flights = get_fallback_flights()
        else:
            flights = req.flight_results

        realities = await generate_realities(intent, flights, fallback_used)
        realities = await critique_realities(realities, intent)
        realities = await explain_realities(realities, intent)

        return RealityGenerateResponse(realities=realities)
    except Exception as e:
        log.exception("reality/generate failed")
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════
# Endpoint 4: /api/reality/reflect
# ══════════════════════════════════════════════════════════════════════

@app.post("/api/reality/reflect", response_model=ReflectResponse)
async def reality_reflect(req: ReflectRequest):
    """
    User feedback → updated intent + revised realities.
    """
    try:
        result = await run_reflection(
            session_id=req.session_id,
            user_feedback=req.user_feedback,
            selected_reality_id=req.selected_reality_id,
        )
        return ReflectResponse(
            updated_intent=result.updated_intent,
            updated_realities=result.updated_realities,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        log.exception("reality/reflect failed")
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════
# Convenience: /api/pipeline  (one call does everything)
# ══════════════════════════════════════════════════════════════════════

@app.post("/api/pipeline", response_model=PipelineResponse)
async def pipeline(req: PipelineRequest):
    """
    Full flow in one call:
      user text → intent + query_plan + realities.

    If flight_results are provided, uses them.
    Otherwise uses fallback flights for demo stability.
    """
    try:
        result = await run_pipeline(
            user_text=req.input_text,
            flight_results=req.flight_results if req.flight_results else None,
            session_id=req.session_id,
        )
        return PipelineResponse(
            intent=result["intent"],
            query_plan=result["query_plan"],
            realities=result["realities"],
            session_id=result["session_id"],
        )
    except Exception as e:
        log.exception("pipeline failed")
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════
# Run directly
# ══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    from backend.ai.config import SERVER_PORT
    uvicorn.run(app, host="0.0.0.0", port=SERVER_PORT)
