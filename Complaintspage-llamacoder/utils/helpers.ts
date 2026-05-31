import { NO_CONTACT_STAGES } from './constants';

export const getActionsForDay = (day: number, isNoContact: boolean): string[] => {
  if (isNoContact) {
    const stage = NO_CONTACT_STAGES.find((s) => s.day === day);
    return stage ? stage.actions : ['Standard operating follow-up on next day'];
  }
  return ['Standard operating follow-up on next day'];
};

export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch { return ''; }
};

export const isNearingEscalation = (day: number): boolean => day >= 10;

export const getDaysAgo = (dateStr: string): number => {
  try {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - date.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  } catch { return 0; }
};

export const isToday = (dateStr: string | undefined): boolean => {
  if (!dateStr) return false;
  try {
    return new Date(dateStr).toDateString() === new Date().toDateString();
  } catch { return false; }
};

export const isTomorrow = (dateStr: string | undefined): boolean => {
  if (!dateStr) return false;
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(dateStr).toDateString() === tomorrow.toDateString();
  } catch { return false; }
};

export const isFuture = (dateStr: string | undefined): boolean => {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  } catch { return false; }
};

export const getDayCategory = (dateStr: string | undefined): 'today' | 'tomorrow' | 'future' | 'past' => {
  if (!dateStr) return 'past';
  if (isToday(dateStr)) return 'today';
  if (isTomorrow(dateStr)) return 'tomorrow';
  if (isFuture(dateStr)) return 'future';
  return 'past';
};

export const formatCallbackDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch { return ''; }
};