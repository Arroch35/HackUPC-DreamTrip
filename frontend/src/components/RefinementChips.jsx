import React, { useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  Container,
  useTheme,
} from '@mui/material';
import {
  TravelExplore,
  TrendingUp,
  Air,
  DeviceThermostat,
  Groups,
  Visibility,
} from '@mui/icons-material';

const refinementOptions = [
  {
    label: 'More adventure',
    icon: TravelExplore,
    color: '#2563eb',
  },
  {
    label: 'Less crowded',
    icon: Groups,
    color: '#7c3aed',
  },
  {
    label: 'Warmer weather',
    icon: DeviceThermostat,
    color: '#dc2626',
  },
  {
    label: 'More scenic',
    icon: Visibility,
    color: '#0891b2',
  },
  {
    label: 'Budget-friendly',
    icon: TrendingUp,
    color: '#059669',
  },
  {
    label: 'Relaxing vibes',
    icon: Air,
    color: '#0284c7',
  },
];

const RefinementChips = ({ onRefine, disabled = false }) => {
  const theme = useTheme();
  const [selectedRefinements, setSelectedRefinements] = useState([]);

  const handleChipClick = (option) => {
    const isSelected = selectedRefinements.includes(option.label);
    const newSelection = isSelected
      ? selectedRefinements.filter((r) => r !== option.label)
      : [...selectedRefinements, option.label];

    setSelectedRefinements(newSelection);

    if (onRefine) {
      onRefine(newSelection);
    }
  };

  return (
    <Box
      sx={{
        py: 6,
        backgroundColor: '#ffffff',
        borderTop: '1px solid rgba(226, 232, 240, 0.5)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#0f172a',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          Refine your search
        </Typography>

        {/* Chips Grid */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {refinementOptions.map((option, index) => {
            const IconComponent = option.icon;
            const isSelected = selectedRefinements.includes(option.label);

            return (
              <Box
                key={index}
                onClick={() => !disabled && handleChipClick(option)}
                sx={{
                  animation: `slideIn 0.5s ease-out ${index * 0.05}s both`,
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
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 3,
                    py: 1.5,
                    borderRadius: '24px',
                    border: isSelected
                      ? `2px solid ${option.color}`
                      : '2px solid #e2e8f0',
                    backgroundColor: isSelected
                      ? `${option.color}14`
                      : '#f8fafc',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: disabled ? 0.5 : 1,
                    '&:hover': disabled
                      ? {}
                      : {
                          borderColor: option.color,
                          backgroundColor: `${option.color}14`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 16px ${option.color}20`,
                        },
                  }}
                >
                  <IconComponent
                    sx={{
                      fontSize: '20px',
                      color: isSelected ? option.color : '#94a3b8',
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? option.color : '#475569',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Info Text */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 3,
            color: '#94a3b8',
            fontStyle: 'italic',
          }}
        >
          {selectedRefinements.length === 0
            ? 'Select refinements to filter results'
            : `${selectedRefinements.length} refinement${selectedRefinements.length !== 1 ? 's' : ''} selected`}
        </Typography>
      </Container>
    </Box>
  );
};

export default RefinementChips;
