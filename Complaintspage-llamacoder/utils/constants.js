export const NO_CONTACT_STAGES = [
  { day: 1, stage: 'Day 1', actions: ['2 Calls (AM & PM)', 'Voice, SMS or Email requesting info'] },
  { day: 2, stage: 'Day 2', actions: ['Investigate the account'] },
  { day: 3, stage: 'Day 3', actions: ['2 Calls (AM & PM)'] },
  { day: 4, stage: 'Day 4', actions: ['Monitor account, check case updates'] },
  { day: 5, stage: 'Day 5', actions: ['Monitor account, check case updates'] },
  { day: 6, stage: 'Day 6', actions: ['2 Calls (AM & PM)', 'Send info request closure (Email/Letter)'] },
  { day: 7, stage: 'Day 7', actions: ['2 Calls (AM & PM)', 'Monitor case updates'] },
  { day: 8, stage: 'Day 8', actions: ['Monitor account, check case updates'] },
  { day: 9, stage: 'Day 9', actions: ['Monitor account, check case updates'] },
  { day: 10, stage: 'Day 10', actions: ['Close case (Email)'] },
  { day: 11, stage: 'Day 11', actions: ['Prepare final closure documentation'] },
  { day: 12, stage: 'Day 12', actions: ['Close case (Letter)', 'Final review and archive'] },
];

export const generateTimeOptions = () => {
  const times = [];
  for (let h = 9; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 20 && m > 0) continue;
      const hh = h < 10 ? `0${h}` : `${h}`;
      const mm = m === 0 ? '00' : `${m}`;
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
};

export const TIME_OPTIONS = generateTimeOptions();

export const STATUS_STYLES = {
  Active: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Escalated: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'On Hold': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export const LEVEL_STYLES = {
  2: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  3: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  4: 'bg-orange-500/30 text-orange-400 border-orange-500/50',
  5: 'bg-rose-500/30 text-rose-400 border-rose-500/50',
};

export const STORAGE_KEY = 'complaintsData';

export const generateDateOptions = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export const DATE_OPTIONS = generateDateOptions();