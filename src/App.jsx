import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Fade } from '@mui/material';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Timer from './components/Timer';
import Checklist from './components/Checklist';
import VocabTracker from './components/VocabTracker';
import MemoScheduler from './components/MemoScheduler';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F3864',
      light: '#2F5496',
      dark: '#16294A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2F5496',
      light: '#4A6FA5',
      dark: '#1F3864',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
      '"Noto Sans SC"', '"Helvetica Neue"', 'Arial', 'sans-serif',
    ].join(','),
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 10,
          borderRadius: 5,
          backgroundColor: '#e8ecf2',
        },
        bar: {
          borderRadius: 5,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 48,
          padding: '6px 0',
          '&.Mui-selected': {
            paddingTop: '6px',
          },
        },
        label: {
          fontSize: '0.68rem',
          '&.Mui-selected': {
            fontSize: '0.68rem',
          },
        },
      },
    },
  },
});

const TABS = [
  { label: '今日看板', component: Dashboard },
  { label: '计时器', component: Timer },
  { label: '每日清单', component: Checklist },
  { label: '单词追踪', component: VocabTracker },
  { label: '背诵调度', component: MemoScheduler },
];

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const ActiveComponent = useMemo(() => TABS[tabIndex].component, [tabIndex]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          flex: 1,
          pb: 8,
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2, sm: 3 },
          maxWidth: 640,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Fade in key={tabIndex} timeout={200}>
          <Box>
            <ActiveComponent />
          </Box>
        </Fade>
      </Box>
      <BottomNav value={tabIndex} onChange={setTabIndex} />
    </ThemeProvider>
  );
}
