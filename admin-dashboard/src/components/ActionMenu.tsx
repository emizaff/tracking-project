// src/components/ActionMenu.tsx
import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, CheckSquare } from 'lucide-react';

interface Props {
  onDelete: () => void;
  onSelect?: () => void;
  type?: "Project" | "Task";
}

export default function ActionMenu({ onDelete, onSelect, type = "Task" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Logic klik di luar menu untuk menutup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Tombol Titik Tiga (Theme Update) */}
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#888] hover:bg-[#333] hover:text-white transition"
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown Menu (Theme Update) */}
      {isOpen && (
        // 🔥 UBAH: Background Dark #1A1A1A, Border #333
        <div className="absolute right-0 top-full mt-1 w-40 bg-[#1A1A1A] rounded-xl shadow-xl border border-[#333] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-1 flex flex-col gap-0.5">
                
                {/* 👇 TOMBOL SELECT */}
                {onSelect && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            onSelect();
                        }}
                        className="w-full text-left px-3 py-2.5 text-xs text-[#ccc] hover:bg-[#333] hover:text-white rounded-lg flex items-center gap-2 font-medium transition"
                    >
                        {/* Icon Select jadi Merah Aksen */}
                        <CheckSquare size={14} className="text-[#f01036]" />
                        Select {type}
                    </button>
                )}

                {/* TOMBOL DELETE */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        onDelete();
                    }}
                    className="w-full text-left px-3 py-2.5 text-xs text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg flex items-center gap-2 font-medium transition"
                >
                    <Trash2 size={14} />
                    Hapus {type}
                </button>
            </div>
        </div>
      )}
    </div>
  );
}