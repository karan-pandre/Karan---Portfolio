import React, { useState } from 'react';
import { 
  FileText, Eye, Download, ShieldCheck, CheckCircle2, X 
} from 'lucide-react';
import { CyberReportItem } from '../../../types/cybersecurity';
import { soundFx } from '../../../utils/soundEffects';

interface CyberReportsTabProps {
  reports: CyberReportItem[];
}

export const CyberReportsTab: React.FC<CyberReportsTabProps> = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState<CyberReportItem | null>(null);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Executive Security Audit & Incident Reports</span>
          </h2>
          <p className="text-xs text-slate-400">
            Formal vulnerability assessment disclosures, post-mortem reviews, and compliance documentation.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {rep.type}
                </span>
                <span className="text-slate-400">{rep.date}</span>
              </div>

              <h3 className="text-base font-bold text-white">{rep.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{rep.executiveSummary}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Author: <strong className="text-white">{rep.author}</strong></span>
                <span className="text-rose-400 font-bold">{rep.criticalFindingsCount} Critical Findings</span>
              </div>

              <button
                onClick={() => {
                  soundFx.playCyberBlip();
                  setSelectedReport(rep);
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Read Full Document Report</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Report Viewing Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <div>
                <span className="text-emerald-400 font-bold text-[10px] uppercase">{selectedReport.type} — {selectedReport.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedReport.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-3 text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {selectedReport.fullContent || selectedReport.executiveSummary}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
