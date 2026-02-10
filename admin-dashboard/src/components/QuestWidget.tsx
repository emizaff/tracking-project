// src/components/QuestWidget.tsx (atau WishlistWidget.tsx)
import React, { useState, useRef } from 'react';
import { Target, Plus, X, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

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
  onIncrement: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function QuestWidget({ goals, onAdd, onIncrement, onDelete }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(10);
  const [unit, setUnit] = useState("item");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && target > 0) {
      onAdd(title, target, unit);
      setIsAdding(false);
      setTitle("");
      setTarget(10);
      setUnit("item");
    }
  };

  const sortedGoals = [...goals].sort((a, b) => {
      if (a.isCompleted === b.isCompleted) return 0;
      return a.isCompleted ? 1 : -1; 
  });

  return (
    <div className="flex flex-col gap-4 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div>
           <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
               <Target size={20} className="text-red-500" /> Quest Board
           </h3>
           <p className="text-xs text-slate-400">Resolusi & Target 2026</p>
        </div>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg font-bold hover:bg-slate-700 hover:text-white transition flex items-center gap-2"
        >
            {isAdding ? <X size={14} /> : <Plus size={14} />} 
            {isAdding ? "Batal" : "Target"}
        </button>
      </div>

      {/* Form Tambah */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl animate-in slide-in-from-top-2 mx-1 relative z-20">
           <input 
             className="w-full text-sm p-2.5 rounded-lg border border-slate-600 mb-2 focus:outline-none focus:border-indigo-500 bg-slate-900 text-white placeholder-slate-500"
             placeholder="Nama Quest (misal: Baca Buku)"
             value={title} onChange={e => setTitle(e.target.value)}
             autoFocus
           />
           <div className="flex gap-2 mb-2">
              <input 
                type="number" min="1"
                className="w-24 text-sm p-2.5 rounded-lg border border-slate-600 focus:outline-none focus:border-indigo-500 bg-slate-900 text-white placeholder-slate-500"
                placeholder="Target"
                value={target} onChange={e => setTarget(parseInt(e.target.value))}
              />
              <input 
                className="flex-1 text-sm p-2.5 rounded-lg border border-slate-600 focus:outline-none focus:border-indigo-500 bg-slate-900 text-white placeholder-slate-500"
                placeholder="Satuan (buku, video)"
                value={unit} onChange={e => setUnit(e.target.value)}
              />
           </div>
           <button type="submit" className="w-full bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">Simpan Quest</button>
        </form>
      )}

      {/* CONTAINER WRAPPER */}
      <div className="relative group">
        
        {/* NAVIGASI SCROLL */}
        {sortedGoals.length > 0 && (
            <>
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-8 h-8 bg-slate-800 border border-slate-700 rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-8 h-8 bg-slate-800 border border-slate-700 rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight size={16} />
                </button>
            </>
        )}

        {/* SLIDER CONTAINER */}
        <div 
            ref={scrollRef} 
            className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x scroll-smooth no-scrollbar"
        >
            {sortedGoals.length === 0 && !isAdding && (
                <div className="w-full text-center text-slate-500 py-8 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
                    <Target size={32} className="mx-auto mb-2 opacity-30" />
                    Belum ada quest aktif. Yuk mulai kejar targetmu! 🚀
                </div>
            )}

            {sortedGoals.map(goal => {
                const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                
                return (
                <div key={goal.id} className={`min-w-[280px] md:min-w-[300px] snap-center group/card relative p-5 rounded-2xl border shadow-lg transition-all ${goal.isCompleted ? 'bg-green-900/10 border-green-900/30 opacity-70 grayscale-[0.3]' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}>
                    <button 
                        onClick={() => onDelete(goal.id)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover/card:opacity-100 transition z-10 bg-slate-900/50 rounded-full"
                    >
                        <X size={12} />
                    </button>

                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className={`font-bold truncate max-w-[160px] ${goal.isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                                {goal.title}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700 mt-1 inline-block">
                                Target: {goal.targetValue} {goal.unit}
                            </span>
                        </div>
                        {goal.isCompleted ? (
                            <Trophy className="text-yellow-400 animate-bounce" size={24} />
                        ) : (
                            <div className="text-right">
                                <span className="text-2xl font-black text-indigo-500">{percent}%</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4 border border-slate-600">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${goal.isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-bold">
                            {goal.currentValue} <span className="font-normal text-slate-500">/ {goal.targetValue} Selesai</span>
                        </span>

                        {!goal.isCompleted && (
                            <button 
                                onClick={() => onIncrement(goal.id)}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-indigo-500 active:scale-95 transition shadow-lg shadow-indigo-500/20 flex items-center gap-1 border border-indigo-500"
                            >
                                <Plus size={12} /> Progress
                            </button>
                        )}
                    </div>
                </div>
            )})}
        </div>
      </div>
    </div>
  );
}