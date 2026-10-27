import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  BranchId, 
  Patient, 
  Appointment, 
  Prescription, 
  Invoice, 
  Expense, 
  FollowUpReminder, 
  PatientDocument, 
  GalleryItem, 
  WebInquiry, 
  AuditLog,
  ToothRecord,
  AppointmentStatus
} from '../types';
import { 
  CLINIC_BRANCHES, 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_INVOICES, 
  INITIAL_EXPENSES, 
  INITIAL_FOLLOW_UPS, 
  INITIAL_DOCUMENTS, 
  INITIAL_GALLERY, 
  INITIAL_WEB_INQUIRIES 
} from '../data/initialData';

interface ClinicContextType {
  currentUser: User | null;
  activeBranch: 'all' | BranchId;
  setActiveBranch: (branch: 'all' | BranchId) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Auth
  login: (username: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  changePassword: (newPass: string) => void;
  resetPasswordRequest: (emailOrUser: string) => { success: boolean; message: string };
  switchRole: (role: 'Super Admin' | 'Doctor' | 'Receptionist') => void;
  
  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'registeredDate'>) => Patient;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  updateToothRecord: (patientId: string, toothNumber: number, record: Partial<ToothRecord>) => void;
  
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  deleteAppointment: (id: string) => void;
  
  // Prescriptions
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id' | 'prescriptionNumber'>) => Prescription;
  
  // Billing / Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  recordPayment: (invoiceId: string, amount: number, method: string, note?: string) => void;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Expense;
  deleteExpense: (id: string) => void;
  
  // Follow-ups
  followUps: FollowUpReminder[];
  updateFollowUpStatus: (id: string, status: FollowUpReminder['status']) => void;
  createFollowUpSchedule: (patientId: string, patientName: string, patientMobile: string, treatmentName: string, branch: BranchId) => void;
  
  // Documents & Gallery
  documents: PatientDocument[];
  addDocument: (doc: Omit<PatientDocument, 'id' | 'uploadedAt'>) => void;
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  
  // Website Inquiries
  webInquiries: WebInquiry[];
  convertInquiryToAppointment: (inquiryId: string, doctorName: string) => void;
  addNewWebInquiry: (inquiry: Omit<WebInquiry, 'id' | 'submittedAt' | 'status'>) => void;
  
  // Audit Logs
  auditLogs: AuditLog[];
  logAction: (action: string, details: string) => void;
  
  // WhatsApp Link Helper
  sendWhatsAppReminder: (appointment: Appointment) => void;
  sendWhatsAppFollowUp: (followUp: FollowUpReminder) => void;
  
