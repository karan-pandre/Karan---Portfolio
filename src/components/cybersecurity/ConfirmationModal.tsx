import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, X, Shield, RefreshCw } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  target: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  expectedImpact: string;
  affectedAssetsCount?: number;
  reason: string;
  rollbackAvailable?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  target,
  riskLevel,
  expectedImpact,
  affectedAssetsCount = 1,
  reason,
  rollbackAvailable = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg bg-[#0c1322] border border-rose-500/40 rounded-2xl p-6 space-y-5 shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                  riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {riskLevel} RISK
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">Confirmation required before enforcing security policy</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Details Grid */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Target Object:</span>
            <strong className="text-emerald-300 font-mono">{target}</strong>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Affected Scope:</span>
            <strong className="text-slate-200">{affectedAssetsCount} Endpoint(s) / Gateway(s)</strong>
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-slate-400 block font-bold">Operational Impact:</span>
            <p className="text-amber-300/90 font-sans leading-relaxed text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              "{expectedImpact}"
            </p>
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-slate-400 block font-bold">SOC Justification Reason:</span>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              {reason}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
            <span className="text-slate-500">Rollback Status:</span>
            <span className={rollbackAvailable ? 'text-emerald-400 flex items-center gap-1 font-bold' : 'text-rose-400 font-bold'}>
              {rollbackAvailable ? <CheckCircle2 className="w-3 h-3" /> : null}
              {rollbackAvailable ? 'Instant Automated Rollback Supported' : 'Irreversible State'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Cancel Action
          </button>

          <button
            onClick={() => {
              soundFx.playSuccess();
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Shield className="w-4 h-4 fill-white" />
            <span>Approve & Enforce Action</span>
          </button>
        </div>

      </div>
    </div>
  );
};
