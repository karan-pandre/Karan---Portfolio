import React, { useState } from 'react';
import { 
  ShieldAlert, Lock, Unlock, KeyRound, Terminal, AlertTriangle, 
  CheckCircle2, Play, RefreshCw, Cpu, Activity, Download, Eye, 
  Filter, Zap, Server, ShieldCheck, HelpCircle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/soundEffects';

interface SOARWorkbenchProps {
  darkMode: boolean;
}

interface IncidentAlert {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  sourceIp: string;
  targetAsset: string;
  timestamp: string;
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'MITIGATED';
  description: string;
  playbookSteps: string[];
  rawLogs: string[];
}

export const SOARWorkbench: React.FC<SOARWorkbenchProps> = ({ darkMode }) => {
  // Password Protection State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // SOAR Workbench Active State
  const [selectedAlertId, setSelectedAlertId] = useState<string>('INC-2026-9081');
  const [incidents, setIncidents] = useState<IncidentAlert[]>([
    {
      id: 'INC-2026-9081',
      title: 'SSH Brute Force Attack & Anomalous Logins',
      severity: 'CRITICAL',
      sourceIp: '198.51.100.42',
      targetAsset: 'Auth-Gateway-01 (10.0.1.15)',
      timestamp: '2 mins ago',
      status: 'OPEN',
      description: 'Multiple rapid SSH authentication failures detected followed by a successful login from non-standard geo-location.',
      playbookSteps: ['1. Apply Router Firewall ACL Block', '2. Revoke RBAC Auth Token', '3. Force Mandatory MFA Reset'],
      rawLogs: [
        '2026-08-07T06:12:01Z AUTH_FAIL src_ip=198.51.100.42 user=admin port=22 attempts=142',
        '2026-08-07T06:12:15Z AUTH_SUCCESS src_ip=198.51.100.42 user=admin port=22',
        '2026-08-07T06:12:30Z ANOMALY_GEO src_ip=198.51.100.42 country=UNKNOWN_VPN'
      ]
    },
    {
      id: 'INC-2026-4412',
      title: 'Potential PII Exfiltration Burst over Port 443',
      severity: 'HIGH',
      sourceIp: '10.0.4.88 (PW-LeadDB-Node)',
      targetAsset: 'External Endpoint (45.33.21.110)',
      timestamp: '8 mins ago',
      status: 'OPEN',
      description: 'Unusual outbound data transfer volume exceeding 2.4 GB within 60 seconds from customer database segment.',
      playbookSteps: ['1. Quarantined Network Subnet', '2. Rate-limit Outbound Egress', '3. Run Memory Forensic Dump'],
      rawLogs: [
        '2026-08-07T06:05:10Z DB_AUDIT table=student_leads query="SELECT * FROM pii_records"',
        '2026-08-07T06:05:32Z NET_EGRESS bytes=2576980352 src=10.0.4.88 dst=45.33.21.110:443'
      ]
    },
    {
      id: 'INC-2026-1129',
      title: 'Unauthorized RBAC Privilege Escalation Attempt',
      severity: 'MEDIUM',
      sourceIp: '10.0.2.14 (Staff-WS-09)',
      targetAsset: 'Identity & Access Manager',
      timestamp: '18 mins ago',
      status: 'OPEN',
      description: 'Standard staff user account executed policy modification script targeting SuperAdmin privileges.',
      playbookSteps: ['1. Revert Privilege Assignment', '2. Suspend Staff Account', '3. Trigger SOC Escalation Ticket'],
      rawLogs: [
        '2026-08-07T05:54:12Z IAM_MOD user=operator_04 action=GRANT_ROLE role=SuperAdmin',
        '2026-08-07T05:54:13Z AUDIT_REJECT status=DENIED_POLICY_VIOLATION'
      ]
    }
  ]);

  const [auditTerminal, setAuditTerminal] = useState<string[]>([
    '[SOAR ENGINE READY] SOAR Automated Incident Response System initialized.',
    '[MONITORING] Ingesting real-time SIEM alerts and log streams.'
  ]);

  const [activePlaybookStep, setActivePlaybookStep] = useState<number>(-1);
  const [mitigatedCount, setMitigatedCount] = useState<number>(0);

  const VALID_PASSCODES = ['karan2026', 'sec123', 'cyber2026', 'admin', 'karan'];

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (VALID_PASSCODES.includes(cleanPass)) {
      soundFx.playSuccess();
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      soundFx.playCyberBlip();
      setErrorMsg('Invalid Passcode. Hint: Try "karan2026" or "cyber2026"');
    }
  };

  const selectedAlert = incidents.find(i => i.id === selectedAlertId) || incidents[0];

  const handleExecutePlaybook = (actionName: string) => {
    soundFx.playCyberBlip();
    const timestamp = new Date().toLocaleTimeString();
    
    setAuditTerminal(prev => [
      `[${timestamp}] [EXECUTING PLAYBOOK] ${actionName} on target ${selectedAlert.targetAsset}...`,
      `[${timestamp}] [FIREWALL / ACL] Policy enforced. Threat vector contained.`,
      ...prev
    ]);

    setIncidents(prev => prev.map(inc => {
      if (inc.id === selectedAlert.id) {
        return { ...inc, status: 'MITIGATED' };
      }
      return inc;
    }));

    setMitigatedCount(c => c + 1);
  };

  return (
    <section id="soar-workbench" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono font-bold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            SOC & Security Operations (SOAR) Workbench
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Security Incident Response Simulator
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Interactive SIEM log triage, automated firewall containment playbooks, and threat mitigation workbench.
          </p>
        </div>

        {/* Workbench Container */}
        <div className={`rounded-3xl border shadow-2xl overflow-hidden ${
          darkMode ? 'bg-[#0f1117] border-white/10 text-slate-100' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}>
          
          {/* Top Status Bar */}
          <div className="p-4 bg-slate-950/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-mono font-bold text-rose-400 uppercase tracking-wider">
                  SOAR Engine v2.6 (Restricted Access)
                </span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>MTTR: <strong className="text-emerald-400">42s</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <span className="text-slate-400">Mitigated Today: <strong className="text-emerald-400">{mitigatedCount} Incidents</strong></span>
              {isUnlocked ? (
                <button
                  type="button"
                  onClick={() => setIsUnlocked(false)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold flex items-center gap-1 text-[11px]"
                >
                  <Lock className="w-3 h-3" /> Lock Workbench
                </button>
              ) : (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1 text-[11px]">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
            </div>
          </div>

          {/* Locked View - Password Prompt */}
          {!isUnlocked ? (
            <div className="p-8 sm:p-16 text-center max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500">
                <KeyRound className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold">Password Protected Security Workbench</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter candidate passcode to unlock live SIEM log triage and SOAR playbook controls.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-3">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter Passcode (e.g. karan2026)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/20 text-sm text-center font-mono text-emerald-400 tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs font-mono text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
                >
                  <Unlock className="w-4 h-4" /> Unlock Workbench
                </button>
              </form>

              {/* Passcode Hint for Recruiters */}
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1 mx-auto font-mono"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Recruiter Passcode Hint' : 'Recruiter Passcode Hint'}</span>
                </button>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-400 text-xs font-mono"
                  >
                    💡 Passcode: <strong className="text-white underline">karan2026</strong> or <strong className="text-white underline">sec123</strong>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            /* Unlocked SOAR Workspace */
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              
              {/* Left Column: Incident Feed List */}
              <div className="lg:col-span-4 p-4 space-y-3 bg-slate-950/40">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Live SIEM Alerts ({incidents.length})</span>
                  <span className="text-[10px] text-emerald-400">Stream Active</span>
                </div>

                <div className="space-y-2">
                  {incidents.map((incident) => {
                    const isSelected = incident.id === selectedAlertId;
                    const isMitigated = incident.status === 'MITIGATED';
                    return (
                      <button
                        key={incident.id}
                        type="button"
                        onClick={() => { soundFx.playCyberBlip(); setSelectedAlertId(incident.id); }}
                        className={`w-full text-left p-3 rounded-2xl border transition-all relative ${
                          isSelected 
                            ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/50' 
                            : 'bg-slate-900/50 border-white/10 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] text-slate-400">{incident.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                            isMitigated
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : incident.severity === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {isMitigated ? 'MITIGATED' : incident.severity}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-white leading-tight mb-1">
                          {incident.title}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>IP: {incident.sourceIp}</span>
                          <span>{incident.timestamp}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Incident Telemetry & Playbook Controls */}
              <div className="lg:col-span-8 p-5 space-y-5 bg-slate-900/60">
                
                {/* Selected Alert Details */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs text-emerald-400 font-bold">{selectedAlert.id}</span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{selectedAlert.title}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1 ${
                      selectedAlert.status === 'MITIGATED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {selectedAlert.status === 'MITIGATED' ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      Status: {selectedAlert.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{selectedAlert.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900 p-2.5 rounded-xl border border-white/5">
                    <div><span className="text-slate-500">Source IP:</span> <strong className="text-rose-400">{selectedAlert.sourceIp}</strong></div>
                    <div><span className="text-slate-500">Target Asset:</span> <strong className="text-slate-200">{selectedAlert.targetAsset}</strong></div>
                  </div>
                </div>

                {/* Raw SIEM Logs Terminal */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-white/10">
                    <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-emerald-400" /> Raw SIEM Telemetry Logs</span>
                    <span className="text-[10px] text-slate-500">Log Format: Syslog RFC 5424</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300 overflow-x-auto max-h-28">
                    {selectedAlert.rawLogs.map((log, idx) => (
                      <div key={idx} className="hover:bg-white/5 p-1 rounded">
                        <span className="text-slate-500 mr-2">&gt;</span>
                        <span className={log.includes('FAIL') || log.includes('ANOMALY') ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automated Playbook Execution Controls */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Automated SOAR Mitigation Playbooks
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">1-Click Execution</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleExecutePlaybook('Isolate Source IP & Router ACL')}
                      disabled={selectedAlert.status === 'MITIGATED'}
                      className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all border ${
                        selectedAlert.status === 'MITIGATED'
                          ? 'bg-slate-900 border-white/5 text-slate-500 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-md active:scale-95'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Block IP in ACL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExecutePlaybook('Revoke OAuth/RBAC Auth Token')}
                      disabled={selectedAlert.status === 'MITIGATED'}
                      className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all border ${
                        selectedAlert.status === 'MITIGATED'
                          ? 'bg-slate-900 border-white/5 text-slate-500 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500 shadow-md active:scale-95'
                      }`}
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Revoke Session Token</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExecutePlaybook('Quarantine Asset to Isolation VLAN')}
                      disabled={selectedAlert.status === 'MITIGATED'}
                      className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all border ${
                        selectedAlert.status === 'MITIGATED'
                          ? 'bg-slate-900 border-white/5 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md active:scale-95'
                      }`}
                    >
                      <Server className="w-4 h-4" />
                      <span>Isolate Subnet VLAN</span>
                    </button>
                  </div>
                </div>

                {/* Audit Console Terminal Log */}
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 font-mono text-[11px] space-y-1">
                  <div className="text-slate-400 text-[10px] font-bold uppercase">Audit Stream Log</div>
                  <div className="space-y-0.5 text-emerald-400 max-h-24 overflow-y-auto">
                    {auditTerminal.slice(0, 4).map((msg, i) => (
                      <div key={i}>&gt; {msg}</div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
