// src/pages/ProjectDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrackingService } from '../services/trackingService';
import type { Project, Task } from '../types';

// Components
import SmartTaskInput from '../components/SmartTaskInput'; 
import ActionMenu from '../components/ActionMenu';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import TaskItem from '../components/TaskItem'; 
import SlideOver from '../components/SlideOver';
import FocusSession from '../components/FocusSession';

// Icons
import { 
    ChevronLeft, 
    Calendar, 
    Flag, 
    Clock, 
    CheckCircle2, 
    ListTodo, 
    MoreVertical 
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'PROJECT' | 'TASK'>('TASK');
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [slideOpen, setSlideOpen] = useState(false);
  const [slideDate, setSlideDate] = useState<string | null>(null);
  const [tasksOnDate, setTasksOnDate] = useState<Task[]>([]);

  useEffect(() => { loadProject(); }, [id]);

  const loadProject = async () => {
    if (!id) return;
    try {
      const projects = await TrackingService.getProjects();
      const found = projects.find(p => p.id === parseInt(id));
      if (found) setProject(found);
    } catch (e) { console.error(e); }
  };

  // --- LOGIC STATISTIK ---
  const getProjectStats = () => {
      if (!project) return null;
      
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(t => t.isCompleted).length;
      const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
      
      const totalMinutesSpent = project.tasks.reduce((acc, t) => acc + (t.spentTime ? t.spentTime / 60 : 0), 0);
      const hoursSpent = Math.floor(totalMinutesSpent / 60);
      const minutesSpent = Math.floor(totalMinutesSpent % 60);

      // Hitung Countdown
      let countdownText = "Santai ☕"; 
      let countdownColor = "text-green-400";
      
      if (project.deadline) {
          const today = new Date();
          const end = new Date(project.deadline);
          today.setHours(0,0,0,0);
          end.setHours(0,0,0,0);
          
          const diffTime = end.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays < 0) {
              countdownText = `${Math.abs(diffDays)} Hari Lewat`;
              countdownColor = "text-red-400";
          } else if (diffDays === 0) {
              countdownText = "Hari Ini!";
              countdownColor = "text-red-500 animate-pulse";
          } else {
              countdownText = `${diffDays} Hari Lagi`;
              countdownColor = diffDays <= 3 ? "text-amber-400" : "text-blue-400";
          }
      }

      return {
          progress,
          completedTasks,
          totalTasks,
          timeSpent: `${hoursSpent}j ${minutesSpent}m`,
          countdownText,
          countdownColor
      };
  };

  // --- HANDLERS ---
  const handleIncrement = async (task: Task) => { await TrackingService.incrementCount(task.id); loadProject(); };
  const handleToggle = async (taskId: number) => { await TrackingService.toggleTask(taskId); loadProject(); };
  
  const startSession = (task: Task) => { setActiveTask(task); };

  const handleDeadlineClick = (dateStr: string) => {
      if (!project) return;
      setSlideDate(dateStr);
      const sameDateTasks = project.tasks.filter(t => {
          if (!t.deadline) return false;
          return new Date(t.deadline).toLocaleDateString('en-CA') === dateStr;
      });
      setTasksOnDate(sameDateTasks);
      setSlideOpen(true);
  };

  const promptDeleteTask = (task: Task) => { setDeleteType('TASK'); setItemToDelete(task); setDeleteModalOpen(true); };
  const promptDeleteProject = () => { setDeleteType('PROJECT'); setItemToDelete(project); setDeleteModalOpen(true); };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
        if (deleteType === 'TASK') { await TrackingService.deleteTask(itemToDelete.id); loadProject(); } 
        else { await TrackingService.deleteProject(itemToDelete.id); navigate('/dashboard'); }
        setDeleteModalOpen(false); setItemToDelete(null);
    } catch (e) { console.error(e); alert("Gagal menghapus."); } 
    finally { setIsDeleting(false); }
  };

  if (!project) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-500">Loading...</div>;
  const stats = getProjectStats();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans pb-32">
      
      {/* 🔥 MODAL FOKUS */}
      {activeTask && (
          <FocusSession 
            task={activeTask} 
            onStop={async (elapsedSeconds, isSuccess) => {
                await TrackingService.updateProgress(activeTask.id, elapsedSeconds);
                if (isSuccess) {
                    if (activeTask.targetCount && activeTask.targetCount > 1) {
                        if ((activeTask.currentCount || 0) < activeTask.targetCount) {
                            await TrackingService.incrementCount(activeTask.id);
                        } else {
                            await TrackingService.toggleTask(activeTask.id);
                        }
                    } else {
                        await TrackingService.toggleTask(activeTask.id);
                    }
                }
                setActiveTask(null);
                loadProject();
            }} 
          />
      )}

      <div className="max-w-4xl mx-auto">
        
        {/* NAV & MENU */}
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate('/dashboard')} className="text-sm text-slate-400 hover:text-white font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                <ChevronLeft size={16} /> Kembali
            </button>
            <div className="relative z-20"><ActionMenu type="Project" onDelete={promptDeleteProject} /></div>
        </div>
        
        {/* HEADER PROJECT */}
        <div className="bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-700 mb-8 relative overflow-hidden">
           
           <div className="mb-6 relative z-10">
              <h1 className="text-3xl font-extrabold text-white mb-3">{project.title}</h1>
              
              <div className="flex flex-wrap gap-3 text-sm font-medium">
                  {project.startDate && (
                    <span className="bg-slate-900 text-slate-400 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-700/50">
                        <Calendar size={14} /> Start: {new Date(project.startDate).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                    </span>
                  )}
                  
                  {project.deadline ? (
                      <span className="bg-red-900/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/30 flex items-center gap-2">
                        <Flag size={14} /> Deadline: {new Date(project.deadline).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                      </span>
                  ) : (
                      <span className="bg-green-900/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-900/30 flex items-center gap-2">
                        <Clock size={14} /> Tanpa Deadline
                      </span>
                  )}
              </div>

              {project.description && (
                  <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-slate-400 leading-relaxed text-sm italic">
                      "{project.description}"
                  </div>
              )}
           </div>

           {/* STATS GRID */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700/50">
               <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Progress</p>
                   <p className="text-2xl font-black text-indigo-400">{stats?.progress}%</p>
               </div>
               <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Sisa Task</p>
                   <p className="text-2xl font-black text-white">
                       {stats ? stats.totalTasks - stats.completedTasks : 0} <span className="text-sm text-slate-500 font-normal">/ {stats?.totalTasks}</span>
                   </p>
               </div>
               <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Fokus</p>
                   <p className="text-xl font-bold text-amber-500">{stats?.timeSpent}</p>
               </div>
               <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Sisa Waktu</p>
                   <p className={`text-xl font-bold ${stats?.countdownColor}`}>{stats?.countdownText}</p>
               </div>
           </div>

           {/* Progress Bar Bottom */}
           <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-900">
               <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${stats?.progress}%` }}></div>
           </div>
        </div>

        {/* INPUT FORM */}
        <div className="mb-8">
            <SmartTaskInput 
                projectId={project.id} 
                onTaskCreated={loadProject}
                projectStartDate={project.startDate}
                projectDeadline={project.deadline}
            />
        </div>

        {/* LIST TASK */}
        <div className="space-y-4">
            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider flex items-center gap-2 mb-4">
                <ListTodo size={16} /> Daftar Pekerjaan
            </h3>
            
            {project.tasks.length === 0 && (
                <div className="text-center py-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700">
                    <p className="text-slate-500 mb-2">Belum ada task di sini.</p>
                    <p className="text-sm text-slate-600">Yuk mulai ketik sesuatu di atas! 👆</p>
                </div>
            )}

            {project.tasks
                .sort((a, b) => (a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1))
                .map(task => (
                <TaskItem 
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onIncrement={handleIncrement}
                    onStartSession={startSession} 
                    onDelete={promptDeleteTask}
                    onDeadlineClick={handleDeadlineClick} 
                />
            ))}
        </div>
      </div>
      
      <SlideOver 
        isOpen={slideOpen} 
        onClose={() => setSlideOpen(false)} 
        title={slideDate ? `📅 ${new Date(slideDate).toLocaleDateString('id-ID', { dateStyle: 'full' })}` : 'Detail'}
      >
          <div className="space-y-4">
              <div className="bg-indigo-900/20 p-4 rounded-xl text-sm text-indigo-300 border border-indigo-500/20">
                  Total <b>{tasksOnDate.length} Task</b> di tanggal ini.
              </div>
              {tasksOnDate.map(t => (
                  <div key={t.id} className="p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-sm flex items-center justify-between">
                      <span className={`font-bold ${t.isCompleted ? "line-through text-slate-500" : "text-slate-200"}`}>
                         {t.title}
                      </span>
                  </div>
              ))}
          </div>
      </SlideOver>

      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deleteType === 'PROJECT' ? "Hapus Project Ini?" : "Hapus Task Ini?"}
        message={deleteType === 'PROJECT' ? "Semua data task akan hilang selamanya." : "Task akan dihapus selamanya."}
        isDeleting={isDeleting}
      />
    </div>
  );
}