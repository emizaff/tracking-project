// src/components/PublicGoalList.tsx
import React, { useEffect, useState } from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

const API_URL = "http://localhost:3000";

export default function PublicGoalList() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/public/goals`)
      .then(res => res.json())
      .then(data => { setGoals(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-slate-600 animate-pulse">Memuat Goals...</div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
        {goals.map((g: any) => {
            const percent = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
            const isCompleted = g.isCompleted || percent >= 100;
            
            return (
                <div key={g.id} className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition duration-300 relative overflow-hidden">
                    <div className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${percent}%` }}></div>
                    
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">{g.title}</h3>
                        <span className="text-xs font-mono font-bold bg-slate-900 px-2 py-1 rounded text-slate-400 border border-slate-700">
                            {percent}%
                        </span>
                    </div>

                    <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mt-4">
                        <span>Current: {g.currentValue}</span>
                        <span>Target: {g.targetValue} {g.unit}</span>
                    </div>
                </div>
            );
        })}
        {goals.length === 0 && <div className="col-span-2 text-center text-slate-500 italic">Belum ada goals publik.</div>}
    </div>
  );
}