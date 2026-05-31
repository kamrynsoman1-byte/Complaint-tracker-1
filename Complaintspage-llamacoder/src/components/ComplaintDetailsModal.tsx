import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Layers,
  Phone,
  AlertTriangle,
  ArrowRight,
  XCircle,
  RotateCcw,
  History,
  CheckSquare,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Complaint } from '../types/complaints';
import { STATUS_STYLES, LEVEL_STYLES, TIME_OPTIONS, DATE_OPTIONS } from '../utils/constants';
import { formatDate, getActionsForDay, isNearingEscalation, getDaysAgo, formatCallbackDate } from '../utils/helpers';

interface ComplaintDetailsModalProps {
  complaint: Complaint;
  onClose: () => void;
  onUpdateField: (id: string, field: string, value: unknown) => void;
  onConfirmAction: (action: { type: string; targetId: string; message: string }) => void;
  onAdvanceDay: (targetId: string) => void;
}

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  complaint,
  onClose,
  onUpdateField,
  onConfirmAction,
  onAdvanceDay,
}) => {
  const [localComplaint, setLocalComplaint] = useState(complaint);
  const [showNoContactPrompt, setShowNoContactPrompt] = useState(false);
  const [pendingNoContactValue, setPendingNoContactValue] = useState<boolean | null>(null);

  useEffect(() => {
    setLocalComplaint(complaint);
  }, [complaint]);

  const handleFieldChange = (field: keyof Complaint, value: unknown) => {
    setLocalComplaint(prev => ({ ...prev, [field]: value }));
    onUpdateField(complaint.id, field, value);
  };

  const handleNoContactToggle = (checked: boolean) => {
    // Only show prompt when enabling No Contact
    if (checked && !localComplaint.is_no_contact) {
      setPendingNoContactValue(true);
      setShowNoContactPrompt(true);
    } else {
      handleFieldChange('is_no_contact', checked);
    }
  };

  const confirmNoContact = () => {
    if (pendingNoContactValue !== null) {
      handleFieldChange('is_no_contact', pendingNoContactValue);
    }
    setShowNoContactPrompt(false);
    setPendingNoContactValue(null);
  };

  const cancelNoContact = () => {
    setShowNoContactPrompt(false);
    setPendingNoContactValue(null);
  };

  const complaintAge = getDaysAgo(localComplaint.date_added);
  const actionsForDay = getActionsForDay(localComplaint.current_day, localComplaint.is_no_contact);
  const nextDayActions = getActionsForDay(localComplaint.current_day + 1, true);

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
          <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${LEVEL_STYLES[localComplaint.complaint_level]}`}>
                <span className="text-sm font-bold">L{localComplaint.complaint_level}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{localComplaint.complaint_number}</h2>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${STATUS_STYLES[localComplaint.status]}`}>
                    {localComplaint.status}
                  </span>
                  {localComplaint.is_no_contact && (
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

          {/* Day and Actions at the top */}
          <div className="p-4 bg-teal-900/30 border-b border-teal-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-teal-400" />
              <span className="text-white font-bold text-lg">Day {localComplaint.current_day}</span>
              <span className="text-slate-400 mx-2">|</span>
              <span className="text-teal-300">Complaint Age: {complaintAge} day{complaintAge !== 1 ? 's' : ''}</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-teal-400 mb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Actions for Day {localComplaint.current_day}:
              </h4>
              <ul className="space-y-1">
                {actionsForDay.map((action, idx) => (
                  <li key={idx} className="text-sm text-white flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {localComplaint.case_raised && localComplaint.pending_action_text && (
              <div className="bg-rose-500/20 border border-rose-500/50 rounded-lg p-3">
                <p className="text-rose-400 font-medium text-sm">PENDING ACTION: {localComplaint.pending_action_text}</p>
              </div>
            )}
            {isNearingEscalation(localComplaint.current_day) && localComplaint.status === 'Active' && (
              <div className="bg-rose-500/20 border border-rose-500/50 rounded-lg p-3 animate-pulse">
                <p className="text-rose-400 font-medium text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  COMPLAINT IS GOING TO BE ESCALATED - Currently at Day {localComplaint.current_day}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <p className="text-white bg-slate-700/30 p-3 rounded-lg">{localComplaint.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Appointment Time</label>
                <p className="text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  {localComplaint.appointment_time}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Current Day</label>
                <p className="text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" />
                  Day {localComplaint.current_day}
                </p>
              </div>
            </div>

            {/* No Contact Toggle */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localComplaint.is_no_contact}
                  onChange={(e) => handleNoContactToggle(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 focus:ring-teal-500"
                />
                <span className="text-sm text-white font-medium">No Contact Workflow</span>
              </label>
              <p className="text-xs text-rose-300 mt-1 ml-7">
                Enable this if the customer cannot be reached. This will trigger specific follow-up actions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Callback Date</label>
                <select
                  value={localComplaint.next_callback_date}
                  onChange={(e) => handleFieldChange('next_callback_date', e.target.value)}
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
                <select
                  value={localComplaint.next_callback_time}
                  onChange={(e) => {
                    handleFieldChange('next_callback_time', e.target.value);
                    handleFieldChange('appointment_time', e.target.value);
                  }}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  <option value="">Select time...</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Customer Update Since Last Interaction</label>
              <textarea
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-white resize-none"
                rows={3}
                placeholder="What has been done with the customer since the last update?"
                value={localComplaint.last_update_text}
                onChange={(e) => handleFieldChange('last_update_text', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Update Notes <span className="text-rose-400">*</span>
              </label>
              <textarea
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-white resize-none"
                rows={3}
                value={localComplaint.update_notes}
                onChange={(e) => handleFieldChange('update_notes', e.target.value)}
                placeholder="Required before any action..."
              />
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localComplaint.case_raised}
                  onChange={(e) => handleFieldChange('case_raised', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 focus:ring-teal-500"
                />
                <span className="text-sm text-white font-medium">Is there a case raised?</span>
              </label>
              {localComplaint.case_raised && (
                <div className="mt-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Pending Action Details</label>
                  <input
                    type="text"
                    value={localComplaint.pending_action_text}
                    onChange={(e) => handleFieldChange('pending_action_text', e.target.value)}
                    className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                    placeholder="Do not close complaint - pending action..."
                  />
                </div>
              )}
            </div>

            {localComplaint.additional_notes && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Additional Notes</label>
                <p className="text-white bg-slate-700/30 p-3 rounded-lg text-sm">{localComplaint.additional_notes}</p>
              </div>
            )}

            {localComplaint.history && localComplaint.history.length > 0 && (
              <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-teal-400" />
                  History
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {localComplaint.history.map((h) => (
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
            {(localComplaint.status === 'Closed' || localComplaint.status === 'Escalated') ? (
              <>
                <button
                  onClick={() => onConfirmAction({ type: 'reopen', targetId: localComplaint.id, message: 'Reopen this complaint? It will be moved back to the backlog.' })}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4 inline mr-1" />
                  Reopen Complaint
                </button>
                <button
                  onClick={() => onConfirmAction({ type: 'delete', targetId: localComplaint.id, message: 'Are you sure you want to DELETE this complaint? This action cannot be undone!' })}
                  className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg text-sm font-medium transition-colors ml-auto"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onConfirmAction({ type: 'escalate', targetId: localComplaint.id, message: 'Escalate this complaint to higher authority?' })}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Escalate
                </button>
                <button
                  onClick={() => onAdvanceDay(localComplaint.id)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <ArrowRight className="w-4 h-4 inline mr-1" />
                  Next Day
                </button>
                <button
                  onClick={() => onConfirmAction({ type: 'close', targetId: localComplaint.id, message: 'Close this complaint? This will move it to the closed complaints page.' })}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Close Complaint
                </button>
                <button
                  onClick={() => onConfirmAction({ type: 'delete', targetId: localComplaint.id, message: 'Are you sure you want to DELETE this complaint? This action cannot be undone!' })}
                  className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg text-sm font-medium transition-colors ml-auto"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* No Contact Prompt Modal */}
      {showNoContactPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full border border-rose-500/50 shadow-2xl">
            <div className="p-4 border-b border-slate-700 bg-rose-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/20 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">No Contact Workflow</h3>
                  <p className="text-sm text-rose-300">Enabling No Contact for Day {localComplaint.current_day + 1}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-slate-300 mb-4">
                You are enabling the <span className="text-rose-400 font-medium">No Contact</span> workflow. 
                The following actions will be required on the next day:
              </p>
              
              <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-teal-400 mb-2 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Day {localComplaint.current_day + 1} Actions:
                </h4>
                <ul className="space-y-1">
                  {nextDayActions.length > 0 ? (
                    nextDayActions.map((action, idx) => (
                      <li key={idx} className="text-sm text-white flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        {action}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-400">Standard operating follow-up on next day</li>
                  )}
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <p className="text-amber-300 text-xs">
                  <strong>Note:</strong> Please ensure Update Notes are filled before confirming.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
              <button
                onClick={cancelNoContact}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmNoContact}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors"
              >
                Confirm No Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};