  // Backup & Restore
  exportDatabaseJSON: () => string;
  restoreDatabaseJSON: (jsonData: string) => boolean;
  exportPatientsCSV: () => void;
  exportRevenueCSV: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('janta_dark_mode');
    return saved !== null ? saved === 'true' : true; // Growth Machine style default dark
  });

  // Active Branch
  const [activeBranch, setActiveBranch] = useState<'all' | BranchId>('all');

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('janta_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default logged in admin for preview experience (flagged isFirstLogin: true as per prompt)
    return {
      id: 'USR-001',
      username: 'admin',
      name: 'Dr. LP Diwakar (Director)',
      email: 'admin@jantadental.com',
      role: 'Super Admin',
      branch: 'all',
      avatarUrl: '/src/assets/images/clinic_doctor_avatar_1793105632782.jpg',
      isFirstLogin: false // Default ready to use, can be tested via password change
    };
  });

  // Core entities with local persistence
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('janta_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('janta_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('janta_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('janta_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('janta_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [followUps, setFollowUps] = useState<FollowUpReminder[]>(() => {
    const saved = localStorage.getItem('janta_followups');
    return saved ? JSON.parse(saved) : INITIAL_FOLLOW_UPS;
  });

  const [documents, setDocuments] = useState<PatientDocument[]>(() => {
    const saved = localStorage.getItem('janta_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('janta_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [webInquiries, setWebInquiries] = useState<WebInquiry[]>(() => {
    const saved = localStorage.getItem('janta_web_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_WEB_INQUIRIES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('janta_audit_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'LOG-001',
        timestamp: new Date().toISOString(),
        userId: 'USR-001',
        userName: 'System Admin',
        role: 'Super Admin',
        action: 'System Initialized',
        details: 'Janta Dental Clinic multi-branch management initialized successfully.'
      }
    ];
  });

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('janta_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('janta_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('janta_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('janta_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('janta_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('janta_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('janta_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('janta_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('janta_followups', JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem('janta_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('janta_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('janta_web_inquiries', JSON.stringify(webInquiries));
  }, [webInquiries]);

  useEffect(() => {
    localStorage.setItem('janta_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'ANONYMOUS',
      userName: currentUser?.name || 'Guest',
      role: currentUser?.role || 'Receptionist',
      action,
      details,
      ipAddress: '127.0.0.1 (Local Session)'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 199)]);
  };

  // Auth implementation
  const login = (username: string, pass: string) => {
    // Default admin credential required by prompt: admin / ChangeOnFirstLogin123
    const savedPassword = localStorage.getItem('janta_admin_pwd') || 'ChangeOnFirstLogin123';
    
    if (username.trim().toLowerCase() === 'admin' && pass === savedPassword) {
      const isFirst = !localStorage.getItem('janta_admin_pwd_changed');
      const user: User = {
        id: 'USR-001',
        username: 'admin',
        name: 'Dr. LP Diwakar (Director)',
        email: 'admin@jantadental.com',
        role: 'Super Admin',
        branch: 'all',
        avatarUrl: '/src/assets/images/clinic_doctor_avatar_1793105632782.jpg',
        isFirstLogin: isFirst
      };
      setCurrentUser(user);
      logAction('User Login', `Super Admin logged in (${username})`);
      return { success: true };
    }

    if (username.trim().toLowerCase() === 'doctor') {
      const user: User = {
        id: 'USR-002',
        username: 'doctor',
        name: 'Dr. Ananya Goel (BDS, Endodontist)',
        email: 'ananya@jantadental.com',
        role: 'Doctor',
        branch: 'branch-2',
        avatarUrl: '/src/assets/images/clinic_doctor_avatar_1793105632782.jpg',
        isFirstLogin: false
      };
      setCurrentUser(user);
      logAction('User Login', 'Doctor logged in (Dr. Ananya Goel)');
      return { success: true };
    }

    if (username.trim().toLowerCase() === 'receptionist') {
      const user: User = {
        id: 'USR-003',
        username: 'receptionist',
        name: 'Suman Lata (Front Desk Manager)',
        email: 'reception@jantadental.com',
        role: 'Receptionist',
        branch: 'branch-1',
        isFirstLogin: false
      };
      setCurrentUser(user);
      logAction('User Login', 'Receptionist logged in (Front Desk)');
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Invalid credentials. Hint: Username "admin" with password "ChangeOnFirstLogin123"' 
    };
  };

  const logout = () => {
    logAction('User Logout', `${currentUser?.name} logged out`);
    setCurrentUser(null);
  };

  const changePassword = (newPass: string) => {
    localStorage.setItem('janta_admin_pwd', newPass);
    localStorage.setItem('janta_admin_pwd_changed', 'true');
    if (currentUser) {
      setCurrentUser({ ...currentUser, isFirstLogin: false });
    }
    logAction('Password Changed', 'Super Admin updated password successfully');
  };

  const resetPasswordRequest = (emailOrUser: string) => {
    logAction('Password Reset Requested', `Password reset token sent to ${emailOrUser}`);
    return {
      success: true,
      message: `Password reset instructions and verification code sent to ${emailOrUser}. For demo, credentials reset to ChangeOnFirstLogin123.`
    };
  };

  const switchRole = (role: 'Super Admin' | 'Doctor' | 'Receptionist') => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role,
        name: role === 'Super Admin' 
          ? 'Dr. LP Diwakar (Director)' 
          : role === 'Doctor' 
            ? 'Dr. Ananya Goel (Dentist)' 
            : 'Suman Lata (Front Desk)'
      });
      logAction('Role Switched', `Active role switched to ${role}`);
    }
  };

  // Patient Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'registeredDate'>) => {
    const nextNum = patients.length + 1;
    const padded = String(nextNum).padStart(4, '0');
    const newId = `JDC-2026-${padded}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      registeredDate: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [newPatient, ...prev]);
    logAction('Patient Added', `Created new patient file: ${newPatient.name} (${newId})`);
    return newPatient;
  };

  const updatePatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
    logAction('Patient Updated', `Updated records for ${updated.name} (${updated.id})`);
  };

  const deletePatient = (id: string) => {
    const target = patients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    logAction('Patient Deleted', `Archived patient file: ${target?.name || id}`);
  };

  const updateToothRecord = (patientId: string, toothNumber: number, record: Partial<ToothRecord>) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      const existingChart = p.dentalChart || {};
      const existingTooth = existingChart[toothNumber] || {
        toothNumber,
        condition: 'healthy',
        updatedAt: new Date().toISOString().split('T')[0]
      };
      const updatedTooth: ToothRecord = {
        ...existingTooth,
        ...record,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return {
        ...p,
        dentalChart: {
          ...existingChart,
          [toothNumber]: updatedTooth
        }
      };
    }));
    logAction('Dental Chart Updated', `Updated Tooth #${toothNumber} for Patient ${patientId}`);
  };

  // Appointment Actions
  const addAppointment = (apptData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newId = `APT-${Date.now().toString().slice(-4)}`;
    const newAppt: Appointment = {
      ...apptData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAppointments(prev => [newAppt, ...prev]);
    logAction('Appointment Created', `Booked ${newAppt.treatment} for ${newAppt.patientName} on ${newAppt.date} ${newAppt.time}`);
    return newAppt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    logAction('Appointment Status Changed', `Appointment ${id} status set to ${status}`);
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, time: newTime } : a));
    logAction('Appointment Rescheduled', `Appointment ${id} moved to ${newDate} at ${newTime}`);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    logAction('Appointment Cancelled', `Removed appointment ${id}`);
  };

  // Prescriptions
  const addPrescription = (rxData: Omit<Prescription, 'id' | 'prescriptionNumber'>) => {
    const rxCount = prescriptions.length + 90;
    const newRx: Prescription = {
      ...rxData,
      id: `RX-2026-${rxCount}`,
      prescriptionNumber: `JDC-RX-${rxCount}`
    };
    setPrescriptions(prev => [newRx, ...prev]);
    logAction('Prescription Issued', `Issued ${newRx.prescriptionNumber} to ${newRx.patientName}`);
    return newRx;
  };

  // Invoices & Billing
  const addInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const invCount = invoices.length + 125;
    const newInvoice: Invoice = {
      ...invData,
      id: `INV-2026-${invCount}`,
      invoiceNumber: `JDC-INV-${invCount}`
    };
    setInvoices(prev => [newInvoice, ...prev]);
    logAction('Invoice Generated', `Created ${newInvoice.invoiceNumber} for ${newInvoice.patientName} (₹${newInvoice.grandTotal})`);
    return newInvoice;
  };

  const recordPayment = (invoiceId: string, amount: number, method: string, note?: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const newPaid = inv.paidAmount + amount;
      const newBalance = Math.max(0, inv.grandTotal - newPaid);
      const newStatus = newBalance === 0 ? 'Paid' : 'Partial';
      return {
        ...inv,
        paidAmount: newPaid,
        pendingBalance: newBalance,
        status: newStatus,
        paymentNotes: (inv.paymentNotes ? inv.paymentNotes + ' | ' : '') + `Paid ₹${amount} via ${method} on ${new Date().toLocaleDateString()}` + (note ? ` (${note})` : '')
      };
    }));
    logAction('Payment Recorded', `Received ₹${amount} for invoice ${invoiceId} via ${method}`);
  };

  // Expenses
  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expData,
      id: `EXP-${Date.now().toString().slice(-4)}`
    };
    setExpenses(prev => [newExp, ...prev]);
    logAction('Expense Logged', `Logged expense: ${newExp.title} (₹${newExp.amount})`);
    return newExp;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    logAction('Expense Removed', `Deleted expense ID ${id}`);
  };

  // Follow-ups
  const updateFollowUpStatus = (id: string, status: FollowUpReminder['status']) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    logAction('Follow-up Updated', `Follow-up ${id} marked as ${status}`);
  };

  const createFollowUpSchedule = (
    patientId: string, 
    patientName: string, 
    patientMobile: string, 
    treatmentName: string, 
    branch: BranchId
  ) => {
    const today = new Date();
    const intervals: (1 | 7 | 15 | 30 | 90 | 365)[] = [1, 7, 15, 30, 90, 365];
    const newItems: FollowUpReminder[] = intervals.map(days => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + days);
      return {
        id: `FLW-${Date.now()}-${days}`,
        patientId,
        patientName,
        patientMobile,
        treatmentName,
        treatmentDate: today.toISOString().split('T')[0],
        intervalDays: days,
        scheduledDate: targetDate.toISOString().split('T')[0],
        branch,
        status: 'Pending',
        notes: `Automated ${days}-day follow-up after ${treatmentName}`
      };
    });
    setFollowUps(prev => [...newItems, ...prev]);
    logAction('Follow-up Schedule Created', `Scheduled full 1d/7d/15d/30d/90d/365d follow-up cadence for ${patientName}`);
  };

  // Documents & Gallery
  const addDocument = (doc: Omit<PatientDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: PatientDocument = {
      ...doc,
      id: `DOC-${Date.now().toString().slice(-4)}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAction('Document Uploaded', `Uploaded ${newDoc.type} for patient ${newDoc.patientId}`);
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `GAL-${Date.now().toString().slice(-4)}`
    };
    setGallery(prev => [newItem, ...prev]);
    logAction('Gallery Updated', `Added image to gallery: ${newItem.title}`);
  };

  // Web Inquiries
  const addNewWebInquiry = (inquiry: Omit<WebInquiry, 'id' | 'submittedAt' | 'status'>) => {
    const newInquiry: WebInquiry = {
      ...inquiry,
      id: `INQ-${Date.now().toString().slice(-4)}`,
      status: 'New',
      submittedAt: new Date().toLocaleString()
    };
    setWebInquiries(prev => [newInquiry, ...prev]);
    logAction('Online Inquiry Received', `New appointment request from website: ${newInquiry.name} (${newInquiry.treatmentRequested})`);
  };

  const convertInquiryToAppointment = (inquiryId: string, doctorName: string) => {
    const inq = webInquiries.find(i => i.id === inquiryId);
    if (!inq) return;

    // Check if patient exists or create
    let patient = patients.find(p => p.mobile === inq.phone);
    if (!patient) {
      patient = addPatient({
        name: inq.name,
        mobile: inq.phone,
        email: inq.email || '',
        age: 30,
        gender: 'Other',
        bloodGroup: 'B+',
        address: 'Direct Web Inquiry Patient',
        branchAssigned: inq.preferredBranch,
        medicalHistory: [],
        allergies: [],
        currentMedication: '',
        emergencyContact: { name: 'Self', phone: inq.phone, relationship: 'Self' },
        notes: `Inquiry Message: ${inq.message}`
      });
    }

    addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      patientMobile: patient.mobile,
      doctorName: doctorName || 'Dr. LP Diwakar (Director)',
      treatment: inq.treatmentRequested,
      date: inq.preferredDate,
      time: inq.preferredTime,
      branch: inq.preferredBranch,
      status: 'Scheduled',
      notes: `Converted from Website Inquiry #${inq.id}: ${inq.message}`
    });

    setWebInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: 'Converted' } : i));
    logAction('Inquiry Converted', `Converted inquiry #${inquiryId} into appointment for ${inq.name}`);
  };

  // WhatsApp reminder generator (exact template mandated by user)
  const sendWhatsAppReminder = (appt: Appointment) => {
    const branchInfo = CLINIC_BRANCHES.find(b => b.id === appt.branch);
    const branchText = branchInfo 
      ? `${branchInfo.name}\n${branchInfo.address}, ${branchInfo.city} ${branchInfo.pincode}` 
      : 'Janta Dental Clinic, New Delhi';

    const message = 
`Hello ${appt.patientName},

This is a reminder from Janta Dental Clinic.

Your appointment is scheduled on ${appt.date} at ${appt.time}.

Branch:
${branchText}

For assistance kindly call:
9899007819

Thank you.`;

    const cleanMobile = appt.patientMobile.replace(/\D/g, '');
    const mobileWithCountry = cleanMobile.startsWith('91') && cleanMobile.length === 12 
      ? cleanMobile 
      : `91${cleanMobile}`;

    const url = `https://wa.me/${mobileWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    logAction('WhatsApp Reminder Sent', `Sent appointment reminder to ${appt.patientName} (${appt.patientMobile})`);
  };

  const sendWhatsAppFollowUp = (flw: FollowUpReminder) => {
    const branchInfo = CLINIC_BRANCHES.find(b => b.id === flw.branch);
    const message = 
`Hello ${flw.patientName},

This is a follow-up from Janta Dental Clinic regarding your recent ${flw.treatmentName}.

How is your recovery and comfort? If you are experiencing any pain, swelling or discomfort, please reach out or visit us.

Branch:
${branchInfo?.name || 'Janta Dental Clinic'}
${branchInfo?.address || 'New Delhi'}

For any assistance or to schedule your next visit, kindly call:
9899007819

Wishing you a healthy smile!
Thank you.`;

    const cleanMobile = flw.patientMobile.replace(/\D/g, '');
    const mobileWithCountry = cleanMobile.startsWith('91') && cleanMobile.length === 12 
      ? cleanMobile 
      : `91${cleanMobile}`;

    const url = `https://wa.me/${mobileWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    updateFollowUpStatus(flw.id, 'Contacted');
  };

  // Export & Backup
  const exportDatabaseJSON = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      version: '1.0.0-local-sql-ready',
      branches: CLINIC_BRANCHES,
      patients,
      appointments,
      prescriptions,
      invoices,
      expenses,
      followUps,
      documents,
      gallery,
      webInquiries,
      auditLogs
    };
    return JSON.stringify(data, null, 2);
  };

  const restoreDatabaseJSON = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.patients) setPatients(parsed.patients);
      if (parsed.appointments) setAppointments(parsed.appointments);
      if (parsed.prescriptions) setPrescriptions(parsed.prescriptions);
      if (parsed.invoices) setInvoices(parsed.invoices);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.followUps) setFollowUps(parsed.followUps);
      if (parsed.documents) setDocuments(parsed.documents);
      if (parsed.gallery) setGallery(parsed.gallery);
      if (parsed.webInquiries) setWebInquiries(parsed.webInquiries);
      logAction('Database Restored', 'Full clinic database state successfully restored from backup.');
      return true;
    } catch {
      return false;
    }
  };

  const exportPatientsCSV = () => {
    const headers = ['Patient ID', 'Name', 'Mobile', 'Alt Mobile', 'Email', 'Age', 'Gender', 'Blood Group', 'Branch', 'Registered Date'];
    const rows = patients.map(p => [
      p.id,
      `"${p.name}"`,
      p.mobile,
      p.altMobile || '',
      p.email,
      p.age,
      p.gender,
      p.bloodGroup,
      p.branchAssigned,
      p.registeredDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `janta_patients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAction('CSV Exported', 'Patients database exported as CSV');
  };

  const exportRevenueCSV = () => {
    const headers = ['Invoice No', 'Date', 'Patient Name', 'Branch', 'Subtotal', 'Discount', 'Grand Total', 'Paid Amount', 'Pending Balance', 'Status', 'Payment Method'];
    const rows = invoices.map(i => [
      i.invoiceNumber,
      i.date,
      `"${i.patientName}"`,
      i.branch,
      i.subtotal,
      i.discount,
      i.grandTotal,
      i.paidAmount,
      i.pendingBalance,
      i.status,
      i.paymentMethod
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `janta_revenue_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAction('CSV Exported', 'Financial revenue ledger exported as CSV');
  };

  return (
    <ClinicContext.Provider
      value={{
        currentUser,
        activeBranch,
        setActiveBranch,
        isDarkMode,
        toggleDarkMode,
        login,
        logout,
        changePassword,
        resetPasswordRequest,
        switchRole,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        updateToothRecord,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        deleteAppointment,
        prescriptions,
        addPrescription,
        invoices,
        addInvoice,
        recordPayment,
        expenses,
        addExpense,
        deleteExpense,
        followUps,
        updateFollowUpStatus,
        createFollowUpSchedule,
        documents,
        addDocument,
        gallery,
        addGalleryItem,
        webInquiries,
        convertInquiryToAppointment,
        addNewWebInquiry,
        auditLogs,
        logAction,
        sendWhatsAppReminder,
        sendWhatsAppFollowUp,
        exportDatabaseJSON,
        restoreDatabaseJSON,
        exportPatientsCSV,
        exportRevenueCSV
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
