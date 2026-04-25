import { useMemo } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';

import Home from './pages/Home';
import getTheme from './theme/theme';

function App() {
  const theme = useMemo(() => getTheme(), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={theme.customStyles.layout.appShell}>
        <Box sx={theme.customStyles.layout.contentArea}>
          <Home />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;