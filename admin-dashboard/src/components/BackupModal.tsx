// src/components/BackupModal.tsx
import React, { useRef } from 'react';
import { TrackingService } from '../services/trackingService';
import { Download, Upload, X, ShieldCheck, FileJson } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BackupModal({ isOpen, onClose, onSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
        const dataStr = await TrackingService.exportData();
        
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `focus_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        alert("Gagal backup data.");
        console.error(e);
    }
  };

  const handleImportClick = () => { fileInputRef.current?.click(); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const jsonContent = event.target?.result as string;
      const success = await TrackingService.importData(jsonContent);
      if (success) { alert("✅ Data berhasil dipulihkan!"); onSuccess(); onClose(); } 
      else { alert("❌ Gagal restore data."); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        
        {/* Tombol Close X */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
            <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <ShieldCheck size={32} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Backup & Restore</h2>
            <p className="text-slate-400 text-sm">Simpan data kamu agar aman atau pindahkan ke perangkat lain.</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          
          {/* Tombol Download */}
          <button 
            onClick={handleExport} 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center gap-4 transition shadow-lg shadow-indigo-500/20 group border border-indigo-500"
          >
            <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition">
                <Download size={24} />
            </div>
            <div className="text-left">
                <div className="font-bold text-lg leading-tight">Download Data</div>
                <div className="text-[10px] opacity-80 uppercase tracking-wider font-medium">Format .JSON</div>
            </div>
          </button>

          {/* Divider Text */}
          <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase font-bold tracking-wider">ATAU</span>
              <div className="flex-grow border-t border-slate-700"></div>
          </div>

          {/* Tombol Upload */}
          <button 
            onClick={handleImportClick} 
            className="w-full py-4 bg-slate-800 hover:bg-slate-700/80 border-2 border-dashed border-slate-600 hover:border-slate-400 text-slate-400 hover:text-white rounded-xl flex items-center justify-center gap-4 transition group"
          >
            <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-slate-600 transition">
                <Upload size={24} />
            </div>
            <div className="text-left">
                <div className="font-bold text-lg leading-tight">Restore File</div>
                <div className="text-[10px] opacity-60 uppercase tracking-wider font-medium">Upload .JSON</div>
            </div>
          </button>
          
          <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
        </div>

        {/* Footer Warning */}
        <div className="mt-8 text-center bg-yellow-900/10 border border-yellow-900/30 p-3 rounded-lg">
            <p className="text-xs text-yellow-500 flex items-center justify-center gap-2">
                <FileJson size={12} /> Restore akan menggabungkan data lama & baru.
            </p>
        </div>

      </div>
    </div>
  );
}