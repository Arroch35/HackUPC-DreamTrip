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
        height: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
        display: 'flex',
        flexDirection: featured ? { xs: 'column', sm: 'row' } : 'column',
        ...(featured && {
          minHeight: { sm: '400px' },
        }),
      }}
    >
      <Skeleton
        variant="rectangular"
        width={featured ? { xs: '100%', sm: '50%' } : '100%'}
        height={featured ? { xs: '280px', sm: 'auto' } : '180px'}
        sx={{
          ...(featured && {
            minHeight: { sm: '400px' },
          }),
          backgroundColor: '#e2e8f0',
        }}
      />
      <CardContent sx={{ p: featured ? { xs: 2.5, sm: 4 } : 2, width: featured ? { xs: '100%', sm: '50%' } : '100%' }}>
        <Skeleton variant="text" width="70%" height={featured ? 48 : 32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={featured ? 28 : 20} sx={{ mb: featured ? 2 : 1.5 }} />
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="95%" height={16} sx={{ mb: featured ? 2 : 1.5 }} />
        {featured && <Skeleton variant="text" width="90%" height={16} sx={{ mb: 2 }} />}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width={featured ? 80 : 60} height={featured ? 32 : 28} />
          <Skeleton variant="rounded" width={featured ? 80 : 60} height={featured ? 32 : 28} />
          <Skeleton variant="rounded" width={featured ? 80 : 60} height={featured ? 32 : 28} />
          {featured && <Skeleton variant="rounded" width={80} height={32} />}
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
          
          {/* Loading Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, lg: 3.5 } }}>
            <Box
              sx={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #60a5fa, #2563eb)',
                borderRadius: '2px',
                mx: 'auto',
                mb: 2,
              }}
            />
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
              Finding destinations that match your vibe...
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
              }}
            >
              {query && `Searching for: "${query}"`}
            </Typography>
          </Box>

          {/* Featured Skeleton - Larger like results page */}
          <Box sx={{ mb: { xs: 3, lg: 2 }, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', lg: 980 } }}>
              <SkeletonCard featured />
            </Box>
          </Box>

          {/* Row 2: Two Supporting Skeletons */}
          <Grid container spacing={{ xs: 2, lg: 1.5 }} sx={{ mb: { xs: 2, lg: 1.5 }, alignItems: 'stretch' }}>
            {[1, 2].map((index) => (
              <Grid size={{ xs: 12, sm: 6, md: 6 }} key={`row-two-${index}`} sx={{ display: 'flex' }}>
                <Box sx={{ width: '100%' }}>
                  <SkeletonCard />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Row 3: Two More Supporting Skeletons */}
          <Grid container spacing={{ xs: 2, lg: 1.5 }} sx={{ alignItems: 'stretch' }}>
            {[1, 2].map((index) => (
              <Grid size={{ xs: 12, sm: 6, md: 6 }} key={`row-three-${index}`} sx={{ display: 'flex' }}>
                <Box sx={{ width: '100%' }}>
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