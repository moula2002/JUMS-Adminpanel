import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Globe, 
  Palette,
  Save,
  Image as ImageIcon
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="p-6 lg:p-8 w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Profile Setting</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and platform settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Profile Information</h2>
                
                {/* Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center overflow-hidden">
                      <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Profile Photo</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">JPG, GIF or PNG. Max size of 2MB.</p>
                    <div className="flex gap-3 justify-center sm:justify-start">
                      <button className="px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20 text-sm font-medium rounded-lg transition-colors">
                        Upload New
                      </button>
                      <button className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 text-sm font-medium rounded-lg transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                    <input type="text" defaultValue="Admin" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <input type="email" defaultValue="admin@jums.com" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                    <textarea rows="4" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm resize-none" placeholder="Write a few sentences about yourself..."></textarea>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-brand-500/20">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'profile' && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                {activeTab === 'security' && <Shield className="w-8 h-8 text-slate-400" />}
                {activeTab === 'notifications' && <Bell className="w-8 h-8 text-slate-400" />}
                {activeTab === 'appearance' && <Palette className="w-8 h-8 text-slate-400" />}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">{activeTab} Settings</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">This section is currently under development. Detailed {activeTab} options will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
