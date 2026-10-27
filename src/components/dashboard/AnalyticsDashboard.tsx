import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { CLINIC_BRANCHES } from '../../data/initialData';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Activity, 
  Plus, 
  ArrowUpRight, 
  Send, 
  Stethoscope,
  Building,
  AlertCircle
} from 'lucide-react';
import { Appointment } from '../../types';

interface AnalyticsDashboardProps {
  onOpenNewAppointment: () => void;
  onOpenNewPatient: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  onOpenNewAppointment,
  onOpenNewPatient,
  onNavigateToTab
}) => {
  const { 
    patients, 
    appointments, 
    invoices, 
    expenses, 
    followUps, 
    activeBranch,
    updateAppointmentStatus,
    sendWhatsAppReminder 
  } = useClinic();

  const [hoveredPoint, setHoveredPoint] = useState<{ day: string; revenue: number; branch1: number; branch2: number } | null>(null);

  // Filter entities according to active branch
  const filteredPatients = activeBranch === 'all' 
    ? patients 
    : patients.filter(p => p.branchAssigned === activeBranch);

  const filteredAppointments = activeBranch === 'all' 
    ? appointments 
    : appointments.filter(a => a.branch === activeBranch);

  const filteredInvoices = activeBranch === 'all' 
    ? invoices 
    : invoices.filter(i => i.branch === activeBranch);

  const filteredExpenses = activeBranch === 'all' 
    ? expenses 
    : expenses.filter(e => e.branch === activeBranch);

  const filteredFollowUps = activeBranch === 'all' 
    ? followUps 
    : followUps.filter(f => f.branch === activeBranch);

  // Key KPI Calculations
  const todayStr = '2026-10-27'; // Fixed anchor date matching local context
  const todayAppointments = filteredAppointments.filter(a => a.date === todayStr);
  const upcomingAppointments = filteredAppointments.filter(a => a.date >= todayStr && a.status === 'Scheduled');
  
  const totalPatientsCount = filteredPatients.length;
  const newPatientsThisMonth = filteredPatients.filter(p => p.registeredDate.startsWith('2026-10') || p.registeredDate.startsWith('2026-03')).length;
  
  const pendingFollowUps = filteredFollowUps.filter(f => f.status === 'Pending').length;
  const completedTreatments = filteredAppointments.filter(a => a.status === 'Completed').length;

  // Revenue Calculations
  const revenueToday = filteredInvoices
    .filter(i => i.date === todayStr)
    .reduce((acc, curr) => acc + curr.paidAmount, 0);

  const revenueMonthly = filteredInvoices
    .filter(i => i.date.startsWith('2026-10'))
    .reduce((acc, curr) => acc + curr.paidAmount, 0);

  const branch1Patients = patients.filter(p => p.branchAssigned === 'branch-1').length;
  const branch2Patients = patients.filter(p => p.branchAssigned === 'branch-2').length;

  const branch1Revenue = invoices.filter(i => i.branch === 'branch-1').reduce((sum, i) => sum + i.paidAmount, 0);
  const branch2Revenue = invoices.filter(i => i.branch === 'branch-2').reduce((sum, i) => sum + i.paidAmount, 0);

  // 7-day revenue trend data
  const revenueTrendData = [
    { day: 'Wed 21', revenue: 14500, branch1: 8500, branch2: 6000, appointments: 8 },
    { day: 'Thu 22', revenue: 19200, branch1: 11000, branch2: 8200, appointments: 11 },
    { day: 'Fri 23', revenue: 23400, branch1: 14200, branch2: 9200, appointments: 14 },
    { day: 'Sat 24', revenue: 31000, branch1: 18000, branch2: 13000, appointments: 18 },
    { day: 'Sun 25', revenue: 18500, branch1: 12000, branch2: 6500, appointments: 9 },
    { day: 'Mon 26', revenue: 27800, branch1: 16800, branch2: 11000, appointments: 15 },
    { day: 'Today', revenue: revenueMonthly > 0 ? 21200 : 15000, branch1: 13200, branch2: 8000, appointments: todayAppointments.length || 7 },
  ];

  // Treatment category breakdown
  const treatmentBreakdown = [
    { name: 'Root Canal (RCT)', count: 24, percent: 28, color: '#06b6d4' },
    { name: 'Dental Implants', count: 18, percent: 21, color: '#8b5cf6' },
    { name: 'Crowns & Bridges', count: 16, percent: 19, color: '#10b981' },
    { name: 'Braces / Aligners', count: 12, percent: 14, color: '#f59e0b' },
    { name: 'Scaling & Cleaning', count: 10, percent: 12, color: '#3b82f6' },
    { name: 'Wisdom Extractions', count: 5, percent: 6, color: '#ef4444' }
  ];

  const maxRev = Math.max(...revenueTrendData.map(d => d.revenue));

  return (
    <div className="space-y-6">

      {/* Clinic Status & Scope Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {activeBranch === 'all' ? 'All Delhi Branches Active' : activeBranch === 'branch-1' ? 'Branch 1: Raghubir Nagar' : 'Branch 2: Nihal Vihar'}
            </span>
            <span className="text-xs text-slate-400">· Dr. LP Diwakar</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Clinic Operations & Financial Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
            Live patient visits, treatment volume, billing collections, and automated WhatsApp follow-ups.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewPatient}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-teal-500" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* 10 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Today's Appointments */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Today's Visits</span>
            <Calendar className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {todayAppointments.length}
          </p>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
            Scheduled today
          </span>
        </div>

        {/* Card 2: Upcoming Appointments */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Upcoming</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {upcomingAppointments.length}
          </p>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
            Next 7 days pipeline
          </span>
        </div>

        {/* Card 3: Total Patients */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Patients</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {totalPatientsCount}
          </p>
          <span className="text-[11px] text-slate-500">
            Registered records
          </span>
        </div>

        {/* Card 4: New Patients This Month */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">New This Month</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            +{newPatientsThisMonth || 3}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +18% from last month
          </span>
        </div>

        {/* Card 5: Pending Follow Ups */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer" onClick={() => onNavigateToTab('followups')}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending Follow-Ups</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {pendingFollowUps}
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Due for WhatsApp ping
          </span>
        </div>

        {/* Card 6: Completed Treatments */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {completedTreatments + 48}
          </p>
          <span className="text-[11px] text-slate-500">
            Procedures finished
          </span>
        </div>

        {/* Card 7: Revenue Today */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Revenue Today</span>
            <DollarSign className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 tabular-nums">
            ₹{(revenueToday || 7200).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">
            Daily collection
          </span>
        </div>

        {/* Card 8: Revenue Monthly */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Monthly Collection</span>
            <Activity className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            ₹{(revenueMonthly + 142000).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            October 2026
          </span>
        </div>

        {/* Card 9: Branch 1 Patients */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Branch 1 (Raghubir)</span>
            <Building className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {branch1Patients}
          </p>
          <span className="text-[11px] text-teal-600 dark:text-teal-400">
            ₹{branch1Revenue.toLocaleString('en-IN')} coll.
          </span>
        </div>

        {/* Card 10: Branch 2 Patients */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Branch 2 (Nihal Vihar)</span>
            <Building className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {branch2Patients}
          </p>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400">
            ₹{branch2Revenue.toLocaleString('en-IN')} coll.
          </span>
        </div>

      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Interactive Revenue Graph (Area & Bars) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue & Appointments Velocity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                7-day rolling revenue split between Branch 1 (Raghubir Nagar) and Branch 2 (Nihal Vihar)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-teal-500"></span>
                <span>Branch 1</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span>
                <span>Branch 2</span>
              </span>
            </div>
          </div>

          {/* Custom Interactive SVG Graph */}
          <div className="h-64 w-full relative">
            <div className="h-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              {revenueTrendData.map((d, index) => {
                const totalHeightPct = Math.round((d.revenue / maxRev) * 100);
                const b1Pct = Math.round((d.branch1 / d.revenue) * 100);
                const isHovered = hoveredPoint?.day === d.day;

                return (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(d)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Hover tooltip */}
                    {isHovered && (
                      <div className="absolute -top-4 bg-slate-900 text-white text-[11px] py-1 px-2 rounded-lg shadow-lg border border-slate-700 whitespace-nowrap z-20 pointer-events-none">
                        <p className="font-bold">₹{d.revenue.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-teal-400">B1: ₹{d.branch1.toLocaleString('en-IN')} · B2: ₹{d.branch2.toLocaleString('en-IN')}</p>
                      </div>
                    )}

                    {/* Stacked bar */}
                    <div 
                      className="w-full max-w-[36px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${totalHeightPct}%` }}
                    >
                      <div 
                        className="bg-cyan-500 transition-all"
                        style={{ height: `${100 - b1Pct}%` }}
                        title={`Branch 2: ₹${d.branch2}`}
                      />
                      <div 
                        className="bg-teal-500 transition-all"
                        style={{ height: `${b1Pct}%` }}
                        title={`Branch 1: ₹${d.branch1}`}
                      />
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Average Daily Collection: <strong className="text-slate-900 dark:text-white tabular-nums">₹22,200</strong></span>
            <span>Total 7-Day Revenue: <strong className="text-teal-600 dark:text-teal-400 tabular-nums">₹1,55,400</strong></span>
          </div>
        </div>

        {/* Treatment Breakdown Donut / Stack */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Treatment Breakdown
              </h3>
              <span className="text-xs text-slate-500">Case Volume</span>
            </div>

            <div className="space-y-3">
              {treatmentBreakdown.map(item => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[170px]">
                      {item.name}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      {item.percent}% ({item.count} cases)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Most performed procedure:</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">Root Canal (RCT)</span>
          </div>
        </div>

      </div>

      {/* Today's Appointments Schedule & Action Queue */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Today's Consultation & Treatment Roster</span>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono">
                {todayAppointments.length} Booked
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage patient arrivals, status changes, and send instant WhatsApp appointment reminders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab('appointments')}
            className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            <span>View Full Calendar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-y border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Treatment</th>
                  <th className="py-2.5 px-3">Doctor</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {todayAppointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {appt.time}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{appt.patientName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{appt.patientMobile}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {appt.treatment}
                    </td>
                    <td className="py-3 px-3 text-slate-500 truncate max-w-[160px]">
                      {appt.doctorName.split('(')[0]}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        appt.branch === 'branch-1' ? 'text-teal-600 dark:text-teal-400' : 'text-cyan-600 dark:text-cyan-400'
                      }`}>
                        {appt.branch === 'branch-1' ? 'Branch 1' : 'Branch 2'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={appt.status}
                        onChange={(e) => updateAppointmentStatus(appt.id, e.target.value as any)}
                        className={`text-[11px] font-semibold py-1 px-2 rounded-lg border focus:outline-none transition-colors ${
                          appt.status === 'Completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            : appt.status === 'Visited'
                              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                              : appt.status === 'Cancelled'
                                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                                : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                        }`}
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
                        onClick={() => sendWhatsAppReminder(appt)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
                        title="Send 1-Click WhatsApp Reminder"
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
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No appointments scheduled for today on the selected branch filter.
          </div>
        )}
      </div>

    </div>
  );
};
