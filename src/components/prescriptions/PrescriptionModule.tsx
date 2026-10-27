import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Prescription, PrescriptionMedicine, BranchId, Patient } from '../../types';
import { CLINIC_BRANCHES } from '../../data/initialData';
import { 
  FileText, 
  Plus, 
  Printer, 
  Trash2, 
  Check, 
  Send, 
  User, 
  Calendar, 
  ShieldCheck, 
  Stethoscope, 
  Sparkles,
  Download,
  Building2,
  X
} from 'lucide-react';

interface PrescriptionModuleProps {
  initialPatient?: Patient | null;
}

const COMMON_DENTAL_MEDICINES = [
  { name: 'Augmentin 625 (Amoxicillin + Clavulanic Acid)', dosage: '625 mg', frequency: '1-0-1 (Twice daily)', timing: 'After meals', duration: '5 Days', instructions: 'Complete full course. Stop if rash appears.' },
  { name: 'Amoxicillin 500', dosage: '500 mg', frequency: '1-1-1 (Thrice daily)', timing: 'After meals', duration: '5 Days', instructions: 'Take with plenty of water.' },
  { name: 'Metrogyl 400 (Metronidazole)', dosage: '400 mg', frequency: '1-0-1 (Twice daily)', timing: 'After meals', duration: '5 Days', instructions: 'Strictly avoid alcohol.' },
  { name: 'Zerodol-SP (Aceclofenac + Paracetamol + Serratiopeptidase)', dosage: '1 Tablet', frequency: '1-0-1 (Twice daily)', timing: 'After meals', duration: '3 Days', instructions: 'Anti-inflammatory for swelling and pain.' },
  { name: 'Ketorol-DT (Ketorolac Tromethamine)', dosage: '10 mg', frequency: '1 Tab SOS', timing: 'Dispersed in water', duration: '2 Days', instructions: 'Dissolve in 1 tablespoon of water for acute pain.' },
  { name: 'Pan-D (Pantoprazole + Domperidone)', dosage: '40 mg', frequency: '1-0-0 (Morning)', timing: 'Before breakfast', duration: '5 Days', instructions: 'Take 30 mins before food for antacid support.' },
  { name: 'Hexidine Mouthwash (0.2% Chlorhexidine)', dosage: '10 ml', frequency: 'Twice daily', timing: 'After brushing', duration: '7 Days', instructions: 'Swish for 60 seconds. Do not rinse with water for 20 mins.' },
  { name: 'Mucopain Gel (Benzocaine)', dosage: 'Pea sized', frequency: '3 times daily', timing: 'Before food', duration: '4 Days', instructions: 'Apply locally over ulcer / wound 10 mins before meals.' },
  { name: 'Sensodyne Rapid Relief Toothpaste', dosage: 'Regular', frequency: 'Twice daily', timing: 'Morning & Night', duration: '30 Days', instructions: 'Brush with soft bristle brush for tooth sensitivity.' }
];

