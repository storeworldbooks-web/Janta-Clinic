import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Lock, 
  User as UserIcon, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen }) => {
  const { login, resetPasswordRequest } = useClinic();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('ChangeOnFirstLogin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = login(username, password);
    if (!result.success) {
      setErrorMsg(result.error || 'Invalid credentials');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    const res = resetPasswordRequest(forgotInput);
    setResetMessage(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative">
        
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-lg shadow-teal-500/20 mb-3">
            J
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            JANTA DENTAL CLINIC
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dual-Branch Practice Management Portal (Delhi)
          </p>
        </div>

        {/* Quick Credential Hint Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300">
            <Info className="w-4 h-4 shrink-0" />
            <span>Default System Admin Credentials:</span>
          </div>
          <div className="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
            <p>Username: <strong className="text-slate-900 dark:text-white">admin</strong></p>
            <p>Password: <strong className="text-slate-900 dark:text-white">ChangeOnFirstLogin123</strong></p>
          </div>
          <p className="text-[10px] text-teal-700 dark:text-teal-400 mt-1">
            * Or test with username: "doctor" or "receptionist"
          </p>
        </div>

        {!isForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Username / Doctor ID
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-teal-500 rounded"
                />
                <span>Remember session</span>
              </label>

              <span className="text-[10px] text-slate-400 font-mono">
                Auto-Logout: 12h
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 text-sm mt-2"
            >
              <span>Authenticate & Enter Clinic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              Enter your registered username or email to reset credentials:
            </p>

            {resetMessage ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                {resetMessage}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  required
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="admin or admin@jantadental.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setResetMessage(null); }}
                className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
              >
                ← Back to Login
              </button>

              {!resetMessage && (
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
