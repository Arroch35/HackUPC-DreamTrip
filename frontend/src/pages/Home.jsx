import React, { useState, useCallback } from 'react';
import { Box, Button, ButtonGroup, Container, Typography, useTheme } from '@mui/material';
import HeroInput from '../components/HeroInput';
import LoadingState from '../components/LoadingState';
import ResultsSection from '../components/ResultsSection';
import RefinementChips from '../components/RefinementChips';

const previewResults = [
  {
    name: 'Lauterbrunnen',
    country: 'Switzerland',
    description:
      'A valley of dramatic cliffs and waterfalls with quiet alpine villages. Ideal for peaceful hikes, mountain views, and fresh air away from heavy crowds.',
    tags: ['alpine', 'waterfalls', 'quiet', 'nature'],
    image:
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Azores',
    country: 'Portugal',
    description:
      'Volcanic islands with crater lakes, thermal springs, and lush green viewpoints. Great for calm outdoor days with a premium nature-forward vibe.',
    tags: ['islands', 'thermal', 'green', 'scenic'],
    image:
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Kotor Bay',
    country: 'Montenegro',
    description:
      'A serene coastal bay wrapped by mountains and old stone towns. You get calm waterfront moments with rich atmosphere and elegant views.',
    tags: ['coastal', 'historic', 'mountains', 'calm'],
    image:
      'https://images.unsplash.com/photo-1520958978572-3fc8f9f8a169?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Nikko',
    country: 'Japan',
    description:
      'Cedar forests, peaceful shrines, and lake landscapes with balanced culture and nature. A refined, tranquil destination for slower travel.',
    tags: ['forest', 'temples', 'lake', 'tranquil'],
    image:
      'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Snaefellsnes',
    country: 'Iceland',
    description:
      'Rugged coastlines, black-sand beaches, and lava fields in one compact peninsula. Perfect if you want moody nature and open space.',
    tags: ['dramatic', 'coast', 'volcanic', 'open-space'],
    image:
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
  },
];

const previewTags = ['peaceful', 'nature', 'less crowded', 'premium'];

const Home = () => {
  const theme = useTheme();
  const [state, setState] = useState('results'); // 'hero', 'loading', 'results'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(previewResults);
  const [interpretedTags, setInterpretedTags] = useState(previewTags);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputSubmit = useCallback(async (inputQuery) => {
    setQuery(inputQuery);
    setState('loading');
    setIsLoading(true);

    try {
      // Make API call to backend
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();

      // Simulate delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setInterpretedTags(data.interpreted || []);
      setResults(data.results || []);
      setState('results');
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Handle error state - you might want to add an error state later
      setState('hero');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setState('hero');
    setQuery('');
    setResults(previewResults);
    setInterpretedTags(previewTags);
    setIsLoading(false);
  }, []);

  const handleRefine = useCallback((refinements) => {
    // This will be used to refine results
    // For now, it's just a placeholder for future enhancement
    console.log('Refining with:', refinements);
  }, []);

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="lg" sx={{ pt: 3, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
            UI Preview Mode
          </Typography>
          <ButtonGroup variant="outlined" size="small" aria-label="preview states">
            <Button onClick={() => setState('hero')}>Hero</Button>
            <Button onClick={() => setState('loading')}>Loading</Button>
            <Button onClick={() => setState('results')}>Results</Button>
          </ButtonGroup>
        </Box>
      </Container>

      {/* Hero Input State */}
      {state === 'hero' && (
        <HeroInput onSubmit={handleInputSubmit} isLoading={isLoading} />
      )}

      {/* Loading State */}
      {state === 'loading' && <LoadingState query={query} />}

      {/* Results State */}
      {state === 'results' && (
        <>
          <ResultsSection
            query={query || 'I want a peaceful place near nature, not too touristy'}
            results={results}
            interpretedTags={interpretedTags}
            onReset={handleReset}
            onRefine={handleRefine}
          />
          <RefinementChips onRefine={handleRefine} disabled={isLoading} />
        </>
      )}
    </Box>
  );
};

export default Home;
