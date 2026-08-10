import React, { useState } from 'react';
import { 
  Flame, CheckCircle2, Clock, User, ShieldCheck, ArrowRight, Eye, Plus, AlertCircle, Check, X 
} from 'lucide-react';
import { IncidentItem, IncidentStatus } from '../../../types/cybersecurity';
import { soundFx } from '../../../utils/soundEffects';

interface CyberIncidentsTabProps {
  incidents: IncidentItem[];
  onUpdateIncidentStatus: (id: string, newStatus: IncidentStatus) => void;
}

export const CyberIncidentsTab: React.FC<CyberIncidentsTabProps> = ({
  incidents,
  onUpdateIncidentStatus
}) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Incident Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');
  const [newAnalyst, setNewAnalyst] = useState<string>('Karan Pandre');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newAssets, setNewAssets] = useState<string>('192.168.1.100, k8s-node-01');

  const statusSteps: IncidentStatus[] = ['DETECTED', 'INVESTIGATING', 'CONTAINED', 'RESOLVED'];

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundFx.playSuccess();
    const createdItem: IncidentItem = {
      id: `INC-2026-${Math.floor(Math.random() * 899 + 100)}`,
      title: newTitle.trim(),
      severity: newSeverity,
      status: 'DETECTED',
      assignedAnalyst: newAnalyst.trim() || 'Karan Pandre',
      detectionTime: 'Just Now',
      lastUpdated: 'Just Now',
      description: newDescription.trim() || 'Custom security incident manually logged by SOC analyst.',
      affectedAssets: newAssets.split(',').map(a => a.trim()).filter(Boolean),
      containmentSteps: ['Incident logged in SOC queue', 'Automated SIEM alert dispatched'],
      auditLogs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          action: 'Incident manually created & dispatched',
          author: newAnalyst.trim() || 'Karan Pandre'
        }
      ]
    };

    incidents.unshift(createdItem);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Incident Management & Triage Workflow</span>
          </h2>
          <p className="text-xs text-slate-400">
            Track security incidents from initial detection through investigation, containment, and resolution.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playCyberBlip();
            setShowCreateModal(true);
          }}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Incident Ticket</span>
        </button>
      </div>

      {/* Incident List Cards */}
      <div className="grid grid-cols-1 gap-4">
        {incidents.map((incident) => {
          const currentStepIdx = statusSteps.indexOf(incident.status);

          return (
            <div
              key={incident.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {incident.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                      incident.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {incident.severity}
                    </span>
                    <h3 className="text-sm font-bold text-white">{incident.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {incident.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    setSelectedIncident(incident);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>View Details & Timeline</span>
                </button>
              </div>

              {/* Status Progression Stepper */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Analyst: <strong className="text-emerald-300">{incident.assignedAnalyst}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> Detected: {incident.detectionTime}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {statusSteps.map((step, idx) => {
                    const isPassed = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;

                    return (
                      <button
                        key={step}
                        onClick={() => {
                          soundFx.playSuccess();
                          onUpdateIncidentStatus(incident.id, step);
                        }}
                        className={`p-2.5 rounded-xl border font-mono text-xs font-bold transition-all flex items-center justify-between ${
                          isCurrent
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md ring-1 ring-amber-500/40'
                            : isPassed
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-950 text-slate-600 border-slate-800 hover:text-slate-400'
                        }`}
                      >
                        <span className="text-[11px] truncate">{step}</span>
                        {isPassed && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase">{selectedIncident.id} Triage Audit</span>
                <h3 className="text-base font-bold text-white">{selectedIncident.title}</h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Affected Assets */}
            <div className="space-y-1.5">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Affected Assets & Endpoints:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedIncident.affectedAssets.map((asset, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                    {asset}
                  </span>
                ))}
              </div>
            </div>

            {/* Containment Steps Executed */}
            <div className="space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Executed Containment Actions:</span>
              <ul className="space-y-1.5">
                {selectedIncident.containmentSteps.map((step, i) => (
                  <li key={i} className="p-2.5 rounded-xl bg-black/50 border border-emerald-500/20 text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Incident Audit Logs */}
            <div className="space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Incident Audit Trail:</span>
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto">
                {selectedIncident.auditLogs.map((log, i) => (
                  <div key={i} className="text-[11px] text-slate-300 flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1.5 last:border-0">
                    <div>
                      <span className="text-emerald-400 font-bold mr-2">[{log.timestamp}]</span>
                      <span>{log.action}</span>
                    </div>
                    <span className="text-slate-500 font-bold shrink-0">{log.author}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-right">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Create Incident Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d1322] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wide">Create Incident Ticket</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Incident Title / Alert Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Unauthorized Cloud API Key Access"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e: any) => setNewSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Assigned Analyst</label>
                  <input
                    type="text"
                    required
                    value={newAnalyst}
                    onChange={(e) => setNewAnalyst(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Affected Assets (Comma Separated)</label>
                <input
                  type="text"
                  value={newAssets}
                  onChange={(e) => setNewAssets(e.target.value)}
                  placeholder="192.168.1.100, aws-us-east-1"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Triage Summary / Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe threat vectors, impact, and initial investigation findings..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Incident</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
