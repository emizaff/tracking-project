// src/components/PublicIdeaForm.tsx
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

const API_URL = "http://localhost:3000";

export default function PublicIdeaForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('IDLE');
    
    // @ts-ignore
    const formData = new FormData(e.target);
    const payload = {
        senderName: formData.get('senderName') || "Anonim",
        content: formData.get('content')
    };

    try {
        const res = await fetch(`${API_URL}/public/ideas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        
        setStatus('SUCCESS');
        // @ts-ignore
        e.target.reset();
    } catch (err) {
        setStatus('ERROR');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/80 p-8 md:p-10 rounded-3xl border border-indigo-500/30 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
            <span className="text-4xl mb-4 block">💡</span>
            <h2 className="text-2xl font-bold text-white mb-2">Punya Ide Liar?</h2>
            <p className="text-slate-400 text-sm">Kirimkan tantangan atau saran project. Pesanmu masuk ke Admin saya!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
                <label className="block text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">Nama / Alias</label>
                <input type="text" name="senderName" placeholder="Anonim juga boleh..." 
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition" 
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">Isi Pesan</label>
                <textarea name="content" required rows={4} placeholder="Contoh: 'Coba bikin aplikasi AI dong bang!'" 
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                ></textarea>
            </div>
            
            <button type="submit" disabled={loading} 
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition transform hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2"
            >
                {loading ? <><Loader2 className="animate-spin" /> Mengirim...</> : <><Send size={18} /> Kirim ke Admin</>}
            </button>
        </form>

        {status === 'SUCCESS' && (
            <div className="mt-6 p-4 rounded-xl text-center text-sm font-bold border border-green-500/20 bg-green-500/10 text-green-400 animate-in fade-in slide-in-from-bottom-2">
                ✅ Pesan terkirim! Terima kasih idenya.
            </div>
        )}
        {status === 'ERROR' && (
            <div className="mt-6 p-4 rounded-xl text-center text-sm font-bold border border-red-500/20 bg-red-500/10 text-red-400 animate-in fade-in slide-in-from-bottom-2">
                ❌ Gagal mengirim pesan. Coba lagi nanti.
            </div>
        )}
    </div>
  );
}