import React from 'react';
import { Server, X, ShieldAlert, Bug, Activity, Shield, CheckCircle2, AlertTriangle, Zap, Terminal } from 'lucide-react';
import { AssetItem } from '../../types/cybersecurity';
import { soundFx } from '../../utils/soundEffects';

interface AssetDetailDrawerProps {
  asset: AssetItem | null;
  onClose: () => void;
  onIsolateHost: (assetName: string) => void;
  onScanAsset: (assetName: string) => void;
}

export const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({
  asset,
  onClose,
  onIsolateHost,
  onScanAsset
}) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end font-mono animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0a0f1d] border-l border-emerald-500/30 h-full p-6 space-y-6 overflow-y-auto text-slate-100 shadow-2xl flex flex-col justify-between">
        
        {/* Top Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{asset.type}</span>
                <h3 className="text-base font-bold text-white font-mono leading-tight">{asset.name}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Health & Risk Badge Header */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">Current Health</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  asset.health === 'Critical' ? 'bg-rose-400 animate-ping' :
                  asset.health === 'At Risk' ? 'bg-amber-400' :
                  asset.health === 'Isolated' ? 'bg-purple-400' : 'bg-emerald-400'
                }`} />
                <span className={`font-bold text-xs ${
                  asset.health === 'Critical' ? 'text-rose-300' :
                  asset.health === 'At Risk' ? 'text-amber-300' :
                  asset.health === 'Isolated' ? 'text-purple-300' : 'text-emerald-300'
                }`}>
                  {asset.health}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">Composite Risk Score</span>
              <div className="text-sm font-black font-mono flex items-center gap-1 text-amber-300">
                <span>{asset.riskScore}</span>
                <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Telemetry Technical Attributes */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2.5 text-xs">
            <div className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-800/80 pb-1">
              System Specification Telemetry
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">IP Address:</span>
              <span className="text-emerald-300 font-bold">{asset.ipAddress}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Operating System:</span>
              <span className="text-slate-200">{asset.os}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Assigned Team / Owner:</span>
              <span className="text-slate-300">{asset.owner}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Physical / Cloud Region:</span>
              <span className="text-slate-300">{asset.location || 'US-East VPC'}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">MAC Address:</span>
              <span className="text-slate-400 font-mono text-[10px]">{asset.macAddress || '00:1C:42:00:88:12'}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Last Telemetry Check:</span>
              <span className="text-slate-400">{asset.lastSeen}</span>
            </div>
          </div>

          {/* Active Exposure Summary */}
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Active Security Exposure</div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold">{asset.activeThreatsCount} Active Threat(s)</div>
                  <div className="text-[9px] text-rose-400/80">Pending Containment</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-2">
                <Bug className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold">{asset.openVulnerabilitiesCount} Unpatched CVEs</div>
                  <div className="text-[9px] text-amber-400/80">Remediation Required</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-2 font-sans">
          <button
            onClick={() => {
              soundFx.playCyberBlip();
              onScanAsset(asset.name);
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Run Deep Vulnerability Scan</span>
          </button>

          <button
            onClick={() => {
              soundFx.playSuccess();
              onIsolateHost(asset.name);
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Shield className="w-3.5 h-3.5 fill-white" />
            <span>Isolate Host from VLAN</span>
          </button>
        </div>

      </div>
    </div>
  );
};
