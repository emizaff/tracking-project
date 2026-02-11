// src/components/SmartTaskInput.tsx
import React, { useState } from 'react';
import { TrackingService } from '../services/trackingService';
import { Plus, Clock, Target, Repeat, Calendar, CheckSquare } from 'lucide-react';

interface Props {
  projectId: number;
  onTaskCreated: () => void;
  projectStartDate?: string;
  projectDeadline?: string; 
}

export default function SmartTaskInput({ projectId, onTaskCreated, projectDeadline }: Props) {
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<'SIMPLE' | 'ADVANCED'>('SIMPLE');
  
  // State Advanced
  const [targetCount, setTargetCount] = useState(1);
  const [duration, setDuration] = useState(0);
  
  // State Recurring
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("DAILY");
  const [repeatInterval] = useState(1);

  // Logic Sisa Hari
  const today = new Date();
  const deadlineDate = projectDeadline ? new Date(projectDeadline) : null;
  
  const daysUntilDeadline = deadlineDate 
    ? Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24)) 
    : 999; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await TrackingService.createTask(
        projectId, 
        title, 
        duration, 
        targetCount, 
        isRecurring ? projectDeadline : undefined, 
        isRecurring, 
        isRecurring ? repeatFrequency : undefined, 
        isRecurring ? repeatInterval : 1
      );
      
      // Reset Form
      setTitle("");
      setTargetCount(1);
      setDuration(0);
      setIsRecurring(false);
      setMode('SIMPLE');
      onTaskCreated();
    } catch (error) { console.error(error); }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg animate-in fade-in zoom-in duration-200">
      
      {/* 1. INPUT JUDUL (SELALU MUNCUL) */}
      <form onSubmit={handleSubmit}>
          <div className="relative">
              <input 
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-[#f01036] transition mb-2"
                placeholder="✍️ Tulis nama task baru..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
              />
          </div>

          {/* TOGGLE MODE */}
          {mode === 'SIMPLE' ? (
             <div className="flex justify-between items-center">
                <button 
                    type="button" 
                    onClick={() => setMode('ADVANCED')}
                    className="text-xs text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1 transition"
                >
                    <Plus size={12} /> Tambah Detail (Target/Rutin)
                </button>
                <button type="submit" className="bg-white text-slate-900 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition shadow-sm">
                    Simpan
                </button>
             </div>
          ) : (
             <div className="space-y-4 border-t border-slate-700 pt-4 mt-1">
                
                {/* 2. OPSI TARGET (COUNTER & DURASI) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                            <Target size={10} /> Target (Counter)
                        </label>
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
                            <button type="button" onClick={() => setTargetCount(Math.max(1, targetCount - 1))} className="w-8 h-8 bg-slate-800 rounded hover:bg-slate-700 font-bold text-slate-400 hover:text-white transition">-</button>
                            <span className="flex-1 text-center text-sm font-bold text-white">{targetCount}x</span>
                            <button type="button" onClick={() => setTargetCount(targetCount + 1)} className="w-8 h-8 bg-indigo-600 rounded hover:bg-indigo-500 font-bold text-white transition shadow-sm shadow-indigo-500/50">+</button>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1 italic">Contoh: 10x Pushup</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                            <Clock size={10} /> Durasi (Menit)
                        </label>
                        <input 
                            type="number" min="0" 
                            value={duration} onChange={e => setDuration(parseInt(e.target.value))}
                            className="w-full text-sm font-bold text-center border border-slate-700 bg-slate-900 text-white rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                        />
                         <p className="text-[9px] text-slate-500 mt-1 italic">0 = Tidak ada timer</p>
                    </div>
                </div>

                {/* 3. OPSI RUTIN */}
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox" 
                                id="isRecurring"
                                checked={isRecurring} 
                                onChange={e => setIsRecurring(e.target.checked)}
                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-800 checked:bg-indigo-600 checked:border-indigo-600 focus:ring-offset-0 focus:ring-0 transition-all"
                            />
                            <CheckSquare size={12} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <label htmlFor="isRecurring" className="text-xs font-bold text-slate-300 select-none cursor-pointer flex items-center gap-1.5">
                            <Repeat size={12} className="text-purple-400" /> Jadikan Tugas Rutin?
                        </label>
                    </div>

                    {isRecurring && (
                        <div className="pl-7 animate-in slide-in-from-top-1 space-y-2">
                             <select 
                                 value={repeatFrequency}
                                 onChange={e => setRepeatFrequency(e.target.value)}
                                 className="w-full text-xs border border-slate-600 rounded-lg p-2 bg-slate-800 text-white focus:outline-none focus:border-indigo-500"
                             >
                                 <option value="DAILY">Harian (Tiap Hari)</option>
                                 {daysUntilDeadline > 7 && <option value="WEEKLY">Mingguan (Tiap Minggu)</option>}
                                 {daysUntilDeadline > 30 && <option value="MONTHLY">Bulanan (Tiap Bulan)</option>}
                             </select>
                             
                             {daysUntilDeadline <= 7 && (
                                 <p className="text-[10px] text-orange-400 italic">
                                     ⚠️ Opsi mingguan disembunyikan (Deadline mepet).
                                 </p>
                             )}
                             <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                 <Calendar size={10} /> Stop otomatis: {deadlineDate ? deadlineDate.toLocaleDateString('id-ID') : '...'}
                             </p>
                        </div>
                    )}
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-700">
                    <button type="button" onClick={() => setMode('SIMPLE')} className="text-xs text-slate-400 hover:text-white px-2 transition">Batal</button>
                    <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition">
                        Simpan Task
                    </button>
                </div>
             </div>
          )}
      </form>
    </div>
  );
}