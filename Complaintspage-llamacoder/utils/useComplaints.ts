'use client';

import { useState, useEffect, useMemo } from 'react';
import { NO_CONTACT_STAGES } from './constants';
import type { Complaint, CreateComplaintData } from '../types';

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('complaintsData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setComplaints(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Failed to parse stored complaints', e);
        setComplaints([]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('complaintsData', JSON.stringify(complaints));
      } catch (e) {
        console.error('Failed to save complaints', e);
      }
    }
  }, [complaints, loading]);

  const createComplaint = (data: CreateComplaintData) => {
    const newComplaint: Complaint = {
      id: `local-${Date.now()}`,
      complaint_number: data.complaint_number,
      appointment_time: data.appointment_time,
      description: data.description,
      additional_notes: data.additional_notes || '',
      next_callback_time: '',
      next_callback_date: '',
      complaint_level: data.complaint_level,
      is_no_contact: data.is_no_contact,
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
        note: `Level ${data.complaint_level} complaint logged. ${data.is_no_contact ? 'No Contact workflow enabled.' : 'Standard workflow.'}`,
      }],
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const updateField = (id: string, field: keyof Complaint, value: unknown) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  const reopenComplaint = (id: string) => {
    setComplaints((prev) => prev.map((c) => {
      if (c.id === id) {
        const history = c.history || [];
        return { ...c, status: 'Active' as const, closed_at: undefined, escalated_at: undefined, history: [...history, { id: `hist-${Date.now()}`, timestamp: new Date().toISOString(), action: 'Case Reopened', note: 'Complaint has been reopened and returned to backlog.' }] };
      }
      return c;
    }));
  };

  const closeComplaint = (id: string) => {
    setComplaints((prev) => prev.map((c) => {
      if (c.id === id) {
        const history = c.history || [];
        return { ...c, status: 'Closed' as const, closed_at: new Date().toISOString(), history: [...history, { id: `hist-${Date.now()}`, timestamp: new Date().toISOString(), action: 'Case Closed', note: 'Complaint has been closed and archived.' }] };
      }
      return c;
    }));
  };

  const escalateComplaint = (id: string) => {
    setComplaints((prev) => prev.map((c) => {
      if (c.id === id) {
        const history = c.history || [];
        return { ...c, status: 'Escalated' as const, escalated_at: new Date().toISOString(), history: [...history, { id: `hist-${Date.now()}`, timestamp: new Date().toISOString(), action: 'Case Escalated', note: 'Complaint has been escalated to higher authority.' }] };
      }
      return c;
    }));
  };

  const advanceDay = (id: string, callbackDate: string, callbackTime: string) => {
    setComplaints((prev) => prev.map((c) => {
      if (c.id === id) {
        const nextDay = c.current_day + 1;
        const stageObj = NO_CONTACT_STAGES.find((s) => s.day === nextDay);
        const newStage = stageObj ? stageObj.stage : `Day ${nextDay}`;
        const history = c.history || [];
        return { ...c, current_day: nextDay, current_stage: newStage, next_callback_date: callbackDate, next_callback_time: callbackTime, history: [...history, { id: `hist-${Date.now()}`, timestamp: new Date().toISOString(), action: 'Day Advanced', note: `Moved from Day ${c.current_day} to Day ${nextDay}. Callback scheduled for ${callbackDate} at ${callbackTime}.` }] };
      }
      return c;
    }));
  };

  const deleteComplaint = (id: string) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleExpand = (id: string, currentState: boolean) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, is_expanded: !currentState } : c));
  };

  const backlogComplaints = useMemo(() => complaints.filter((c) => c.status !== 'Escalated' && c.status !== 'Closed'), [complaints]);
  const closedComplaints = useMemo(() => complaints.filter((c) => c.status === 'Escalated' || c.status === 'Closed'), [complaints]);
  const stats = useMemo(() => ({
    active: complaints.filter((c) => c.status === 'Active').length,
    escalated: complaints.filter((c) => c.status === 'Escalated').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
    closed: complaints.filter((c) => c.status === 'Closed').length,
  }), [complaints]);

  return { complaints, loading, backlogComplaints, closedComplaints, stats, createComplaint, updateField, reopenComplaint, closeComplaint, escalateComplaint, advanceDay, deleteComplaint, toggleExpand, setLoading };
};