import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  LinearProgress,
  useTheme,
} from '@mui/material';

const clampSimilarity = (value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return 0;
  return Math.max(0, Math.min(100, numericValue));
};

const getSimilarityColor = (similarity, theme) => {
  if (similarity > 80) return theme.palette.success.main;
  if (similarity >= 60) return theme.palette.warning.main;
  return theme.palette.error.main;
};

const normalizeResults = (results = []) =>
  results.map((item, index) => ({
    id: item.id ?? index,
    title: item.title ?? item.name ?? 'Destination',
    similarity:
      typeof item.similarity === 'number'
        ? item.similarity
        : Math.max(50, 95 - index * 8),
    summary: item.summary ?? item.description ?? 'No summary available yet.',
      image: item.image ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  }));

const SimilarityRankedCards = ({ results = [], onViewDetails }) => {
  const theme = useTheme();

  const sortedResults = useMemo(() => {
    const normalized = normalizeResults(results);
    return normalized
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        similarity: clampSimilarity(item.similarity),
      }));
  }, [results]);

  if (!sortedResults.length) {
    return null;
  }

  const topCard = sortedResults[0];
  const remainingCards = sortedResults.slice(1, 5);

  const renderCard = (item, rank, isTop = false) => {
    const similarityColor = getSimilarityColor(item.similarity, theme);

    return (
      <Card
        component="article"
        elevation={isTop ? 5 : 2}
        sx={{
          width: '100%',
          borderRadius: 3,
          border: isTop
            ? `1px solid ${theme.palette.primary.light}`
            : `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          image={item.image}
          alt={item.title}
          sx={{
            width: '100%',
            aspectRatio: isTop ? '16 / 9' : '4 / 3',
            objectFit: 'cover',
          }}
        />

        <CardContent>
          <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
            Rank #{rank}
          </Typography>

          <Typography
            component="h3"
            variant={isTop ? 'h5' : 'h6'}
            sx={{ mb: 1, color: theme.palette.text.primary }}
          >
            {item.title}
          </Typography>

          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: similarityColor,
                fontWeight: 700,
                mb: 0.75,
              }}
            >
              Similarity: {Math.round(item.similarity)}%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={item.similarity}
              aria-label={`Similarity score ${Math.round(item.similarity)} percent for ${item.title}`}
              sx={{
                height: 8,
                borderRadius: 999,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: similarityColor,
                },
              }}
            />
          </Box>

          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {item.summary}
          </Typography>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant={isTop ? 'contained' : 'outlined'}
            aria-label={`View details for ${item.title}`}
            onClick={() => onViewDetails?.(item)}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ maxWidth: 1120, mx: 'auto' }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 960 }}>
            {renderCard(topCard, 1, true)}
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {remainingCards.map((item, index) => (
          <Grid item xs={12} sm={6} md={6} key={item.id}>
            {renderCard(item, index + 2, false)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SimilarityRankedCards;
