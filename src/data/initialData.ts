import { Branch, Patient, Appointment, TreatmentItem, Prescription, Invoice, Expense, FollowUpReminder, GalleryItem, WebInquiry, PatientDocument } from '../types';

export const CLINIC_BRANCHES: Branch[] = [
  {
    id: 'branch-1',
    name: 'Janta Dental Clinic - Raghubir Nagar',
    tagline: 'Main Multi-Speciality Dental Center',
    address: 'P-55 Raghubir Nagar',
    city: 'New Delhi',
    pincode: '110027',
    phone: '9899007819',
    whatsapp: '919899007819',
    email: 'raghubir@jantadental.com',
    googleMapsUrl: 'https://maps.google.com/?q=P-55+Raghubir+Nagar+New+Delhi+110027',
    operatingHours: 'Mon - Sun: 09:30 AM - 08:30 PM'
  },
  {
    id: 'branch-2',
    name: 'Janta Dental Clinic - Nihal Vihar',
    tagline: 'Nangloi Orthodontic & Implant Wing',
    address: 'RZ/E-158 Nihal Vihar, Nangloi',
    city: 'New Delhi',
    pincode: '110041',
    phone: '9899007819',
    whatsapp: '919899007819',
    email: 'nihalvihar@jantadental.com',
    googleMapsUrl: 'https://maps.google.com/?q=RZ/E-158+Nihal+Vihar+Nangloi+New+Delhi+110041',
    operatingHours: 'Mon - Sat: 10:00 AM - 08:00 PM (Sun Half Day)'
  }
];

