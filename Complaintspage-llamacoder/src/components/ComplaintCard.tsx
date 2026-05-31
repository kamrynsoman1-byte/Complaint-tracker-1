import React from 'react';
import {
  Clock,
  Phone,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  ArrowRight,
  XCircle,
  Trash2,
} from 'lucide-react';
import { Complaint } from '../types/complaints';
import { STATUS_STYLES, LEVEL_STYLES } from '../utils/constants';
import { isNearingEscalation, getDaysAgo, formatCallbackDate } from '../utils/helpers';

interface ComplaintCardProps {
  complaint: Complaint;
  onViewDetails: (complaint: Complaint) => void;
  onToggleExpand: (id: string, currentState: boolean) => void;
  onConfirmAction: (action: { type: string; targetId: string; message: string }) => void;
  onAdvanceDay: (targetId: string) => void;
  onUpdateField: (id: string, field: string, value: unknown) => void;
  showExpand?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onViewDetails,
  onToggleExpand,
  onConfirmAction,
  onAdvanceDay,
  onUpdateField,
  showExpand = true,
}) => {
  const complaintAge = getDaysAgo(complaint.date_added);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden transition-all hover:border-slate-600">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2.5 rounded-lg border ${LEVEL_STYLES[complaint.complaint_level]}`}>
              <span className="text-lg font-bold">L{complaint.complaint_level}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">{complaint.complaint_number}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${STATUS_STYLES[complaint.status]}`}>
                  {complaint.status}
                </span>
                {complaint.is_no_contact && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    No Contact
                  </span>
                )}
                {complaint.case_raised && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Case Raised
                  </span>
                )}
                {isNearingEscalation(complaint.current_day) && complaint.status === 'Active' && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-500 text-white border border-rose-500 animate-pulse">
                    Nearing Escalation
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm truncate">{complaint.description}</p>
              {complaint.case_raised && complaint.pending_action_text && (
                <p className="text-rose-400 text-xs mt-1 font-medium">PENDING ACTION: {complaint.pending_action_text}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {complaint.appointment_time}
                </span>
                <span className="flex items-center gap-1 text-teal-400 font-medium">
                  Age: {complaintAge} day{complaintAge !== 1 ? 's' : ''} | Day {complaint.current_day}
                </span>
                {complaint.next_callback_date && (
                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                    <Phone className="w-3.5 h-3.5" />
                    Callback: {formatCallbackDate(complaint.next_callback_date)} {complaint.next_callback_time}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(complaint)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              View Details
            </button>
            {showExpand && (
              <button
                onClick={() => onToggleExpand(complaint.id, complaint.is_expanded)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {complaint.is_expanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {complaint.is_expanded && showExpand && (
        <div className="border-t border-slate-700 p-4 bg-slate-700/20">
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Update Notes <span className="text-rose-400">*</span>
            </label>
            <textarea
              className="w-full p-2.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-white text-sm resize-none"
              rows={2}
              value={complaint.update_notes}
              onChange={(e) => onUpdateField(complaint.id, 'update_notes', e.target.value)}
              placeholder="Required before any action..."
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={complaint.case_raised}
                onChange={(e) => onUpdateField(complaint.id, 'case_raised', e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 focus:ring-teal-500"
              />
              <span className="text-sm text-white">Case has been raised</span>
            </label>
            {complaint.case_raised && (
              <input
                type="text"
                placeholder="Pending action details..."
                value={complaint.pending_action_text}
                onChange={(e) => onUpdateField(complaint.id, 'pending_action_text', e.target.value)}
                className="w-full mt-2 p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => onConfirmAction({ type: 'escalate', targetId: complaint.id, message: 'Escalate this complaint to higher authority?' })}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
              Escalate
            </button>
            <button
              onClick={() => onAdvanceDay(complaint.id)}
              className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 inline mr-1" />
              Next Day
            </button>
            <button
              onClick={() => onConfirmAction({ type: 'close', targetId: complaint.id, message: 'Close this complaint? This will move it to the closed complaints page.' })}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <XCircle className="w-3.5 h-3.5 inline mr-1" />
              Close Case
            </button>
            <button
              onClick={() => onConfirmAction({ type: 'delete', targetId: complaint.id, message: 'Are you sure you want to DELETE this complaint? This action cannot be undone!' })}
              className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};