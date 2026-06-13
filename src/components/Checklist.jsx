import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Checkbox, Stack, Divider, Chip, Paper,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { getChecklist, saveChecklist } from '../utils/storage';
import { formatDateStr } from '../data/sprintData';

export default function Checklist() {
  const todayStr = formatDateStr();
  const [data, setData] = useState(() => getChecklist(todayStr));

  useEffect(() => {
    const handleFocus = () => {
      const currentStr = formatDateStr();
      if (currentStr !== data.date) {
        const fresh = getChecklist(currentStr);
        setData(fresh);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [data.date]);

  const handleTaskToggle = (taskId) => {
    const newData = {
      ...data,
      tasks: data.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      ),
    };
    setData(newData);
    saveChecklist(newData);
  };

  const handleQuestionToggle = (questionId) => {
    const newData = {
      ...data,
      questions: data.questions.map((q) =>
        q.id === questionId ? { ...q, answer: !q.answer } : q
      ),
    };
    setData(newData);
    saveChecklist(newData);
  };

  const completedTasks = data.tasks.filter((t) => t.done).length;
  const totalTasks = data.tasks.length;
  const allDone = completedTasks === totalTasks;
  const answeredQuestions = data.questions.filter((q) => q.answer).length;
  const allAnswered = answeredQuestions === data.questions.length;

  const dateDisplay = (() => {
    const d = new Date();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${m}月${day}日 星期${weekDays[d.getDay()]}`;
  })();

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Typography variant="h5" color="primary.main">
          📋 每日清单
        </Typography>
        <Chip
          label={`${completedTasks}/${totalTasks}`}
          size="small"
          color={allDone ? 'success' : 'default'}
          variant={allDone ? 'filled' : 'outlined'}
        />
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {dateDisplay}
        {allDone ? ' 🎉 今日任务全部完成，太棒了！' : ' 加油完成今日任务！'}
      </Typography>

      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {data.tasks.map((task, idx) => (
            <Box key={task.id}>
              {idx > 0 && <Divider />}
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  px: 2, py: 1.5, cursor: 'pointer',
                  bgcolor: task.done ? 'rgba(76, 175, 80, 0.04)' : 'transparent',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                }}
                onClick={() => handleTaskToggle(task.id)}
              >
                <Checkbox
                  checked={task.done}
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleOutlineIcon color="success" />}
                  sx={{ mr: 1.5 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: task.done ? 'line-through' : 'none',
                      color: task.done ? 'text.secondary' : 'text.primary',
                      fontWeight: 500,
                    }}
                  >
                    {task.label}
                  </Typography>
                </Box>
                <Chip
                  label={task.time}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    color: task.done ? 'text.disabled' : 'primary.main',
                    borderColor: task.done ? 'divider' : 'primary.main',
                  }}
                />
              </Stack>
            </Box>
          ))}
        </CardContent>
      </Card>

      <Typography variant="h6" color="primary.main" mb={1.5}>
        🤔 每日三问
      </Typography>
      <Card>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {data.questions.map((q, idx) => (
            <Box key={q.id}>
              {idx > 0 && <Divider />}
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  px: 2, py: 1.5, cursor: 'pointer',
                  bgcolor: q.answer ? 'rgba(76, 175, 80, 0.04)' : 'transparent',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                }}
                onClick={() => handleQuestionToggle(q.id)}
              >
                <Checkbox
                  checked={q.answer}
                  icon={<HelpOutlineIcon />}
                  checkedIcon={<CheckCircleOutlineIcon color="success" />}
                  sx={{ mr: 1.5 }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: q.answer ? 'line-through' : 'none',
                    color: q.answer ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {q.question}
                </Typography>
              </Stack>
            </Box>
          ))}
        </CardContent>
      </Card>

      {allAnswered && (
        <Paper
          sx={{ mt: 2, p: 2, bgcolor: '#E8F5E9', borderRadius: 2, textAlign: 'center' }}
          elevation={0}
        >
          <Typography variant="body2" color="success.dark" fontWeight={600}>
            ✅ 三问全部完成，今天没有白过！
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
