import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { FollowUpReminder, BranchId } from '../../types';
import { STANDARD_TREATMENTS } from '../../data/initialData';
import { 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Filter, 
  User, 
  Check, 
  XCircle,
  Calendar,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const FollowUpTracker: React.FC = () => {
  const { 
    followUps, 
    patients, 
    activeBranch, 
    updateFollowUpStatus, 
    createFollowUpSchedule,
    sendWhatsAppFollowUp 
  } = useClinic();

  const [filterInterval, setFilterInterval] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isNewCadenceOpen, setIsNewCadenceOpen] = useState(false);

  // New Cadence Form
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [treatmentName, setTreatmentName] = useState(STANDARD_TREATMENTS[3].name); // Root Canal Treatment
  const [branch, setBranch] = useState<BranchId>(activeBranch !== 'all' ? activeBranch : 'branch-1');

  const filteredFollowUps = followUps.filter(flw => {
    const branchMatch = activeBranch === 'all' || flw.branch === activeBranch;
    const intervalMatch = filterInterval === 'all' || String(flw.intervalDays) === filterInterval;
    const statusMatch = filterStatus === 'all' || flw.status === filterStatus;
    return branchMatch && intervalMatch && statusMatch;
  });

  const handleCreateCadence = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === patientId);
    if (!pat) return;

    createFollowUpSchedule(pat.id, pat.name, pat.mobile, treatmentName, branch);
    setIsNewCadenceOpen(false);
  };

  const intervalsList = [1, 7, 15, 30, 90, 365];

  return (
    <div className="space-y-6">

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Automated Follow-Up & Patient Care Pipeline
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              {followUps.filter(f => f.status === 'Pending').length} Pending Outreach
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured 1-Day, 7-Day, 15-Day, 30-Day, 90-Day, and 365-Day patient retention & recovery schedule.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewCadenceOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-md shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Follow-Up Cadence</span>
        </button>
      </div>

      {/* Interval Pill Filter Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-500 mr-1">Milestone:</span>
          <button
            type="button"
            onClick={() => setFilterInterval('all')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              filterInterval === 'all' ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Milestones
          </button>
          {intervalsList.map(days => (
            <button
              key={days}
              type="button"
              onClick={() => setFilterInterval(String(days))}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                filterInterval === String(days) ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {days} {days === 1 ? 'Day' : 'Days'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Follow-Up List */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {filteredFollowUps.length > 0 ? (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Milestone</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Treatment Performed</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Branch</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredFollowUps.map(flw => (
                <tr key={flw.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800/60">
                      {flw.intervalDays} {flw.intervalDays === 1 ? 'Day' : 'Days'} Post-Op
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900 dark:text-white">{flw.patientName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{flw.patientMobile}</p>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                    {flw.treatmentName}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {flw.scheduledDate}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-teal-600 dark:text-teal-400">
                      {flw.branch === 'branch-1' ? 'Branch 1' : 'Branch 2'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={flw.status}
                      onChange={(e) => updateFollowUpStatus(flw.id, e.target.value as any)}
                      className={`text-xs p-1 rounded-lg border font-semibold ${
                        flw.status === 'Contacted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300' :
                        flw.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300' :
                        'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Scheduled">Scheduled Visit</option>
                      <option value="Dismissed">Dismissed</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => sendWhatsAppFollowUp(flw)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm transition-colors"
                      title="Generate and send personalized WhatsApp check-in"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp Follow-Up</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            No follow-ups matching current filter settings.
          </div>
        )}
      </div>

      {/* Launch New Cadence Modal */}
      {isNewCadenceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Launch Automated Follow-Up Cadence
            </h3>
            <p className="text-slate-500 mb-4">
              This will automatically schedule reminders at 1, 7, 15, 30, 90, and 365 days for the patient.
            </p>

            <form onSubmit={handleCreateCadence} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Treatment Performed *</label>
                <select
                  value={treatmentName}
                  onChange={(e) => setTreatmentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {STANDARD_TREATMENTS.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Clinic Branch *</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as BranchId)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="branch-1">Branch 1: Raghubir Nagar</option>
                  <option value="branch-2">Branch 2: Nihal Vihar</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewCadenceOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                >
                  Activate 6-Stage Cadence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
