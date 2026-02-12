import React, { useState } from 'react';
import { api } from '../lib/api';

export default function PublicIdeaForm() {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        setLoading(true);
        try {
            await api.post('/tracking/public/ideas', { senderName: name || "Anonymous", content });
            setSent(true);
        } catch (e) {
            alert("Gagal mengirim ide.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) return (
        <div className="text-center py-4 text-green-500 font-bold animate-in fade-in">
            🚀 Ide terkirim! Terima kasih Chyyy.
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                type="text" 
                placeholder="Nama (Opsional)" 
                className="w-full bg-[#090909] border border-[#333] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f01036] transition"
                value={name} onChange={e => setName(e.target.value)}
            />
            <textarea 
                placeholder="Tulis ide atau pesan di sini..." 
                className="w-full bg-[#090909] border border-[#333] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f01036] transition h-24 resize-none"
                value={content} onChange={e => setContent(e.target.value)}
                required
            />
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#f01036] text-white font-bold py-3 rounded-xl hover:bg-[#d00e2e] transition shadow-[0_0_10px_rgba(240,16,54,0.3)] disabled:opacity-50"
            >
                {loading ? "Mengirim..." : "Kirim Sekarang"}
            </button>
        </form>
    );
}