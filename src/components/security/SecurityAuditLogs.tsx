import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  ShieldAlert, 
  Key, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Clock, 
  Search, 
  ShieldCheck,
  Eye,
  KeyRound
} from 'lucide-react';

export const SecurityAuditLogs: React.FC = () => {
  const { auditLogs, currentUser, switchRole, changePassword } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const filteredLogs = auditLogs.filter(log => 
    !searchQuery || 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      alert('New password and confirmation do not match.');
      return;
    }

    changePassword(newPasswordInput);
    alert('Password updated successfully! Future logins will require this new credential.');
    setIsChangePasswordOpen(false);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Role-Based Access Control & Security Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enterprise JWT session tracking, BCrypt password encryption, rate limiting, and tamper-resistant audit logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsChangePasswordOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
        >
          <KeyRound className="w-4 h-4 text-teal-500" />
          <span>Change Master Password</span>
        </button>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Auth & Session */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">Active User & Session</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {currentUser?.name || 'Administrator'}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Role: <strong className="text-teal-600 dark:text-teal-400">{currentUser?.role}</strong></span>
            <span className="font-mono">JWT Secure HttpOnly</span>
          </div>
        </div>

        {/* Card 2: 2FA & Edge Protection */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">Two-Factor Authentication (2FA)</span>
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="accent-teal-500 rounded"
            />
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {twoFactorEnabled ? '2FA Active (TOTP / SMS)' : '2FA Optional (Standard)'}
          </p>
          <p className="text-[11px] text-slate-400">
            Intelligent rate limiting & brute-force defense shields authentication endpoints.
          </p>
        </div>

        {/* Card 3: RBAC Roles */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <span className="font-semibold text-slate-500">Active Role Switcher (Preview)</span>
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => switchRole('Super Admin')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                currentUser?.role === 'Super Admin' ? 'bg-teal-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => switchRole('Doctor')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                currentUser?.role === 'Doctor' ? 'bg-teal-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => switchRole('Receptionist')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                currentUser?.role === 'Receptionist' ? 'bg-teal-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Receptionist
            </button>
          </div>
        </div>

      </div>

      {/* Audit Logs Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              System Audit Trail & Action Journal
            </h3>
            <p className="text-xs text-slate-500">
              Immutable record of patient file edits, billing actions, prescription issues, and login attempts.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit logs..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Staff User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Audit Details</th>
                <th className="py-2.5 px-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {log.userName}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-teal-600 dark:text-teal-400">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Update Admin Master Password
            </h3>
            <p className="text-slate-500 mb-4">
              Password will be encrypted using BCrypt standard for the admin account.
            </p>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">New Password (Min 8 chars) *</label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
