import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function StatCard({ title, value, icon: Icon, trend, trendValue }) {
  const isPositive = trend === 'up';
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 transition-all hover:shadow-md dark:hover:ring-slate-700 group">
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-slate-50 dark:bg-slate-800/50 opacity-50 blur-2xl transition-transform group-hover:scale-110" />
      
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="inline-flex rounded-lg bg-brand-50 dark:bg-brand-900/30 p-3 ring-1 ring-brand-100 dark:ring-brand-800/50">
            <Icon className="h-6 w-6 text-brand-600 dark:text-brand-500" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">{title}</p>
        </div>
        
        <div className="mt-4 flex items-baseline gap-4">
          <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</p>
          {trend && (
            <p className={cn(
              "flex items-center text-sm font-semibold",
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}>
              {isPositive ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {trendValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
