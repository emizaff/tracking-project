// web-public/src/components/TryItYourself.tsx
import React from 'react';
import { LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';

export default function TryItYourself() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-900 border border-purple-500/30 p-8 md:p-12 text-center group">
      
      {/* Background Effect */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full group-hover:bg-purple-500/30 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-pink-500/10 blur-[50px] rounded-full"></div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={12} />
          <span>Open for Everyone</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Ingin Tracking Project Lu Sendiri?
        </h2>
        
        <p className="text-slate-400 text-lg">
          Gak perlu bikin dari nol. Pakai dashboard yang sama kayak yang gue pake sekarang. Gratis, open source, dan gampang dideploy.
        </p>

        <div className="pt-4 flex justify-center">
          <a 
            href="https://tracking-project-admin.netlify.app" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            <LayoutDashboard size={20} />
            Coba Dashboard Admin
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        
        <p className="text-slate-500 text-sm mt-4">
          *Login sebagai Guest atau bikin akun baru.
        </p>
      </div>
    </div>
  );
}