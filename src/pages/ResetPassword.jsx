import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setIsLoading(true);
    setStatus(null);
    
    const result = await resetPassword(token, password);
    
    setIsLoading(false);
    if (result.success) {
      setStatus({ type: 'success', message: 'Password has been reset successfully! You can now log in.' });
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-navy-950 relative overflow-hidden transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-navy-500/20 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/80 dark:bg-navy-900/60 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-slate-200/50 dark:ring-white/10 p-8">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-white dark:bg-navy-800 rounded-2xl flex items-center justify-center shadow-lg mb-6 ring-1 ring-slate-100 dark:ring-navy-700">
              <img src={logoImg} alt="JUMS Logo" className="h-12 w-auto object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Set New Password</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
              Please enter your new password below.
            </p>
          </div>

          {status && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
              <span className="text-sm font-medium">{status.message}</span>
            </div>
          )}

          {status?.type === 'success' ? (
            <div className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 px-6 py-3 rounded-xl transition-colors">
                Go to Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-navy-700 rounded-xl bg-slate-50/50 dark:bg-navy-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-navy-700 rounded-xl bg-slate-50/50 dark:bg-navy-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-navy-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
          
        </div>
      </div>
    </div>
  );
}
