import React, { useState } from 'react';
import { 
  Sparkles, ShieldAlert, Search, Flame, Globe, Shield, Lock, CheckCircle2, 
  FileText, ArrowRight, ArrowLeft, RefreshCw, X, AlertTriangle, Zap, Terminal 
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface CyberDemoModeProps {
  onExitDemo: () => void;
  onNavigateToTab: (tabId: string) => void;
  onShowToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export const CyberDemoMode: React.FC<CyberDemoModeProps> = ({
  onExitDemo,
  onNavigateToTab,
  onShowToast
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hostIsIsolated, setHostIsIsolated] = useState(false);
  const [iocIsBlocked, setIocIsBlocked] = useState(false);
  const [cveIsPatched, setCveIsPatched] = useState(false);
  const [incidentStatus, setIncidentStatus] = useState<'DETECTED' | 'INVESTIGATING' | 'CONTAINED' | 'REMEDIATED' | 'RESOLVED'>('DETECTED');

  const stepsInfo = [
    {
      step: 1,
      title: 'Detection Phase: Suspicious Outbound C2 Beacon',
      whatIsHappening: 'Suricata IDS flagged high-frequency outbound DNS query entropy from internal host WIN-104 (10.0.2.45) targeting malicious IP 185.220.101.5.',
      whyItMatters: 'DNS tunneling indicates potential active malware C2 callback attempting data exfiltration.',
      whatAnalystCanDo: 'Investigate host telemetry, verify packet entropy, and triage related events.',
      actionLabel: 'Investigate Threat in Detail',
      onAction: () => {
        setIncidentStatus('INVESTIGATING');
        setCurrentStep(2);
        onShowToast('Threat Triaged', 'Analyst initiated deep memory & packet inspection on WIN-104.', 'info');
      }
    },
    {
      step: 2,
      title: 'Investigation Phase: IOC & MITRE Mapping',
      whatIsHappening: 'Deep telemetry inspection confirms MITRE T1071.004 (DNS C2) with 94% threat confidence rating.',
      whyItMatters: 'Unchecked C2 connections allow attackers to execute remote commands or move laterally.',
      whatAnalystCanDo: 'Correlate with Active Directory logs and promote threat to formal security incident INC-2026-00124.',
      actionLabel: 'Create Incident INC-2026-00124',
      onAction: () => {
        setCurrentStep(3);
        onShowToast('Incident Created', 'INC-2026-00124 generated and assigned to Lead Analyst.', 'warning');
      }
    },
    {
      step: 3,
      title: 'Incident Creation Phase: INC-2026-00124',
      whatIsHappening: 'Formal incident registered in SIEM. Severity: CRITICAL. Affected Asset: WIN-104 (10.0.2.45).',
      whyItMatters: 'Incident tracking ensures auditability, response timeline recording, and SLA enforcement.',
      whatAnalystCanDo: 'Inspect network topology heatmap to assess lateral movement risk to adjacent subnets.',
      actionLabel: 'Inspect Network Heatmap Topology',
      onAction: () => {
        setCurrentStep(4);
        onShowToast('Network Context Loaded', 'Mapped host 10.0.2.45 in D3 Heatmap topology.', 'info');
      }
    },
    {
      step: 4,
      title: 'Network Visibility Phase: D3 Topology Heatmap',
      whatIsHappening: 'Subnet 10.0.2.0/24 shows 13 suspicious connections originating from node 10.0.2.45.',
      whyItMatters: 'Neighboring HR workstation WIN-107 is in direct communication range over port 445 (SMB).',
      whatAnalystCanDo: 'Enforce network-level host isolation via Cisco ISE 802.1X quarantine VLAN.',
      actionLabel: 'Isolate Host WIN-104 from Network',
      onAction: () => {
        setHostIsIsolated(true);
        setIncidentStatus('CONTAINED');
        setCurrentStep(5);
        onShowToast('Host Isolated', 'Cisco ISE applied quarantine VLAN to WIN-104 (10.0.2.45).', 'success');
      }
    },
    {
      step: 5,
      title: 'Containment Phase: Host Isolation Enforced',
      whatIsHappening: 'WIN-104 network port isolated. Zero lateral traffic permitted. C2 beaconing halted locally.',
      whyItMatters: 'Containment prevents threat spread to Domain Controller and production databases.',
      whatAnalystCanDo: 'Block external C2 destination IP across all edge Palo Alto firewalls.',
      actionLabel: 'Enforce Firewall Drop Rule for 185.220.101.5',
      onAction: () => {
        setIocIsBlocked(true);
        setCurrentStep(6);
        onShowToast('IOC Blocked', 'Palo Alto PA-3220 rule added: DROP all traffic to 185.220.101.5.', 'success');
      }
    },
    {
      step: 6,
      title: 'IOC Blocking Phase: Edge Firewall Drop Active',
      whatIsHappening: 'IP 185.220.101.5 blacklisted across all perimeter firewalls. 17 blocked connection attempts logged.',
      whyItMatters: 'Prevents other internal hosts from reaching the malicious external server.',
      whatAnalystCanDo: 'Scan host for root cause vulnerability CVE-2026-21804 and apply patch.',
      actionLabel: 'Deploy Automated Security Patch for CVE-2026-21804',
      onAction: () => {
        setCveIsPatched(true);
        setIncidentStatus('REMEDIATED');
        setCurrentStep(7);
        onShowToast('Patch Applied', 'CVE-2026-21804 patched on WIN-104. Vulnerability resolved.', 'success');
      }
    },
    {
      step: 7,
      title: 'Remediation Phase: Root Cause CVE Patched',
      whatIsHappening: 'Vulnerability CVE-2026-21804 patched via automated agent. Post-patch integrity scan passed 100%.',
      whyItMatters: 'Closing the entry vector guarantees the exploit cannot be reused.',
      whatAnalystCanDo: 'Verify clean telemetry logs and transition incident status to RESOLVED.',
      actionLabel: 'Resolve Incident INC-2026-00124',
      onAction: () => {
        setIncidentStatus('RESOLVED');
        setCurrentStep(8);
        onShowToast('Incident Resolved', 'INC-2026-00124 officially closed with full audit history.', 'success');
      }
    },
    {
      step: 8,
      title: 'Resolution Phase: Incident Closed Successfully',
      whatIsHappening: 'Incident lifecycle complete: Detected ➔ Triaged ➔ Contained ➔ Remediated ➔ Resolved.',
      whyItMatters: 'Fast MTTR (Mean Time To Respond) minimizes security risk and operational impact.',
      whatAnalystCanDo: 'Generate CISO Executive PDF Audit Report for management compliance.',
      actionLabel: 'Generate CISO Executive PDF Report',
      onAction: () => {
        setCurrentStep(9);
        onShowToast('Report Generated', 'CISO Executive PDF Audit Report ready for export.', 'success');
      }
    },
    {
      step: 9,
      title: 'Report Generation Phase: CISO Executive PDF Ready',
      whatIsHappening: 'Comprehensive CISO PDF Report generated containing incident timeline, affected assets, IOCs, and remediation proof.',
      whyItMatters: 'Executive reporting satisfies regulatory compliance standards (ISO 27001, SOC 2 Type II).',
      whatAnalystCanDo: 'Restart demo scenario or return to live SOC Command Center.',
      actionLabel: 'Exit Demo & Return to Live SOC',
      onAction: () => {
        onExitDemo();
      }
    }
  ];

  const currentStepData = stepsInfo[currentStep - 1];

  return (
    <div className="space-y-6 font-mono selection:bg-emerald-500 selection:text-black">
      
      {/* SIMULATED DEMO ENVIRONMENT BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-emerald-900/60 border border-purple-500/40 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/30 text-purple-200 border border-purple-500/40">
                INTERACTIVE DEMO MODE
              </span>
              <span className="text-xs font-bold text-white">SIMULATED SECURITY ENVIRONMENT</span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Guided end-to-end incident lifecycle walkthrough: Detection ➔ Investigation ➔ Containment ➔ Remediation ➔ Reporting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playCyberBlip();
              setCurrentStep(1);
              setHostIsIsolated(false);
              setIocIsBlocked(false);
              setCveIsPatched(false);
              setIncidentStatus('DETECTED');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Demo
          </button>

          <button
            onClick={onExitDemo}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Exit Demo
          </button>
        </div>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-400">DEMO LIFECYCLE PROGRESS:</span>
          <span className="text-emerald-400">STEP {currentStep} OF 9</span>
        </div>

        <div className="grid grid-cols-9 gap-1.5">
          {stepsInfo.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`h-2.5 rounded-full transition-all ${
                s.step === currentStep
                  ? 'bg-emerald-400 ring-2 ring-emerald-400/50'
                  : s.step < currentStep
                  ? 'bg-emerald-600'
                  : 'bg-slate-800'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* MAIN STEP CONTENT & EDUCATIONAL EXPLANATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Step Details & Interactive Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs">
                  {currentStep}
                </span>
                <span>{currentStepData.title}</span>
              </h3>

              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                incidentStatus === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                incidentStatus === 'CONTAINED' || incidentStatus === 'REMEDIATED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {incidentStatus}
              </span>
            </div>

            {/* Educational Breakdown Cards */}
            <div className="space-y-3 font-sans text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">
                  WHAT IS HAPPENING?
                </span>
                <p className="text-slate-200 leading-relaxed font-mono text-[11px]">{currentStepData.whatIsHappening}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
                  WHY IT MATTERS?
                </span>
                <p className="text-slate-300 leading-relaxed">{currentStepData.whyItMatters}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider block">
                  WHAT THE ANALYST CAN DO?
                </span>
                <p className="text-slate-300 leading-relaxed">{currentStepData.whatAnalystCanDo}</p>
              </div>
            </div>

            {/* Primary Step Execution Trigger */}
            <div className="pt-2">
              <button
                onClick={() => {
                  soundFx.playSuccess();
                  currentStepData.onAction();
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <span>{currentStepData.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Col: Live Simulated Security Posture */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Simulated Incident Telemetry</span>
          </h4>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">Target Host Status</span>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">WIN-104 (10.0.2.45)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  hostIsIsolated ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {hostIsIsolated ? 'ISOLATED' : 'ACTIVE ON VLAN'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">Malicious Egress IOC</span>
              <div className="flex items-center justify-between">
                <span className="text-amber-300 font-bold">185.220.101.5</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  iocIsBlocked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {iocIsBlocked ? 'FIREWALL BLOCKED' : 'OPEN EGRESS'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">Root Cause CVE Patch</span>
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold">CVE-2026-21804</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  cveIsPatched ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {cveIsPatched ? 'PATCHED' : 'UNPATCHED'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateToTab('threats')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Full Threats List Tab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
