import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchJobs = async (resetPage = false) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const currentPage = resetPage ? 0 : page;
      if (resetPage) setPage(0);

     
      const url = search 
        ? `http://localhost:9090/api/jobs/search?keyword=${search}`
        : `http://localhost:9090/api/jobs/all?page=${currentPage}&size=6`;

    
      const config = {};
      if (token && token !== "null" && token !== null && token.trim() !== "") {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
      }

      const response = await axios.get(url, config);

      
      if (search) {
        
        setJobs(response.data);
        setTotalPages(1); 
      } else {
       
        setJobs(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      console.error("Error loading jobs from backend matrix", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleSearchClick = () => {
    fetchJobs(true); 
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-73px)] text-slate-900">
      <div className="p-8 max-w-5xl mx-auto">
        
       
        <div className="mb-10 max-w-xl">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Find your matching role.
          </h2>
          <p className="text-slate-500 text-base mt-3 leading-relaxed">
            A secure full-stack directory providing instant, targeted technical mock feedback powered by Google Gemini.
          </p>
          
       
          <div className="mt-6 flex gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-sm focus-within:border-slate-400 transition">
            <input 
              type="text" 
              placeholder="Search by tech stack, title, or keywords..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-slate-900 placeholder-slate-400 px-3 py-2 text-sm flex-1 focus:outline-none"
            />
            <button onClick={handleSearchClick} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition cursor-pointer shadow-sm">
              Search
            </button>
          </div>
        </div>

        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm font-medium animate-pulse">Syncing platform jobs registry...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No roles matching requirements located in active catalog.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-white border border-slate-200/80 p-6 rounded-2xl hover:shadow-md transition duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">{job.company || 'TechCorp'}</span>
                      <span>📍 {job.location}</span>
                    </div>
                    <p className="text-slate-600 text-sm mt-3 line-clamp-2 max-w-2xl leading-relaxed">{job.description}</p>
                  </div>
                  <div className="w-full sm:w-auto pt-2 sm:pt-0">
                    <Link to={`/job/${job.id}`} className="block text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm">
                      View Opening
                    </Link>
                  </div>
                </div>
              ))
            )}

  
            {!search && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-6">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border rounded-xl shadow-sm text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  ← Previous
                </button>
                <span className="text-xs font-bold text-slate-500">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border rounded-xl shadow-sm text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}