export const STANDARD_TREATMENTS: TreatmentItem[] = [
  { id: 'TRT-01', name: 'Dental Cleaning & Polishing', category: 'Preventive', defaultCost: 800, durationMinutes: 30, description: 'Ultrasonic calculus scaling and stain polishing' },
  { id: 'TRT-02', name: 'Deep Subgingival Scaling', category: 'Periodontics', defaultCost: 1500, durationMinutes: 45, description: 'Deep root planing for gingivitis & periodontal pockets' },
  { id: 'TRT-03', name: 'Composite Tooth Filling', category: 'Restorative', defaultCost: 1200, durationMinutes: 40, description: 'Laser light-cure tooth colored composite restoration' },
  { id: 'TRT-04', name: 'Root Canal Treatment (RCT)', category: 'Endodontics', defaultCost: 3500, durationMinutes: 60, description: 'Single or multi-sitting rotary root canal therapy' },
  { id: 'TRT-05', name: 'Zirconia / PFM Dental Crown', category: 'Prosthodontics', defaultCost: 5500, durationMinutes: 45, description: 'High precision CAD-CAM metal-free ceramic crown' },
  { id: 'TRT-06', name: 'Fixed Dental Bridge (3-Unit)', category: 'Prosthodontics', defaultCost: 14000, durationMinutes: 60, description: 'Aesthetic replacement for missing adjacent teeth' },
  { id: 'TRT-07', name: 'Titanium Dental Implant', category: 'Implantology', defaultCost: 24000, durationMinutes: 75, description: 'Permanent surgical grade osseointegrated dental screw' },
  { id: 'TRT-08', name: 'Orthodontic Braces / Clear Aligners', category: 'Orthodontics', defaultCost: 32000, durationMinutes: 45, description: 'Teeth straightening, bite alignment and gap closure' },
  { id: 'TRT-09', name: 'In-Clinic Teeth Whitening', category: 'Cosmetic', defaultCost: 6500, durationMinutes: 60, description: 'LED blue light bleaching for dramatic shade brightening' },
  { id: 'TRT-10', name: 'Simple Tooth Extraction', category: 'Oral Surgery', defaultCost: 1000, durationMinutes: 30, description: 'Painless atraumatic tooth removal under local anesthesia' },
  { id: 'TRT-11', name: 'Wisdom Tooth Surgical Extraction', category: 'Oral Surgery', defaultCost: 4500, durationMinutes: 60, description: 'Impaction surgery for impacted third molars' },
  { id: 'TRT-12', name: 'Complete Acrylic Dentures', category: 'Prosthodontics', defaultCost: 18000, durationMinutes: 60, description: 'Full upper and lower arch removable prosthetic teeth' },
  { id: 'TRT-13', name: 'Digital Smile Design & Veneers', category: 'Cosmetic', defaultCost: 28000, durationMinutes: 90, description: 'Full aesthetic smile makeover with custom ceramic facings' }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'JDC-2026-0001',
    name: 'Aarav Sharma',
    photoUrl: '/src/assets/images/clinic_doctor_avatar_1793105632782.jpg',
    mobile: '9811223344',
    altMobile: '9811223399',
    email: 'aarav.sharma@example.com',
    age: 34,
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'H.No 42, Block C, Tagore Garden, Near Raghubir Nagar, New Delhi',
    branchAssigned: 'branch-1',
    medicalHistory: ['Mild Hypertension'],
    allergies: ['Penicillin'],
    currentMedication: 'Amlodipine 5mg (morning)',
    emergencyContact: {
      name: 'Sunita Sharma (Spouse)',
      phone: '9811223345',
      relationship: 'Spouse'
    },
    notes: 'Sensitive to cold drinks on upper right molar. Prefers Saturday morning appointments.',
    isEmergencyFlag: false,
    registeredDate: '2026-01-14',
    dentalChart: {
      3: { toothNumber: 3, condition: 'root-canal', plannedTreatment: 'Zirconia Crown', updatedAt: '2026-03-10' },
      14: { toothNumber: 14, condition: 'cavity', plannedTreatment: 'Composite filling', updatedAt: '2026-03-10' },
      19: { toothNumber: 19, condition: 'crown', updatedAt: '2025-11-20' },
      30: { toothNumber: 30, condition: 'missing', plannedTreatment: 'Dental Implant', updatedAt: '2026-02-05' }
    }
  },
  {
    id: 'JDC-2026-0002',
    name: 'Pooja Verma',
    mobile: '9899112233',
    email: 'pooja.v@example.com',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    address: 'Plot 18, Gali No 3, Nihal Vihar, Nangloi, New Delhi',
    branchAssigned: 'branch-2',
    medicalHistory: [],
    allergies: ['None declared'],
    currentMedication: 'None',
    emergencyContact: {
      name: 'Ramesh Verma (Father)',
      phone: '9899112234',
      relationship: 'Father'
    },
    notes: 'Completed teeth whitening and upper incisor composite restoration. Follow-up for shade check.',
    isEmergencyFlag: false,
    registeredDate: '2026-02-02',
    dentalChart: {
      8: { toothNumber: 8, condition: 'healthy', notes: 'Veneer bonded successfully', updatedAt: '2026-02-15' },
      9: { toothNumber: 9, condition: 'healthy', notes: 'Composite edge repair', updatedAt: '2026-02-15' }
    }
  },
  {
    id: 'JDC-2026-0003',
    name: 'Gurpreet Singh',
    mobile: '9873456780',
    altMobile: '9873456781',
    email: 'gurpreet.singh92@example.com',
    age: 42,
    gender: 'Male',
    bloodGroup: 'A+',
    address: 'WZ-88, Shivaji Enclave, Raja Garden, New Delhi',
    branchAssigned: 'branch-1',
    medicalHistory: ['Type 2 Diabetes (HbA1c 6.8)'],
    allergies: ['Sulfa drugs'],
    currentMedication: 'Metformin 500mg BD',
    emergencyContact: {
      name: 'Harpreet Kaur',
      phone: '9873456782',
      relationship: 'Wife'
    },
    notes: 'Scheduled for surgical extraction of impacted lower right wisdom tooth #32. Checked blood glucose before procedure.',
    isEmergencyFlag: true,
    registeredDate: '2026-03-01',
    dentalChart: {
      32: { toothNumber: 32, condition: 'extraction-needed', notes: 'Impacted 3rd molar, pericoronitis', updatedAt: '2026-03-20' },
      18: { toothNumber: 18, condition: 'cavity', updatedAt: '2026-03-20' }
    }
  },
  {
    id: 'JDC-2026-0004',
    name: 'Meenakshi Iyer',
    mobile: '9810987654',
    email: 'meenakshi.iyer@example.com',
    age: 51,
    gender: 'Female',
    bloodGroup: 'AB+',
    address: 'Flat 402, Shivam Apartments, Paschim Vihar, New Delhi',
    branchAssigned: 'branch-2',
    medicalHistory: ['Osteopenia'],
    allergies: ['None'],
    currentMedication: 'Calcium + Vit D3 supplements',
    emergencyContact: {
      name: 'Venkat Iyer',
      phone: '9810987655',
      relationship: 'Spouse'
    },
    notes: 'Implant placed at tooth #19 with bone graft. Healing cap placed. 3-month integration review due.',
    isEmergencyFlag: false,
    registeredDate: '2026-01-10',
    dentalChart: {
      19: { toothNumber: 19, condition: 'implant', notes: 'Osstem 4.5x10mm implant', updatedAt: '2026-01-20' }
    }
  },
  {
    id: 'JDC-2026-0005',
    name: 'Vikram Malhotra',
    mobile: '9899001122',
    email: 'vikram.m@example.com',
    age: 23,
    gender: 'Male',
    bloodGroup: 'O-',
    address: 'Block E, Nangloi Extension, New Delhi',
    branchAssigned: 'branch-2',
    medicalHistory: ['Asthma (uses inhaler occasionally)'],
    allergies: ['Aspirin'],
    currentMedication: 'Salbutamol inhaler PRN',
    emergencyContact: {
      name: 'Kavita Malhotra',
      phone: '9899001123',
      relationship: 'Mother'
    },
    notes: 'Under active orthodontic treatment. Ceramic brackets upper and lower. Wire changed to 0.016 NiTi.',
    isEmergencyFlag: false,
    registeredDate: '2025-09-18'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1001',
    patientId: 'JDC-2026-0001',
    patientName: 'Aarav Sharma',
    patientMobile: '9811223344',
    doctorName: 'Dr. LP Diwakar (BDS, MDS Oral & Maxillofacial)',
    treatment: 'Zirconia / PFM Dental Crown',
    date: '2026-10-27',
    time: '10:30 AM',
    branch: 'branch-1',
    status: 'Scheduled',
    notes: 'Crown cementation on tooth #3. Pre-check occlusion.',
    createdAt: '2026-10-24'
  },
  {
    id: 'APT-1002',
    patientId: 'JDC-2026-0003',
    patientName: 'Gurpreet Singh',
    patientMobile: '9873456780',
    doctorName: 'Dr. LP Diwakar (BDS, MDS Oral & Maxillofacial)',
    treatment: 'Wisdom Tooth Surgical Extraction',
    date: '2026-10-27',
    time: '12:00 PM',
    branch: 'branch-1',
    status: 'Scheduled',
    notes: 'Impacted #32 extraction. Pre-medication taken.',
    createdAt: '2026-10-25'
  },
  {
    id: 'APT-1003',
    patientId: 'JDC-2026-0002',
    patientName: 'Pooja Verma',
    patientMobile: '9899112233',
    doctorName: 'Dr. Ananya Goel (BDS, Conservative & Endodontics)',
    treatment: 'Dental Cleaning & Polishing',
    date: '2026-10-27',
    time: '03:30 PM',
    branch: 'branch-2',
    status: 'Scheduled',
    notes: 'Routine 6-month cleaning & follow-up shade assessment.',
    createdAt: '2026-10-26'
  },
  {
    id: 'APT-1004',
    patientId: 'JDC-2026-0005',
    patientName: 'Vikram Malhotra',
    patientMobile: '9899001122',
    doctorName: 'Dr. Ananya Goel (BDS, Conservative & Endodontics)',
    treatment: 'Orthodontic Braces / Clear Aligners',
    date: '2026-10-27',
    time: '05:00 PM',
    branch: 'branch-2',
    status: 'Visited',
    notes: 'Monthly wire activation and ligature replacement.',
    createdAt: '2026-10-22'
  },
  {
    id: 'APT-1005',
    patientId: 'JDC-2026-0004',
    patientName: 'Meenakshi Iyer',
    patientMobile: '9810987654',
    doctorName: 'Dr. LP Diwakar (BDS, MDS Oral & Maxillofacial)',
    treatment: 'Titanium Dental Implant',
    date: '2026-10-28',
    time: '11:00 AM',
    branch: 'branch-2',
    status: 'Scheduled',
    notes: 'Implant osseointegration radiograph check & impression scan.',
    createdAt: '2026-10-25'
  },
  {
    id: 'APT-1006',
    patientId: 'JDC-2026-0001',
    patientName: 'Aarav Sharma',
    patientMobile: '9811223344',
    doctorName: 'Dr. LP Diwakar (BDS, MDS Oral & Maxillofacial)',
    treatment: 'Root Canal Treatment (RCT)',
    date: '2026-10-20',
    time: '11:30 AM',
    branch: 'branch-1',
    status: 'Completed',
    notes: 'Obturation completed smoothly with AH Plus sealer.',
    createdAt: '2026-10-15'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-2026-0089',
    prescriptionNumber: 'JDC-RX-89',
    patientId: 'JDC-2026-0003',
    patientName: 'Gurpreet Singh',
    patientAge: 42,
    patientGender: 'Male',
    patientMobile: '9873456780',
    doctorName: 'Dr. LP Diwakar',
    doctorRegNo: 'DCI-DEL-14892',
    branch: 'branch-1',
    date: '2026-10-27',
    diagnosis: 'Acute Pericoronitis with impacted mandibular 3rd molar (#32)',
    medicines: [
      {
        id: 'MED-1',
        name: 'Augmentin 625 (Amoxicillin + Potassium Clavulanate)',
        dosage: '625 mg',
        frequency: '1-0-1 (Twice daily)',
        timing: 'After meals',
        duration: '5 Days',
        instructions: 'Complete full antibiotic course'
      },
      {
        id: 'MED-2',
        name: 'Zerodol-SP (Aceclofenac + Paracetamol + Serratiopeptidase)',
        dosage: '1 Tablet',
        frequency: '1-0-1 (Twice daily)',
        timing: 'After meals',
        duration: '3 Days',
        instructions: 'Take strictly after food for pain and swelling'
      },
      {
        id: 'MED-3',
        name: 'Hexidine Mouthwash (Chlorhexidine Gluconate 0.2%)',
        dosage: '10 ml',
        frequency: 'Morning & Night',
        timing: 'After brushing',
        duration: '7 Days',
        instructions: 'Swish gently for 60 seconds. Do not swallow.'
      }
    ],
    generalAdvice: 'Cold pack externally on right jaw for first 24h. Soft non-spicy diet. Suture removal in 7 days.',
    nextVisitDate: '2026-11-03'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-0120',
    invoiceNumber: 'JDC-INV-0120',
    patientId: 'JDC-2026-0001',
    patientName: 'Aarav Sharma',
    patientMobile: '9811223344',
    branch: 'branch-1',
    date: '2026-10-20',
    items: [
      { treatmentName: 'Root Canal Treatment (RCT)', cost: 3500, quantity: 1, discount: 0, total: 3500 },
      { treatmentName: 'Zirconia / PFM Dental Crown', cost: 5500, quantity: 1, discount: 500, total: 5000 }
    ],
    subtotal: 9000,
    discount: 500,
    tax: 0,
    grandTotal: 8500,
    paidAmount: 6000,
    pendingBalance: 2500,
    paymentMethod: 'UPI',
    paymentNotes: 'Google Pay transaction ID 4291880029. Remaining 2500 balance due on crown placement.',
    status: 'Partial'
  },
  {
    id: 'INV-2026-0121',
    invoiceNumber: 'JDC-INV-0121',
    patientId: 'JDC-2026-0002',
    patientName: 'Pooja Verma',
    patientMobile: '9899112233',
    branch: 'branch-2',
    date: '2026-10-18',
    items: [
      { treatmentName: 'In-Clinic Teeth Whitening', cost: 6500, quantity: 1, discount: 500, total: 6000 },
      { treatmentName: 'Composite Tooth Filling', cost: 1200, quantity: 1, discount: 0, total: 1200 }
    ],
    subtotal: 7700,
    discount: 500,
    tax: 0,
    grandTotal: 7200,
    paidAmount: 7200,
    pendingBalance: 0,
    paymentMethod: 'Card',
    paymentNotes: 'HDFC Pos Swipe ref #998124',
    status: 'Paid'
  },
  {
    id: 'INV-2026-0122',
    invoiceNumber: 'JDC-INV-0122',
    patientId: 'JDC-2026-0004',
    patientName: 'Meenakshi Iyer',
    patientMobile: '9810987654',
    branch: 'branch-2',
    date: '2026-10-15',
    items: [
      { treatmentName: 'Titanium Dental Implant (Stage 1)', cost: 24000, quantity: 1, discount: 2000, total: 22000 }
    ],
    subtotal: 24000,
    discount: 2000,
    tax: 0,
    grandTotal: 22000,
    paidAmount: 15000,
    pendingBalance: 7000,
    paymentMethod: 'Bank Transfer',
    paymentNotes: 'NEFT transfer. Balance due at abutment torque & prosthesis phase.',
    status: 'Partial'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'EXP-101',
    title: 'Clinic Floor Rent - October 2026',
    category: 'Rent',
    amount: 35000,
    date: '2026-10-01',
    branch: 'branch-1',
    paymentMethod: 'Bank Transfer',
    paidTo: 'Property Landlord (Raghubir Nagar Commercial)',
    notes: 'Monthly clinic premises rent'
  },
  {
    id: 'EXP-102',
    title: 'Clinic Branch 2 Rent - October 2026',
    category: 'Rent',
    amount: 28000,
    date: '2026-10-01',
    branch: 'branch-2',
    paymentMethod: 'Bank Transfer',
    paidTo: 'Building Owner (Nihal Vihar Complex)',
    notes: 'Monthly Nihal Vihar branch rent'
  },
  {
    id: 'EXP-103',
    title: 'Composite Resins & Dental Bonding Agents Batch',
    category: 'Medicines',
    amount: 12500,
    date: '2026-10-12',
    branch: 'branch-1',
    paymentMethod: 'UPI',
    paidTo: 'Prime Dental Products Delhi',
    notes: '3M Filtek Z350 XT syringe kit & Single Bond'
  },
  {
    id: 'EXP-104',
    title: 'Ultrasonic Scaler Tips & Autoclave Pouches',
    category: 'Instruments',
    amount: 4800,
    date: '2026-10-16',
    branch: 'branch-2',
    paymentMethod: 'Cash',
    paidTo: 'MedTech Surgical Suppliers Nangloi',
    notes: 'Sterilization pouches (200 pcs) + 3 scaler tips'
  },
  {
    id: 'EXP-105',
    title: 'BSES Electricity Bill Raghubir Nagar',
    category: 'Electricity',
    amount: 8450,
    date: '2026-10-14',
    branch: 'branch-1',
    paymentMethod: 'UPI',
    paidTo: 'BSES Rajdhani Power Limited',
    notes: 'Commercial AC and autoclave power bill'
  },
  {
    id: 'EXP-106',
    title: 'Dental Assistant & Receptionist Salary',
    category: 'Staff Salary',
    amount: 42000,
    date: '2026-10-05',
    branch: 'branch-1',
    paymentMethod: 'Bank Transfer',
    paidTo: 'Clinic Staff Team',
    notes: '2 Assistants and 1 Receptionist salary'
  }
];

