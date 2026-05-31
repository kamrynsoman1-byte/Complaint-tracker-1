import React, { useState } from 'react';
import { Complaint } from '../types/complaints';
import { STATUS_STYLES, LEVEL_STYLES, getActionsForDay, DATE_OPTIONS } from '../utils/constants';
import { X, Clock, Layers, AlertTriangle, ArrowRight, XCircle, RotateCcw, CheckSquare, History } from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint;
  onClose: () => void;
  onUpdateField: (field: string, value: unknown) => void;
  onReopen: () => void;
  onEscalate: () => void;
  onAdvanceDay: (callbackDate: string, callbackTime: string) => void;
  onCloseComplaint: () => void;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCallbackDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const isNearingEscalation = (day: number) => day >= 10;

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onUpdateField,
  onReopen,
  onEscalate,
  onAdvanceDay,
  onCloseComplaint,
}) => {
  const [callbackDate, setCallbackDate] = useState(complaint.next_callback_date || DATE_OPTIONS[0]);
  const [callbackTime, setCallbackTime] = useState(complaint.next_callback_time || '09:00');

  const handleAdvanceDay = () => {
    onAdvanceDay(callbackDate, callbackTime);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
        <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${LEVEL_STYLES[complaint.complaint_level]}`}>
              <span className="text-sm font-bold">L{complaint.complaint_level}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{complaint.complaint_number}</h2>
              <div className="flex gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${STATUS_STYLES[complaint.status]}`}>
                  {complaint.status}
                </span>
                {complaint.is_no_contact && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    No Contact
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4 bg-slate-700/20 border-b border-slate-700 flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          <span className="text-white font-medium">Day {complaint.current_day}</span>
        </div>

        <div className="p-4 space-y-4">
          {complaint.case_raised && complaint.pending_action_text && (
            <div className="bg-rose-500/20 border border-rose-500/50 rounded-lg p-3">
              <p className="text-rose-400 font-medium text-sm">PENDING ACTION: {complaint.pending_action_text}</p>
            </div>
          )}
          {isNearingEscalation(complaint.current_day) && complaint.status === 'Active' && (
            <div className="bg-rose-500/20 border border-rose-500/50 rounded-lg p-3 animate-pulse">
              <p className="text-rose-400 font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                COMPLAINT IS GOING TO BE ESCALATED - Currently at Day {complaint.current_day}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <p className="text-white bg-slate-700/30 p-3 rounded-lg">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Appointment Time</label>
              <p className="text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                {complaint.appointment_time}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Day</label>
              <p className="text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                Day {complaint.current_day}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Customer Update Since Last Interaction</label>
            <textarea
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-white resize-none"
              rows={3}
              placeholder="What has been done with the customer since the last update?"
              value={complaint.last_update_text}
              onChange={(e) => onUpdateField('last_update_text', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Callback Date</label>
              <select
                value={callbackDate}
                onChange={(e) => setCallbackDate(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="">Select date...</option>
                {DATE_OPTIONS.map((date) => (
                  <option key={date} value={date}>{formatCallbackDate(date)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Callback Time</label>
              <input
                type="text"
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                placeholder="e.g., 10:30"
                value={callbackTime}
                onChange={(e) => setCallbackTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Update Notes</label>
            <textarea
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-white resize-none"
              rows={3}
              value={complaint.update_notes}
              onChange={(e) => onUpdateField('update_notes', e.target.value)}
            />
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={complaint.case_raised}
                onChange={(e) => onUpdateField('case_raised', e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 focus:ring-teal-500"
              />
              <span className="text-sm text-white font-medium">Is there a case raised?</span>
            </label>
            {complaint.case_raised && (
              <div className="mt-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Pending Action Details</label>
                <input
                  type="text"
                  value={complaint.pending_action_text}
                  onChange={(e) => onUpdateField('pending_action_text', e.target.value)}
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                  placeholder="Do not close complaint - pending action..."
                />
              </div>
            )}
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-400" />
              Actions for Day {complaint.current_day}
            </h4>
            <ul className="space-y-1">
              {getActionsForDay(complaint.current_day, complaint.is_no_contact).map((action, idx) => (
                <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {complaint.additional_notes && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Additional Notes</label>
              <p className="text-white bg-slate-700/30 p-3 rounded-lg text-sm">{complaint.additional_notes}</p>
            </div>
          )}

          {complaint.history && complaint.history.length > 0 && (
            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
              <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-teal-400" />
                History
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {complaint.history.map((h) => (
                  <div key={h.id} className="flex items-start gap-3 text-xs border-b border-slate-600 pb-2 last:border-0">
                    <span className="text-slate-500 shrink-0 w-32">{formatDate(h.timestamp)}</span>
                    <div>
                      <span className="text-teal-400 font-medium">{h.action}:</span>{' '}
                      <span className="text-slate-400">{h.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-slate-800 p-4 border-t border-slate-700 flex flex-wrap gap-2">
          {(complaint.status === 'Closed' || complaint.status === 'Escalated') ? (
            <button
              onClick={onReopen}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4 inline mr-1" />
              Reopen Complaint
            </button>
          ) : (
            <>
              <button
                onClick={onEscalate}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Escalate
              </button>
              <button
                onClick={handleAdvanceDay}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <ArrowRight className="w-4 h-4 inline mr-1" />
                Next Day
              </button>
              <button
                onClick={onCloseComplaint}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors ml-auto"
              >
                <XCircle className="w-4 h-4 inline mr-1" />
                Close Complaint
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};