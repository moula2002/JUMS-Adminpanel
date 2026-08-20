import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, index = 0 }) {
  const isPositive = trend === 'up';
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] ring-1 ring-slate-200/50 dark:ring-slate-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group animate-slide-up",
        `delay-${(index % 3 + 1) * 100}`
      )}
    >
      {/* Decorative background blobs */}
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-brand-100 to-transparent dark:from-brand-900/30 opacity-50 blur-2xl transition-transform duration-500 group-hover:scale-150" />
      <div className="absolute left-0 bottom-0 h-24 w-24 translate-y-8 -translate-x-8 rounded-full bg-gradient-to-tr from-brand-100/50 to-transparent dark:from-brand-900/20 opacity-50 blur-2xl transition-transform duration-500 group-hover:scale-150" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4">
          <div className="inline-flex rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/40 dark:to-brand-800/20 p-3 ring-1 ring-brand-200/50 dark:ring-brand-700/30 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">{title}</p>
        </div>
        
        <div className="mt-5 flex items-baseline gap-4">
          <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full",
              isPositive 
                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20" 
                : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
            )}>
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {trendValue}
            </div>
          )}
        </div>
      </div>
      
      {/* Interactive hover border */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-500/0 group-hover:ring-brand-500/20 dark:group-hover:ring-brand-400/20 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
