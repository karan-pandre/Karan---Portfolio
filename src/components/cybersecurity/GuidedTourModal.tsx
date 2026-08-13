import React, { useState } from 'react';
import { Shield, ChevronRight, ChevronLeft, X, Activity, Flame, Terminal, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInteractiveDemo: () => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onStartInteractiveDemo
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to SOC Command Center',
      icon: Shield,
      badge: '60-Second Overview',
      subtitle: 'Enterprise Blue-Team Security Operations Platform',
      description: 'Monitor, investigate, contain, remediate, and report security threats across your hybrid infrastructure from one unified workspace.',
      points: [
        'Real-time Threat & Incident Triage',
        'Interactive D3 Network Topology Heatmaps',
        'Autonomous AI Agent Command Line Interface (CLI)',
        'CISO-Ready Executive PDF Audit Reports'
      ]
    },
    {
      title: 'Real-Time Posture & Health Overview',
      icon: Activity,
      badge: 'Step 1 of 4',
      subtitle: 'Executive & Operational Dashboard',
      description: 'The Overview dashboard gives you a live reading of your Composite Security Health Score, active threat vectors, unpatched CVEs, and priority analyst recommendations.',
      points: [
        'Security Health Score (94/100 default)',
        'Live UTC Operations Clock',
        'Priority Threat & Incident Alert Banners',
        'Firestore State Persistence'
      ]
    },
    {
      title: 'Investigation & Threat Hunting',
      icon: Flame,
      badge: 'Step 2 of 4',
      subtitle: 'Triage, Containment & Network Context',
      description: 'Drill down into detected anomaly probes, triage Kerberos credential attacks, inspect D3 subnets, and isolate compromised hosts with explicit confirmation workflows.',
      points: [
        'MITRE ATT&CK Tactic Mapping',
        'Interactive Asset Detail Drawers',
        'D3 Node Selection & Network Telemetry',
        'One-Click Host Isolation'
      ]
    },
    {
      title: 'AI Automation & Pro-Tips Playbooks',
      icon: Terminal,
      badge: 'Step 3 of 4',
      subtitle: 'Autonomous AI SOC CLI Agent',
      description: 'Interact with the AI Agent in natural language or execute DEFCON 1-3 playbooks. Enable Auto-Remediation on enterprise security tools to patch safe high-confidence CVEs automatically.',
      points: [
        'Natural Language Command Parsing',
        'Firestore-Synced Command History',
        'DEFCON Playbook Sequences',
        'Universal Command Palette (⌘K)'
      ]
    },
    {
      title: 'Interactive Guided Scenario Demo',
      icon: Sparkles,
      badge: 'Step 4 of 4',
      subtitle: 'Full End-to-End Simulation Mode',
      description: 'Experience a complete 9-step simulated attack lifecycle: Detection ➔ Investigation ➔ Incident Creation ➔ Containment ➔ IOC Block ➔ Remediation ➔ CISO PDF Report.',
      points: [
        'Safe, simulated environment (No real network impact)',
        'Educational step-by-step guidance',
        'Hands-on SOC analyst workflow practice'
      ]
    }
  ];

  const step = tourSteps[currentStep];
  const IconComp = step.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-xl bg-[#0c1322] border border-emerald-500/40 rounded-2xl p-6 space-y-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <IconComp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{step.badge}</span>
              <h3 className="text-sm font-bold text-white">{step.title}</h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 font-sans text-xs">
          <div>
            <h4 className="text-xs font-bold text-emerald-300 font-mono">{step.subtitle}</h4>
            <p className="text-slate-300 leading-relaxed mt-1">{step.description}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Key Platform Features:</span>
            {step.points.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-emerald-400' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => {
                  soundFx.playCyberBlip();
                  setCurrentStep(prev => prev - 1);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            {currentStep < tourSteps.length - 1 ? (
              <button
                onClick={() => {
                  soundFx.playCyberBlip();
                  setCurrentStep(prev => prev + 1);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1 shadow-md"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFx.playSuccess();
                  onClose();
                  onStartInteractiveDemo();
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Launch Interactive Demo Mode</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
