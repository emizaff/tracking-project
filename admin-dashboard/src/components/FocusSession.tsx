// src/components/FocusSession.tsx
import React, { useEffect, useState, useRef } from 'react';
import type { Task } from '../types';
import { 
    Play, 
    Pause, 
    Square, 
    CheckCircle2, 
    Volume2, 
    VolumeX, 
    CloudRain, 
    Flame, 
    Moon, 
    Tv, 
    Zap, 
    Timer, 
    Brain, 
    Clock 
} from 'lucide-react';

interface Props {
  task: Task;
  onStop: (elapsedSeconds: number, isSuccess: boolean) => void;
}

export default function FocusSession({ task, onStop }: Props) {
  const savedDuration = (task.duration || 0) * 60;
  const spentSeconds = task.spentTime || 0;
  
  const initialRemaining = Math.max(0, savedDuration - spentSeconds);
  const shouldSetup = savedDuration === 0 || (savedDuration > 0 && initialRemaining <= 0);

  const [isSetupMode, setIsSetupMode] = useState(shouldSetup);
  const [targetDuration, setTargetDuration] = useState(savedDuration);
  const [isTimerMode, setIsTimerMode] = useState(savedDuration > 0);

  const [counter, setCounter] = useState(isTimerMode ? initialRemaining : 0);
  const [elapsed, setElapsed] = useState(0); 
  const [isActive, setIsActive] = useState(!shouldSetup);

  const [activeSound, setActiveSound] = useState<'none' | 'rain' | 'fire' | 'night' | 'noise'>('none');
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  const SOUNDS = {
      rain: "/sounds/rain.mp3", fire: "/sounds/fire.mp3",
      night: "/sounds/night.mp3", noise: "/sounds/noise.mp3", owl: "/sounds/owl.mp3"
  };
  const ONLINE_SOUNDS = {
      rain: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
      fire: "https://actions.google.com/sounds/v1/ambiences/fireplace.ogg",
      night: "https://actions.google.com/sounds/v1/weather/crickets_chirping.ogg",
      noise: "https://upload.wikimedia.org/wikipedia/commons/transcoded/9/98/White_Noise.ogg/White_Noise.ogg.mp3",
      owl: "https://actions.google.com/sounds/v1/animals/owl.ogg" 
  };

  const handleStartSetup = (minutes: number) => {
      const seconds = minutes * 60;
      setTargetDuration(seconds);
      
      if (minutes > 0) {
          setIsTimerMode(true);
          setCounter(seconds); 
      } else {
          setIsTimerMode(false); 
          setCounter(0);
      }
      setIsSetupMode(false);
      setIsActive(true);
  };

  const handleStop = (markAsSuccess: boolean) => {
      onStop(elapsed, markAsSuccess);
  };

  const playAudio = (audioEl: HTMLAudioElement, src: string, fallbackSrc: string) => {
      audioEl.src = src; audioEl.load();
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
          playPromise.catch(() => {
              if (audioEl.src !== fallbackSrc) { audioEl.src = fallbackSrc; audioEl.play().catch(() => {}); }
          });
      }
  };

  useEffect(() => {
      if (!ambienceRef.current) return;
      if (activeSound === 'none' || !isActive) { ambienceRef.current.pause(); } 
      else { 
          ambienceRef.current.volume = 0.5; ambienceRef.current.loop = true;
          // @ts-ignore
          playAudio(ambienceRef.current, SOUNDS[activeSound], ONLINE_SOUNDS[activeSound]);
      }
  }, [activeSound, isActive]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && !isSetupMode) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1); 
        
        if (isTimerMode) {
          setCounter((prev) => {
            if (prev <= 1) {
              if (interval) clearInterval(interval);
              setIsActive(false);
              if (ambienceRef.current) ambienceRef.current.pause();
              
              if (alarmRef.current) {
                  alarmRef.current.volume = 1.0;
                  playAudio(alarmRef.current, SOUNDS.owl, ONLINE_SOUNDS.owl);
              }

              setTimeout(() => handleStop(true), 3500); 
              return 0;
            }
            return prev - 1;
          });
        } else {
          setCounter((prev) => prev + 1); 
        }
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, isTimerMode, isSetupMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getProgress = () => {
      if (!isTimerMode || targetDuration === 0) return 0;
      return ((targetDuration - counter) / targetDuration) * 100;
  };
  const strokeDashoffset = 440 - (440 * getProgress()) / 100;

  // --- TAMPILAN 1: SETUP ---
  if (isSetupMode) {
      return (
        <div className="fixed inset-0 z-[999] bg-[#0f172a] flex flex-col items-center justify-center text-white animate-in fade-in zoom-in duration-300 font-sans p-6">
            <h2 className="text-3xl font-extrabold mb-2 text-center">Mau Fokus Berapa Lama?</h2>
            <p className="text-slate-400 mb-10 text-center max-w-md">Pilih mode untuk task: <span className="text-indigo-400 font-bold block mt-1 text-lg">{task.title}</span></p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <button onClick={() => handleStartSetup(15)} className="p-5 bg-slate-800 rounded-2xl hover:bg-indigo-600 hover:scale-105 transition border border-slate-700 hover:border-indigo-500 group text-left relative overflow-hidden">
                    <Zap className="mb-3 text-yellow-400 group-hover:text-white transition" size={32} />
                    <div className="font-bold text-lg">15 Menit</div>
                    <div className="text-xs text-slate-400 group-hover:text-indigo-200">Sprint Cepat</div>
                </button>
                <button onClick={() => handleStartSetup(25)} className="p-5 bg-slate-800 rounded-2xl hover:bg-red-600 hover:scale-105 transition border border-slate-700 hover:border-red-500 group text-left relative overflow-hidden">
                    <Timer className="mb-3 text-red-400 group-hover:text-white transition" size={32} />
                    <div className="font-bold text-lg">25 Menit</div>
                    <div className="text-xs text-slate-400 group-hover:text-red-200">Pomodoro</div>
                </button>
                <button onClick={() => handleStartSetup(60)} className="p-5 bg-slate-800 rounded-2xl hover:bg-purple-600 hover:scale-105 transition border border-slate-700 hover:border-purple-500 group text-left relative overflow-hidden">
                    <Brain className="mb-3 text-purple-400 group-hover:text-white transition" size={32} />
                    <div className="font-bold text-lg">60 Menit</div>
                    <div className="text-xs text-slate-400 group-hover:text-purple-200">Deep Work</div>
                </button>
                <button onClick={() => handleStartSetup(0)} className="p-5 bg-slate-800 rounded-2xl hover:bg-green-600 hover:scale-105 transition border border-slate-700 hover:border-green-500 group text-left relative overflow-hidden">
                    <Clock className="mb-3 text-green-400 group-hover:text-white transition" size={32} />
                    <div className="font-bold text-lg">Stopwatch</div>
                    <div className="text-xs text-slate-400 group-hover:text-green-200">Tanpa Batas</div>
                </button>
            </div>
            
            <button onClick={() => handleStop(false)} className="mt-12 text-sm font-bold text-slate-500 hover:text-white transition uppercase tracking-widest">BATAL</button>
        </div>
      );
  }

  // --- TAMPILAN 2: TIMER ---
  return (
    <div className="fixed inset-0 z-[999] bg-[#0f172a] flex flex-col items-center justify-center text-white animate-in fade-in duration-300 font-sans overflow-hidden">
      <audio ref={ambienceRef} /> <audio ref={alarmRef} />
      
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 
        ${activeSound === 'fire' ? 'bg-orange-600/20' : activeSound === 'rain' ? 'bg-blue-600/20' : activeSound === 'night' ? 'bg-purple-600/20' : 'bg-indigo-900/20'}`}>
      </div>

      <div className="relative z-10 text-center w-full max-w-lg px-6 flex flex-col h-full justify-center">
        
        {/* Header */}
        <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-400 mb-4">
                {isTimerMode ? <Timer size={12} /> : <Clock size={12} />}
                {isTimerMode ? "Focus Mode" : "Flow State"}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-2">{task.title}</h1>
        </div>

        {/* Lingkaran Timer */}
        <div className="relative w-72 h-72 mx-auto flex items-center justify-center mb-12">
            <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" viewBox="0 0 160 160">
                <circle r="70" cx="80" cy="80" fill="transparent" stroke="#1e293b" strokeWidth="6px"></circle>
                {isTimerMode && (
                    <circle r="70" cx="80" cy="80" fill="transparent" stroke="#6366f1" strokeWidth="6px" 
                        strokeDasharray="440" strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
                )}
            </svg>
            <div className="absolute flex flex-col items-center">
                <div className={`font-mono font-bold tracking-tighter text-white drop-shadow-2xl ${isTimerMode ? 'text-7xl' : 'text-7xl'}`}>
                    {formatTime(counter)}
                </div>
                {!isActive && (
                    <div className="mt-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-xs font-bold animate-pulse">
                        PAUSED
                    </div>
                )}
            </div>
        </div>

        {/* Controls Container */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 w-full max-w-sm mx-auto shadow-2xl">
            
            {/* Sound Control */}
            <div className="flex justify-between items-center mb-8 px-2">
                {['none','rain','fire','night','noise'].map(s => (
                    <button 
                        key={s} 
                        onClick={() => setActiveSound(s as any)} 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeSound === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110' : 'hover:bg-slate-700 text-slate-500 hover:text-slate-300'}`}
                        title={s}
                    >
                        {s==='none' ? <VolumeX size={20} /> : 
                         s==='rain' ? <CloudRain size={20} /> : 
                         s==='fire' ? <Flame size={20} /> : 
                         s==='night' ? <Moon size={20} /> : 
                         <Tv size={20} />}
                    </button>
                ))}
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center justify-center gap-4">
                {/* Save (Stop) */}
                <button 
                    onClick={() => handleStop(false)} 
                    className="w-14 h-14 rounded-2xl border-2 border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700 transition flex items-center justify-center group"
                    title="Simpan waktu & keluar"
                >
                    <Square size={20} fill="currentColor" className="group-hover:scale-90 transition" />
                </button>

                {/* Play/Pause */}
                <button 
                    onClick={() => setIsActive(!isActive)} 
                    className="w-20 h-20 rounded-3xl bg-white text-slate-900 hover:bg-indigo-50 transition shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center active:scale-95"
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                {/* Done (Success) */}
                <button 
                    onClick={() => handleStop(true)} 
                    className="w-14 h-14 rounded-2xl bg-green-600 text-white hover:bg-green-500 transition shadow-lg shadow-green-900/50 flex items-center justify-center group"
                    title="Selesai & Tambah Progress"
                >
                    <CheckCircle2 size={24} className="group-hover:scale-110 transition" />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}