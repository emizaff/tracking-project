// src/components/CalendarWidget.tsx
import { useState } from 'react';
import type { Project } from '../types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarWidgetProps {
  onDateClick?: (dateStr: string) => void;
  projects?: Project[];
}

// 🔥 SINKRONISASI WARNA (New Theme Colors)
const getProjectColor = (id: number) => {
  const colors = [
      'bg-[#f01036]', 'bg-orange-600', 'bg-rose-600', 
      'bg-red-600', 'bg-[#d00e2e]', 'bg-[#b00b26]'
  ];
  return colors[id % colors.length];
};

export default function CalendarWidget({ onDateClick, projects = [] }: CalendarWidgetProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = new Date(year, month).toLocaleString('id-ID', { month: 'long' });
  const daysHeader = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date());

  const handleDateClick = (day: number) => {
    const dateObj = new Date(year, month, day);
    const offset = dateObj.getTimezoneOffset() * 60000; 
    const dateStr = new Date(dateObj.getTime() - offset).toISOString().split('T')[0];

    setActiveDate(dateStr);
    if (onDateClick) onDateClick(dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  // --- LOGIC VISUAL PROJECT ---
  const getDayContent = (day: number) => {
     const currentDate = new Date(year, month, day);
     const currentStr = currentDate.toLocaleDateString('en-CA');

     const dayEvents = {
       starts: [] as Project[],
       deadlines: [] as Project[],
       active: [] as Project[]
     };

     projects.forEach(p => {
        if (!p.startDate) return;
        
        const startStr = new Date(p.startDate).toLocaleDateString('en-CA');
        const endStr = p.deadline ? new Date(p.deadline).toLocaleDateString('en-CA') : '2099-12-31';

        // 🔥 Logic Deteksi Start Date
        if (startStr === currentStr) dayEvents.starts.push(p);
        
        // Logic Deadline
        if (p.deadline && endStr === currentStr) dayEvents.deadlines.push(p);
        
        // Logic Active Range
        if (currentStr >= startStr && currentStr <= endStr) {
            dayEvents.active.push(p);
        }
     });

     return dayEvents;
  };

  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    // 🔥 UBAH: Background Dark #1A1A1A, Border #333
    <div className="bg-[#1A1A1A] rounded-2xl shadow-lg border border-[#333] overflow-hidden font-sans hover:border-[#f01036]/30 transition-all duration-300">
      
      {/* HEADER */}
      <div className="p-4 flex justify-between items-center bg-[#222] border-b border-[#333]">
        <h3 className="font-bold text-white text-base capitalize flex items-center gap-2 truncate">
          <Calendar size={16} className="text-[#f01036] shrink-0" />
          <span className="truncate">{monthName} <span className="text-[#666] font-normal">{year}</span></span>
        </h3>

        <div className="flex items-center gap-0.5 shrink-0 ml-2">
            <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#333] text-[#888] hover:text-white transition">
                <ChevronLeft size={16} />
            </button>
            
            <button onClick={goToday} className="h-7 px-2 flex items-center justify-center rounded-lg hover:bg-[#f01036]/10 text-[#f01036] hover:text-[#ff4d6d] font-bold text-[10px] transition border border-transparent hover:border-[#f01036]/30" title="Ke Hari Ini">
                Hari Ini
            </button>

            <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#333] text-[#888] hover:text-white transition">
                <ChevronRight size={16} />
            </button>
        </div>
      </div>

      <div className="p-4">
        {/* HEADER HARI */}
        <div className="grid grid-cols-7 mb-2 text-center">
            {daysHeader.map(day => (
                <div key={day} className="text-[10px] font-bold text-[#666] uppercase tracking-wider py-1">
                    {day}
                </div>
            ))}
        </div>

        {/* GRID TANGGAL */}
        <div className="grid grid-cols-7 gap-1">
            {blanks.map(i => <div key={`blank-${i}`} className="aspect-square"></div>)}

            {days.map(day => {
                const dateCheckStr = new Date(year, month, day).toLocaleDateString('en-CA');
                const isActive = activeDate === dateCheckStr;
                const today = isToday(day);
                const events = getDayContent(day);

                return (
                    <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className={`
                            aspect-square rounded-lg flex flex-col relative transition-all duration-200 border border-transparent overflow-hidden group
                            ${isActive ? 'bg-[#f01036]/20 border-[#f01036] ring-1 ring-[#f01036] z-10' : 'hover:bg-[#333]'}
                            ${today ? 'bg-[#222] shadow-inner ring-1 ring-[#555]' : ''}
                        `}
                    >
                        {/* Angka Tanggal & Indikator */}
                        <div className="w-full flex justify-between items-start p-1 relative z-20">
                            <span className={`text-[10px] md:text-xs font-medium leading-none ${today ? 'text-[#f01036] font-bold' : 'text-[#888] group-hover:text-white'}`}>
                                {day}
                            </span>
                            
                            <div className="flex gap-0.5">
                                {/* 🔥 INDIKATOR START (HIJAU) - SEKARANG MUNCUL! */}
                                {events.starts.length > 0 && (
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]" title="Project Dimulai"></div>
                                )}

                                {/* Indikator Deadline (Merah) */}
                                {events.deadlines.length > 0 && (
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)] animate-pulse" title="Deadline!"></div>
                                )}
                            </div>
                        </div>

                        {/* GARIS RENTANG PROJECT (Bar Bawah) */}
                        <div className="flex flex-col gap-[2px] w-full px-1 mt-auto pb-1 relative z-10">
                            {events.active.slice(0, 3).map(p => (
                                <div 
                                    key={p.id} 
                                    // Menggunakan opacity lebih rendah biar gak nabrak teks tanggal
                                    className={`h-0.5 md:h-1 w-full rounded-full ${getProjectColor(p.id)} opacity-80 shadow-sm`}
                                    title={p.title}
                                ></div>
                            ))}
                            {/* Indikator Overflow */}
                            {events.active.length > 3 && (
                                <div className="h-0.5 w-full flex justify-center gap-0.5">
                                    <div className="w-0.5 h-0.5 bg-[#666] rounded-full"></div>
                                    <div className="w-0.5 h-0.5 bg-[#666] rounded-full"></div>
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
        
        {/* LEGENDA */}
        <div className="mt-4 flex gap-3 justify-center text-[10px] text-[#666] border-t border-[#333] pt-3 flex-wrap">
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span> Deadline</div>
            
            {/* 🔥 LEGENDA BARU UNTUK START */}
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span> Start</div>
            
            <div className="flex items-center gap-1"><span className="w-4 h-1 rounded-full bg-gradient-to-r from-[#f01036] to-orange-500 opacity-80"></span> Aktif</div>
        </div>

      </div>
    </div>
  );
}