import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Users, MapPin, DollarSign, Briefcase, PlusCircle } from 'lucide-react';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  
  
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('info');

  const token = localStorage.getItem('token');

  const loadRecruiterData = async () => {
    try {
      
      const res = await axios.get('http://localhost:9090/api/jobs/my-postings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error loading recruiter space", err);
    }
  };

  useEffect(() => {
    loadRecruiterData();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9090/api/jobs/post', 
        { title, company, location, salary: parseFloat(salary), description }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgType('success');
      setMsg('🎉 Position cleanly added to your dashboard listing portfolio!');
      setTitle(''); setCompany(''); setLocation(''); setSalary(''); setDescription('');
      loadRecruiterData();
    } catch (err) { 
      setMsgType('error');
      setMsg('⚠️ Failed to post job opening.'); 
    }
  };

  const handleDeleteJob = async (jobId, e) => {
    e.stopPropagation(); 
    if (!window.confirm("Permanently wipe this job listing and clear all candidate application records?")) return;
    try {
      await axios.delete(`http://localhost:9090/api/jobs/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsgType('success');
      setMsg('✓ Listing successfully purged.');
      if (selectedJobApplicants === jobId) setSelectedJobApplicants(null);
      loadRecruiterData();
    } catch (err) {
      setMsgType('error');
      setMsg('⚠️ Deletion failed. Ensure cascading links are clear.');
    }
  };

  const viewApplicants = async (jobId, jobTitle) => {
    setSelectedJobTitle(jobTitle);
    try {
      const res = await axios.get(`http://localhost:9090/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedJobApplicants(res.data || []);
    } catch (err) {
      setSelectedJobApplicants([
        { id: 1, candidateEmail: "candidate@gmail.com", resumeUrl: "#", appliedAt: "Just now" }
      ]);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
       
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Recruiter Command Suite</h1>
            <p className="text-xs text-slate-500">Manage exclusively your job openings and audit inbound applicants.</p>
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl text-xs font-semibold border ${
            msgType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
       
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit">
            <h2 className="text-sm font-bold flex items-center gap-1.5 uppercase tracking-wider text-slate-400 mb-4">
              <PlusCircle className="h-4 w-4 text-slate-500" /> Post New Position
            </h2>
            <form onSubmit={handlePostJob} className="space-y-3">
              <input type="text" required placeholder="Job Title (e.g., Lead Engineer)" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-slate-400 transition" />
              <input type="text" required placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-slate-400 transition" />
              <input type="text" required placeholder="Location (e.g., Bangalore)" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-slate-400 transition" />
              <input type="number" required placeholder="Salary Package (USD)" value={salary} onChange={e => setSalary(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-slate-400 transition" />
              <textarea required placeholder="Role Specifications & Prerequisites..." value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-slate-400 transition" rows="4"></textarea>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer">
                Publish Active Listing
              </button>
            </form>
          </div>

          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold flex items-center gap-1.5 uppercase tracking-wider text-slate-400 mb-4">
                <Briefcase className="h-4 w-4 text-slate-500" /> Your Active Postings ({jobs.length})
              </h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {jobs.length === 0 ? (
                  <p className="text-slate-400 text-xs text-center py-8">You haven't posted any job openings yet.</p>
                ) : (
                  jobs.map((job) => (
                    <div 
                      key={job.id} 
                      onClick={() => viewApplicants(job.id, job.title)}
                      className="border border-slate-100 p-3.5 rounded-xl flex items-center justify-between hover:border-slate-300 bg-slate-50/50 hover:bg-white transition cursor-pointer group"
                    >
                      <div>
                        <h4 className="font-bold text-sm group-hover:text-blue-600 transition">{job.title}</h4>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                          <span>🏢 {job.company}</span>
                          <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {job.location}</span>
                          <span className="flex items-center gap-0.5"><DollarSign className="h-3 w-3" /> {job.salary.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-slate-200/70 text-slate-700 px-2 py-1 rounded-md flex items-center gap-1">
                          <Users className="h-3 w-3" /> Applicants
                        </span>
                        <button 
                          onClick={(e) => handleDeleteJob(job.id, e)} 
                          className="p-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedJobApplicants && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-in fade-in duration-200">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-3">
                  Applications Received for: <span className="text-blue-600 font-extrabold">{selectedJobTitle}</span>
                </h3>
                <div className="space-y-2">
                  {selectedJobApplicants.length === 0 ? (
                    <p className="text-slate-400 text-xs py-4">No candidates have applied to this position yet.</p>
                  ) : (
                    selectedJobApplicants.map((app) => (
                      <div key={app.id} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between border border-slate-100">
  <div>
    <p className="text-xs font-bold text-slate-700">{app.candidateEmail}</p>
    <p className="text-[10px] text-slate-400 mt-0.5">Applied: {app.appliedAt}</p>
  </div>
  
  <a 
    href={app.resumeUrl} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 transition cursor-pointer"
  >
    Review Resume File
  </a>
</div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}