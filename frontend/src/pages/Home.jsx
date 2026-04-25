import { useState } from "react";
import HeroInput from "./components/HeroInput";
import LoadingState from "./components/LoadingState";
import ResultsSection from "./components/ResultsSection";

function Home() {
  // ------------------------
  // State Management
  // ------------------------
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [interpreted, setInterpreted] = useState([]);
  const [error, setError] = useState(null);

  // ------------------------
  // API Call
  // ------------------------
  const fetchRecommendations = async (userQuery) => {
    if (!userQuery) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "Homelication/json",
        },
        body: JSON.stringify({ query: userQuery }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();

      setResults(data.results || []);
      setInterpreted(data.interpreted || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Handlers
  // ------------------------
  const handleSubmit = () => {
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
  // Render Logic (3 States)
  // ------------------------

  // 1. Loading State
  if (loading) {
    return <LoadingState />;
  }

  // 2. Results State
  if (results.length > 0) {
    return (
      <ResultsSection
        query={query}
        results={results}
        interpreted={interpreted}
        onRefine={handleRefine}
        onReset={handleReset}
      />
    );
  }

  // 3. Hero State (default)
  return (
    <HeroInput
      query={query}
      setQuery={setQuery}
      onSubmit={handleSubmit}
      error={error}
    />
  );
}

export default Home;