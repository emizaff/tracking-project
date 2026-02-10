// src/components/ActivityHeatmap.tsx
import React from 'react';
import { Flame } from 'lucide-react'; // Gunakan icon Lucide

interface Props {
  data: { [date: string]: number }; // Format: { "2026-01-28": 5 }
}

export default function ActivityHeatmap({ data }: Props) {
  // Generate 120 hari terakhir
  const daysToRender = 120;
  const today = new Date();
  
  const dates = Array.from({ length: daysToRender }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (daysToRender - 1 - i));
    return d;
  });

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  dates.forEach((date) => {
    if (date.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(date);
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  // 🔥 Helper Warna (Dark Mode Version)
  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-700 border-slate-600'; // Kosong (Dark Grey)
    if (count <= 2) return 'bg-green-900 border-green-800';  // Dikit (Dark Green)
    if (count <= 5) return 'bg-green-600 border-green-500';  // Sedang (Green)
    return 'bg-green-400 border-green-300 shadow-[0_0_8px_rgba(74,222,128,0.6)]'; // Banyak (Neon Green + Glow)
  };

  const getMonthLabels = () => {
    const months: { name: string; index: number }[] = [];
    weeks.forEach((week, i) => {
      const firstDay = week[0];
      const monthName = firstDay.toLocaleString('id-ID', { month: 'short' });
      if (!months.find(m => m.name === monthName)) {
        months.push({ name: monthName, index: i });
      }
    });
    return months;
  };

  return (
    <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-lg overflow-x-auto">
      <div className="flex justify-between items-end mb-4">
        <div>
            <h3 className="font-extrabold text-white flex items-center gap-2">
                <Flame className="text-orange-500 fill-orange-500" size={18} /> Konsistensi
            </h3>
            <p className="text-xs text-slate-400">Jangan biarkan ada hari yang bolong!</p>
        </div>
        
        {/* Legenda Warna */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>Santai</span>
            <div className="w-3 h-3 bg-slate-700 rounded-sm border border-slate-600"></div>
            <div className="w-3 h-3 bg-green-900 rounded-sm border border-green-800"></div>
            <div className="w-3 h-3 bg-green-600 rounded-sm border border-green-500"></div>
            <div className="w-3 h-3 bg-green-400 rounded-sm border border-green-300 shadow-sm shadow-green-400/50"></div>
            <span>Keras</span>
        </div>
      </div>

      {/* HEATMAP GRID */}
      <div className="flex gap-1 min-w-max">
        {/* Label Hari */}
        <div className="flex flex-col gap-1 mr-2 pt-6">
            <span className="text-[9px] text-transparent h-3"></span>
            <span className="text-[9px] text-slate-500 h-3 leading-3 font-bold">Sen</span>
            <span className="text-[9px] text-transparent h-3"></span>
            <span className="text-[9px] text-slate-500 h-3 leading-3 font-bold">Rab</span>
            <span className="text-[9px] text-transparent h-3"></span>
            <span className="text-[9px] text-slate-500 h-3 leading-3 font-bold">Jum</span>
            <span className="text-[9px] text-transparent h-3"></span>
        </div>

        {/* Grid Kotak-kotak */}
        <div className="flex flex-col">
            {/* Label Bulan */}
            <div className="flex relative h-5 mb-1">
                {getMonthLabels().map((m, i) => (
                    <span 
                        key={i} 
                        className="text-[10px] font-bold text-slate-400 absolute"
                        style={{ left: `${m.index * 14}px` }} 
                    >
                        {m.name}
                    </span>
                ))}
            </div>

            <div className="flex gap-1">
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="flex flex-col gap-1">
                        {week.map((day) => {
                            const dateStr = day.toISOString().split('T')[0];
                            const count = data[dateStr] || 0;
                            return (
                                <div 
                                    key={dateStr}
                                    className={`w-3 h-3 rounded-sm border transition-all hover:scale-150 hover:z-10 cursor-pointer ${getColor(count)}`}
                                    title={`${new Date(dateStr).toLocaleDateString('id-ID', { dateStyle: 'full' })}: ${count} Task`}
                                ></div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}