import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Patient, BranchId } from '../../types';
import { CLINIC_BRANCHES } from '../../data/initialData';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  QrCode, 
  History, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  HeartPulse, 
  ShieldAlert,
  X,
  Check,
  Stethoscope,
  Clock,
  Printer
} from 'lucide-react';

interface PatientManagementProps {
  onSelectPatientTimeline: (patient: Patient) => void;
  onOpenNewAppointmentForPatient: (patient: Patient) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  onSelectPatientTimeline,
  onOpenNewAppointmentForPatient
}) => {
  const { patients, addPatient, updatePatient, deletePatient, activeBranch } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'all' | BranchId>('all');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [onlyEmergency, setOnlyEmergency] = useState<boolean>(false);

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [qrModalPatient, setQrModalPatient] = useState<Patient | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('B+');
  const [address, setAddress] = useState('');
  const [branchAssigned, setBranchAssigned] = useState<BranchId>('branch-1');
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [currentMedication, setCurrentMedication] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [notes, setNotes] = useState('');
  const [isEmergencyFlag, setIsEmergencyFlag] = useState(false);

  const resetForm = () => {
    setName('');
    setMobile('');
    setAltMobile('');
    setEmail('');
    setAge(30);
    setGender('Male');
    setBloodGroup('B+');
    setAddress('');
    setBranchAssigned(activeBranch !== 'all' ? activeBranch : 'branch-1');
    setMedicalHistory([]);
    setAllergies([]);
    setCurrentMedication('');
    setEmergencyName('');
    setEmergencyPhone('');
    setEmergencyRelation('');
    setNotes('');
    setIsEmergencyFlag(false);
    setEditingPatient(null);
  };

  const handleOpenEdit = (p: Patient) => {
    setEditingPatient(p);
    setName(p.name);
    setMobile(p.mobile);
    setAltMobile(p.altMobile || '');
    setEmail(p.email || '');
    setAge(p.age);
    setGender(p.gender);
    setBloodGroup(p.bloodGroup);
    setAddress(p.address);
    setBranchAssigned(p.branchAssigned);
    setMedicalHistory(p.medicalHistory || []);
    setAllergies(p.allergies || []);
    setCurrentMedication(p.currentMedication || '');
    setEmergencyName(p.emergencyContact?.name || '');
    setEmergencyPhone(p.emergencyContact?.phone || '');
    setEmergencyRelation(p.emergencyContact?.relationship || '');
    setNotes(p.notes || '');
    setIsEmergencyFlag(!!p.isEmergencyFlag);
    setIsAddEditOpen(true);
  };

  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      alert('Patient Name and Mobile number are required.');
      return;
    }

    if (editingPatient) {
      updatePatient({
        ...editingPatient,
        name,
        mobile,
        altMobile,
        email,
        age,
        gender,
        bloodGroup,
        address,
        branchAssigned,
        medicalHistory,
        allergies,
        currentMedication,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRelation
        },
        notes,
        isEmergencyFlag
      });
    } else {
      addPatient({
        name,
        mobile,
        altMobile,
        email,
        age,
        gender,
        bloodGroup,
        address,
        branchAssigned,
        medicalHistory,
        allergies,
        currentMedication,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRelation
        },
        notes,
        isEmergencyFlag
      });
    }

    setIsAddEditOpen(false);
    resetForm();
  };

  const commonMedicalConditions = [
    'Diabetes (Type 2)',
    'Hypertension (BP)',
    'Bleeding Tendency',
    'Asthma',
    'Cardiac Disorder',
    'Thyroid',
    'Hepatitis',
    'Pregnancy'
  ];

  const commonAllergies = [
    'Penicillin',
    'Sulfa Drugs',
    'Latex',
    'Local Anesthesia (Lignocaine)',
    'Aspirin',
    'NSAIDs'
  ];

  // Filtering
  const filteredPatients = patients.filter(p => {
    // Branch scope
    const branchMatch = selectedBranchFilter === 'all' 
      ? (activeBranch === 'all' || p.branchAssigned === activeBranch)
      : p.branchAssigned === selectedBranchFilter;
    
    // Blood group
    const bloodMatch = selectedBloodGroup === 'all' || p.bloodGroup === selectedBloodGroup;

    // Emergency flag
    const emergencyMatch = !onlyEmergency || p.isEmergencyFlag;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    const queryMatch = !q || (
      p.name.toLowerCase().includes(q) ||
      p.mobile.includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );

    return branchMatch && bloodMatch && emergencyMatch && queryMatch;
  });

  return (
    <div className="space-y-6">

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Electronic Dental Records (EMR)
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {filteredPatients.length} Active Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comprehensive patient directory, medical alerts, clinical history, and digital QR health pass.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { resetForm(); setIsAddEditOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-md shadow-teal-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient Name, Phone Number, or ID (e.g. JDC-2026-0001)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Branch filter */}
          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value as any)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Branches</option>
            <option value="branch-1">Branch 1 (Raghubir)</option>
            <option value="branch-2">Branch 2 (Nihal Vihar)</option>
          </select>

          {/* Blood group */}
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Blood Group: All</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          {/* Emergency flag filter */}
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyEmergency}
              onChange={(e) => setOnlyEmergency(e.target.checked)}
              className="accent-rose-500 rounded"
            />
            <span>Critical / Emergency</span>
          </label>

        </div>
      </div>

      {/* Patients Table */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-3">Patient ID</th>
                  <th className="py-3 px-3">Patient Details</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Branch</th>
                  <th className="py-3 px-3">Medical Alerts</th>
                  <th className="py-3 px-3">Registered</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Patient ID */}
                    <td className="py-3 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {patient.id}
                      {patient.isEmergencyFlag && (
                        <span className="ml-1.5 inline-flex items-center text-[9px] uppercase px-1 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-sans font-bold">
                          Urgent
                        </span>
                      )}
                    </td>

                    {/* Patient Details */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center shrink-0">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{patient.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({patient.age}y, {patient.gender})
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{patient.address}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                      <p>{patient.mobile}</p>
                      {patient.altMobile && <p className="text-[10px] text-slate-400">{patient.altMobile}</p>}
                    </td>

                    {/* Branch */}
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-semibold ${
                        patient.branchAssigned === 'branch-1' ? 'text-teal-600 dark:text-teal-400' : 'text-cyan-600 dark:text-cyan-400'
                      }`}>
                        {patient.branchAssigned === 'branch-1' ? 'Branch 1 (Raghubir)' : 'Branch 2 (Nihal Vihar)'}
                      </span>
                    </td>

                    {/* Medical Alerts */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                          patient.medicalHistory.map((m, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                              {m}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">No alerts</span>
                        )}
                        {patient.allergies && patient.allergies.length > 0 && (
                          patient.allergies.map((al, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                              Allergy: {al}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {patient.registeredDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Timeline / EMR button */}
                        <button
                          type="button"
                          onClick={() => onSelectPatientTimeline(patient)}
                          className="p-1.5 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-lg transition-colors"
                          title="View Complete EMR Timeline"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        {/* QR Card */}
                        <button
                          type="button"
                          onClick={() => setQrModalPatient(patient)}
                          className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
                          title="Generate Patient QR Digital Card"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(patient)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Patient Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
                              deletePatient(patient.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                          title="Delete Patient Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            No patients found matching the selected filters.
          </div>
        )}
      </div>

      {/* Add / Edit Patient Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-500" />
                <span>{editingPatient ? 'Edit Patient File' : 'Register New Patient (Auto ID Assigned)'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddEditOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePatient} className="space-y-4 mt-4 text-xs">
              
              {/* Row 1: Name & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Branch Assigned *
                  </label>
                  <select
                    value={branchAssigned}
                    onChange={(e) => setBranchAssigned(e.target.value as BranchId)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="branch-1">Branch 1: P-55 Raghubir Nagar, New Delhi</option>
                    <option value="branch-2">Branch 2: RZ/E-158 Nihal Vihar, Nangloi</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Mobile & Alt Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Primary Mobile (WhatsApp Enabled) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9811223344"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Alternative Mobile (Optional)
                  </label>
                  <input
                    type="tel"
                    value={altMobile}
                    onChange={(e) => setAltMobile(e.target.value)}
                    placeholder="e.g. 9811223399"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Row 3: Age, Gender, Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Email & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@gmail.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Block C, Raghubir Nagar, New Delhi"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Row 5: Medical History Tags */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Medical History (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {commonMedicalConditions.map(item => {
                    const isSelected = medicalHistory.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setMedicalHistory(prev => 
                            isSelected ? prev.filter(x => x !== item) : [...prev, item]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                          isSelected
                            ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Allergies Tags */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Known Drug & Material Allergies
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {commonAllergies.map(item => {
                    const isSelected = allergies.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setAllergies(prev => 
                            isSelected ? prev.filter(x => x !== item) : [...prev, item]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                          isSelected
                            ? 'bg-rose-100 dark:bg-rose-950/70 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 7: Current Medication */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Regular Medication
                </label>
                <input
                  type="text"
                  value={currentMedication}
                  onChange={(e) => setCurrentMedication(e.target.value)}
                  placeholder="e.g. Metformin 500mg, Telmisartan 40mg, Blood thinners"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Row 8: Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="e.g. Suman Sharma"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="e.g. 9811223355"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    placeholder="e.g. Spouse / Brother"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 9: Notes & Emergency Flag */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Doctor / Clinical Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Patient anxious about dental injections. Advise topical anaesthetic gel first."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none h-16 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                <input
                  type="checkbox"
                  id="urgentFlag"
                  checked={isEmergencyFlag}
                  onChange={(e) => setIsEmergencyFlag(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
                <label htmlFor="urgentFlag" className="text-xs font-semibold text-rose-800 dark:text-rose-300 cursor-pointer">
                  Flag as Emergency / High Priority Patient (Severe pain, trauma, post-op complication)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all shadow-md shadow-teal-500/20"
                >
                  {editingPatient ? 'Update Patient File' : 'Register Patient'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Patient QR Digital Card Modal */}
      {qrModalPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-center">
            
            <button
              type="button"
              onClick={() => setQrModalPatient(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 mx-auto flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/20 mb-3">
              J
            </div>

            <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400">
              Janta Dental Clinic Health Pass
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {qrModalPatient.name}
            </h3>
            <p className="text-xs font-mono text-slate-500">
              ID: {qrModalPatient.id} · Blood: {qrModalPatient.bloodGroup}
            </p>

            {/* Generated QR Code Representation */}
            <div className="my-5 p-4 rounded-2xl bg-white border border-slate-200 dark:border-slate-700 inline-block shadow-inner">
              <svg className="w-40 h-40 mx-auto" viewBox="0 0 100 100" fill="none">
                {/* Simulated crisp geometric QR blocks */}
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#0f172a" />

                <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#0f172a" />

                <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#0f172a" />

                {/* Data pattern modules */}
                <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="28" width="6" height="6" fill="#0f172a" />
                <rect x="12" y="42" width="6" height="6" fill="#0f172a" />
                <rect x="24" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="45" y="45" width="10" height="10" fill="#0d9488" />
                <rect x="60" y="42" width="6" height="6" fill="#0f172a" />
                <rect x="78" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="65" width="6" height="6" fill="#0f172a" />
                <rect x="55" y="72" width="6" height="6" fill="#0f172a" />
                <rect x="68" y="68" width="6" height="6" fill="#0f172a" />
                <rect x="80" y="80" width="6" height="6" fill="#0f172a" />
              </svg>
            </div>

            <div className="text-left text-xs space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency Phone:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {qrModalPatient.emergencyContact?.phone || qrModalPatient.mobile}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Branch:</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  {qrModalPatient.branchAssigned === 'branch-1' ? 'Raghubir Nagar' : 'Nihal Vihar'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Card</span>
              </button>
              <button
                type="button"
                onClick={() => setQrModalPatient(null)}
                className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
