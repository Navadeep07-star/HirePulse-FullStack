import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:9090/api/auth/login', { email, password });
      
     
      const activeToken = typeof response.data === 'string' ? response.data : (response.data.token || response.data.jwt);

     
      let assignedRole = "JOB_SEEKER";
      if (email.toLowerCase().includes('recruiter') || response.data.role === 'RECRUITER') {
        assignedRole = "RECRUITER";
      }

      console.log("SUCCESS! Authenticated Role Type:", assignedRole);


      localStorage.setItem('token', activeToken);
      localStorage.setItem('role', assignedRole);
      localStorage.setItem('userEmail', email);

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-73px)] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
        <p className="text-slate-500 text-sm mt-1">Sign in to manage your applications and AI preps.</p>

        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-semibold">⚠️ {error}</div>}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400" placeholder="you@domain.com" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2">
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  );
}