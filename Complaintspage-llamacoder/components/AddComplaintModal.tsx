'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TIME_OPTIONS } from '../utils/constants';
import type { CreateComplaintData } from '../types';

interface AddComplaintModalProps {
  onClose: () => void;
  onCreate: (data: CreateComplaintData) => void;
}

export default function AddComplaintModal({ onClose, onCreate }: AddComplaintModalProps) {
  const [formComplaintNumber, setFormComplaintNumber] = useState('');
  const [formAppointmentTime, setFormAppointmentTime] = useState('09:00');
  const [formDescription, setFormDescription] = useState('');
  const [formAdditionalNotes, setFormAdditionalNotes] = useState('');
  const [formLevel, setFormLevel] = useState<2 | 3 | 4 | 5>(2);
  const [formIsNoContact, setFormIsNoContact] = useState(true);

  const handleCreate = () => {
    if (!formDescription.trim()) { alert('Description is required'); return; }
    onCreate({
      complaint_number: formComplaintNumber.trim() || `COMP-${Math.floor(Math.random() * 1000000)}`,
      appointment_time: formAppointmentTime,
      description: formDescription,
      additional_notes: formAdditionalNotes,
      complaint_level: formLevel,
      is_no_contact: formIsNoContact,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-700 shadow-2xl">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">New Complaint</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Complaint Number (Optional)
            </label>
            <input
              type="text"
              value={formComplaintNumber}
              onChange={(e) => setFormComplaintNumber(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              placeholder="Auto-generated if empty"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Appointment Time
            </label>
            <select
              value={formAppointmentTime}
              onChange={(e) => setFormAppointmentTime(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none"
              rows={3}
              placeholder="Describe the complaint..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formAdditionalNotes}
              onChange={(e) => setFormAdditionalNotes(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Complaint Level
            </label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setFormLevel(level as 2 | 3 | 4 | 5)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    formLevel === level
                      ? level >= 4
                        ? 'bg-rose-600 text-white'
                        : 'bg-teal-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  L{level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="noContact"
              checked={formIsNoContact}
              onChange={(e) => setFormIsNoContact(e.target.checked)}
              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="noContact" className="text-sm text-slate-300">
              No Contact Workflow
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            Create Complaint
          </button>
        </div>
      </div>
    </div>
  );
}