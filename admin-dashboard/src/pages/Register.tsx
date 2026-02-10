import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    googleId: '',
    picture: ''
  });
  const [loading, setLoading] = useState(false);

  // 👇 OTOMATIS ISI FORM DARI URL (DATA GOOGLE)
  useEffect(() => {
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const googleId = searchParams.get('googleId');
    const picture = searchParams.get('picture');

    if (email) {
      setFormData(prev => ({
        ...prev,
        email: email || '',
        username: name || '',
        googleId: googleId || '',
        picture: picture || ''
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tembak ke Backend untuk simpan user baru
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Gagal daftar");

      // Kalau sukses, lempar ke Dashboard
      window.location.href = '/dashboard'; 
      
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang! 👋</h1>
          <p className="text-slate-400">Selesaikan pendaftaranmu untuk lanjut.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (Read Only) */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
              <input 
                type="email" 
                value={formData.email}
                readOnly
                className="w-full bg-slate-900/50 border border-slate-700 text-slate-400 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500" size={18} />
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Nama Panggilan"
                required
              />
            </div>
          </div>

          {/* Password (Optional jika login Google, tapi bagus buat jaga2) */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase">Buat Password Baru</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Masuk Dashboard <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}