import React, { useState } from 'react';
import { 
  Database, Cpu, BarChart3, ArrowRight, Play, CheckCircle2, 
  Terminal, Sparkles, Layers, Zap, Code2, RefreshCw, HardDrive, Filter, LineChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DataPipelineSimulatorProps {
  darkMode: boolean;
}

interface PipelineNode {
  id: string;
  name: string;
  category: string;
  tech: string[];
  status: 'idle' | 'running' | 'success';
  latency: string;
  recordsProcessed: string;
  codeSnippet: string;
  description: string;
  icon: React.ElementType;
}

export const DataPipelineSimulator: React.FC<DataPipelineSimulatorProps> = ({ darkMode }) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('parsing');
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [pipelineState, setPipelineState] = useState<Record<string, 'idle' | 'running' | 'success'>>({
    ingestion: 'success',
    parsing: 'success',
    triage: 'success',
    alerting: 'success'
  });
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '🟢 SOC SIEM Pipeline Initialized: Monitoring Cisco Router, Auth Logs, & Nginx Syslogs.',
    '⚡ Ingestion node: 185,400 security events ingested per minute.',
    '✓ Python RegEx Parsing: Decoded IP headers, flagged 18 failed SSH password attempts from 192.168.1.105.',
    '✓ SIEM Threat Rule Engine: Correlated brute-force attempt + SQLi string (Severity: CRITICAL).',
    '🛡️ Automated Isolation Triggered: Created SOC L1 Ticket & dispatched Router ACL block rule.'
  ]);

  const nodes: PipelineNode[] = [
    {
      id: 'ingestion',
      name: '1. Multi-Source Log Ingestion',
      category: 'SIEM Data Collection',
      tech: ['Syslog-ng', 'Cisco ASA Logs', 'Auth.log', 'Linux CLI'],
      status: pipelineState.ingestion,
      latency: '12ms',
      recordsProcessed: '185.4K events/sec',
      icon: HardDrive,
      description: 'Continuous ingestion of raw network traffic, authentication logs, and firewall event streams from Cisco routers and server endpoints.',
      codeSnippet: `# Continuous Syslog Collector Config
tail -f /var/log/auth.log /var/log/nginx/access.log | \\
  grep --line-buffered -E "(Failed password|UNION SELECT|DENY)" | \\
  python3 soc_log_ingestor.py --stream-mode live`
    },
    {
      id: 'parsing',
      name: '2. RegEx Threat Parsing & Cleaning',
      category: 'Python Log Parsing',
      tech: ['Python RegEx', 'Wireshark Decoders', 'Linux Shell'],
      status: pipelineState.parsing,
      latency: '18ms',
      recordsProcessed: '182.1K parsed',
      icon: Filter,
      description: 'Parses raw binary and text log payloads using regular expressions to extract Source IP, User Agent, Timestamp, and Payload signatures.',
      codeSnippet: `import re

# RegEx patterns for security threats
FAILED_AUTH = r"Failed password for (\w+) from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
SQLI_PATTERN = r"(?i)(UNION\s+SELECT|OR\s+1=1|DROP\s+TABLE)"

def parse_syslog_line(log_line):
    auth_match = re.search(FAILED_AUTH, log_line)
    if auth_match:
        user, src_ip = auth_match.groups()
        return {"event": "AUTH_FAILURE", "user": user, "ip": src_ip}
    return None`
    },
    {
      id: 'triage',
      name: '3. SIEM Correlation & Risk Scoring',
      category: 'Security Threat Engine',
      tech: ['MITRE ATT&CK', 'Risk Matrix', 'SQL Queries'],
      status: pipelineState.triage,
      latency: '8ms',
      recordsProcessed: '3 Critical Threats',
      icon: Cpu,
      description: 'Correlates log signatures against known MITRE ATT&CK tactics (Credential Access T1110, Initial Access T1190) to calculate threat severity scores.',
      codeSnippet: `// SIEM Correlation & Threat Scoring Engine
function evaluateThreatSeverity(eventGroup) {
  const failureCount = eventGroup.failedLogins;
  const hasSqlInjection = eventGroup.containsSqliPayload;

  if (failureCount >= 5 || hasSqlInjection) {
    return { severity: 'CRITICAL', score: 9.2, action: 'BLOCK_IP' };
  }
  return { severity: 'LOW', score: 2.1, action: 'LOG_ONLY' };
}`
    },
    {
      id: 'alerting',
      name: '4. SOC L1 Alerting & ACL Mitigation',
      category: 'Incident Response & Router ACL',
      tech: ['Cisco Router CLI', 'SOC L1 Dashboard', 'Python Sockets'],
      status: pipelineState.alerting,
      latency: '5ms',
      recordsProcessed: 'Instant Mitigation',
      icon: LineChart,
      description: 'Generates automated SOC L1 triage tickets and dispatches router access control list (ACL) rules to quarantine malicious IP addresses.',
      codeSnippet: `! Automated Router ACL Block Trigger
ip access-list extended BLOCK_MALICIOUS_ATTACKERS
 deny ip host 192.168.1.105 any log
 permit ip any any
! Applied automatically to Cisco Gateway Interface`
    }
  ];

  const currentNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  const runPipelineAnimation = async () => {
    setIsRunningAll(true);
    setPipelineState({
      ingestion: 'running',
      parsing: 'idle',
      triage: 'idle',
      alerting: 'idle'
    });
    setTerminalLogs(prev => [`🚀 Initiating SOC Security Threat Pipeline Simulation...`, ...prev]);

    await new Promise(r => setTimeout(r, 600));
    setPipelineState(prev => ({ ...prev, ingestion: 'success', parsing: 'running' }));
    setTerminalLogs(prev => [`✓ [1/4] Ingested 185,400 log events across Cisco ASA & Syslogs.`, ...prev]);

    await new Promise(r => setTimeout(r, 700));
    setPipelineState(prev => ({ ...prev, parsing: 'success', triage: 'running' }));
    setTerminalLogs(prev => [`✓ [2/4] Python RegEx parsing completed in 18ms. Flagged 18 SSH failures.`, ...prev]);

    await new Promise(r => setTimeout(r, 600));
    setPipelineState(prev => ({ ...prev, triage: 'success', alerting: 'running' }));
    setTerminalLogs(prev => [`✓ [3/4] SIEM Threat Engine correlated MITRE T1110 Brute-Force pattern (Score 9.2).`, ...prev]);

    await new Promise(r => setTimeout(r, 500));
    setPipelineState({
      ingestion: 'success',
      parsing: 'success',
      triage: 'success',
      alerting: 'success'
    });
    setTerminalLogs(prev => [`🛡️ [4/4] Mitigation Active: Malicious IP 192.168.1.105 quarantined via Router ACL!`, ...prev]);
    setIsRunningAll(false);
  };

  return (
    <section id="pipeline-simulator" className={`py-20 relative overflow-hidden ${
      darkMode ? 'bg-[#0E0E0E] text-slate-100' : 'bg-slate-100/70 text-slate-900'
    }`}>
      {/* Background Grid Pattern */}
      <div className={`absolute inset-0 pointer-events-none ${darkMode ? 'bg-grid-pattern opacity-20' : 'bg-grid-pattern-light opacity-30'}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>INTERACTIVE SECURITY ARCHITECTURE DEMO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            SOC SIEM Threat Pipeline & Log Analyzer
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Simulate live security log ingestion, RegEx threat parsing, MITRE ATT&CK risk scoring, and automated Cisco router ACL mitigation in real-time.
          </p>
        </div>

        {/* Pipeline Controls & Execution Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border bg-gradient-to-r from-emerald-950/30 via-slate-900/40 to-blue-950/30 border-emerald-500/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">Security Operations & Threat Triage Engine</h3>
              <p className="text-xs text-slate-400">Click any pipeline stage below to inspect real security scripts & live log telemetry</p>
            </div>
          </div>

          <button
            onClick={runPipelineAnimation}
            disabled={isRunningAll}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            {isRunningAll ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Simulating Pipeline Run...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-cyan-300 fill-cyan-300" />
                <span>Trigger End-to-End Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* Node Pipeline Flow Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = activeNodeId === node.id;
            const status = node.status;

            return (
              <motion.div
                key={node.id}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setActiveNodeId(node.id)}
                className={`p-4 rounded-2xl border cursor-pointer relative transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30' 
                    : darkMode 
                      ? 'bg-[#141414] border-white/10 hover:border-white/20' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Connector Arrow for desktop */}
                {index < nodes.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-500 dark:text-slate-600">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${
                    isSelected ? 'bg-blue-600 text-white' : darkMode ? 'bg-white/5 text-blue-400' : 'bg-slate-100 text-blue-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 ${
                    status === 'running' 
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse'
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {status === 'running' ? (
                      <>
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        PROCESSING
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        ONLINE
                      </>
                    )}
                  </span>
                </div>

                <h4 className="text-sm font-bold mb-1">{node.name}</h4>
                <p className="text-xs text-slate-400 mb-3">{node.category}</p>

                <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Latency: <strong className="text-blue-400">{node.latency}</strong></span>
                  <span className="text-slate-500">{node.recordsProcessed}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Node Details & Code Snippet View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Node Code & Architecture Deep-Dive */}
          <div className="lg:col-span-7">
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-[#141414] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-bold">{currentNode.name} Code Spec</h4>
                </div>
                <div className="flex gap-1">
                  {currentNode.tech.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed">
                {currentNode.description}
              </p>

              {/* Code Snippet Box */}
              <div className="rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/10">
                <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    <span>{currentNode.id}.py</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Production Ready</span>
                </div>
                <pre className="p-4 text-xs font-mono text-blue-300 overflow-x-auto leading-relaxed">
                  <code>{currentNode.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry & Execution Log Terminal */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border bg-[#080808] border-white/10 p-5 h-full flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-slate-200">System Telemetry Logs</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    LOG STREAMING
                  </span>
                </div>

                <div className="space-y-2.5 font-mono text-[11px] max-h-64 overflow-y-auto pr-1">
                  {terminalLogs.map((log, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-2 rounded bg-white/5 border border-white/5 text-slate-300 leading-normal"
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Memory Overhead: <strong className="text-white">124 MB</strong></span>
                <span>Average Uptime: <strong className="text-emerald-400">99.98%</strong></span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
