import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { LocationOn, FavoriteBorder, Favorite } from '@mui/icons-material';

const DestinationCard = ({ destination, onLike, variant = 'default' }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const isFeatured = variant === 'featured';

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(destination);
    }
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(226, 232, 240, 0.5)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(37, 99, 235, 0.2)'
          : '0 4px 12px rgba(15, 23, 42, 0.06)',
        transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        cursor: 'pointer',
        animation: 'slideUp 0.6s ease-out',
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
      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: isFeatured ? '320px' : '250px',
        }}
      >
        <CardMedia
          component="img"
          height={isFeatured ? '320' : '250'}
          image={destination.image}
          alt={destination.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.4s ease-out',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />

        {/* Overlay on hover */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: isHovered
              ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,23,42,0.4) 100%)'
              : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, transparent 100%)',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Like Button */}
        <Box
          onClick={handleLikeClick}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: isLiked ? 'scale(1.1)' : 'scale(1)',
            '&:hover': {
              backgroundColor: '#ffffff',
              transform: 'scale(1.15)',
            },
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {isLiked ? (
            <Favorite
              sx={{
                fontSize: '24px',
                color: '#ef4444',
                transition: 'all 0.2s ease',
              }}
            />
          ) : (
            <FavoriteBorder
              sx={{
                fontSize: '24px',
                color: '#cbd5e1',
                transition: 'all 0.2s ease',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: isFeatured ? 3.5 : 3,
        }}
      >
        {/* Title with Location */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant={isFeatured ? 'h4' : 'h5'}
              sx={{ fontWeight: 700, color: '#0f172a' }}
            >
              {destination.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: '18px', color: '#2563eb' }} />
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {destination.country}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#475569',
            mb: 3,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: isFeatured ? 4 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {destination.description}
        </Typography>

        {/* Tags */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mt: 'auto',
          }}
        >
          {destination.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                backgroundColor: '#f1f5f9',
                color: '#2563eb',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: '28px',
                borderRadius: '14px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#e0e7ff',
                  transform: 'translateY(-2px)',
                },
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DestinationCard;
