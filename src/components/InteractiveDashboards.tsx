import React, { useState } from 'react';
import { 
  BarChart3, ShieldCheck, TrendingUp, CheckCircle2, 
  Sparkles, Filter, Layers, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, AreaChart, Area
} from 'recharts';
import { soundFx } from '../utils/soundEffects';

interface InteractiveDashboardsProps {
  darkMode: boolean;
}

export const InteractiveDashboards: React.FC<InteractiveDashboardsProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState<'powerbi' | 'soc'>('powerbi');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');

  // Physics Wallah Digital Marketing Performance Data
  const channelData = [
    { channel: 'Direct Counselling', spend: 30000, revenue: 1150000, leads: 3200, conversions: 512, roi: 3733 },
    { channel: 'YouTube Organic', spend: 40000, revenue: 890000, leads: 4100, conversions: 450, roi: 2125 },
    { channel: 'Google Search Ads', spend: 85000, revenue: 450000, leads: 1850, conversions: 296, roi: 429 },
    { channel: 'Instagram Reels', spend: 55000, revenue: 520000, leads: 2300, conversions: 276, roi: 845 },
    { channel: 'Email Marketing', spend: 12000, revenue: 310000, leads: 1200, conversions: 192, roi: 2483 },
  ];

  // SOC SIEM Threat Intelligence & Log Analytics Data
  const threatData = [
    { type: 'Brute-Force SSH', events: 1850, mitigated: 1850, severity: 'Critical', avgResponse: '5ms' },
    { type: 'SQL Injection (SQLi)', events: 640, mitigated: 640, severity: 'Critical', avgResponse: '12ms' },
    { type: 'Port Scanning / Recon', events: 3200, mitigated: 3200, severity: 'Medium', avgResponse: '3ms' },
    { type: 'Phishing Email Links', events: 120, mitigated: 120, severity: 'High', avgResponse: '18ms' },
    { type: 'Unauthorized API Access', events: 450, mitigated: 450, severity: 'High', avgResponse: '8ms' },
  ];

  const filteredChannelData = selectedChannel === 'All' 
    ? channelData 
    : channelData.filter(d => d.channel === selectedChannel);

  const totalLeads = channelData.reduce((acc, c) => acc + c.leads, 0);
  const totalRevenue = channelData.reduce((acc, c) => acc + c.revenue, 0);
  const totalConversions = channelData.reduce((acc, c) => acc + c.conversions, 0);

  return (
    <section 
      id="dashboards" 
      aria-labelledby="dashboards-heading"
      className={`py-20 transition-colors ${
        darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Activity className="w-3.5 h-3.5" />
            Interactive Analytics & Operations Showcase
          </div>
          <h2 id="dashboards-heading" className="text-3xl sm:text-4xl font-black tracking-tight">
            BI Dashboards & SIEM Threat Intelligence
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-world performance dashboards built with Power BI DAX logic and SOC SIEM threat log telemetry.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            id="btn-showcase-powerbi"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('powerbi');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'powerbi'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-600/40'
                : darkMode 
                  ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Campaign Performance & Power BI</span>
          </button>

          <button
            id="btn-showcase-soc"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('soc');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'soc'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-600/40'
                : darkMode 
                  ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SOC SIEM Threat Intelligence</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* POWER BI CAMPAIGN ANALYTICS SHOWCASE */}
          {activeTab === 'powerbi' && (
            <motion.div
              key="powerbi"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
                darkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Executive KPI Header Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block mb-1">Total Campaign Leads</span>
                  <div className="text-2xl font-black text-blue-500">{totalLeads.toLocaleString()}</div>
                  <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> Physics Wallah Funnel
                  </span>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block mb-1">Enrolment Conversions</span>
                  <div className="text-2xl font-black text-emerald-500">{totalConversions.toLocaleString()}</div>
                  <span className="text-[11px] text-slate-400 font-bold mt-1 block">13.6% Avg Conversion Rate</span>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block mb-1">Attributed Revenue</span>
                  <div className="text-2xl font-black text-purple-500">₹{(totalRevenue / 100000).toFixed(2)} Lakhs</div>
                  <span className="text-[11px] text-purple-400 font-bold mt-1 block">Multi-Touch Attribution</span>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block mb-1">Top Performing Channel</span>
                  <div className="text-lg font-black text-amber-500 truncate">Direct Counselling</div>
                  <span className="text-[11px] text-amber-400 font-bold mt-1 block">+3,733% ROI Yield</span>
                </div>
              </div>

              {/* Chart & Channel Selector Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                <div>
                  <h3 className="text-lg font-extrabold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <span>Marketing Channel Revenue vs Campaign Spend</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Visualizing multi-channel growth metrics (₹ INR)</p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-mono text-slate-400 font-bold mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Channel:
                  </span>
                  {['All', 'Direct Counselling', 'YouTube Organic', 'Google Search Ads'].map((ch) => (
                    <button
                      key={ch}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedChannel(ch);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedChannel === ch
                          ? 'bg-blue-600 text-white shadow-sm'
                          : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recharts Bar Visualizer */}
              <div className="h-[320px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredChannelData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
                    <XAxis 
                      dataKey="channel" 
                      tick={{ fill: darkMode ? '#94a3b8' : '#475569', fontSize: 11 }} 
                      interval={0}
                    />
                    <YAxis tick={{ fill: darkMode ? '#94a3b8' : '#475569', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#181818' : '#ffffff', 
                        borderColor: darkMode ? 'rgba(255,255,255,0.15)' : '#cbd5e1',
                        borderRadius: '12px',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                        fontWeight: 'bold'
                      }} 
                    />
                    <Bar dataKey="spend" name="Spend (₹)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="revenue" name="Revenue (₹)" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
                <span>Data Modeling: Power BI DAX Measures & Funnel Multi-Touch Attribution</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Physics Wallah Verified Marketing Data
                </span>
              </div>
            </motion.div>
          )}

          {/* SOC SIEM THREAT INTELLIGENCE SHOWCASE */}
          {activeTab === 'soc' && (
            <motion.div
              key="soc"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
                darkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* SOC Status Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    SOC SIEM ENGINE ONLINE
                  </div>
                  <h3 className="text-lg font-extrabold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>Security Operations Center Log Triage & Threat Telemetry</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Live log collection from Cisco Routers, Nginx Webservers & Auth Syslogs</p>
                </div>

                <div className="text-right font-mono text-xs text-slate-400">
                  <div>Ingestion Rate: <span className="text-emerald-400 font-bold">185.4K logs/sec</span></div>
                  <div>Mitigation Rate: <span className="text-blue-400 font-bold">100% Automated</span></div>
                </div>
              </div>

              {/* Threat Distribution Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-6">
                <div className="lg:col-span-7 h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={threatData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
                      <XAxis dataKey="type" tick={{ fill: darkMode ? '#94a3b8' : '#475569', fontSize: 10 }} interval={0} />
                      <YAxis tick={{ fill: darkMode ? '#94a3b8' : '#475569', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#181818' : '#ffffff', 
                          borderColor: darkMode ? 'rgba(255,255,255,0.15)' : '#cbd5e1',
                          borderRadius: '12px',
                          color: darkMode ? '#f8fafc' : '#0f172a',
                          fontWeight: 'bold'
                        }} 
                      />
                      <Area type="monotone" dataKey="events" name="Security Events Detected" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Threat Log Table Breakdown */}
                <div className="lg:col-span-5 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
                    Mitigated Threat Log Summary
                  </span>
                  <div className="space-y-2">
                    {threatData.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              item.severity === 'Critical' ? 'bg-red-500' : 'bg-amber-500'
                            }`} />
                            <span>{item.type}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">Response: {item.avgResponse}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-emerald-400 block">{item.events} Logs</span>
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ISOLATED
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
                <span>Frameworks: Splunk / ELK SIEM, MITRE ATT&CK, Cisco Router ACL Block Rules</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cisco & Google Cybersecurity Certified
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
