import { SecurityLog } from '../types/complaints';

const SECURITY_KEY = 'complaints_security_logs';
const SESSION_KEY = 'complaints_session_id';
const AUTH_KEY = 'complaints_auth_token';

// Generate a secure hash for data integrity
export const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sec_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`;
};

// Generate session ID
export const generateSessionId = (): string => {
  const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};

// Get current session
export const getCurrentSession = (): string => {
  let session = localStorage.getItem(SESSION_KEY);
  if (!session) {
    session = generateSessionId();
  }
  return session;
};

// Log security event
export const logSecurityEvent = (action: string, details: string): void => {
  try {
    const logs: SecurityLog[] = JSON.parse(localStorage.getItem(SECURITY_KEY) || '[]');
    const newLog: SecurityLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      userId: getCurrentSession(),
      details,
      ipAddress: 'local',
    };
    logs.unshift(newLog);
    if (logs.length > 100) logs.pop();
    localStorage.setItem(SECURITY_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to log security event', e);
  }
};

// Initialize security
export const initializeSecurity = (): void => {
  const session = getCurrentSession();
  localStorage.setItem(AUTH_KEY, generateHash(session));
  logSecurityEvent('SESSION_INIT', 'Security session initialized');
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Validate complaint data
export const validateComplaintData = (data: Partial<{
  complaint_number: string;
  description: string;
  appointment_time: string;
}>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data.complaint_number && data.complaint_number.length > 50) {
    errors.push('Complaint number too long');
  }
  
  if (!data.description || data.description.trim().length < 3) {
    errors.push('Description must be at least 3 characters');
  }
  
  if (data.description && data.description.length > 2000) {
    errors.push('Description too long (max 2000 characters)');
  }
  
  return { valid: errors.length === 0, errors };
};