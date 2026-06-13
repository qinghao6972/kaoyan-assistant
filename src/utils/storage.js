const PREFIX = 'kaoyan_';

function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null || raw === undefined) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

const DEFAULT_TASKS = [
  { id: 'task-1', label: '英语单词', time: '08:00-09:00', done: false },
  { id: 'task-2', label: '专业课一', time: '09:10-11:40', done: false },
  { id: 'task-3', label: '专业课二', time: '14:00-16:30', done: false },
  { id: 'task-4', label: '英语阅读', time: '16:40-17:40', done: false },
  { id: 'task-5', label: '341背诵',   time: '19:00-20:00', done: false },
  { id: 'task-6', label: '练习',       time: '20:10-21:40', done: false },
  { id: 'task-7', label: '复盘',       time: '21:40-22:10', done: false },
];

const DEFAULT_QUESTIONS = [
  { id: 'q-1', question: '英语有没有碰？', answer: false },
  { id: 'q-2', question: '专业课有没有推进？', answer: false },
  { id: 'q-3', question: '有没有留下笔记？', answer: false },
];

export function getChecklist(todayStr) {
  const data = getItem('checklist');
  if (data && data.date === todayStr) {
    return data;
  }
  const fresh = {
    date: todayStr,
    tasks: DEFAULT_TASKS.map((t) => ({ ...t })),
    questions: DEFAULT_QUESTIONS.map((q) => ({ ...q })),
  };
  setItem('checklist', fresh);
  return fresh;
}

export function saveChecklist(data) {
  setItem('checklist', data);
}

export function getVocabRecords() {
  return getItem('vocab_records', []);
}

export function saveVocabRecord(dateStr, newWords, reviewWords) {
  const records = getVocabRecords();
  const idx = records.findIndex((r) => r.date === dateStr);
  if (idx >= 0) {
    records[idx] = { date: dateStr, newWords, reviewWords };
  } else {
    records.push({ date: dateStr, newWords, reviewWords });
  }
  records.sort((a, b) => a.date.localeCompare(b.date));
  setItem('vocab_records', records);
}

export function getMemoRecords() {
  return getItem('memo_records', []);
}

export function addMemoRecord(subject, chapter, dateStr) {
  const records = getMemoRecords();
  const exists = records.some(
    (r) => r.subject === subject && r.chapter === chapter && r.date === dateStr
  );
  if (exists) return;
  records.push({ subject, chapter, date: dateStr });
  setItem('memo_records', records);
}

export function removeMemoRecord(subject, chapter, dateStr) {
  const records = getMemoRecords();
  const filtered = records.filter(
    (r) => !(r.subject === subject && r.chapter === chapter && r.date === dateStr)
  );
  setItem('memo_records', filtered);
}

export function getTimerRecords() {
  return getItem('timer_records', []);
}

export function addTimerRecord(dateStr, subject, minutes) {
  const records = getTimerRecords();
  records.push({ date: dateStr, subject, minutes });
  setItem('timer_records', records);
}

export function getTodayStudyMinutes(todayStr) {
  const dateStr = todayStr || new Date().toISOString().slice(0, 10);
  const records = getTimerRecords();
  return records
    .filter((r) => r.date === dateStr)
    .reduce((sum, r) => sum + r.minutes, 0);
}

export function getPythonProgress() {
  return getItem('python_progress', 0);
}

export function setPythonProgress(value) {
  setItem('python_progress', Math.max(0, Math.min(100, value)));
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
