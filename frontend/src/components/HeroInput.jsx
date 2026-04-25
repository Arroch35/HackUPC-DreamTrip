import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import { Mic } from '@mui/icons-material';

const HeroInput = ({ onSubmit, isLoading, query, setQuery }) => {
  // DELETE THIS LINE: const [query, setQuery] = useState(''); 
  const theme = useTheme();

  const handleInputChange = (e) => {
    setQuery(e.target.value); // This now updates the state in Home.jsx
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // You don't even need to pass query here if handleSubmit 
      // in Home already uses the parent state, but it's fine as is.
      onSubmit(query); 
    }
  };

  return (
    <Box
      sx={{
        background: theme.customStyles.gradients.sky,
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(96, 165, 250, 0.1)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Heading */}
        <Typography
          variant="h1"
          sx={{
            mb: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'fadeIn 0.8s ease-in',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          DreamTrip
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mb: 4,
            textAlign: 'center',
            color: '#0f172a',
            fontWeight: 500,
            animation: 'fadeIn 0.8s ease-in 0.1s both',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          Discover destinations that match your vibe
        </Typography>

        {/* Input Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mt: 6,
            animation: 'slideUp 0.8s ease-out 0.2s both',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(40px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <TextField
            fullWidth
            placeholder="e.g., 'Peaceful place near nature, not too touristy'"
            value={query}
            onChange={handleInputChange}
            disabled={isLoading}
            variant="outlined"
            size="large"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                fontSize: '1rem',
                height: '56px',
              },
              '& .MuiOutlinedInput-input::placeholder': {
                color: '#94a3b8',
                opacity: 1,
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading || !query.trim()}
            sx={{
              borderRadius: '16px',
              px: 4,
              py: 1.75,
              whiteSpace: 'nowrap',
              minWidth: { xs: '100%', sm: '200px' },
            }}
          >
            Find my destination
          </Button>
        </Box>

        {/* Microphone hint */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mt: 4,
            color: '#64748b',
            fontSize: '0.875rem',
          }}
        >
          <Mic sx={{ fontSize: '18px', opacity: 0.6 }} />
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Describe your ideal travel experience
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroInput;
