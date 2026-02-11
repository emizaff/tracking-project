// src/pages/Dashboard.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackingService } from '../services/trackingService';
import type { Project, Task } from '../types';

// Icons
import { 
  LayoutDashboard, 
  BarChart3, 
  Inbox, 
  Lightbulb, 
  User, 
  Plus, 
  Play, 
  CheckCircle2, 
  Calendar, 
  Flag,
  Flame,
  Coffee,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

// Components
import CalendarWidget from '../components/CalendarWidget'; 
import SmartTaskInput from '../components/SmartTaskInput';
import ActionMenu from '../components/ActionMenu';         
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import CreateProjectModal from '../components/CreateProjectModal';
import SlideOver from '../components/SlideOver';
import ProductivityChart from '../components/ProductivityChart';
import LevelWidget from '../components/LevelWidget';
import FocusSession from '../components/FocusSession';
import WishlistWidget from '../components/WishlistWidget';
import ActivityHeatmap from '../components/ActivityHeatmap';
import VaultOverlay from '../components/VaultOverlay';

interface Goal {
  id: number;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  isCompleted: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [slideOpen, setSlideOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tasksOnDate, setTasksOnDate] = useState<Task[]>([]);
  const [slideTaskInput, setSlideTaskInput] = useState("");

  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
  const [userLevel, setUserLevel] = useState<{ xp: number; level: number; username: string; picture?: string; avatarUrl?: string } | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [activeTask, setActiveTask] = useState<Task | null>(null); 
  const [heatmapData, setHeatmapData] = useState<{ [date: string]: number }>({});
  
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [projectTab, setProjectTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
      if (selectedDate && slideOpen) {
          refreshSlideData(selectedDate, projects);
      }
  }, [projects]);

  const loadData = async () => {
    try {
      const [projectsData, statsData, levelData, goalsData] = await Promise.all([
          TrackingService.getProjects(),
          TrackingService.getDashboardStats(),
          TrackingService.getUserLevel(),
          TrackingService.getGoals()
      ]);
      setProjects(projectsData);
      setChartData(statsData.chartData);
      setUserLevel(levelData);
      setGoals(goalsData);

      const logMap: { [date: string]: number } = {};
      projectsData.forEach(p => {
          p.tasks.forEach(t => {
              t.logs.forEach(log => {
                  const dateStr = new Date(log.completedAt).toISOString().split('T')[0];
                  logMap[dateStr] = (logMap[dateStr] || 0) + 1;
              });
          });
      });
      setHeatmapData(logMap);
    } catch (error) { console.error(error); }
  };

  // 🔥 UPDATE WARNA PROJECT: Menggunakan aksen #f01036 dan variasi warm lainnya
  const getProjectColor = (id: number) => {
      const colors = ['bg-[#f01036]', 'bg-orange-600', 'bg-rose-600', 'bg-red-600', 'bg-[#d00e2e]', 'bg-[#b00b26]'];
      return colors[id % colors.length];
  };

  const calculateVirtualDeadline = (task: any) => {
      if (task.deadline) return new Date(task.deadline).getTime();
      const now = new Date();
      if (task.isRecurring) {
          if (task.repeatFrequency === 'DAILY') return new Date(now.setHours(23, 59, 59, 999)).getTime();
          if (task.repeatFrequency === 'WEEKLY') {
              const dayOfWeek = now.getDay(); 
              const distanceToSaturday = 6 - dayOfWeek; 
              const nextSaturday = new Date(now);
              nextSaturday.setDate(now.getDate() + distanceToSaturday);
              nextSaturday.setHours(23, 59, 59, 999);
              return nextSaturday.getTime();
          }
      }
      return 9999999999999;
  };

  const handleTaskClick = (task: Task) => {
      if (!task.isCompleted) setActiveTask(task);
      else executeTaskUpdate(task);
  };

  const executeTaskUpdate = async (task: Task) => {
    try {
        if (task.targetCount && task.targetCount > 1) {
            if ((task.currentCount || 0) < task.targetCount) await TrackingService.incrementCount(task.id);
            else await TrackingService.toggleTask(task.id); 
        } else {
            await TrackingService.toggleTask(task.id);
        }
        setActiveTask(null); 
        loadData(); 
    } catch (error) { console.error(error); }
  };

  const handleAddGoal = async (title: string, target: number, unit: string) => { 
      try { await TrackingService.createGoal(title, target, unit); loadData(); } catch (e) { console.error(e); } 
  };
  const handleIncrementGoal = async (id: number, amount: number = 1) => { 
      try { 
          const res = await TrackingService.incrementGoal(id, amount); 
          if (res.xpGained > 0) alert(`🎉 Target Tercapai! XP +${res.xpGained}`); 
          loadData(); 
      } catch (e) { console.error(e); } 
  };
  const handleDeleteGoal = async (id: number) => { 
      if(!confirm("Hapus item ini?")) return; 
      try { await TrackingService.deleteGoal(id); loadData(); } catch (e) { console.error(e); } 
  };

  const handleDateClick = (dateStr: string) => { 
      setSelectedDate(dateStr); 
      setSlideOpen(true);
      refreshSlideData(dateStr, projects);
  };

  const refreshSlideData = (dateStr: string, currentProjects: Project[]) => {
      const tOnDate = currentProjects.flatMap(p => p.tasks).filter(t => {
          if (!t.deadline) return false;
          return new Date(t.deadline).toLocaleDateString('en-CA') === dateStr;
      });
      setTasksOnDate(tOnDate);
  };

  const handleQuickTaskOnDate = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && slideTaskInput.trim()) {
          try {
              const defaultProjectId = projects.length > 0 ? projects[0].id : null;
              if (!defaultProjectId) { alert("Buat minimal 1 project dulu!"); return; }
              await TrackingService.createTask({
                  title: slideTaskInput,
                  projectId: defaultProjectId,
                  deadline: selectedDate,
                  isRecurring: false
              });
              setSlideTaskInput(""); 
              loadData(); 
          } catch (error) { console.error(error); }
      }
  };

  const toggleSelection = (id: number) => { setSelectedIds(p => p.includes(id) ? p.filter(pid => pid !== id) : [...p, id]); };
  const clearSelection = () => setSelectedIds([]);
  const promptDeleteSingle = (p: Project) => { setProjectToDelete(p); setDeleteModalOpen(true); };
  const promptDeleteBulk = () => { setProjectToDelete(null); setDeleteModalOpen(true); };
  const handleConfirmDelete = async () => { setIsDeleting(true); try { if (projectToDelete) await TrackingService.deleteProject(projectToDelete.id); else await Promise.all(selectedIds.map(id => TrackingService.deleteProject(id))); setDeleteModalOpen(false); setProjectToDelete(null); loadData(); setSelectedIds([]); } catch (e) { console.error(e); } finally { setIsDeleting(false); } };
  const getProgress = (p: Project) => { if (p.tasks.length === 0) return 0; const done = p.tasks.filter(t => t.isCompleted).length; return Math.round((done / p.tasks.length) * 100); };
  
  const getPriorityBadge = (p: string) => { 
    switch (p) { 
        case 'HIGH': return <span className="bg-red-900/30 text-red-400 px-2 py-0.5 rounded text-[10px] font-extrabold border border-red-700/50 tracking-wide mb-1 inline-flex items-center gap-1"><Flame size={10} /> RESOLUSI</span>; 
        case 'LOW': return <span className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded text-[10px] font-extrabold border border-green-700/50 tracking-wide mb-1 inline-flex items-center gap-1"><Coffee size={10} /> SANTAI</span>; 
        default: return <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-[10px] font-extrabold border border-blue-700/50 tracking-wide mb-1 inline-flex items-center gap-1"><Briefcase size={10} /> TUGAS</span>; 
    } 
  };

  const allActiveTasks = projects.flatMap(p => p.tasks.map(t => ({ 
      ...t, projectName: p.title, projectPriority: p.priority, projectId: p.id,
      virtualDeadline: calculateVirtualDeadline({ ...t, isRecurring: t.isRecurring, repeatFrequency: t.repeatFrequency }) 
  }))).filter(t => !t.isCompleted);

  const priorityTasks = allActiveTasks.sort((a, b) => {
      if (a.virtualDeadline !== b.virtualDeadline) return a.virtualDeadline - b.virtualDeadline;
      if (a.projectPriority === 'HIGH' && b.projectPriority !== 'HIGH') return -1;
      if (a.projectPriority !== 'HIGH' && b.projectPriority === 'HIGH') return 1;
      return 0;
  });

  const displayedProjects = projects.filter(p => {
      const progress = getProgress(p);
      if (projectTab === 'ACTIVE') return progress < 100 || p.tasks.length === 0;
      return progress === 100 && p.tasks.length > 0;
  });

  return (
    // 🔥 THEME BACKGROUND #090909
    <div className="min-h-screen bg-[#090909] text-white p-4 md:p-8 font-sans pb-32">
      
      {activeTask && (
          <FocusSession 
            task={activeTask}
            onStop={(elapsed, isSuccess) => { 
               TrackingService.updateProgress(activeTask.id, elapsed);
               if (isSuccess) executeTaskUpdate(activeTask);
               else loadData(); 
               setActiveTask(null); 
            }}
          />
      )}

      <VaultOverlay isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 🔥 HEADER & NAV: DI-UPDATE BIAR TOMBOL GAK ILANG DI MOBILE */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#1A1A1A] p-4 md:p-6 rounded-3xl shadow-xl border border-[#333]">
           <div className="flex items-center justify-between w-full md:w-auto gap-3 mb-4 md:mb-0">
               <div className="flex items-center gap-3">
                   {/* Logo Accent #f01036 */}
                   <div className="w-12 h-12 bg-[#f01036] rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(240,16,54,0.4)]">
                        <LayoutDashboard size={24} />
                   </div>
                   <div>
                       <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">Focus Tracker</h1>
                       <p className="text-[#888] text-xs md:text-sm">Dashboard Produktivitas</p>
                   </div>
               </div>
               
               {/* Profile Mobile (Muncul di kanan atas di HP) */}
               <div className="md:hidden" onClick={() => navigate('/profile')}>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#444] bg-[#222] flex items-center justify-center">
                        {userLevel?.picture || userLevel?.avatarUrl ? (
                            <img src={userLevel.picture || userLevel.avatarUrl} alt="User" className="w-full h-full object-cover" />
                        ) : <User size={20} className="text-[#888]" />}
                    </div>
               </div>
           </div>
           
           <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
               {/* 🔥 TOMBOL LAPORAN (Muncul Icon di Mobile) */}
               <button onClick={() => navigate('/report')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#222] border border-[#333] text-[#ccc] rounded-xl font-bold hover:bg-[#333] hover:text-white transition group" title="Lihat Laporan">
                 <BarChart3 size={18} className="text-[#f01036] group-hover:text-white transition" />
                 <span className="text-xs md:text-sm">Report</span>
               </button>

               {/* 🔥 TOMBOL INBOX (Muncul Icon di Mobile) */}
               <button onClick={() => navigate('/inbox')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#222] border border-[#333] text-[#ccc] rounded-xl font-bold hover:bg-[#333] hover:text-white transition group" title="Kotak Masuk">
                 <Inbox size={18} className="text-orange-400 group-hover:text-white transition" />
                 <span className="text-xs md:text-sm">Inbox</span>
               </button>

               {/* Tombol Ngide (Accent) */}
               <button onClick={() => setIsVaultOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f01036] text-white rounded-xl font-bold hover:bg-[#d00e2e] shadow-[0_0_10px_rgba(240,16,54,0.3)] transition">
                   <Lightbulb size={18} /> <span className="text-xs md:text-sm">Ngide</span>
               </button>
               
               <div className="hidden md:block w-px h-8 bg-[#444] mx-2"></div>

               {/* Profile Desktop */}
               <div className="hidden md:flex items-center gap-3 group relative cursor-pointer p-1 rounded-xl hover:bg-[#222] transition" onClick={() => navigate('/profile')}>
                   <div className="flex flex-col items-end mr-1">
                        <span className="text-sm font-bold text-white leading-tight">{userLevel?.username || "Guest"}</span>
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                             <span>Lv.{userLevel?.level || 1}</span>
                        </div>
                   </div>
                   <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#444] shadow-sm flex items-center justify-center bg-[#222] text-white font-bold text-lg hover:border-[#f01036] transition">
                       {userLevel?.picture || userLevel?.avatarUrl ? (
                           <img src={userLevel.picture || userLevel.avatarUrl} alt="User" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                       ) : (
                           <User size={20} className="text-[#888]" />
                       )}
                   </div>
               </div>
           </div>
        </div>

        {/* LAYOUT GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* === KOLOM UTAMA (KIRI) === */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* 1. STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userLevel && (<LevelWidget level={userLevel.level} xp={userLevel.xp} username={userLevel.username} />)}
                <div className="h-full min-h-[200px]"><ProductivityChart data={chartData} /></div>
            </div>

            {/* 2. TODAY'S FOCUS */}
            <div className="flex flex-col gap-4 relative group">
                <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                        <Flag size={18} className="text-[#f01036]" />
                        <div>
                            <h3 className="font-extrabold text-white text-lg">Today's Focus</h3>
                            <p className="text-xs text-[#888]">Task Paling Kritikal & Deadline Hari Ini</p>
                        </div>
                    </div>
                </div>
                
                {/* Scroll Button Controls */}
                {priorityTasks.length > 0 && (<><button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 bg-[#1A1A1A] border border-[#333] rounded-full shadow-lg flex items-center justify-center text-[#888] hover:text-white hover:bg-[#f01036] hover:border-[#f01036] transition md:opacity-0 md:group-hover:opacity-100"><ChevronLeft size={20} /></button><button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 bg-[#1A1A1A] border border-[#333] rounded-full shadow-lg flex items-center justify-center text-[#888] hover:text-white hover:bg-[#f01036] hover:border-[#f01036] transition md:opacity-0 md:group-hover:opacity-100"><ChevronRight size={20} /></button></>)}
                
                <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x scroll-smooth no-scrollbar">
                    {priorityTasks.length === 0 ? (
                        <div className="w-full text-center text-[#666] py-10 bg-[#1A1A1A] rounded-2xl border border-dashed border-[#333]">
                            <Coffee size={40} className="mx-auto mb-3 opacity-50" />
                            <p>Tidak ada task mendesak. Santuy! ☕️</p>
                        </div>
                    ) : (
                        priorityTasks.map(task => {
                            const isCounter = (task.targetCount || 1) > 1;
                            const progress = isCounter ? Math.round(((task.currentCount || 0) / (task.targetCount || 1)) * 100) : 0;
                            const hasTimer = task.duration && task.duration > 0;
                            const projectColor = getProjectColor(task.projectId); 
                            let deadlineLabel = "";
                            const diff = task.virtualDeadline - new Date().getTime();
                            const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
                            if (diffDays <= 0) deadlineLabel = "🔥 Hari Ini!"; else if (diffDays <= 7) deadlineLabel = "📅 Minggu Ini";
                            
                            return (
                            <div key={`quest-${task.id}`} className="min-w-[280px] snap-center bg-[#1A1A1A] p-5 rounded-2xl border border-[#333] shadow-lg hover:border-[#555] transition-all relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 w-1 h-full ${projectColor}`}></div>
                                <div className="flex justify-between items-start mb-2 pl-3">
                                    <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider flex items-center gap-1">
                                        {task.projectName}
                                    </span>
                                    {deadlineLabel && <span className="text-[10px] font-bold text-[#f01036] bg-[#f01036]/10 border border-[#f01036]/20 px-2 py-0.5 rounded-full">{deadlineLabel}</span>}
                                </div>
                                <h4 className="font-bold text-white mb-4 pl-3 text-lg leading-snug">{task.title}</h4>
                                <div className="flex items-center justify-between mt-auto pl-3">
                                    {isCounter ? (
                                        <div className="w-full">
                                            <div className="flex justify-between text-xs font-bold text-[#666] mb-1"><span>Progress</span><span>{task.currentCount} / {task.targetCount}</span></div>
                                            <div className="h-1.5 bg-[#333] rounded-full overflow-hidden mb-3"><div className={`h-full transition-all ${projectColor}`} style={{ width: `${progress}%` }}></div></div>
                                            <button onClick={() => handleTaskClick(task)} className={`w-full py-2 rounded-lg text-xs font-bold transition flex justify-center items-center gap-2 bg-[#333] text-[#ccc] hover:bg-[#444] hover:text-white`}>
                                                {hasTimer ? <><Play size={12} /> Mulai ({task.duration}m)</> : <><Plus size={12} /> Progress</>}
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleTaskClick(task)} className={`w-full py-2.5 border rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${hasTimer ? 'bg-[#f01036] border-[#f01036] text-white hover:bg-[#d00e2e]' : 'border-[#444] text-[#ccc] hover:bg-green-600 hover:border-green-600 hover:text-white'}`}>
                                            {hasTimer ? <><Play size={14} /> Mulai ({task.duration}m)</> : <><CheckCircle2 size={14} /> Selesaikan</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )})
                    )}
                </div>
            </div>

            {/* 3. PROJECT LIST */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Briefcase size={20} className="text-[#f01036]" /> Project
                    </h2>
                    
                    <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-[#333]">
                        <button onClick={() => setProjectTab('ACTIVE')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${projectTab === 'ACTIVE' ? 'bg-[#f01036] text-white shadow-lg' : 'text-[#888] hover:text-white'}`}>🔥 Berjalan</button>
                        <button onClick={() => setProjectTab('COMPLETED')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${projectTab === 'COMPLETED' ? 'bg-green-600 text-white shadow-lg' : 'text-[#888] hover:text-white'}`}>✅ Selesai</button>
                    </div>
                </div>

                <div onClick={() => setCreateModalOpen(true)} className="group border-2 border-dashed border-[#333] rounded-2xl p-8 text-center cursor-pointer hover:border-[#f01036] hover:bg-[#1A1A1A] transition-all">
                    <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center mx-auto mb-3 text-[#555] group-hover:text-[#f01036] group-hover:scale-110 transition">
                        <Plus size={24} />
                    </div>
                    <p className="font-bold text-[#666] group-hover:text-[#f01036]">Mulai Project Baru</p>
                </div>
                
                {displayedProjects.length === 0 && projectTab === 'COMPLETED' && (
                    <div className="text-center py-10 text-[#555]">Belum ada project yang selesai. Semangat! 💪</div>
                )}

                {displayedProjects.map(project => {
                  const percent = getProgress(project);
                  const isSelected = selectedIds.includes(project.id);
                  const projectColor = getProjectColor(project.id); 
                  const isDone = percent === 100 && project.tasks.length > 0;

                  return (
                  <div key={project.id} className={`bg-[#1A1A1A] rounded-2xl border transition-all overflow-hidden flex flex-col relative group-card ${isSelected ? 'border-[#f01036] ring-2 ring-[#f01036]/20 shadow-lg scale-[1.01]' : 'border-[#333] shadow-lg hover:border-[#555]'} ${isDone ? 'opacity-60 hover:opacity-100' : ''}`}>
                      {isSelected && <div className="absolute top-0 left-0 bg-[#f01036] text-white px-3 py-1 rounded-br-xl text-xs font-bold z-20 flex items-center gap-1"><CheckCircle2 size={12} /> Terpilih</div>}
                      {isDone && <div className="absolute top-0 right-14 bg-green-900/50 text-green-400 px-3 py-1 rounded-b-xl text-xs font-bold z-20 border border-green-800 border-t-0">🏆 TAMAT</div>}
                      
                      <div className="absolute top-4 right-4 z-20">
                          <ActionMenu type="Project" onDelete={() => promptDeleteSingle(project)} onSelect={() => toggleSelection(project.id)} />
                      </div>
                      
                      <div className="p-6 pb-4">
                        <div className="flex justify-between items-start mb-4 pr-8">
                            <div>
                                {getPriorityBadge(project.priority)}
                                <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-[#f01036]' : 'text-white'} ${isDone ? 'line-through text-[#666]' : ''}`}>{project.title}</h3>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="bg-[#222] px-2 py-1 rounded text-[#888] border border-[#333] flex items-center gap-1"><Calendar size={10} /> {new Date(project.startDate!).toLocaleDateString('id-ID')}</span>
                                    {project.deadline && (<span className="bg-[#f01036]/10 text-[#f01036] px-2 py-1 rounded border border-[#f01036]/20 flex items-center gap-1"><Flag size={10} /> {new Date(project.deadline).toLocaleDateString('id-ID')}</span>)}
                                </div>
                            </div>
                            <div className="text-right"><span className={`text-2xl font-black ${isDone ? 'text-green-500' : projectColor.replace('bg-', 'text-')}`}>{percent}%</span></div>
                        </div>
                        <div className="w-full h-2 bg-[#000] rounded-full overflow-hidden mb-5"><div className={`h-full ${isDone ? 'bg-green-500' : projectColor}`} style={{ width: `${percent}%` }}></div></div>
                        
                        <div className="space-y-3 mb-2">
                            {project.tasks.slice(0, 5).map(t => { 
                                const isCounter = (t.targetCount || 1) > 1; 
                                const hasTimer = t.duration && t.duration > 0; 
                                return (
                                <div key={t.id} className="flex items-center justify-between text-sm group/task p-2 rounded-lg hover:bg-[#222] transition cursor-pointer" onClick={() => handleTaskClick(t)}>
                                    <div className="flex items-center gap-3 w-full">
                                        <div className={`w-5 h-5 rounded flex shrink-0 items-center justify-center border transition ${t.isCompleted ? 'bg-green-600 border-green-600 text-white' : hasTimer ? 'border-[#f01036] text-[#f01036] bg-[#f01036]/10' : 'border-[#444] hover:border-[#f01036] text-transparent hover:text-[#f01036]'}`}>
                                            {t.isCompleted ? <CheckCircle2 size={12} /> : hasTimer ? <Play size={8} fill="currentColor" /> : <CheckCircle2 size={12} />}
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <span className={`${t.isCompleted ? "line-through text-[#555]" : "text-[#ccc] font-medium group-hover:text-white"}`}>{t.title}</span>
                                            <div className="flex gap-2 text-[10px] text-[#666] mt-0.5">
                                                {t.isRecurring && <span className="text-purple-400 flex items-center gap-1">↻ {t.repeatFrequency}</span>}
                                                {isCounter && (<span className="text-blue-400 font-bold bg-blue-900/20 px-1.5 rounded">{t.currentCount} / {t.targetCount} x</span>)}
                                                {(t.duration || 0) > 0 && (<span className="text-[#f01036] font-bold bg-[#f01036]/10 px-1.5 rounded">⏱ {t.duration} m</span>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                      </div>
                      
                      <div className="bg-[#111] p-4 border-t border-[#333] mt-auto">
                          {expandedProjectId === project.id ? (
                            <div className="animate-in slide-in-from-top-2">
                                <div className="mb-2 flex justify-between items-center"><span className="text-xs font-bold text-[#888] uppercase">Input Cepat</span><button onClick={() => setExpandedProjectId(null)} className="text-xs text-red-400 hover:text-red-300"><X size={14} /></button></div>
                                <SmartTaskInput projectId={project.id} onTaskCreated={loadData} projectStartDate={project.startDate} projectDeadline={project.deadline} />
                            </div>
                          ) : (
                              <div className="flex gap-3">
                                  {!isDone && <button onClick={() => setExpandedProjectId(project.id)} className="flex-1 py-2 rounded-lg border border-[#444] bg-[#222] text-[#888] text-sm font-bold hover:bg-[#333] hover:text-white transition shadow-sm flex items-center justify-center gap-2"><Plus size={14} /> Task Cepat</button>}
                                  <button onClick={() => navigate(`/projects/${project.id}`)} className={`flex-1 py-2 rounded-lg text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 transition ${isDone ? 'bg-green-600 hover:bg-green-700' : projectColor + ' hover:opacity-90'}`}>Buka Project</button>
                              </div>
                          )}
                      </div>
                  </div>
                )})}
            </div>

          </div>

          {/* === KOLOM KANAN (SIDEBAR) === */}
          <div className="lg:col-span-1 space-y-6">
              <CalendarWidget onDateClick={handleDateClick} projects={projects} />
              <WishlistWidget 
                  goals={goals} 
                  onAdd={handleAddGoal} 
                  onIncrement={handleIncrementGoal} 
                  onDelete={handleDeleteGoal}
              />
          </div>

        </div>

        {/* 4. FOOTER: HEATMAP FULL WIDTH */}
        <div className="mt-8">
            <ActivityHeatmap data={heatmapData} />
        </div>

      </div>
      
      {selectedIds.length > 0 && (<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#222] text-white px-6 py-4 rounded-full shadow-2xl z-50 flex items-center gap-6 animate-in slide-in-from-bottom-4 border border-[#444]"><div className="flex items-center gap-3"><span className="bg-[#f01036] text-xs font-bold px-2 py-1 rounded-full">{selectedIds.length}</span><span className="font-medium">Project Terpilih</span></div><div className="h-6 w-px bg-[#444]"></div><div className="flex gap-2"><button onClick={clearSelection} className="px-4 py-2 hover:bg-[#333] rounded-full text-sm font-bold text-[#ccc] transition">Batal</button><button onClick={promptDeleteBulk} className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm font-bold text-white shadow-lg shadow-red-900/50 transition flex items-center gap-2"><X size={14} /> Hapus Semua</button></div></div>)}
      
      <SlideOver isOpen={slideOpen} onClose={() => setSlideOpen(false)} title={selectedDate ? `📅 ${new Date(selectedDate).toLocaleDateString('id-ID', { dateStyle: 'full' })}` : 'Detail'}>
          <div className="space-y-4 text-[#ccc]">
              <div className="relative">
                  <input type="text" placeholder="➕ Tambah kegiatan..." className="w-full p-3 pl-4 rounded-xl bg-[#222] border border-[#333] text-white focus:outline-[#f01036] shadow-sm text-sm placeholder-[#666]" value={slideTaskInput} onChange={(e) => setSlideTaskInput(e.target.value)} onKeyDown={handleQuickTaskOnDate} />
                  <span className="absolute right-3 top-3 text-xs text-[#666]">Enter</span>
              </div>
              {tasksOnDate.length > 0 ? (
                  tasksOnDate.map(t => (
                      <div key={t.id} className="p-3 bg-[#222] border border-[#333] rounded-xl hover:border-[#f01036] cursor-pointer transition flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                              <button onClick={() => executeTaskUpdate(t)} className={`w-5 h-5 rounded border flex items-center justify-center transition ${t.isCompleted ? 'bg-green-600 border-green-600 text-white' : 'border-[#444] hover:border-[#f01036] text-transparent hover:text-[#f01036]'}`}>{t.isCompleted ? <CheckCircle2 size={12} /> : <CheckCircle2 size={12} />}</button>
                              <span className={`text-sm font-medium ${t.isCompleted ? "line-through text-[#666]" : "text-[#ccc]"}`}>{t.title}</span>
                          </div>
                      </div>
                  ))
              ) : (<div className="text-center py-8 text-[#666] text-sm">Tidak ada task di tanggal ini.</div>)}
          </div>
      </SlideOver>

      <DeleteConfirmModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title={projectToDelete ? `Hapus "${projectToDelete.title}"?` : `Hapus ${selectedIds.length} Project?`} message={projectToDelete ? "Semua data task akan hilang." : "Tindakan ini permanen."} isDeleting={isDeleting} />
      <CreateProjectModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} onSuccess={loadData} />
    </div>
  );
}