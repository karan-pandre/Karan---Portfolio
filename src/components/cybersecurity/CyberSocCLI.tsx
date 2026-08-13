import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, Sparkles, Play, CheckCircle2, ShieldAlert, Cpu, ArrowRight, CornerDownLeft, RefreshCw, Copy, Check
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface CliLogEntry {
  id: string;
  timestamp: string;
  type: 'CMD' | 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'AI';
  text: string;
}

interface CyberSocCLIProps {
  onExecuteRoutine: (commandText: string) => void;
  onShowToast?: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const PREDEFINED_COMMANDS = [
  { label: '⚡ Run Autonomous AI Threat Hunting', cmd: 'run autonomous threat hunting' },
  { label: '🔍 Scan Network Segment 10.0.1.0/24', cmd: 'scan network segment 10.0.1.0/24' },
  { label: '🛡️ Auto-Contain Critical Incidents', cmd: 'auto-contain high severity incidents' },
  { label: '📜 Analyze SIEM Logs for Brute-Force', cmd: 'analyze logs for brute-force attack' },
  { label: '🚫 Block Suspicious Egress IP 185.220.101.5', cmd: 'block suspicious egress IP 185.220.101.5' },
  { label: '📄 Auto-Generate Executive PDF Report', cmd: 'generate executive security report' }
];

export const CyberSocCLI: React.FC<CyberSocCLIProps> = ({
  onExecuteRoutine,
  onShowToast
}) => {
  const [inputCmd, setInputCmd] = useState<string>('');
  const [logs, setLogs] = useState<CliLogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'AI',
      text: '🤖 SOC AI Autonomous Agent Engine initialized v4.2. Ready for security analyst commands.'
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'INFO',
      text: 'Connected to Suricata IDS, Splunk SIEM, Palo Alto BGP Edge, and Cisco Router ACL telemetry.'
    }
  ]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunCommand = (commandToRun: string) => {
    const cmdClean = commandToRun.trim();
    if (!cmdClean || isExecuting) return;

    soundFx.playCyberBlip();
    setIsExecuting(true);

    const nowStr = new Date().toLocaleTimeString();

    // Append Command Entry
    const cmdEntry: CliLogEntry = {
      id: `cmd-${Date.now()}`,
      timestamp: nowStr,
      type: 'CMD',
      text: `agent@soc-command-center:~# ${cmdClean}`
    };

    setLogs(prev => [...prev, cmdEntry]);
    setInputCmd('');

    // Simulated Real-Time AI Execution Sequence
    setTimeout(() => {
      setLogs(prev => [...prev, {
        id: `log-step1-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'AI',
        text: `[AI AGENT] Parsing natural language command: "${cmdClean}"... Matching playbook signature.`
      }]);
    }, 400);

    setTimeout(() => {
      setLogs(prev => [...prev, {
        id: `log-step2-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'INFO',
        text: `[ORCHESTRATOR] Dispatched telemetry query to Palo Alto & Cisco extended ACL controllers.`
      }]);
    }, 900);

    setTimeout(() => {
      // Trigger parent state update
      onExecuteRoutine(cmdClean);

      setLogs(prev => [...prev, {
        id: `log-step3-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'SUCCESS',
        text: `[SUCCESS] Automated playbook routine complete with 100% confidence. SOC live state synchronized.`
      }]);

      setIsExecuting(false);
      soundFx.playSuccess();

      if (onShowToast) {
        onShowToast(
          'AI SOC Execution Complete',
          `Routine "${cmdClean}" completed with 100% accuracy rating.`,
          'success'
        );
      }
    }, 1600);
  };

  const handleCopyLogs = () => {
    const textToCopy = logs.map(l => `[${l.timestamp}] [${l.type}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Autonomous AI SOC Command-Line Interface (CLI)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE AI AGENT
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Input natural language cybersecurity instructions or click quick macros to automate SOC routines.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyLogs}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Logs'}</span>
        </button>
      </div>

      {/* Predefined One-Click Macro Trigger Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>One-Click Autonomous AI Playbook Macros:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PREDEFINED_COMMANDS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleRunCommand(item.cmd)}
              disabled={isExecuting}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-200 text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 active:scale-95"
            >
              <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Terminal Output Box */}
      <div className="h-64 rounded-xl bg-slate-950 border border-slate-800 p-4 overflow-y-auto space-y-2 text-xs text-slate-200 selection:bg-emerald-500 selection:text-black">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 leading-relaxed">
            <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">[{log.timestamp}]</span>
            <span className={`font-bold shrink-0 text-[10px] px-1.5 rounded ${
              log.type === 'CMD' ? 'bg-cyan-500/20 text-cyan-300' :
              log.type === 'AI' ? 'bg-purple-500/20 text-purple-300' :
              log.type === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' :
              log.type === 'WARN' ? 'bg-amber-500/20 text-amber-300' :
              'bg-slate-800 text-slate-400'
            }`}>
              {log.type}
            </span>
            <span className={log.type === 'CMD' ? 'text-amber-300 font-bold' : log.type === 'SUCCESS' ? 'text-emerald-300' : 'text-slate-200'}>
              {log.text}
            </span>
          </div>
        ))}
        {isExecuting && (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs pt-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>AI Agent executing playbook...</span>
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Command Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunCommand(inputCmd);
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-2.5 text-emerald-400 font-bold text-xs">agent@soc:~#</span>
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            disabled={isExecuting}
            placeholder="Type command or natural language instruction (e.g. isolate host 192.168.1.105, scan 10.0.1.0/24)"
            className="w-full pl-28 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!inputCmd.trim() || isExecuting}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <span>Execute</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
