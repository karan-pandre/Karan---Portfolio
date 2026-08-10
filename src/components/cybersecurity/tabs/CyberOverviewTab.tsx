import React from 'react';
import { 
  ShieldCheck, AlertTriangle, Flame, ShieldAlert, Cpu, BellRing, Activity, CheckCircle2, 
  TrendingUp, BarChart2, PieChart as PieIcon, Layers, Server, Shield 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line 
} from 'recharts';
import { 
  ThreatItem, IncidentItem, VulnerabilityItem 
} from '../../../types/cybersecurity';
import { 
  CHART_THREAT_ACTIVITY, CHART_SEVERITY_DISTRIBUTION, CHART_ATTACK_CATEGORIES 
} from '../../../data/cybersecurityData';

interface CyberOverviewTabProps {
  threats: ThreatItem[];
  incidents: IncidentItem[];
  vulnerabilities: VulnerabilityItem[];
  onNavigateTab: (tabId: string) => void;
}

export const CyberOverviewTab: React.FC<CyberOverviewTabProps> = ({
  threats,
  incidents,
  vulnerabilities,
  onNavigateTab
}) => {
  const activeThreatsCount = threats.filter(t => t.status !== 'RESOLVED' && t.status !== 'BLOCKED').length;
  const openIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalVulnsCount = vulnerabilities.filter(v => v.severity === 'CRITICAL' && v.remediationStatus !== 'PATCHED').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Security Score */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold">
            <span>Security Posture Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">94</span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-auto">
              EXCELLENT
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Zero unmitigated critical zero-days in production.</p>
        </div>

        {/* Card 2: Active Threats */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold">
            <span>Active Threats</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{activeThreatsCount}</span>
            <span className="text-xs text-slate-400 font-mono">Detected</span>
            <button
              onClick={() => onNavigateTab('threats')}
              className="text-[11px] font-mono font-bold text-rose-400 hover:underline ml-auto"
            >
              View All &rarr;
            </button>
          </div>
          <p className="text-[11px] text-slate-400">Suricata & Splunk SIEM real-time sensors active.</p>
        </div>

        {/* Card 3: Open Incidents */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold">
            <span>Open SOC Incidents</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{openIncidentsCount}</span>
            <span className="text-xs text-slate-400 font-mono">Investigating</span>
            <button
              onClick={() => onNavigateTab('incidents')}
              className="text-[11px] font-mono font-bold text-amber-400 hover:underline ml-auto"
            >
              Triage &rarr;
            </button>
          </div>
          <p className="text-[11px] text-slate-400">Assigned to SOC Lead Analyst Karan Pandre.</p>
        </div>

        {/* Card 4: Systems Monitored & Blocked */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold">
            <span>Monitored Endpoints</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">128</span>
            <span className="text-xs text-slate-400 font-mono">Active Nodes</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 ml-auto">
              1,248 Blocked
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Palo Alto Firewalls & Cisco Router Extended ACLs.</p>
        </div>

      </div>

      {/* Row 2: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Threat Activity Over Time Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono">Threat Detection Velocity & Mitigation Rate</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Hourly Telemetry Feed</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_THREAT_ACTIVITY}>
                <defs>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="threats" name="Detected Threats" stroke="#f43f5e" fillOpacity={1} fill="url(#threatGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="blocked" name="Blocked Threats" stroke="#10b981" fillOpacity={1} fill="url(#blockedGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Donut */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-mono">Severity Breakdown</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Active Pipeline</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CHART_SEVERITY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CHART_SEVERITY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            {CHART_SEVERITY_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-bold">{item.name}:</span>
                <span className="text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Attack Categories & Active Triage Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Attack Categories Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono">Threat Vectors by Category</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold">24-Hour Log Volume</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_ATTACK_CATEGORIES}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" name="Event Count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent High Priority Triage Feed */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-white font-mono">Critical Live Triage Queue</h3>
            </div>
            <button
              onClick={() => onNavigateTab('threats')}
              className="text-xs text-emerald-400 hover:underline font-mono font-bold"
            >
              Explore All Telemetry &rarr;
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1">
            {threats.slice(0, 3).map((threat) => (
              <div 
                key={threat.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono font-bold">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      threat.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {threat.severity}
                    </span>
                    <span className="text-white">{threat.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    IP: <code className="text-cyan-300">{threat.sourceIp}</code> &rarr; Target: <code className="text-emerald-300">{threat.targetSystem}</code>
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold shrink-0">
                  {threat.status}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              All Automated Mitigation Pipelines Operational
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">Splunk + Cisco ACL</span>
          </div>
        </div>

      </div>

    </div>
  );
};
