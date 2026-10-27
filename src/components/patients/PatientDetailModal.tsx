import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Patient } from '../../types';
import { 
  X, 
  Calendar, 
  FileText, 
  Receipt, 
  Clock, 
  FolderArchive, 
  Plus, 
  Send, 
  Stethoscope, 
  AlertCircle, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Eye, 
  ZoomIn, 
  Printer, 
  Download 
} from 'lucide-react';

interface PatientDetailModalProps {
  patient: Patient | null;
  onClose: () => void;
  onNewPrescription: (patient: Patient) => void;
  onNewAppointment: (patient: Patient) => void;
  onNewInvoice: (patient: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  onClose,
  onNewPrescription,
  onNewAppointment,
  onNewInvoice
}) => {
  const { 
    appointments, 
    prescriptions, 
    invoices, 
    documents, 
    followUps,
    sendWhatsAppReminder,
    sendWhatsAppFollowUp
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'timeline' | 'prescriptions' | 'invoices' | 'xrays' | 'followups'>('timeline');
  const [selectedXray, setSelectedXray] = useState<string | null>(null);

  if (!patient) return null;

  // Filter patient related entities
  const patientAppointments = appointments.filter(a => a.patientId === patient.id || a.patientName === patient.name);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id || p.patientName === patient.name);
  const patientInvoices = invoices.filter(i => i.patientId === patient.id || i.patientName === patient.name);
  const patientDocs = documents.filter(d => d.patientId === patient.id);
  const patientFollowUps = followUps.filter(f => f.patientId === patient.id || f.patientName === patient.name);

  // Consolidated timeline events sorted by date descending
  type TimelineEvent = {
    id: string;
    date: string;
    title: string;
    type: 'visit' | 'prescription' | 'invoice' | 'document' | 'followup';
    desc: string;
    status?: string;
    extra?: any;
  };

  const timelineEvents: TimelineEvent[] = [
    ...patientAppointments.map(a => ({
      id: a.id,
      date: a.date,
      title: `${a.treatment} Consultation`,
      type: 'visit' as const,
      desc: `Attended by ${a.doctorName.split('(')[0]} · Status: ${a.status}. Notes: ${a.notes || 'None'}`,
      status: a.status
    })),
    ...patientPrescriptions.map(p => ({
      id: p.id,
      date: p.date,
      title: `Prescription #${p.prescriptionNumber}`,
      type: 'prescription' as const,
      desc: `Diagnosis: ${p.diagnosis}. Prescribed ${p.medicines.length} medications. Advice: ${p.generalAdvice}`
    })),
    ...patientInvoices.map(i => ({
      id: i.id,
      date: i.date,
      title: `Invoice #${i.invoiceNumber}`,
      type: 'invoice' as const,
      desc: `Grand Total: ₹${i.grandTotal.toLocaleString('en-IN')} · Paid: ₹${i.paidAmount.toLocaleString('en-IN')} (${i.paymentMethod}) · Balance: ₹${i.pendingBalance.toLocaleString('en-IN')}`,
      status: i.status
    })),
    ...patientDocs.map(d => ({
      id: d.id,
      date: d.uploadedAt,
      title: d.title,
      type: 'document' as const,
      desc: `Category: ${d.type}. ${d.notes || ''}`,
      extra: d.fileUrl
    })),
    ...patientFollowUps.map(f => ({
      id: f.id,
      date: f.scheduledDate,
      title: `${f.intervalDays}-Day Post-Op Follow-Up`,
      type: 'followup' as const,
      desc: `Target treatment: ${f.treatmentName}. Status: ${f.status}`,
      status: f.status
    }))
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 my-6 max-h-[92vh] overflow-y-auto flex flex-col">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {patient.name}
                </h2>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {patient.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {patient.age} yrs · {patient.gender} · Blood {patient.bloodGroup}
                </span>
                {patient.isEmergencyFlag && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                    High Alert
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-teal-500" />
                  <span className="font-mono">{patient.mobile}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-xs">{patient.address}</span>
                </span>
                <span className="text-teal-600 dark:text-teal-400 font-medium">
                  {patient.branchAssigned === 'branch-1' ? 'Branch 1: Raghubir Nagar' : 'Branch 2: Nihal Vihar'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => onNewAppointment(patient)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold hover:bg-teal-100"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Visit</span>
            </button>
            <button
              type="button"
              onClick={() => onNewPrescription(patient)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold hover:bg-slate-200"
            >
              <FileText className="w-3.5 h-3.5 text-teal-500" />
              <span>Prescription</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Medical Alerts Bar */}
        {(patient.medicalHistory.length > 0 || patient.allergies.length > 0 || patient.currentMedication) && (
          <div className="my-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs flex flex-wrap gap-4 items-center">
            {patient.medicalHistory.length > 0 && (
              <div>
                <span className="font-bold text-amber-800 dark:text-amber-300 mr-1.5">Medical History:</span>
                <span className="text-slate-700 dark:text-slate-300">{patient.medicalHistory.join(', ')}</span>
              </div>
            )}
            {patient.allergies.length > 0 && (
              <div>
                <span className="font-bold text-rose-800 dark:text-rose-400 mr-1.5">Allergies:</span>
                <span className="text-rose-700 dark:text-rose-300 font-semibold">{patient.allergies.join(', ')}</span>
              </div>
            )}
            {patient.currentMedication && (
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 mr-1.5">Meds:</span>
                <span className="text-slate-600 dark:text-slate-400">{patient.currentMedication}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'timeline' 
                ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Complete Timeline ({timelineEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prescriptions')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'prescriptions' 
                ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Prescriptions ({patientPrescriptions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'invoices' 
                ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Billing & Invoices ({patientInvoices.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('xrays')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'xrays' 
                ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Digital X-Rays ({patientDocs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('followups')}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'followups' 
                ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Follow-Up Tracker ({patientFollowUps.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-4 flex-1">
          
          {/* Timeline View */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {timelineEvents.length > 0 ? (
                <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-6 py-2">
                  {timelineEvents.map(ev => {
                    return (
                      <div key={ev.id} className="relative pl-6">
                        {/* Dot */}
                        <div className={`absolute -left-2 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                          ev.type === 'visit' ? 'bg-teal-500' :
                          ev.type === 'prescription' ? 'bg-indigo-500' :
                          ev.type === 'invoice' ? 'bg-emerald-500' :
                          ev.type === 'document' ? 'bg-cyan-500' : 'bg-amber-500'
                        }`} />

                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white">{ev.title}</span>
                            <span className="font-mono text-[11px] text-slate-400">{ev.date}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{ev.desc}</p>

                          {ev.extra && (
                            <div className="mt-2.5">
                              <button
                                type="button"
                                onClick={() => setSelectedXray(ev.extra)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 text-white text-[11px] hover:bg-slate-800"
                              >
                                <Eye className="w-3.5 h-3.5 text-teal-400" />
                                <span>Inspect Image / X-Ray</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No previous records found for this patient yet.
                </div>
              )}
            </div>
          )}

          {/* Prescriptions View */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-3">
              {patientPrescriptions.length > 0 ? (
                patientPrescriptions.map(rx => (
                  <div key={rx.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{rx.prescriptionNumber}</span>
                        <span className="ml-2 text-slate-400 font-mono">Date: {rx.date}</span>
                      </div>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">{rx.doctorName}</span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>Diagnosis:</strong> {rx.diagnosis}
                    </p>

                    <div className="space-y-1.5 mt-2">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">Prescribed Medicines:</p>
                      {rx.medicines.map((m, i) => (
                        <div key={i} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{m.name} ({m.dosage})</p>
                            <p className="text-[11px] text-slate-500">{m.frequency} · {m.timing} · Duration: {m.duration}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 italic">{m.instructions}</span>
                        </div>
                      ))}
                    </div>

                    {rx.generalAdvice && (
                      <p className="text-[11px] text-slate-500 italic pt-1">
                        Advice: {rx.generalAdvice}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No prescriptions issued yet. Click "+ Prescription" to generate one.
                </div>
              )}
            </div>
          )}

          {/* Invoices View */}
          {activeTab === 'invoices' && (
            <div className="space-y-3">
              {patientInvoices.length > 0 ? (
                patientInvoices.map(inv => (
                  <div key={inv.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{inv.invoiceNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {inv.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                          <span>{item.treatmentName} x {item.quantity}</span>
                          <span className="font-mono">₹{item.total.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Grand Total: ₹{inv.grandTotal.toLocaleString('en-IN')}</span>
                      <span className="text-teal-600 dark:text-teal-400">Paid: ₹{inv.paidAmount.toLocaleString('en-IN')}</span>
                    </div>
                    {inv.pendingBalance > 0 && (
                      <p className="text-rose-500 font-semibold text-right">
                        Pending Balance: ₹{inv.pendingBalance.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No invoices recorded yet.
                </div>
              )}
            </div>
          )}

          {/* Digital X-Rays & Radiographs */}
          {activeTab === 'xrays' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patientDocs.map(doc => (
                  <div key={doc.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setSelectedXray(doc.fileUrl)}>
                      <img
                        src={doc.fileUrl}
                        alt={doc.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-white text-xs font-semibold">
                        <span className="truncate">{doc.title}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs flex justify-between items-center text-slate-500">
                      <span>{doc.type} · {doc.uploadedAt}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedXray(doc.fileUrl)}
                        className="text-teal-600 dark:text-teal-400 font-medium hover:underline flex items-center gap-1"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {patientDocs.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No radiograph or clinical photo attached to this patient file yet.
                </div>
              )}
            </div>
          )}

          {/* Follow-Ups */}
          {activeTab === 'followups' && (
            <div className="space-y-3">
              {patientFollowUps.map(flw => (
                <div key={flw.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {flw.intervalDays}-Day Follow-Up ({flw.treatmentName})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Scheduled Date: {flw.scheduledDate} · Status: <span className="font-semibold text-teal-600 dark:text-teal-400">{flw.status}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => sendWhatsAppFollowUp(flw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm shadow-emerald-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp Follow-Up</span>
                  </button>
                </div>
              ))}

              {patientFollowUps.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No scheduled follow-up milestones for this patient.
                </div>
              )}
            </div>
          )}

        </div>

        {/* X-Ray Lightbox Modal */}
        {selectedXray && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative max-w-4xl w-full text-center">
              <button
                type="button"
                onClick={() => setSelectedXray(null)}
                className="absolute -top-10 right-0 p-2 text-white hover:text-teal-400"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedXray}
                alt="Enlarged Radiograph"
                className="max-h-[80vh] mx-auto rounded-xl border border-slate-700 shadow-2xl object-contain"
                referrerPolicy="no-referrer"
              />
              <p className="text-slate-400 text-xs mt-3">
                Digital OPG / Intraoral Radiograph Lightbox — Clinical Diagnostic View
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
