export interface Complaint {
  id: string;
  complaint_number: string;
  appointment_time: string;
  description: string;
  additional_notes: string;
  next_callback_time: string;
  next_callback_date: string;
  complaint_level: 2 | 3 | 4 | 5;
  is_no_contact: boolean;
  current_day: number;
  current_stage: string;
  update_notes: string;
  status: 'Active' | 'Resolved' | 'Escalated' | 'Closed' | 'On Hold';
  date_added: string;
  is_expanded: boolean;
  case_raised: boolean;
  pending_action_text: string;
  last_update_text: string;
  history: HistoryEntry[];
  closed_at?: string;
  escalated_at?: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  note: string;
}

export interface CreateComplaintData {
  complaint_number: string;
  appointment_time: string;
  description: string;
  additional_notes: string;
  complaint_level: 2 | 3 | 4 | 5;
  is_no_contact: boolean;
}

export interface ConfirmAction {
  type: 'close' | 'escalate' | 'reopen' | 'delete';
  targetId: string;
  message: string;
}