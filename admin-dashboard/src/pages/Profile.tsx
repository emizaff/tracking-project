import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackingService } from '../services/trackingService';
import BackupModal from '../components/BackupModal';
import { 
    ChevronLeft, 
    Save, 
    Flame, 
    BookOpen, 
    Trophy, 
    User,
    Shield,
    LogOut // 👇 Tambah Icon Logout
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<any>(null);
  const [backupOpen, setBackupOpen] = useState(false);

  useEffect(() => {
    const fetchLevel = async () => {
        try {
            const data = await TrackingService.getUserLevel();
            setLevel(data);
        } catch (e) { console.error(e); }
    };
    fetchLevel();
  }, []);

  // 👇 Fungsi Logout
  const handleLogout = async () => {
    const confirm = window.confirm("Yakin mau logout?");
    if (!confirm) return;

    try {
        await fetch('http://localhost:3000/auth/logout', { 
            method: 'POST',
            credentials: 'include' // PENTING: Bawa cookie biar server tau siapa yg logout
        });
        window.location.href = '/'; // Balik ke Login
    } catch (error) {
        console.error("Gagal logout", error);
    }
  };

  if (!level) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="text-sm font-bold">Memuat Profil...</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 flex items-center justify-center font-sans">
        {/* Render Modal Backup */}
        <BackupModal isOpen={backupOpen} onClose={() => setBackupOpen(false)} onSuccess={() => alert('Data berhasil direstore!')} />

        <div className="max-w-md w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 relative">
            
            {/* Header Gradient */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 text-center text-white relative">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition text-white/80 hover:text-white backdrop-blur-sm"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* 👇 Logout Button (Baru) */}
                <button 
                    onClick={handleLogout} 
                    className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition text-red-200 hover:text-white backdrop-blur-sm"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
                
                {/* Avatar */}
                <div className="relative w-28 h-28 mx-auto mb-4">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-full h-full rounded-full ring-4 ring-slate-800 shadow-2xl bg-slate-700 flex items-center justify-center overflow-hidden">
                        {level.picture ? (
                            <img src={level.picture} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <User size={48} className="text-slate-400" />
                        )}
                    </div>
                    {/* Badge Level */}
                    <div className="absolute bottom-0 right-0 bg-yellow-500 text-yellow-900 text-xs font-black px-2 py-1 rounded-full border-2 border-slate-800 flex items-center gap-1 shadow-lg">
                        <Trophy size={10} />
                        <span>Lv.{level.level}</span>
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-white tracking-tight">{level.username || "User"}</h1>
                <p className="text-indigo-200 text-sm font-medium">{level.email}</p>
            </div>

            {/* Stats Body */}
            <div className="p-8 space-y-8">
                
                {/* XP Progress */}
                <div>
                    <div className="flex justify-between text-sm font-bold mb-2 text-slate-300">
                        <span>Level Progress</span>
                        <span className="text-indigo-400">{level.xp} / {level.level * 100} XP</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" style={{ width: `${Math.min((level.xp / (level.level * 100)) * 100, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                        Butuh <span className="text-white font-bold">{Math.max(0, (level.level * 100) - level.xp)} XP</span> lagi untuk level up! 🚀
                    </p>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-2xl text-center border border-slate-700/50 hover:border-indigo-500/30 transition group">
                        <div className="w-10 h-10 mx-auto bg-orange-900/20 text-orange-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition">
                            <Flame size={20} />
                        </div>
                        <span className="text-sm font-bold text-slate-300">Streak Master</span>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-2xl text-center border border-slate-700/50 hover:border-indigo-500/30 transition group">
                        <div className="w-10 h-10 mx-auto bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-sm font-bold text-slate-300">Scholar</span>
                    </div>
                </div>

                {/* Settings / Backup */}
                <div className="pt-6 border-t border-slate-700">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Shield size={12} /> Pengaturan Data
                    </h3>
                    <button 
                        onClick={() => setBackupOpen(true)}
                        className="w-full py-3.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/10 group"
                    >
                        <Save size={18} className="text-indigo-400 group-hover:text-white transition" />
                        Backup & Restore Data
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}