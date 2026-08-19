import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('https://jums-sever.onrender.com/api/jobs');
      setJobs(response.data.jobs || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`https://jums-sever.onrender.com/api/jobs/${id}`);
        await fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="py-6 h-full flex flex-col">
      {/* Header Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-brand-500" />
            Jobs Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage all open positions and job postings.
          </p>
        </div>
        <button onClick={() => navigate('/jobs/new')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all">
          <Plus className="h-5 w-5" />
          Post New Job
        </button>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-8 w-full flex-1 flex flex-col">
        {/* Table Controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-center bg-white dark:bg-navy-900 p-4 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-navy-700">
          <div className="relative w-full sm:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-500 sm:text-sm sm:leading-6 dark:bg-navy-800 dark:text-white dark:ring-navy-600 dark:placeholder:text-slate-500 transition-all"
              placeholder="Search jobs by title or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="block w-full sm:w-auto rounded-lg border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-brand-500 sm:text-sm sm:leading-6 dark:bg-navy-800 dark:text-white dark:ring-navy-600 transition-all cursor-pointer">
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-navy-700 overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-navy-700">
              <thead className="bg-slate-50 dark:bg-navy-800/50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-200 sm:pl-6">Job Title</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-200">Department</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-200 hidden md:table-cell">Location</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-200">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-navy-700 bg-white dark:bg-navy-900">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      Loading jobs...
                    </td>
                  </tr>
                ) : filteredJobs.length > 0 ? filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors group">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="font-medium text-slate-900 dark:text-white">{job.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5">{job.type}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">
                      <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-navy-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10 dark:ring-white/10">
                        {job.department}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300 hidden md:table-cell">
                      {job.location}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                        job.status === 'Active' && "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-500/20",
                        job.status === 'Draft' && "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-500/20",
                        job.status === 'Closed' && "bg-slate-50 text-slate-600 ring-slate-500/20 dark:bg-navy-800 dark:text-slate-400 dark:ring-white/10",
                      )}>
                        {job.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/jobs/edit/${job._id}`)} className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors p-1" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(job._id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      No jobs found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
