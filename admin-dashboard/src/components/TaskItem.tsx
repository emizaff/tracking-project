// src/components/TaskItem.tsx
import React from 'react';
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
    
    let colorClass = "bg-slate-700/50 text-slate-400 border-slate-600 hover:bg-slate-700"; // Default Dark
    
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
        className={`bg-slate-800 p-4 rounded-xl border flex items-center gap-4 transition-all group relative cursor-pointer
            ${done 
                ? 'opacity-60 bg-slate-800/50 border-slate-800' 
                : 'hover:shadow-lg hover:border-slate-600 border-slate-700 hover:bg-slate-700/30'
            }`}
    >
        {/* Checkbox Circle */}
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors 
            ${done 
                ? 'bg-green-600 border-green-600' 
                : 'border-slate-500 group-hover:border-indigo-500'
            }`}>
                {done && <Check size={14} className="text-white font-bold" strokeWidth={3} />}
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
                <div>
                    <p className={`font-bold text-base truncate ${done ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-white'}`}>{task.title}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                        {getDeadlineBadge()} 
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-1 ml-2">
                    {isTimerTask && (
                        <span className="text-[10px] font-mono bg-indigo-900/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1">
                            <Clock size={10} /> {formatDuration(Math.floor((task.spentTime||0)/60))} / {formatDuration(task.duration||0)}
                        </span>
                    )}
                    {isCounterTask && (
                        <span className="text-[10px] font-bold bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                            <Target size={10} /> {task.currentCount || 0} / {task.targetCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Progress Bars */}
            {isTimerTask && !done && (
                <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${timePercent}%` }}></div>
                </div>
            )}
            {isCounterTask && !done && (
                    <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${((task.currentCount||0) / (task.targetCount||1)) * 100}%` }}></div>
                </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
            
            {/* Tombol Timer (Play) */}
            {isTimerTask && !done && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onStartSession(task); }} 
                    className="w-9 h-9 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 active:scale-90"
                >
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                </button>
            )}
            
            {/* Tombol Counter (+1) */}
            {isCounterTask && !isTimerTask && !done && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onIncrement(task); }} 
                    className="w-9 h-9 rounded-full bg-purple-600 text-white hover:bg-purple-500 flex items-center justify-center font-bold text-sm transition-all shadow-lg shadow-purple-500/20 active:scale-90"
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