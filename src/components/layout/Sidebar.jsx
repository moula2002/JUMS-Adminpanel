import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  MessageSquare,
  LogOut,
  Briefcase,
  FolderOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Applications', href: '/applications', icon: FolderOpen },
  { name: 'Enquiry', href: '/enquiry', icon: MessageSquare },
  { name: 'Profile Setting', href: '/settings', icon: Settings },
];

export default function Sidebar({ onClose }) {
  const { logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col glass border-r border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none" />

      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50 relative z-10">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="JUMS Logo" className="h-10 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4 relative z-10">
        <nav className="flex-1 space-y-2 px-4">
          {navigation.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 1024 && onClose) {
                  onClose();
                }
              }}
              className={({ isActive }) => cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "text-brand-700 dark:text-brand-400 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-900/30 dark:to-brand-800/10 opacity-100" />
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full shadow-[0_0_8px_rgba(255,102,0,0.6)]" />
                  )}
                  <item.icon 
                    className={cn(
                      "h-5 w-5 shrink-0 transition-all duration-300 relative z-10",
                      isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-110 group-hover:text-brand-500"
                    )}
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 relative z-10">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-300 group"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
          Sign out
        </button>
      </div>
    </div>
  );
}
