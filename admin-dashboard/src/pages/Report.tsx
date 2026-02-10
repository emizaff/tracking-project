// src/pages/Report.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackingService } from '../services/trackingService';
import type { Project } from '../types';
import { 
    ChevronLeft, 
    Clock, 
    CheckCircle2, 
    PieChart, 
    Layout,
    AlertTriangle 
} from 'lucide-react';

export default function Report() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await TrackingService.getProjects();
        setProjects(data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="text-sm font-bold">Memuat Laporan...</span>
        </div>
    </div>
  );

  // --- LOGIKA HITUNG STATISTIK ---
  const allTasks = projects.flatMap(p => p.tasks);
  
  const activeProjects = projects.filter(p => p.tasks.some(t => !t.isCompleted)).length;
  
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.isCompleted).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalSpentSeconds = allTasks.reduce((acc, t) => acc + (t.spentTime || 0), 0);
  const totalHours = (totalSpentSeconds / 3600).toFixed(1);

  // Pending Tasks untuk section bawah
  const pendingTasksList = allTasks.filter(t => !t.isCompleted);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans pb-32">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => navigate('/dashboard')} 
                className="p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white hover:border-slate-600 transition text-slate-400"
            >
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="text-3xl font-extrabold text-white">Laporan Lengkap</h1>
                <p className="text-slate-400 text-sm">Analisis performa produktivitasmu.</p>
            </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition"><Clock size={64} /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Fokus</p>
                <p className="text-3xl font-black text-indigo-400">{totalHours} <span className="text-sm font-normal text-slate-500">Jam</span></p>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition"><CheckCircle2 size={64} /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Task Selesai</p>
                <p className="text-3xl font-black text-green-400">{completedTasks} <span className="text-sm font-normal text-slate-500">/ {totalTasks}</span></p>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition"><PieChart size={64} /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Penyelesaian</p>
                <p className="text-3xl font-black text-blue-400">{completionRate}%</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition"><Layout size={64} /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project Aktif</p>
                <p className="text-3xl font-black text-orange-400">{activeProjects}</p>
            </div>
        </div>

        {/* DETAIL BREAKDOWN TABLE */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-700 bg-slate-800/50">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Layout size={18} className="text-indigo-500" /> Rincian Per Project
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900/50 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Project</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Task (Done/Total)</th>
                            <th className="px-6 py-4 text-right">Waktu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">Belum ada data project.</td>
                            </tr>
                        ) : (
                            projects.map(p => {
                                const done = p.tasks.filter(t => t.isCompleted).length;
                                const total = p.tasks.length;
                                const time = Math.round(p.tasks.reduce((acc, t) => acc + (t.spentTime || 0), 0) / 60);
                                const isDone = done === total && total > 0;

                                return (
                                    <tr key={p.id} className="hover:bg-slate-700/30 transition group">
                                        <td className="px-6 py-4 font-bold text-slate-300 group-hover:text-white">{p.title}</td>
                                        <td className="px-6 py-4 text-center">
                                            {isDone ? 
                                                <span className="bg-green-900/30 text-green-400 border border-green-900/50 px-2 py-1 rounded text-xs font-bold">Selesai</span> : 
                                                <span className="bg-blue-900/30 text-blue-400 border border-blue-900/50 px-2 py-1 rounded text-xs font-bold">Berjalan</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-400">
                                            <b className="text-white">{done}</b> <span className="text-slate-600">/ {total}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-indigo-300">{time} m</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* UNFINISHED BUSINESS */}
        <div>
            <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" /> Task Belum Dikerjakan (Pending)
            </h3>
            
            {pendingTasksList.length === 0 ? (
                <div className="p-8 text-center bg-slate-800 rounded-2xl border border-dashed border-slate-700 text-slate-500">
                    Wah, semua task sudah selesai! Hebat! 🎉
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingTasksList.slice(0, 9).map(t => (
                        <div key={t.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm flex justify-between items-center hover:border-slate-600 transition">
                            <span className="text-slate-300 font-medium truncate text-sm">{t.title}</span>
                            <span className="text-[10px] bg-slate-900 px-2 py-1 rounded text-slate-500 border border-slate-800">Pending</span>
                        </div>
                    ))}
                    {pendingTasksList.length > 9 && (
                        <div className="flex items-center justify-center text-slate-500 text-xs italic p-4">
                            Dan {pendingTasksList.length - 9} task lainnya...
                        </div>
                    )}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}