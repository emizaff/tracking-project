// src/components/VaultOverlay.tsx
import React, { useState, useEffect } from 'react';
import { Brain, X, Plus, Search, Trash2, FileText, PenLine, Clock } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function VaultOverlay({ isOpen, onClose }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Load dari LocalStorage saat buka
  useEffect(() => {
    const saved = localStorage.getItem('focus_vault_notes');
    if (saved) {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
        if (parsed.length > 0) setActiveNoteId(parsed[0].id);
    }
  }, []);

  // Auto-Save ke LocalStorage setiap ada perubahan notes
  useEffect(() => {
    if (notes.length > 0) {
        localStorage.setItem('focus_vault_notes', JSON.stringify(notes));
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (key: 'title' | 'content', value: string) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, [key]: value, updatedAt: new Date().toISOString() } : n));
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Hapus catatan ini?")) {
        const newNotes = notes.filter(n => n.id !== id);
        setNotes(newNotes);
        if (activeNoteId === id) setActiveNoteId(newNotes[0]?.id || null);
        localStorage.setItem('focus_vault_notes', JSON.stringify(newNotes));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f172a] text-slate-300 flex overflow-hidden animate-in fade-in duration-200 font-sans">
      
      {/* SIDEBAR LIST */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="font-bold text-slate-100 flex items-center gap-2">
                <Brain className="text-indigo-500" /> The Vault
            </h2>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition flex items-center gap-1 text-xs">
                Esc <X size={14} />
            </button>
        </div>
        
        <div className="p-4 space-y-3">
            <button onClick={handleAddNote} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-500 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
                <Plus size={16} /> Ide Baru
            </button>
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pl-9 pr-3 py-2 transition"
                    placeholder="Cari catatan..."
                    value={search} onChange={e => setSearch(e.target.value)}
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
            {notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())).map(note => (
                <div 
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-3 rounded-lg cursor-pointer group relative transition border ${activeNoteId === note.id ? 'bg-slate-800 border-slate-700 text-white shadow-sm' : 'border-transparent hover:bg-slate-800/50 hover:text-slate-200'}`}
                >
                    <div className="font-bold text-sm truncate pr-6 flex items-center gap-2">
                        <FileText size={12} className={activeNoteId === note.id ? "text-indigo-400" : "text-slate-600"} />
                        {note.title || "Tanpa Judul"}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-1 pl-5">{note.content || "Kosong..."}</div>
                    
                    <button 
                        onClick={(e) => handleDelete(e, note.id)}
                        className="absolute right-2 top-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-slate-700"
                        title="Hapus Catatan"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
            {notes.length === 0 && (
                <div className="text-center text-xs text-slate-600 py-8 flex flex-col items-center gap-2">
                    <PenLine size={24} className="opacity-20" />
                    Belum ada catatan.
                </div>
            )}
        </div>
      </div>

      {/* EDITOR AREA */}
      <div className="flex-1 flex flex-col bg-[#0f172a] relative">
        {activeNote ? (
            <div className="max-w-3xl mx-auto w-full h-full flex flex-col p-8 md:p-12 animate-in fade-in zoom-in-95 duration-300">
                <input 
                    value={activeNote.title}
                    onChange={(e) => updateNote('title', e.target.value)}
                    placeholder="Judul Ide..."
                    className="bg-transparent text-4xl font-extrabold text-white placeholder-slate-700 border-none focus:ring-0 p-0 mb-6 focus:outline-none"
                />
                <textarea 
                    value={activeNote.content}
                    onChange={(e) => updateNote('content', e.target.value)}
                    placeholder="Tuliskan pemikiran liarmu di sini..."
                    className="flex-1 bg-transparent text-lg text-slate-300 placeholder-slate-700 border-none focus:ring-0 p-0 resize-none leading-relaxed font-serif focus:outline-none custom-scrollbar"
                />
                <div className="text-xs text-slate-600 mt-4 text-right flex items-center justify-end gap-1 pt-4 border-t border-slate-800">
                    <Clock size={12} /> Terakhir diedit: {new Date(activeNote.updatedAt).toLocaleString('id-ID')}
                </div>
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-slate-600 opacity-30 select-none">
                <Brain size={120} strokeWidth={0.5} />
                <p className="mt-4 text-lg font-medium">Pilih atau buat catatan baru</p>
            </div>
        )}
      </div>
    </div>
  );
}