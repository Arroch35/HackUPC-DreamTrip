// import React, { useState } from 'react';
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Box,
//   Chip,
//   useTheme,
// } from '@mui/material';
// import { LocationOn, FavoriteBorder, Favorite } from '@mui/icons-material';

// const DestinationCard = ({ destination, onLike, variant = 'default' }) => {
//   const theme = useTheme();
//   const [isHovered, setIsHovered] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const isFeatured = variant === 'featured';

//   const handleLikeClick = (e) => {
//     e.stopPropagation();
//     setIsLiked(!isLiked);
//     if (onLike) {
//       onLike(destination);
//     }
//   };

//   return (
//     <Card
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       sx={{
//         maxWidth: '100%',
//         width: '100%',
//         height: '100%',
//         display: 'flex',
//         flexDirection: { xs: 'column', sm: isFeatured ? 'row' : 'column' },
//         // Featured card specific sizing - MAKES IT LARGER
//         ...(isFeatured && {
//           minHeight: { xs: 'auto', sm: '400px', md: '460px' },  // ADDED - controls card height
//         }),
//         borderRadius: '24px',
//         overflow: 'hidden',
//         border: '1px solid rgba(226, 232, 240, 0.5)',
//         boxShadow: isHovered
//           ? '0 20px 40px rgba(37, 99, 235, 0.15)'
//           : '0 4px 12px rgba(15, 23, 42, 0.06)',
//         transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         position: 'relative',
//         cursor: 'pointer',
//         backgroundColor: '#ffffff',
//       }}
//     >
//       {/* Image Container - LARGER for featured card */}
//       <Box
//         sx={{
//           position: 'relative',
//           overflow: 'hidden',
//           width: isFeatured ? { xs: '100%', sm: '50%' } : '100%',  // CHANGED: 45% → 50%
//           height: isFeatured ? { xs: '280px', sm: 'auto' } : '180px',  // CHANGED: 200px → 280px
//           flexShrink: 0,
//           ...(isFeatured && {
//             minHeight: { sm: '400px', md: '460px' },  // ADDED - matches card height
//           }),
//         }}
//       >
//         <CardMedia
//           component="img"
//           // image={destination.image}
//           const imageUrl = 'https://source.unsplash.com/1200x700/?${destination.city},${destination.country},travel';
//           alt={destination.city}
//           sx={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//             transition: 'transform 0.4s ease-out',
//             transform: isHovered ? 'scale(1.05)' : 'scale(1)',
//           }}
//         />

//         {/* Overlay on hover */}
//         <Box
//           sx={{
//             position: 'absolute',
//             inset: 0,
//             background: isHovered
//               ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,23,42,0.3) 100%)'
//               : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, transparent 100%)',
//             transition: 'all 0.3s ease',
//           }}
//         />

//         {/* Like Button */}
//         <Box
//           onClick={handleLikeClick}
//           sx={{
//             position: 'absolute',
//             top: 12,
//             right: 12,
//             width: 32,
//             height: 32,
//             borderRadius: '50%',
//             backgroundColor: 'rgba(255, 255, 255, 0.95)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             cursor: 'pointer',
//             transition: 'all 0.2s ease',
//             transform: isLiked ? 'scale(1.1)' : 'scale(1)',
//             '&:hover': {
//               backgroundColor: '#ffffff',
//               transform: 'scale(1.1)',
//             },
//             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//           }}
//         >
//           {isLiked ? (
//             <Favorite
//               sx={{
//                 fontSize: '18px',
//                 color: '#ef4444',
//               }}
//             />
//           ) : (
//             <FavoriteBorder
//               sx={{
//                 fontSize: '18px',
//                 color: '#cbd5e1',
//               }}
//             />
//           )}
//         </Box>

//         {/* Featured Badge for top card */}
//         {isFeatured && (
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: 16,
//               left: 16,
//               backgroundColor: 'rgba(37, 99, 235, 0.9)',
//               backdropFilter: 'blur(4px)',
//               color: 'white',
//               padding: '6px 16px',
//               borderRadius: '24px',
//               fontSize: '0.8rem',
//               fontWeight: 600,
//               letterSpacing: '0.5px',
//             }}
//           >
//             BEST MATCH
//           </Box>
//         )}
//       </Box>

//       {/* Content - LARGER for featured card */}
//       <CardContent
//         sx={{
//           flexGrow: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',  // ADDED - centers content vertically
//           p: isFeatured ? { xs: 2.5, sm: 4 } : 2,  // CHANGED: 2.5 → 4 for desktop
//           width: isFeatured ? { xs: '100%', sm: '50%' } : '100%',  // CHANGED: 55% → 50%
//         }}
//       >
//         {/* Title with Location */}
//         <Box sx={{ mb: 1.5 }}>
//           <Typography
//             variant="subtitle1"
//             sx={{
//               fontWeight: 700,
//               color: '#0f172a',
//               fontSize: isFeatured ? { xs: '1.4rem', sm: '1.8rem' } : '1rem',  // CHANGED: 1.2rem → 1.8rem
//               lineHeight: 1.2,
//               mb: 1,
//             }}
//           >
//             {destination.city}
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
//             <LocationOn sx={{ fontSize: isFeatured ? '20px' : '16px', color: '#2563eb' }} />
//             <Typography
//               variant="body2"
//               sx={{ color: '#64748b', fontSize: isFeatured ? '1rem' : '0.8rem' }}
//             >
//               {destination.country}
//             </Typography>
//           </Box>
//         </Box>

//         {/* Description - MORE LINES for featured card */}
//         <Typography
//           variant="body2"
//           sx={{
//             color: '#475569',
//             mb: 2.5,
//             lineHeight: 1.5,
//             display: '-webkit-box',
//             WebkitLineClamp: isFeatured ? 3 : 2,  // CHANGED: 2 → 3 lines for featured
//             WebkitBoxOrient: 'vertical',
//             overflow: 'hidden',
//             fontSize: isFeatured ? '0.95rem' : '0.8rem',  // CHANGED: bigger font for featured
//           }}
//         >
//           {
//             (destination.key_features || [])
//               .map(f => f.charAt(0).toUpperCase() + f.slice(1))
//               .join(', ')
//           }
//         </Typography>

//         {/* Tags - MORE TAGS for featured card */}
//         <Box
//           sx={{
//             display: 'flex',
//             flexWrap: 'wrap',
//             gap: 1,
//             mt: 'auto',
//           }}
//         >
//           {(isFeatured ? (destination.key_features || []).slice(0, 4) : (destination.key_features || []).slice(0, 3)).map((tag, index) => (
//             <Chip
//               key={index}
//               label={tag}
//               size={isFeatured ? "medium" : "small"}
//               sx={{
//                 backgroundColor: '#f1f5f9',
//                 color: '#2563eb',
//                 fontWeight: 500,
//                 fontSize: isFeatured ? '0.8rem' : '0.7rem',
//                 height: isFeatured ? '32px' : '24px',
//                 borderRadius: isFeatured ? '16px' : '12px',
//                 '&:hover': {
//                   backgroundColor: '#e0e7ff',
//                 },
//               }}
//             />
//           ))}
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default DestinationCard;


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

  // ✅ SAFE DATA
  const features = destination.key_features || [];

  // ✅ IMAGE FIX
  const imageUrl = `https://source.unsplash.com/1200x700/?${destination.city},${destination.country},travel`;

  // ✅ DESCRIPTION FIX
  const description = features
    .map(f => f.charAt(0).toUpperCase() + f.slice(1))
    .join(', ');

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
        maxWidth: '100%',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: isFeatured ? 'row' : 'column' },
        ...(isFeatured && {
          minHeight: { xs: 'auto', sm: '400px', md: '460px' },
        }),
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(226, 232, 240, 0.5)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(37, 99, 235, 0.15)'
          : '0 4px 12px rgba(15, 23, 42, 0.06)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: isFeatured ? { xs: '100%', sm: '50%' } : '100%',
          height: isFeatured ? { xs: '280px', sm: 'auto' } : '180px',
          flexShrink: 0,
          ...(isFeatured && {
            minHeight: { sm: '400px', md: '460px' },
          }),
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={`${destination.city} ${destination.country}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease-out',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: isHovered
              ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,23,42,0.3) 100%)'
              : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, transparent 100%)',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Like Button */}
        <Box
          onClick={handleLikeClick}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
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
              transform: 'scale(1.1)',
            },
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          {isLiked ? (
            <Favorite sx={{ fontSize: '18px', color: '#ef4444' }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: '18px', color: '#cbd5e1' }} />
          )}
        </Box>

        {/* Featured Badge */}
        {isFeatured && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              backgroundColor: 'rgba(37, 99, 235, 0.9)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '24px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            BEST MATCH
          </Box>
        )}
      </Box>

      {/* CONTENT */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: isFeatured ? { xs: 2.5, sm: 4 } : 2,
          width: isFeatured ? { xs: '100%', sm: '50%' } : '100%',
        }}
      >
        {/* Title */}
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              fontSize: isFeatured ? { xs: '1.4rem', sm: '1.8rem' } : '1rem',
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            {destination.city}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LocationOn sx={{ fontSize: isFeatured ? '20px' : '16px', color: '#2563eb' }} />
            <Typography
              variant="body2"
              sx={{ color: '#64748b', fontSize: isFeatured ? '1rem' : '0.8rem' }}
            >
              {destination.country}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#475569',
            mb: 2.5,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: isFeatured ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: isFeatured ? '0.95rem' : '0.8rem',
          }}
        >
          {description}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
          {(isFeatured ? features.slice(0, 4) : features.slice(0, 3)).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size={isFeatured ? "medium" : "small"}
              sx={{
                backgroundColor: '#f1f5f9',
                color: '#2563eb',
                fontWeight: 500,
                fontSize: isFeatured ? '0.8rem' : '0.7rem',
                height: isFeatured ? '32px' : '24px',
                borderRadius: isFeatured ? '16px' : '12px',
                '&:hover': {
                  backgroundColor: '#e0e7ff',
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