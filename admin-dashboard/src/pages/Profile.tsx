// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackingService } from '../services/trackingService';
import { AuthService } from '../services/authService'; 
import BackupModal from '../components/BackupModal';
import LogoutModal from '../components/LogoutModal'; 
import { 
  ChevronLeft, 
  Save, 
  Flame, 
  BookOpen, 
  Trophy, 
  User,
  Shield,
  LogOut 
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<any>(null);
  const [backupOpen, setBackupOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false); 

  useEffect(() => {
    const fetchLevel = async () => {
        try {
            const data = await TrackingService.getUserLevel();
            setLevel(data);
        } catch (e) { console.error(e); }
    };
    fetchLevel();
  }, []);

  const handleLogoutConfirm = async () => {
    try {
        await AuthService.logout(); 
        window.location.href = '/login'; 
    } catch (error) {
        console.error("Gagal logout", error);
        alert("Gagal logout, coba refresh halaman.");
    }
  };

  if (!level) return (
    <div className="min-h-screen bg-[#090909] flex items-center justify-center text-[#666] font-sans">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f01036]"></div>
            <span className="text-sm font-bold">Memuat Profil...</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#090909] p-4 flex items-center justify-center font-sans">
        
        <BackupModal isOpen={backupOpen} onClose={() => setBackupOpen(false)} onSuccess={() => alert('Data berhasil direstore!')} />

        <LogoutModal 
            isOpen={logoutOpen} 
            onClose={() => setLogoutOpen(false)} 
            onConfirm={handleLogoutConfirm} 
        />

        <div className="max-w-md w-full bg-[#1A1A1A] rounded-3xl shadow-2xl overflow-hidden border border-[#333] relative">
            
            {/* Header */}
            <div className="bg-[#222] p-8 text-center text-white relative border-b border-[#333]">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="absolute top-4 left-4 p-2 bg-[#1A1A1A] hover:bg-[#333] rounded-full transition text-[#888] hover:text-white border border-[#333]"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Logout Button */}
                <button 
                    onClick={() => setLogoutOpen(true)} 
                    className="absolute top-4 right-4 p-2 bg-red-900/20 hover:bg-red-900/40 rounded-full transition text-red-400 hover:text-red-300 border border-red-900/30"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
                
                {/* Avatar */}
                <div className="relative w-28 h-28 mx-auto mb-4">
                    <div className="absolute inset-0 bg-[#f01036] rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <div className="relative w-full h-full rounded-full ring-4 ring-[#1A1A1A] shadow-2xl bg-[#333] flex items-center justify-center overflow-hidden">
                        {level.picture ? (
                            <img src={level.picture} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <User size={48} className="text-[#666]" />
                        )}
                    </div>
                    {/* Badge Level */}
                    <div className="absolute bottom-0 right-0 bg-[#f01036] text-white text-xs font-black px-2 py-1 rounded-full border-2 border-[#1A1A1A] flex items-center gap-1 shadow-lg">
                        <Trophy size={10} />
                        <span>Lv.{level.level}</span>
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-white tracking-tight">{level.username || "User"}</h1>
                <p className="text-[#888] text-sm font-medium">{level.email}</p>
            </div>

            {/* Stats Body */}
            <div className="p-8 space-y-8">
                
                {/* XP Progress */}
                <div>
                    <div className="flex justify-between text-sm font-bold mb-2 text-[#ccc]">
                        <span>Level Progress</span>
                        <span className="text-[#f01036]">{level.xp} / {level.level * 100} XP</span>
                    </div>
                    <div className="w-full h-3 bg-[#000] rounded-full overflow-hidden border border-[#333]">
                        <div className="h-full bg-gradient-to-r from-[#d00e2e] to-[#f01036] transition-all duration-1000 shadow-[0_0_10px_rgba(240,16,54,0.5)]" style={{ width: `${Math.min((level.xp / (level.level * 100)) * 100, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-[#666] mt-2 text-center">
                        Butuh <span className="text-white font-bold">{Math.max(0, (level.level * 100) - level.xp)} XP</span> lagi untuk level up! 🚀
                    </p>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#222] rounded-2xl text-center border border-[#333] hover:border-[#f01036]/30 transition group">
                        <div className="w-10 h-10 mx-auto bg-orange-900/20 text-orange-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition">
                            <Flame size={20} />
                        </div>
                        <span className="text-sm font-bold text-[#ccc]">Streak Master</span>
                    </div>
                    <div className="p-4 bg-[#222] rounded-2xl text-center border border-[#333] hover:border-[#f01036]/30 transition group">
                        <div className="w-10 h-10 mx-auto bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-sm font-bold text-[#ccc]">Scholar</span>
                    </div>
                </div>

                {/* Settings / Backup */}
                <div className="pt-6 border-t border-[#333]">
                    <h3 className="text-xs font-bold text-[#666] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Shield size={12} /> Pengaturan Data
                    </h3>
                    <button 
                        onClick={() => setBackupOpen(true)}
                        className="w-full py-3.5 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg border border-[#333] group"
                    >
                        <Save size={18} className="text-[#f01036] group-hover:text-white transition" />
                        Backup & Restore Data
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}