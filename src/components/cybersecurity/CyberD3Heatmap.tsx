import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  ShieldAlert, Activity, Globe, Server, RefreshCw, Zap, Sliders, ShieldCheck, Filter, Eye, AlertOctagon
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface ThreatNode {
  id: string;
  name: string;
  subnet: string;
  type: 'DMZ' | 'APP' | 'DB' | 'CLOUD' | 'AD' | 'GEOGRAPHIC';
  country?: string;
  threatLevel: number; // 0 to 100
  activeThreatCount: number;
  packetsPerSec: number;
  openPorts: number[];
  cveIds: string[];
  status: 'OPTIMAL' | 'ELEVATED' | 'CRITICAL' | 'ISOLATED';
  x?: number;
  y?: number;
}

const INITIAL_NODES: ThreatNode[] = [
  { id: 'node-dmz', name: 'DMZ Ingress Gateway', subnet: '10.0.1.0/24', type: 'DMZ', threatLevel: 82, activeThreatCount: 14, packetsPerSec: 1420, openPorts: [80, 443, 8080], cveIds: ['CVE-2026-2101', 'CVE-2024-3094'], status: 'ELEVATED' },
  { id: 'node-app', name: 'App Cluster Primary Node', subnet: '10.0.2.0/24', type: 'APP', threatLevel: 35, activeThreatCount: 3, packetsPerSec: 890, openPorts: [3000, 8000], cveIds: ['CVE-2024-21762'], status: 'OPTIMAL' },
  { id: 'node-db', name: 'PostgreSQL DB Cluster', subnet: '10.0.3.0/24', type: 'DB', threatLevel: 94, activeThreatCount: 22, packetsPerSec: 2310, openPorts: [5432, 6379], cveIds: ['CVE-2021-44228', 'CVE-2024-6387'], status: 'CRITICAL' },
  { id: 'node-cloud', name: 'AWS Cloud VPC Edge', subnet: '172.16.0.0/16', type: 'CLOUD', threatLevel: 45, activeThreatCount: 6, packetsPerSec: 1120, openPorts: [22, 443], cveIds: [], status: 'OPTIMAL' },
  { id: 'node-ad', name: 'Active Directory Domain', subnet: '192.168.1.0/24', type: 'AD', threatLevel: 78, activeThreatCount: 11, packetsPerSec: 640, openPorts: [53, 88, 389], cveIds: ['CVE-2020-1472'], status: 'ELEVATED' },
  { id: 'geo-us', name: 'US East Coast Sensor', subnet: '185.220.101.0/24', type: 'GEOGRAPHIC', country: 'United States', threatLevel: 25, activeThreatCount: 2, packetsPerSec: 450, openPorts: [443], cveIds: [], status: 'OPTIMAL' },
  { id: 'geo-ru', name: 'Eastern Europe Probe Target', subnet: '194.26.29.0/24', type: 'GEOGRAPHIC', country: 'Russia', threatLevel: 98, activeThreatCount: 38, packetsPerSec: 4120, openPorts: [22, 80, 443, 3389], cveIds: ['CVE-2026-9012'], status: 'CRITICAL' },
  { id: 'geo-cn', name: 'Asia Pacific Probe Vector', subnet: '222.186.30.0/24', type: 'GEOGRAPHIC', country: 'China', threatLevel: 88, activeThreatCount: 29, packetsPerSec: 3200, openPorts: [22, 8080], cveIds: ['CVE-2021-44228'], status: 'CRITICAL' },
  { id: 'geo-de', name: 'Frankfurt IX Node', subnet: '185.120.40.0/24', type: 'GEOGRAPHIC', country: 'Germany', threatLevel: 15, activeThreatCount: 1, packetsPerSec: 310, openPorts: [443], cveIds: [], status: 'OPTIMAL' }
];

interface CyberD3HeatmapProps {
  onTriggerAction?: (actionText: string) => void;
  onShowToast?: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export const CyberD3Heatmap: React.FC<CyberD3HeatmapProps> = ({
  onTriggerAction,
  onShowToast
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes] = useState<ThreatNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<ThreatNode | null>(INITIAL_NODES[0]);
  const [viewMode, setViewMode] = useState<'HEATMAP' | 'TOPOLOGY'>('HEATMAP');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);

