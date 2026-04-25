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
  // API Call
  // ------------------------
const fetchRecommendations = async (userQuery) => {
  if (!userQuery) return;

  setLoading(true);
  setError(null);

  try {
    // simulate backend delay + processing time
    await new Promise((r) => setTimeout(r, 5000));

    // fake backend response
    const mockData = {
      interpreted: ["peaceful", "nature"],
      results: [
        {
          name: "Kyoto",
          country: "Japan",
          description: "Temples, bamboo forests, and peaceful gardens.",
          tags: ["peaceful", "nature"],
          image: "https://source.unsplash.com/800x600/?kyoto"
        },
        {
          name: "Reykjavik",
          country: "Iceland",
          description: "Minimalist city surrounded by wild landscapes.",
          tags: ["nature", "cold"],
          image: "https://source.unsplash.com/800x600/?iceland"
        },
        {
          name: "Hallstatt",
          country: "Austria",
          description: "Quiet lakeside village in the Alps.",
          tags: ["peaceful", "nature"],
          image: "https://source.unsplash.com/800x600/?austria,lake"
        },
        {
          name: "Madeira",
          country: "Portugal",
          description: "Lush island with cliffs and ocean views.",
          tags: ["nature", "coastal"],
          image: "https://source.unsplash.com/800x600/?madeira"
        },
        {
          name: "Ubud",
          country: "Indonesia",
          description: "Spiritual jungle retreat with rice terraces.",
          tags: ["peaceful", "nature"],
          image: "https://source.unsplash.com/800x600/?ubud"
        }
      ]
    };

    setResults(mockData.results);
    setInterpreted(mockData.interpreted);
  } catch (err) {
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
     console.log("SUBMIT CLICKED");
     console.log("HOME FILE:", import.meta.url);
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