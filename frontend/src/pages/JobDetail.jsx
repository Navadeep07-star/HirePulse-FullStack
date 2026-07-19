import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [aiPrep, setAiPrep] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [msg, setMsg] = useState('');
  const [resumeUrl, setResumeUrl] = useState(''); 

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    axios.get(`http://localhost:9090/api/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(err => console.error(err));

    if (token && token !== "null" && token !== "undefined" && token.trim() !== "" && token.includes('.')) {
      axios.get(`http://localhost:9090/api/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const hasApplied = res.data.some(app => app.job && app.job.id === parseInt(id));
        if (hasApplied) setApplied(true);
      })
      .catch(err => console.log("No previous submission tracking found for candidate index."));
    }
  }, [id, token]);

  const handleApplySubmission = async () => {
    if (!resumeUrl.trim()) {
      setMsg("⚠️ Please provide a valid resume URL (e.g., Google Drive link).");
      return;
    }
    
    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain"
        }
      };

      await axios.post(`http://localhost:9090/api/applications/apply/${id}`, resumeUrl, config);
      setApplied(true);
      setMsg("✓ Your application with your resume link has been successfully submitted!");
    } catch (err) {
      setMsg("⚠️ Submission processing failure.");
    }
  };

  const generateAiPrep = async () => {
    setAiLoading(true);
    try {
      const res = await axios.get(`http://localhost:9090/api/jobs/${id}/interview-prep`);
      setAiPrep(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (!job) return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center">
      <p className="text-slate-400 text-sm font-medium animate-pulse">Locating profile index...</p>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-73px)] text-slate-900 pb-12">
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        
        <Link to="/" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition flex items-center gap-1">
          ← Back to active directory
        </Link>
        
        
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-md">
            Full-Time Position
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">{job.title}</h1>
          <div className="flex gap-4 text-xs font-bold text-slate-500 mt-2 border-b border-slate-100 pb-4">
            <span>🏢 {job.company || 'Global TechCorp'}</span>
            <span>📍 {job.location}</span>
            <span className="text-emerald-700">💰 {job.salary ? `$${job.salary.toLocaleString()}` : 'Competitive'}</span>
          </div>
          
          <div className="mt-6">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2">Role & Requirements</h3>
            <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{job.description}</p>
          </div>

          {msg && (
            <div className={`mt-4 p-3 rounded-xl text-xs font-semibold ${applied ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              {msg}
            </div>
          )}

          
          {userRole === 'JOB_SEEKER' ? (
            <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Paste Resume Link (Google Drive / Dropbox)</label>
                <input 
                  type="url" 
                  required
                  disabled={applied}
                  placeholder="https://drive.google.com/..." 
                  value={resumeUrl}
                  onChange={e => setResumeUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
              <button 
                onClick={handleApplySubmission}
                disabled={applied}
                className={`w-full font-bold py-3 px-4 rounded-xl transition shadow-sm cursor-pointer ${
                  applied ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {applied ? '✓ Application Successfully Processed' : 'Submit Direct Application'}
              </button>
            </div>
          ) : (
            <div className="mt-6 bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl text-xs font-semibold text-center">
              ℹ️ Accessing via a Recruiter Profile. Application capability restricted.
            </div>
          )}
        </div>

       
        <div className="bg-white border-2 border-emerald-600/20 p-8 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
          
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            ✨ AI Co-Pilot Simulator
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 mb-6">
            Generate custom system-focused questions matching this position description.
          </p>
          
          {!aiPrep && !aiLoading && (
            <button onClick={generateAiPrep} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition shadow-sm cursor-pointer">
              Build Custom Mock Framework
            </button>
          )}

          {aiLoading && (
            <p className="text-sm font-semibold text-emerald-600 animate-pulse">
              Generating contextual analysis dataset...
            </p>
          )}

          {aiPrep && (
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl mt-2 whitespace-pre-line text-sm text-slate-700 leading-relaxed font-normal shadow-inner">
              {aiPrep}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}