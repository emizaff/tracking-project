// src/components/TimePickerCircle.tsx
import React, { useState } from 'react';

interface Props {
  initialHours: number;
  initialMinutes: number;
  onChange: (h: number, m: number) => void;
}

export default function TimePickerCircle({ initialHours, initialMinutes, onChange }: Props) {
  const [mode, setMode] = useState<'HOUR' | 'MINUTE'>('MINUTE'); 
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);

  // Helper generate angka visual
  const hourNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minuteNumbers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const handleSelect = (val: number) => {
    if (mode === 'HOUR') {
      const newHour = val === 12 ? 0 : val; // Konversi visual 12 -> 0 (tengah malam)
      setHours(newHour);
      setMode('MINUTE'); 
    } else {
      setMinutes(val);
      onChange(hours, val); 
    }
  };

  return (
    <div className="flex flex-col items-center animate-in zoom-in duration-200 py-4">
      
      {/* HEADER DIGITAL */}
      <div className="flex items-end gap-2 mb-8 bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-700">
        <button 
            onClick={() => setMode('HOUR')}
            className={`text-5xl font-mono font-bold transition-all duration-300 ${mode === 'HOUR' ? 'text-indigo-400 scale-110 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'text-slate-600 hover:text-slate-400'}`}
        >
            {hours.toString().padStart(2, '0')}
        </button>
        <span className="text-5xl font-bold text-slate-700 -translate-y-1 animate-pulse">:</span>
        <button 
            onClick={() => setMode('MINUTE')}
            className={`text-5xl font-mono font-bold transition-all duration-300 ${mode === 'MINUTE' ? 'text-indigo-400 scale-110 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'text-slate-600 hover:text-slate-400'}`}
        >
            {minutes.toString().padStart(2, '0')}
        </button>
      </div>

      {/* LINGKARAN JAM */}
      <div className="relative w-64 h-64 bg-slate-800 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] border border-slate-700 flex items-center justify-center">
        
        {/* Center Dot */}
        <div className="w-3 h-3 bg-indigo-500 rounded-full absolute z-20 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>

        {/* Jarum (Visual) */}
        <div 
            className="absolute w-1 h-28 bg-gradient-to-t from-indigo-500 to-transparent origin-bottom bottom-1/2 left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 rounded-full opacity-50"
            style={{ 
                transform: `translateX(-50%) rotate(${mode === 'HOUR' ? (hours * 30) : (minutes * 6)}deg)` 
            }}
        ></div>

        {/* Angka-angka */}
        {(mode === 'HOUR' ? hourNumbers : minuteNumbers).map((num, i) => {
            const angle = (i * 30) - 90; 
            const radius = 100; 
            const x = radius * Math.cos(angle * (Math.PI / 180));
            const y = radius * Math.sin(angle * (Math.PI / 180));
            
            const isSelected = mode === 'HOUR' ? hours === (num === 12 ? 0 : num) : minutes === num;

            return (
                <button
                    key={num}
                    onClick={() => handleSelect(num === 12 && mode === 'HOUR' ? 0 : num)}
                    className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 z-10
                        ${isSelected 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110 ring-2 ring-indigo-400/50' 
                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                        }
                    `}
                    style={{ 
                        transform: `translate(${x}px, ${y}px)` 
                    }}
                >
                    {num}
                </button>
            );
        })}
      </div>
      
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-6 bg-slate-900/30 px-3 py-1 rounded-full border border-slate-800">
        {mode === 'HOUR' ? 'Pilih Jam' : 'Pilih Menit'}
      </p>
    </div>
  );
}