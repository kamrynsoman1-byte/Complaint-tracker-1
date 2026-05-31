import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { TIME_OPTIONS } from '../utils/constants';

interface AddComplaintModalProps {
  onClose: () => void;
  onCreate: (data: {
    complaint_number: string;
    appointment_time: string;
    description: string;
    additional_notes: string;
    complaint_level: 2 | 3 | 4 | 5;
    is_no_contact: boolean;
  }) => void;
}

export const AddComplaintModal: React.FC<AddComplaintModalProps> = ({ onClose, onCreate }) => {
  const [formComplaintNumber, setFormComplaintNumber] = useState('');
  const [formAppointmentTime, setFormAppointmentTime] = useState('09:00');
  const [formDescription, setFormDescription] = useState('');
  const [formAdditionalNotes, setFormAdditionalNotes] = useState('');
  const [formLevel, setFormLevel] = useState<2 | 3 | 4 | 5>(2);
  const [formIsNoContact, setFormIsNoContact] = useState(true);
  const [errors, setErrors] = useState<{ complaint_number?: string; description?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { complaint_number?: string; description?: string } = {};
    
    if (!formComplaintNumber.trim()) {
      newErrors.complaint_number = 'Complaint Number is mandatory. Please enter a complaint number.';
    }
    
    if (!formDescription.trim()) {
      newErrors.description = 'Description is required.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      return;
    }
    
    onCreate({
      complaint_number: formComplaintNumber.trim(),
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
          {/* Mandatory Reminder Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 text-sm font-medium">Required Fields</p>
              <p className="text-amber-400/80 text-xs">Complaint Number and Description are mandatory.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Complaint Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formComplaintNumber}
              onChange={(e) => {
                setFormComplaintNumber(e.target.value);
                if (errors.complaint_number) setErrors(prev => ({ ...prev, complaint_number: undefined }));
              }}
              className={`w-full p-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                errors.complaint_number ? 'border-rose-500' : 'border-slate-600'
              }`}
              placeholder="Enter complaint number..."
            />
            {errors.complaint_number && (
              <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.complaint_number}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Appointment Time</label>
            <select
              value={formAppointmentTime}
              onChange={(e) => setFormAppointmentTime(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => {
                setFormDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
              }}
              className={`w-full p-3 bg-slate-700/50 border rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                errors.description ? 'border-rose-500' : 'border-slate-600'
              }`}
              rows={3}
              placeholder="Describe the complaint..."
            />
            {errors.description && (
              <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Additional Notes</label>
            <textarea
              value={formAdditionalNotes}
              onChange={(e) => setFormAdditionalNotes(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Complaint Level</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setFormLevel(level as 2 | 3 | 4 | 5)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    formLevel === level
                      ? level >= 4 ? 'bg-rose-600 text-white' : 'bg-teal-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Level {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="noContact"
              checked={formIsNoContact}
              onChange={(e) => setFormIsNoContact(e.target.checked)}
              className="w-5 h-5 rounded border-slate-600 bg-slate-700 focus:ring-teal-500"
            />
            <label htmlFor="noContact" className="text-sm text-white">No Contact Workflow</label>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            Create Complaint
          </button>
        </div>
      </div>
    </div>
  );
};