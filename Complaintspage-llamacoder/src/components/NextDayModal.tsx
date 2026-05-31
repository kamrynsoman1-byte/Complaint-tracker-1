import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { TIME_OPTIONS, DATE_OPTIONS } from '../utils/constants';
import { formatCallbackDate } from '../utils/helpers';

interface NextDayModalProps {
  onConfirm: (date: string, time: string) => void;
  onCancel: () => void;
}

export const NextDayModal: React.FC<NextDayModalProps> = ({ onConfirm, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');

  const handleConfirm = () => {
    if (!selectedDate) {
      alert('Please select a callback date.');
      return;
    }
    onConfirm(selectedDate, selectedTime);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full border border-slate-700 shadow-2xl">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-semibold text-white">Advance to Next Day</h2>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <span className="text-slate-400 text-xl">&times;</span>
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="text-slate-400 text-sm">
            Please schedule a callback for the next step.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Callback Date <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">Select date...</option>
              {DATE_OPTIONS.map((date) => (
                <option key={date} value={date}>{formatCallbackDate(date)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Callback Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Advance Day
          </button>
        </div>
      </div>
    </div>
  );
};