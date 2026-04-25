import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { TravelExplore } from '@mui/icons-material';

const Header = ({ items, activeKey, onNavigate }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.3)',
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
            onClick={() => onNavigate('home')}
          >
            <Box
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TravelExplore sx={{ color: '#ffffff', fontSize: '24px' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.25rem',
              }}
            >
              DreamTrip
            </Typography>
          </Box>

          {/* Navigation Items */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
            }}
          >
            {items.map((item) => (
              <Box
                key={item.key}
                onClick={() => onNavigate(item.key)}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: activeKey === item.key
                    ? 'rgba(37, 99, 235, 0.08)'
                    : 'transparent',
                  color: activeKey === item.key ? '#2563eb' : '#64748b',
                  fontWeight: activeKey === item.key ? 600 : 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    color: '#2563eb',
                  },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Header;
