import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  Clock, 
  Trash2, 
  Reply,
  MoreVertical,
  CheckCircle,
  Eye,
  Mail
} from 'lucide-react';
import axios from 'axios';

export default function Enquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://jums-sever.onrender.com/api/forms/contact');
      if (response.data.success) {
        setEnquiries(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedEnquiry(response.data.data[0]);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn('Enquiries API endpoint not found on the server yet. Please ensure the backend is deployed.');
        setEnquiries([]);
      } else {
        console.error('Error fetching enquiries:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://jums-sever.onrender.com/api/forms/contact/${id}/status`, { status });
      setEnquiries(enquiries.map(e => e._id === id ? { ...e, status } : e));
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await axios.delete(`https://jums-sever.onrender.com/api/forms/contact/${id}`);
      const updated = enquiries.filter(e => e._id !== id);
      setEnquiries(updated);
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry(updated.length > 0 ? updated[0] : null);
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = (e.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (e.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && (e.status || 'New').toLowerCase() === activeTab.toLowerCase();
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
            <MessageSquare className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Enquiries
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage user messages, support tickets, and feedback.</p>
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
              placeholder="Search messages..."
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
            ) : filteredEnquiries.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">No enquiries found.</div>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <div 
                  key={enquiry._id} 
                  onClick={() => {
                    setSelectedEnquiry(enquiry);
                    if (enquiry.status === 'New') {
                      updateStatus(enquiry._id, 'Viewed');
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    selectedEnquiry?._id === enquiry._id 
                      ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' 
                      : (enquiry.status === 'New' 
                          ? 'bg-white dark:bg-slate-900 border-brand-100 dark:border-brand-900/50 shadow-sm' 
                          : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900')
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${enquiry.status === 'New' ? 'bg-brand-500' : 'bg-transparent'}`} />
                      <h3 className={`text-sm font-semibold ${enquiry.status === 'New' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {enquiry.name}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap ml-2">
                      {formatDate(enquiry.createdAt)}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1 truncate">{enquiry.subject || 'No Subject'}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{enquiry.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Content - Message View */}
        <div className="hidden lg:flex w-full lg:w-2/3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-col overflow-hidden">
          {selectedEnquiry ? (
            <>
              {/* Message Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedEnquiry.subject || 'No Subject'}</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg">
                      {selectedEnquiry.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedEnquiry.name}</div>
                      <div className="text-xs text-slate-500 flex gap-3">
                        <span><a href={`mailto:${selectedEnquiry.email}`} className="hover:text-brand-500">{selectedEnquiry.email}</a></span>
                        {selectedEnquiry.phone && <span><a href={`tel:${selectedEnquiry.phone}`} className="hover:text-brand-500">{selectedEnquiry.phone}</a></span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    selectedEnquiry.status === 'New' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20' :
                    selectedEnquiry.status === 'Viewed' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20' :
                    'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                  }`}>
                    {selectedEnquiry.status || 'New'}
                  </span>
                  
                  {selectedEnquiry.status !== 'Replied' && (
                    <button 
                      onClick={() => updateStatus(selectedEnquiry._id, 'Replied')}
                      title="Mark as Replied"
                      className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteEnquiry(selectedEnquiry._id)}
                    title="Delete Enquiry"
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Received {formatDate(selectedEnquiry.createdAt)}
                </div>
                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </p>
                </div>
              </div>

              {/* Reply Box (Placeholder UI) */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all shadow-sm">
                  <textarea 
                    className="w-full p-4 bg-transparent border-none focus:ring-0 text-sm placeholder-slate-400 dark:text-white resize-none outline-none"
                    rows="3"
                    placeholder="Type your reply here (Functionality to be implemented)..."
                  ></textarea>
                  <div className="flex justify-end items-center p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => {
                        window.location.href = `mailto:${selectedEnquiry.email}?subject=Re: ${selectedEnquiry.subject || 'Your Enquiry'}`;
                        updateStatus(selectedEnquiry._id, 'Replied');
                      }}
                      className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-brand-500/20">
                      <Mail className="w-4 h-4" />
                      Reply via Email
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <p>Select an enquiry to read the message</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
