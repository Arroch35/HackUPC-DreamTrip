import { createTheme } from '@mui/material';

const getTheme = () => createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
  // Adding custom properties to the theme object
  customStyles: {
    layout: {
      appShell: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      },
      contentArea: {
        flexGrow: 1,
        padding: '20px',
      },
    },
  },
});

export default getTheme;