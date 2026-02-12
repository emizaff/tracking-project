import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function PublicProjectList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/tracking/public/projects')
            .then(res => setProjects(res.data))
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-[#444] animate-pulse">Memuat data project...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p: any) => {
                const total = p.tasks?.length || 0;
                const done = p.tasks?.filter((t: any) => t.isCompleted).length || 0;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                    <div key={p.id} className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#333] hover:border-[#f01036]/40 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-white group-hover:text-[#f01036] transition">{p.title}</h3>
                            <span className="text-[10px] font-black text-[#f01036] bg-[#f01036]/10 px-2 py-0.5 rounded border border-[#f01036]/20">{percent}%</span>
                        </div>
                        
                        <div className="w-full h-1.5 bg-[#090909] rounded-full overflow-hidden mb-4 border border-[#333]">
                            <div className="h-full bg-[#f01036] transition-all duration-1000 shadow-[0_0_10px_rgba(240,16,54,0.5)]" style={{ width: `${percent}%` }}></div>
                        </div>

                        <div className="flex justify-between text-[10px] font-bold text-[#555] uppercase tracking-wider">
                            <span>Status: {percent === 100 ? '✅ Tamat' : '🔥 Berjalan'}</span>
                            <span>{done}/{total} Task</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}