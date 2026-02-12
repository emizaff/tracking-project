import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Clock, CheckCircle2, Loader2 } from 'lucide-react';

interface Task {
  id: number;
  isCompleted: boolean;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  priority?: string;
  startDate?: string;
  tasks?: Task[];
}

export default function PublicProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Panggil endpoint /public/projects
    api.getPublic('/public/projects')
      .then((res: any) => {
        // 🔥 FIX LOGIC DATA PARSING:
        if (Array.isArray(res)) {
           setProjects(res);
        } 
        else if (res && res.data && Array.isArray(res.data)) {
           setProjects(res.data);
        } 
        else {
           console.error("Format data tidak sesuai ekspektasi:", res);
           setProjects([]);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data project:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getProgress = (tasks: Task[] | undefined) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.isCompleted).length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (loading) return (
    <div className="py-20 flex justify-center text-[#f01036]">
        <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );
  
  if (projects.length === 0) return (
    <div className="py-10 text-center border border-dashed border-[#333] rounded-xl bg-[#0a0a0a]">
        <p className="text-[#666]">Belum ada proyek yang dipublikasikan.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map(project => {
        const percent = getProgress(project.tasks);
        const isDone = percent === 100 && (project.tasks?.length || 0) > 0;

        return (
          <div key={project.id} className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 hover:border-[#f01036]/40 hover:shadow-[0_0_20px_rgba(240,16,54,0.1)] transition-all group relative overflow-hidden">
            
            <div className="flex justify-between items-start mb-4">
              <div>
                {/* Priority Badge */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    project.priority === 'HIGH' ? 'text-red-400 bg-red-900/20 border-red-900/50' : 
                    project.priority === 'LOW' ? 'text-blue-400 bg-blue-900/20 border-blue-900/50' :
                    'text-yellow-400 bg-yellow-900/20 border-yellow-900/50'
                }`}>
                  {project.priority || "NORMAL"}
                </span>
                
                <h3 className="text-xl font-bold text-white mt-2 group-hover:text-[#f01036] transition-colors">
                  {project.title}
                </h3>
              </div>
              
              {/* Percentage */}
              <div className="text-right">
                <span className={`text-2xl font-black ${isDone ? 'text-green-500' : 'text-white'}`}>{percent}%</span>
              </div>
            </div>

            <p className="text-[#888] text-sm mb-6 line-clamp-2 h-10">
              {project.description || "Project ini sedang dikerjakan."}
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden mb-4 border border-[#222]">
              <div 
                className={`h-full transition-all duration-1000 ${isDone ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-[#f01036] shadow-[0_0_10px_rgba(240,16,54,0.5)]'}`} 
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            {/* Footer Info */}
            <div className="flex justify-between items-center text-xs text-[#555] border-t border-[#222] pt-3">
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>{project.startDate ? new Date(project.startDate).toLocaleDateString('id-ID') : 'On Going'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className={isDone ? "text-green-500" : ""} />
                <span>{(project.tasks || []).filter((t:any) => t.isCompleted).length} / {project.tasks?.length || 0} Task</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}