import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { BranchId } from '../../types';
import { STANDARD_TREATMENTS } from '../../data/initialData';
import { 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Building,
  RefreshCw
} from 'lucide-react';

export const WebsiteInquirySync: React.FC = () => {
  const { webInquiries, convertInquiryToAppointment, addNewWebInquiry } = useClinic();

  // Test Booking Simulator state
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [treatment, setTreatment] = useState(STANDARD_TREATMENTS[0].name);
  const [branch, setBranch] = useState<BranchId>('branch-1');
  const [date, setDate] = useState('2026-10-28');
  const [time, setTime] = useState('11:30 AM');
  const [message, setMessage] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      alert('Please enter Name and Phone');
      return;
    }

    setIsSimulating(true);
    setTimeout(() => {
      addNewWebInquiry({
        name: patientName,
        phone: patientPhone,
        email: patientEmail,
        preferredBranch: branch,
        preferredDate: date,
        preferredTime: time,
        treatmentRequested: treatment,
        message: message || 'Urgent tooth consultation requested via website.'
      });
      setIsSimulating(false);
      setPatientName('');
      setPatientPhone('');
      setPatientEmail('');
      setMessage('');
      alert('Inquiry submitted! Check the real-time sync table below.');
    }, 400);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              SEO Website Inquiries & Real-Time Sync
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
              Live Database Link
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Public website appointment bookings appear automatically inside this queue with 1-click conversion to EMR patient files.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span>Listening for Direct Inquiries</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Public Website Booking Widget Simulator */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Website Form Simulator</span>
            </h3>
            <span className="text-[10px] text-slate-400">Patient View</span>
          </div>

          <p className="text-slate-500 text-[11px]">
            Test how online visitors book appointments on <strong>jantadental.com</strong>. Submitted forms instantly persist to your clinic database.
          </p>

          <form onSubmit={handleSimulateInquiry} className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Shalini Mathur"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mobile Number (WhatsApp) *</label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="e.g. 9811998877"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Treatment Needed</label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {STANDARD_TREATMENTS.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Preferred Clinic Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as BranchId)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="branch-1">Branch 1: P-55 Raghubir Nagar, New Delhi</option>
                <option value="branch-2">Branch 2: RZ/E-158 Nihal Vihar, Nangloi</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Preferred Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Message / Symptoms</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your toothache, bleeding, or cosmetic goal..."
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white h-16 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSimulating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSimulating ? 'Submitting to Database...' : 'Simulate Website Patient Submission'}</span>
            </button>
          </form>
        </div>

        {/* Live Admin Inbound Sync Queue (Right 2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Inbound Website Requests Queue
              </h3>
              <p className="text-xs text-slate-500">
                1-click convert any inquiry into an active appointment and patient profile.
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {webInquiries.length} Inquiries Received
            </span>
          </div>

          <div className="space-y-3">
            {webInquiries.map(inq => (
              <div
                key={inq.id}
                className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                  inq.status === 'New'
                    ? 'bg-cyan-50/50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{inq.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inq.status === 'New' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                    }`}>
                      {inq.status}
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                      {inq.preferredBranch === 'branch-1' ? 'Branch 1: Raghubir Nagar' : 'Branch 2: Nihal Vihar'}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-slate-400">
                    Received: {inq.submittedAt}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <p><strong>Mobile:</strong> <span className="font-mono">{inq.phone}</span></p>
                  <p><strong>Treatment Requested:</strong> {inq.treatmentRequested}</p>
                  <p><strong>Requested Slot:</strong> {inq.preferredDate} at {inq.preferredTime}</p>
                  {inq.email && <p><strong>Email:</strong> {inq.email}</p>}
                </div>

                {inq.message && (
                  <p className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 italic">
                    "{inq.message}"
                  </p>
                )}

                {inq.status === 'New' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => convertInquiryToAppointment(inq.id, 'Dr. LP Diwakar (Director)')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Convert to Scheduled Appointment</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
