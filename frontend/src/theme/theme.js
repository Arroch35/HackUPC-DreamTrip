import { createTheme } from '@mui/material';

const getTheme = () => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Sky blue
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#0f172a', // Deep blue
      light: '#1e293b',
      dark: '#0c0f19',
    },
    background: {
      default: '#f8fafc', // Very light blue
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 20, // Large rounded corners as per design
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          borderRadius: '16px',
          padding: '12px 32px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(37, 99, 235, 0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
          color: '#ffffff',
          border: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)',
          },
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#2563eb',
          '&:hover': {
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          border: '1px solid rgba(226, 232, 240, 0.5)',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          fontWeight: 500,
          fontSize: '0.875rem',
          height: '36px',
          padding: '8px 16px',
        },
        filled: {
          backgroundColor: '#f1f5f9',
          color: '#0f172a',
          '&:hover': {
            backgroundColor: '#e2e8f0',
          },
        },
      },
    },
  },
  customStyles: {
    layout: {
      appShell: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      },
      contentArea: {
        flexGrow: 1,
        padding: '40px 20px',
      },
    },
    shadows: {
      soft: '0 4px 12px rgba(15, 23, 42, 0.06)',
      medium: '0 12px 24px rgba(15, 23, 42, 0.08)',
      card: '0 4px 20px rgba(37, 99, 235, 0.1)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
      sky: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)',
    },
    animations: {
      fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
      slideUp: '@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }',
      scaleIn: '@keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }',
    },
  },
});

export default getTheme;