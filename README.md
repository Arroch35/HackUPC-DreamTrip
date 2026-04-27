# DreamTrip

DreamTrip is an AI-powered travel discovery app that turns vague emotions, constraints, and travel intent into personalized city recommendations, parallel trip realities, and decision-support planning.

It is designed to feel more like a travel mirror than a search engine: instead of asking users to define a destination, it helps them explore what kind of trip fits their mood, budget, and travel style.

---

## What it does

DreamTrip takes a user prompt like:

> “I feel burnt out and want somewhere quiet and sunny.”

and turns it into:

- a structured travel intent,
- a ranked set of destination cities,
- multiple parallel travel “realities,”
- and a narrated voice experience powered by ElevenLabs.

The system is built for quick demo flows, but the architecture is modular enough to evolve into a full travel planning product.

---

## Core features

- **Emotion-aware travel intent parsing**
- **Intent-to-city retrieval**
- **Segment-aware city ranking**
- **Clarification for vague prompts**
- **Parallel travel realities**
- **Structured decision support**
- **Text-to-speech narration with ElevenLabs**
- **Stable JSON contracts for frontend integration**
- **Fallback demo mode for offline or low-credit scenarios**

---

## Product pipeline

1. **Share your idea**  
   The user enters a vague, emotional, or situational travel prompt.

2. **AI understands**  
   The system extracts structured intent, constraints, preferences, and uncertainty.

3. **Explore options**  
   The retrieval layer returns diverse city options and the AI generates parallel travel realities.

4. **Choose & plan**  
   The system explains tradeoffs and helps the user steer toward a final choice.

---

## Tech stack

- **Frontend:** React / web UI
- **Backend:** FastAPI
- **LLM reasoning:** Gemini
- **Voice:** ElevenLabs Text-to-Speech
- **Data layer:** city feature schema, archetype weighting, retrieval scoring
- **Enrichment:** structured tourism data + optional multi-source city intelligence layer
- **Storage:** in-memory session state for hackathon speed

---

## Repository structure

```bash
HackUPC-Travel-Mirror/
├── ai/
│   ├── config.py
│   ├── server.py
│   ├── orchestrator.py
│   ├── retrieval.py
│   ├── prompt_repair.py
│   ├── archetypes.py
│   ├── city_features_expanded.py
│   ├── input_output_examples.json
│   ├── tests/
│   ├── voice_service.py
│   ├── voice_routes.py
│   └── ...
├── frontend/
│   └── ...
├── enrichment/
│   └── ...
├── README.md
└── ...
```

---

## AI layer

The AI layer is responsible for:
- parsing vague prompts,
- detecting traveler archetypes,
- building a structured intent vector,
- retrieving cities from the dataset,
- generating 3–5 parallel realities,
- and supporting reflection when the user changes direction.

It is intentionally split from the frontend so the UI can stay simple and the model logic can evolve independently.

---

## Voice layer

DreamTrip includes a lightweight ElevenLabs voice layer for narrating the AI output.

### Voice endpoint
- `POST /api/voice/speak`

### What it does
- Takes a text string from the AI response
- Converts it into natural-sounding speech
- Returns audio the frontend can play immediately

This is used to make the demo feel more immersive without requiring voice input or complex audio orchestration.

---

## API endpoints

### Health
- `GET /health`

### AI pipeline
- `POST /api/pipeline`

### Intent parsing
- `POST /api/intent/plan`
- `POST /api/intent/parse`

### Reality generation
- `POST /api/reality/generate`
- `POST /api/reality/reflect`

### Voice
- `GET /api/voice/status`
- `POST /api/voice/speak`

---

## Example usage

### Example prompt
```json
{
  "input_text": "I feel burnt out and want somewhere quiet and sunny",
  "flight_results": []
}
```

### Example result
- `intent`: structured user intent
- `query_plan`: what the system should search for
- `cities`: ranked destinations
- `realities`: different travel interpretations
- `fallback_used`: true when demo data is used

---

## Setup

### Backend
```bash
cd ai
pip install -r requirements.txt
python -m uvicorn ai.server:app --host 0.0.0.0 --port 8000
```

### Environment variables
Create a `.env` file inside `ai/` and set the required keys.

Example:
```env
OPENAI_API_KEY=...
GOOGLE_API_KEY=...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
ELEVENLABS_MODEL_ID=...
SKYSCANNER_API_KEY=...
```

---

## Running locally

### Start the API
```bash
python -m uvicorn ai.server:app --port 8000
```

### Test the voice layer
```bash
Invoke-RestMethod -Uri "http://localhost:8000/api/voice/status" -Method GET
```

### Generate audio
```bash
Invoke-WebRequest -Uri "http://localhost:8000/api/voice/speak" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"text":"Welcome to DreamTrip."}' `
  -OutFile "output.mp3"
```

---

## Demo story

DreamTrip helps users discover travel by emotion, not just by destination.

Instead of asking “Where do you want to go?”, it helps answer:
- “What kind of trip fits how you feel?”
- “Which cities match this mood?”
- “What tradeoffs matter most?”
- “Which reality should you choose?”

The system combines structured city data, intent-aware ranking, parallel realities, and voice narration into one smooth experience.

---

## Current status

- AI retrieval pipeline: done
- Clarification / prompt repair: done
- Voice narration: done
- Frontend integration: in progress
- Multi-source enrichment: in progress
- Final polishing for demo: in progress

---

## Team notes

This project was built for HackUPC with a focus on:
- strong product idea,
- visual clarity,
- interactive demo flow,
- and a clear bridge between emotional travel intent and structured planning.

---

## License

For hackathon/demo use only unless otherwise specified.

---
## Credits

Built by the DreamTrip team for HackUPC.
