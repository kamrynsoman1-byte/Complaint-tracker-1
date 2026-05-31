import { useState, useEffect, useMemo } from 'react';
import { Complaint } from '../types/complaints';
import { NO_CONTACT_STAGES } from './constants';

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const storedData = localStorage.getItem('complaintsData');
    if (storedData) {
      try {
        setComplaints(JSON.parse(storedData));
      } catch (e) {
        console.error('Failed to parse stored complaints', e);
        setComplaints([]);
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever complaints change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('complaintsData', JSON.stringify(complaints));
    }
  }, [complaints, loading]);

  // Create complaint
  const createComplaint = (data: {
    complaint_number: string;
    appointment_time: string;
    description: string;
    additional_notes: string;
    complaint_level: 2 | 3 | 4 | 5;
    is_no_contact: boolean;
  }) => {
    const newComplaint: Complaint = {
      id: `local-${Date.now()}`,
      complaint_number: data.complaint_number,
      appointment_time: data.appointment_time,
      description: data.description,
      additional_notes: data.additional_notes,
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
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Case Created',
          note: `Level ${data.complaint_level} complaint logged. ${data.is_no_contact ? 'No Contact workflow enabled.' : 'Standard workflow.'}`,
        },
      ],
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  // Update field
  const updateField = (id: string, field: keyof Complaint, value: unknown) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  // Reopen complaint
  const reopenComplaint = (id: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = {
            ...c,
            status: 'Active' as const,
            closed_at: undefined,
            escalated_at: undefined,
          };
          updated.history = [
            ...(updated.history || []),
            {
              id: `hist-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: 'Case Reopened',
              note: 'Complaint has been reopened and returned to backlog.',
            },
          ];
          return updated;
        }
        return c;
      })
    );
  };

  // Close complaint
  const closeComplaint = (id: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = {
            ...c,
            status: 'Closed' as const,
            closed_at: new Date().toISOString(),
          };
          updated.history = [
            ...(updated.history || []),
            {
              id: `hist-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: 'Case Closed',
              note: 'Complaint has been closed and archived.',
            },
          ];
          return updated;
        }
        return c;
      })
    );
  };

  // Escalate complaint
  const escalateComplaint = (id: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = {
            ...c,
            status: 'Escalated' as const,
            escalated_at: new Date().toISOString(),
          };
          updated.history = [
            ...(updated.history || []),
            {
              id: `hist-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: 'Case Escalated',
              note: 'Complaint has been escalated to higher authority.',
            },
          ];
          return updated;
        }
        return c;
      })
    );
  };

  // Advance day
  const advanceDay = (id: string, callbackDate: string, callbackTime: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextDay = c.current_day + 1;
          const stageObj = NO_CONTACT_STAGES.find(s => s.day === nextDay);
          const newStage = stageObj ? stageObj.stage : `Day ${nextDay}`;
          const updated = {
            ...c,
            current_day: nextDay,
            current_stage: newStage,
            next_callback_date: callbackDate,
            next_callback_time: callbackTime,
          };
          updated.history = [
            ...(updated.history || []),
            {
              id: `hist-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: 'Day Advanced',
              note: `Moved from Day ${c.current_day} to Day ${nextDay}. Callback scheduled for ${callbackDate} at ${callbackTime}.`,
            },
          ];
          return updated;
        }
        return c;
      })
    );
  };

  // Delete complaint
  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  // Toggle expand
  const toggleExpand = (id: string, currentState: boolean) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          return { ...c, is_expanded: !currentState };
        }
        return c;
      })
    );
  };

  // Computed values
  const backlogComplaints = useMemo(() => {
    return complaints.filter(c => c.status !== 'Escalated' && c.status !== 'Closed');
  }, [complaints]);

  const closedComplaints = useMemo(() => {
    return complaints.filter(c => c.status === 'Escalated' || c.status === 'Closed');
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
    escalateComplaint,
    advanceDay,
    deleteComplaint,
    toggleExpand,
    setLoading,
  };
};