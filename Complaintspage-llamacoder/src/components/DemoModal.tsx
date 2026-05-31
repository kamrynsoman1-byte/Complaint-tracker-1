import React, { useState } from 'react';
import {
  X,
  Plus,
  ArrowRight,
  Clock,
  Calendar,
  AlertTriangle,
  Trash2,
  CheckCircle,
  FileText,
  Phone,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Layers,
} from 'lucide-react';

interface DemoModalProps {
  onClose: () => void;
}

const DEMO_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Complaints System',
    icon: Briefcase,
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          This enterprise case management system helps you track and resolve customer complaints efficiently.
        </p>
        <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-300 text-sm">
            Use the navigation below to learn about each feature. You can reopen this guide anytime by clicking the <strong>Help</strong> button.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'adding',
    title: 'Adding a New Complaint',
    icon: Plus,
    content: (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Plus className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <p className="text-white font-medium">Step 1: Click "New Complaint"</p>
            <p className="text-slate-400 text-sm">Located in the top right corner of the dashboard.</p>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-400" />
            <span className="text-sm text-white"><strong>Complaint Number:</strong> Required field (auto-generated if empty)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-white"><strong>Appointment Time:</strong> When the complaint was logged</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white"><strong>Level:</strong> Priority level (2-5, where 5 is highest)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-white"><strong>No Contact:</strong> Enable if customer cannot be reached</span>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <p className="text-amber-300 text-xs">
            <strong>Reminder:</strong> The Complaint Number is mandatory. A validation reminder will appear if left empty.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'viewing',
    title: 'Viewing Complaint Details',
    icon: Layers,
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          Click <strong>"View Details"</strong> on any complaint card to see the full information and actions.
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-teal-400 mt-1" />
            <span className="text-sm text-white">See current day and required actions</span>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-teal-400 mt-1" />
            <span className="text-sm text-white">Update callback date and time</span>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-teal-400 mt-1" />
            <span className="text-sm text-white">Add customer updates and notes</span>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-teal-400 mt-1" />
            <span className="text-sm text-white">Mark case as raised with pending actions</span>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-teal-400 mt-1" />
            <span className="text-sm text-white">View complete history</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'nextday',
    title: 'Advancing to Next Day',
    icon: ArrowRight,
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          The <strong>"Next Day"</strong> button moves the complaint forward in the workflow.
        </p>
        <div className="space-y-3">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-white font-medium mb-2">Prerequisites:</p>
            <ul className="space-y-1">
              <li className="text-sm text-slate-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Update Notes must be filled
              </li>
            </ul>
          </div>
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
            <p className="text-white font-medium mb-2">When you click Next Day:</p>
            <ul className="space-y-2">
              <li className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-teal-400 font-bold">1.</span>
                A modal prompts for callback date and time
              </li>
              <li className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-teal-400 font-bold">2.</span>
                Select when to follow up with the customer
              </li>
              <li className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-teal-400 font-bold">3.</span>
                Complaint moves to the next day in workflow
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'nocontact',
    title: 'No Contact Workflow',
    icon: Phone,
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          Enable <strong>"No Contact"</strong> when the customer cannot be reached.
        </p>
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 space-y-3">
          <p className="text-rose-300 font-medium">What happens when enabled:</p>
          <ul className="space-y-2">
            <li className="text-sm text-white flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5" />
              A prompt shows the required actions for the next day
            </li>
            <li className="text-sm text-white flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5" />
              Specific follow-up workflow is triggered (calls, emails, monitoring)
            </li>
            <li className="text-sm text-white flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5" />
              Complaint is flagged with "No Contact" badge
            </li>
          </ul>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-slate-400 text-xs">
            The No Contact workflow follows a 12-day process with specific actions each day, including calls, investigations, and case closure procedures.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'actions',
    title: 'Other Actions',
    icon: AlertTriangle,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-white font-medium text-sm">Escalate</span>
            </div>
            <p className="text-slate-400 text-xs">Move to higher authority. Requires update notes.</p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <X className="w-4 h-4 text-rose-400" />
              <span className="text-white font-medium text-sm">Close</span>
            </div>
            <p className="text-slate-400 text-xs">Archive the complaint. Requires update notes.</p>
          </div>
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="w-4 h-4 text-teal-400 rotate-180" />
              <span className="text-white font-medium text-sm">Reopen</span>
            </div>
            <p className="text-slate-400 text-xs">Bring back closed complaints to backlog.</p>
          </div>
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span className="text-white font-medium text-sm">Delete</span>
            </div>
            <p className="text-slate-400 text-xs">Permanently remove. No notes required.</p>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <p className="text-amber-300 text-xs">
            <strong>Important:</strong> All actions except Delete require Update Notes to be filled first.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'deleting',
    title: 'Deleting a Complaint',
    icon: Trash2,
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 font-medium">Warning: Permanent Action</span>
          </div>
          <p className="text-slate-300 text-sm">
            Deleting a complaint removes it permanently from the system. This action cannot be undone.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-white font-medium">How to delete:</p>
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">1.</span>
              <span className="text-sm text-white">Open complaint details (View Details)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">2.</span>
              <span className="text-sm text-white">Scroll to bottom actions</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">3.</span>
              <span className="text-sm text-white">Click red "Delete" button</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">4.</span>
              <span className="text-sm text-white">Confirm the deletion prompt</span>
            </div>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
          <p className="text-emerald-300 text-xs">
            <strong>Tip:</strong> Consider using "Close" instead of "Delete" to keep a record of resolved complaints.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'reminders',
    title: 'Reminder System',
    icon: Calendar,
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">
          The system includes built-in reminders to ensure timely follow-up.
        </p>
        <div className="space-y-3">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-white font-medium mb-2">Automatic Reminders:</p>
            <ul className="space-y-2">
              <li className="text-sm text-slate-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Complaints grouped by callback date (Today, Tomorrow, Future)
              </li>
              <li className="text-sm text-slate-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Visual warning when nearing escalation (Day 10+)
              </li>
              <li className="text-sm text-slate-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                Pulsing alert for complaints requiring immediate attention
              </li>
            </ul>
          </div>
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
            <p className="text-white font-medium mb-2">Setting Callbacks:</p>
            <p className="text-sm text-slate-300">
              When advancing to the next day, you're prompted to set a callback date and time. This helps organize your backlog by priority.
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export const DemoModal: React.FC<DemoModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = DEMO_STEPS[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <StepIcon className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{step.title}</h2>
              <p className="text-xs text-slate-400">
                Step {currentStep + 1} of {DEMO_STEPS.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-2 bg-slate-900/30">
          <div className="flex gap-1">
            {DEMO_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-teal-500'
                    : idx < currentStep
                    ? 'bg-teal-500/50'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step.content}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex items-center justify-between bg-slate-900/50">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              currentStep === 0
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex gap-2">
            {currentStep === DEMO_STEPS.length - 1 ? (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
              >
                Got it!
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};