import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimerIcon from '@mui/icons-material/Timer';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const TABS = [
  { label: '今日看板', icon: <DashboardIcon /> },
  { label: '计时器', icon: <TimerIcon /> },
  { label: '每日清单', icon: <FactCheckIcon /> },
  { label: '单词追踪', icon: <MenuBookIcon /> },
  { label: '背诵调度', icon: <CalendarMonthIcon /> },
];

export default function BottomNav({ value, onChange }) {
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderTop: '1px solid',
        borderColor: 'divider',
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        showLabels
        sx={{
          height: 64,
          bgcolor: 'background.paper',
          '& .MuiBottomNavigationAction-root': {
            color: '#9e9e9e',
          },
          '& .Mui-selected': {
            color: 'primary.main',
          },
        }}
      >
        {TABS.map((tab) => (
          <BottomNavigationAction
            key={tab.label}
            label={tab.label}
            icon={tab.icon}
            sx={{
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.65rem',
                whiteSpace: 'nowrap',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
