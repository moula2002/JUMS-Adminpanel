import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-navy-900 shadow-2xl transition-all sm:my-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
