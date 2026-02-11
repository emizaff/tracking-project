// src/components/LevelWidget.tsx
import { Trophy, Zap, Sparkles } from 'lucide-react';

interface Props {
  level: number;
  xp: number;
  username: string;
}

export default function LevelWidget({ level, xp, username }: Props) {
  // Hitung Progress Bar (XP modulo 100)
  const currentLevelXp = xp % 100;
  const progressPercent = currentLevelXp; 

  return (
    // 🔥 UBAH: Background Dark #1A1A1A, Border #333, Shadow Merah Tipis
    <div className="bg-[#1A1A1A] rounded-3xl p-6 text-white shadow-xl shadow-black/50 relative overflow-hidden group border border-[#333] hover:border-[#f01036]/30 transition-all duration-500">
        
        {/* Dekorasi Background (Red Glow Effect) */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#f01036]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 group-hover:bg-[#f01036]/20 transition-all duration-1000"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
                <div className="flex items-center gap-1.5 mb-1 text-[#f01036]">
                    <Trophy size={14} className="text-[#f01036] fill-[#f01036]/20" />
                    <p className="text-xs font-bold uppercase tracking-wider">Rank User</p>
                </div>
                
                <h2 className="text-3xl font-black tracking-tight mb-1 text-white">
                    Level {level}
                </h2>
                <p className="text-sm text-[#888] font-medium">Halo, <span className="text-white">{username || "Pejuang"}</span>!</p>
            </div>
            
            {/* XP Badge */}
            <div className="text-right bg-[#090909] px-3 py-2 rounded-xl border border-[#333] shadow-sm">
                <div className="flex items-end justify-end gap-1">
                    {/* Angka XP Merah/Putih */}
                    <span className="text-2xl font-black text-white drop-shadow-sm">{currentLevelXp}</span>
                    <span className="text-[10px] font-bold text-[#666] mb-1">/ 100 XP</span>
                </div>
            </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="relative">
            <div className="flex justify-between text-[10px] font-bold text-[#888] mb-2 uppercase tracking-wider">
                <span className="flex items-center gap-1"><Sparkles size={10} className="text-[#f01036]" /> Progress</span>
                <span className="text-white">{progressPercent}%</span>
            </div>
            
            {/* Track Background */}
            <div className="h-3 bg-[#000] rounded-full overflow-hidden border border-[#333]">
                <div 
                    // 🔥 UBAH: Gradient Merah (#f01036)
                    className="h-full bg-gradient-to-r from-[#d00e2e] to-[#f01036] rounded-full shadow-[0_0_15px_rgba(240,16,54,0.5)] transition-all duration-1000 ease-out relative"
                    style={{ width: `${progressPercent}%` }}
                >
                    {/* Efek Kilau Putih Tipis */}
                    <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/20 to-transparent"></div>
                </div>
            </div>
        </div>

        {/* Footer Info */}
        <div className="mt-5 flex items-center gap-3 text-xs text-[#aaa] bg-[#222] p-3 rounded-xl border border-[#333] group-hover:border-[#f01036]/30 transition-colors">
            <div className="bg-[#f01036]/20 p-1.5 rounded-full text-[#f01036]">
                <Zap size={14} className="fill-current" />
            </div>
            <span>
                Selesaikan <span className="text-white font-bold">{Math.ceil((100 - currentLevelXp) / 10)} task</span> lagi untuk level up!
            </span>
        </div>
    </div>
  );
}