// src/components/ProductivityChart.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface Props {
  data: { name: string; total: number }[];
}

export default function ProductivityChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full min-h-[250px] bg-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center justify-center text-slate-500 p-6 shadow-lg">
        <BarChart2 size={48} className="mb-3 opacity-50" />
        <p className="text-sm font-medium text-slate-400">Belum ada data minggu ini.</p>
        <p className="text-xs">Selesaikan task untuk melihat grafik!</p>
      </div>
    );
  }

  const totalTasks = data.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-2">
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Produktivitas 7 Hari</h3>
        <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">{totalTasks}</span>
            <span className="text-sm font-bold text-slate-400 mb-1.5">Task Selesai</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/> {/* Indigo Glow */}
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Grid Gelap */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                dy={15} 
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                allowDecimals={false}
            />
            
            {/* Tooltip Dark Mode */}
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#0f172a', // Slate-950
                    borderRadius: '12px', 
                    border: '1px solid #334155', // Slate-700
                    color: '#f8fafc',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', 
                    fontSize: '12px', 
                    fontWeight: 'bold' 
                }}
                itemStyle={{ color: '#818cf8' }} // Text Indigo Light
                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            
            <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#6366f1" // Indigo-500
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}