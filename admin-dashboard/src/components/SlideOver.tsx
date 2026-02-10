// src/components/SlideOver.tsx
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlideOver({ isOpen, onClose, title, children }: Props) {
  const [visible, setVisible] = useState(false);

  // Logic animasi mount/unmount agar halus
  useEffect(() => {
    if (isOpen) setVisible(true);
    else setTimeout(() => setVisible(false), 300); // Tunggu animasi slide-out selesai baru hilang
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* 1. BACKDROP GELAP (Klik untuk tutup) */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* 2. PANEL SLIDER (Muncul dari kanan) */}
      <div className={`relative w-full max-w-md bg-slate-800 shadow-2xl border-l border-slate-700 h-full transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         
         {/* Header Slide */}
         <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800 z-10 relative">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button 
                onClick={onClose} 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white transition"
            >
                <X size={20} />
            </button>
         </div>

         {/* Content Scrollable */}
         <div className="p-6 overflow-y-auto h-[calc(100%-80px)] text-slate-300">
            {children}
         </div>
      </div>
    </div>
  );
}