// src/components/TimePickerCircle.tsx
import { useState } from 'react';

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
      {/* 🔥 UBAH: Background Dark & Border */}
      <div className="flex items-end gap-2 mb-8 bg-[#111] px-6 py-3 rounded-2xl border border-[#333]">
        <button 
            onClick={() => setMode('HOUR')}
            // 🔥 UBAH: Text Merah & Glow
            className={`text-5xl font-mono font-bold transition-all duration-300 ${mode === 'HOUR' ? 'text-[#f01036] scale-110 drop-shadow-[0_0_10px_rgba(240,16,54,0.5)]' : 'text-[#666] hover:text-[#888]'}`}
        >
            {hours.toString().padStart(2, '0')}
        </button>
        <span className="text-5xl font-bold text-[#444] -translate-y-1 animate-pulse">:</span>
        <button 
            onClick={() => setMode('MINUTE')}
            className={`text-5xl font-mono font-bold transition-all duration-300 ${mode === 'MINUTE' ? 'text-[#f01036] scale-110 drop-shadow-[0_0_10px_rgba(240,16,54,0.5)]' : 'text-[#666] hover:text-[#888]'}`}
        >
            {minutes.toString().padStart(2, '0')}
        </button>
      </div>

      {/* LINGKARAN JAM */}
      {/* 🔥 UBAH: Background Dark #1A1A1A */}
      <div className="relative w-64 h-64 bg-[#1A1A1A] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] border border-[#333] flex items-center justify-center">
        
        {/* Center Dot */}
        <div className="w-3 h-3 bg-[#f01036] rounded-full absolute z-20 shadow-[0_0_10px_rgba(240,16,54,0.8)]"></div>

        {/* Jarum (Visual) - Gradient Merah */}
        <div 
            className="absolute w-1 h-28 bg-gradient-to-t from-[#f01036] to-transparent origin-bottom bottom-1/2 left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 rounded-full opacity-80"
            style={{ 
                transform: `translateX(-50%) rotate(${mode === 'HOUR' ? (hours * 30) : (minutes * 6)}deg)` 
            }}
        ></div>

        {/* Angka-angka */}
        {(mode === 'HOUR' ? hourNumbers : minuteNumbers).map((num, i) => {
            // ... Logic posisi sama ...
            // Cuma perlu hitung posisi X Y manual di sini karena React Inline Style
            // Tapi karena logic-nya ada di dalam .map, kita pakai trik CSS absolute positioning
            
            // Kita hitung manual koordinatnya biar rapi
            const angle = (i * 30) - 90; // -90 biar mulai dari jam 12 (atas)
            const radius = 100; // Jari-jari lingkaran angka
            const radians = angle * (Math.PI / 180);
            const x = Math.round(radius * Math.cos(radians));
            const y = Math.round(radius * Math.sin(radians));
            
            const isSelected = mode === 'HOUR' ? hours === (num === 12 ? 0 : num) : minutes === num;

            return (
                <button
                    key={num}
                    onClick={() => handleSelect(num === 12 && mode === 'HOUR' ? 0 : num)}
                    // 🔥 UBAH: Active State jadi Merah
                    className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 z-10
                        ${isSelected 
                            ? 'bg-[#f01036] text-white shadow-lg shadow-[#f01036]/50 scale-110 ring-2 ring-[#f01036]/50' 
                            : 'text-[#888] hover:bg-[#333] hover:text-white'
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
      
      <p className="text-xs font-bold uppercase tracking-widest text-[#666] mt-6 bg-[#222] px-3 py-1 rounded-full border border-[#333]">
        {mode === 'HOUR' ? 'Pilih Jam' : 'Pilih Menit'}
      </p>
    </div>
  );
}