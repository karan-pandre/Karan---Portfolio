import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, Sparkles, Play, CheckCircle2, ShieldAlert, Cpu, ArrowRight, CornerDownLeft, RefreshCw, Copy, Check, History, XCircle, Clock, Save, Trash2
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import { CliHistoryItem, saveCommandHistoryToFirestore, loadCommandHistoryFromFirestore } from '../../utils/firestoreSocSync';

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
  const [history, setHistory] = useState<CliHistoryItem[]>([]);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState<boolean>(true);
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

  // Load History from Firestore on mount
  useEffect(() => {
    const fetchHistory = async () => {
      const savedHistory = await loadCommandHistoryFromFirestore();
      if (savedHistory && savedHistory.length > 0) {
        setHistory(savedHistory);
      } else {
        // Seed initial history items
        const initialSeed: CliHistoryItem[] = [
          {
            id: 'h-1',
            command: 'run autonomous threat hunting',
            timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
            status: 'Success',
            category: 'Threat Hunt',
            executionTimeMs: 1240
          },
          {
            id: 'h-2',
            command: 'scan network segment 10.0.1.0/24',
            timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
            status: 'Success',
            category: 'Audit Scan',
            executionTimeMs: 980
          }
        ];
        setHistory(initialSeed);
        saveCommandHistoryToFirestore(initialSeed);
      }
    };
    fetchHistory();
  }, []);

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
    const historyId = `hist-${Date.now()}`;

    // Add 'Running' item to History
    const newHistoryItem: CliHistoryItem = {
      id: historyId,
      command: cmdClean,
      timestamp: nowStr,
      status: 'Running',
      executionTimeMs: 0
    };

    setHistory(prev => [newHistoryItem, ...prev]);

    // Append Command Entry to logs
    const cmdEntry: CliLogEntry = {
      id: `cmd-${Date.now()}`,
      timestamp: nowStr,
      type: 'CMD',
      text: `agent@soc-command-center:~# ${cmdClean}`
    };

    setLogs(prev => [...prev, cmdEntry]);
    setInputCmd('');

    const startTime = Date.now();

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

      const duration = Date.now() - startTime;

      setLogs(prev => [...prev, {
        id: `log-step3-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'SUCCESS',
        text: `[SUCCESS] Automated playbook routine complete with 100% confidence. SOC live state synchronized.`
      }]);

      // Update History entry to Success
      setHistory(prev => {
        const updated = prev.map(h => h.id === historyId ? { ...h, status: 'Success' as const, executionTimeMs: duration } : h);
        saveCommandHistoryToFirestore(updated);
        return updated;
      });

      setIsExecuting(false);
      soundFx.playSuccess();

      if (onShowToast) {
        onShowToast(
          'AI SOC Execution Complete',
          `Routine "${cmdClean}" completed in ${duration}ms. Log persisted to Firestore.`,
          'success'
        );
      }
    }, 1600);
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveCommandHistoryToFirestore([]);
    soundFx.playCyberBlip();
    if (onShowToast) {
      onShowToast('History Cleared', 'Command execution history reset in Firestore.', 'info');
    }
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHistorySidebarOpen(!isHistorySidebarOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              isHistorySidebarOpen 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>History ({history.length})</span>
          </button>

          <button
            onClick={handleCopyLogs}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Logs'}</span>
          </button>
        </div>
      </div>

      {/* Main Terminal + Command History Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Terminal Output & Input Area */}
        <div className={isHistorySidebarOpen ? 'lg:col-span-3 space-y-4' : 'lg:col-span-4 space-y-4'}>
          
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
                placeholder="Type command or instruction (e.g. run threat hunting, scan 10.0.1.0/24)"
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

        {/* Command History Sidebar */}
        {isHistorySidebarOpen && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 lg:col-span-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <History className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Execution History</span>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Clear Command History"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 font-mono text-[11px]">
                {history.length === 0 ? (
                  <p className="text-[10px] text-slate-500 py-4 text-center">No historical entries recorded.</p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500">{item.timestamp}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          item.status === 'Success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          item.status === 'Running' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="text-slate-200 truncate font-semibold" title={item.command}>
                        {item.command}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[9px] text-slate-400">
                        <span>{item.executionTimeMs ? `${item.executionTimeMs}ms` : 'Pending'}</span>
                        <button
                          onClick={() => handleRunCommand(item.command)}
                          disabled={isExecuting}
                          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          <Play className="w-2.5 h-2.5 fill-emerald-400" />
                          <span>Re-run</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <Save className="w-3 h-3 text-emerald-400" />
              <span>Persisted in Firestore db</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
