// src/components/CreateProjectModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { TrackingService } from '../services/trackingService';
import DatePicker from './DatePicker';
import { Rocket, Calendar, X, Flag, Briefcase, Coffee } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState("");
  
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (startPickerRef.current && !startPickerRef.current.contains(event.target as Node)) {
        setShowStartPicker(false);
      }
      if (endPickerRef.current && !endPickerRef.current.contains(event.target as Node)) {
        setShowEndPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await TrackingService.createProject(title, description, startDate, deadline, priority);
      
      // Reset Form
      setTitle(""); 
      setDescription(""); 
      setDeadline("");
      setPriority("MEDIUM");
      setStartDate(new Date().toISOString().split('T')[0]);
      
      setShowStartPicker(false); 
      setShowEndPicker(false);
      
      onSuccess(); 
      onClose();
    } catch (error) { 
      console.error(error); 
      alert("Gagal membuat project."); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const displayDate = (dateStr: string) => {
    if (!dateStr) return "Pilih Tanggal...";
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* 🔥 UBAH: Background Dark #1A1A1A, Border #333 */}
      <div className="bg-[#1A1A1A] border border-[#333] w-full max-w-lg rounded-3xl p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative"> 
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Rocket className="text-[#f01036]" /> Project Baru
            </h2>
            <button onClick={onClose} className="p-2 bg-[#222] hover:bg-[#333] rounded-full text-[#888] hover:text-white transition">
                <X size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Judul */}
            <div>
                <label className="block text-xs font-bold text-[#888] uppercase mb-2 ml-1">Nama Project</label>
                <input 
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Belajar Next.js"
                    // 🔥 UBAH: Border Focus Merah
                    className="w-full px-4 py-3.5 rounded-xl border border-[#444] bg-[#222] text-white placeholder-[#666] focus:outline-none focus:border-[#f01036] focus:ring-1 focus:ring-[#f01036] transition"
                />
            </div>

            {/* Input Deskripsi */}
            <div>
                <label className="block text-xs font-bold text-[#888] uppercase mb-2 ml-1">Deskripsi (Opsional)</label>
                <textarea 
                    rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tentang apa project ini?"
                    className="w-full px-4 py-3.5 rounded-xl border border-[#444] bg-[#222] text-white placeholder-[#666] focus:outline-none focus:border-[#f01036] focus:ring-1 focus:ring-[#f01036] transition resize-none"
                />
            </div>

            {/* PILIHAN PRIORITAS */}
            <div>
                <label className="block text-xs font-bold text-[#888] uppercase mb-2 ml-1">Prioritas</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => setPriority('HIGH')}
                        className={`p-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${priority === 'HIGH' ? 'bg-red-900/30 border-red-500 text-red-400' : 'bg-[#222] border-[#444] text-[#888] hover:border-red-500/50 hover:text-red-400'}`}
                    >
                        <Flag size={16} /> High (Resolusi)
                    </button>
                    <button
                        type="button"
                        onClick={() => setPriority('MEDIUM')}
                        // 🔥 UBAH: Medium pakai Aksen Utama (Merah/Orange)
                        className={`p-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${priority === 'MEDIUM' ? 'bg-[#f01036]/20 border-[#f01036] text-[#f01036]' : 'bg-[#222] border-[#444] text-[#888] hover:border-[#f01036]/50 hover:text-[#f01036]'}`}
                    >
                        <Briefcase size={16} /> Medium (Tugas)
                    </button>
                    <button
                        type="button"
                        onClick={() => setPriority('LOW')}
                        className={`p-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${priority === 'LOW' ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-[#222] border-[#444] text-[#888] hover:border-green-500/50 hover:text-green-400'}`}
                    >
                        <Coffee size={16} /> Low (Santai)
                    </button>
                </div>
            </div>

            {/* AREA TANGGAL */}
            <div className="grid grid-cols-2 gap-4">
                
                {/* 1. INPUT TANGGAL MULAI */}
                <div className="relative" ref={startPickerRef}>
                    <label className="block text-xs font-bold text-[#888] uppercase mb-2 ml-1">Mulai</label>
                    <button
                        type="button"
                        onClick={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false); }}
                        className={`w-full px-4 py-3.5 rounded-xl border text-left flex justify-between items-center transition relative
                            ${showStartPicker ? 'border-[#f01036] ring-1 ring-[#f01036] bg-[#222]' : 'border-[#444] bg-[#222] hover:bg-[#333] hover:border-[#666]'}
                        `}
                    >
                        <span className="text-sm font-medium text-[#ccc] truncate">{displayDate(startDate)}</span>
                        <Calendar size={16} className="text-[#666]" />
                    </button>

                    {showStartPicker && (
                        <div className="absolute bottom-full mb-2 left-0 z-50 w-72 shadow-2xl rounded-2xl animate-in slide-in-from-bottom-2">
                            <DatePicker 
                                selectedDate={startDate}
                                onChange={(d) => { setStartDate(d); setShowStartPicker(false); }}
                            />
                        </div>
                    )}
                </div>

                {/* 2. INPUT DEADLINE */}
                <div className="relative" ref={endPickerRef}>
                    <label className="block text-xs font-bold text-[#888] uppercase mb-2 ml-1">Deadline 🏁</label>
                    <button
                        type="button"
                        onClick={() => { setShowEndPicker(!showEndPicker); setShowStartPicker(false); }}
                        className={`w-full px-4 py-3.5 rounded-xl border text-left flex justify-between items-center transition relative
                            ${showEndPicker ? 'border-[#f01036] ring-1 ring-[#f01036] bg-[#222]' : 'border-[#444] bg-[#222] hover:bg-[#333] hover:border-[#666]'}
                        `}
                    >
                        <span className={`text-sm font-medium truncate ${deadline ? 'text-[#ccc]' : 'text-[#666]'}`}>
                            {deadline ? displayDate(deadline) : "Tanpa Deadline"}
                        </span>
                        
                        {deadline ? (
                            <div 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setDeadline(""); 
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded-full bg-[#333] text-[#888] hover:bg-red-900/50 hover:text-red-400 transition"
                                title="Hapus Deadline"
                            >
                                <X size={12} />
                            </div>
                        ) : (
                            <Calendar size={16} className="text-[#666]" />
                        )}
                    </button>

                    {showEndPicker && (
                        <div className="absolute bottom-full mb-2 right-0 z-50 w-72 shadow-2xl rounded-2xl animate-in slide-in-from-bottom-2">
                             <DatePicker 
                                selectedDate={deadline}
                                minDate={startDate} 
                                onChange={(d) => { setDeadline(d); setShowEndPicker(false); }}
                            />
                        </div>
                    )}
                </div>

            </div>

            {/* Tombol Action */}
            <div className="flex gap-3 pt-4 mt-6 border-t border-[#333]">
                <button 
                    type="button" onClick={onClose}
                    className="flex-1 py-3.5 rounded-xl border border-[#444] text-[#888] font-bold hover:bg-[#333] hover:text-white transition"
                >
                    Batal
                </button>
                <button 
                    type="submit" disabled={isLoading}
                    // 🔥 UBAH: Tombol Merah Aksen
                    className="flex-1 py-3.5 rounded-xl bg-[#f01036] text-white font-bold hover:bg-[#d00e2e] transition shadow-lg shadow-[#f01036]/20 flex justify-center items-center"
                >
                    {isLoading ? "Menyimpan..." : "Buat Project"}
                </button>
            </div>

        </form>
      </div>
    </div>
  );
}