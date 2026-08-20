import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Animated Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-brand-500/20 to-brand-400/20 blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-navy-500/20 to-blue-500/20 blur-[120px] pointer-events-none animate-float delay-300" />
      
      <div className="w-full max-w-md p-6 sm:p-8 relative z-10 animate-fade-in">
        {/* Glassmorphism Card */}
        <div className="glass rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/50 dark:ring-white/10 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 pointer-events-none rounded-[2rem]" />

          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-10 relative z-10">
            <div className="w-24 h-24 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl mb-6 ring-1 ring-slate-100/50 dark:ring-navy-700/50 animate-slide-up">
              <img src={logoImg} alt="JUMS Logo" className="h-14 w-auto object-contain drop-shadow-md transition-transform hover:scale-105 duration-300" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-slide-up delay-100">Welcome Back</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 text-center animate-slide-up delay-200 font-medium">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10 animate-slide-up delay-300">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/50 dark:border-navy-700/50 rounded-xl bg-white/60 dark:bg-navy-900/60 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:bg-white dark:focus:bg-navy-900 transition-all sm:text-sm shadow-sm"
                  placeholder="admin@jums.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <Link 
                  to="/forgot-password"
                  className="text-xs font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3.5 border border-slate-200/50 dark:border-navy-700/50 rounded-xl bg-white/60 dark:bg-navy-900/60 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:bg-white dark:focus:bg-navy-900 transition-all sm:text-sm shadow-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/30 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-navy-900 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
