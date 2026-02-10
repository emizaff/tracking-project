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
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/40 relative overflow-hidden group border border-white/10">
        
        {/* Dekorasi Background (Glow Effect) */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:translate-x-8 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
                <div className="flex items-center gap-1.5 mb-1 text-indigo-200">
                    <Trophy size={14} className="text-yellow-300" />
                    <p className="text-xs font-bold uppercase tracking-wider">Rank User</p>
                </div>
                
                <h2 className="text-3xl font-black tracking-tight mb-1">
                    Level {level}
                </h2>
                <p className="text-sm text-indigo-100 font-medium opacity-90">Halo, {username || "Pejuang"}!</p>
            </div>
            
            {/* XP Badge */}
            <div className="text-right bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
                <div className="flex items-end justify-end gap-1">
                    <span className="text-2xl font-black text-yellow-300 drop-shadow-sm">{currentLevelXp}</span>
                    <span className="text-[10px] font-bold text-indigo-100 mb-1">/ 100 XP</span>
                </div>
            </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="relative">
            <div className="flex justify-between text-[10px] font-bold text-indigo-200 mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1"><Sparkles size={10} /> Progress</span>
                <span>{progressPercent}%</span>
            </div>
            
            <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
                <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)] transition-all duration-1000 ease-out relative"
                    style={{ width: `${progressPercent}%` }}
                >
                    {/* Efek Kilau */}
                    <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/40 to-transparent"></div>
                </div>
            </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 flex items-center gap-2 text-xs text-indigo-200 bg-indigo-800/30 p-2.5 rounded-lg border border-indigo-500/30">
            <Zap size={14} className="text-yellow-400 fill-yellow-400 shrink-0" />
            <span>
                Selesaikan <span className="text-white font-bold">{Math.ceil((100 - currentLevelXp) / 10)} task</span> lagi untuk level up!
            </span>
        </div>
    </div>
  );
}