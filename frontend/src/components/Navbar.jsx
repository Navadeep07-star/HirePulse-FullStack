import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, User, Briefcase } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('role'); 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
      
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition">
          HirePulse
        </span>
        <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
          AI-Powered
        </span>
      </Link>
      
     
      <div className="flex items-center gap-8 text-sm font-semibold">
        <Link to="/" className="text-slate-600 hover:text-slate-900 transition py-2">
          Explore Jobs
        </Link>
        
        
        {token && userRole === 'RECRUITER' && (
          <Link to="/recruiter/dashboard" className="text-slate-600 hover:text-slate-900 transition py-2 flex items-center gap-1.5 text-blue-600">
            <Briefcase className="h-4 w-4" /> Manage Openings
          </Link>
        )}
        
        <Link to="/ai-hub" className="text-slate-600 hover:text-slate-900 transition py-2 flex items-center gap-1.5 text-emerald-600">
          <Sparkles className="h-4 w-4" /> AI Sandbox
        </Link>

        {token ? (
          
          <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
            <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span className="max-w-[120px] truncate">{userEmail}</span>
              <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-1 rounded uppercase ml-1">
                {userRole === 'RECRUITER' ? 'Recruiter' : 'Candidate'}
              </span>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-2 rounded-lg transition text-xs tracking-wide shadow-sm cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        ) : (
          
          <Link to="/login" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition text-xs tracking-wide shadow-sm">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}