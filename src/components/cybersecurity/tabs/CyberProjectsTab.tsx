import React, { useState } from 'react';
import { 
  FolderLock, Github, ExternalLink, ChevronDown, ChevronUp, ShieldCheck, Terminal, Cpu, CheckCircle2 
} from 'lucide-react';
import { CyberProjectItem } from '../../../types/cybersecurity';
import { soundFx } from '../../../utils/soundEffects';

interface CyberProjectsTabProps {
  projects: CyberProjectItem[];
}

export const CyberProjectsTab: React.FC<CyberProjectsTabProps> = ({ projects }) => {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-cyan-400" />
            <span>Cybersecurity Portfolio Projects</span>
          </h2>
          <p className="text-xs text-slate-400">
            Enterprise SOC tools, SIEM pipelines, network segmentation, and threat containment architectures.
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj) => {
          const isExpanded = expandedProjectId === proj.id;

          return (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {proj.status}
                    </span>
                    <h3 className="text-lg font-bold text-white">{proj.name}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{proj.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {proj.liveDemoUrl && (
                    <a
                      href={proj.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                      title="Launch Live Project"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      soundFx.playCyberBlip();
                      setExpandedProjectId(isExpanded ? null : proj.id);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all"
                  >
                    <span>{isExpanded ? 'Collapse Case Study' : 'Expand Case Study'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Technologies Pill Row */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Tech Stack:</span>
                {proj.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold text-[11px]">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Expandable Case Study Details */}
              {isExpanded && (
                <div className="pt-4 border-t border-slate-800 space-y-4 font-mono text-xs text-slate-300">
                  
                  {/* Objective */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Project Objective:</span>
                    <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-sans text-xs leading-relaxed">
                      {proj.objective}
                    </p>
                  </div>

                  {/* Architecture Summary */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Architecture Diagram & Data Flow:</span>
                    <div className="p-3 rounded-xl bg-black border border-emerald-500/30 text-emerald-300 font-mono text-xs leading-relaxed">
                      <Terminal className="w-4 h-4 text-emerald-400 inline mr-2" />
                      {proj.architectureSummary}
                    </div>
                  </div>

                  {/* Demonstrated Skills & Key Outcomes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Demonstrated Core Skills:</span>
                      <ul className="space-y-1">
                        {proj.demonstratedSkills.map((sk, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{sk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Measured Outcomes & Impact:</span>
                      <ul className="space-y-1">
                        {proj.keyOutcomes.map((out, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-300 font-sans">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
