import React from 'react';
import { LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';

export default function TryItYourself() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f01036]/20 via-[#0a0a0a] to-[#0a0a0a] border border-[#f01036]/30 p-8 md:p-12 text-center group">
      
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#f01036]/10 blur-[50px] rounded-full group-hover:bg-[#f01036]/20 transition-all duration-700"></div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f01036]/10 border border-[#f01036]/20 text-[#f01036] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={12} />
          <span>Open Source</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Tracking Project Lu Sendiri.
        </h2>
        
        <p className="text-[#888] text-lg">
          Gak perlu bikin dari nol. Pakai dashboard yang sama kayak yang gue pake sekarang.
        </p>

        <div className="pt-4 flex justify-center">
          <a 
            href="https://tracking-project-admin.netlify.app" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#f01036] hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(240,16,54,0.4)]"
          >
            <LayoutDashboard size={20} />
            Coba Dashboard Admin
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}