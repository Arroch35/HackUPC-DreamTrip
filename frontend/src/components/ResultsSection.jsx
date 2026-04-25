import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import { RotateLeft } from '@mui/icons-material';
import DestinationCard from './DestinationCard';

const ResultsSection = ({ query, results, interpretedTags, onRefine, onReset }) => {
  const theme = useTheme();

  if (!results || results.length === 0) {
    return null;
  }

  const featuredResult = results[0];
  const secondaryResults = results.slice(1, 5);

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6, animation: 'slideUp 0.6s ease-out' }}>
          {/* Main Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Box
              sx={{
                width: '6px',
                height: '32px',
                borderRadius: '3px',
                background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Places that match your vibe
            </Typography>
          </Box>

          {/* Original Query */}
          <Box sx={{ ml: 6, mb: 3 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                fontStyle: 'italic',
              }}
            >
              Your search: <strong>"{query}"</strong>
            </Typography>
          </Box>

          {/* Interpreted Tags */}
          {interpretedTags && interpretedTags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, ml: 6 }}>
              {interpretedTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  sx={{
                    borderColor: '#2563eb',
                    color: '#2563eb',
                    fontWeight: 600,
                    height: '36px',
                    borderRadius: '18px',
                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                    '@keyframes slideIn': {
                      from: {
                        opacity: 0,
                        transform: 'translateX(-20px)',
                      },
                      to: {
                        opacity: 1,
                        transform: 'translateX(0)',
                      },
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Featured Top Match */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 820,
              animation: 'slideUp 0.6s ease-out 0.05s both',
            }}
          >
            <DestinationCard destination={featuredResult} variant="featured" />
          </Box>
        </Box>

        {/* Four Supporting Matches */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {secondaryResults.map((destination, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              key={index}
              sx={{
                animation: `slideUp 0.6s ease-out ${index * 0.1 + 0.15}s both`,
                '@keyframes slideUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(24px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <DestinationCard destination={destination} />
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
            animation: 'slideUp 0.6s ease-out 0.5s both',
            '@keyframes slideUp': {
              from: {
                opacity: 0,
                transform: 'translateY(40px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Button
            variant="contained"
            onClick={onReset}
            startIcon={<RotateLeft />}
            sx={{
              borderRadius: '16px',
              px: 4,
              py: 1.75,
            }}
          >
            Search again
          </Button>
        </Box>

        {/* Refinement Hint */}
        <Box
          sx={{
            textAlign: 'center',
            mt: 6,
            pt: 6,
            borderTop: '1px solid rgba(226, 232, 240, 0.5)',
            animation: 'fadeIn 0.8s ease-in 0.6s both',
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
            }}
          >
            Not quite what you're looking for? Try refining your search or describe a different feeling.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ResultsSection;
