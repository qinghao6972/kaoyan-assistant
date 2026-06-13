import { useState, useEffect, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Stack, Chip, Paper, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getVocabRecords, saveVocabRecord, todayStr } from '../utils/storage';

const VOCAB_TARGET = 4000;

export default function VocabTracker() {
  const [records, setRecords] = useState([]);
  const [newWords, setNewWords] = useState('');
  const [reviewWords, setReviewWords] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRecords(getVocabRecords());
  }, []);

  useEffect(() => {
    const today = todayStr();
    const existing = records.find((r) => r.date === today);
    if (existing) {
      setNewWords(String(existing.newWords));
      setReviewWords(String(existing.reviewWords));
    }
  }, [records]);

  const handleSave = () => {
    const nw = parseInt(newWords, 10) || 0;
    const rw = parseInt(reviewWords, 10) || 0;
    if (nw === 0 && rw === 0) return;
    const today = todayStr();
    saveVocabRecord(today, nw, rw);
    setRecords(getVocabRecords());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const chartData = useMemo(() => {
    let cumulative = 0;
    return records.map((r) => {
      cumulative += r.newWords || 0;
      return {
        date: r.date.slice(5),
        cumulative,
        newWords: r.newWords,
      };
    });
  }, [records]);

  const cumulativeTotal = chartData.length > 0 ? chartData[chartData.length - 1].cumulative : 0;
  const remaining = Math.max(0, VOCAB_TARGET - cumulativeTotal);
  const vocabPercent = Math.min(100, Math.round((cumulativeTotal / VOCAB_TARGET) * 100));

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const startStr = sevenDaysAgo.toISOString().slice(0, 10);
    const endStr = now.toISOString().slice(0, 10);
    const weekRecords = records.filter((r) => r.date >= startStr && r.date <= endStr);
    return {
      newTotal: weekRecords.reduce((s, r) => s + (r.newWords || 0), 0),
      reviewTotal: weekRecords.reduce((s, r) => s + (r.reviewWords || 0), 0),
      days: weekRecords.length,
    };
  }, [records]);

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const monthRecords = records.filter((r) => r.date >= monthStart);
    return {
      newTotal: monthRecords.reduce((s, r) => s + (r.newWords || 0), 0),
      reviewTotal: monthRecords.reduce((s, r) => s + (r.reviewWords || 0), 0),
      days: monthRecords.length,
    };
  }, [records]);

  return (
    <Box>
      <Typography variant="h5" mb={2.5} color="primary.main">
        📖 单词追踪
      </Typography>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            今日单词录入
          </Typography>
          <Stack direction="row" spacing={1.5} mb={2}>
            <TextField
              label="新背单词"
              type="number"
              size="small"
              value={newWords}
              onChange={(e) => setNewWords(e.target.value)}
              inputProps={{ min: 0, max: 500 }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="复习单词"
              type="number"
              size="small"
              value={reviewWords}
              onChange={(e) => setReviewWords(e.target.value)}
              inputProps={{ min: 0, max: 500 }}
              sx={{ flex: 1 }}
            />
          </Stack>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleSave}
            disabled={(!newWords && !reviewWords) || saved}
            sx={{ borderRadius: 2 }}
          >
            {saved ? '已保存 ✓' : '记录今日单词'}
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={1.5} mb={2.5}>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {cumulativeTotal}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                累计词汇量
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" fontWeight={700} color="error.main">
                {remaining}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                距目标 {VOCAB_TARGET} 词
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1.5} mb={2.5}>
        <Paper sx={{ flex: 1, p: 1.5, bgcolor: '#f0f3f8', borderRadius: 2 }} elevation={0}>
          <Typography variant="caption" color="text.secondary">本周</Typography>
          <Typography variant="body2" fontWeight={600}>
            新 {weeklyStats.newTotal} / 复 {weeklyStats.reviewTotal} 词
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {weeklyStats.days} 天有记录
          </Typography>
        </Paper>
        <Paper sx={{ flex: 1, p: 1.5, bgcolor: '#f0f3f8', borderRadius: 2 }} elevation={0}>
          <Typography variant="caption" color="text.secondary">本月</Typography>
          <Typography variant="body2" fontWeight={600}>
            新 {monthlyStats.newTotal} / 复 {monthlyStats.reviewTotal} 词
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {monthlyStats.days} 天有记录
          </Typography>
        </Paper>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <TrendingUpIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" color="primary.main">
              累计词汇量趋势
            </Typography>
            <Chip
              label={`${vocabPercent}%`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 'auto' }}
            />
          </Stack>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value} 词`, '累计词汇']}
                  labelFormatter={(label) => `日期: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#1F3864"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#1F3864' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                暂无数据，请先录入今日单词
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
