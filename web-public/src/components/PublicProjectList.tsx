import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

// Definisikan tipe data agar coding lebih enak
interface Task {
  id: number;
  isCompleted: boolean;
}

interface Project {
  id: number;
  title: string;
  tasks: Task[];
}

export default function PublicProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Panggil endpoint /public/projects yang baru dibuat di backend
        api.getPublic('/public/projects')
            .then(res => {
                // Backend mereturn { success: true, data: [...] }
                // Jadi kita ambil res.data
                if (res?.data && Array.isArray(res.data)) {
                    setProjects(res.data);
                } else {
                    console.warn("Format data project salah atau kosong", res);
                    setProjects([]);
                }
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-8 space-x-2 text-purple-400 animate-pulse">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
            <span className="font-mono text-sm ml-2">Menghubungkan ke satelit...</span>
        </div>
    );

    if (projects.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed border-white/10 rounded-3xl bg-white/5">
                <p className="text-slate-400">Belum ada proyek yang dipublikasikan.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => {
                const total = p.tasks?.length || 0;
                const done = p.tasks?.filter((t) => t.isCompleted).length || 0;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                const isFinished = percent === 100;

                return (
                    <div key={p.id} className="group relative bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                        
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold text-lg text-slate-200 group-hover:text-purple-400 transition-colors duration-300">
                                {p.title}
                            </h3>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${
                                isFinished 
                                ? 'text-green-400 bg-green-400/10 border-green-400/20' 
                                : 'text-purple-400 bg-purple-400/10 border-purple-400/20'
                            }`}>
                                {percent}%
                            </span>
                        </div>
                        
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-5">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)] ${isFinished ? 'bg-green-500' : 'bg-purple-600'}`} 
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${isFinished ? 'bg-green-500 animate-pulse' : 'bg-purple-500 animate-pulse'}`}></span>
                                <span>{isFinished ? 'Selesai' : 'Sedang Dikerjakan'}</span>
                            </div>
                            <span>{done} / {total} Tasks</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}