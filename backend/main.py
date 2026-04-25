from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from  ai.voice_service import generate_speech

from ai.emb import load_model, load_data, query_system

import os
from dotenv import load_dotenv
from google import genai
import json

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
    model = load_model()
    metadata, embeddings = load_data("city_embeddings.json", "city_embeddings.npy")
    # interpreted = ["peaceful", "nature"]
    user_query = query

    # Load env
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")

    client = genai.Client(api_key=api_key)

    # Load prompts
    with open("prompts.json", "r") as f:
        prompts = json.load(f)

    base_prompt = prompts["travel_intent_parser"]

    # Combine prompt + user input
    final_prompt = base_prompt + "\nUser: " + user_query

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=final_prompt
    )

    output_text = response.text.strip()["sentences"]

    results = query_system(model, embeddings, metadata, output_text, k=5)

    return results


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