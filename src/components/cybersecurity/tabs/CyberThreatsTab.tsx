import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, Search, Filter, Lock, Eye, CheckCircle2, Shield, AlertTriangle, X, Terminal, Copy, RefreshCw 
} from 'lucide-react';
import { ThreatItem, ThreatSeverity, ThreatStatus } from '../../../types/cybersecurity';
import { soundFx } from '../../../utils/soundEffects';

interface CyberThreatsTabProps {
  threats: ThreatItem[];
  onUpdateThreatStatus: (id: string, newStatus: ThreatStatus) => void;
}

export const CyberThreatsTab: React.FC<CyberThreatsTabProps> = ({
  threats,
  onUpdateThreatStatus
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem | null>(null);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  const filteredThreats = useMemo(() => {
    return threats.filter((t) => {
      const matchesSearch = 
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.sourceIp.includes(searchQuery) ||
        t.targetSystem.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = severityFilter === 'ALL' || t.severity === severityFilter;
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [threats, searchQuery, severityFilter, statusFilter]);

  return (
    <div className="space-y-5 font-sans">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Threat Monitoring & Real-Time Telemetry Feed</span>
          </h2>
          <p className="text-xs text-slate-400">
            Automated Suricata IDS, ModSecurity WAF, & Splunk SIEM log correlation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-300">
            Showing {filteredThreats.length} of {threats.length} Threats
          </span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Threat ID, IP, Type, or Target..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Severity</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="BLOCKED">Blocked</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="QUARANTINED">Quarantined</option>
            <option value="MONITORING">Monitoring</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Threats Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Threat ID</th>
                <th className="px-4 py-3">Threat Type</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Source IP</th>
                <th className="px-4 py-3">Target System</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 italic">
                    No matching threat events found matching filter parameters.
                  </td>
                </tr>
              ) : (
                filteredThreats.map((threat) => (
                  <tr key={threat.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-cyan-300">{threat.id}</td>
                    <td className="px-4 py-3 font-bold text-white">{threat.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        threat.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        threat.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        threat.severity === 'MEDIUM' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-amber-300 font-mono">{threat.sourceIp}</td>
                    <td className="px-4 py-3 text-slate-300">{threat.targetSystem}</td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">{threat.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        threat.status === 'BLOCKED' ? 'bg-emerald-500/20 text-emerald-300' :
                        threat.status === 'QUARANTINED' ? 'bg-purple-500/20 text-purple-300' :
                        threat.status === 'INVESTIGATING' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {threat.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          soundFx.playCyberBlip();
                          setSelectedThreat(threat);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Payload</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Threat Inspection Modal / Drawer */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Threat Detail Telemetry — {selectedThreat.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedThreat(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Type</span>
                <span className="font-bold text-white truncate block">{selectedThreat.type}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Severity</span>
                <span className="font-bold text-rose-400 block">{selectedThreat.severity}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Source IP</span>
                <span className="font-bold text-amber-300 block">{selectedThreat.sourceIp}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Status</span>
                <span className="font-bold text-emerald-400 block">{selectedThreat.status}</span>
              </div>
            </div>

            {/* MITRE & Detection Info */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">MITRE ATT&CK Classification:</span>
              <p className="text-amber-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-bold">
                {selectedThreat.mitreTactic || 'T1190 - Exploit Public-Facing Application'}
              </p>
            </div>

            {/* Payload Sample Box */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Terminal className="w-3.5 h-3.5" />
                  Captured Raw Packet Payload Sample:
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedThreat.payloadSample || '');
                    setCopiedPayload(true);
                    setTimeout(() => setCopiedPayload(false), 2000);
                  }}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedPayload ? 'Copied!' : 'Copy Payload'}
                </button>
              </div>
              <div className="p-3 rounded-xl bg-black border border-emerald-500/30 text-emerald-300 font-mono text-[11px] break-all leading-relaxed">
                {selectedThreat.payloadSample || 'No raw payload available for this threat record.'}
              </div>
            </div>

            {/* Status Change Controls */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-400 text-[11px] font-bold">Apply Containment Action:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    onUpdateThreatStatus(selectedThreat.id, 'BLOCKED');
                    setSelectedThreat({ ...selectedThreat, status: 'BLOCKED' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Block IP in Firewall
                </button>
                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    onUpdateThreatStatus(selectedThreat.id, 'QUARANTINED');
                    setSelectedThreat({ ...selectedThreat, status: 'QUARANTINED' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                >
                  Quarantine Host
                </button>
                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    onUpdateThreatStatus(selectedThreat.id, 'RESOLVED');
                    setSelectedThreat({ ...selectedThreat, status: 'RESOLVED' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  Mark Resolved
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
