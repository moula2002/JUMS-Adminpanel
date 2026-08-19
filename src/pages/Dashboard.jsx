import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Activity, ArrowUpRight, Briefcase } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import axios from 'axios';

const IconMap = {
  CreditCard,
  Users,
  Activity,
  Briefcase
};

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('https://jums-sever.onrender.com/api/dashboard');
        
        // Map the string iconName to the actual Lucide component
        const mappedStats = response.data.stats.map(stat => ({
          ...stat,
          icon: IconMap[stat.iconName] || Activity
        }));
        
        setStats(mappedStats);
        setRecentActivity(response.data.recentActivity);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Chart Placeholder */}
          <div className="rounded-xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6 flex flex-col min-h-[400px]">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Revenue Overview</h2>
            <div className="flex-1 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Chart visualization goes here
              </p>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="rounded-xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((item, itemIdx) => (
                  <li key={item.id}>
                    <div className="relative pb-8">
                      {itemIdx !== recentActivity.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center ring-8 ring-white dark:ring-slate-900">
                            <ArrowUpRight className="h-4 w-4 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {item.action} <span className="font-medium text-slate-900 dark:text-white">{item.target}</span>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400">
                            {item.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
