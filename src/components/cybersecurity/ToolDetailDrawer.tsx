import React, { useState } from 'react';
import { 
  X, ShieldCheck, Activity, RefreshCw, Zap, Server, Terminal, 
  CheckCircle2, AlertTriangle, Layers, ExternalLink, Settings, Cpu, Radio
} from 'lucide-react';
import { SecurityToolItem } from '../../types/cybersecurity';
import { soundFx } from '../../utils/soundEffects';

interface ToolDetailDrawerProps {
  tool: SecurityToolItem | null;
  onClose: () => void;
  onUpdateTool?: (updatedTool: SecurityToolItem) => void;
}

export const ToolDetailDrawer: React.FC<ToolDetailDrawerProps> = ({
  tool,
  onClose,
  onUpdateTool
}) => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'diagnostics'>('overview');

  if (!tool) return null;

  const handleRunDiagnostics = () => {
    soundFx.playCyberBlip();
    setIsTestingConnection(true);
    setTestResult(null);

    setTimeout(() => {
      soundFx.playSuccess();
      setIsTestingConnection(false);
      setTestResult('✓ All diagnostic checks passed: API Endpoint HTTP 200 OK | Auth Bearer Token Valid | Telemetry Stream 14,200 eps');
    }, 1200);
  };

  const healthColor = 
    tool.healthStatus === 'Healthy' || !tool.healthStatus ? 'bg-emerald-500 text-emerald-400' :
    tool.healthStatus === 'Degraded' || tool.healthStatus === 'Warning' ? 'bg-amber-500 text-amber-400' :
    'bg-rose-500 text-rose-400';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          
          {/* Top Drawer Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono">{tool.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                  <span>{tool.category}</span>
                  <span>•</span>
                  <span className="text-slate-300 font-semibold">{tool.vendor || 'Enterprise Security Vendor'}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                soundFx.playCyberBlip();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950 px-5 text-xs font-mono">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 border-b-2 font-bold transition-all ${
                activeTab === 'overview' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`py-3 px-3 border-b-2 font-bold transition-all ${
                activeTab === 'telemetry' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Telemetry & Events
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`py-3 px-3 border-b-2 font-bold transition-all ${
                activeTab === 'diagnostics' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Diagnostics
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs font-mono">
            
            {activeTab === 'overview' && (
              <>
                {/* Health Metrics Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Status & Health</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${healthColor} bg-opacity-20`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${healthColor.split(' ')[0]}`} />
                      {tool.healthStatus || 'Healthy'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">Integration Type</span>
                      <span className="text-slate-200 font-bold">{tool.integrationType || 'API Connector'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">Last Synced</span>
                      <span className="text-emerald-400 font-bold">{tool.lastSync || '2 mins ago'}</span>
                    </div>
                  </div>
                </div>

                {/* Capabilities & Purpose */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Purpose & Capabilities</span>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                    {tool.purpose}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Configuration Metadata</span>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Skill Tier Required</span>
                      <span className="text-emerald-400 font-bold">{tool.skillLevel}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Deployment Phase</span>
                      <span className="text-slate-200 font-bold">{tool.status}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Version</span>
                      <span className="text-slate-200">{tool.version || 'v11.4.2-enterprise'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Auto-Remediation</span>
                      <span className={tool.autoRemediationEnabled !== false ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {tool.autoRemediationEnabled !== false ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Diagnostics Action */}
                <div className="pt-2">
                  <button
                    onClick={handleRunDiagnostics}
                    disabled={isTestingConnection}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTestingConnection ? 'animate-spin' : ''}`} />
                    <span>{isTestingConnection ? 'Testing Connection...' : 'Run Diagnostics & Health Check'}</span>
                  </button>
                </div>

                {testResult && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs leading-relaxed">
                    {testResult}
                  </div>
                )}
              </>
            )}

            {activeTab === 'telemetry' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Live Log Stream</span>
                  <span className="text-emerald-400 font-mono text-[10px]">14,200 EPS</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-emerald-400">[INFO]</span> 17:31:04 UTC - Sensor ping ACK from endpoint 10.0.12.45
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-emerald-400">[INFO]</span> 17:30:42 UTC - Rule matching: 0 critical alerts in past 15 min
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-amber-400">[WARN]</span> 17:28:10 UTC - Rate limit threshold warning (82% capacity)
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diagnostics' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-200">System Probe Diagnostics</h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Run automated API latency tests, SSL certificate verification, and token expiration audits against the registered endpoint.
                  </p>
                  <button
                    onClick={handleRunDiagnostics}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
                  >
                    Start Full Diagnostics Run
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">Tool ID: {tool.id}</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Close Panel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
