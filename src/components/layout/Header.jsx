import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Menu, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export default function Header({ toggleSidebar }) {
  const [isDark, setIsDark] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check initial system preference or saved preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, you'd save this to localStorage and toggle a class on the html element
    // For now, we'll assume the OS preference handles the core tailwind dark mode if class strategy isn't used
    // If class strategy is used in tailwind v4, we can toggle 'dark' on document.documentElement
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 backdrop-blur-md transition-colors duration-200">
      <button 
        type="button" 
        className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-300 lg:hidden"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Search</label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 sm:text-sm bg-transparent outline-none"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            onClick={toggleTheme}
            className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <span className="sr-only">Toggle theme</span>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 relative transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <button type="button" className="-m-1.5 flex items-center p-1.5 hover:opacity-80 transition-opacity">
              <span className="sr-only">Open user menu</span>
              {user?.name ? (
                <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-sm ring-2 ring-slate-200 dark:ring-slate-700 uppercase">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 ring-2 ring-slate-200 dark:ring-slate-700">
                  <User className="h-4 w-4" />
                </div>
              )}
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-slate-900 dark:text-white" aria-hidden="true">
                  {user?.name || 'Admin User'}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
