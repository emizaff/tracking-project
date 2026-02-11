// src/components/ProductivityChart.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface Props {
  data: { name: string; total: number }[];
}

export default function ProductivityChart({ data }: Props) {
  // Hitung total tasks
  const totalTasks = data && data.length > 0 ? data.reduce((acc, curr) => acc + curr.total, 0) : 0;

  // Jika data kosong, tampilkan state kosong
  if (!data || data.length === 0 || totalTasks === 0) {
    return (
      <div className="h-full min-h-[250px] bg-[#1A1A1A] rounded-3xl border border-[#333] flex flex-col items-center justify-center text-[#555] p-6 shadow-lg">
        <BarChart2 size={48} className="mb-3 opacity-30 text-[#f01036]" />
        <p className="text-sm font-medium text-[#888]">Belum ada data minggu ini.</p>
        <p className="text-xs">Selesaikan task untuk melihat grafik!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#333] shadow-lg h-full flex flex-col animate-in fade-in duration-500 hover:border-[#f01036]/30 transition-all">
      <div className="mb-2">
        <h3 className="text-[#888] text-[10px] font-bold uppercase tracking-wider mb-1">Produktivitas 7 Hari</h3>
        <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">{totalTasks}</span>
            <span className="text-sm font-bold text-[#666] mb-1.5">Task Selesai</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
            <defs>
              {/* GRADIENT MERAH #f01036 */}
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f01036" stopOpacity={0.3}/> 
                <stop offset="95%" stopColor="#f01036" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Grid Gelap */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 11, fontWeight: 600 }} 
                dy={15} 
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#444', fontSize: 11 }} 
                allowDecimals={false}
            />
            
            {/* Tooltip Dark Mode */}
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#090909', 
                    borderRadius: '12px', 
                    border: '1px solid #333', 
                    color: '#fff',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', 
                    fontSize: '12px', 
                    fontWeight: 'bold' 
                }}
                itemStyle={{ color: '#f01036' }} 
                cursor={{ stroke: '#f01036', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            
            <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#f01036" // MERAH UTAMA
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                animationDuration={1500}
                activeDot={{ r: 6, fill: "#fff", stroke: "#f01036", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}