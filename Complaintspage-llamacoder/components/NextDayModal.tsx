'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TIME_OPTIONS, DATE_OPTIONS } from '../utils/constants';

interface NextDayModalProps {
  onConfirm: (date: string, time: string) => void;
  onCancel: () => void;
}

export const NextDayModal: React.FC<NextDayModalProps> = ({ onConfirm, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0]);
  const [selectedTime, setSelectedTime] = useState('09:00');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full border border-slate-700 shadow-2xl">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Schedule Next Callback</h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Callback Date</label>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
              {DATE_OPTIONS.map((date) => (<option key={date} value={date}>{date}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Callback Time</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
              {TIME_OPTIONS.map((time) => (<option key={time} value={time}>{time}</option>))}
            </select>
          </div>
        </div>
        <div className="p-4 border-t border-slate-700 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">Cancel</button>
          <button onClick={() => onConfirm(selectedDate, selectedTime)} className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  );
};