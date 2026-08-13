import React from 'react';
import { ShieldCheck, X, AlertTriangle, CheckCircle2, FileText, Lock, Server, Cpu } from 'lucide-react';
import { FeatureClassification } from '../../types/cybersecurity';
import { soundFx } from '../../utils/soundEffects';

interface SystemAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeatureAuditItem {
  feature: string;
  dataSource: string;
  externalIntegration: 'YES' | 'NO';
  realLogic: 'YES' | 'NO';
  actualExecution: string;
  classification: FeatureClassification;
  notes: string;
}

const AUDIT_MATRIX: FeatureAuditItem[] = [
  {
    feature: 'Threat Monitoring',
    dataSource: 'Local Store / Firestore',
    externalIntegration: 'NO',
    realLogic: 'YES',
    actualExecution: 'Local State / Triage',
    classification: 'REAL APPLICATION LOGIC',
    notes: 'Processes verified stored threat records, MITRE tactics, and analyst triage steps.'
  },
  {
    feature: 'SIEM & SPL Logs',
    dataSource: 'Local Log Pipeline',
    externalIntegration: 'NO',
    realLogic: 'YES',
    actualExecution: 'Local SPL Query Parser',
    classification: 'DEMO / SIMULATION',
    notes: 'SPL search operates on local synthetic log buffers. Splunk Cloud API is not configured.'
  },
  {
    feature: 'Vulnerability Management',
    dataSource: 'Local CVE Mirror Store',
    externalIntegration: 'NO',
    realLogic: 'YES',
    actualExecution: 'CVSS Score & Patch State',
    classification: 'REAL APPLICATION LOGIC',
    notes: 'Determines posture using local CVE records, CVSS v3.1 weights, and remediation status.'
  },
  {
    feature: 'D3 Network Heatmap',
    dataSource: 'Synthesized Network Telemetry',
    externalIntegration: 'NO',
    realLogic: 'YES',
    actualExecution: 'Interactive D3 SVG Render',
    classification: 'DEMO / SIMULATION',
    notes: 'D3 node topology uses local synthesized subnet telemetry.'
  },
  {
    feature: 'Threat Radar Map',
    dataSource: 'Predefined Geolocation Vectors',
    externalIntegration: 'NO',
    realLogic: 'YES',
    actualExecution: 'Radar Animation',
    classification: 'DEMO / SIMULATION',
    notes: 'Map coordinates are static predefined vectors. IPInfo / MaxMind API is not configured.'
  },
  {
    feature: 'Security Tools Inventory',
    dataSource: 'Tool Capability Registry',
    externalIntegration: 'NO',
    realLogic: 'YES',
    actualExecution: 'Inventory Health Checks',
    classification: 'NOT CONFIGURED',
    notes: 'Tools are registered in inventory; live external EDR/Firewall API endpoints are not configured.'
  },
  {
    feature: 'AI SOC CLI Engine',
    dataSource: 'Intent & Capability Registry',
    externalIntegration: 'NO',
    realLogic: 'YES',
    actualExecution: 'Local Playbook Orchestrator',
    classification: 'REAL APPLICATION LOGIC',
    notes: 'Parses analyst intent, verifies capability registry, updates local Firestore state.'
  },
  {
    feature: 'Security Health Score',
    dataSource: 'Deterministic Engine (5 Inputs)',
    externalIntegration: 'NO',
    realLogic: 'YES',
    actualExecution: 'Mathematical Deduction',
    classification: 'REAL APPLICATION LOGIC',
    notes: 'Calculates exact score (0-100) using stored threats, incidents, vulns, assets, and tools.'
  }
];

export const SystemAuditModal: React.FC<SystemAuditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          soundFx.playCyberBlip();
          onClose();
        }}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span>SOC System Classification & Integration Audit Matrix</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED AUDIT
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Rigorous classification of dataset sources, integration status, logic verification, and actual execution capabilities.
              </p>
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

        {/* Matrix Table */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Feature Component</th>
                  <th className="p-3">Data Source</th>
                  <th className="p-3">Ext. Integration</th>
                  <th className="p-3">Real Logic</th>
                  <th className="p-3">Actual Execution</th>
                  <th className="p-3">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {AUDIT_MATRIX.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-bold text-white">{item.feature}</td>
                    <td className="p-3 text-slate-400">{item.dataSource}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.externalIntegration === 'YES' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {item.externalIntegration}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.realLogic === 'YES' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                        {item.realLogic}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{item.actualExecution}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.classification === 'REAL APPLICATION LOGIC' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        item.classification === 'REAL INTEGRATED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        item.classification === 'DEMO / SIMULATION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {item.classification}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed font-sans">
            <strong className="text-slate-200 block font-mono uppercase text-[11px] mb-1">Audit Policy Summary:</strong>
            This Command Center strictly distinguishes between <span className="text-cyan-300 font-bold">REAL APPLICATION LOGIC</span> (genuinely calculated state changes stored in Firestore), <span className="text-amber-300 font-bold">DEMO / SIMULATION</span> (synthetic telemetry vectors used for demonstration), and <span className="text-slate-300 font-bold">NOT CONFIGURED</span> (capabilities designed into the architecture where live third-party API credentials are not set).
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end font-mono text-xs">
          <button
            onClick={() => {
              soundFx.playCyberBlip();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
          >
            Close Audit Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
