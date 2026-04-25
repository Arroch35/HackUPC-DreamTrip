from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from  ai.voice_service import generate_speech

# ------------------------
# App
# ------------------------
app = FastAPI(
    title="DreamTrip API",
    root_path="/api"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Models
# ------------------------
class RecommendRequest(BaseModel):
    query: str


class Destination(BaseModel):
    name: str
    country: str
    description: str
    tags: List[str]
    image: str


class RecommendResponse(BaseModel):
    interpreted: List[str]
    results: List[Destination]


# ------------------------
# Fake logic (replace later with AI)
# ------------------------
def fake_ai(query: str):
    interpreted = ["peaceful", "nature"]

    results = [
        {
            "name": "Kyoto",
            "country": "Japan",
            "description": "Temples, bamboo forests, and peaceful gardens.",
            "tags": ["peaceful", "nature"],
            "image": "https://source.unsplash.com/800x600/?kyoto"
        },
        {
            "name": "Reykjavik",
            "country": "Iceland",
            "description": "Minimalist city surrounded by wild landscapes.",
            "tags": ["nature", "cold"],
            "image": "https://source.unsplash.com/800x600/?iceland"
        },
        {
            "name": "Hallstatt",
            "country": "Austria",
            "description": "Quiet lakeside village in the Alps.",
            "tags": ["peaceful", "nature"],
            "image": "https://source.unsplash.com/800x600/?lake"
        },
        {
            "name": "Madeira",
            "country": "Portugal",
            "description": "Lush island with cliffs and ocean views.",
            "tags": ["nature", "coastal"],
            "image": "https://source.unsplash.com/800x600/?madeira"
        },
        {
            "name": "Ubud",
            "country": "Indonesia",
            "description": "Spiritual jungle retreat with rice terraces.",
            "tags": ["peaceful", "nature"],
            "image": "https://source.unsplash.com/800x600/?ubud"
        }
    ]

    return interpreted, results


# ------------------------
# Endpoint
# ------------------------
@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    interpreted, results = fake_ai(req.query)
    #generate_speech(req.query)

    return {
        "interpreted": interpreted,
        "results": results
    }

@app.post("/recommend-audio")
async def recommend_audio(file: UploadFile = File(...)):
    print("🔥 AUDIO ENDPOINT HIT")

    try:
        audio_bytes = await file.read()
        print("📦 Received bytes:", len(audio_bytes))

        transcript = "nature peaceful place"

        interpreted, results = fake_ai(transcript)

        response = {
            "query": transcript,
            "interpreted": interpreted,
            "results": results
        }

        print("✅ RETURNING:", response)

        return response

    except Exception as e:
        print("❌ ERROR:", e)
        raise e

# ------------------------
# RUN SERVER (your requested style)
# ------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)