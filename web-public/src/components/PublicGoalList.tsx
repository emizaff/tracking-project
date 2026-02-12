import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function PublicGoalList() {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Pake getPublic dan path /public/goals (bukan /tracking/public)
        api.getPublic('/public/goals')
            .then((res: any) => {
                if (Array.isArray(res)) setGoals(res);
                else if (res?.data && Array.isArray(res.data)) setGoals(res.data);
                else setGoals([]);
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center space-x-2 text-[#444] italic text-sm py-4">
            <span className="w-2 h-2 bg-[#f01036] rounded-full animate-pulse"></span>
            <span>Synchronizing loot...</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#f01036]">Side</span> Quests
            </h3>
            
            {goals.length === 0 ? (
                <div className="p-4 border border-dashed border-[#333] rounded-xl text-[#666] text-sm text-center">
                    Belum ada target jajan.
                </div>
            ) : (
                goals.map((g: any) => {
                    const percent = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
                    return (
                        <div key={g.id} className="space-y-2 group">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-[#ccc] group-hover:text-white transition-colors">
                                    {g.title}
                                </span>
                                <span className="text-xs font-black text-[#f01036] tabular-nums bg-[#f01036]/10 px-1.5 py-0.5 rounded border border-[#f01036]/20">
                                    {percent}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden border border-[#222]">
                                <div 
                                    className="h-full bg-[#f01036] shadow-[0_0_10px_rgba(240,16,54,0.6)] transition-all duration-1000 ease-out" 
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-[#555]">
                                <span>Rp {parseInt(g.currentValue).toLocaleString('id-ID')}</span>
                                <span>Target: Rp {parseInt(g.targetValue).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}