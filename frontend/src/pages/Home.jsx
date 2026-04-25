import { useState } from "react";
import HeroInput from "../components/HeroInput";
import LoadingState from "../components/LoadingState";
import ResultsSection from "../components/ResultsSection";

function Home() {
  console.log("HOME MOUNT");

  // ------------------------
  // State Management
  // ------------------------
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [interpreted, setInterpreted] = useState([]);
  const [error, setError] = useState(null);

  console.log("STATE:", { loading, results, interpreted });

  // ------------------------
  // API Call (REAL BACKEND)
  // ------------------------
  const fetchRecommendations = async (userQuery) => {
    if (!userQuery) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userQuery,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await res.json();

      setResults(data.results || []);
      setInterpreted(data.interpreted || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setResults([]);
      setInterpreted([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Handlers
  // ------------------------
  const handleSubmit = () => {
    console.log("SUBMIT CLICKED");
    fetchRecommendations(query);
  };

  const handleRefine = (newQuery) => {
    setQuery(newQuery);
    fetchRecommendations(newQuery);
  };

  const handleReset = () => {
    setQuery("");
    setResults([]);
    setInterpreted([]);
    setError(null);
  };

  // ------------------------
  // Render Logic
  // ------------------------

  return (
    <>
      {loading && <LoadingState query={query} />}

      {!loading && results.length === 0 && (
        <HeroInput
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          isLoading={loading}
          error={error}
        />
      )}

      {!loading && results.length > 0 && (
        <ResultsSection
          query={query}
          results={results}
          interpretedTags={interpreted}
          onRefine={handleRefine}
          onReset={handleReset}
        />
      )}
    </>
  );
}

export default Home;