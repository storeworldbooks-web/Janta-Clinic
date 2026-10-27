/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import { AppointmentManager } from './components/appointments/AppointmentManager';
import { PatientManagement } from './components/patients/PatientManagement';
import { PatientDetailModal } from './components/patients/PatientDetailModal';
import { DentalChart } from './components/dentalChart/DentalChart';
import { PrescriptionModule } from './components/prescriptions/PrescriptionModule';
import { BillingInvoices } from './components/billing/BillingInvoices';
import { ExpenseTracker } from './components/expenses/ExpenseTracker';
import { FollowUpTracker } from './components/followups/FollowUpTracker';
import { DocumentViewer } from './components/documents/DocumentViewer';
import { GalleryViewer } from './components/gallery/GalleryViewer';
import { WebsiteInquirySync } from './components/website/WebsiteInquirySync';
import { ReportsModule } from './components/reports/ReportsModule';
import { SecurityAuditLogs } from './components/security/SecurityAuditLogs';
import { SettingsBackup } from './components/settings/SettingsBackup';
import { LoginModal } from './components/auth/LoginModal';
import { ForceChangePasswordModal } from './components/auth/ForceChangePasswordModal';
import { Patient } from './types';
import { Menu } from 'lucide-react';

function ClinicMainApp() {
  const { currentUser } = useClinic();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Cross-modal triggers
  const [selectedTimelinePatient, setSelectedTimelinePatient] = useState<Patient | null>(null);
  const [prescriptionInitialPatient, setPrescriptionInitialPatient] = useState<Patient | null>(null);
  const [billingInitialPatient, setBillingInitialPatient] = useState<Patient | null>(null);

  const handleOpenTimeline = (patient: Patient) => {
    setSelectedTimelinePatient(patient);
  };

  const handleOpenNewPrescription = (patient: Patient) => {
    setSelectedTimelinePatient(null);
    setPrescriptionInitialPatient(patient);
    setActiveTab('prescriptions');
  };

  const handleOpenNewAppointment = (patient?: Patient) => {
    setActiveTab('appointments');
    setSelectedTimelinePatient(null);
  };

  const handleOpenNewInvoice = (patient: Patient) => {
    setSelectedTimelinePatient(null);
    setBillingInitialPatient(patient);
    setActiveTab('billing');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        onOpenNewPatient={() => setActiveTab('patients')}
        onOpenNewAppointment={() => setActiveTab('appointments')}
        onSelectPatient={handleOpenTimeline}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {activeTab === 'dashboard' && (
              <AnalyticsDashboard
                onOpenNewAppointment={() => setActiveTab('appointments')}
                onOpenNewPatient={() => setActiveTab('patients')}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'appointments' && (
              <AppointmentManager />
            )}

            {activeTab === 'patients' && (
              <PatientManagement
                onSelectPatientTimeline={handleOpenTimeline}
                onOpenNewAppointmentForPatient={handleOpenNewAppointment}
              />
            )}

            {activeTab === 'dental-chart' && (
              <DentalChart />
            )}

            {activeTab === 'prescriptions' && (
              <PrescriptionModule initialPatient={prescriptionInitialPatient} />
            )}

            {activeTab === 'billing' && (
              <BillingInvoices initialPatient={billingInitialPatient} />
            )}

            {activeTab === 'expenses' && (
              <ExpenseTracker />
            )}

            {activeTab === 'followups' && (
              <FollowUpTracker />
            )}

            {activeTab === 'documents' && (
              <DocumentViewer />
            )}

            {activeTab === 'gallery' && (
              <GalleryViewer />
            )}

            {activeTab === 'website-inquiries' && (
              <WebsiteInquirySync />
            )}

            {activeTab === 'reports' && (
              <ReportsModule />
            )}

            {activeTab === 'security' && (
              <SecurityAuditLogs />
            )}

            {activeTab === 'settings' && (
              <SettingsBackup />
            )}

          </div>
        </main>
      </div>

      {/* Patient Detail / EMR Timeline Modal */}
      {selectedTimelinePatient && (
        <PatientDetailModal
          patient={selectedTimelinePatient}
          onClose={() => setSelectedTimelinePatient(null)}
          onNewPrescription={handleOpenNewPrescription}
          onNewAppointment={handleOpenNewAppointment}
          onNewInvoice={handleOpenNewInvoice}
        />
      )}

      {/* Authentication & Force Password Change Modals */}
      <LoginModal isOpen={!currentUser} />
      <ForceChangePasswordModal />

    </div>
  );
}

export default function App() {
  return (
    <ClinicProvider>
      <ClinicMainApp />
    </ClinicProvider>
  );
}
