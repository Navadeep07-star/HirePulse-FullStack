import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, Mail, Lock, UserCheck } from 'lucide-react';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('JOB_SEEKER'); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:9090/api/auth/register', { email, password, role });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. User might already exist.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-73px)] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create account</h2>
        <p className="text-slate-500 text-sm mt-1">Get started with intelligent full-stack placement tracking.</p>

        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-semibold">⚠️ {error}</div>}
        {success && <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs font-semibold">✓ Registration successful! Redirecting...</div>}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          
          
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Profile Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('JOB_SEEKER')} className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-24 cursor-pointer ${role === 'JOB_SEEKER' ? 'border-emerald-600 bg-emerald-50/30 text-slate-900 font-bold' : 'border-slate-200 bg-white text-slate-500'}`}>
                <User className={`h-5 w-5 ${role === 'JOB_SEEKER' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs">Job Seeker</span>
              </button>
              <button type="button" onClick={() => setRole('RECRUITER')} className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-24 cursor-pointer ${role === 'RECRUITER' ? 'border-emerald-600 bg-emerald-50/30 text-slate-900 font-bold' : 'border-slate-200 bg-white text-slate-500'}`}>
                <Briefcase className={`h-5 w-5 ${role === 'RECRUITER' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs">Recruiter</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400" placeholder="name@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer mt-2 flex items-center justify-center gap-2">
            Create Account <UserCheck className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already registered? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}