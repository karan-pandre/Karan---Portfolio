import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Terminal, Search, Play, Pause, RefreshCw, ShieldAlert, ShieldCheck, 
  Copy, Download, Upload, Zap, Activity, AlertTriangle, Lock, Unlock, 
  Filter, Layers, Cpu, Server, CheckCircle2, ChevronRight, FileCode, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { soundFx } from '../utils/soundEffects';

interface SplunkSIEMEngineProps {
  darkMode: boolean;
  isAdmin?: boolean;
  onRequireAdmin?: () => void;
}

interface SIEMLogEntry {
  id: string;
  timestamp: string;
  index: 'firewall' | 'syslog' | 'web' | 'edr' | 'iam';
  sourcetype: string;
  srcIp: string;
  dstIp: string;
  user: string;
  action: 'PERMIT' | 'DENY' | 'FAIL' | 'SUCCESS' | 'ALERT';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  raw: string;
  mitreTactic: string;
  country: string;
}

export const SplunkSIEMEngine: React.FC<SplunkSIEMEngineProps> = ({ 
  darkMode, 
  isAdmin = false, 
  onRequireAdmin 
}) => {
  // SPL Search State
  const [splQuery, setSplQuery] = useState<string>(
    'index=firewall sourcetype=cisco:asa action=DENY | stats count by srcIp, action | table srcIp, count, action'
  );
  const [activePreset, setActivePreset] = useState<string>('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Real-Time Streaming State
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1); // 1x, 5x, 10x
  const [logLogsCount, setLogLogsCount] = useState<number>(14820);

  // Cisco Router ACL State
  const [blockedIps, setBlockedIps] = useState<Set<string>>(new Set(['198.51.100.42', '185.220.101.5']));
  const [cliInput, setCliInput] = useState<string>('');
  const [cliTerminalOutput, setCliTerminalOutput] = useState<string[]>([
    'Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.7(3)M2',
    'Router-Core-HQ# show ip access-lists',
    'Extended IP access list BLOCK_ATTACKERS',
    '    10 deny ip host 198.51.100.42 any log (142 matches)',
    '    20 deny ip host 185.220.101.5 any log (85 matches)',
    '    30 permit ip any any (14209 matches)'
  ]);

  // Initial Mock Splunk Ingestion Logs
  const [logs, setLogs] = useState<SIEMLogEntry[]>([
    {
      id: 'LOG-9001',
      timestamp: new Date(Date.now() - 1000 * 20).toISOString(),
      index: 'syslog',
      sourcetype: 'linux:auth',
      srcIp: '198.51.100.42',
      dstIp: '10.0.1.15',
      user: 'root',
      action: 'FAIL',
      severity: 'CRITICAL',
      raw: '2026-08-07T06:12:01Z AUTH_FAIL srcIp=198.51.100.42 user=root port=22 attempts=142 ssh2',
      mitreTactic: 'Credential Access (T1110)',
      country: 'RU'
    },
    {
      id: 'LOG-9002',
      timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
      index: 'web',
      sourcetype: 'nginx:access',
      srcIp: '185.220.101.5',
      dstIp: '10.0.2.80',
      user: 'anonymous',
      action: 'DENY',
      severity: 'CRITICAL',
      raw: '2026-08-07T06:12:15Z NGINX GET /api/users?id=1%20UNION%20SELECT%20username,password%20FROM%20admin 403',
      mitreTactic: 'Exploit Public App (T1190)',
      country: 'CN'
    },
    {
      id: 'LOG-9003',
      timestamp: new Date(Date.now() - 1000 * 90).toISOString(),
      index: 'firewall',
      sourcetype: 'cisco:asa',
      srcIp: '45.33.21.110',
      dstIp: '10.0.4.88',
      user: 'system',
      action: 'DENY',
      severity: 'HIGH',
      raw: '2026-08-07T06:12:30Z %ASA-2-106001: Inbound TCP connection denied from 45.33.21.110/443 to 10.0.4.88/80',
      mitreTactic: 'Exfiltration (T1041)',
      country: 'US'
    },
    {
      id: 'LOG-9004',
      timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
      index: 'iam',
      sourcetype: 'aws:cloudtrail',
      srcIp: '10.0.2.14',
      dstIp: '10.0.0.1',
      user: 'operator_04',
      action: 'FAIL',
      severity: 'MEDIUM',
      raw: '2026-08-07T06:12:45Z IAM_MOD user=operator_04 action=GRANT_ROLE role=SuperAdmin status=DENIED',
      mitreTactic: 'Privilege Escalation (T1078)',
      country: 'IN'
    },
    {
      id: 'LOG-9005',
      timestamp: new Date(Date.now() - 1000 * 180).toISOString(),
      index: 'web',
      sourcetype: 'nginx:access',
      srcIp: '10.0.1.50',
      dstIp: '10.0.2.80',
      user: 'analyst_karan',
      action: 'PERMIT',
      severity: 'LOW',
      raw: '2026-08-07T06:13:00Z NGINX GET /portfolio/projects HTTP/1.1 200 OK user_agent="Mozilla/5.0"',
      mitreTactic: 'Authorized Request',
      country: 'IN'
    }
  ]);

  // Real-Time Log Streaming Effect
  useEffect(() => {
    if (!isStreaming) return;

    const intervalTime = Math.max(200, 2500 / streamSpeed);
    const streamInterval = setInterval(() => {
      const randomIps = ['198.51.100.42', '185.220.101.5', '45.33.21.110', '192.168.1.105', '10.0.1.50', '203.0.113.88'];
      const sourcetypes = ['cisco:asa', 'linux:auth', 'nginx:access', 'crowdstrike:falcon', 'aws:cloudtrail'];
      const indices: ('firewall' | 'syslog' | 'web' | 'edr' | 'iam')[] = ['firewall', 'syslog', 'web', 'edr', 'iam'];
      const actions: ('PERMIT' | 'DENY' | 'FAIL' | 'SUCCESS')[] = ['DENY', 'FAIL', 'PERMIT', 'SUCCESS', 'DENY'];
      const severities: ('CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

      const chosenIp = randomIps[Math.floor(Math.random() * randomIps.length)];
      const chosenIndex = indices[Math.floor(Math.random() * indices.length)];
      const chosenAction = actions[Math.floor(Math.random() * actions.length)];
      const chosenSev = chosenAction === 'DENY' || chosenAction === 'FAIL' ? (Math.random() > 0.4 ? 'CRITICAL' : 'HIGH') : 'LOW';

      const newEntry: SIEMLogEntry = {
        id: `LOG-${Date.now().toString().slice(-5)}`,
        timestamp: new Date().toISOString(),
        index: chosenIndex,
        sourcetype: sourcetypes[Math.floor(Math.random() * sourcetypes.length)],
        srcIp: chosenIp,
        dstIp: `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 250)}`,
        user: chosenSev === 'CRITICAL' ? 'root' : 'user_' + Math.floor(Math.random() * 99),
        action: chosenAction,
        severity: chosenSev,
        raw: `${new Date().toISOString()} index=${chosenIndex} srcIp=${chosenIp} action=${chosenAction} severity=${chosenSev} msg="Splunk ingested real-time telemetry log"`,
        mitreTactic: chosenSev === 'CRITICAL' ? 'T1110 Credential Access' : chosenSev === 'HIGH' ? 'T1190 Exploit' : 'Normal',
        country: chosenIp.startsWith('198') ? 'RU' : chosenIp.startsWith('185') ? 'CN' : 'IN'
      };

      setLogs(prev => [newEntry, ...prev.slice(0, 49)]);
      setLogLogsCount(c => c + 1);
    }, intervalTime);

    return () => clearInterval(streamInterval);
  }, [isStreaming, streamSpeed]);

  // Execute SPL Search Query Filter
  const filteredLogs = useMemo(() => {
    if (!splQuery.trim()) return logs;

    const lowerQuery = splQuery.toLowerCase();
    
    return logs.filter(log => {
      if (lowerQuery.includes('index=firewall') && log.index !== 'firewall') return false;
      if (lowerQuery.includes('index=syslog') && log.index !== 'syslog') return false;
      if (lowerQuery.includes('index=web') && log.index !== 'web') return false;
      if (lowerQuery.includes('action=deny') && log.action !== 'DENY') return false;
      if (lowerQuery.includes('action=fail') && log.action !== 'FAIL') return false;
      if (lowerQuery.includes('severity=critical') && log.severity !== 'CRITICAL') return false;

      // Free text search inside raw string
      const searchTerms = lowerQuery.split('|')[0].replace(/index=\w+|sourcetype=[\w:]+|action=\w+|severity=\w+/g, '').trim().split(/\s+/).filter(Boolean);
      for (const term of searchTerms) {
        if (!log.raw.toLowerCase().includes(term) && !log.srcIp.includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [logs, splQuery]);

  // Chart Analytics Data Generator
  const timeSeriesData = useMemo(() => {
    return [
      { time: '10:00', totalEvents: 1420, threats: 320, denied: 310 },
      { time: '10:05', totalEvents: 1850, threats: 410, denied: 395 },
      { time: '10:10', totalEvents: 2400, threats: 890, denied: 870 },
      { time: '10:15', totalEvents: 1950, threats: 520, denied: 500 },
      { time: '10:20', totalEvents: 3100, threats: 1250, denied: 1220 },
      { time: '10:25', totalEvents: 2800, threats: 940, denied: 910 },
    ];
  }, []);

  // Preset SPL Handlers
  const handleApplySPLPreset = (name: string, query: string) => {
    soundFx.playCyberBlip();
    setActivePreset(name);
    setSplQuery(query);
  };

  // Cisco ACL Toggle Handler
  const handleToggleBlockIp = (ip: string) => {
    soundFx.playCyberBlip();
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    const nextSet = new Set(blockedIps);
    let actionLog = '';
    
    if (nextSet.has(ip)) {
      nextSet.delete(ip);
      actionLog = `Router-Core-HQ(config-ext-nacl)# no deny ip host ${ip} any log`;
    } else {
      nextSet.add(ip);
      actionLog = `Router-Core-HQ(config-ext-nacl)# deny ip host ${ip} any log [SUCCESS: ACL Enforced]`;
    }

    setBlockedIps(nextSet);
    setCliTerminalOutput(prev => [actionLog, 'Router-Core-HQ# show ip access-lists', ...prev]);
  };

  // CLI Command Execution Simulator
  const handleRunCliCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    soundFx.playCyberBlip();
    const cmd = cliInput.trim();

    if (!isAdmin && (cmd.toLowerCase().includes('deny') || cmd.toLowerCase().includes('config') || cmd.toLowerCase().includes('no'))) {
      if (onRequireAdmin) onRequireAdmin();
      setCliTerminalOutput(prev => [
        `Router-Core-HQ# ${cmd}\n% Access Denied: Router configuration changes require Admin Access. Switch to Admin Mode to execute write commands.`,
        ...prev
      ]);
      setCliInput('');
      return;
    }

    let resp = `Router-Core-HQ# ${cmd}\n% Invalid command or syntax. Try "show ip access-lists" or "ip access-list extended BLOCK_ATTACKERS"`;

    if (cmd.toLowerCase().includes('show ip access-lists')) {
      resp = `Router-Core-HQ# ${cmd}\nExtended IP access list BLOCK_ATTACKERS\n${Array.from(blockedIps).map((ip, i) => `    ${(i+1)*10} deny ip host ${ip} any log`).join('\n')}\n    ${(blockedIps.size + 1)*10} permit ip any any`;
    } else if (cmd.toLowerCase().includes('show ip interface brief')) {
      resp = `Router-Core-HQ# ${cmd}\nInterface                  IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0/0       192.168.1.1     YES NVRAM  up                    up      \nGigabitEthernet0/0/1       10.0.1.1        YES NVRAM  up                    up      `;
    } else if (cmd.toLowerCase().includes('deny ip host')) {
      resp = `Router-Core-HQ(config-ext-nacl)# ${cmd}\n% Success: Rule appended to Cisco IOS Extended ACL engine.`;
    }

    setCliTerminalOutput(prev => [resp, ...prev]);
    setCliInput('');
  };

  // Generated Cisco ACL Rules for Current Search Results
  const generatedAclScript = useMemo(() => {
    const uniqueThreatIps = Array.from(new Set(filteredLogs.filter(l => l.severity === 'CRITICAL' || l.severity === 'HIGH').map(l => l.srcIp)));
    if (uniqueThreatIps.length === 0) {
      return '! Cisco Router ACL Policy\n! No active threat IPs matched in search query.';
    }
    return `! Cisco IOS Router Extended Access Control List (ACL)\n! Generated dynamically from Splunk SPL Query Results\nconfigure terminal\nip access-list extended BLOCK_SPLUNK_THREATS\n${uniqueThreatIps.map(ip => ` deny ip host ${ip} any log`).join('\n')}\n permit ip any any\nexit\ninterface GigabitEthernet0/0/0\n ip access-group BLOCK_SPLUNK_THREATS in\nend\nwrite memory`;
  }, [filteredLogs]);

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border shadow-2xl transition-all ${
      darkMode ? 'bg-[#090d16] border-white/10 text-slate-100' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Splunk Enterprise Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
            <Activity className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Splunk Enterprise SIEM & Cisco Router ACL Engine
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Feature Complete
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time Splunk Processing Language (SPL) console, live syslog stream tail, MITRE ATT&CK mapping & Cisco Router IOS ACL block automation.
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10">
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span className="text-slate-300">
              Ingested: <strong className="text-emerald-400">{logLogsCount.toLocaleString()} Logs</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              isStreaming
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'Pause Stream' : 'Resume Tail'}</span>
          </button>

          <select
            value={streamSpeed}
            onChange={(e) => setStreamSpeed(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-emerald-400 font-bold focus:outline-none"
          >
            <option value={1}>Speed: 1x</option>
            <option value={5}>Speed: 5x</option>
            <option value={10}>Speed: 10x Turbo</option>
          </select>
        </div>
      </div>

      {/* Splunk SPL Search Console */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 mb-6 shadow-inner">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-emerald-400" />
            Splunk Search Processing Language (SPL) Console
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            Supports index, sourcetype, action, stats & table filters
          </span>
        </div>

        {/* SPL Query Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={splQuery}
              onChange={(e) => setSplQuery(e.target.value)}
              placeholder="e.g. index=firewall action=DENY | stats count by srcIp"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 font-mono text-xs text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playSuccess();
              setIsSearching(true);
              setTimeout(() => setIsSearching(false), 300);
            }}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Execute SPL Search</span>
          </button>
        </div>

        {/* SPL Query Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase mr-1">SPL Presets:</span>
          
          <button
            type="button"
            onClick={() => handleApplySPLPreset('all', 'index=*')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all border ${
              activePreset === 'all' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            All Indices (index=*)
          </button>

          <button
            type="button"
            onClick={() => handleApplySPLPreset('ssh', 'index=syslog "AUTH_FAIL" | stats count by srcIp')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all border ${
              activePreset === 'ssh' ? 'bg-rose-600 text-white border-rose-400' : 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20'
            }`}
          >
            🔴 SSH Brute Force Attacks
          </button>

          <button
            type="button"
            onClick={() => handleApplySPLPreset('sqli', 'index=web "UNION SELECT" OR "DROP TABLE"')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all border ${
              activePreset === 'sqli' ? 'bg-rose-600 text-white border-rose-400' : 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
            }`}
          >
            🟠 SQL Injection & XSS Payloads
          </button>

          <button
            type="button"
            onClick={() => handleApplySPLPreset('cisco', 'index=firewall action=DENY sourcetype=cisco:asa')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all border ${
              activePreset === 'cisco' ? 'bg-blue-600 text-white border-blue-400' : 'bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20'
            }`}
          >
            🔵 Cisco ASA Firewall Denies
          </button>

          <button
            type="button"
            onClick={() => handleApplySPLPreset('iam', 'index=iam action=FAIL "GRANT_ROLE"')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all border ${
              activePreset === 'iam' ? 'bg-purple-600 text-white border-purple-400' : 'bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20'
            }`}
          >
            🟣 Privilege Escalation Alerts
          </button>
        </div>
      </div>

      {/* Splunk Visual Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Real-time Ingestion Time Series Chart */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Real-Time Ingestion Event Velocity & Threat Spikes
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Splunk Indexer Cluster: 3 Nodes</span>
          </div>

          <div className="h-[220px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="totalEvents" name="Total Ingested Events" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Area type="monotone" dataKey="threats" name="Detected Threat Events" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Threat Indicators & MITREATT&CK Stats */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Top Threat Actors & Quarantines
              </span>
              <span className="text-[10px] font-mono text-rose-400">{blockedIps.size} Blocked in ACL</span>
            </div>

            <div className="space-y-2">
              {['198.51.100.42', '185.220.101.5', '45.33.21.110'].map((ip) => {
                const isBlocked = blockedIps.has(ip);
                return (
                  <div key={ip} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span>{ip}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">SSH / SQLi Attacker</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBlockIp(ip)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        isBlocked
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                      }`}
                    >
                      {isBlocked ? 'ACL Blocked' : '+ Block in ACL'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
            💡 <strong>SOAR Integration:</strong> Executing SPL query automatically updates Cisco Router IOS Access Lists.
          </div>
        </div>

      </div>

      {/* Splunk Live Log Stream Table */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 text-xs font-mono">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Splunk Search Results ({filteredLogs.length} Events Matched)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playCyberBlip();
                const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
                const a = document.createElement('a');
                a.href = jsonStr;
                a.download = `splunk_search_results_${Date.now()}.json`;
                a.click();
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-bold flex items-center gap-1 text-[11px]"
            >
              <Download className="w-3 h-3" /> Export SPL Results (JSON)
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto max-h-72 font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] text-slate-400 uppercase">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Index</th>
                <th className="py-2 px-3">Source IP</th>
                <th className="py-2 px-3">Action</th>
                <th className="py-2 px-3">Severity</th>
                <th className="py-2 px-3">Raw Log Telemetry</th>
                <th className="py-2 px-3 text-right">ACL Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11px]">
              {filteredLogs.map((log) => {
                const isBlocked = blockedIps.has(log.srcIp);
                return (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-3 text-cyan-400 font-bold">{log.index}</td>
                    <td className="py-2 px-3 text-rose-400 font-bold">{log.srcIp}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        log.action === 'DENY' || log.action === 'FAIL' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        log.severity === 'CRITICAL'
                          ? 'bg-rose-600 text-white'
                          : log.severity === 'HIGH'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-800 text-slate-300'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300 truncate max-w-xs sm:max-w-md">
                      {log.raw}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleBlockIp(log.srcIp)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                          isBlocked
                            ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                        }`}
                      >
                        {isBlocked ? 'Blocked' : 'Block IP'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Cisco IOS Router CLI Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CLI Console Terminal */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Cisco IOS Router CLI Simulator (Router-Core-HQ)
            </span>
            <span className="text-[10px] text-slate-500">Host: 10.0.0.1 (Cisco C2900)</span>
          </div>

          <div className="p-3 rounded-xl bg-black/90 border border-white/10 text-emerald-400 max-h-48 overflow-y-auto space-y-1 font-mono text-[11px] shadow-inner">
            {cliTerminalOutput.map((out, idx) => (
              <div key={idx} className="whitespace-pre-wrap">{out}</div>
            ))}
          </div>

          <form onSubmit={handleRunCliCommand} className="flex gap-2">
            <span className="text-slate-400 font-bold self-center">Router#</span>
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              placeholder="e.g. show ip access-lists OR deny ip host 198.51.100.42 any log"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-emerald-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Run
            </button>
          </form>
        </div>

        {/* Dynamic Cisco ACL Generated Script Box */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-400" />
              Auto-Generated Cisco IOS Router ACL Code
            </span>
            <button
              type="button"
              onClick={() => {
                soundFx.playCyberBlip();
                navigator.clipboard.writeText(generatedAclScript);
                alert('Cisco IOS ACL commands copied to clipboard!');
              }}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-[10px] flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy CLI Commands
            </button>
          </div>

          <pre className="p-3 rounded-xl bg-black/80 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed overflow-x-auto max-h-48 shadow-inner">
            {generatedAclScript}
          </pre>
        </div>

      </div>

    </div>
  );
};