export const PrescriptionModule: React.FC<PrescriptionModuleProps> = ({ initialPatient }) => {
  const { prescriptions, patients, addPrescription, activeBranch } = useClinic();

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription>(prescriptions[0]);
  const [isCreating, setIsCreating] = useState(false);

  // New Prescription Form State
  const [patientId, setPatientId] = useState(initialPatient?.id || patients[0]?.id || '');
  const [doctorName, setDoctorName] = useState('Dr. LP Diwakar');
  const [doctorRegNo, setDoctorRegNo] = useState('DCI-DEL-14892');
  const [branch, setBranch] = useState<BranchId>(activeBranch !== 'all' ? activeBranch : 'branch-1');
  const [date, setDate] = useState('2026-10-27');
  const [diagnosis, setDiagnosis] = useState('');
  const [generalAdvice, setGeneralAdvice] = useState('Soft and cold diet for 24 hours. Avoid chewing on operative side. Maintain warm saline rinses from tomorrow.');
  const [nextVisitDate, setNextVisitDate] = useState('2026-11-03');
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'MED-1',
      name: 'Augmentin 625 (Amoxicillin + Potassium Clavulanate)',
      dosage: '625 mg',
      frequency: '1-0-1 (Twice daily)',
      timing: 'After meals',
      duration: '5 Days',
      instructions: 'Take strictly after meals. Complete full 5-day course.'
    },
    {
      id: 'MED-2',
      name: 'Zerodol-SP (Aceclofenac + Paracetamol + Serratiopeptidase)',
      dosage: '1 Tab',
      frequency: '1-0-1 (Twice daily)',
      timing: 'After meals',
      duration: '3 Days',
      instructions: 'For post-op pain and tissue swelling.'
    }
  ]);

  const handleAddPresetMedicine = (preset: typeof COMMON_DENTAL_MEDICINES[0]) => {
    setMedicines(prev => [
      ...prev,
      {
        id: `MED-${Date.now()}`,
        name: preset.name,
        dosage: preset.dosage,
        frequency: preset.frequency,
        timing: preset.timing,
        duration: preset.duration,
        instructions: preset.instructions
      }
    ]);
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === patientId);
    if (!pat) return;

    const newRx = addPrescription({
      patientId: pat.id,
      patientName: pat.name,
      patientAge: pat.age,
      patientGender: pat.gender,
      patientMobile: pat.mobile,
      doctorName,
      doctorRegNo,
      branch,
      date,
      diagnosis,
      medicines,
      generalAdvice,
      nextVisitDate
    });

    setSelectedPrescription(newRx);
    setIsCreating(false);
  };

  const currentBranchObj = CLINIC_BRANCHES.find(b => b.id === (selectedPrescription?.branch || branch));

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Clinical Prescription Module (Rx Pad)
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {prescriptions.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            DCI compliant digital prescription pad with dual branch branding, medicine dosages and print format.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-md shadow-teal-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Rx</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Prescription History Selector (Left Sidebar) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Recent Prescriptions</span>
            <span className="text-[11px] text-slate-400 font-mono">Issued</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {prescriptions.map(rx => {
              const isSelected = selectedPrescription?.id === rx.id;
              return (
                <div
                  key={rx.id}
                  onClick={() => setSelectedPrescription(rx)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{rx.patientName}</span>
                    <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400">{rx.prescriptionNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{rx.diagnosis || 'Dental Consultation'}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{rx.date}</span>
                    <span>{rx.medicines.length} meds</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prescription Pad Printable Preview (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Action strip */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Viewing Prescription: <strong className="text-slate-900 dark:text-white">{selectedPrescription?.prescriptionNumber}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Rx / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Authentic Clinical Prescription Sheet */}
          {selectedPrescription && (
            <div className="p-8 rounded-3xl bg-white text-slate-900 shadow-xl border border-slate-200 min-h-[640px] flex flex-col justify-between font-sans printable-area">
              
              {/* Clinic Header */}
              <div>
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
                        Advanced Multi-Speciality Dental Center & Implant Clinic
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-bold text-slate-900">{selectedPrescription.doctorName}</p>
                      <p className="text-slate-600">BDS, MDS Oral & Maxillofacial Surgery</p>
                      <p className="text-[11px] text-slate-500 font-mono">Reg No: {selectedPrescription.doctorRegNo}</p>
                    </div>
                  </div>

                  {/* Dual Branches Address Strip */}
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <div>
                      <strong className="text-teal-800">Branch 1:</strong> P-55 Raghubir Nagar, New Delhi 110027 · Ph: 9899007819
                    </div>
                    <div className="text-right">
                      <strong className="text-teal-800">Branch 2:</strong> RZ/E-158 Nihal Vihar, Nangloi, New Delhi 110041 · Ph: 9899007819
                    </div>
                  </div>
                </div>

                {/* Patient Information Strip */}
                <div className="grid grid-cols-4 gap-2 py-3 border-b border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">PATIENT NAME</span>
                    <strong className="text-slate-900">{selectedPrescription.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">AGE / GENDER</span>
                    <strong className="text-slate-900">{selectedPrescription.patientAge} Y / {selectedPrescription.patientGender}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">PATIENT ID / MOB</span>
                    <strong className="text-slate-900 font-mono">{selectedPrescription.patientId}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">DATE</span>
                    <strong className="text-slate-900 font-mono">{selectedPrescription.date}</strong>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="mt-4 mb-2 text-xs">
                  <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">Clinical Diagnosis:</span>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {selectedPrescription.diagnosis || 'Routine Dental Checkup & Assessment'}
                  </p>
                </div>

                {/* Rx Symbol */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-2xl font-black font-serif text-teal-800">℞</span>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Prescribed Medications</span>
                </div>

                {/* Medicine Items Table */}
                <div className="mt-2 space-y-3">
                  {selectedPrescription.medicines.map((med, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {idx + 1}. {med.name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold text-[11px]">
                            {med.dosage}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">
                          <strong>Frequency:</strong> {med.frequency} · <strong>Timing:</strong> {med.timing} · <strong>Duration:</strong> {med.duration}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 italic max-w-xs text-right">
                        {med.instructions}
                      </span>
                    </div>
                  ))}
                </div>

                {/* General Advice */}
                {selectedPrescription.generalAdvice && (
                  <div className="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs">
                    <span className="font-bold text-amber-900 block mb-0.5">Post-Procedure Advice & Instructions:</span>
                    <p className="text-amber-800 leading-relaxed">{selectedPrescription.generalAdvice}</p>
                  </div>
                )}
              </div>

              {/* Footer with Doctor Signature & Next Visit */}
              <div className="pt-8 border-t border-slate-200 mt-8">
                <div className="flex items-end justify-between text-xs">
                  <div>
                    {selectedPrescription.nextVisitDate && (
                      <p className="text-slate-600">
                        <strong>Next Review Visit:</strong> <span className="font-mono font-bold text-teal-800">{selectedPrescription.nextVisitDate}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1">
                      For clinical assistance or medicine query, call clinic helpline: <strong>9899007819</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="w-36 border-b border-slate-400 mb-1"></div>
                    <p className="font-bold text-slate-900">{selectedPrescription.doctorName}</p>
                    <p className="text-[10px] text-slate-500">Authorized Medical Signature / Seal</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Generate New Rx Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                <span>Write Clinical Prescription</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-4 mt-4">
              
              {/* Row 1: Patient, Branch, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Patient *</label>
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
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Irreversible Pulpitis #3, Pericoronitis #32"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Quick Preset Dental Medicines Strip */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  1-Click Dental Medicine Presets (Click to add):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_DENTAL_MEDICINES.map((med, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetMedicine(med)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-teal-500 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-teal-500" />
                      <span>{med.name.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Medicines in List */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Prescription Medicines ({medicines.length}):
                </label>
                {medicines.map((m, idx) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white">{idx + 1}. {m.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {m.dosage} · {m.frequency} · {m.timing} · {m.duration}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(m.id)}
                      className="text-rose-500 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Advice & Next Visit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">General Advice</label>
                  <textarea
                    value={generalAdvice}
                    onChange={(e) => setGeneralAdvice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Next Visit Date</label>
                  <input
                    type="date"
                    value={nextVisitDate}
                    onChange={(e) => setNextVisitDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                >
                  Issue & Save Prescription
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
