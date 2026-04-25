import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
  useTheme,
} from '@mui/material';

const SkeletonCard = ({ featured = false }) => {
  return (
    <Card
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        '@keyframes pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{
          aspectRatio: featured ? '16 / 9' : '4 / 3',
          height: 'auto',
          backgroundColor: '#e2e8f0',
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 3 }} />
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="95%" height={16} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width={60} height={28} />
          <Skeleton variant="rounded" width={60} height={28} />
          <Skeleton variant="rounded" width={60} height={28} />
        </Box>
      </CardContent>
    </Card>
  );
};

const LoadingState = ({ query }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 1120, mx: 'auto' }}>
        {/* Loading Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#0f172a',
              fontWeight: 600,
              mb: 1,
              animation: 'fadeIn 0.8s ease-in',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          >
            Finding destinations that match your vibe...
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              animation: 'fadeIn 0.8s ease-in 0.2s both',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          >
            {query && `Searching for: "${query}"`}
          </Typography>
        </Box>

        {/* Featured Skeleton */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 780 }}>
            <SkeletonCard featured />
          </Box>
        </Box>

        {/* Row 2: Two Supporting Skeletons */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[1, 2].map((index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={`row-two-${index}`}>
              <Box
                sx={{
                  animation: 'slideUp 0.6s ease-out',
                  animationDelay: `${index * 0.08}s`,
                  animationFillMode: 'both',
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
                <SkeletonCard />
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Row 3: Two More Supporting Skeletons */}
        <Grid container spacing={3}>
          {[1, 2].map((index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={`row-three-${index}`}>
              <Box
                sx={{
                  animation: 'slideUp 0.6s ease-out',
                  animationDelay: `${index * 0.08 + 0.16}s`,
                  animationFillMode: 'both',
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
                <SkeletonCard />
              </Box>
            </Grid>
          ))}
        </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LoadingState;
