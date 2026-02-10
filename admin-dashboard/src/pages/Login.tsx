// admin-dashboard/src/pages/Login.tsx
import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config'; // Pastikan import ini ada

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Email atau password salah");
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- CARD CONTAINER --- */}
      <div className="w-full max-w-md relative z-10 p-6">
        
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* 🔥 HEADER AREA - LOGO LANGSUNG 🔥 */}
          <div className="p-8 text-center border-b border-slate-800/50 pb-6">
            {/* Kotak gradasi DIHAPUS. Langsung img gede di tengah */}
            <img 
                src="/Logo4.ico" 
                alt="Logo" 
                className="w-24 h-24 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
            />
            
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
              Tracking Project
            </h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
              Admin Control Center
            </p>
          </div>

          {/* CONTENT AREA */}
          <div className="p-8 pt-6">
            
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* FORM LOGIN MANUAL */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Masuk Sekarang <ArrowRight size={18} /></>}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-[#141d2e] px-3 text-slate-500">Atau lanjut dengan</span>
              </div>
            </div>

            {/* TOMBOL GOOGLE */}
            <button
              onClick={handleGoogleLogin}
              className="w-full group relative flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3.5 px-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01] active:scale-95 border border-slate-200"
            >
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                className="w-5 h-5 transition-transform group-hover:rotate-12" 
                alt="Google" 
              />
              <span>Google Account</span>
            </button>

            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold opacity-60">
              <Lock size={10} />
              <span>Secure Admin Area</span>
            </div>

          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        </div>

        {/* Copyright */}
        <p className="text-center text-slate-600 text-[10px] mt-6 font-medium">
            &copy; {new Date().getFullYear()} Tracking Project. Created by <span className="text-indigo-500 font-bold">Muhammad Faiq Hudzaifah</span>.
        </p>

      </div>
    </div>
  );
}