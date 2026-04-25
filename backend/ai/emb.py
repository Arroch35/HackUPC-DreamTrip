
import json
import numpy as np
from sentence_transformers import SentenceTransformer


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
def search_top_k(query_emb, embeddings, metadata, k=5):
    # cosine similarity via dot product (since normalized)
    scores = np.dot(embeddings, query_emb)

    # top-k indices
    top_k_idx = np.argsort(scores)[-k:][::-1]

    results = []
    for idx in top_k_idx:
        results.append({
            "city": metadata[idx]["city"],
            "country": metadata[idx]["country"],
            "iata": metadata[idx]["iata"],
            "key_features": metadata[idx]["key_features"],
            "score": float(scores[idx])
        })

    return results


# -------- MAIN FUNCTION --------
def query_system(model, embeddings, metadata, sentences, k=5):
    query_emb = compute_query_embedding(model, sentences)
    results = search_top_k(query_emb, embeddings, metadata, k)
    return results

if __name__ == "__main__":
    model = load_model()
    metadata, embeddings = load_data("city_embeddings.json", "city_embeddings.npy")

    user_query = ["The destination should have a city vibes.", "The destination should have a beach.", "The destination should have historic sites.", "The destination should have good food.", "The destination should have active nightlife."]

    import time
    start_time = time.time()
    results = query_system(model, embeddings, metadata, user_query, k=5)
    end_time = time.time()
    print(f"Query time: {end_time - start_time:.4f} seconds")

    print("Top results:")
    for res in results:
        print(res)