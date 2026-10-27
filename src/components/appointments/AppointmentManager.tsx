import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, AppointmentStatus, BranchId } from '../../types';
import { CLINIC_BRANCHES, STANDARD_TREATMENTS } from '../../data/initialData';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Filter, 
  Send, 
  CheckCircle2, 
  XCircle, 
  User, 
  AlertCircle, 
  Trash2, 
  CalendarDays,
  CalendarRange,
  List,
  Edit2,
  X
} from 'lucide-react';

interface AppointmentManagerProps {
  initialPatientId?: string;
}

export const AppointmentManager: React.FC<AppointmentManagerProps> = ({ initialPatientId }) => {
  const { 
    appointments, 
    patients, 
    activeBranch, 
    addAppointment, 
    updateAppointmentStatus, 
    rescheduleAppointment,
    deleteAppointment,
    sendWhatsAppReminder 
  } = useClinic();

  const [currentView, setCurrentView] = useState<'daily' | 'weekly' | 'calendar' | 'list'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-27');
  const [filterBranch, setFilterBranch] = useState<'all' | BranchId>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [patientId, setPatientId] = useState(initialPatientId || patients[0]?.id || '');
  const [doctorName, setDoctorName] = useState('Dr. LP Diwakar (BDS, MDS Oral & Maxillofacial)');
  const [treatment, setTreatment] = useState(STANDARD_TREATMENTS[0].name);
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState('11:00 AM');
  const [branch, setBranch] = useState<BranchId>(activeBranch !== 'all' ? activeBranch : 'branch-1');
  const [notes, setNotes] = useState('');

  // Reschedule Quick Modal
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const timeSlots = [
    '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '02:30 PM', '03:00 PM',
    '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'
  ];

  const doctorsList = [
    'Dr. LP Diwakar (BDS, MDS Oral & Maxillofacial)',
    'Dr. Ananya Goel (BDS, Conservative & Endodontics)',
    'Dr. Mohit Narang (BDS, Orthodontist)'
  ];

  const filteredAppointments = appointments.filter(a => {
    const branchMatch = filterBranch === 'all' 
      ? (activeBranch === 'all' || a.branch === activeBranch)
      : a.branch === filterBranch;
    const statusMatch = filterStatus === 'all' || a.status === filterStatus;
    return branchMatch && statusMatch;
  });

  const dailyAppointments = filteredAppointments.filter(a => a.date === selectedDate);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.id === patientId);
    if (!patientObj) {
      alert('Please select a valid patient.');
      return;
    }

    addAppointment({
      patientId: patientObj.id,
      patientName: patientObj.name,
      patientMobile: patientObj.mobile,
      doctorName,
      treatment,
      date,
      time,
      branch,
      status: 'Scheduled',
      notes
    });

    setIsNewModalOpen(false);
    setNotes('');
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleTarget || !newDate || !newTime) return;
    rescheduleAppointment(rescheduleTarget.id, newDate, newTime);
    setRescheduleTarget(null);
  };

  return (
    <div className="space-y-6">

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Appointment Scheduling & Calendar Console
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {filteredAppointments.length} Active Slots
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time appointment schedule, multi-doctor operatory management and 1-click WhatsApp reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setCurrentView('daily')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                currentView === 'daily' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('weekly')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                currentView === 'weekly' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Weekly</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('calendar')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                currentView === 'calendar' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Monthly</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                currentView === 'list' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-md shadow-teal-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Book Slot</span>
          </button>
        </div>
      </div>

      {/* Date & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between text-xs">
        
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Selected Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setSelectedDate('2026-10-27')}
            className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold"
          >
            Today
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value as any)}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Branches</option>
            <option value="branch-1">Branch 1: Raghubir Nagar</option>
            <option value="branch-2">Branch 2: Nihal Vihar</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Visited">Visited</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No Show">No Show</option>
          </select>
        </div>

      </div>

      {/* VIEW 1: Daily Timeline View */}
      {currentView === 'daily' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Operatory Schedule — {new Date(selectedDate).toDateString()}
            </h3>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              {dailyAppointments.length} Appointments on this day
            </span>
          </div>

          <div className="space-y-3">
            {timeSlots.map(slot => {
              const apptForSlot = dailyAppointments.find(a => a.time === slot);

              return (
                <div 
                  key={slot}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                    apptForSlot
                      ? 'bg-slate-50 dark:bg-slate-800/60 border-teal-500/30 shadow-sm'
                      : 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 w-20 shrink-0">
                      {slot}
                    </span>

                    {apptForSlot ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {apptForSlot.patientName}
                          </p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            apptForSlot.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            apptForSlot.status === 'Visited' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                            apptForSlot.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {apptForSlot.status}
                          </span>
                          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                            {apptForSlot.branch === 'branch-1' ? 'Branch 1' : 'Branch 2'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {apptForSlot.treatment} · {apptForSlot.doctorName.split('(')[0]} · Mob: {apptForSlot.patientMobile}
                        </p>
                        {apptForSlot.notes && (
                          <p className="text-[10px] text-slate-400 italic">Notes: {apptForSlot.notes}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Available Operatory Slot</span>
                    )}
                  </div>

                  {apptForSlot ? (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <select
                        value={apptForSlot.status}
                        onChange={(e) => updateAppointmentStatus(apptForSlot.id, e.target.value as AppointmentStatus)}
                        className="text-xs py-1 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Visited">Visited</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="No Show">No Show</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setRescheduleTarget(apptForSlot);
                          setNewDate(apptForSlot.date);
                          setNewTime(apptForSlot.time);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Reschedule Appointment"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => sendWhatsAppReminder(apptForSlot)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800"
                        title="Send 1-Click WhatsApp Reminder"
                      >
                        <Send className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Cancel appointment for ${apptForSlot.patientName}?`)) {
                            deleteAppointment(apptForSlot.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTime(slot);
                        setDate(selectedDate);
                        setIsNewModalOpen(true);
                      }}
                      className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline px-2 py-1 rounded hover:bg-teal-50 dark:hover:bg-teal-950/40"
                    >
                      + Quick Book {slot}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Monthly / Calendar Grid */}
      {(currentView === 'calendar' || currentView === 'weekly') && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              October 2026 Monthly View
            </h3>
            <span className="text-xs text-slate-500">Click any day to inspect slots</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="py-2 font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                {day}
              </div>
            ))}

            {/* 31 days rendering */}
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateKey = `2026-10-${String(dayNum).padStart(2, '0')}`;
              const dayAppts = filteredAppointments.filter(a => a.date === dateKey);
              const isSelected = selectedDate === dateKey;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`p-2 min-h-[72px] rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {dayNum}
                    </span>
                    {dayAppts.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-teal-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {dayAppts.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 overflow-hidden">
                    {dayAppts.slice(0, 2).map(a => (
                      <div key={a.id} className="text-[10px] truncate px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                        {a.time.split(' ')[0]} {a.patientName.split(' ')[0]}
                      </div>
                    ))}
                    {dayAppts.length > 2 && (
                      <p className="text-[9px] text-teal-600 dark:text-teal-400">+{dayAppts.length - 2} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: List / Table View */}
      {currentView === 'list' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Treatment</th>
                <th className="py-2.5 px-3">Doctor</th>
                <th className="py-2.5 px-3">Branch</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredAppointments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {a.date} <span className="text-teal-600 dark:text-teal-400">{a.time}</span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900 dark:text-white">{a.patientName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{a.patientMobile}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                    {a.treatment}
                  </td>
                  <td className="py-3 px-3 text-slate-500 truncate max-w-xs">
                    {a.doctorName.split('(')[0]}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {a.branch === 'branch-1' ? 'Branch 1' : 'Branch 2'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={a.status}
                      onChange={(e) => updateAppointmentStatus(a.id, e.target.value as any)}
                      className="text-xs p-1 rounded-lg border bg-white dark:bg-slate-900"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Visited">Visited</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="No Show">No Show</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => sendWhatsAppReminder(a)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800"
                    >
                      <Send className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Book New Appointment Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-teal-500" />
                <span>Book Clinic Appointment</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 mt-4">
              
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Patient *
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id} · {p.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Treatment / Consultation *
                </label>
                <select
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  {STANDARD_TREATMENTS.map(t => (
                    <option key={t.id} value={t.name}>
                      {t.name} (₹{t.defaultCost.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Attending Doctor *
                </label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  {doctorsList.map((doc, idx) => (
                    <option key={idx} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none"
                  >
                    {timeSlots.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Clinic Branch *
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as BranchId)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="branch-1">Branch 1: P-55 Raghubir Nagar, New Delhi</option>
                  <option value="branch-2">Branch 2: RZ/E-158 Nihal Vihar, Nangloi</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Clinical Notes / Special Requests
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Patient requests painless anesthesia. Crown trial sitting."
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none h-16 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all shadow-md shadow-teal-500/20"
                >
                  Confirm Appointment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Reschedule Appointment
            </h3>
            <p className="text-slate-500 mb-4">
              Patient: <strong className="text-slate-900 dark:text-white">{rescheduleTarget.patientName}</strong> ({rescheduleTarget.treatment})
            </p>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                >
                  {timeSlots.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
              >
                Save Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
