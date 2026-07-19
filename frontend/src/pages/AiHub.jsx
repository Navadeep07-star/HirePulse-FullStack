import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import axios from 'axios';

export default function AiHub() {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [jobId, setJobId] = useState('');
  const [aiData, setAiData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
    
    axios.get('http://localhost:9090/api/jobs/all?page=0&size=100')
      .then(res => {
        setAvailableJobs(res.data.content || []);
      })
      .catch(err => console.error("Could not fetch active directory list for dropdown menu setup", err));
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!jobId) return;
    setLoading(true);
    setError('');
    setAiData('');
    try {
      const response = await axios.get(`http://localhost:9090/api/jobs/${jobId}/interview-prep`);
      setAiData(response.data);
    } catch (err) {
      setError('Could not compile dataset. Verify that the requested Job ID exists in MySQL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-73px)] p-8 text-slate-900">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
          <Sparkles className="h-3 w-3" /> Dedicated AI Sandbox Module
        </div>
        <h1 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">HirePulse Simulator</h1>
        <p className="text-slate-500 text-sm mt-1">Compile standalone question patterns instantly via database cross-referencing.</p>

      
        <form onSubmit={handleGenerate} className="mt-6 flex flex-col gap-3 max-w-xl bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 px-1">Target Position Blueprint</label>
            <select 
              required
              value={jobId} 
              onChange={(e) => setJobId(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
            >
              <option value="">-- Click to choose from active portal listings --</option>
              {availableJobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} at {job.company || 'TechCorp'} ({job.location || 'Remote'})
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" disabled={loading || !jobId} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg text-sm transition cursor-pointer disabled:bg-slate-400 shadow-sm mt-1">
            {loading ? 'Compiling Dataset Matrix...' : 'Run Simulation Framework'}
          </button>
        </form>

        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">⚠️ {error}</div>}

        {aiData && (
          <div className="mt-6 bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-inner whitespace-pre-line text-sm text-slate-700 leading-relaxed">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-600" /> Compiled Simulation Matrix Output
            </h3>
            {aiData}
          </div>
        )}
      </div>
    </div>
  );
}