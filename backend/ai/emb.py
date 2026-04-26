
import json
import numpy as np
from sentence_transformers import SentenceTransformer
import os
import re


BASE_BACKEND_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
IMAGES_DIR = os.path.join(BASE_BACKEND_DIR, "images")
CITY_IMAGE_OVERRIDES = {
    "bordeaux": "boardeaux",
}


def normalize_city_slug(city):
    slug = (city or "").strip().lower()
    slug = slug.replace("-", "_").replace(" ", "_")
    slug = re.sub(r"[^a-z0-9_]", "", slug)
    return slug


def get_city_image_url(city):
    slug = normalize_city_slug(city)
    if not slug:
        return None

    candidates = [slug]
    if slug in CITY_IMAGE_OVERRIDES:
        candidates.insert(0, CITY_IMAGE_OVERRIDES[slug])

    for candidate in candidates:
        for ext in (".jpeg", ".jpg", ".png", ".webp"):
            filename = f"{candidate}{ext}"
            if os.path.exists(os.path.join(IMAGES_DIR, filename)):
                return f"http://localhost:8000/api/images/{filename}"

    return None


# -------- LOAD MODEL --------
def load_model():
    model = SentenceTransformer("intfloat/e5-base-v2", device="cpu")
    return model


# -------- LOAD DATA --------
def load_data(json_file, npy_file):
    # Load metadata (city names)
    with open(json_file, "r") as f:
        metadata = json.load(f)

    # Load embeddings (fast)
    embeddings = np.load(npy_file)

    return metadata, embeddings


# -------- QUERY EMBEDDING --------
def compute_query_embedding(model, sentences):
    if isinstance(sentences, str):
        sentences = [sentences]


    if not sentences:
        raise ValueError("No sentences provided for embedding")
    
    # E5 format
    sentences = [f"query: {s}" for s in sentences]

    emb = model.encode(
        sentences,
        normalize_embeddings=True,
        show_progress_bar=False
    )

    # average
    emb = np.mean(emb, axis=0)

    # normalize again
    emb = emb / np.linalg.norm(emb)

    return emb


# -------- SEARCH --------
# def search_top_k(query_emb, embeddings, metadata, k=5):
#     # cosine similarity via dot product (since normalized)
#     scores = np.dot(embeddings, query_emb)

#     print(f"Scores shape: {scores.shape}")

#     # top-k indices
#     # top_k_idx = np.argsort(scores)[-k:][::-1]
#     top_k_idx = np.argsort(scores).ravel()[-k:][::-1]

#     results = []
#     print(f"Length of Metadata is {len(metadata)}")
#     print(f"top_k_idx: {top_k_idx}")
#     # print(f"First item of metadata: {metadata[0]}")

#     for idx in top_k_idx:
#         idx = int(idx)
#         print(f"Processing idx: {idx}, type of idx: {type(idx)}")
#         results.append({
#             "city": metadata[idx]["city"],
#             "country": metadata[idx]["country"],
#             "iata": metadata[idx]["iata"],
#             "key_features": metadata[idx]["key_features"],
#             "score": float(scores[idx])
#         })

#     return results

# import numpy as np



def search_top_k(query_emb, embeddings, metadata, k=5):
    query_emb = np.asarray(query_emb)
    embeddings = np.asarray(embeddings)

    print("Embeddings shape:", embeddings.shape)
    print("Query shape:", query_emb.shape)
    print("Metadata length:", len(metadata))
    # Ensure correct shape
    embeddings = embeddings.reshape(len(metadata), -1)

    scores = np.dot(embeddings, query_emb).flatten()

    k = min(k, len(scores))

    # SAFE top-k
    top_k_idx = np.argsort(scores)[-k:][::-1]

    results = []

    for idx in top_k_idx:
        idx = int(idx)

        if idx >= len(metadata):
            continue  # safety guard

        item = metadata[idx]

        results.append({
            "city": item.get("city"),
            "country": item.get("country"),
            "iata": item.get("iata"),
            "key_features": item.get("key_features", []),
            "score": float(scores[idx]),
            "image": get_city_image_url(item.get("city"))
        })

    print(f"results: {results}")
    return results





# -------- MAIN FUNCTION --------
def query_system(model, embeddings, metadata, sentences, k=5):
    query_emb = compute_query_embedding(model, sentences)
    results = search_top_k(query_emb, embeddings, metadata, k)
    return results

if __name__ == "__main__":
    model = load_model()

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(BASE_DIR, "city_embeddings.json")
    npy_path = os.path.join(BASE_DIR, "city_embeddings.npy")
    metadata, embeddings = load_data(json_path, npy_path)

    user_query = ["The destination should have a city vibes.", "The destination should have a beach.", "The destination should have historic sites.", "The destination should have good food.", "The destination should have active nightlife."]

    import time
    start_time = time.time()
    results = query_system(model, embeddings, metadata, user_query, k=5)
    end_time = time.time()
    print(f"Query time: {end_time - start_time:.4f} seconds")

    print("Top results:")
    for res in results:
        print(res)