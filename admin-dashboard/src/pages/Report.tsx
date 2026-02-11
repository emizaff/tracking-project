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
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#090909] flex items-center justify-center text-[#666] font-sans">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f01036]"></div>
            <span className="text-sm font-bold text-[#888]">Memuat Laporan...</span>
        </div>
    </div>
  );

  const allTasks = projects.flatMap(p => p.tasks);
  const activeProjects = projects.filter(p => p.tasks.some(t => !t.isCompleted)).length;
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.isCompleted).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalSpentSeconds = allTasks.reduce((acc, t) => acc + (t.spentTime || 0), 0);
  const totalHours = (totalSpentSeconds / 3600).toFixed(1);
  const pendingTasksList = allTasks.filter(t => !t.isCompleted);

  return (
    <div className="min-h-screen bg-[#090909] text-white p-4 md:p-8 font-sans pb-32">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => navigate('/dashboard')} 
                className="p-3 bg-[#1A1A1A] border border-[#333] rounded-xl hover:bg-[#333] hover:text-white transition text-[#888]"
            >
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Laporan Lengkap</h1>
                <p className="text-[#666] text-sm font-medium">Analisis performa produktivitasmu.</p>
            </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#333] shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 text-[#f01036] opacity-5 group-hover:opacity-10 transition"><Clock size={64} /></div>
                <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">Total Fokus</p>
                <p className="text-3xl font-black text-[#f01036]">{totalHours} <span className="text-sm font-normal text-[#444]">Jam</span></p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#333] shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 text-green-500 opacity-5 group-hover:opacity-10 transition"><CheckCircle2 size={64} /></div>
                <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">Task Selesai</p>
                <p className="text-3xl font-black text-green-500">{completedTasks} <span className="text-sm font-normal text-[#444]">/ {totalTasks}</span></p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#333] shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 text-blue-500 opacity-5 group-hover:opacity-10 transition"><PieChart size={64} /></div>
                <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">Penyelesaian</p>
                <p className="text-3xl font-black text-blue-500">{completionRate}%</p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#333] shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 text-orange-500 opacity-5 group-hover:opacity-10 transition"><Layout size={64} /></div>
                <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">Project Aktif</p>
                <p className="text-3xl font-black text-orange-500">{activeProjects}</p>
            </div>
        </div>

        {/* DETAIL BREAKDOWN TABLE */}
        <div className="bg-[#1A1A1A] rounded-3xl border border-[#333] shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-[#333] bg-[#1A1A1A]">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Layout size={18} className="text-[#f01036]" /> Rincian Per Project
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#090909] text-[#666] font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-black">Project</th>
                            <th className="px-6 py-4 text-center font-black">Status</th>
                            <th className="px-6 py-4 text-center font-black">Task (Done/Total)</th>
                            <th className="px-6 py-4 text-right font-black">Waktu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333]">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-[#444] italic font-medium">Belum ada data project untuk dianalisis.</td>
                            </tr>
                        ) : (
                            projects.map(p => {
                                const done = p.tasks.filter(t => t.isCompleted).length;
                                const total = p.tasks.length;
                                const time = Math.round(p.tasks.reduce((acc, t) => acc + (t.spentTime || 0), 0) / 60);
                                const isDone = done === total && total > 0;

                                return (
                                    <tr key={p.id} className="hover:bg-[#222] transition-colors group">
                                        <td className="px-6 py-4 font-bold text-[#ccc] group-hover:text-white">{p.title}</td>
                                        <td className="px-6 py-4 text-center">
                                            {isDone ? 
                                                <span className="bg-green-900/20 text-green-500 border border-green-900/50 px-2 py-1 rounded text-[10px] font-black uppercase">Selesai</span> : 
                                                <span className="bg-[#f01036]/10 text-[#f01036] border border-[#f01036]/20 px-2 py-1 rounded text-[10px] font-black uppercase">Berjalan</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center text-[#666]">
                                            <b className="text-white font-mono">{done}</b> <span className="mx-1">/</span> <span className="font-mono">{total}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-[#f01036] font-bold">{time} m</td>
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
            <h3 className="font-extrabold text-[#ccc] mb-4 flex items-center gap-2 px-1">
                <AlertTriangle size={18} className="text-[#f01036]" /> Task Belum Dikerjakan
            </h3>
            
            {pendingTasksList.length === 0 ? (
                <div className="p-10 text-center bg-[#1A1A1A] rounded-2xl border border-dashed border-[#333] text-[#444] font-bold">
                    Wah, semua task sudah disikat habis! Hebat! 🎉
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingTasksList.slice(0, 9).map(t => (
                        <div key={t.id} className="bg-[#1A1A1A] p-4 rounded-xl border border-[#333] shadow-sm flex justify-between items-center hover:border-[#f01036]/50 transition-all duration-300">
                            <span className="text-[#ccc] font-bold truncate text-sm">{t.title}</span>
                            <span className="text-[9px] bg-[#090909] px-2 py-1 rounded font-black text-[#444] border border-[#333] uppercase tracking-tighter">Pending</span>
                        </div>
                    ))}
                    {pendingTasksList.length > 9 && (
                        <div className="flex items-center justify-center text-[#444] text-xs font-bold italic p-4">
                            + {pendingTasksList.length - 9} task lainnya sedang menunggu...
                        </div>
                    )}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}