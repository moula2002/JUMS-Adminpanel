import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Activity, ArrowUpRight, Briefcase, ChevronRight } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IconMap = {
  CreditCard,
  Users,
  Activity,
  Briefcase
};

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
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
        setChartData(response.data.chartData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-full">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your platform's performance and recent activities.
          </p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={stat.id} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="lg:col-span-2 rounded-2xl glass p-6 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 animate-slide-up delay-200 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-500" />
              Platform Engagement
            </h2>
          </div>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6600" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ff6600" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnqs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                  }}
                  itemStyle={{ color: '#0f172a', fontWeight: 500 }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#ff6600" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" name="Applications" activeDot={{r: 6, strokeWidth: 0, fill: '#ff6600'}} />
                <Area type="monotone" dataKey="enquiries" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEnqs)" name="Enquiries" activeDot={{r: 6, strokeWidth: 0, fill: '#10b981'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="rounded-2xl glass p-6 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 animate-slide-up delay-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
            <button className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 flex items-center gap-1 group">
              View all <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="flow-root relative">
            {/* Custom line for timeline */}
            <div className="absolute top-4 bottom-4 left-[19px] w-0.5 bg-gradient-to-b from-brand-500 via-slate-200 dark:via-slate-700 to-transparent" />
            
            <ul className="-mb-8">
              {recentActivity.map((item, itemIdx) => (
                <li key={item.id}>
                  <div className="relative pb-8 group">
                    <div className="relative flex space-x-4">
                      <div>
                        <span className="relative h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center ring-4 ring-white dark:ring-navy-950 shadow-sm transition-transform duration-300 group-hover:scale-110 z-10">
                          <ArrowUpRight className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-2">
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-tight">
                            {item.action} <span className="font-semibold text-slate-900 dark:text-white">{item.target}</span>
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-xs font-medium text-slate-400 dark:text-slate-500">
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
  );
}
