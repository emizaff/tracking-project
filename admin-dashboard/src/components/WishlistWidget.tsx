// src/components/WishlistWidget.tsx
import React, { useState } from 'react';
import { PiggyBank, Plus, X, Trash2, ShoppingCart, Wallet, Coins, CheckCircle2 } from 'lucide-react';

interface Goal {
  id: number;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  isCompleted: boolean;
}

interface Props {
  goals: Goal[];
  onAdd: (title: string, target: number, unit: string) => void;
  onIncrement: (id: number, amount: number) => void;
  onDelete: (id: number) => void;
}

export default function WishlistWidget({ goals, onAdd, onIncrement, onDelete }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(""); 
  
  const [savingAmounts, setSavingAmounts] = useState<Record<number, string>>({});

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && price) {
      onAdd(title, parseInt(price), 'Rp');
      setIsAdding(false);
      setTitle("");
      setPrice("");
    }
  };

  const handleSave = (id: number) => {
    const amount = parseInt(savingAmounts[id] || "0");
    if (amount > 0) {
        onIncrement(id, amount);
        setSavingAmounts(prev => ({ ...prev, [id]: "" })); 
    }
  };

  return (
    // 🔥 UBAH: Background Dark #1A1A1A, Border #333
    <div className="bg-[#1A1A1A] rounded-3xl border border-[#333] shadow-lg overflow-hidden flex flex-col w-full hover:border-[#f01036]/30 transition-all duration-300">
      
      {/* Header */}
      <div className="p-5 border-b border-[#333] flex justify-between items-center bg-[#222]">
        <div>
           <h3 className="font-extrabold text-white flex items-center gap-2">
              <PiggyBank className="text-amber-400" size={20} /> Loot & Wishlist
           </h3>
           <p className="text-xs text-[#888]">Target Jajan 2026</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          // 🔥 UBAH: Tombol Aksen Merah
          className={`text-xs px-3 py-2 rounded-lg font-bold transition flex items-center gap-1 border ${isAdding ? 'bg-[#333] text-[#ccc] border-[#444] hover:bg-[#444]' : 'bg-[#f01036] text-white border-[#f01036] hover:bg-[#d00e2e] shadow-lg shadow-[#f01036]/20'}`}
        >
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? "Batal" : "Item"}
        </button>
      </div>

      {/* Form Tambah */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-4 bg-amber-900/10 border-b border-amber-500/20 animate-in slide-in-from-top-2 relative">
           <input 
             className="w-full text-sm p-2.5 rounded-lg border border-[#444] mb-2 focus:outline-none focus:border-[#f01036] bg-[#222] text-white placeholder-[#666]"
             placeholder="Nama Barang (misal: HP Baru)"
             value={title} onChange={e => setTitle(e.target.value)}
             autoFocus
           />
           <div className="flex gap-2">
              <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] text-xs font-bold">Rp</span>
                  <input 
                    type="number"
                    className="w-full text-sm p-2.5 pl-8 rounded-lg border border-[#444] focus:outline-none focus:border-[#f01036] bg-[#222] text-white placeholder-[#666]"
                    placeholder="Harga Target"
                    value={price} onChange={e => setPrice(e.target.value)}
                  />
              </div>
              <button type="submit" className="bg-amber-500 text-white px-4 rounded-lg font-bold hover:bg-amber-600 transition shadow-lg shadow-amber-500/20 text-xs">Simpan</button>
           </div>
        </form>
      )}

      {/* List Barang */}
      <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar max-h-[300px]">
        {goals.length === 0 && !isAdding && (
            <div className="text-center text-[#666] py-8 text-sm flex flex-col items-center gap-2">
                <ShoppingCart size={32} className="opacity-30" />
                <p>Dompet aman?<br/>Masukin target belanjaanmu! 🛒</p>
            </div>
        )}

        {goals.map(goal => {
            const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            const isCompleted = goal.isCompleted || percent >= 100;
            
            return (
            <div key={goal.id} className={`group relative p-3 rounded-xl border transition-all ${isCompleted ? 'bg-green-900/10 border-green-900/30 opacity-70' : 'bg-[#222] border-[#333] hover:border-[#555] hover:bg-[#2a2a2a]'}`}>
                {/* Tombol Hapus */}
                <button 
                    onClick={() => onDelete(goal.id)}
                    className="absolute top-2 right-2 text-[#666] hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition z-10 hover:bg-[#333] rounded"
                >
                    <Trash2 size={14} />
                </button>

                <div className="flex justify-between items-end mb-1">
                    <span className={`text-sm font-bold truncate max-w-[140px] ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                        {goal.title}
                    </span>
                    <span className="text-[10px] font-bold text-[#888] bg-[#111] px-2 py-0.5 rounded border border-[#333]">
                        {formatRupiah(goal.targetValue)}
                    </span>
                </div>
                
                {/* Progress Bar Uang */}
                <div className="h-3 bg-[#000] rounded-full overflow-hidden relative mb-3 border border-[#333]">
                    <div 
                        className={`h-full transition-all duration-1000 flex items-center justify-end pr-1.5 ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-amber-500 to-yellow-500'}`} 
                        style={{ width: `${percent}%` }}
                    >
                        {percent > 10 && <span className="text-[8px] font-bold text-black/70 drop-shadow-sm">{percent}%</span>}
                    </div>
                </div>

                {/* Input Nabung (Hanya muncul jika belum lunas) */}
                {!isCompleted ? (
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Wallet size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#666]" />
                            <input 
                                type="number" 
                                placeholder="Nominal..."
                                className="w-full text-xs p-2 pl-7 rounded-lg border border-[#444] bg-[#1A1A1A] text-white focus:outline-none focus:border-[#f01036] placeholder-[#555]"
                                value={savingAmounts[goal.id] || ""}
                                onChange={(e) => setSavingAmounts({...savingAmounts, [goal.id]: e.target.value})}
                            />
                        </div>
                        <button 
                            onClick={() => handleSave(goal.id)}
                            // 🔥 UBAH: Tombol Tabung pakai Merah/Aksen
                            className="bg-[#f01036] text-white text-[10px] px-3 rounded-lg font-bold hover:bg-[#d00e2e] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#f01036]/20 flex items-center gap-1 transition"
                            disabled={!savingAmounts[goal.id]}
                        >
                            <Coins size={12} /> Tabung
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-xs font-bold text-green-400 bg-green-900/20 py-2 rounded-lg border border-green-500/30 flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} /> LUNAS / TERBELI!
                    </div>
                )}
                
                <div className="text-[10px] text-[#666] mt-2 text-right">
                    Terkumpul: <span className="text-white font-bold">{formatRupiah(goal.currentValue)}</span>
                </div>
            </div>
        )})}
      </div>
    </div>
  );
}