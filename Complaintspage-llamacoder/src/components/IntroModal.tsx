import React from 'react';
import { Briefcase, CheckSquare, Clock, AlertTriangle, X } from 'lucide-react';
import { INTRO_SEEN_KEY } from '../utils/constants';

interface IntroModalProps {
  onClose: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ onClose }) => {
  const handleDismiss = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-700 shadow-2xl">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-semibold text-white">Welcome to Complaints System</h2>
          </div>
          <button onClick={handleDismiss} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-4 space-y-4 text-slate-300">
          <p>This system helps you manage customer complaints efficiently with a structured workflow.</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckSquare className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Track Progress</h4>
                <p className="text-sm text-slate-400">Monitor complaints through a 12-day workflow with clear action items.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Schedule Callbacks</h4>
                <p className="text-sm text-slate-400">Set callback times and track customer interactions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Escalation Alerts</h4>
                <p className="text-sm text-slate-400">Get notified when complaints are nearing escalation thresholds.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleDismiss}
            className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};