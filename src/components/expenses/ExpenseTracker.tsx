import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Expense, ExpenseCategory, BranchId } from '../../types';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Building, 
  ShoppingBag, 
  Users, 
  Zap, 
  Wrench, 
  Megaphone,
  Filter,
  X
} from 'lucide-react';

const CATEGORIES: ExpenseCategory[] = [
  'Rent',
  'Electricity',
  'Instruments',
  'Medicines',
  'Staff Salary',
  'Marketing',
  'Equipment',
  'Maintenance'
];

export const ExpenseTracker: React.FC = () => {
  const { expenses, addExpense, deleteExpense, activeBranch } = useClinic();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<'all' | BranchId>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Medicines');
  const [amount, setAmount] = useState<number>(5000);
  const [date, setDate] = useState('2026-10-27');
  const [branch, setBranch] = useState<BranchId>(activeBranch !== 'all' ? activeBranch : 'branch-1');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paidTo, setPaidTo] = useState('');
  const [notes, setNotes] = useState('');

  const filteredExpenses = expenses.filter(e => {
    const branchMatch = filterBranch === 'all' 
      ? (activeBranch === 'all' || e.branch === activeBranch)
      : e.branch === filterBranch;
    const catMatch = filterCategory === 'all' || e.category === filterCategory;
    return branchMatch && catMatch;
  });

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const rentTotal = filteredExpenses.filter(e => e.category === 'Rent').reduce((sum, e) => sum + e.amount, 0);
  const staffSalaryTotal = filteredExpenses.filter(e => e.category === 'Staff Salary').reduce((sum, e) => sum + e.amount, 0);
  const medicinesTotal = filteredExpenses.filter(e => e.category === 'Medicines').reduce((sum, e) => sum + e.amount, 0);
  const electricityTotal = filteredExpenses.filter(e => e.category === 'Electricity').reduce((sum, e) => sum + e.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    addExpense({
      title,
      category,
      amount: Number(amount),
      date,
      branch,
      paymentMethod,
      paidTo,
      notes
    });

    setIsAddOpen(false);
    setTitle('');
    setPaidTo('');
    setNotes('');
  };

  return (
    <div className="space-y-6">

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Clinic Expense & Overhead Ledger
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              ₹{totalExpenseAmount.toLocaleString('en-IN')} Total Outflow
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track operational costs, rent, consumables, salaries, dental materials and electricity by branch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-md shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Premises Rent</span>
            <Building className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ₹{rentTotal.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">Fixed monthly cost</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Staff Salaries</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ₹{staffSalaryTotal.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">Assistants & front desk</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Dental Consumables</span>
            <ShoppingBag className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ₹{medicinesTotal.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">Resins, burs & medicines</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Electricity & Power</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ₹{electricityTotal.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">Autoclave & compressors</span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Category Filter:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

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
        </div>
      </div>

      {/* Expense Table */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
            <tr>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Title & Details</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Branch</th>
              <th className="py-2.5 px-3">Paid To / Vendor</th>
              <th className="py-2.5 px-3">Mode</th>
              <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              <th className="py-2.5 px-3 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredExpenses.map(exp => (
              <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                  {exp.date}
                </td>
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-900 dark:text-white">{exp.title}</p>
                  {exp.notes && <p className="text-[11px] text-slate-500 italic">{exp.notes}</p>}
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {exp.category}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    {exp.branch === 'branch-1' ? 'Branch 1' : 'Branch 2'}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                  {exp.paidTo}
                </td>
                <td className="py-3 px-3 font-mono text-slate-500">
                  {exp.paymentMethod}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  ₹{exp.amount.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete expense "${exp.title}"?`)) {
                        deleteExpense(exp.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-500" />
                <span>Log Clinic Expense</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 mt-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Expense Title / Item Description *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ultrasonic Scaler Tips Batch #4"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Branch *</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as BranchId)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="branch-1">Branch 1: Raghubir Nagar</option>
                    <option value="branch-2">Branch 2: Nihal Vihar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vendor / Paid To</label>
                  <input
                    type="text"
                    value={paidTo}
                    onChange={(e) => setPaidTo(e.target.value)}
                    placeholder="e.g. MedDental Supplies"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Notes / Bill Ref</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Tax invoice #GST-1049"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
