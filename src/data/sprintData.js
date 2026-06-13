/**
 * Sprint data for the 189-day kaoyan preparation plan.
 * Start date: 2026-06-14, End date: 2026-12-19 (189 days)
 */

const SPRINTS = [
  { id: 1,  phase: 1, phaseName: '基础建设期', name: 'Sprint 1',  startDate: '2026-06-14', endDate: '2026-06-21' },
  { id: 2,  phase: 1, phaseName: '基础建设期', name: 'Sprint 2',  startDate: '2026-06-22', endDate: '2026-07-05' },
  { id: 3,  phase: 1, phaseName: '基础建设期', name: 'Sprint 3',  startDate: '2026-07-06', endDate: '2026-07-20' },
  { id: 4,  phase: 1, phaseName: '基础建设期', name: 'Sprint 4',  startDate: '2026-07-21', endDate: '2026-07-31' },
  { id: 5,  phase: 2, phaseName: '能力巩固期', name: 'Sprint 5',  startDate: '2026-08-01', endDate: '2026-08-15' },
  { id: 6,  phase: 2, phaseName: '能力巩固期', name: 'Sprint 6',  startDate: '2026-08-16', endDate: '2026-08-31' },
  { id: 7,  phase: 2, phaseName: '能力巩固期', name: 'Sprint 7',  startDate: '2026-09-01', endDate: '2026-09-15' },
  { id: 8,  phase: 2, phaseName: '能力巩固期', name: 'Sprint 8',  startDate: '2026-09-16', endDate: '2026-09-30' },
  { id: 9,  phase: 3, phaseName: '冲刺突破期', name: 'Sprint 9',  startDate: '2026-10-01', endDate: '2026-10-15' },
  { id: 10, phase: 3, phaseName: '冲刺突破期', name: 'Sprint 10', startDate: '2026-10-16', endDate: '2026-10-31' },
  { id: 11, phase: 3, phaseName: '冲刺突破期', name: 'Sprint 11', startDate: '2026-11-01', endDate: '2026-11-15' },
  { id: 12, phase: 3, phaseName: '冲刺突破期', name: 'Sprint 12', startDate: '2026-11-16', endDate: '2026-11-30' },
  { id: 13, phase: 4, phaseName: '临战收官',   name: 'Sprint 13', startDate: '2026-12-01', endDate: '2026-12-10' },
  { id: 14, phase: 4, phaseName: '临战收官',   name: 'Sprint 14', startDate: '2026-12-11', endDate: '2026-12-19' },
];

const START_DATE = new Date(2026, 5, 14);
const TOTAL_DAYS = 189;

function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getDayNumber(date = new Date()) {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays + 1 : 0;
}

export function getSprintInfo(date = new Date()) {
  const dateStr = formatDateStr(date);
  for (const sprint of SPRINTS) {
    if (dateStr >= sprint.startDate && dateStr <= sprint.endDate) {
      const sprintStart = parseDate(sprint.startDate);
      const current = parseDate(dateStr);
      const dayInSprint = Math.floor(
        (current.getTime() - sprintStart.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      return { sprint, dayInSprint };
    }
  }
  return null;
}

export function formatDateStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTotalDays() {
  return TOTAL_DAYS;
}

export function getAllSprints() {
  return SPRINTS;
}

export function getStartDate() {
  return new Date(START_DATE);
}

export function getExamDate() {
  const examDate = new Date(START_DATE);
  examDate.setDate(examDate.getDate() + TOTAL_DAYS - 1);
  return examDate;
}
