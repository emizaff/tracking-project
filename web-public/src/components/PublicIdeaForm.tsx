import React, { useState } from 'react';
import { api } from '../lib/api';
import { toast } from 'sonner'; // Pakai toast biar lebih modern
import { Send, Loader2, Sparkles } from 'lucide-react';

export default function PublicIdeaForm() {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error("Isi idenya dulu dong, masa kosong?");
            return;
        }

        setLoading(true);
        try {
            // 🔥 UPDATE URL: /public/ideas (bukan /tracking/public/ideas)
            // 🔥 UPDATE METHOD: api.postPublic (agar tidak error CORS)
            const res = await api.postPublic('/public/ideas', { 
                senderName: name || "Anonymous", 
                content 
            });

            if (res && res.success) {
                setSent(true);
                toast.success("Ide berhasil dikirim! Makasih ya.");
                setContent("");
                setName("");
            } else {
                toast.error("Gagal mengirim ide. Coba lagi nanti.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Terjadi kesalahan jaringan.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) return (
        <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <Sparkles size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ide Terkirim! 🚀</h3>
            <p className="text-slate-400">Terima kasih udah berkontribusi. Ide lu bakal gue baca.</p>
            <button 
                onClick={() => setSent(false)}
                className="mt-6 text-sm text-[#f01036] hover:text-white hover:underline transition-colors"
            >
                Kirim ide lain?
            </button>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2 ml-1">
                    Nama (Opsional)
                </label>
                <input 
                    type="text" 
                    placeholder="Boleh pakai nama samaran..." 
                    className="w-full bg-[#050505] border border-[#222] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#f01036] focus:ring-1 focus:ring-[#f01036] transition-all"
                    value={name} 
                    onChange={e => setName(e.target.value)}
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2 ml-1">
                    Ide Liar Lu
                </label>
                <textarea 
                    placeholder="Contoh: Bikin fitur dark mode otomatis ikut jam matahari..." 
                    className="w-full bg-[#050505] border border-[#222] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#f01036] focus:ring-1 focus:ring-[#f01036] transition-all h-32 resize-none"
                    value={content} 
                    onChange={e => setContent(e.target.value)}
                    required
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#f01036] text-white font-bold py-3.5 rounded-xl hover:bg-[#d00e2e] transition-all shadow-[0_0_15px_rgba(240,16,54,0.3)] hover:shadow-[0_0_25px_rgba(240,16,54,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Mengirim ke Server...</span>
                    </>
                ) : (
                    <>
                        <Send size={18} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        <span>Kirim Sekarang</span>
                    </>
                )}
            </button>
        </form>
    );
}