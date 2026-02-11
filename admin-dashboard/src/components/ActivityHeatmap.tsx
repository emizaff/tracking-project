// src/components/ActivityHeatmap.tsx

import { Flame } from 'lucide-react'; 

interface Props {
  data: { [date: string]: number }; 
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

  // 🔥 Helper Warna (RED HEATMAP)
  const getColor = (count: number) => {
    if (count === 0) return 'bg-[#222] border-[#333]'; // Kosong (Dark Grey)
    if (count <= 2) return 'bg-[#7f1d1d] border-[#991b1b]';  // Dikit (Red 900)
    if (count <= 5) return 'bg-[#dc2626] border-[#ef4444]';  // Sedang (Red 600)
    return 'bg-[#f01036] border-[#fb7185] shadow-[0_0_8px_rgba(240,16,54,0.6)]'; // Banyak (Neon Red + Glow)
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
    // 🔥 UBAH: Background Dark #1A1A1A
    <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-[#333] shadow-lg overflow-x-auto hover:border-[#f01036]/30 transition-all duration-300">
      <div className="flex justify-between items-end mb-4">
        <div>
            <h3 className="font-extrabold text-white flex items-center gap-2">
                <Flame className="text-[#f01036] fill-[#f01036]" size={18} /> Konsistensi
            </h3>
            <p className="text-xs text-[#888]">Jangan biarkan ada hari yang bolong!</p>
        </div>
        
        {/* Legenda Warna (Merah) */}
        <div className="flex items-center gap-2 text-[10px] text-[#666]">
            <span>Santai</span>
            <div className="w-3 h-3 bg-[#222] rounded-sm border border-[#333]"></div>
            <div className="w-3 h-3 bg-[#7f1d1d] rounded-sm border border-[#991b1b]"></div>
            <div className="w-3 h-3 bg-[#dc2626] rounded-sm border border-[#ef4444]"></div>
            <div className="w-3 h-3 bg-[#f01036] rounded-sm border border-[#fb7185] shadow-sm shadow-[#f01036]/50"></div>
            <span>Keras</span>
        </div>
      </div>

      {/* HEATMAP GRID */}
      <div className="flex gap-1 min-w-max">
        {/* Label Hari */}
        <div className="flex flex-col gap-1 mr-2 pt-6">
            <span className="text-[9px] text-transparent h-3"></span>
            <span className="text-[9px] text-[#666] h-3 leading-3 font-bold">Sen</span>
            <span className="text-[9px] text-transparent h-3"></span>
            <span className="text-[9px] text-[#666] h-3 leading-3 font-bold">Rab</span>
            <span className="text-[9px] text-transparent h-3"></span>
            <span className="text-[9px] text-[#666] h-3 leading-3 font-bold">Jum</span>
            <span className="text-[9px] text-transparent h-3"></span>
        </div>

        {/* Grid Kotak-kotak */}
        <div className="flex flex-col">
            {/* Label Bulan */}
            <div className="flex relative h-5 mb-1">
                {getMonthLabels().map((m, i) => (
                    <span 
                        key={i} 
                        className="text-[10px] font-bold text-[#666] absolute"
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