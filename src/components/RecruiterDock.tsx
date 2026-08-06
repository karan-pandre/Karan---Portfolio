import React, { useState } from 'react';
import { 
  ShieldCheck, FileText, Target, Mail, Sparkles, Copy, Check, X, ArrowUpRight, GripHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/karanData';
import { soundFx } from '../utils/soundEffects';

interface RecruiterDockProps {
  darkMode: boolean;
  onOpenBriefing: () => void;
  onOpenResume: () => void;
  onOpenATS: () => void;
}

export const RecruiterDock: React.FC<RecruiterDockProps> = ({
  darkMode,
  onOpenBriefing,
  onOpenResume,
  onOpenATS,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleCopyEmail = () => {
    soundFx.playSuccess();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragElastic={0.05}
      dragConstraints={{ left: -260, right: 10, top: -450, bottom: 10 }}
      className="fixed bottom-16 sm:bottom-6 right-2 sm:right-6 z-50 pointer-events-auto cursor-grab active:cursor-grabbing select-none"
    >
      {/* Expanded Glassmorphism Recruiter Hub Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 15, transformOrigin: 'bottom right' }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`mb-2.5 w-[270px] sm:w-[280px] rounded-2xl border shadow-2xl backdrop-blur-2xl overflow-hidden p-3 relative ${
              darkMode 
                ? 'bg-[#121212]/95 border-emerald-500/30 text-slate-100 shadow-emerald-500/10' 
                : 'bg-white/95 border-emerald-500/20 text-slate-900 shadow-xl'
            }`}
          >
            {/* Top Bar with Siri-style Header & Drag Handle */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-1.5">
                <GripHorizontal className="w-3.5 h-3.5 text-slate-400 cursor-grab active:cursor-grabbing" title="Drag anywhere" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider leading-none">Recruiter Hub</h4>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">Executive Screening</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Minimize Hub"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Action Cards */}
            <div className="space-y-1.5 text-xs">
              {/* 10-Sec Recruiter Briefing */}
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenBriefing();
                  setIsOpen(false);
                }}
                className={`w-full p-2.5 min-h-[44px] rounded-xl flex items-center justify-between gap-2 font-bold transition-all group ${
                  darkMode ? 'bg-gradient-to-r from-emerald-950/40 to-teal-900/30 hover:from-emerald-900/50 hover:to-teal-800/40 text-emerald-300 border border-emerald-500/20' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-none text-[11px] font-black">10-Sec Briefing</span>
                    <span className="text-[9px] font-normal opacity-80">Candidate snapshot</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* View ATS PDF Resume */}
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenResume();
                  setIsOpen(false);
                }}
                className={`w-full p-2.5 min-h-[44px] rounded-xl flex items-center justify-between gap-2 font-bold transition-all group ${
                  darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-none text-[11px] font-black">Printable ATS Resume</span>
                    <span className="text-[9px] font-normal opacity-80">Official PDF document</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* ATS Keyword Matcher */}
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenATS();
                  setIsOpen(false);
                }}
                className={`w-full p-2.5 min-h-[44px] rounded-xl flex items-center justify-between gap-2 font-bold transition-all group ${
                  darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-none text-[11px] font-black">ATS Keyword Matcher</span>
                    <span className="text-[9px] font-normal opacity-80">Check JD alignment</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Email Direct Copy Strip */}
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px]">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 truncate"
              >
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[150px]">{PERSONAL_INFO.email}</span>
              </a>
              <button
                onClick={handleCopyEmail}
                title="Copy Email Address"
                className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors flex items-center gap-1 text-[9px] font-bold"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Siri-Style Floating Sphere Trigger Button */}
      <motion.button
        id="btn-siri-recruiter-orb"
        onClick={() => {
          soundFx.playClick();
          setIsOpen(!isOpen);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle Recruiter Hub"
        className="relative group cursor-pointer flex items-center justify-center"
      >
        {/* Glowing Pulsing Outer Ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 opacity-70 blur-sm group-hover:opacity-100 transition-opacity animate-pulse" />

        {/* Sphere Container */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 shadow-lg shadow-emerald-500/20 flex items-center justify-center overflow-hidden border border-white/40 backdrop-blur-xl">
          
          {/* Inner Surface */}
          <div className="w-full h-full rounded-full bg-slate-950/90 dark:bg-black/90 flex items-center justify-center relative overflow-hidden">
            {/* Animated Gradient Fluid Inside Orb */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#10b981_0%,#06b6d4_50%,#3b82f6_100%)] opacity-40 group-hover:opacity-60 transition-opacity animate-spin-slow" />

            {/* Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            </div>

            {/* Online Pulse Dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 border-2 border-black rounded-full z-20" />
          </div>
        </div>

        {/* Hover Tooltip Badge */}
        {!isOpen && (
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap bg-slate-900/90 dark:bg-black/90 text-white border border-emerald-500/30 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center gap-1 backdrop-blur-md">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>Recruiter Hub (Drag)</span>
          </span>
        )}
      </motion.button>

    </motion.div>
  );
};
