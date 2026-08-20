import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Menu, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export default function Header({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/50 dark:border-slate-800/50 glass px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-300">
      <button 
        type="button" 
        className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1 items-center" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Search</label>
          <div className="relative w-full max-w-md group">
            <Search
              className="pointer-events-none absolute inset-y-0 left-3 h-full w-4 text-slate-400 group-focus-within:text-brand-500 transition-colors duration-300"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block w-full rounded-full border-0 bg-slate-100/50 dark:bg-slate-800/50 py-2 pl-9 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 sm:text-sm outline-none"
              placeholder="Search..."
              type="search"
              name="search"
            />
          </div>
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="relative -m-2.5 p-2.5 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-slate-800 rounded-full transition-all duration-300 group">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-navy-950 animate-pulse-soft"></span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200/50 dark:lg:bg-slate-700/50" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <button type="button" className="-m-1.5 flex items-center p-1.5 hover:opacity-80 transition-opacity group">
              <span className="sr-only">Open user menu</span>
              {user?.profilePhoto ? (
                <img
                  className="h-9 w-9 rounded-full bg-slate-100 object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-brand-500/50 transition-all duration-300"
                  src={user.profilePhoto}
                  alt={user.name || 'Admin'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${user.name || 'Admin'}&background=0D8ABC&color=fff`;
                  }}
                />
              ) : user?.name ? (
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_8px_rgba(255,102,0,0.4)] group-hover:shadow-[0_4px_12px_rgba(255,102,0,0.6)] transition-all duration-300 uppercase">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-brand-500/50 transition-all duration-300">
                  <User className="h-4 w-4" />
                </div>
              )}
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-3 text-sm font-semibold leading-6 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" aria-hidden="true">
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
