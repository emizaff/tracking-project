// src/components/DeleteConfirmModal.tsx
import React from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message, isDeleting }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Icon Warning */}
        <div className="w-16 h-16 bg-red-900/20 border border-red-500/20 rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <AlertTriangle size={32} className="text-red-500" />
        </div>

        <h3 className="text-xl font-bold text-white text-center mb-2 relative z-10">{title}</h3>
        <p className="text-slate-400 text-center mb-8 text-sm leading-relaxed relative z-10 px-4">
          {message || "Apakah Anda yakin? Data yang dihapus tidak dapat dikembalikan lagi selamanya."}
        </p>

        <div className="flex gap-3 relative z-10">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3.5 rounded-xl border border-slate-600 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition"
          >
            Batal
          </button>
          
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
                <>
                    <Loader2 size={18} className="animate-spin" /> Menghapus...
                </>
            ) : (
                <>
                    <Trash2 size={18} /> Hapus Permanen
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}