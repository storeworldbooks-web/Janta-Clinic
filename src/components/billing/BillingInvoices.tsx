import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Invoice, PaymentMethod, BranchId, Patient } from '../../types';
import { CLINIC_BRANCHES, STANDARD_TREATMENTS } from '../../data/initialData';
import { 
  Receipt, 
  Plus, 
  Printer, 
  Send, 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Trash2, 
  FileCheck,
  Search,
  Filter,
  ArrowDownLeft,
  X
} from 'lucide-react';

interface BillingInvoicesProps {
  initialPatient?: Patient | null;
}

export const BillingInvoices: React.FC<BillingInvoicesProps> = ({ initialPatient }) => {
  const { invoices, patients, addInvoice, recordPayment, activeBranch } = useClinic();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(invoices[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentNote, setPaymentNote] = useState('');

  // New Invoice Form
  const [patientId, setPatientId] = useState(initialPatient?.id || patients[0]?.id || '');
  const [branch, setBranch] = useState<BranchId>(activeBranch !== 'all' ? activeBranch : 'branch-1');
  const [date, setDate] = useState('2026-10-27');
  const [items, setItems] = useState([
    { treatmentName: STANDARD_TREATMENTS[0].name, cost: STANDARD_TREATMENTS[0].defaultCost, quantity: 1, discount: 0, total: STANDARD_TREATMENTS[0].defaultCost }
  ]);
  const [initialPaid, setInitialPaid] = useState<number>(0);
  const [initialMethod, setInitialMethod] = useState<PaymentMethod>('UPI');
  const [initialNote, setInitialNote] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const branchMatch = activeBranch === 'all' || inv.branch === activeBranch;
    const statusMatch = filterStatus === 'all' || inv.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const queryMatch = !q || inv.patientName.toLowerCase().includes(q) || inv.invoiceNumber.toLowerCase().includes(q);
    return branchMatch && statusMatch && queryMatch;
  });

  const totalRevenueCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalPendingBalance = invoices.reduce((acc, i) => acc + i.pendingBalance, 0);

  const subtotal = items.reduce((acc, it) => acc + it.total, 0);
  const grandTotal = subtotal;

  const handleAddItem = (treatmentName: string, cost: number) => {
    setItems(prev => [...prev, { treatmentName, cost, quantity: 1, discount: 0, total: cost }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === patientId);
    if (!pat) return;

    const paid = Number(initialPaid) || 0;
    const pending = Math.max(0, grandTotal - paid);
    const status = pending === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';

    const created = addInvoice({
      patientId: pat.id,
      patientName: pat.name,
      patientMobile: pat.mobile,
      branch,
      date,
      items,
      subtotal,
      discount: 0,
      tax: 0,
      grandTotal,
      paidAmount: paid,
      pendingBalance: pending,
      paymentMethod: initialMethod,
      paymentNotes: initialNote || `Paid ₹${paid} on creation via ${initialMethod}`,
      status
    });

    setSelectedInvoice(created);
    setIsNewInvoiceOpen(false);
  };

  const handleSavePayment = () => {
    if (!selectedInvoice || paymentAmount <= 0) return;
    recordPayment(selectedInvoice.id, Number(paymentAmount), paymentMethod, paymentNote);
    setIsRecordPaymentOpen(false);
    setPaymentAmount(0);
    setPaymentNote('');
  };

  const handleWhatsAppShareInvoice = () => {
    if (!selectedInvoice) return;
    const branchInfo = CLINIC_BRANCHES.find(b => b.id === selectedInvoice.branch);
    const message = 
`Hello ${selectedInvoice.patientName},

Here is your receipt from Janta Dental Clinic:
Invoice No: ${selectedInvoice.invoiceNumber}
Date: ${selectedInvoice.date}
Total Amount: ₹${selectedInvoice.grandTotal.toLocaleString('en-IN')}
Paid: ₹${selectedInvoice.paidAmount.toLocaleString('en-IN')}
Balance Due: ₹${selectedInvoice.pendingBalance.toLocaleString('en-IN')}

Branch:
${branchInfo?.name || 'Janta Dental Clinic'}
${branchInfo?.address || 'New Delhi'}

Helpline: 9899007819
Thank you for visiting!`;

    const clean = selectedInvoice.patientMobile.replace(/\D/g, '');
    const mobileNum = clean.startsWith('91') && clean.length === 12 ? clean : `91${clean}`;
    window.open(`https://wa.me/${mobileNum}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">

      {/* Top Header with KPI Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Billing, Invoices & Receipt Console
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {filteredInvoices.length} Invoices
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            GST compliant dental treatment invoices, advance receipts, pending balances and WhatsApp sharing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL COLLECTED</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">₹{totalRevenueCollected.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL OUTSTANDING</span>
              <span className="font-bold text-rose-500">₹{totalPendingBalance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewInvoiceOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-md shadow-teal-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice by Patient Name or Invoice ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Fully Paid</option>
            <option value="Partial">Partial Payment</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Invoice List & Printable Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Invoice List (Left) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Invoices & Receipts</span>
            <span className="text-[11px] text-slate-400 font-mono">{filteredInvoices.length} found</span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto">
            {filteredInvoices.map(inv => {
              const isSelected = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{inv.patientName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      inv.status === 'Partial' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <p className="font-mono text-[11px] text-slate-500">{inv.invoiceNumber} · {inv.date}</p>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-mono text-xs">
                    <span>Total: ₹{inv.grandTotal.toLocaleString('en-IN')}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold">Paid: ₹{inv.paidAmount.toLocaleString('en-IN')}</span>
                  </div>

                  {inv.pendingBalance > 0 && (
                    <p className="text-[10px] font-mono text-rose-500 font-semibold mt-1 text-right">
                      Due: ₹{inv.pendingBalance.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Printable Tax Invoice / Receipt (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Top action controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Receipt No: <strong className="text-slate-900 dark:text-white font-mono">{selectedInvoice?.invoiceNumber}</strong>
            </span>
            <div className="flex items-center gap-2">
              {selectedInvoice?.pendingBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-sm"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Record Payment</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleWhatsAppShareInvoice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                title="Send Invoice Details to Patient WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>

          {/* Printable Invoice Sheet */}
          {selectedInvoice && (
            <div className="p-8 rounded-3xl bg-white text-slate-900 shadow-xl border border-slate-200 min-h-[640px] flex flex-col justify-between font-sans printable-area">
              
              <div>
                {/* Header */}
                <div className="border-b-2 border-teal-700 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-base">
                          J
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-teal-900">
                          JANTA DENTAL CLINIC
                        </h1>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        Dental Treatment Invoice & Payment Receipt
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-mono text-sm font-bold text-slate-900">{selectedInvoice.invoiceNumber}</p>
                      <p className="text-slate-500">Date: {selectedInvoice.date}</p>
                      <p className="text-[10px] text-teal-700 font-semibold mt-0.5">GST Exempted Healthcare Services</p>
                    </div>
                  </div>

                  {/* Branches */}
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <div>
                      <strong className="text-teal-800">Branch 1:</strong> P-55 Raghubir Nagar, New Delhi 110027 · Ph: 9899007819
                    </div>
                    <div className="text-right">
                      <strong className="text-teal-800">Branch 2:</strong> RZ/E-158 Nihal Vihar, Nangloi, New Delhi 110041 · Ph: 9899007819
                    </div>
                  </div>
                </div>

                {/* Billed To */}
                <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">PATIENT DETAILS</span>
                    <strong className="text-slate-900 text-sm">{selectedInvoice.patientName}</strong>
                    <p className="text-slate-600 font-mono">Mobile: {selectedInvoice.patientMobile}</p>
                    <p className="text-slate-500 font-mono">Patient ID: {selectedInvoice.patientId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">TREATMENT LOCATION</span>
                    <strong className="text-slate-900">
                      {selectedInvoice.branch === 'branch-1' ? 'Branch 1: Raghubir Nagar' : 'Branch 2: Nihal Vihar'}
                    </strong>
                    <p className="text-slate-600">Payment Status: <strong className="text-teal-700">{selectedInvoice.status}</strong></p>
                    <p className="text-slate-500">Payment Method: {selectedInvoice.paymentMethod}</p>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="mt-4">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-500">
                        <th className="py-2">Sl.</th>
                        <th className="py-2">Procedure / Treatment Description</th>
                        <th className="py-2 text-right">Fee (₹)</th>
                        <th className="py-2 text-right">Qty</th>
                        <th className="py-2 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 text-slate-400">{idx + 1}</td>
                          <td className="py-3 font-semibold text-slate-900">{item.treatmentName}</td>
                          <td className="py-3 text-right font-mono tabular-nums">{item.cost.toLocaleString('en-IN')}</td>
                          <td className="py-3 text-right font-mono tabular-nums">{item.quantity}</td>
                          <td className="py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                            {item.total.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Calculation Card */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 max-w-sm ml-auto">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono tabular-nums">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount Courtesy:</span>
                      <span className="font-mono tabular-nums">-₹{selectedInvoice.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="font-mono tabular-nums">₹{selectedInvoice.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-teal-700 font-bold">
                    <span>Amount Paid:</span>
                    <span className="font-mono tabular-nums">₹{selectedInvoice.paidAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedInvoice.pendingBalance > 0 ? (
                    <div className="flex justify-between text-rose-600 font-bold pt-1 border-t border-dashed border-slate-200">
                      <span>Balance Outstanding:</span>
                      <span className="font-mono tabular-nums">₹{selectedInvoice.pendingBalance.toLocaleString('en-IN')}</span>
                    </div>
                  ) : (
                    <div className="text-center pt-2 text-emerald-700 font-bold">
                      ✓ Complete Payment Settled
                    </div>
                  )}
                </div>

                {/* Payment History Notes */}
                {selectedInvoice.paymentNotes && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600">
                    <strong>Payment Ledger Notes:</strong> {selectedInvoice.paymentNotes}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-200 mt-6 flex items-end justify-between text-xs">
                <div className="text-[10px] text-slate-400 max-w-xs">
                  Computer generated official clinical receipt. All dental treatments covered under warranty as per clinic protocols.
                </div>
                <div className="text-right">
                  <div className="w-36 border-b border-slate-400 mb-1"></div>
                  <p className="font-bold text-slate-900">Janta Dental Accounts</p>
                  <p className="text-[10px] text-slate-500">Authorized Signature</p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Record Payment Modal */}
      {isRecordPaymentOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Record Patient Payment
            </h3>
            <p className="text-slate-500 mb-4">
              Patient: <strong className="text-slate-900 dark:text-white">{selectedInvoice.patientName}</strong> · Outstanding: <strong className="text-rose-500 font-mono">₹{selectedInvoice.pendingBalance.toLocaleString('en-IN')}</strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount to Collect (₹) *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedInvoice.pendingBalance}
                  value={paymentAmount || selectedInvoice.pendingBalance}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Card">Debit / Credit Card (POS)</option>
                  <option value="Bank Transfer">NEFT / IMPS Bank Transfer</option>
                  <option value="Mixed Payment">Mixed Payment</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Transaction Ref / Note</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="e.g. UPI ref #99214488 or Cash receipt"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setIsRecordPaymentOpen(false)}
                className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePayment}
                className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
              >
                Confirm Payment & Update Balance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Invoice Modal */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-500" />
                <span>Create New Treatment Invoice</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewInvoiceOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 mt-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Patient *</label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Branch *</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as BranchId)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="branch-1">Branch 1: Raghubir Nagar</option>
                    <option value="branch-2">Branch 2: Nihal Vihar</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Add treatment quick presets */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Add Treatment to Invoice (Click to add):
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {STANDARD_TREATMENTS.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleAddItem(t.name, t.defaultCost)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-teal-500 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-teal-500" />
                      <span>{t.name} (₹{t.defaultCost})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Items */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Invoice Items ({items.length}):
                </label>
                {items.map((it, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900 dark:text-white flex-1">{it.treatmentName}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹{it.cost.toLocaleString('en-IN')}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Initial payment collection */}
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-2">
                <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Grand Total:</span>
                  <span className="font-mono text-teal-700 dark:text-teal-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Advance / Initial Paid (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={grandTotal}
                      value={initialPaid}
                      onChange={(e) => setInitialPaid(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={initialMethod}
                      onChange={(e) => setInitialMethod(e.target.value as PaymentMethod)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                >
                  Generate Invoice
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
