import { useMemo, useState } from 'react'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import Header from './components/Header'
import pages from './pages/registry'
import getTheme from './theme/theme'

function App() {
  const theme = useMemo(() => getTheme(), [])
  const [activePage, setActivePage] = useState('home')

  const Page = pages[activePage]?.component ?? pages.home.component
  
  const navItems = Object.entries(pages).map(([key, value]) => ({
    key,
    label: value.label,
  }))

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={theme.customStyles.layout.appShell}>
        <Header
          items={navItems}
          activeKey={activePage}
          onNavigate={setActivePage}
        />
        <Box sx={theme.customStyles.layout.contentArea}>
          <Page />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App