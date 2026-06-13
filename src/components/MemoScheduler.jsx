import { useState, useEffect, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Stack, Chip, Paper,
  ToggleButtonGroup, ToggleButton, TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import { getMemoRecords, addMemoRecord, removeMemoRecord, todayStr } from '../utils/storage';

const SUBJECTS = [
  { key: '作物栽培学', label: '作物栽培学', color: '#1F3864' },
  { key: '农业信息学', label: '农业信息学', color: '#2F5496' },
  { key: '土壤学',     label: '土壤学',     color: '#4A6FA5' },
];

const REVIEW_INTERVALS = [1, 2, 4, 7, 15];

function calcReviewDates(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  return REVIEW_INTERVALS.map((interval) => {
    const reviewDate = new Date(base);
    reviewDate.setDate(reviewDate.getDate() + interval);
    const ry = reviewDate.getFullYear();
    const rm = String(reviewDate.getMonth() + 1).padStart(2, '0');
    const rd = String(reviewDate.getDate()).padStart(2, '0');
    return { interval, date: `${ry}-${rm}-${rd}` };
  });
}

export default function MemoScheduler() {
  const [records, setRecords] = useState([]);
  const [subject, setSubject] = useState('作物栽培学');
  const [chapterInput, setChapterInput] = useState('');

  useEffect(() => {
    setRecords(getMemoRecords());
  }, []);

  const today = todayStr();

  const todayReviews = useMemo(() => {
    const result = [];
    const seen = new Set();
    for (const rec of records) {
      const reviewDates = calcReviewDates(rec.date);
      for (const rd of reviewDates) {
        if (rd.date === today) {
          const key = `${rec.subject}-${rec.chapter}-${rd.interval}`;
          if (!seen.has(key)) {
            seen.add(key);
            result.push({
              ...rec,
              reviewInterval: rd.interval,
              reviewDate: rd.date,
            });
          }
        }
      }
    }
    result.sort((a, b) => a.subject.localeCompare(b.subject) || a.chapter - b.chapter);
    return result;
  }, [records, today]);

  const next7Days = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      const items = [];
      const seen = new Set();
      for (const rec of records) {
        const reviewDates = calcReviewDates(rec.date);
        for (const rd of reviewDates) {
          if (rd.date === ds) {
            const key = `${rec.subject}-${rec.chapter}`;
            if (!seen.has(key)) {
              seen.add(key);
              items.push({ subject: rec.subject, chapter: rec.chapter, interval: rd.interval });
            }
          }
        }
      }
      items.sort((a, b) => a.subject.localeCompare(b.subject) || a.chapter - b.chapter);
      const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
      const wd = weekDays[d.getDay()];
      const m = d.getMonth() + 1;
      const day = d.getDate();
      days.push({
        dateStr: ds,
        label: `${m}/${day} 周${wd}`,
        isToday: ds === today,
        items,
      });
    }
    return days;
  }, [records, today]);

  const handleAdd = () => {
    const chapter = parseInt(chapterInput, 10);
    if (!chapter || chapter < 1) return;
    addMemoRecord(subject, chapter, today);
    setRecords(getMemoRecords());
    setChapterInput('');
  };

  const handleDelete = (subj, ch, date) => {
    removeMemoRecord(subj, ch, date);
    setRecords(getMemoRecords());
  };

  const handleSubjectChange = (_, newSubject) => {
    if (newSubject !== null) setSubject(newSubject);
  };

  const studiedChapters = useMemo(() => {
    return records
      .filter((r) => r.subject === subject)
      .map((r) => r.chapter)
      .sort((a, b) => a - b);
  }, [records, subject]);

  return (
    <Box>
      <Typography variant="h5" mb={2.5} color="primary.main">
        🧠 背诵调度器
      </Typography>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            今天背诵了新章节？
          </Typography>
          <ToggleButtonGroup
            value={subject}
            exclusive
            onChange={handleSubjectChange}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          >
            {SUBJECTS.map((s) => (
              <ToggleButton
                key={s.key}
                value={s.key}
                sx={{
                  flex: 1,
                  fontSize: '0.8rem',
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

          <Stack direction="row" spacing={1}>
            <TextField
              label="章节号"
              type="number"
              size="small"
              value={chapterInput}
              onChange={(e) => setChapterInput(e.target.value)}
              inputProps={{ min: 1 }}
              sx={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              disabled={!chapterInput}
              sx={{ borderRadius: 2, minWidth: 100 }}
            >
              记录
            </Button>
          </Stack>

          {studiedChapters.length > 0 && (
            <Box mt={2}>
              <Typography variant="caption" color="text.secondary">
                {subject} 已学章节：
              </Typography>
              <Stack direction="row" flexWrap="wrap" spacing={0.5} mt={0.5}>
                {studiedChapters.map((ch) => (
                  <Chip key={ch} label={`第${ch}章`} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EventIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" color="primary.main">
                今日需复习
              </Typography>
            </Stack>
            <Chip
              label={`${todayReviews.length} 项`}
              size="small"
              color={todayReviews.length > 0 ? 'warning' : 'default'}
            />
          </Stack>

          {todayReviews.length > 0 ? (
            <Stack spacing={1}>
              {todayReviews.map((item, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 1.5, bgcolor: '#FFF8E1', borderRadius: 2,
                    border: '1px solid #FFE082',
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {item.subject} · 第{item.chapter}章
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        学于 {item.date} · 第{item.reviewInterval}天复习
                      </Typography>
                    </Box>
                    <Chip
                      label={`D+${item.reviewInterval}`}
                      size="small"
                      color={
                        item.reviewInterval <= 2 ? 'error' :
                        item.reviewInterval <= 4 ? 'warning' : 'default'
                      }
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
              今天没有需要复习的内容 ✨
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle2" color="primary.main" mb={1.5}>
            📅 未来7天复习日历
          </Typography>
          <Stack spacing={1}>
            {next7Days.map((day) => (
              <Paper
                key={day.dateStr}
                elevation={0}
                sx={{
                  p: 1.5,
                  bgcolor: day.isToday ? '#E3F2FD' : '#fafbfc',
                  borderRadius: 2,
                  border: day.isToday ? '1px solid #90CAF9' : '1px solid transparent',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={day.items.length > 0 ? 0.5 : 0}>
                  <Typography
                    variant="body2"
                    fontWeight={day.isToday ? 700 : 500}
                    color={day.isToday ? 'primary.main' : 'text.primary'}
                  >
                    {day.label}
                  </Typography>
                  {day.isToday && (
                    <Chip label="今天" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
                  )}
                  {day.items.length > 0 && (
                    <Chip
                      label={`${day.items.length} 项复习`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.65rem', ml: 'auto' }}
                    />
                  )}
                  {day.items.length === 0 && (
                    <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto' }}>
                      无
                    </Typography>
                  )}
                </Stack>
                {day.items.length > 0 && (
                  <Stack direction="row" flexWrap="wrap" spacing={0.5} mt={0.5}>
                    {day.items.map((item, i) => (
                      <Chip
                        key={i}
                        label={`${item.subject.slice(0, 2)}${item.chapter}(D+${item.interval})`}
                        size="small"
                        sx={{ fontSize: '0.65rem', bgcolor: '#f0f3f8' }}
                      />
                    ))}
                  </Stack>
                )}
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {records.length > 0 && (
        <Card sx={{ mt: 2.5 }}>
          <CardContent>
            <Typography variant="subtitle2" color="primary.main" mb={1.5}>
              📋 全部背诵记录
            </Typography>
            <Stack spacing={1}>
              {records
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date) || a.subject.localeCompare(b.subject))
                .map((rec, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 1, bgcolor: '#fafbfc', borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body2">
                      <strong>{rec.subject}</strong> 第{rec.chapter}章 · {rec.date}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(rec.subject, rec.chapter, rec.date)}
                      sx={{ minWidth: 32, p: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </Paper>
                ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
