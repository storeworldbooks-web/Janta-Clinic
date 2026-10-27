import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { ToothCondition, ToothRecord } from '../../types';
import { STANDARD_TREATMENTS } from '../../data/initialData';
import { 
  Stethoscope, 
  Check, 
  AlertTriangle, 
  Plus, 
  Save, 
  RotateCcw, 
  User, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

// Tooth names helper for 1-32 Universal System
const TOOTH_NAMES: Record<number, { name: string; type: string; fdi: number }> = {
  // Upper Right (Maxillary Right)
  1: { name: 'Third Molar (Wisdom)', type: 'Molar', fdi: 18 },
  2: { name: 'Second Molar', type: 'Molar', fdi: 17 },
  3: { name: 'First Molar (6-yr)', type: 'Molar', fdi: 16 },
  4: { name: 'Second Premolar', type: 'Premolar', fdi: 15 },
  5: { name: 'First Premolar', type: 'Premolar', fdi: 14 },
  6: { name: 'Canine (Cuspid)', type: 'Canine', fdi: 13 },
  7: { name: 'Lateral Incisor', type: 'Incisor', fdi: 12 },
  8: { name: 'Central Incisor', type: 'Incisor', fdi: 11 },
  // Upper Left (Maxillary Left)
  9: { name: 'Central Incisor', type: 'Incisor', fdi: 21 },
  10: { name: 'Lateral Incisor', type: 'Incisor', fdi: 22 },
  11: { name: 'Canine (Cuspid)', type: 'Canine', fdi: 23 },
  12: { name: 'First Premolar', type: 'Premolar', fdi: 24 },
  13: { name: 'Second Premolar', type: 'Premolar', fdi: 25 },
  14: { name: 'First Molar (6-yr)', type: 'Molar', fdi: 26 },
  15: { name: 'Second Molar', type: 'Molar', fdi: 27 },
  16: { name: 'Third Molar (Wisdom)', type: 'Molar', fdi: 28 },
  // Lower Left (Mandibular Left)
  17: { name: 'Third Molar (Wisdom)', type: 'Molar', fdi: 38 },
  18: { name: 'Second Molar', type: 'Molar', fdi: 37 },
  19: { name: 'First Molar (6-yr)', type: 'Molar', fdi: 36 },
  20: { name: 'Second Premolar', type: 'Premolar', fdi: 35 },
  21: { name: 'First Premolar', type: 'Premolar', fdi: 34 },
  22: { name: 'Canine (Cuspid)', type: 'Canine', fdi: 33 },
  23: { name: 'Lateral Incisor', type: 'Incisor', fdi: 32 },
  24: { name: 'Central Incisor', type: 'Incisor', fdi: 31 },
  // Lower Right (Mandibular Right)
  25: { name: 'Central Incisor', type: 'Incisor', fdi: 41 },
  26: { name: 'Lateral Incisor', type: 'Incisor', fdi: 42 },
  27: { name: 'Canine (Cuspid)', type: 'Canine', fdi: 43 },
  28: { name: 'First Premolar', type: 'Premolar', fdi: 44 },
  29: { name: 'Second Premolar', type: 'Premolar', fdi: 45 },
  30: { name: 'First Molar (6-yr)', type: 'Molar', fdi: 46 },
  31: { name: 'Second Molar', type: 'Molar', fdi: 47 },
  32: { name: 'Third Molar (Wisdom)', type: 'Molar', fdi: 48 },
};

const CONDITION_COLORS: Record<ToothCondition, { bg: string; text: string; label: string; stroke: string }> = {
  healthy: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300', label: 'Healthy', stroke: '#94a3b8' },
  cavity: { bg: 'bg-amber-500/20', text: 'text-amber-500', label: 'Cavity / Caries', stroke: '#f59e0b' },
  'root-canal': { bg: 'bg-cyan-500/20', text: 'text-cyan-500', label: 'Root Canal (RCT)', stroke: '#06b6d4' },
  implant: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Dental Implant', stroke: '#a855f7' },
  crown: { bg: 'bg-emerald-500/20', text: 'text-emerald-500', label: 'Dental Crown', stroke: '#10b981' },
  bridge: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', label: 'Fixed Bridge', stroke: '#6366f1' },
  missing: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'Missing Tooth', stroke: '#f43f5e' },
  'extraction-needed': { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Extraction Needed', stroke: '#ef4444' }
};

export const DentalChart: React.FC = () => {
  const { patients, updateToothRecord } = useClinic();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [selectedToothNum, setSelectedToothNum] = useState<number>(3);
  const [numberingSystem, setNumberingSystem] = useState<'universal' | 'fdi'>('universal');
  const [toothNote, setToothNote] = useState('');
  const [plannedTreatment, setPlannedTreatment] = useState('');

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const chartData = currentPatient?.dentalChart || {};
  const currentToothRecord: ToothRecord = chartData[selectedToothNum] || {
    toothNumber: selectedToothNum,
    condition: 'healthy',
    updatedAt: new Date().toISOString().split('T')[0]
  };

  const handleApplyCondition = (condition: ToothCondition) => {
    if (!currentPatient) return;
    updateToothRecord(currentPatient.id, selectedToothNum, {
      condition,
      notes: toothNote || currentToothRecord.notes,
      plannedTreatment: plannedTreatment || currentToothRecord.plannedTreatment
    });
  };

  const handleSaveTreatmentPlan = () => {
    if (!currentPatient) return;
    updateToothRecord(currentPatient.id, selectedToothNum, {
      condition: currentToothRecord.condition,
      notes: toothNote,
      plannedTreatment: plannedTreatment
    });
    alert(`Updated treatment plan for Tooth #${selectedToothNum}`);
  };

  // Render individual tooth button in arch
  const renderTooth = (num: number) => {
    const record = chartData[num];
    const condition: ToothCondition = record?.condition || 'healthy';
    const isSelected = selectedToothNum === num;
    const info = TOOTH_NAMES[num];
    const displayNum = numberingSystem === 'universal' ? num : info.fdi;
    const condMeta = CONDITION_COLORS[condition];

    return (
      <button
        key={num}
        type="button"
        onClick={() => {
          setSelectedToothNum(num);
          setToothNote(record?.notes || '');
          setPlannedTreatment(record?.plannedTreatment || '');
        }}
        className={`relative flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl transition-all duration-150 ${
          isSelected 
            ? 'ring-2 ring-teal-500 shadow-lg shadow-teal-500/20 bg-teal-500/10' 
            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        {/* Crown representation SVG */}
        <div 
          className="w-8 h-10 sm:w-10 sm:h-12 rounded-lg flex items-center justify-center border border-slate-300 dark:border-slate-700 relative overflow-hidden transition-colors"
          style={{ backgroundColor: condition === 'healthy' ? 'transparent' : condMeta.stroke + '20' }}
        >
          {/* Anatomical tooth symbol or condition icon */}
          <span 
            className="text-xs font-bold"
            style={{ color: condMeta.stroke }}
          >
            {condition === 'missing' ? '✕' : condition === 'implant' ? '🔩' : condition === 'crown' ? '👑' : condition === 'root-canal' ? '⚡' : '🦷'}
          </span>

          {/* Condition color accent pill at bottom */}
          <div 
            className="absolute bottom-0 inset-x-0 h-1" 
            style={{ backgroundColor: condMeta.stroke }} 
          />
        </div>

        {/* Tooth number */}
        <span className="mt-1 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
          {displayNum}
        </span>
      </button>
    );
  };

  const toothMeta = TOOTH_NAMES[selectedToothNum];

  return (
    <div className="space-y-6">

      {/* Header bar with Patient Selector & System Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Interactive 32-Tooth Digital Odontogram
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adult dentition mapping with surface conditions, restoration history and treatment planning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Patient Selector */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id} className="dark:bg-slate-900">
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>

          {/* Notation Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setNumberingSystem('universal')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                numberingSystem === 'universal'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Universal (1-32)
            </button>
            <button
              type="button"
              onClick={() => setNumberingSystem('fdi')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                numberingSystem === 'fdi'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              FDI / ISO (11-48)
            </button>
          </div>

        </div>
      </div>

      {/* Main Odontogram Canvas & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 32-Tooth Diagram Arch */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          
          {/* Upper Arch (Maxilla) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Upper Arch — Maxilla (Teeth 1 - 16)
              </span>
              <span className="text-[11px] text-slate-400">Right → Left</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
              <div className="flex items-center justify-between gap-1 min-w-[580px]">
                {/* 1 to 16 */}
                {Array.from({ length: 16 }, (_, i) => i + 1).map(num => renderTooth(num))}
              </div>
            </div>
          </div>

          {/* Arch Midline Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-slate-300 dark:border-slate-700"></div>
            </div>
            <span className="relative px-3 py-1 bg-white dark:bg-slate-900 text-[10px] font-mono uppercase text-slate-400 rounded-full border border-slate-200 dark:border-slate-800">
              Occlusal Plane Midline
            </span>
          </div>

          {/* Lower Arch (Mandible) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Lower Arch — Mandible (Teeth 17 - 32)
              </span>
              <span className="text-[11px] text-slate-400">Left → Right</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
              <div className="flex items-center justify-between gap-1 min-w-[580px]">
                {/* 32 to 17 order (anatomical lower right to lower left) */}
                {[32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17].map(num => renderTooth(num))}
              </div>
            </div>
          </div>

          {/* Condition Legend */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">Clinical Condition Legend:</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {(Object.keys(CONDITION_COLORS) as ToothCondition[]).map(key => {
                const item = CONDITION_COLORS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleApplyCondition(key)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-500 transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.stroke }} />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Selected Tooth Inspector & Treatment Planning */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-teal-600 dark:text-teal-400 font-mono">
                Tooth #{selectedToothNum} (FDI: {toothMeta.fdi})
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {toothMeta.type}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {toothMeta.name}
            </h3>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-900 dark:text-white">{currentPatient?.name}</strong>
            </p>
          </div>

          {/* Quick Mark Condition Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Mark Clinical Diagnosis:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(Object.keys(CONDITION_COLORS) as ToothCondition[]).map(cond => {
                const item = CONDITION_COLORS[cond];
                const isActive = currentToothRecord.condition === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleApplyCondition(cond)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                      isActive 
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 font-bold text-teal-700 dark:text-teal-300 shadow-sm' 
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.stroke }} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Planned Treatment Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Prescribe / Plan Treatment:
            </label>
            <select
              value={plannedTreatment}
              onChange={(e) => setPlannedTreatment(e.target.value)}
              className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">-- No Treatment Planned --</option>
              {STANDARD_TREATMENTS.map(t => (
                <option key={t.id} value={t.name}>
                  {t.name} (₹{t.defaultCost.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Clinical Findings / Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Doctor Observations & Radiograph Notes:
            </label>
            <textarea
              value={toothNote}
              onChange={(e) => setToothNote(e.target.value)}
              placeholder="e.g. Deep occlusal caries approaching pulp, tender on percussion, recommended single sitting RCT with post & core."
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 h-20 resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveTreatmentPlan}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md shadow-teal-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save to Patient Dental Record</span>
          </button>

          {/* Last updated timestamp */}
          <div className="text-[11px] text-slate-400 text-center font-mono">
            Last updated: {currentToothRecord.updatedAt || 'Recent'}
          </div>

        </div>

      </div>

    </div>
  );
};
