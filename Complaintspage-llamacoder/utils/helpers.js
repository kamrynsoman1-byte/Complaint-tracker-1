import { NO_CONTACT_STAGES } from './constants';

export const getActionsForDay = (day, isNoContact) => {
  if (isNoContact) {
    const stage = NO_CONTACT_STAGES.find((s) => s.day === day);
    return stage ? stage.actions : ['Standard operating follow-up on next day'];
  }
  return ['Standard operating follow-up on next day'];
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

export const isNearingEscalation = (day) => day >= 10;

export const generateComplaintNumber = () => {
  return `COMP-${Math.floor(Math.random() * 1000000)}`;
};

export const getDaysAgo = (dateStr) => {
  try {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch {
    return 0;
  }
};

export const isToday = (dateStr) => {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch {
    return false;
  }
};

export const isTomorrow = (dateStr) => {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  } catch {
    return false;
  }
};

export const isFuture = (dateStr) => {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  } catch {
    return false;
  }
};

export const getDayCategory = (dateStr) => {
  if (!dateStr) return 'past';
  if (isToday(dateStr)) return 'today';
  if (isTomorrow(dateStr)) return 'tomorrow';
  if (isFuture(dateStr)) return 'future';
  return 'past';
};

export const formatCallbackDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};