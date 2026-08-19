import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    const result = await login(email, password);
    
    setIsLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-navy-950 relative overflow-hidden transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-navy-500/20 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        {/* Glassmorphism Card */}
        <div className="bg-white/80 dark:bg-navy-900/60 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-slate-200/50 dark:ring-white/10 p-8">
          
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-white dark:bg-navy-800 rounded-2xl flex items-center justify-center shadow-lg mb-6 ring-1 ring-slate-100 dark:ring-navy-700">
              <img src="/src/assets/logo.png" alt="JUMS Logo" className="h-12 w-auto object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-navy-700 rounded-xl bg-slate-50/50 dark:bg-navy-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all sm:text-sm"
                  placeholder="admin@jums.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-navy-700 rounded-xl bg-slate-50/50 dark:bg-navy-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all sm:text-sm"
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
                'Sign in'
              )}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
