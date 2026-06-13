import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Stack, ToggleButtonGroup, ToggleButton,
  Paper, Chip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { addTimerRecord } from '../utils/storage';
import { formatDateStr } from '../data/sprintData';

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;
const FOCUS_SECONDS = FOCUS_MINUTES * 60;
const BREAK_SECONDS = BREAK_MINUTES * 60;

const SUBJECTS = [
  { key: '英语', label: '英语', color: '#1F3864' },
  { key: '341',  label: '341',  color: '#2F5496' },
  { key: '850',  label: '850',  color: '#4A6FA5' },
];

export default function Timer() {
  const [subject, setSubject] = useState('英语');
  const [status, setStatus] = useState('idle');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [sessionCount, setSessionCount] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef(null);

  const isFocus = status !== 'break';
  const totalSeconds = isFocus ? FOCUS_SECONDS : BREAK_SECONDS;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (status !== 'running' && status !== 'break') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  useEffect(() => {
    if (secondsLeft === 0 && (status === 'running' || status === 'break')) {
      if (isFocus) {
        const todayStr = formatDateStr();
        addTimerRecord(todayStr, subject, FOCUS_MINUTES);
        setSessionCount((c) => c + 1);
        setShowComplete(true);
        setStatus('break');
        setSecondsLeft(BREAK_SECONDS);
      } else {
        setStatus('idle');
        setSecondsLeft(FOCUS_SECONDS);
      }
    }
  }, [secondsLeft, status, isFocus, subject]);

  const handleStart = useCallback(() => {
    if (status === 'paused' || status === 'idle') {
      setStatus(status === 'paused' ? (isFocus ? 'running' : 'break') : 'running');
      setShowComplete(false);
    }
  }, [status, isFocus]);

  const handlePause = useCallback(() => {
    if (status === 'running' || status === 'break') {
      setStatus('paused');
    }
  }, [status]);

  const handleReset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setStatus('idle');
    setSecondsLeft(FOCUS_SECONDS);
    setShowComplete(false);
  }, []);

  const handleSubjectChange = (_, newSubject) => {
    if (newSubject !== null) {
      setSubject(newSubject);
    }
  };

  const isRunning = status === 'running' || status === 'break';
  const canStart = status === 'idle' || status === 'paused';

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const ringColor = isFocus ? '#1F3864' : '#4CAF50';

  return (
    <Box>
      <Typography variant="h5" mb={2.5} color="primary.main">
        ⏱️ 学习计时器
      </Typography>

      <Paper elevation={0} sx={{ p: 1.5, mb: 2.5, bgcolor: '#f0f3f8', borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 48 }}>
            科目：
          </Typography>
          <ToggleButtonGroup
            value={subject}
            exclusive
            onChange={handleSubjectChange}
            size="small"
            disabled={isRunning}
          >
            {SUBJECTS.map((s) => (
              <ToggleButton
                key={s.key}
                value={s.key}
                sx={{
                  px: 2.5,
                  '&.Mui-selected': {
                    bgcolor: s.color,
                    color: 'white',
                    '&:hover': { bgcolor: s.color },
                  },
                }}
              >
                {s.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Box sx={{ position: 'relative', width: 220, height: 220 }}>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle
                cx="110" cy="110" r={radius}
                fill="none" stroke="#e8ecf2" strokeWidth="10"
              />
              <circle
                cx="110" cy="110" r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 110 110)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Typography variant="h3" fontWeight={700} color={ringColor}>
                {timeDisplay}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {isFocus ? '专注中' : status === 'break' ? '休息中 ☕️' : '准备开始'}
              </Typography>
              <Chip
                label={subject}
                size="small"
                sx={{ mt: 1, bgcolor: ringColor, color: 'white', fontSize: '0.7rem' }}
              />
            </Box>
          </Box>

          {showComplete && (
            <Paper
              elevation={2}
              sx={{
                mt: 2, px: 2.5, py: 1.5, bgcolor: '#E8F5E9', borderRadius: 2,
                display: 'flex', alignItems: 'center', gap: 1,
              }}
            >
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="body2" color="success.dark" fontWeight={600}>
                番茄钟完成！已记录 {FOCUS_MINUTES} 分钟到今日 {subject} 学习时长
              </Typography>
            </Paper>
          )}

          <Stack direction="row" spacing={2} mt={3}>
            {canStart && (
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={handleStart}
                sx={{ px: 3, borderRadius: 2 }}
              >
                {status === 'paused' ? '继续' : '开始'}
              </Button>
            )}
            {isRunning && (
              <Button
                variant="outlined"
                startIcon={<PauseIcon />}
                onClick={handlePause}
                sx={{ px: 3, borderRadius: 2 }}
              >
                暂停
              </Button>
            )}
            <Button
              variant="text"
              startIcon={<ReplayIcon />}
              onClick={handleReset}
              sx={{ px: 2, borderRadius: 2 }}
              disabled={status === 'idle' && secondsLeft === FOCUS_SECONDS}
            >
              重置
            </Button>
          </Stack>

          {sessionCount > 0 && (
            <Typography variant="body2" color="text.secondary" mt={2}>
              今日已完成 {sessionCount} 个番茄钟
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#f8f9fd' }}>
        <CardContent>
          <Typography variant="subtitle2" color="primary.main" gutterBottom>
            💡 番茄工作法
          </Typography>
          <Typography variant="body2" color="text.secondary">
            每 {FOCUS_MINUTES} 分钟专注学习后，享受 {BREAK_MINUTES} 分钟休息。
            完成一个番茄钟后自动记录到今日看板。
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
