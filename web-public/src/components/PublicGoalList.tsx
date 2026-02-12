import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function PublicGoalList() {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/tracking/public/goals')
            .then(res => setGoals(res.data))
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-[#333] italic text-sm">Synchronizing loot...</div>;

    return (
        <div className="space-y-6">
            {goals.length === 0 ? (
                <div className="text-[#444] text-sm">Belum ada target jajan.</div>
            ) : (
                goals.map((g: any) => {
                    const percent = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
                    return (
                        <div key={g.id} className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-[#ccc]">{g.title}</span>
                                <span className="text-[10px] font-black text-[#f01036] tabular-nums">{percent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden border border-[#222]">
                                <div 
                                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000" 
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}