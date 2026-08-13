import React, { useState } from 'react';
import { Search, Flame, ShieldAlert, Sparkles, Terminal, CornerDownLeft, Zap, ArrowRight } from 'lucide-react';
import { ThreatItem } from '../../../types/cybersecurity';
import { soundFx } from '../../../utils/soundEffects';

interface CyberHuntingTabProps {
  threats: ThreatItem[];
  onExecuteCommand: (cmd: string) => void;
  onShowToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export const CyberHuntingTab: React.FC<CyberHuntingTabProps> = ({
  threats,
  onExecuteCommand,
  onShowToast
}) => {
  const [iocQuery, setIocQuery] = useState('');
  const [activeResults, setActiveResults] = useState<ThreatItem[] | null>(null);

  const quickHuntQueries = [
    { label: 'Find Failed SSH Brute-Force Logons', query: '185.220.101.5' },
    { label: 'Search SQL Injection Ingress Payloads', query: '198.51.100.42' },
    { label: 'Find High Entropy DNS Tunneling Beacons', query: '10.0.4.88' },
    { label: 'Search Reflected XSS Cookie Probes', query: '45.33.21.110' }
  ];

  const handleSearch = (q: string) => {
    soundFx.playCyberBlip();
    const clean = q.trim().toLowerCase();
    setIocQuery(q);
    if (!clean) {
      setActiveResults(null);
      return;
    }
    const matched = threats.filter(t => 
      t.sourceIp.includes(clean) || 
      t.type.toLowerCase().includes(clean) || 
      t.targetSystem.toLowerCase().includes(clean) ||
      (t.payloadSample && t.payloadSample.toLowerCase().includes(clean))
    );
    setActiveResults(matched);
  };

  return (
    <div className="space-y-6 font-mono selection:bg-emerald-500 selection:text-black">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <span>Autonomous Threat Hunting Workspace</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Search threat indicators (IOCs), IP addresses, domain names, hashes, and payload patterns across SIEM telemetry.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(iocQuery);
          }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={iocQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Enter IP address, domain, hash, or keyword (e.g. 185.220.101.5, SSH, SQL)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>Search IOCs</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Canned Quick Queries */}
        <div className="space-y-2">
          <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Recommended Threat Hunting Queries:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickHuntQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(q.query)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs flex items-center gap-1.5 transition-all"
              >
                <Search className="w-3 h-3 text-amber-400" />
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {activeResults !== null && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Search Results ({activeResults.length} Matched Indicator Events)</span>
            </div>

            <button
              onClick={() => {
                setActiveResults(null);
                setIocQuery('');
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear Search
            </button>
          </div>

          {activeResults.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No active threat indicators matching "{iocQuery}" found in active SIEM memory.
            </div>
          ) : (
            <div className="space-y-3">
              {activeResults.map(t => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{t.id}: {t.type}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {t.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Src: <strong className="text-emerald-300">{t.sourceIp}</strong> ➔ Target: <strong className="text-cyan-300">{t.targetSystem}</strong>
                    </div>
                    {t.payloadSample && (
                      <p className="text-[10px] text-amber-300/80 font-mono bg-slate-900 p-2 rounded border border-slate-800/80">
                        {t.payloadSample}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onExecuteCommand(`block egress IP ${t.sourceIp}`);
                      onShowToast('IOC Block Dispatched', `Enforced egress firewall drop rule for ${t.sourceIp}`, 'warning');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>Block IOC {t.sourceIp}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
