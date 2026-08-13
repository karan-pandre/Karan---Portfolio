import React, { useState } from 'react';
import { Server, Search, Filter, ShieldAlert, Bug, Activity, Shield, CheckCircle2, ChevronRight } from 'lucide-react';
import { AssetItem } from '../../../types/cybersecurity';

interface CyberAssetsTabProps {
  assets: AssetItem[];
  onSelectAsset: (asset: AssetItem) => void;
  onIsolateHost: (assetName: string) => void;
  onScanAsset: (assetName: string) => void;
}

export const CyberAssetsTab: React.FC<CyberAssetsTabProps> = ({
  assets,
  onSelectAsset,
  onIsolateHost,
  onScanAsset
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const assetTypes = ['ALL', 'Server', 'Endpoint', 'Network Device', 'Database', 'Cloud Resource', 'Critical Infrastructure'];

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.ipAddress.includes(searchQuery) || 
                          a.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || a.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 font-mono selection:bg-emerald-500 selection:text-black">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <span>Enterprise Assets & Infrastructure Inventory</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Real-time inventory of corporate servers, endpoints, gateways, databases, and cloud resources.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold">
            Total Assets: {assets.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold">
            At Risk / Critical: {assets.filter(a => a.health !== 'Healthy').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search assets by name, IP, or team..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Type Pills */}
        <div className="flex flex-wrap gap-1.5">
          {assetTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedType === t
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

      </div>

      {/* Assets Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => (
          <div
            key={asset.id}
            onClick={() => onSelectAsset(asset)}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl space-y-3 cursor-pointer transition-all hover:scale-[1.01] group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  {asset.type}
                </span>

                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  asset.health === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  asset.health === 'At Risk' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  asset.health === 'Isolated' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {asset.health}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                <span>{asset.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </h3>

              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>IP: <strong className="text-emerald-300">{asset.ipAddress}</strong></div>
                <div className="truncate">OS: {asset.os}</div>
                <div className="truncate">Owner: {asset.owner}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="text-slate-400 text-[10px]">
                Risk Score: <strong className={asset.riskScore > 70 ? 'text-rose-400 font-bold' : 'text-emerald-300'}>{asset.riskScore}/100</strong>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                {asset.activeThreatsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                    {asset.activeThreatsCount} Threat
                  </span>
                )}
                {asset.openVulnerabilitiesCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    {asset.openVulnerabilitiesCount} CVEs
                  </span>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
