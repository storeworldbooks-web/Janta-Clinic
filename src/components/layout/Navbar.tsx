import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { CLINIC_BRANCHES } from '../../data/initialData';
import { 
  Building2, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Phone,
  UserCheck,
  Menu
} from 'lucide-react';
import { Patient } from '../../types';

interface NavbarProps {
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onSelectPatient: (patient: Patient) => void;
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenNewPatient, 
  onOpenNewAppointment,
  onSelectPatient,
  onOpenMobileMenu
}) => {
  const { 
    currentUser, 
    activeBranch, 
    setActiveBranch, 
    isDarkMode, 
    toggleDarkMode, 
    logout,
    switchRole,
    followUps,
    appointments,
    patients,
    webInquiries
  } = useClinic();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Filter pending notifications
  const pendingFollowUps = followUps.filter(f => f.status === 'Pending');
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayDate && a.status === 'Scheduled');
  const newInquiries = webInquiries.filter(w => w.status === 'New');
  const totalNotifications = pendingFollowUps.length + todayAppointments.length + newInquiries.length;

  const currentBranchObj = CLINIC_BRANCHES.find(b => b.id === activeBranch);

  // Filter patients for quick search
  const filteredPatients = searchQuery.trim() === '' ? [] : patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mobile.includes(searchQuery) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-850 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
        <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
          
          {/* Zone 1: Mobile Hamburger, Brand & Clinic Identity */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onOpenMobileMenu && (
              <button
                type="button"
                onClick={onOpenMobileMenu}
                className="lg:hidden p-2 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-teal-400 font-bold text-base sm:text-lg border border-slate-700/60 shadow-sm shrink-0">
              J
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  JANTA DENTAL
                </span>
                <span className="hidden md:inline text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  · Delhi Clinics
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px] md:max-w-xs">
                {currentBranchObj ? currentBranchObj.name.replace('Janta Dental Clinic - ', '') : 'P-55 Raghubir & Nihal Vihar'}
              </p>
            </div>
          </div>

          {/* Zone 2: Branch Selector & Quick Search */}
          <div className="flex items-center gap-2 flex-1 justify-center max-w-xl mx-1">
            
            {/* Desktop Branch Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveBranch('all')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeBranch === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Branches
              </button>
              <button
                type="button"
                onClick={() => setActiveBranch('branch-1')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeBranch === 'branch-1'
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="P-55 Raghubir Nagar, New Delhi 110027"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                <span>Branch 1 (Raghubir)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveBranch('branch-2')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeBranch === 'branch-2'
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="RZ/E-158 Nihal Vihar, Nangloi, New Delhi 110041"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                <span>Branch 2 (Nihal Vihar)</span>
              </button>
            </div>

            {/* Mobile Compact Branch Dropdown */}
            <div className="flex md:hidden items-center bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0 mr-1" />
              <select
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value as any)}
                className="bg-transparent text-[11px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Clinics</option>
                <option value="branch-1">B-1: Raghubir</option>
                <option value="branch-2">B-2: Nihal Vihar</option>
              </select>
            </div>

            {/* Quick Search Button (Desktop) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">Search patients...</span>
              <kbd className="ml-2 font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Zone 3: Primary Actions, Notifications, Theme & Profile */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Quick Mobile Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="xl:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              aria-label="Search Patients"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Action Buttons (Tablet/Desktop) */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenNewAppointment}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-teal-500" />
                <span>+ Visit</span>
              </button>
              <button
                type="button"
                onClick={onOpenNewPatient}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Patient</span>
              </button>
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[9px] font-bold text-white">
                    {totalNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 p-3 shadow-xl border border-slate-200 dark:border-slate-800 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Clinic Alerts</span>
                    <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400">{totalNotifications} Active</span>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                    {todayAppointments.length > 0 && (
                      <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60">
                        <span className="font-semibold text-teal-800 dark:text-teal-300">Today's Appointments ({todayAppointments.length})</span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          Patients scheduled for consultations & treatments today.
                        </p>
                      </div>
                    )}

                    {pendingFollowUps.length > 0 && (
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
                        <span className="font-semibold text-amber-800 dark:text-amber-300">Pending Follow-Ups ({pendingFollowUps.length})</span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          Post-op check-ins due for extraction and implant patients.
                        </p>
                      </div>
                    )}

                    {newInquiries.length > 0 && (
                      <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/60">
                        <span className="font-semibold text-cyan-800 dark:text-cyan-300">New Website Bookings ({newInquiries.length})</span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          Online appointment inquiries waiting for confirmation.
                        </p>
                      </div>
                    )}

                    {totalNotifications === 0 && (
                      <div className="text-center py-6 text-slate-400">
                        <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-teal-500 opacity-60" />
                        <p className="text-xs">All clear! No urgent pending alerts.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile & Role Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <img
                  src={currentUser?.avatarUrl || '/src/assets/images/clinic_doctor_avatar_1793105632782.jpg'}
                  alt={currentUser?.name || 'User'}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden xl:block text-left text-xs">
                  <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                    {currentUser?.name || 'Admin'}
                  </p>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                    {currentUser?.role || 'Super Admin'}
                  </p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-xl border border-slate-200 dark:border-slate-800 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{currentUser?.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                        {currentUser?.role}
                      </span>
                    </div>
                  </div>

                  {/* Switch Role Fast Preview */}
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1 px-1">Switch Active Role:</p>
                    <div className="space-y-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => { switchRole('Super Admin'); setShowUserMenu(false); }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between ${
                          currentUser?.role === 'Super Admin' ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>Super Admin</span>
                        {currentUser?.role === 'Super Admin' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => { switchRole('Doctor'); setShowUserMenu(false); }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between ${
                          currentUser?.role === 'Doctor' ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>Doctor (Dentist)</span>
                        {currentUser?.role === 'Doctor' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => { switchRole('Receptionist'); setShowUserMenu(false); }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between ${
                          currentUser?.role === 'Receptionist' ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>Receptionist</span>
                        {currentUser?.role === 'Receptionist' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search patient by name, mobile (e.g. 9811...), or ID (JDC-2026-0001)..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="px-2 py-0.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded border border-slate-200 dark:border-slate-700"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredPatients.length > 0 ? (
                <div className="space-y-1">
                  {filteredPatients.map(patient => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => {
                        onSelectPatient(patient);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{patient.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{patient.id} · {patient.mobile}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                        {patient.branchAssigned === 'branch-1' ? 'Branch 1' : 'Branch 2'}
                      </span>
                    </button>
                  ))}
                </div>
              ) : searchQuery.trim() !== '' ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No patient found matching "{searchQuery}".
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Type at least 2 characters to search clinic records.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
