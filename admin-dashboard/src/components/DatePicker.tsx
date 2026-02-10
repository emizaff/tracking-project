// src/components/DatePicker.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Props {
  selectedDate: string; // Format YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // Batas Bawah Project
  maxDate?: string; // Batas Atas Project
}

export default function DatePicker({ selectedDate, onChange, minDate, maxDate }: Props) {
  // State view (sedang lihat bulan/tahun apa)
  const [viewDate, setViewDate] = useState(new Date());

  // Sinkronkan view saat selectedDate berubah
  useEffect(() => {
    if (selectedDate) {
      setViewDate(new Date(selectedDate));
    }
  }, []); // Run once on mount

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = new Date(year, month).toLocaleString('id-ID', { month: 'long' });
  const daysHeader = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Logic Kalender Standard
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  // Navigasi Bulan
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  
  // Navigasi Tahun (Biar UX ganti tahun enak)
  const prevYear = () => setViewDate(new Date(year - 1, month, 1));
  const nextYear = () => setViewDate(new Date(year + 1, month, 1));

  // Handler Klik Tanggal
  const handleDateClick = (day: number) => {
    // Buat date string local YYYY-MM-DD
    const d = new Date(year, month, day);
    const offset = d.getTimezoneOffset() * 60000;
    const dateStr = new Date(d.getTime() - offset).toISOString().split('T')[0];
    
    onChange(dateStr);
  };

  // Cek apakah tanggal valid (masuk range project)
  const isDateDisabled = (day: number) => {
    const d = new Date(year, month, day);
    const offset = d.getTimezoneOffset() * 60000;
    const dateStr = new Date(d.getTime() - offset).toISOString().split('T')[0];

    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden font-sans w-full max-w-sm mx-auto animate-in zoom-in-95 duration-200">
      
      {/* HEADER: Navigasi */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex flex-col gap-2">
        
        {/* Baris Tahun (Ganti Tahun dengan Cepat) */}
        <div className="flex justify-between items-center px-1">
             <button onClick={prevYear} className="text-xs font-bold text-slate-500 hover:text-indigo-400 px-2 flex items-center gap-1 transition">
                <ChevronsLeft size={12} /> Tahun Lalu
             </button>
             <span className="text-xs font-bold text-slate-500">{year}</span>
             <button onClick={nextYear} className="text-xs font-bold text-slate-500 hover:text-indigo-400 px-2 flex items-center gap-1 transition">
                Tahun Depan <ChevronsRight size={12} />
             </button>
        </div>

        {/* Baris Bulan */}
        <div className="flex justify-between items-center">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition">
                <ChevronLeft size={18} />
            </button>
            <h3 className="font-bold text-white text-lg capitalize">{monthName}</h3>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition">
                <ChevronRight size={18} />
            </button>
        </div>
      </div>

      <div className="p-4">
        {/* HEADER HARI */}
        <div className="grid grid-cols-7 mb-2 text-center">
            {daysHeader.map(day => (
                <div key={day} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {day}
                </div>
            ))}
        </div>

        {/* GRID TANGGAL */}
        <div className="grid grid-cols-7 gap-1">
            {blanks.map(i => <div key={`blank-${i}`} className="aspect-square"></div>)}

            {days.map(day => {
                const dateCheck = new Date(year, month, day);
                const offset = dateCheck.getTimezoneOffset() * 60000;
                const dateStr = new Date(dateCheck.getTime() - offset).toISOString().split('T')[0];
                
                const isSelected = selectedDate === dateStr;
                const disabled = isDateDisabled(day);

                return (
                    <button
                        key={day}
                        disabled={disabled}
                        type="button" // PENTING: Agar tidak submit form parent
                        onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
                        className={`
                            aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                            ${isSelected 
                                ? 'bg-indigo-600 text-white shadow-md scale-105 font-bold ring-1 ring-indigo-500' 
                                : disabled 
                                    ? 'text-slate-600 cursor-not-allowed bg-slate-900/50' // Disabled Style
                                    : 'text-slate-300 hover:bg-indigo-900/40 hover:text-indigo-300'
                            }
                        `}
                    >
                        {day}
                    </button>
                );
            })}
        </div>
      </div>
    </div>
  );
}