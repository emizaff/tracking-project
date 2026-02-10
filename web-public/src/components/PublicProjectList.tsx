// src/components/PublicProjectList.tsx
import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, Clock, Loader2, AlertTriangle } from 'lucide-react';

const API_URL = "http://localhost:3000"; 

export default function PublicProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 🔥 PERBAIKAN DISINI: Ganti '/api/projects' menjadi '/public/projects'
    fetch(`${API_URL}/public/projects`) 
      .then(res => {
        if (!res.ok) throw new Error("Gagal koneksi ke backend (404/500)");
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setError("Gagal memuat data project.");
        setLoading(false);
      });
  }, []);

  const getProgress = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.isCompleted).length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (loading) return <div className="py-10 flex justify-center text-indigo-500"><Loader2 className="animate-spin" size={32} /></div>;
  
  if (error) return (
    <div className="py-10 text-center flex flex-col items-center justify-center text-slate-500 gap-2">
        <AlertTriangle className="text-amber-500" />
        <p className="text-sm">{error}</p>
        <p className="text-xs opacity-50">Pastikan server backend jalan di port 3000</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map(project => {
        const percent = getProgress(project.tasks);
        const isDone = percent === 100 && project.tasks.length > 0;

        return (
          <div key={project.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${project.priority === 'HIGH' ? 'text-red-400 bg-red-900/20 border-red-900/50' : 'text-blue-400 bg-blue-900/20 border-blue-900/50'}`}>
                  {project.priority} Priority
                </span>
                <h3 className="text-xl font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                  {project.title}
                </h3>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-black ${isDone ? 'text-green-400' : 'text-white'}`}>{percent}%</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">
              {project.description || "Project ini sedang dikerjakan dengan sepenuh hati."}
            </p>

            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
              <div className={`h-full transition-all duration-1000 ${isDone ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }}></div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-700/50 pt-3">
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>Start: {new Date(project.startDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className={isDone ? "text-green-500" : ""} />
                <span>{project.tasks.filter((t:any) => t.isCompleted).length} / {project.tasks.length} Task</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}