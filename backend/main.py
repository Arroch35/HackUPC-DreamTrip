from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from  ai.voice_service import transcribe_speech

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

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(BASE_DIR, "images")

app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")
app.mount("/api/images", StaticFiles(directory=IMAGES_DIR), name="api-images")


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


# class Destination(BaseModel):
#     name: str
#     country: str
#     description: str
#     tags: List[str]
#     image: str

class Destination(BaseModel):
    city: str
    country: str
    iata: str
    key_features: List[str]
    score: float
    image: Optional[str] = None


class RecommendResponse(BaseModel):
    interpreted: List[str]
    results: List[Destination]


class AudioRecommendResponse(BaseModel):
    query: str
    interpreted: List[str]
    results: List[Destination]


# ------------------------
# Fake logic (replace later with AI)
# ------------------------
# def fake_ai(query: str):
#     model = load_model()

#     # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#     # json_path = os.path.join(BASE_DIR, "city_embeddings.json")
#     # npy_path = os.path.join(BASE_DIR, "city_embeddings.npy")

#     metadata, embeddings = load_data("ai/city_embeddings.json", "ai/city_embeddings.npy")
#     # interpreted = ["peaceful", "nature"]
#     # print(f"Type of Metadata in fake_ai is: {type(metadata)}")
#     # print(f"Metadata in main is: {metadata}")
#     user_query = query

#     # Load env
#     load_dotenv()
#     api_key = os.getenv("GOOGLE_API_KEY")

#     client = genai.Client(api_key=api_key)

#     # Load prompts
#     with open("ai/prompts.json", "r") as f:
#         prompts = json.load(f)

#     base_prompt = prompts["travel_intent_parser"]

#     # Combine prompt + user input
#     final_prompt = base_prompt + "\nUser: " + user_query

#     print(f"Final prompt sent to Gemini:\n{final_prompt}")

#     response = client.models.generate_content(
#         model="gemini-2.5-flash",
#         contents=final_prompt
#     )

#     output_text = response.text.strip()

#     # print("RAW OUTPUT:\n", output_text)
#     # print(f"type of output_text: {type(output_text)}")
#     output_text = json.loads(output_text)
#     print(f"Parsed output_text: {output_text}")
#     output_text = output_text["sentences"]

#     print(f"Interpreted sentences: {output_text}")

#     results = query_system(model, embeddings, metadata, output_text, k=5)

#     return results

def fake_ai(query: str):
    try:
        model = load_model()
        metadata, embeddings = load_data("ai/city_embeddings.json", "ai/city_embeddings.npy")

        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        client = genai.Client(api_key=api_key)

        with open("ai/prompts.json", "r") as f:
            prompts = json.load(f)

        base_prompt = prompts["travel_intent_parser"]
        final_prompt = base_prompt + "\nUser: " + query

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=final_prompt
        )

        raw = response.text.strip()
        parsed = json.loads(raw)

        sentences = parsed.get("sentences", [])

        if not isinstance(sentences, list):
            sentences = [sentences]

        if len(sentences) == 0:
            sentences = [query]

        results = query_system(model, embeddings, metadata, sentences, k=5)

        # 🚨 ALWAYS RETURN VALID STRUCTURE
        return {
            "interpreted": sentences,
            "results": results if results is not None else []
        }

    except Exception as e:
        print("❌ fake_ai ERROR:", e)

        # 🚨 FAIL SAFE (CRITICAL)
        return {
            "interpreted": [query],
            "results": []
        }


# ------------------------
# Endpoint
# ------------------------
@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):

    # print(f"Received query: {req.query}")
    # results = fake_ai(req.query)

    # return {
    #     "results": results
    # }
    return fake_ai(req.query)

@app.post("/recommend-audio", response_model=AudioRecommendResponse)
async def recommend_audio(file: UploadFile = File(...)):
    print("🔥 AUDIO ENDPOINT HIT")
    try:
        audio_bytes = await file.read()
        print("📦 Received bytes:", len(audio_bytes))
        transcript = await transcribe_speech(
            audio_bytes,
            filename=file.filename or "audio.webm",
        )
        text = (transcript.get("text") or "").strip()

        if not text:
            return {
                "query": "",
                "interpreted": [],
                "results": [],
            }

        rec = fake_ai(text)
        response = {
            "query": text,
            "interpreted": rec.get("interpreted", []),
            "results": rec.get("results", []),
        }

        print("✅ RETURNING:", response)

        return response

    except Exception as e:
        print("❌ ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

# ------------------------
# RUN SERVER (your requested style)
# ------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)