export const INITIAL_FOLLOW_UPS: FollowUpReminder[] = [
  {
    id: 'FLW-01',
    patientId: 'JDC-2026-0003',
    patientName: 'Gurpreet Singh',
    patientMobile: '9873456780',
    treatmentName: 'Wisdom Tooth Surgical Extraction',
    treatmentDate: '2026-10-27',
    intervalDays: 1,
    scheduledDate: '2026-10-28',
    branch: 'branch-1',
    status: 'Pending',
    notes: 'Check post-op pain, bleeding, and ice-pack compliance'
  },
  {
    id: 'FLW-02',
    patientId: 'JDC-2026-0003',
    patientName: 'Gurpreet Singh',
    patientMobile: '9873456780',
    treatmentName: 'Wisdom Tooth Surgical Extraction',
    treatmentDate: '2026-10-27',
    intervalDays: 7,
    scheduledDate: '2026-11-03',
    branch: 'branch-1',
    status: 'Pending',
    notes: 'Suture removal & tissue healing evaluation'
  },
  {
    id: 'FLW-03',
    patientId: 'JDC-2026-0001',
    patientName: 'Aarav Sharma',
    patientMobile: '9811223344',
    treatmentName: 'Root Canal Treatment (RCT)',
    treatmentDate: '2026-10-20',
    intervalDays: 7,
    scheduledDate: '2026-10-27',
    branch: 'branch-1',
    status: 'Scheduled',
    notes: 'Crown trial and final bite check'
  },
  {
    id: 'FLW-04',
    patientId: 'JDC-2026-0004',
    patientName: 'Meenakshi Iyer',
    patientMobile: '9810987654',
    treatmentName: 'Titanium Dental Implant',
    treatmentDate: '2026-01-20',
    intervalDays: 90,
    scheduledDate: '2026-10-28',
    branch: 'branch-2',
    status: 'Pending',
    notes: '3-Month Osseointegration check for implant #19'
  }
];

