import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import logoSvg from '../assets/logo.svg';
import logoPng from '../assets/logo.png';

const Navbar = () => {
  const [logoError, setLogoError] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const logoSources = [logoSvg, logoPng];
  const logoSrc = logoSources[logoIndex];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
        py: { xs: 1, sm: 1.5 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {!logoError ? (
              <Box
                component="img"
                src={logoSrc}
                alt="DreamTrip logo"
                onError={() => {
                  if (logoIndex < logoSources.length - 1) {
                    setLogoIndex((prev) => prev + 1);
                    return;
                  }
                  console.warn('Logo failed to load, using fallback.');
                  setLogoError(true);
                }}
                sx={{
                  maxHeight: { xs: 35, md: 45 },
                  width: 'auto',
                  backgroundColor: 'transparent',
                  mixBlendMode: 'multiply',
                  filter: 'drop-shadow(0 6px 16px rgba(15, 23, 42, 0.12))',
                }}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FlightTakeoff sx={{ color: '#2563eb' }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#0f172a',
                    fontFamily: '"Poppins", "Inter", sans-serif',
                  }}
                >
                  DreamTrip
                </Typography>
              </Box>
            )}
          </Box>

        </Box>
      </Container>
    </AppBar>
  );
};

export default Navbar;
