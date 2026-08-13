import React, { useState, useEffect } from 'react';
import { Globe, Shield, Zap, AlertTriangle, Radio, Server, Activity, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/soundEffects';

interface AttackVector {
  id: string;
  sourceCity: string;
  sourceCountry: string;
  sourceIp: string;
  sourceCoords: { x: number; y: number }; // Percentage positions 0-100 on map
  targetName: string;
  targetCoords: { x: number; y: number };
  attackType: string;
  mitreTactic: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  bandwidth: string;
  status: 'ACTIVE_BEAM' | 'INTERCEPTED' | 'QUARANTINED';
  timestamp: string;
}

const INITIAL_ATTACK_VECTORS: AttackVector[] = [
  {
    id: 'atk-101',
    sourceCity: 'Pyongyang',
    sourceCountry: 'North Korea (KP)',
    sourceIp: '175.45.176.80',
    sourceCoords: { x: 78, y: 38 },
    targetName: 'US-East AWS Datacenter (Virginia)',
    targetCoords: { x: 28, y: 36 },
    attackType: 'APT38 State-Sponsored Ransomware Ingress',
    mitreTactic: 'T1486 - Data Encrypted for Impact',
    severity: 'CRITICAL',
    bandwidth: '4.8 Gbps',
    status: 'INTERCEPTED',
    timestamp: 'Just Now'
  },
  {
    id: 'atk-102',
    sourceCity: 'Moscow',
    sourceCountry: 'Russia (RU)',
    sourceIp: '95.173.136.72',
    sourceCoords: { x: 62, y: 28 },
    targetName: 'EU-Central Kubernetes SOC Cluster (Frankfurt)',
    targetCoords: { x: 50, y: 32 },
    attackType: 'FancyBear Credential Stuffing & Kerberoasting',
    mitreTactic: 'T1110 - Brute Force Authentication',
    severity: 'CRITICAL',
    bandwidth: '12.4 Gbps',
    status: 'ACTIVE_BEAM',
    timestamp: '2s ago'
  },
  {
    id: 'atk-103',
    sourceCity: 'Beijing',
    sourceCountry: 'China (CN)',
    sourceIp: '202.108.22.5',
    sourceCoords: { x: 75, y: 42 },
    targetName: 'AP-Southeast Primary Oracle Node (Singapore)',
    targetCoords: { x: 74, y: 58 },
    attackType: 'APT41 Zero-Day SQL Injection Probe',
    mitreTactic: 'T1190 - Exploit Public Application',
    severity: 'HIGH',
    bandwidth: '820 Mbps',
    status: 'INTERCEPTED',
    timestamp: '5s ago'
  },
  {
    id: 'atk-104',
    sourceCity: 'Bucharest',
    sourceCountry: 'Romania (RO)',
    sourceIp: '86.120.44.18',
    sourceCoords: { x: 54, y: 34 },
    targetName: 'US-West Edge Router (Oregon)',
    targetCoords: { x: 18, y: 34 },
    attackType: 'Mirai Botnet SYN Flood Exhaustion',
    mitreTactic: 'T1498 - Network Denial of Service',
    severity: 'HIGH',
    bandwidth: '28.1 Gbps',
    status: 'QUARANTINED',
    timestamp: '8s ago'
  },
  {
    id: 'atk-105',
    sourceCity: 'São Paulo',
    sourceCountry: 'Brazil (BR)',
    sourceIp: '177.12.89.201',
    sourceCoords: { x: 38, y: 70 },
    targetName: 'US-East AWS Datacenter (Virginia)',
    targetCoords: { x: 28, y: 36 },
    attackType: 'BGP Hijacking & DNS Cache Poisoning',
    mitreTactic: 'T1584 - Compromise Infrastructure',
    severity: 'MEDIUM',
    bandwidth: '1.2 Gbps',
    status: 'INTERCEPTED',
    timestamp: '12s ago'
  }
];

export const CyberThreatMap: React.FC = () => {
  const [vectors, setVectors] = useState<AttackVector[]>(INITIAL_ATTACK_VECTORS);
  const [selectedVector, setSelectedVector] = useState<AttackVector>(INITIAL_ATTACK_VECTORS[0]);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [totalInterceptedCount, setTotalInterceptedCount] = useState<number>(14298);

  // Live attack beam animation loop
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setTotalInterceptedCount(prev => prev + Math.floor(Math.random() * 3) + 1);

      // Randomly update status or bandwidth of vectors
      setVectors(prev => {
        return prev.map(v => {
          if (Math.random() > 0.6) {
            const statuses: ('ACTIVE_BEAM' | 'INTERCEPTED' | 'QUARANTINED')[] = ['ACTIVE_BEAM', 'INTERCEPTED', 'QUARANTINED'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return {
              ...v,
              status: newStatus,
              bandwidth: `${(Math.random() * 20 + 0.5).toFixed(1)} Gbps`,
              timestamp: 'Just Now'
            };
          }
          return v;
        });
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  return (
    <div className="p-5 rounded-2xl bg-[#090d18] border border-emerald-500/30 text-slate-100 space-y-4 font-mono shadow-2xl relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
            <Globe className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-wider">GLOBAL THREAT RADAR MAP</h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                SIMULATED LOCATION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Geolocation: <span className="text-slate-300 font-mono">Predefined Coordinate Vectors</span> | IP Lookup API: <span className="text-amber-400 font-mono font-bold">NOT CONFIGURED</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Intercepted Today: <strong className="text-emerald-400">{totalInterceptedCount.toLocaleString()}</strong></span>
          </div>

          <button
            onClick={() => {
              soundFx.playCyberBlip();
              setIsLiveStreaming(!isLiveStreaming);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isLiveStreaming
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'text-emerald-400 animate-pulse' : ''}`} />
            <span>{isLiveStreaming ? 'RADAR LIVE' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map Viewport & Attack Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* SVG World Map Viewport (2 Cols) */}
        <div className="lg:col-span-2 bg-[#050811] border border-slate-800/90 rounded-2xl p-4 relative min-h-[340px] flex flex-col justify-between overflow-hidden shadow-inner">
          
          {/* High-Tech Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff8808_1px,transparent_1px),linear-gradient(to_bottom,#00ff8808_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Compass Radar Circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-72 h-72 rounded-full border border-emerald-500/40 animate-pulse" />
            <div className="w-96 h-96 rounded-full border border-dashed border-cyan-500/30 absolute" />
          </div>

          {/* Map Header Status Bar */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">LAT/LON GRID: OK</span>
              <span>•</span>
              <span>FEED: SURICATA-SIEM-GLOBAL</span>
            </div>
            <div className="text-cyan-400 font-bold">
              DATACENTER ENDPOINTS: [US-EAST], [EU-FRANKFURT], [AP-SINGAPORE]
            </div>
          </div>

          {/* SVG Map Canvas with Nodes & Laser Beams */}
          <div className="relative w-full h-[260px] my-2 z-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              
              {/* World Grid Lines Simulation */}
              <path d="M 0,20 Q 50,15 100,20 M 0,40 Q 50,35 100,40 M 0,60 Q 50,55 100,60 M 0,80 Q 50,75 100,80" fill="none" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1,1" />
              <path d="M 20,0 Q 15,50 20,100 M 40,0 Q 35,50 40,100 M 60,0 Q 55,50 60,100 M 80,0 Q 75,50 80,100" fill="none" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1,1" />

              {/* Simplified Continent Silhouette Shapes */}
              {/* North America */}
              <path d="M 12,20 L 35,22 L 32,45 L 18,48 Z" fill="#1e293b" opacity="0.3" />
              {/* South America */}
              <path d="M 32,52 L 42,55 L 36,80 L 28,68 Z" fill="#1e293b" opacity="0.3" />
              {/* Europe */}
              <path d="M 46,20 L 58,22 L 56,38 L 45,35 Z" fill="#1e293b" opacity="0.3" />
              {/* Asia */}
              <path d="M 60,18 L 88,20 L 82,50 L 62,45 Z" fill="#1e293b" opacity="0.3" />
              {/* Africa */}
              <path d="M 46,40 L 58,42 L 54,70 L 44,58 Z" fill="#1e293b" opacity="0.3" />

              {/* Animated Attack Laser Beams */}
              {vectors.map(vec => {
                const isSelected = selectedVector.id === vec.id;
                const strokeColor = vec.severity === 'CRITICAL' ? '#f43f5e' : vec.severity === 'HIGH' ? '#f59e0b' : '#38bdf8';

                return (
                  <g key={vec.id} className="cursor-pointer" onClick={() => { soundFx.playCyberBlip(); setSelectedVector(vec); }}>
                    {/* Beam Arc */}
                    <path
                      d={`M ${vec.sourceCoords.x},${vec.sourceCoords.y} Q ${(vec.sourceCoords.x + vec.targetCoords.x) / 2},${Math.min(vec.sourceCoords.y, vec.targetCoords.y) - 10} ${vec.targetCoords.x},${vec.targetCoords.y}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isSelected ? "1.5" : "0.8"}
                      strokeOpacity={isSelected ? "0.9" : "0.5"}
                      strokeDasharray="2,1"
                    />

                    {/* Source Pulsing Point */}
                    <circle cx={vec.sourceCoords.x} cy={vec.sourceCoords.y} r="1.5" fill={strokeColor}>
                      <animate attributeName="r" values="1.2;2.5;1.2" dur="1.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Target End Node */}
                    <circle cx={vec.targetCoords.x} cy={vec.targetCoords.y} r="2" fill="#10b981" />
                    <circle cx={vec.targetCoords.x} cy={vec.targetCoords.y} r="3.5" fill="none" stroke="#10b981" strokeWidth="0.5">
                      <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Footer Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between text-[11px] gap-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Critical Attack Vector
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> High-Risk Probe
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Protected Endpoint
              </span>
            </div>
            <span className="text-slate-400 text-[10px]">Click any beam on map to inspect raw vector packet</span>
          </div>

        </div>

        {/* Selected Vector Details Inspector Card (1 Col) */}
        <div className="bg-[#050811] border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" /> Vector Inspector
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedVector.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {selectedVector.severity}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Attack Classification</span>
                <span className="text-white font-bold">{selectedVector.attackType}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">MITRE Tactic</span>
                <span className="text-cyan-400 font-mono text-[11px]">{selectedVector.mitreTactic}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Attacker Origin:</span>
                  <span className="text-rose-400 font-bold">{selectedVector.sourceCity}, {selectedVector.sourceCountry}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Origin IP:</span>
                  <code className="text-amber-300 font-bold">{selectedVector.sourceIp}</code>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Target Endpoint:</span>
                  <span className="text-emerald-300 font-bold">{selectedVector.targetName}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Bandwidth Load:</span>
                  <span className="text-slate-200">{selectedVector.bandwidth}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-slate-300 font-bold">SOAR Action Status:</span>
                <span className="text-emerald-400 font-bold">{selectedVector.status}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playSuccess();
              setVectors(prev => prev.map(v => v.id === selectedVector.id ? { ...v, status: 'QUARANTINED' } : v));
              setSelectedVector(prev => ({ ...prev, status: 'QUARANTINED' }));
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Shield className="w-4 h-4" />
            <span>Enforce Cisco ACL BGP Drop</span>
          </button>
        </div>

      </div>

    </div>
  );
};
