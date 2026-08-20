import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Briefcase, 
  Clock, 
  Trash2, 
  CheckCircle,
  FileText,
  Mail
} from 'lucide-react';
import axios from 'axios';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://jums-sever.onrender.com/api/applications');
      if (response.data.success) {
        setApplications(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedApplication(response.data.data[0]);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setApplications([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://jums-sever.onrender.com/api/applications/${id}/status`, { status });
      setApplications(applications.map(a => a._id === id ? { ...a, status } : a));
      if (selectedApplication && selectedApplication._id === id) {
        setSelectedApplication({ ...selectedApplication, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await axios.delete(`https://jums-sever.onrender.com/api/applications/${id}`);
      const updated = applications.filter(a => a._id !== id);
      setApplications(updated);
      if (selectedApplication && selectedApplication._id === id) {
        setSelectedApplication(updated.length > 0 ? updated[0] : null);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const filteredApplications = applications.filter(a => {
    const matchesSearch = (a.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (a.jobTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && (a.status || 'New').toLowerCase() === activeTab.toLowerCase();
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 lg:p-8 w-full max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Job Applications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review and manage candidates' job applications.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100%-100px)]">
        {/* Left Sidebar - Filters & List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm dark:text-white"
              placeholder="Search by name or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            {['all', 'new', 'viewed', 'replied'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="text-center text-slate-500 mt-10">Loading...</div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">No applications found.</div>
            ) : (
              filteredApplications.map((application) => (
                <div 
                  key={application._id} 
                  onClick={() => {
                    setSelectedApplication(application);
                    if (application.status === 'New') {
                      updateStatus(application._id, 'Viewed');
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    selectedApplication?._id === application._id 
                      ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' 
                      : (application.status === 'New' 
                          ? 'bg-white dark:bg-slate-900 border-brand-100 dark:border-brand-900/50 shadow-sm' 
                          : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900')
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${application.status === 'New' ? 'bg-brand-500' : 'bg-transparent'}`} />
                      <h3 className={`text-sm font-semibold ${application.status === 'New' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {application.fullName}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap ml-2">
                      {formatDate(application.createdAt)}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1 truncate">{application.jobTitle}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Exp: {application.experience}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Content - View */}
        <div className="hidden lg:flex w-full lg:w-2/3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-col overflow-hidden">
          {selectedApplication ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedApplication.jobTitle}</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg">
                      {selectedApplication.fullName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedApplication.fullName}</div>
                      <div className="text-xs text-slate-500 flex gap-3">
                        <span><a href={`mailto:${selectedApplication.email}`} className="hover:text-brand-500">{selectedApplication.email}</a></span>
                        {selectedApplication.phone && <span><a href={`tel:${selectedApplication.phone}`} className="hover:text-brand-500">{selectedApplication.phone}</a></span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    selectedApplication.status === 'New' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20' :
                    selectedApplication.status === 'Viewed' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20' :
                    'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                  }`}>
                    {selectedApplication.status || 'New'}
                  </span>
                  
                  {selectedApplication.status !== 'Replied' && (
                    <button 
                      onClick={() => updateStatus(selectedApplication._id, 'Replied')}
                      title="Mark as Replied"
                      className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteApplication(selectedApplication._id)}
                    title="Delete Application"
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Applied on {formatDate(selectedApplication.createdAt)}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Experience Level</h3>
                  <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-sm text-slate-700 dark:text-slate-300 inline-block">
                    {selectedApplication.experience || 'Not specified'}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Cover Letter</h3>
                  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                      {selectedApplication.coverLetter || 'No cover letter provided.'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Attached Resume</h3>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-lg max-w-md">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-700 dark:text-blue-300 font-medium truncate">
                      {selectedApplication.resumePath || 'No resume file details saved.'}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto flex-shrink-0">(Sent via Email)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
                <button 
                  onClick={() => {
                    window.location.href = `mailto:${selectedApplication.email}?subject=Regarding your application for ${selectedApplication.jobTitle}`;
                    updateStatus(selectedApplication._id, 'Replied');
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-brand-500/20">
                  <Mail className="w-4 h-4" />
                  Contact Candidate
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Briefcase className="w-12 h-12 mb-4 opacity-20" />
              <p>Select an application to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
