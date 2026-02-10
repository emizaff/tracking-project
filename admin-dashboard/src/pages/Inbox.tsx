// src/pages/Inbox.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackingService } from '../services/trackingService';

// Import Icons
import { 
  ChevronLeft, 
  Trash2, 
  CheckCircle2, 
  User, 
  Clock, 
  Inbox as InboxIcon, 
  MessageSquareQuote 
} from 'lucide-react';

interface Idea {
  id: number;
  senderName: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export default function Inbox() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadIdeas(); }, []);

  const loadIdeas = async () => {
    try {
      const data = await TrackingService.getPublicIdeas();
      setIdeas(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleApprove = async (id: number) => {
    const confirmApprove = confirm("Tayangkan ide ini di web public?");
    if (!confirmApprove) return;
    
    await TrackingService.approveIdea(id);
    loadIdeas(); // Refresh list
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Hapus ide ini permanen?");
    if (!confirmDelete) return;

    await TrackingService.deleteIdea(id);
    loadIdeas(); // Refresh list
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="text-sm font-bold">Memuat Inbox...</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => navigate('/dashboard')} 
                className="p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white hover:border-slate-600 transition text-slate-400"
            >
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
                    Kotak Masuk <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">{ideas.length}</span>
                </h1>
                <p className="text-slate-400 text-sm">Moderasi ide dan saran dari Web Public.</p>
            </div>
        </div>

        {/* LIST IDEAS */}
        <div className="space-y-4">
          {ideas.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700 text-slate-500">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <InboxIcon size={32} className="opacity-50" />
              </div>
              <p className="font-medium">Belum ada pesan masuk.</p>
              <p className="text-xs mt-1 text-slate-600">Share link web public kamu ke teman-teman!</p>
            </div>
          ) : (
            ideas.map((item) => (
              <div key={item.id} className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${item.isApproved ? 'bg-green-900/10 border-green-900/30' : 'bg-slate-800 border-slate-700'}`}>
                
                {/* HEADER CARD */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 font-bold shadow-inner">
                            {item.senderName ? item.senderName.charAt(0).toUpperCase() : <User size={18} />}
                        </div>
                        <div>
                            <span className="font-bold text-white block leading-tight text-lg">{item.senderName}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Clock size={10} /> {new Date(item.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                        </div>
                    </div>
                    
                    {/* STATUS BADGE */}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.isApproved ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {item.isApproved ? 'Tayang ✅' : 'Pending ⏳'}
                    </span>
                </div>

                {/* CONTENT */}
                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 mb-5 relative group">
                    <MessageSquareQuote size={40} className="absolute -top-3 -left-2 text-slate-700 opacity-20 rotate-12 group-hover:text-indigo-500 group-hover:opacity-10 transition duration-500" />
                    <p className="text-slate-300 text-sm leading-relaxed relative z-10 italic">
                        "{item.content}"
                    </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-700/50">
                    {!item.isApproved && (
                        <button 
                            onClick={() => handleApprove(item.id)}
                            className="text-xs font-bold text-white bg-indigo-600 px-5 py-2.5 rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                        >
                            <CheckCircle2 size={14} /> Tayangkan
                        </button>
                    )}
                    
                    <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-xs font-bold text-red-400 bg-transparent border border-red-500/30 px-5 py-2.5 rounded-lg hover:bg-red-900/20 hover:border-red-500/50 transition flex items-center gap-2"
                    >
                        <Trash2 size={14} /> Hapus
                    </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}