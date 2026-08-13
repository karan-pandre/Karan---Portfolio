import React, { useState } from 'react';
import { 
  Wrench, Shield, Terminal, Server, Cpu, Cloud, Radio, CheckCircle2, Award, Play, ToggleLeft, ToggleRight, Zap, Check, Layers
} from 'lucide-react';
import { SecurityToolItem, ThreatItem, IncidentItem } from '../../../types/cybersecurity';
import { soundFx } from '../../../utils/soundEffects';
import { WazuhConnectorPanel } from '../WazuhConnectorPanel';

interface CyberToolsTabProps {
  tools: SecurityToolItem[];
  onTriggerToolAction?: (commandText: string) => void;
  onShowToast?: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onSelectTool?: (tool: SecurityToolItem) => void;
  onPromoteThreatsToState?: (newThreats: ThreatItem[]) => void;
  onPromoteIncidentsToState?: (newIncidents: IncidentItem[]) => void;
}

export const CyberToolsTab: React.FC<CyberToolsTabProps> = ({ 
  tools,
  onTriggerToolAction,
  onShowToast,
  onSelectTool,
  onPromoteThreatsToState,
  onPromoteIncidentsToState
}) => {
  const [activeSubView, setActiveSubView] = useState<'wazuh_connector' | 'inventory'>('wazuh_connector');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [autoRemediationMap, setAutoRemediationMap] = useState<Record<string, boolean>>({
    'tool-1': true, // Snort/Suricata auto-contain enabled by default
    'tool-2': true  // Splunk automated alerts
  });

  const toggleAutoRemediation = (toolId: string, toolName: string) => {
    soundFx.playCyberBlip();
    const newState = !autoRemediationMap[toolId];
    setAutoRemediationMap(prev => ({ ...prev, [toolId]: newState }));
    if (onShowToast) {
      onShowToast(
        newState ? 'Auto-Remediation Enabled' : 'Auto-Remediation Disabled',
        `${toolName} auto-remediation set to ${newState ? 'ACTIVE (Will automatically patch safe high-confidence CVEs)' : 'INACTIVE'}`,
        newState ? 'success' : 'info'
      );
    }
  };

  const categories = [
    'ALL',
    'Network Security',
    'SIEM & Monitoring',
    'Endpoint Security',
    'Cloud Security',
    'Offensive Security'
  ];

  const filteredTools = selectedCategory === 'ALL'
    ? tools
    : tools.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Primary Sub-Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 w-fit font-mono text-xs">
        <button
          onClick={() => {
            soundFx.playCyberBlip();
            setActiveSubView('wazuh_connector');
          }}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubView === 'wazuh_connector'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Wazuh End-to-End Security Connector (REAL INTEGRATED)</span>
        </button>

        <button
          onClick={() => {
            soundFx.playCyberBlip();
            setActiveSubView('inventory');
          }}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubView === 'inventory'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Tools Inventory & Capabilities ({tools.length})</span>
        </button>
      </div>

      {/* Sub-View 1: Wazuh SIEM End-to-End Connector */}
      {activeSubView === 'wazuh_connector' && (
        <WazuhConnectorPanel
          onPromoteThreatsToState={onPromoteThreatsToState}
          onPromoteIncidentsToState={onPromoteIncidentsToState}
          onShowToast={onShowToast}
        />
      )}

      {/* Sub-View 2: Tools Inventory & Capabilities */}
      {activeSubView === 'inventory' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                <span>Enterprise Security Tools & Technology Inventory</span>
              </h2>
              <p className="text-xs text-slate-400">
                Categorized stack of security monitoring, offensive testing, and firewall tools in Karan's portfolio.
              </p>
            </div>

            {/* Global Auto-Remediation Status Indicator */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="text-xs font-mono">
                <span className="text-slate-400">Auto-Remediation Engine: </span>
                <span className="text-emerald-400 font-bold">
                  {Object.values(autoRemediationMap).filter(Boolean).length} Tools Guarding
                </span>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tools Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => {
              const isAutoRemEnabled = !!autoRemediationMap[tool.id];

              return (
                <div
                  key={tool.id}
                  className={`p-5 rounded-2xl bg-slate-900/90 border shadow-xl space-y-3 transition-all flex flex-col justify-between ${
                    isAutoRemEnabled ? 'border-emerald-500/40 shadow-emerald-950/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                        {tool.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          REGISTERED
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          tool.integrationState === 'CONFIGURED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          tool.integrationState === 'CONNECTED' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {tool.integrationState === 'CONFIGURED' ? 'CONFIGURED' :
                           tool.integrationState === 'CONNECTED' ? 'CONNECTED' :
                           'NOT CONFIGURED'}
                        </span>
                      </div>
                    </div>

                    <h3 
                      onClick={() => {
                        if (onSelectTool) {
                          soundFx.playCyberBlip();
                          onSelectTool(tool);
                        }
                      }}
                      className="text-base font-bold text-white hover:text-emerald-300 font-mono transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <span>{tool.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal group-hover:text-emerald-400 font-sans">Inspect →</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{tool.purpose}</p>
                  </div>

                  {/* Auto-Remediation Toggle Box */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <Zap className={`w-3.5 h-3.5 ${isAutoRemEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className={isAutoRemEnabled ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                        Auto-Remediation
                      </span>
                    </div>
                    <button
                      onClick={() => toggleAutoRemediation(tool.id, tool.name)}
                      className="flex items-center gap-1 text-xs font-mono font-bold transition-all"
                      title="Toggle AI Auto-Remediation for high confidence vulnerabilities"
                    >
                      {isAutoRemEnabled ? (
                        <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                          <Check className="w-3 h-3" /> ENABLED
                        </span>
                      ) : (
                        <span className="text-slate-500 hover:text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          DISABLED
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Skill Level:</span>
                      <strong className="text-emerald-300">{tool.skillLevel}</strong>
                    </div>
                    <p className="text-[11px] text-slate-400 italic bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      "{tool.description}"
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      {onSelectTool && (
                        <button
                          onClick={() => {
                            soundFx.playCyberBlip();
                            onSelectTool(tool);
                          }}
                          className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Wrench className="w-3 h-3 text-cyan-400" />
                          <span>Diagnostics</span>
                        </button>
                      )}

                      {onTriggerToolAction && (
                        <button
                          onClick={() => {
                            const autoPatchFlag = isAutoRemEnabled ? ' [Auto-Remediation: Safe Patches Triggered]' : '';
                            const routineCmd = `Execute security routine using ${tool.name} (${tool.category})${autoPatchFlag}`;
                            onTriggerToolAction(routineCmd);
                            if (onShowToast) {
                              onShowToast(
                                `Tool Routine Dispatched`,
                                `Dispatched automated AI analysis for ${tool.name}${isAutoRemEnabled ? ' with auto-remediation active' : ''}`,
                                isAutoRemEnabled ? 'success' : 'info'
                              );
                            }
                          }}
                          className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 font-mono font-bold text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95 group cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-emerald-400 fill-emerald-400 group-hover:animate-pulse" />
                          <span>Execute</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};