  // Live simulation tick effect
  useEffect(() => {
    if (!isLiveSimulating) return;
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === 'ISOLATED') return node;
        const delta = Math.floor((Math.random() - 0.48) * 8);
        const newLevel = Math.max(5, Math.min(100, node.threatLevel + delta));
        const newStatus = newLevel > 85 ? 'CRITICAL' : newLevel > 50 ? 'ELEVATED' : 'OPTIMAL';
        return {
          ...node,
          threatLevel: newLevel,
          packetsPerSec: Math.max(100, node.packetsPerSec + Math.floor((Math.random() - 0.5) * 120)),
          status: newStatus
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Render D3 Visualization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 700;
    const height = 380;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawing

    svg.attr('width', width).attr('height', height);

    // Color Scale: Low threat (Dark Cyan) -> Medium (Amber/Yellow) -> High (Flame Red)
    const colorScale = d3.scaleSequential()
      .domain([0, 100])
      .interpolator(d3.interpolateRgbBasis(['#064e3b', '#0d9488', '#f59e0b', '#f43f5e', '#e11d48']));

    const filteredNodes = nodes.filter(n => filterType === 'ALL' || n.type === filterType);

    if (viewMode === 'HEATMAP') {
      // Heatmap Grid Matrix Mode
      const cols = Math.ceil(Math.sqrt(filteredNodes.length * 1.5));
      const rows = Math.ceil(filteredNodes.length / cols);
      const cellWidth = Math.min(160, (width - 40) / cols);
      const cellHeight = Math.min(90, (height - 40) / rows);

      const g = svg.append('g').attr('transform', `translate(20, 20)`);

      filteredNodes.forEach((node, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * (cellWidth + 12);
        const y = row * (cellHeight + 12);

        // Card Container Group
        const cellGroup = g.append('g')
          .attr('class', 'node-cell cursor-pointer')
          .on('click', () => {
            soundFx.playCyberBlip();
            setSelectedNode(node);
          });

        // Cell Background Rect
        cellGroup.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellWidth)
          .attr('height', cellHeight)
          .attr('rx', 8)
          .attr('fill', colorScale(node.threatLevel))
          .attr('opacity', node.status === 'ISOLATED' ? 0.3 : 0.85)
          .attr('stroke', selectedNode?.id === node.id ? '#10b981' : node.threatLevel > 80 ? '#f43f5e' : '#1e293b')
          .attr('stroke-width', selectedNode?.id === node.id ? 3 : 1.5)
          .style('transition', 'all 0.3s ease');

        // Node Title Text
        cellGroup.append('text')
          .attr('x', x + 10)
          .attr('y', y + 20)
          .attr('fill', '#ffffff')
          .attr('font-size', '11px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'monospace')
          .text(node.name.length > 18 ? node.name.slice(0, 16) + '..' : node.name);

        // Subnet Text
        cellGroup.append('text')
          .attr('x', x + 10)
          .attr('y', y + 36)
          .attr('fill', '#94a3b8')
          .attr('font-size', '9.5px')
          .attr('font-family', 'monospace')
          .text(node.subnet);

        // Threat Score Badge
        cellGroup.append('rect')
          .attr('x', x + cellWidth - 45)
          .attr('y', y + cellHeight - 24)
          .attr('width', 38)
          .attr('height', 18)
          .attr('rx', 4)
          .attr('fill', '#090d16');

        cellGroup.append('text')
          .attr('x', x + cellWidth - 26)
          .attr('y', y + cellHeight - 11)
          .attr('text-anchor', 'middle')
          .attr('fill', node.threatLevel > 80 ? '#f43f5e' : node.threatLevel > 50 ? '#f59e0b' : '#10b981')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'monospace')
          .text(`${node.threatLevel}%`);

        // Pulsating Alarm Dot if Critical
        if (node.threatLevel > 80 && node.status !== 'ISOLATED') {
          cellGroup.append('circle')
            .attr('cx', x + cellWidth - 12)
            .attr('cy', y + 12)
            .attr('r', 5)
            .attr('fill', '#f43f5e')
            .append('animate')
            .attr('attributeName', 'opacity')
            .attr('values', '1;0.2;1')
            .attr('dur', '1s')
            .attr('repeatCount', 'indefinite');
        }
      });

    } else {
      // Topology Node Arc Map Mode
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2.6;

      const g = svg.append('g');

      // Center Core SOC Hub Node
      g.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', 28)
        .attr('fill', '#0f172a')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2.5);

      g.append('text')
        .attr('x', centerX)
        .attr('y', centerY + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#10b981')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .text('SOC CORE');

      const total = filteredNodes.length;
      filteredNodes.forEach((node, i) => {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        const nx = centerX + radius * Math.cos(angle);
        const ny = centerY + radius * Math.sin(angle);

        // Connection Line
        g.append('line')
          .attr('x1', centerX)
          .attr('y1', centerY)
          .attr('x2', nx)
          .attr('y2', ny)
          .attr('stroke', node.threatLevel > 80 ? '#f43f5e' : '#334155')
          .attr('stroke-dasharray', node.status === 'ISOLATED' ? '4 4' : 'none')
          .attr('stroke-width', node.threatLevel > 80 ? 2 : 1);

        // Peripheral Node
        const nodeGroup = g.append('g')
          .attr('class', 'cursor-pointer')
          .on('click', () => {
            soundFx.playCyberBlip();
            setSelectedNode(node);
          });

        nodeGroup.append('circle')
          .attr('cx', nx)
          .attr('cy', ny)
          .attr('r', node.threatLevel > 80 ? 18 : 14)
          .attr('fill', colorScale(node.threatLevel))
          .attr('stroke', selectedNode?.id === node.id ? '#10b981' : '#020617')
          .attr('stroke-width', 2);

        nodeGroup.append('text')
          .attr('x', nx)
          .attr('y', ny + (ny > centerY ? 28 : -20))
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', '9.5px')
          .attr('font-family', 'monospace')
          .text(node.name);
      });
    }

  }, [nodes, viewMode, filterType, selectedNode]);

  // Node Remediation Handlers
  const handleIsolateNode = (node: ThreatNode) => {
    soundFx.playSuccess();
    setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: 'ISOLATED', threatLevel: 0, activeThreatCount: 0 } : n));
    if (selectedNode?.id === node.id) {
      setSelectedNode(prev => prev ? { ...prev, status: 'ISOLATED', threatLevel: 0, activeThreatCount: 0 } : null);
    }
    if (onShowToast) {
      onShowToast('Node Isolated', `Host/Subnet ${node.subnet} isolated from routing table.`, 'success');
    }
    if (onTriggerAction) {
      onTriggerAction(`isolate host ${node.subnet}`);
    }
  };

  const handleMitigateThreats = (node: ThreatNode) => {
    soundFx.playSuccess();
    setNodes(prev => prev.map(n => n.id === node.id ? { ...n, threatLevel: 10, activeThreatCount: 0, status: 'OPTIMAL' } : n));
    if (selectedNode?.id === node.id) {
      setSelectedNode(prev => prev ? { ...prev, threatLevel: 10, activeThreatCount: 0, status: 'OPTIMAL' } : null);
    }
    if (onShowToast) {
      onShowToast('Mitigation Executed', `Palo Alto firewall rule applied to ${node.name}. Threat score reduced to 10%.`, 'success');
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl space-y-4 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <span>Real-Time D3.js Security Threat Heatmap</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                LIVE VECTOR RADAR
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive network segment traffic density, attack frequency, and CVE vulnerability distribution.
            </p>
          </div>
        </div>

        {/* Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setViewMode('HEATMAP')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              viewMode === 'HEATMAP'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Matrix Grid
          </button>
          <button
            onClick={() => setViewMode('TOPOLOGY')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              viewMode === 'TOPOLOGY'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Topology Map
          </button>

          <button
            onClick={() => setIsLiveSimulating(!isLiveSimulating)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              isLiveSimulating 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold' 
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveSimulating ? 'animate-spin' : ''}`} />
            <span>{isLiveSimulating ? 'Live Radar On' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: D3 Visual Canvas + Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* D3 Canvas Container */}
        <div ref={containerRef} className="lg:col-span-2 rounded-xl bg-slate-950 border border-slate-800 p-2 overflow-hidden relative min-h-[380px] flex items-center justify-center">
          <svg ref={svgRef} className="w-full h-[380px] block"></svg>
        </div>

        {/* Selected Node Inspector Sidebar */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Node Details:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedNode.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  selectedNode.status === 'ISOLATED' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{selectedNode.name}</h4>
                <p className="text-[11px] text-emerald-400">{selectedNode.subnet}</p>
                {selectedNode.country && <p className="text-[10px] text-slate-400">Origin: {selectedNode.country}</p>}
              </div>

              <div className="space-y-1.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Threat Level:</span>
                  <span className={`font-bold ${selectedNode.threatLevel > 80 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {selectedNode.threatLevel}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Probes:</span>
                  <span className="text-white font-bold">{selectedNode.activeThreatCount} Probes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Telemetry Rate:</span>
                  <span className="text-cyan-400 font-bold">{selectedNode.packetsPerSec} PPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Open Ports:</span>
                  <span className="text-slate-200">{selectedNode.openPorts.join(', ') || 'None'}</span>
                </div>
              </div>

              {selectedNode.cveIds.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-rose-400 font-bold">Associated Vulnerability CVEs:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.cveIds.map(cve => (
                      <span key={cve} className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px]">
                        {cve}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleMitigateThreats(selectedNode)}
                  disabled={selectedNode.status === 'ISOLATED'}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Apply Palo Alto Mitigation Rule</span>
                </button>

                <button
                  onClick={() => handleIsolateNode(selectedNode)}
                  disabled={selectedNode.status === 'ISOLATED'}
                  className="w-full py-2 rounded-lg bg-rose-600/90 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Isolate Network Segment</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10">
              Select any heatmap cell or node to inspect telemetry.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
