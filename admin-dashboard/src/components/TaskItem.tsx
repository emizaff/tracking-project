// src/components/TaskItem.tsx
import type { Task } from '../types';
import ActionMenu from './ActionMenu';
import { Play, Check, Plus, Calendar, Clock, Target } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onIncrement: (task: Task) => void;
  onStartSession: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDeadlineClick?: (date: string) => void; 
}

const formatDuration = (minutes: number) => {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
};

export default function TaskItem({ task, onToggle, onIncrement, onStartSession, onDelete, onDeadlineClick }: TaskItemProps) {
  const isTimerTask = (task.duration || 0) > 0;
  const isCounterTask = (task.targetCount || 1) > 1;
  const done = task.isCompleted;
  
  const timePercent = isTimerTask 
    ? Math.min(((task.spentTime || 0) / ((task.duration || 1) * 60)) * 100, 100) 
    : 0;

  // Logic Badge Deadline
  const getDeadlineBadge = () => {
    if (!task.deadline) return null;
    
    const d = new Date(task.deadline);
    const dateStr = d.toISOString().split('T')[0]; 
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const isPast = d < today;
    const isToday = d.toDateString() === today.toDateString();
    
    // Default Dark
    let colorClass = "bg-[#333] text-[#888] border-[#444] hover:bg-[#444]"; 
    
    if (!done) {
        if (isPast) colorClass = "bg-red-900/20 text-red-400 border-red-900/30 hover:bg-red-900/30";
        else if (isToday) colorClass = "bg-amber-900/20 text-amber-400 border-amber-900/30 hover:bg-amber-900/30";
    }

    return (
        <button
            onClick={(e) => {
                e.stopPropagation(); 
                if (onDeadlineClick) onDeadlineClick(dateStr);
            }}
            className={`text-[10px] px-2 py-1 rounded border font-bold flex items-center gap-1 w-fit transition-colors cursor-pointer ${colorClass}`}
            title="Lihat task lain di tanggal ini"
        >
            <Calendar size={10} /> {d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </button>
    );
  };

  return (
    <div 
        onClick={() => (!isCounterTask && !isTimerTask) && onToggle(task.id)} 
        // 🔥 UBAH: Background Dark #1A1A1A, Border #333, Hover Border Merah
        className={`bg-[#1A1A1A] p-4 rounded-xl border flex items-center gap-4 transition-all group relative cursor-pointer
            ${done 
                ? 'opacity-60 bg-[#111] border-[#222]' 
                : 'hover:shadow-lg hover:border-[#f01036]/50 border-[#333] hover:bg-[#222]'
            }`}
    >
        {/* Checkbox Circle */}
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors 
            ${done 
                ? 'bg-green-600 border-green-600' 
                : 'border-[#555] group-hover:border-[#f01036]'
            }`}>
                {done && <Check size={14} className="text-white font-bold" strokeWidth={3} />}
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
                <div>
                    <p className={`font-bold text-base truncate ${done ? 'line-through text-[#666]' : 'text-[#ccc] group-hover:text-white'}`}>{task.title}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                        {getDeadlineBadge()} 
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-1 ml-2">
                    {isTimerTask && (
                        // Badge Timer (Aksen Merah)
                        <span className="text-[10px] font-mono bg-[#f01036]/10 text-[#f01036] px-2 py-0.5 rounded border border-[#f01036]/20 flex items-center gap-1">
                            <Clock size={10} /> {formatDuration(Math.floor((task.spentTime||0)/60))} / {formatDuration(task.duration||0)}
                        </span>
                    )}
                    {isCounterTask && (
                        // Badge Counter (Aksen Biru/Ungu -> Ganti ke Orange biar variasi dikit tapi tetep warm)
                        <span className="text-[10px] font-bold bg-orange-900/30 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30 flex items-center gap-1">
                            <Target size={10} /> {task.currentCount || 0} / {task.targetCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Progress Bars */}
            {isTimerTask && !done && (
                <div className="w-full h-1 bg-[#333] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#f01036] rounded-full transition-all duration-500" style={{ width: `${timePercent}%` }}></div>
                </div>
            )}
            {isCounterTask && !done && (
                    <div className="w-full h-1 bg-[#333] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${((task.currentCount||0) / (task.targetCount||1)) * 100}%` }}></div>
                </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
            
            {/* Tombol Timer (Play) - Merah */}
            {isTimerTask && !done && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onStartSession(task); }} 
                    className="w-9 h-9 rounded-full bg-[#f01036] text-white hover:bg-[#d00e2e] flex items-center justify-center transition-all shadow-lg shadow-[#f01036]/20 active:scale-90"
                >
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                </button>
            )}
            
            {/* Tombol Counter (+1) - Orange */}
            {isCounterTask && !isTimerTask && !done && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onIncrement(task); }} 
                    className="w-9 h-9 rounded-full bg-orange-600 text-white hover:bg-orange-500 flex items-center justify-center font-bold text-sm transition-all shadow-lg shadow-orange-500/20 active:scale-90"
                >
                    <Plus size={18} />
                </button>
            )}
            
            {/* Menu Titik Tiga */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ActionMenu type="Task" onDelete={() => onDelete(task)} />
            </div>
        </div>
    </div>
  );
}