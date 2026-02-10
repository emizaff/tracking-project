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
      <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-3xl p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative"> 
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Rocket className="text-indigo-500" /> Project Baru
            </h2>
            <button onClick={onClose} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-400 hover:text-white transition">
                <X size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Judul */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Nama Project</label>
                <input 
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Belajar Next.js"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
            </div>

            {/* Input Deskripsi */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Deskripsi (Opsional)</label>
                <textarea 
                    rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tentang apa project ini?"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
                />
            </div>

            {/* PILIHAN PRIORITAS */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Prioritas</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => setPriority('HIGH')}
                        className={`p-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${priority === 'HIGH' ? 'bg-red-900/30 border-red-500 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-red-500/50 hover:text-red-400'}`}
                    >
                        <Flag size={16} /> High (Resolusi)
                    </button>
                    <button
                        type="button"
                        onClick={() => setPriority('MEDIUM')}
                        className={`p-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${priority === 'MEDIUM' ? 'bg-indigo-900/30 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400'}`}
                    >
                        <Briefcase size={16} /> Medium (Tugas)
                    </button>
                    <button
                        type="button"
                        onClick={() => setPriority('LOW')}
                        className={`p-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${priority === 'LOW' ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-green-500/50 hover:text-green-400'}`}
                    >
                        <Coffee size={16} /> Low (Santai)
                    </button>
                </div>
            </div>

            {/* AREA TANGGAL */}
            <div className="grid grid-cols-2 gap-4">
                
                {/* 1. INPUT TANGGAL MULAI */}
                <div className="relative" ref={startPickerRef}>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Mulai</label>
                    <button
                        type="button"
                        onClick={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false); }}
                        className={`w-full px-4 py-3.5 rounded-xl border text-left flex justify-between items-center transition relative
                            ${showStartPicker ? 'border-indigo-500 ring-1 ring-indigo-500 bg-slate-900' : 'border-slate-600 bg-slate-900 hover:bg-slate-800 hover:border-slate-500'}
                        `}
                    >
                        <span className="text-sm font-medium text-slate-200 truncate">{displayDate(startDate)}</span>
                        <Calendar size={16} className="text-slate-500" />
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
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Deadline 🏁</label>
                    <button
                        type="button"
                        onClick={() => { setShowEndPicker(!showEndPicker); setShowStartPicker(false); }}
                        className={`w-full px-4 py-3.5 rounded-xl border text-left flex justify-between items-center transition relative
                            ${showEndPicker ? 'border-indigo-500 ring-1 ring-indigo-500 bg-slate-900' : 'border-slate-600 bg-slate-900 hover:bg-slate-800 hover:border-slate-500'}
                        `}
                    >
                        <span className={`text-sm font-medium truncate ${deadline ? 'text-slate-200' : 'text-slate-500'}`}>
                            {deadline ? displayDate(deadline) : "Tanpa Deadline"}
                        </span>
                        
                        {deadline ? (
                            <div 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setDeadline(""); 
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 text-slate-400 hover:bg-red-900/50 hover:text-red-400 transition"
                                title="Hapus Deadline"
                            >
                                <X size={12} />
                            </div>
                        ) : (
                            <Calendar size={16} className="text-slate-500" />
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
            <div className="flex gap-3 pt-4 mt-6 border-t border-slate-700">
                <button 
                    type="button" onClick={onClose}
                    className="flex-1 py-3.5 rounded-xl border border-slate-600 text-slate-400 font-bold hover:bg-slate-700 hover:text-white transition"
                >
                    Batal
                </button>
                <button 
                    type="submit" disabled={isLoading}
                    className="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 flex justify-center items-center"
                >
                    {isLoading ? "Menyimpan..." : "Buat Project"}
                </button>
            </div>

        </form>
      </div>
    </div>
  );
}