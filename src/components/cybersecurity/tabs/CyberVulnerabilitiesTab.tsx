import React, { useState, useMemo } from 'react';
import { 
  Bug, Search, Filter, ExternalLink, ShieldAlert, ArrowUpDown, Eye, X, CheckCircle2 
} from 'lucide-react';
import { VulnerabilityItem, RemediationStatus } from '../../../types/cybersecurity';
import { soundFx } from '../../../utils/soundEffects';

interface CyberVulnerabilitiesTabProps {
  vulnerabilities: VulnerabilityItem[];
  onUpdateRemediationStatus: (id: string, newStatus: RemediationStatus) => void;
}

export const CyberVulnerabilitiesTab: React.FC<CyberVulnerabilitiesTabProps> = ({
  vulnerabilities,
  onUpdateRemediationStatus
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'cvss' | 'date'>('cvss');
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityItem | null>(null);

  const filteredVulns = useMemo(() => {
    let result = vulnerabilities.filter((v) => {
      const matchesSearch = 
        v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.affectedSystem.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = severityFilter === 'ALL' || v.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });

    if (sortBy === 'cvss') {
      result.sort((a, b) => b.cvssScore - a.cvssScore);
    } else {
      result.sort((a, b) => new Date(b.detectionDate).getTime() - new Date(a.detectionDate).getTime());
    }

    return result;
  }, [vulnerabilities, searchQuery, severityFilter, sortBy]);

  return (
    <div className="space-y-5 font-sans">
      
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Bug className="w-5 h-5 text-rose-400" />
            <span>Vulnerability Assessment & CVE Registry</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              REAL APPLICATION LOGIC
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Source: <span className="text-slate-300 font-mono">Local CVE Mirror Store</span> | NIST NVD Live API: <span className="text-amber-400 font-mono font-bold">NOT CONFIGURED</span>
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CVE ID, Vulnerability Name, or System..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical (CVSS 9.0 - 10.0)</option>
            <option value="HIGH">High (CVSS 7.0 - 8.9)</option>
            <option value="MEDIUM">Medium (CVSS 4.0 - 6.9)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'cvss' | 'date')}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
          >
            <option value="cvss">Sort by CVSS Score (Highest)</option>
            <option value="date">Sort by Detection Date (Newest)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">CVE ID</th>
                <th className="px-4 py-3">Vulnerability Name</th>
                <th className="px-4 py-3">CVSS Score</th>
                <th className="px-4 py-3">Affected System</th>
                <th className="px-4 py-3">Detection Date</th>
                <th className="px-4 py-3">Remediation Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredVulns.map((vuln) => (
                <tr key={vuln.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-rose-300">{vuln.id}</td>
                  <td className="px-4 py-3 font-bold text-white">{vuln.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {vuln.cvssScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{vuln.affectedSystem}</td>
                  <td className="px-4 py-3 text-slate-400">{vuln.detectionDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      vuln.remediationStatus === 'PATCHED' ? 'bg-emerald-500/20 text-emerald-300' :
                      vuln.remediationStatus === 'MITIGATION_APPLIED' ? 'bg-cyan-500/20 text-cyan-300' :
                      vuln.remediationStatus === 'PENDING_PATCH' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {vuln.remediationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        soundFx.playCyberBlip();
                        setSelectedVuln(vuln);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CVE Detail Modal */}
      {selectedVuln && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-rose-400 font-bold text-[10px] uppercase">{selectedVuln.id} Advisory</span>
                <h3 className="text-base font-bold text-white">{selectedVuln.name}</h3>
              </div>
              <button
                onClick={() => setSelectedVuln(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {selectedVuln.description}
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">CWE Category:</span>
              <p className="text-amber-300 font-bold">{selectedVuln.cweCategory || 'CWE-200: Information Exposure'}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-400 text-[11px] font-bold">Update Patch Lifecycle:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    onUpdateRemediationStatus(selectedVuln.id, 'PATCHED');
                    setSelectedVuln({ ...selectedVuln, remediationStatus: 'PATCHED' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Mark Patched
                </button>
                {selectedVuln.solutionLink && (
                  <a
                    href={selectedVuln.solutionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1"
                  >
                    <span>NVD Reference</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
