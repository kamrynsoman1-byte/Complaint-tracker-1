'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { ConfirmAction } from '../types';

interface ConfirmModalProps {
  confirmAction: ConfirmAction;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ confirmAction, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-slate-800 rounded-xl max-w-sm w-full p-6 border border-slate-700 shadow-2xl text-center">
      <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
      <h4 className="text-lg font-semibold text-white mb-2">Confirm Action</h4>
      <p className="text-slate-400 mb-6">{confirmAction.message}</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onConfirm} className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors">Yes, Confirm</button>
        <button onClick={onCancel} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">Cancel</button>
      </div>
    </div>
  </div>
);