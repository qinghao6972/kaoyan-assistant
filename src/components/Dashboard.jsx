import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, LinearProgress, Chip, Stack, Paper, Grid,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getDayNumber, getSprintInfo, getTotalDays, formatDateStr } from '../data/sprintData';
import { getTodayStudyMinutes, getVocabRecords, getMemoRecords, getPythonProgress } from '../utils/storage';

const QUOTES = [
  '每一个不曾起舞的日子，都是对生命的辜负。 ——尼采',
  '考研是一场孤独的旅行，但坚持就是胜利。',
  '今天你刷的每一道题，都是明天考场上的底气。',
  '不怕走得慢，就怕停下来。',
  '你背不下来的书，总有人能背下来。',
  '乾坤未定，你我皆是黑马。',
  '熬过无人问津的日子，才有诗和远方。',
  '既然选择了远方，便只顾风雨兼程。',
  '那些你起早贪黑的日子，终会开花结果。',
  '努力的意义就是：当好运来临时，你觉得你值得。',
];

const VOCAB_TARGET = 4000;
const MEMO_341_TOTAL = 30;
const PYTHON_850_TARGET = 100;

export default function Dashboard() {
  const today = new Date();
  const dayNumber = getDayNumber(today);
  const totalDays = getTotalDays();
  const sprintInfo = getSprintInfo(today);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [studyMinutes, setStudyMinutes] = useState(0);
  const [vocabTotal, setVocabTotal] = useState(0);
  const [memoChapters, setMemoChapters] = useState(0);
  const [pythonProgress, setPythonProgressState] = useState(0);

  useEffect(() => {
    const todayStr = formatDateStr();
    const minutes = getTodayStudyMinutes(todayStr);
    setStudyMinutes(minutes);

    const vocabRecords = getVocabRecords();
    const total = vocabRecords.reduce((sum, r) => sum + (r.newWords || 0), 0);
    setVocabTotal(total);

    const memoRecords = getMemoRecords();
    const uniqueChapters = new Set(memoRecords.map((r) => `${r.subject}-${r.chapter}`));
    setMemoChapters(uniqueChapters.size);

    setPythonProgressState(getPythonProgress());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const vocabPercent = Math.min(100, Math.round((vocabTotal / VOCAB_TARGET) * 100));
  const memo341Percent = Math.min(100, Math.round((memoChapters / MEMO_341_TOTAL) * 100));
  const pythonPercent = pythonProgress;
  const studyHours = Math.floor(studyMinutes / 60);
  const studyMins = studyMinutes % 60;

  const dateDisplay = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[today.getDay()];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 3,
          p: 3,
          mb: 2.5,
          background: 'linear-gradient(135deg, #1F3864 0%, #2F5496 100%)',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {dateDisplay} 星期{weekDay}
          </Typography>
          <Chip
            icon={<LocalFireDepartmentIcon />}
            label={`备考第 ${dayNumber} 天`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 700,
              '& .MuiChip-icon': { color: '#FFD54F' },
            }}
          />
        </Stack>

        {sprintInfo ? (
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              📍 {sprintInfo.sprint.phaseName} · {sprintInfo.sprint.name} · 第 {sprintInfo.dayInSprint} 天
            </Typography>
            <Stack direction="row" spacing={1} mt={0.5}>
              <Chip
                label={`Phase ${sprintInfo.sprint.phase}`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '0.7rem' }}
              />
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {sprintInfo.sprint.startDate} → {sprintInfo.sprint.endDate}
              </Typography>
            </Stack>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            备考尚未开始，共 {totalDays} 天征程
          </Typography>
        )}

        <Box mt={2}>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>总进度</Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              {dayNumber} / {totalDays} 天
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (dayNumber / totalDays) * 100)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: '#FFD54F' },
            }}
          />
        </Box>
      </Paper>

      <Grid container spacing={1.5} mb={2.5}>
        <Grid item xs={4}>
          <Card sx={{ textAlign: 'center', py: 1.5 }}>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {vocabTotal}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              英语单词 / {VOCAB_TARGET}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={vocabPercent}
              sx={{ mt: 1, mx: 1.5 }}
            />
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ textAlign: 'center', py: 1.5 }}>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {memoChapters}/{MEMO_341_TOTAL}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              341背诵进度
            </Typography>
            <LinearProgress
              variant="determinate"
              value={memo341Percent}
              sx={{ mt: 1, mx: 1.5 }}
            />
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ textAlign: 'center', py: 1.5 }}>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {pythonPercent}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              850 Python
            </Typography>
            <LinearProgress
              variant="determinate"
              value={pythonPercent}
              sx={{ mt: 1, mx: 1.5 }}
            />
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <AccessTimeIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              今日学习时长
            </Typography>
          </Stack>
          <Typography variant="h3" fontWeight={700} color="primary.main" textAlign="center">
            {studyHours > 0 ? `${studyHours}h ` : ''}{studyMins}m
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={0.5}>
            {studyMinutes > 0
              ? `已累计 ${studyMinutes} 分钟专注学习`
              : '今天还未开始学习，去计时器开始吧！'}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2, bgcolor: '#f8f9fd' }}>
        <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
          <EmojiEventsIcon sx={{ color: '#FFD54F', fontSize: 32, mb: 1 }} />
          <Typography
            variant="body1"
            sx={{ fontStyle: 'italic', color: 'primary.main', lineHeight: 1.8 }}
          >
            「{QUOTES[quoteIndex]}」
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
