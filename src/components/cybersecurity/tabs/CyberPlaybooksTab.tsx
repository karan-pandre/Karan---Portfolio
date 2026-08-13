import React from 'react';
import { Terminal, Play, ShieldAlert, CheckCircle2, Shield, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { soundFx } from '../../../utils/soundEffects';

interface CyberPlaybooksTabProps {
  onExecuteCommand: (cmd: string) => void;
  onShowToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export const CyberPlaybooksTab: React.FC<CyberPlaybooksTabProps> = ({
  onExecuteCommand,
  onShowToast
}) => {
  const playbooks = [
    {
      id: 'pb-1',
      title: 'DEFCON 1 — Critical Breach Emergency Isolation',
      category: 'Emergency Containment',
      riskLevel: 'CRITICAL',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
      description: 'Used during verified active ransomware or unauthorized C2 egress. Immediately isolates host, blocks IOCs, and collects volatile RAM dumps.',
      steps: [
        '1. Detect C2 Beaconing / Unverified Privileged Kerberos Logon',
        '2. Isolate Compromised Host via 802.1X Quarantine VLAN',
        '3. Enforce Edge BGP Null-Route on Destination IP',
        '4. Extract Volatile RAM Memory Dump for Triage',
        '5. Auto-Generate CISO Post-Mortem Audit Report'
      ],
      cmd: 'auto-contain high severity incidents'
    },
    {
      id: 'pb-2',
      title: 'DEFCON 2 — Active Threat Subnet Triage & Patching',
      category: 'Threat Response',
      riskLevel: 'HIGH',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      description: 'Used during high vulnerability exposure windows or active brute-force probes. Scans subnets and auto-patches high confidence CVEs.',
      steps: [
        '1. Initiate Suricata IDS Anomaly Hunt Across Subnet 10.0.1.0/24',
        '2. Match Active Probes Against Known CVE Matrix',
        '3. Apply Automated Safe Patches for High Confidence Vulns',
        '4. Flush Suspicious ARP Cache Tables'
      ],
      cmd: 'run autonomous threat hunting'
    },
    {
      id: 'pb-3',
      title: 'Ransomware Outbreak Auto-Containment Pipeline',
      category: 'Malware Defense',
      riskLevel: 'CRITICAL',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
      description: 'Triggered when high-entropy file encryption activity is detected across file shares or endpoint storage.',
      steps: [
        '1. Terminate High Entropy File-System Process Spawns',
        '2. Sever SMB Port 445 / RDP Port 3389 Connections',
        '3. Freeze Volume Shadow Copy (VSS) Deletion Requests',
        '4. Quarantine Endpoint & Alert On-Call SOC Incident Lead'
      ],
      cmd: 'block suspicious egress IP 185.220.101.5'
    },
    {
      id: 'pb-4',
      title: 'Phishing & Credential Compromise Mitigation',
      category: 'Identity Security',
      riskLevel: 'MEDIUM',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
      description: 'Used when OAuth token hijacking or suspicious Kerberos TGT ticket requests are logged from unmanaged IPs.',
      steps: [
        '1. Invalidate All Active User OAuth Refresh Tokens',
        '2. Enforce Immediate Step-Up MFA Challenge',
        '3. Purge Malicious Email Attachments Across All Mailboxes',
        '4. Audit Active Directory Admin Group Membership'
      ],
      cmd: 'analyze logs for brute-force attack'
    }
  ];

  return (
    <div className="space-y-6 font-mono selection:bg-emerald-500 selection:text-black">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <span>Autonomous Playbooks & Incident Workflows</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Pre-engineered defense pipelines for rapid threat containment and automated incident response.
          </p>
        </div>
      </div>

      {/* Playbook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playbooks.map(pb => (
          <div
            key={pb.id}
            className={`p-6 rounded-2xl border shadow-2xl space-y-4 flex flex-col justify-between ${pb.color}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
                  {pb.category}
                </span>

                <span className="px-2.5 py-0.5 rounded text-[9px] font-black bg-slate-900 border border-slate-800">
                  {pb.riskLevel}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{pb.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{pb.description}</p>

              {/* Steps List */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-2 text-xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Workflow Execution Sequence:
                </div>
                {pb.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-200 text-[11px] font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  soundFx.playSuccess();
                  onExecuteCommand(pb.cmd);
                  onShowToast('Playbook Dispatched', `Executing automated workflow: "${pb.title}"`, 'success');
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-purple-300" />
                <span>Execute Full Playbook Routine</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
