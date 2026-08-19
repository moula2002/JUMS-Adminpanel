import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Save, X, Briefcase, Building2, FileText, Settings, AlignLeft, DollarSign, Search } from 'lucide-react';

export default function JobForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '', image: '', department: '', type: 'Full-time', location: '', vacancies: 1,
    experience: '', qualification: '', skills: '',
    salaryType: 'Range', salaryMin: '', salaryMax: '',
    shortDescription: '', jobDescription: '', responsibilities: '', requirements: '',
    companyName: '', companyLogo: '', companyWebsite: '', companyEmail: '', companyPhone: '',
    applicationDeadline: '', applicationMethod: 'Apply Form', applyLink: '',
    status: 'Active', featured: false, urgentHiring: false,
    metaTitle: '', metaDescription: '', keywords: ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const response = await axios.get(`https://jums-sever.onrender.com/api/jobs`);
          const jobsList = response.data.jobs || response.data; // Handle both paginated and flat responses
          const job = jobsList.find(j => j._id === id);
          if (job) {
            setFormData(prev => ({
              ...prev,
              ...job,
              skills: job.skills ? job.skills.join(', ') : '',
              keywords: job.keywords ? job.keywords.join(', ') : '',
              applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : ''
            }));
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching job details:", error);
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formPayload = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'skills' || key === 'keywords') {
          // Send as comma-separated string, backend will parse it
          const val = formData[key] || '';
          const arr = val.split(',').map(s => s.trim()).filter(Boolean);
          formPayload.append(key, JSON.stringify(arr));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formPayload.append(key, formData[key]);
        }
      });

      if (isEditMode) {
        await axios.put(`https://jums-sever.onrender.com/api/jobs/${id}`, formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('https://jums-sever.onrender.com/api/jobs', formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/jobs');
    } catch (error) {
      console.error("Error saving job:", error.response?.data || error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading job details...</div>;
  }

  return (
    <div className="py-6 h-full flex flex-col bg-slate-50 dark:bg-navy-950 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isEditMode ? 'Edit Job' : 'Post New Job'}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Fill out the comprehensive details for this job listing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-navy-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 ring-1 ring-inset ring-slate-300 dark:ring-navy-600 hover:bg-slate-50 dark:hover:bg-navy-700 transition-all"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button 
              type="submit"
              form="job-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 disabled:opacity-50 transition-all"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Job'}
            </button>
          </div>
        </div>

        <form id="job-form" onSubmit={handleSubmit} className="space-y-8 pb-12">
          
          {/* Section: Basic Details */}
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-navy-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Briefcase className="h-5 w-5 text-brand-500" />
              Basic Job Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Image (Optional)</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category / Department *</label>
                <input type="text" name="department" required value={formData.department} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Type *</label>
                <select name="type" required value={formData.type} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Location *</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Vacancies *</label>
                <input type="number" name="vacancies" required min="1" value={formData.vacancies} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
            </div>
          </div>

          {/* Section: Experience & Qualification */}
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-navy-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-brand-500" />
              Experience & Qualification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience *</label>
                <input type="text" name="experience" required placeholder="e.g., 1-3 Years" value={formData.experience} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Education Qualification *</label>
                <input type="text" name="qualification" required placeholder="e.g., B.E / B.Tech / MCA" value={formData.qualification} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Required Skills * (Comma separated)</label>
                <input type="text" name="skills" required placeholder="React, Node.js, MongoDB" value={formData.skills} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
            </div>
          </div>

          {/* Section: Salary Details */}
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-navy-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <DollarSign className="h-5 w-5 text-brand-500" />
              Salary Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Salary Type</label>
                <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500">
                  <option>Fixed</option>
                  <option>Range</option>
                  <option>Negotiable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Minimum Salary</label>
                <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Maximum Salary</label>
                <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
            </div>
          </div>

          {/* Section: Job Description */}
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-navy-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <AlignLeft className="h-5 w-5 text-brand-500" />
              Job Description
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Description *</label>
                <textarea name="shortDescription" required rows="2" value={formData.shortDescription} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Job Description *</label>
                <textarea name="jobDescription" required rows="4" value={formData.jobDescription} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Roles & Responsibilities *</label>
                <textarea name="responsibilities" required rows="3" value={formData.responsibilities} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Requirements / Eligibility *</label>
                <textarea name="requirements" required rows="3" value={formData.requirements} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500"></textarea>
              </div>
            </div>
          </div>

          {/* Section: Company Information */}
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-navy-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-brand-500" />
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Logo (Optional)</label>
                <input type="file" name="companyLogo" accept="image/*" onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Website (Optional)</label>
                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Email</label>
                <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Phone</label>
                <input type="text" name="companyPhone" value={formData.companyPhone} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
            </div>
          </div>

          {/* Section: Application Details & Status */}
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-navy-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Settings className="h-5 w-5 text-brand-500" />
              Application & Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Application Deadline *</label>
                <input type="date" name="applicationDeadline" required value={formData.applicationDeadline} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Application Method</label>
                <select name="applicationMethod" value={formData.applicationMethod} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500">
                  <option>Apply Form</option>
                  <option>Email</option>
                  <option>External Link</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Apply Link / Email *</label>
                <input type="text" name="applyLink" required value={formData.applyLink} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-navy-700 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500">
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Closed</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 mt-8">
                  <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured Job</label>
                </div>
                <div className="flex items-center gap-3 mt-8">
                  <input type="checkbox" name="urgentHiring" id="urgentHiring" checked={formData.urgentHiring} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                  <label htmlFor="urgentHiring" className="text-sm font-medium text-slate-700 dark:text-slate-300">Urgent Hiring</label>
                </div>
              </div>
            </div>
          </div>

          {/* Section: SEO */}
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-navy-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Search className="h-5 w-5 text-brand-500" />
              SEO Fields (Optional)
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
                <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
                <textarea name="metaDescription" rows="2" value={formData.metaDescription} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords (Comma separated)</label>
                <input type="text" name="keywords" placeholder="e.g. Developer, MERN, Remote" value={formData.keywords} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-slate-900 dark:text-white px-3 py-2 border focus:ring-brand-500" />
              </div>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}