export const INITIAL_DOCUMENTS: PatientDocument[] = [
  {
    id: 'DOC-501',
    patientId: 'JDC-2026-0001',
    title: 'OPG Full Arch Radiograph (Pre-Op)',
    type: 'X-Ray',
    fileUrl: '/src/assets/images/dental_xray_sample_1793105632778.jpg',
    uploadedAt: '2026-01-14',
    notes: 'Clear views of upper right molar canals and lower right edentulous space.'
  },
  {
    id: 'DOC-502',
    patientId: 'JDC-2026-0002',
    title: 'Cosmetic Smile Makeover Clinical Case',
    type: 'Intraoral Photo',
    fileUrl: '/src/assets/images/dental_before_after_1793105634531.jpg',
    uploadedAt: '2026-02-15',
    notes: 'High-res documentation before and after midline closure and porcelain veneers.'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'GAL-01',
    title: 'Ultra-Modern Operatory Suite - Branch 1',
    category: 'Clinic Photos',
    imageUrl: '/src/assets/images/dental_clinic_interior_1793105633804.jpg',
    branch: 'branch-1',
    caption: 'Ergonomic dental operatory with digital radiograph display at Raghubir Nagar clinic.',
    tags: ['Operatory', 'Sterile', 'Branch 1']
  },
  {
    id: 'GAL-02',
    title: 'Dr. LP Diwakar - Principal Dental Surgeon',
    category: 'Doctors Photos',
    imageUrl: '/src/assets/images/clinic_doctor_avatar_1793105632778.jpg',
    branch: 'branch-1',
    caption: '15+ Years Clinical Expertise in Oral Surgery, Dental Implants & Aesthetics.',
    tags: ['Doctor', 'Surgeon', 'Team']
  },
  {
    id: 'GAL-03',
    title: 'Complete Aesthetic Smile Makeover Transformation',
    category: 'Before After Cases',
    imageUrl: '/src/assets/images/dental_before_after_1793105634531.jpg',
    beforeImageUrl: '/src/assets/images/dental_before_after_1793105634531.jpg',
    afterImageUrl: '/src/assets/images/dental_before_after_1793105634531.jpg',
    branch: 'branch-2',
    caption: 'Diastema closure, teeth alignment and composite veneers achieved in 3 sessions.',
    tags: ['Smile Design', 'Veneers', 'Cosmetic']
  },
  {
    id: 'GAL-04',
    title: 'Full Arch Digital OPG Lightbox Review',
    category: 'Treatment Photos',
    imageUrl: '/src/assets/images/dental_xray_sample_1793105632778.jpg',
    branch: 'branch-1',
    caption: 'High-definition digital diagnosis for precision implantology and impactions.',
    tags: ['Radiology', 'X-Ray', 'Diagnostics']
  }
];

export const INITIAL_WEB_INQUIRIES: WebInquiry[] = [
  {
    id: 'INQ-701',
    name: 'Suresh Kumar',
    phone: '9818765432',
    email: 'suresh.k@gmail.com',
    preferredBranch: 'branch-1',
    preferredDate: '2026-10-28',
    preferredTime: '11:00 AM',
    treatmentRequested: 'Root Canal Treatment',
    message: 'Severe toothache in lower left molar when biting food. Please schedule urgently.',
    status: 'New',
    submittedAt: '2026-10-27 05:15 AM'
  },
  {
    id: 'INQ-702',
    name: 'Neha Chawla',
    phone: '9871122334',
    email: 'neha.c@gmail.com',
    preferredBranch: 'branch-2',
    preferredDate: '2026-10-29',
    preferredTime: '04:30 PM',
    treatmentRequested: 'Orthodontic Braces / Clear Aligners',
    message: 'Want consultation for clear aligners for teeth gap closure.',
    status: 'New',
    submittedAt: '2026-10-26 09:30 PM'
  }
];
