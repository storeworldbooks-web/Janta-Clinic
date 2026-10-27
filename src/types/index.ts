export type UserRole = 'Super Admin' | 'Doctor' | 'Receptionist';

export type BranchId = 'branch-1' | 'branch-2';

export interface Branch {
  id: BranchId;
  name: string;
  tagline: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl: string;
  operatingHours: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  branch: BranchId | 'all';
  avatarUrl?: string;
  isFirstLogin?: boolean;
}

export type ToothCondition = 
  | 'healthy'
  | 'cavity'
  | 'missing'
  | 'root-canal'
  | 'implant'
  | 'crown'
  | 'bridge'
  | 'extraction-needed';

export interface ToothSurface {
  occlusal: ToothCondition;
  mesial: ToothCondition;
  distal: ToothCondition;
  buccal: ToothCondition;
  lingual: ToothCondition;
}

export interface ToothRecord {
  toothNumber: number; // 1-32 Universal System (or 11-48 FDI)
  condition: ToothCondition;
  surfaces?: Partial<ToothSurface>;
  notes?: string;
  plannedTreatment?: string;
  updatedAt: string;
}

export interface Patient {
  id: string; // Auto-generated e.g. JDC-2026-0042
  name: string;
  photoUrl?: string;
  mobile: string;
  altMobile?: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  branchAssigned: BranchId;
  medicalHistory: string[]; // e.g. ['Diabetes', 'Hypertension']
  allergies: string[]; // e.g. ['Penicillin', 'Latex']
  currentMedication: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes: string;
  isEmergencyFlag?: boolean;
  registeredDate: string;
  dentalChart?: Record<number, ToothRecord>;
}

export type AppointmentStatus = 'Scheduled' | 'Visited' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  doctorName: string;
  treatment: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  branch: BranchId;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface TreatmentItem {
  id: string;
  name: string;
  category: string;
  defaultCost: number;
  durationMinutes: number;
  description: string;
}

export interface PrescriptionMedicine {
  id: string;
  name: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "1-0-1 (Twice Daily)"
  timing: string; // e.g. "After Meals"
  duration: string; // e.g. "5 Days"
  instructions: string; // e.g. "Drink plenty of water"
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientMobile: string;
  doctorName: string;
  doctorRegNo: string;
  branch: BranchId;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  generalAdvice: string;
  nextVisitDate?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Mixed Payment';

export interface InvoiceItem {
  treatmentName: string;
  cost: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  branch: BranchId;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  pendingBalance: number;
  paymentMethod: PaymentMethod;
  paymentNotes?: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Refunded';
}

export type ExpenseCategory = 
  | 'Rent'
  | 'Electricity'
  | 'Instruments'
  | 'Medicines'
  | 'Staff Salary'
  | 'Marketing'
  | 'Equipment'
  | 'Maintenance';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  branch: BranchId;
  paymentMethod: string;
  paidTo: string;
  notes?: string;
}

export interface FollowUpReminder {
  id: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  treatmentName: string;
  treatmentDate: string;
  intervalDays: 1 | 7 | 15 | 30 | 90 | 365;
  scheduledDate: string;
  branch: BranchId;
  status: 'Pending' | 'Contacted' | 'Scheduled' | 'Dismissed';
  notes?: string;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  title: string;
  type: 'X-Ray' | 'PDF Report' | 'Consent Form' | 'Treatment Plan' | 'Intraoral Photo';
  fileUrl: string;
  uploadedAt: string;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Clinic Photos' | 'Doctors Photos' | 'Treatment Photos' | 'Before After Cases';
  imageUrl: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  branch?: BranchId;
  caption: string;
  tags: string[];
}

export interface WebInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredBranch: BranchId;
  preferredDate: string;
  preferredTime: string;
  treatmentRequested: string;
  message: string;
  status: 'New' | 'Converted' | 'Cancelled';
  submittedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
}
