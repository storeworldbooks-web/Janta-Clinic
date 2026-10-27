import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { CLINIC_BRANCHES } from '../../data/initialData';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  FileSpreadsheet, 
  Building2,
  Stethoscope
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { 
    patients, 
    appointments, 
    invoices, 
    expenses, 
    exportPatientsCSV, 
    exportRevenueCSV,
    activeBranch 
  } = useClinic();

  const [activeReportTab, setActiveReportTab] = useState<'revenue' | 'patients' | 'treatments' | 'branch' | 'doctors'>('revenue');

  // Branch 1 vs Branch 2 calculations
  const b1Invoices = invoices.filter(i => i.branch === 'branch-1');
  const b2Invoices = invoices.filter(i => i.branch === 'branch-2');
  const b1Rev = b1Invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const b2Rev = b2Invoices.reduce((acc, i) => acc + i.paidAmount, 0);

  const b1Appts = appointments.filter(a => a.branch === 'branch-1');
  const b2Appts = appointments.filter(a => a.branch === 'branch-2');

  const b1Patients = patients.filter(p => p.branchAssigned === 'branch-1').length;
  const b2Patients = patients.filter(p => p.branchAssigned === 'branch-2').length;

  const totalRev = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netMargin = totalRev - totalExp;

  // Doctor metrics
  const doctorsPerformance = [
    { name: 'Dr. LP Diwakar', specialty: 'Oral Surgery & Implants', appointments: 28, revenueGenerated: 94000, branch: 'Branch 1 & 2' },
    { name: 'Dr. Ananya Goel', specialty: 'Endodontics & Esthetics', appointments: 22, revenueGenerated: 58000, branch: 'Branch 2' },
    { name: 'Dr. Mohit Narang', specialty: 'Orthodontics', appointments: 16, revenueGenerated: 64000, branch: 'Branch 1' }
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Clinic Intelligence, Audit & Financial Reports
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Consolidated dual-branch reports, revenue reconciliation, doctor performance, and CSV exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportPatientsCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white text-xs font-semibold"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-500" />
            <span>Export Patients CSV</span>
          </button>
          <button
            type="button"
            onClick={exportRevenueCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Revenue CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* High-Level Financial Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Gross Treatment Revenue</span>
          <p className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-400 mt-1 tabular-nums">
            ₹{totalRev.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Total collected across both clinics</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Operational Expenses</span>
          <p className="text-2xl font-bold font-mono text-rose-500 mt-1 tabular-nums">
            ₹{totalExp.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Rent, staff salaries, consumables</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Net Operating Surplus</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            ₹{netMargin.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Healthy ~58% Clinic Profit Margin</p>
        </div>
      </div>

      {/* Report Category Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveReportTab('revenue')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeReportTab === 'revenue' ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Revenue & Daily Collection
        </button>
        <button
          type="button"
          onClick={() => setActiveReportTab('branch')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeReportTab === 'branch' ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Branch Comparative Audit
        </button>
        <button
          type="button"
          onClick={() => setActiveReportTab('doctors')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeReportTab === 'doctors' ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Doctor Productivity Report
        </button>
      </div>

      {/* Tab 1: Revenue Report */}
      {activeReportTab === 'revenue' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Daily Collection & Settlement Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Invoice Ref</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Payment Mode</th>
                  <th className="py-2.5 px-3 text-right">Collected (₹)</th>
                  <th className="py-2.5 px-3 text-right">Balance Due (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{inv.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{inv.patientName}</td>
                    <td className="py-3 px-3 text-teal-600 dark:text-teal-400 font-medium">
                      {inv.branch === 'branch-1' ? 'Branch 1 (Raghubir)' : 'Branch 2 (Nihal Vihar)'}
                    </td>
                    <td className="py-3 px-3">{inv.paymentMethod}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      ₹{inv.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-rose-500">
                      ₹{inv.pendingBalance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Branch Comparison Report */}
      {activeReportTab === 'branch' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Branch 1 Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Branch 1</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">P-55 Raghubir Nagar, New Delhi 110027</h3>
              </div>
              <Building2 className="w-5 h-5 text-teal-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block">Total Revenue</span>
                <p className="text-lg font-bold font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                  ₹{b1Rev.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block">Assigned Patients</span>
                <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {b1Patients}
                </p>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <p>• Total Consultations & Visits: <strong>{b1Appts.length} sessions</strong></p>
              <p>• Operating Schedule: Mon - Sun (09:30 AM - 08:30 PM)</p>
              <p>• Lead Doctor: Dr. LP Diwakar (Director)</p>
            </div>
          </div>

          {/* Branch 2 Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Branch 2</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">RZ/E-158 Nihal Vihar, Nangloi, New Delhi 110041</h3>
              </div>
              <Building2 className="w-5 h-5 text-cyan-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block">Total Revenue</span>
                <p className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                  ₹{b2Rev.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block">Assigned Patients</span>
                <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {b2Patients}
                </p>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <p>• Total Consultations & Visits: <strong>{b2Appts.length} sessions</strong></p>
              <p>• Operating Schedule: Mon - Sat (10:00 AM - 08:00 PM)</p>
              <p>• Lead Doctor: Dr. Ananya Goel (BDS, Endodontist)</p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Doctor Productivity Report */}
      {activeReportTab === 'doctors' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Doctor Performance & Production Audit
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Dental Surgeon</th>
                  <th className="py-2.5 px-3">Specialization</th>
                  <th className="py-2.5 px-3">Operating Branch</th>
                  <th className="py-2.5 px-3 text-right">Visits Conducted</th>
                  <th className="py-2.5 px-3 text-right">Production (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {doctorsPerformance.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{doc.name}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{doc.specialty}</td>
                    <td className="py-3 px-3 text-teal-600 dark:text-teal-400 font-medium">{doc.branch}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">{doc.appointments}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                      ₹{doc.revenueGenerated.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
