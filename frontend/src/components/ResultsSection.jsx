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
  const firstPair = results.slice(1, 3);
  const secondPair = results.slice(3, 5);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-30%',
          left: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(96, 165, 250, 0.08)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-30%',
          right: '-20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.06)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: { xs: '100%', lg: '100%' }, mx: 'auto' }}>
          
          {/* Header Section */}
          <Box 
            sx={{ 
              mb: { xs: 4, lg: 3.5 }, 
              animation: 'fadeInDown 0.8s ease-out', 
              textAlign: 'center',
              '@keyframes fadeInDown': {
                from: { opacity: 0, transform: 'translateY(-30px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            {/* Decorative gradient bar */}
            <Box
              sx={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #60a5fa, #2563eb)',
                borderRadius: '2px',
                mx: 'auto',
                mb: 2,
                animation: 'expandWidth 0.8s ease-out',
                '@keyframes expandWidth': {
                  from: { width: 0, opacity: 0 },
                  to: { width: 80, opacity: 1 },
                },
              }}
            />
            
            {/* Main Title */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1.5,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              }}
            >
              Places that match your vibe
            </Typography>

            {/* Original Query Tag */}
            <Box sx={{ mb: 2.5 }}>
              <Chip
                label={`${query}`}
                sx={{
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  height: '40px',
                  borderRadius: '20px',
                }}
              />
            </Box>

            {/* Interpreted Tags */}
            {interpretedTags && interpretedTags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
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
                      backgroundColor: 'rgba(37, 99, 235, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Featured Top Match - NOW LARGER */}
          <Box 
            sx={{ 
              mb: { xs: 3, lg: 2 }, 
              display: 'flex', 
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', lg: 980 },  // CHANGED: 780 → 980 (25% larger)
              }}
            >
              <DestinationCard destination={featuredResult} variant="featured" />
            </Box>
          </Box>

          {/* Row 2: Two Supporting Matches (keep smaller) */}
          <Grid 
            container 
            spacing={{ xs: 2, lg: 1.5 }} 
            sx={{ 
              mb: { xs: 2, lg: 1.5 }, 
              alignItems: 'stretch', 
              justifyContent: 'center'
            }}
          >
            {firstPair.map((destination, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 6 }}
                key={`pair-one-${index}`}
                sx={{ display: 'flex' }}
              >
                <DestinationCard destination={destination} />
              </Grid>
            ))}
          </Grid>

          {/* Row 3: Two More Supporting Matches (keep smaller) */}
          <Grid 
            container 
            spacing={{ xs: 2, lg: 1.5 }} 
            sx={{ 
              mb: { xs: 4, lg: 3.5 }, 
              alignItems: 'stretch', 
              justifyContent: 'center'
            }}
          >
            {secondPair.map((destination, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 6 }}
                key={`pair-two-${index}`}
                sx={{ display: 'flex' }}
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
            }}
          >
            <Button
              variant="contained"
              onClick={onReset}
              startIcon={<RotateLeft />}
              sx={{
                borderRadius: '40px',
                px: 5,
                py: 1.5,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 28px rgba(37, 99, 235, 0.4)',
                },
              }}
            >
              Search again
            </Button>
          </Box>

          {/* Refinement Hint */}
          <Box
            sx={{
              textAlign: 'center',
              mt: { xs: 5, lg: 4 },
              pt: { xs: 4, lg: 3 },
              borderTop: '1px solid rgba(37, 99, 235, 0.15)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              Not quite what you're looking for? Try refining your search or describe a different feeling.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ResultsSection;