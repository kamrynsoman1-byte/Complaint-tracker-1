'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  RefreshCw,
  Search,
  Layers,
  Archive,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useComplaints } from '@/utils/useComplaints';
import { StatsCard } from '@/components/StatsCard';
import { ComplaintCard } from '@/components/ComplaintCard';
import { ComplaintDetailsModal } from '@/components/ComplaintDetailModal';
import { AddComplaintModal } from '@/components/AddComplaintModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { NextDayModal } from '@/components/NextDayModal';
import { getDayCategory } from '@/utils/helpers';

const DEMO_SEEN_KEY = 'complaints_demo_seen';

export default function ComplaintsPage() {
  const {
    complaints,
    loading,
    backlogComplaints,
    closedComplaints,
    stats,
    createComplaint,
    updateField,
    reopenComplaint,
    closeComplaint,
    escalateComplaint,
    advanceDay,
    deleteComplaint,
    toggleExpand,
    setLoading,
  } = useComplaints();

  const [currentPage, setCurrentPage] = useState('backlog');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showNextDayModal, setShowNextDayModal] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const hasSeenDemo = localStorage.getItem(DEMO_SEEN_KEY);
    if (!hasSeenDemo) {
      setShowDemo(true);
    }
  }, []);

  const handleCloseDemo = () => {
    localStorage.setItem(DEMO_SEEN_KEY, 'true');
    setShowDemo(false);
  };

  const filteredBacklogComplaints = useMemo(() => {
    let result = [...backlogComplaints];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.complaint_number.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.update_notes.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const aHigh = a.complaint_level >= 4;
      const bHigh = b.complaint_level >= 4;
      if (aHigh && !bHigh) return -1;
      if (!aHigh && bHigh) return 1;
      return a.appointment_time.localeCompare(b.appointment_time);
    });
    return result;
  }, [backlogComplaints, search]);

  const filteredClosedComplaints = useMemo(() => {
    let result = [...closedComplaints];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.complaint_number.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const dateA = new Date(a.closed_at || a.escalated_at || a.date_added);
      const dateB = new Date(b.closed_at || b.escalated_at || b.date_added);
      return dateB - dateA;
    });
    return result;
  }, [closedComplaints, search]);

  const groupedComplaints = useMemo(() => {
    const groups = {
      today: [],
      tomorrow: [],
      future: [],
      past: [],
    };

    filteredBacklogComplaints.forEach((complaint) => {
      const category = getDayCategory(complaint.next_callback_date);
      groups[category].push(complaint);
    });

    return groups;
  }, [filteredBacklogComplaints]);

  const hasUpdateNotes = (complaintId) => {
    const complaint = complaints.find((c) => c.id === complaintId);
    return !!complaint?.update_notes?.trim();
  };

  const withUpdateNotesCheck = (action) => {
    if (action.type === 'delete') return true;
    if (!hasUpdateNotes(action.targetId)) {
      setValidationError('Please fill in the Update Notes before performing this action.');
      return false;
    }
    return true;
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    switch (confirmAction.type) {
      case 'close':
        closeComplaint(confirmAction.targetId);
        break;
      case 'escalate':
        escalateComplaint(confirmAction.targetId);
        break;
      case 'reopen':
        reopenComplaint(confirmAction.targetId);
        break;
      case 'delete':
        deleteComplaint(confirmAction.targetId);
        break;
      default:
        break;
    }
    setConfirmAction(null);
    setViewComplaint(null);
  };

  const handleAdvanceDayRequest = (targetId) => {
    if (!hasUpdateNotes(targetId)) {
      setValidationError('Please fill in the Update Notes before advancing to the next day.');
      return;
    }
    setShowNextDayModal({ targetId });
  };

  const handleAdvanceDayConfirm = (targetId, callbackDate, callbackTime) => {
    advanceDay(targetId, callbackDate, callbackTime);
    setShowNextDayModal(null);
    setViewComplaint(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-3 rounded-xl shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Complaints System</h1>
              <p className="text-slate-400 text-sm">Enterprise Case Management</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDemo(true)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-all"
              title="Help & Demo"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={handleRefresh}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Complaint</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatsCard
            icon={Layers}
            label="Active"
            value={stats.active}
            iconColor="text-blue-400"
            borderColor="border-blue-500/20"
          />
          <StatsCard
            icon={AlertTriangle}
            label="Escalated"
            value={stats.escalated}
            iconColor="text-amber-400"
            borderColor="border-amber-500/20"
          />
          <StatsCard
            icon={CheckCircle}
            label="Resolved"
            value={stats.resolved}
            iconColor="text-emerald-400"
            borderColor="border-emerald-500/20"
          />
          <StatsCard
            icon={Archive}
            label="Closed"
            value={stats.closed}
            iconColor="text-slate-400"
            borderColor="border-slate-500/20"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setCurrentPage('backlog')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              currentPage === 'backlog'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-5 h-5" />
            Backlog ({filteredBacklogComplaints.length})
          </button>
          <button
            onClick={() => setCurrentPage('closed')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              currentPage === 'closed'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Archive className="w-5 h-5" />
            Closed/Escalated ({filteredClosedComplaints.length})
          </button>
        </div>

        {/* Search */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Loading & Empty States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-12 h-12 text-teal-500 animate-spin" />
            <p className="mt-3 text-slate-400">Loading complaints...</p>
          </div>
        ) : currentPage === 'backlog' && filteredBacklogComplaints.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700">
            <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl text-slate-400">No active complaints</p>
            <p className="text-sm text-slate-500 mt-1">Create a new complaint to get started</p>
          </div>
        ) : currentPage === 'closed' && filteredClosedComplaints.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700">
            <Archive className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl text-slate-400">No closed or escalated complaints</p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentPage === 'backlog' ? (
              <>
                {groupedComplaints.today.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      Today
                    </h3>
                    <div className="space-y-3">
                      {groupedComplaints.today.map((complaint) => (
                        <ComplaintCard
                          key={complaint.id}
                          complaint={complaint}
                          onViewDetails={setViewComplaint}
                          onToggleExpand={toggleExpand}
                          onConfirmAction={(action) => {
                            if (withUpdateNotesCheck(action)) {
                              setConfirmAction(action);
                            }
                          }}
                          onAdvanceDay={handleAdvanceDayRequest}
                          onUpdateField={updateField}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {groupedComplaints.tomorrow.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      Tomorrow
                    </h3>
                    <div className="space-y-3">
                      {groupedComplaints.tomorrow.map((complaint) => (
                        <ComplaintCard
                          key={complaint.id}
                          complaint={complaint}
                          onViewDetails={setViewComplaint}
                          onToggleExpand={toggleExpand}
                          onConfirmAction={(action) => {
                            if (withUpdateNotesCheck(action)) {
                              setConfirmAction(action);
                            }
                          }}
                          onAdvanceDay={handleAdvanceDayRequest}
                          onUpdateField={updateField}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {groupedComplaints.future.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Future
                    </h3>
                    <div className="space-y-3">
                      {groupedComplaints.future.map((complaint) => (
                        <ComplaintCard
                          key={complaint.id}
                          complaint={complaint}
                          onViewDetails={setViewComplaint}
                          onToggleExpand={toggleExpand}
                          onConfirmAction={(action) => {
                            if (withUpdateNotesCheck(action)) {
                              setConfirmAction(action);
                            }
                          }}
                          onAdvanceDay={handleAdvanceDayRequest}
                          onUpdateField={updateField}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {groupedComplaints.past.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                      No Callback Scheduled
                    </h3>
                    <div className="space-y-3">
                      {groupedComplaints.past.map((complaint) => (
                        <ComplaintCard
                          key={complaint.id}
                          complaint={complaint}
                          onViewDetails={setViewComplaint}
                          onToggleExpand={toggleExpand}
                          onConfirmAction={(action) => {
                            if (withUpdateNotesCheck(action)) {
                              setConfirmAction(action);
                            }
                          }}
                          onAdvanceDay={handleAdvanceDayRequest}
                          onUpdateField={updateField}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                {filteredClosedComplaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onViewDetails={setViewComplaint}
                    onToggleExpand={toggleExpand}
                    onConfirmAction={(action) => {
                      if (withUpdateNotesCheck(action)) {
                        setConfirmAction(action);
                      }
                    }}
                    onAdvanceDay={handleAdvanceDayRequest}
                    onUpdateField={updateField}
                    showExpand={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Complaint Modal */}
      {showAddModal && (
        <AddComplaintModal
          onClose={() => setShowAddModal(false)}
          onCreate={createComplaint}
        />
      )}

      {/* View Complaint Modal */}
      {viewComplaint && (
        <ComplaintDetailsModal
          complaint={viewComplaint}
          onClose={() => setViewComplaint(null)}
          onUpdateField={updateField}
          onConfirmAction={(action) => {
            if (withUpdateNotesCheck(action)) {
              setConfirmAction(action);
            }
          }}
          onAdvanceDay={handleAdvanceDayRequest}
        />
      )}

      {/* Confirm Action Modal */}
      {confirmAction && (
        <ConfirmModal
          confirmAction={confirmAction}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* Next Day Modal */}
      {showNextDayModal && (
        <NextDayModal
          onConfirm={(date, time) =>
            handleAdvanceDayConfirm(showNextDayModal.targetId, date, time)
          }
          onCancel={() => setShowNextDayModal(null)}
        />
      )}

      {/* Validation Error Modal */}
      {validationError && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl max-w-sm w-full p-6 border border-slate-700 shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Action Required</h4>
            <p className="text-slate-400 mb-6">{validationError}</p>
            <button
              onClick={() => setValidationError(null)}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-600 p-2 rounded-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Welcome to Complaints System</h2>
            </div>
            <div className="space-y-3 text-slate-300 text-sm mb-6">
              <p>This is an enterprise-grade case management system for tracking customer complaints.</p>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="font-medium text-white mb-2">Quick Start:</p>
                <ul className="space-y-1 text-slate-400">
                  <li>• Click "New Complaint" to add a case</li>
                  <li>• Click "View Details" for full information</li>
                  <li>• Update notes before advancing days</li>
                  <li>• Level 4-5 complaints are prioritized</li>
                </ul>
              </div>
            </div>
            <button
              onClick={handleCloseDemo}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
}