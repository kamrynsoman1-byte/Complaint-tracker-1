import { useState, useEffect, useMemo, useCallback } from 'react';
import { Complaint, ComplaintHistory } from '../types/complaints';
import { NO_CONTACT_STAGES, STORAGE_KEY } from './constants';
import { generateHash, logSecurityEvent, sanitizeInput, validateComplaintData, initializeSecurity } from './security';

const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    id: 'local-1',
    complaint_number: 'COMP-1001',
    appointment_time: '10:00',
    description: 'Customer reported billing discrepancy on Q3 invoice',
    additional_notes: '',
    next_callback_time: '',
    next_callback_date: '',
    complaint_level: 3,
    is_no_contact: false,
    current_day: 2,
    current_stage: 'Day 2',
    update_notes: '',
    status: 'Active',
    date_added: new Date().toISOString(),
    is_expanded: false,
    case_raised: false,
    pending_action_text: '',
    last_update_text: '',
    history: [],
  },
  {
    id: 'local-2',
    complaint_number: 'COMP-1002',
    appointment_time: '11:30',
    description: 'Service interruption affecting multiple users',
    additional_notes: '',
    next_callback_time: '',
    next_callback_date: '',
    complaint_level: 4,
    is_no_contact: true,
    current_day: 5,
    current_stage: 'Day 5',
    update_notes: '',
    status: 'Active',
    date_added: new Date(Date.now() - 4 * 86400000).toISOString(),
    is_expanded: false,
    case_raised: true,
    pending_action_text: 'Follow up with customer',
    last_update_text: '',
    history: [],
  },
  {
    id: 'local-3',
    complaint_number: 'COMP-1003',
    appointment_time: '15:00',
    description: 'Product delivery delayed beyond estimated date',
    additional_notes: 'Customer is VIP',
    next_callback_time: '',
    next_callback_date: '',
    complaint_level: 2,
    is_no_contact: false,
    current_day: 1,
    current_stage: 'Day 1',
    update_notes: '',
    status: 'Active',
    date_added: new Date().toISOString(),
    is_expanded: false,
    case_raised: false,
    pending_action_text: '',
    last_update_text: '',
    history: [],
  },
];

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSecurity();
    
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setComplaints(parsed);
        logSecurityEvent('DATA_LOAD', `Loaded ${parsed.length} complaints from storage`);
      } catch {
        logSecurityEvent('DATA_LOAD_ERROR', 'Failed to parse stored data');
        setComplaints(SAMPLE_COMPLAINTS);
      }
    } else {
      setComplaints(SAMPLE_COMPLAINTS);
      logSecurityEvent('DATA_INIT', 'Initialized with sample data');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (complaints.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [complaints, loading]);

  const addHistoryEntry = useCallback((action: string, note: string): ComplaintHistory => {
    return {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      note,
    };
  }, []);

  const createComplaint = useCallback((data: Partial<Complaint>) => {
    const validation = validateComplaintData(data);
    if (!validation.valid) {
      logSecurityEvent('VALIDATION_ERROR', validation.errors.join(', '));
      alert(validation.errors.join('\n'));
      return null;
    }

    const sanitizedDescription = sanitizeInput(data.description || '');
    const sanitizedNotes = sanitizeInput(data.additional_notes || '');
    
    const newComplaint: Complaint = {
      id: `local-${Date.now()}`,
      complaint_number: sanitizeInput(data.complaint_number || `COMP-${Math.floor(Math.random() * 1000000)}`),
      appointment_time: data.appointment_time || '09:00',
      description: sanitizedDescription,
      additional_notes: sanitizedNotes,
      next_callback_time: '',
      next_callback_date: '',
      complaint_level: data.complaint_level || 2,
      is_no_contact: data.is_no_contact ?? true,
      current_day: 1,
      current_stage: 'Day 1',
      update_notes: 'Initial case created',
      status: 'Active',
      date_added: new Date().toISOString(),
      is_expanded: false,
      case_raised: false,
      pending_action_text: '',
      last_update_text: '',
      history: [{
        id: `hist-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Case Created',
        note: `Level ${data.complaint_level || 2} complaint logged. ${data.is_no_contact ? 'No Contact workflow enabled.' : 'Standard workflow.'}`,
      }],
      security_hash: generateHash(sanitizedDescription + Date.now()),
      created_by: 'current_user',
      last_modified: new Date().toISOString(),
    };
    
    setComplaints(prev => [newComplaint, ...prev]);
    logSecurityEvent('CREATE_COMPLAINT', `Created complaint ${newComplaint.complaint_number}`);
    return newComplaint;
  }, []);

  const updateField = useCallback((id: string, field: keyof Complaint, value: unknown) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        
        let sanitizedValue = value;
        if (typeof value === 'string') {
          sanitizedValue = sanitizeInput(value);
        }
        
        return { 
          ...c, 
          [field]: sanitizedValue,
          last_modified: new Date().toISOString(),
        };
      })
    );
    logSecurityEvent('UPDATE_FIELD', `Updated ${field} for complaint ${id}`);
  }, []);

  const reopenComplaint = useCallback((id: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const history = [...c.history, addHistoryEntry('Case Reopened', 'Complaint has been reopened and returned to backlog.')];
        return { ...c, status: 'Active' as const, closed_at: undefined, escalated_at: undefined, history };
      })
    );
    logSecurityEvent('REOPEN_COMPLAINT', `Reopened complaint ${id}`);
  }, [addHistoryEntry]);

  const closeComplaint = useCallback((id: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const history = [...c.history, addHistoryEntry('Case Closed', 'Complaint has been closed and archived.')];
        return { ...c, status: 'Closed' as const, closed_at: new Date().toISOString(), history };
      })
    );
    logSecurityEvent('CLOSE_COMPLAINT', `Closed complaint ${id}`);
  }, [addHistoryEntry]);

  const resolveComplaint = useCallback((id: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const history = [...c.history, addHistoryEntry('Case Resolved', 'Complaint has been resolved successfully.')];
        return { ...c, status: 'Resolved' as const, history };
      })
    );
    logSecurityEvent('RESOLVE_COMPLAINT', `Resolved complaint ${id}`);
  }, [addHistoryEntry]);

  const escalateComplaint = useCallback((id: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const history = [...c.history, addHistoryEntry('Case Escalated', 'Complaint has been escalated to higher authority.')];
        return { ...c, status: 'Escalated' as const, escalated_at: new Date().toISOString(), history };
      })
    );
    logSecurityEvent('ESCALATE_COMPLAINT', `Escalated complaint ${id}`);
  }, [addHistoryEntry]);

  const advanceDay = useCallback((id: string, callbackDate?: string, callbackTime?: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const nextDay = c.current_day + 1;
        const stageObj = NO_CONTACT_STAGES.find(s => s.day === nextDay);
        const newStage = stageObj ? stageObj.stage : `Day ${nextDay}`;
        const history = [...c.history, addHistoryEntry('Day Advanced', `Moved from Day ${c.current_day} to Day ${nextDay}${callbackDate ? `. Callback scheduled for ${callbackDate}` : ''}`)];
        
        const updates: Partial<Complaint> = {
          current_day: nextDay,
          current_stage: newStage,
          history,
          last_modified: new Date().toISOString(),
        };
        
        if (callbackDate) {
          updates.next_callback_date = callbackDate;
        }
        if (callbackTime) {
          updates.next_callback_time = callbackTime;
          updates.appointment_time = callbackTime;
        }
        
        return { ...c, ...updates };
      })
    );
    logSecurityEvent('ADVANCE_DAY', `Advanced day for complaint ${id}`);
  }, [addHistoryEntry]);

  const deleteComplaint = useCallback((id: string) => {
    setComplaints(prev => {
      const complaint = prev.find(c => c.id === id);
      const complaintNumber = complaint?.complaint_number || id;
      logSecurityEvent('DELETE_COMPLAINT', `Deleted complaint ${complaintNumber}`);
      
      const filtered = prev.filter(c => c.id !== id);
      
      // Immediately update localStorage
      if (filtered.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      
      return filtered;
    });
  }, []);

  const toggleExpand = useCallback((id: string, currentState: boolean) => {
    updateField(id, 'is_expanded', !currentState);
  }, [updateField]);

  const backlogComplaints = useMemo(() => {
    return complaints.filter(c => c.status !== 'Escalated' && c.status !== 'Closed');
  }, [complaints]);

  const closedComplaints = useMemo(() => {
    let result = complaints.filter(c => c.status === 'Escalated' || c.status === 'Closed');
    result.sort((a, b) => 
      new Date(b.closed_at || b.escalated_at || b.date_added).getTime() - 
      new Date(a.closed_at || a.escalated_at || a.date_added).getTime()
    );
    return result;
  }, [complaints]);

  const stats = useMemo(() => ({
    active: complaints.filter(c => c.status === 'Active').length,
    escalated: complaints.filter(c => c.status === 'Escalated').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    closed: complaints.filter(c => c.status === 'Closed').length,
  }), [complaints]);

  return {
    complaints,
    loading,
    backlogComplaints,
    closedComplaints,
    stats,
    createComplaint,
    updateField,
    reopenComplaint,
    closeComplaint,
    resolveComplaint,
    escalateComplaint,
    advanceDay,
    deleteComplaint,
    toggleExpand,
    setLoading,
  };
}