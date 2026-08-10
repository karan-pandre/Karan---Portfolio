import React from 'react';
import { 
  Award, CheckCircle2, Shield, Flame, Terminal, Check, Star 
} from 'lucide-react';
import { CyberLabItem } from '../../../types/cybersecurity';

interface CyberLabsTabProps {
  labs: CyberLabItem[];
}

export const CyberLabsTab: React.FC<CyberLabsTabProps> = ({ labs }) => {
  const completedCount = labs.filter(l => l.status === 'Completed').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Practical Security Labs & CTF Challenge Log</span>
          </h2>
          <p className="text-xs text-slate-400">
            Hands-on vulnerability exploitation, packet forensics, and SOC triage challenge walkthroughs.
          </p>
        </div>
      </div>

      {/* Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Labs Solved</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{completedCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Platforms Covered</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">4 Platforms</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">TryHackMe Rank</span>
          <div className="text-2xl font-black text-amber-400 font-mono">Top 5%</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Skills Practiced</span>
          <div className="text-2xl font-black text-purple-400 font-mono">18 Skills</div>
        </div>
      </div>

      {/* Labs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {labs.map((lab) => (
          <div
            key={lab.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {lab.platform}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  lab.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-300' :
                  lab.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {lab.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-sans">{lab.name}</h3>
              <p className="text-xs text-slate-400 font-sans italic bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                "{lab.notes}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 font-mono text-xs">
              <div className="flex flex-wrap gap-1">
                {lab.skillsPracticed.map((sk, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 text-[10px] font-bold border border-slate-800">
                    {sk}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Completed: {lab.dateCompleted}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
