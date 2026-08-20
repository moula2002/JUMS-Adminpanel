import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Globe,
  Palette,
  Save,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    profilePhoto: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const getAuthConfig = () => {
    const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');
    return {
      headers: {
        Authorization: `Bearer ${admin.token}`
      }
    };
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('https://jums-sever.onrender.com/api/auth/profile', getAuthConfig());
      setProfile(data);
      // Sync navbar with fetched profile photo
      const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');
      if (data.profilePhoto && admin.profilePhoto !== data.profilePhoto) {
        updateUser({
          ...admin,
          profilePhoto: data.profilePhoto,
          name: data.name
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 2MB' });
        return;
      }
      setPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('firstName', profile.firstName);
      formData.append('lastName', profile.lastName);
      formData.append('email', profile.email);
      formData.append('bio', profile.bio);
      if (photoFile) {
        formData.append('profilePhoto', photoFile);
      }

      const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const { data } = await axios.put('https://jums-sever.onrender.com/api/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${admin.token}`
        }
      });
      
      // Update local storage and context with new info
      const updatedUser = {
        ...admin,
        name: data.name,
        email: data.email,
        profilePhoto: data.profilePhoto,
        token: data.token // In case token is refreshed
      };
      updateUser(updatedUser);

      setProfile(data);
      setPhotoFile(null);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  // Security State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securitySaving, setSecuritySaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setSecuritySaving(true);
    setMessage(null);
    try {
      await axios.put('https://jums-sever.onrender.com/api/auth/security', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, getAuthConfig());
      
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password.' });
    } finally {
      setSecuritySaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <div className="p-6 lg:p-8 w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Profile Setting</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and platform settings.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center justify-between ${message.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'}`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
                
                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Avatar Upload */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center overflow-hidden">
                          {profile.profilePhoto ? (
                            <img 
                              src={profile.profilePhoto} 
                              alt="Profile" 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=0D8ABC&color=fff`;
                              }}
                            />
                          ) : (
                            <img src={`https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=0D8ABC&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/*" className="hidden" />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Profile Photo</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">JPG, GIF or PNG. Max size of 2MB.</p>
                        <div className="flex gap-3 justify-center sm:justify-start">
                          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20 text-sm font-medium rounded-lg transition-colors">
                            Upload New
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                        <input type="text" name="firstName" value={profile.firstName || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                        <input type="text" name="lastName" value={profile.lastName || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                        <input type="email" name="email" value={profile.email || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                        <textarea name="bio" value={profile.bio || ''} onChange={handleProfileChange} rows="4" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm resize-none" placeholder="Write a few sentences about yourself..."></textarea>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                      <button onClick={fetchProfile} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-brand-500/20">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Security Settings</h2>
                <form onSubmit={handleSavePassword}>
                  <div className="space-y-6 max-w-md">
                    <div className="space-y-1.5 relative">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                      <div className="relative">
                        <input type={showCurrentPassword ? "text" : "password"} name="currentPassword" required value={passwords.currentPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm pr-10" />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                      <div className="relative">
                        <input type={showNewPassword ? "text" : "password"} name="newPassword" required value={passwords.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm pr-10" />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required value={passwords.confirmPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors text-sm pr-10" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <button type="button" onClick={() => setPasswords({currentPassword: '', newPassword: '', confirmPassword: ''})} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={securitySaving} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-brand-500/20">
                      {securitySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {securitySaving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* End of content area */}
        </div>
      </div>
    </div>
  );
}
