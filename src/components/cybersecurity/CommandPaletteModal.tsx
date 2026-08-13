import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldAlert, Flame, Bug, Server, Terminal, Wrench, 
  FileText, CornerDownLeft, X, Sparkles, Navigation, Zap
} from 'lucide-react';
import { ThreatItem, IncidentItem, VulnerabilityItem, AssetItem } from '../../types/cybersecurity';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  onExecuteCommand: (cmd: string) => void;
  threats: ThreatItem[];
  incidents: IncidentItem[];
  vulnerabilities: VulnerabilityItem[];
  assets: AssetItem[];
  onSelectAsset?: (asset: AssetItem) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onExecuteCommand,
  threats,
  incidents,
  vulnerabilities,
  assets,
  onSelectAsset
}) => {
  const [query, setQuery] = useState('');

  // Keydown event listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
          // open handled by parent
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Navigation Items
  const navSuggestions = [
    { id: 'overview', name: 'Go to SOC Overview', category: 'Navigation', icon: Navigation, tab: 'overview' },
    { id: 'cli', name: 'Open AI Agent SOC CLI', category: 'Automation', icon: Terminal, tab: 'cli' },
    { id: 'threats', name: 'View Active Threat Detection', category: 'Investigate', icon: ShieldAlert, tab: 'threats' },
    { id: 'incidents', name: 'Open Incident Triage Board', category: 'Investigate', icon: Flame, tab: 'incidents' },
    { id: 'vulnerabilities', name: 'Review Vulnerability CVE Matrix', category: 'Exposure', icon: Bug, tab: 'vulnerabilities' },
    { id: 'assets', name: 'View Enterprise Assets Inventory', category: 'Exposure', icon: Server, tab: 'assets' },
    { id: 'heatmap', name: 'Inspect D3 Threat Heatmap', category: 'Network', icon: Zap, tab: 'heatmap' },
    { id: 'tools', name: 'Open Security Tools Catalog', category: 'Tools', icon: Wrench, tab: 'tools' },
    { id: 'reports', name: 'Generate Executive Audit PDF Report', category: 'Reports', icon: FileText, tab: 'reports' },
    { id: 'demo', name: 'Start Guided Interactive Demo Scenario', category: 'Demo', icon: Sparkles, tab: 'demo' }
  ].filter(item => !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));

  // Quick Action Commands
  const actionSuggestions = [
    { id: 'act-1', cmd: 'run autonomous threat hunting', label: 'Run Autonomous Threat Hunting Routine', icon: Sparkles },
    { id: 'act-2', cmd: 'scan network segment 10.0.1.0/24', label: 'Scan Network Segment 10.0.1.0/24', icon: Zap },
    { id: 'act-3', cmd: 'auto-contain high severity incidents', label: 'Auto-Contain High Severity Incidents', icon: ShieldAlert },
    { id: 'act-4', cmd: 'block suspicious egress IP 185.220.101.5', label: 'Block Suspicious Egress IP 185.220.101.5', icon: Flame }
  ].filter(act => !q || act.label.toLowerCase().includes(q) || act.cmd.toLowerCase().includes(q));

  // Matched Entities
  const matchedThreats = threats.filter(t => !q || t.type.toLowerCase().includes(q) || t.sourceIp.includes(q) || t.id.toLowerCase().includes(q));
  const matchedIncidents = incidents.filter(i => !q || i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  const matchedVulnerabilities = vulnerabilities.filter(v => !q || v.id.toLowerCase().includes(q) || v.name.toLowerCase().includes(q) || v.affectedSystem.toLowerCase().includes(q));
  const matchedAssets = assets.filter(a => !q || a.name.toLowerCase().includes(q) || a.ipAddress.includes(q) || a.id.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 font-mono">
      <div className="w-full max-w-2xl bg-[#0c1322] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in fade-in zoom-in duration-150">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/90">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search threats, incidents, CVEs, assets, or type command (⌘K)..."
            className="w-full bg-transparent text-sm text-emerald-300 placeholder-slate-500 focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-slate-800 border border-slate-700 text-slate-400 rounded">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          
          {/* Quick Navigations */}
          {navSuggestions.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2 py-1">
                Navigation Shortcuts
              </div>
              {navSuggestions.slice(0, 5).map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.tab);
                      onClose();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800/80 flex items-center justify-between text-left text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-slate-200 group-hover:text-emerald-300">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-sans">
                      {item.category}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Playbook Routines */}
          {actionSuggestions.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Execute AI SOC Command
              </div>
              {actionSuggestions.slice(0, 4).map(act => (
                <button
                  key={act.id}
                  onClick={() => {
                    onExecuteCommand(act.cmd);
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 flex items-center justify-between text-left text-xs transition-all text-purple-200 group"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{act.label}</span>
                  </div>
                  <CornerDownLeft className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          )}

          {/* Entities Results */}
          {q && (
            <>
              {/* Assets Match */}
              {matchedAssets.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider px-2 py-1">
                    Matching Assets ({matchedAssets.length})
                  </div>
                  {matchedAssets.map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        if (onSelectAsset) onSelectAsset(asset);
                        onNavigate('assets');
                        onClose();
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-left text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{asset.name}</div>
                        <div className="text-[10px] text-slate-400">{asset.ipAddress} • {asset.os}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        asset.health === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                        asset.health === 'At Risk' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {asset.health}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Threat Matches */}
              {matchedThreats.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider px-2 py-1">
                    Matching Threats ({matchedThreats.length})
                  </div>
                  {matchedThreats.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onNavigate('threats');
                        onClose();
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-left text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{t.id}: {t.type}</div>
                        <div className="text-[10px] text-slate-400">Src: {t.sourceIp} • Target: {t.targetSystem}</div>
                      </div>
                      <span className="text-[10px] text-rose-300 font-bold">{t.severity}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Vulnerabilities Match */}
              {matchedVulnerabilities.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider px-2 py-1">
                    Matching CVEs ({matchedVulnerabilities.length})
                  </div>
                  {matchedVulnerabilities.map(v => (
                    <button
                      key={v.id}
                      onClick={() => {
                        onNavigate('vulnerabilities');
                        onClose();
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-left text-xs"
                    >
                      <div>
                        <div className="font-bold text-amber-300">{v.id} — {v.name}</div>
                        <div className="text-[10px] text-slate-400">CVSS: {v.cvssScore} • {v.affectedSystem}</div>
                      </div>
                      <span className="text-[10px] text-slate-300">{v.remediationStatus}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between font-sans">
          <span>Tip: Press ⌘K anytime to open universal search</span>
          <span className="text-emerald-400 font-mono">SOC Command Palette v2.4</span>
        </div>

      </div>
    </div>
  );
};
