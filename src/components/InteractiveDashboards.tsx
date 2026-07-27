import React, { useState } from 'react';
import { 
  BarChart3, Database, Play, RefreshCw, Calculator, Table, 
  TrendingUp, Check, Layers, Code, Sparkles, Filter 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Legend, CartesianGrid, AreaChart, Area, FunnelChart, Funnel, LabelList 
} from 'recharts';
import { SAMPLE_SQL_DATASETS } from '../data/karanData';

interface InteractiveDashboardsProps {
  darkMode: boolean;
}

export const InteractiveDashboards: React.FC<InteractiveDashboardsProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState<'powerbi' | 'sql' | 'roi'>('powerbi');

  // Interactive ROI Calculator State
  const [monthlySpend, setMonthlySpend] = useState<number>(50000);
  const [targetChannel, setTargetChannel] = useState<string>('Google Search Ads');

  // SQL Sandbox State
  const [selectedDataset, setSelectedDataset] = useState<string>('physicswallah_campaigns');
  const [sqlQuery, setSqlQuery] = useState<string>(SAMPLE_SQL_DATASETS[0].defaultQuery);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isQueryRunning, setIsQueryRunning] = useState<boolean>(false);

  // Power BI Mock Data
  const channelPerformanceData = [
    { channel: 'YouTube Organic', spend: 40000, revenue: 890000, leads: 4100, ctr: 14.88 },
    { channel: 'Google Search Ads', spend: 85000, revenue: 450000, leads: 1850, ctr: 15.95 },
    { channel: 'Direct Counselling', spend: 30000, revenue: 1150000, leads: 3200, ctr: 24.38 },
    { channel: 'Instagram Reels', spend: 55000, revenue: 520000, leads: 2300, ctr: 13.48 },
    { channel: 'Email Marketing', spend: 12000, revenue: 310000, leads: 1200, ctr: 17.50 },
  ];

  const handleRunSQL = async () => {
    setIsQueryRunning(true);
    try {
      const res = await fetch('/api/sql-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetName: selectedDataset, query: sqlQuery })
      });
      const data = await res.json();
      if (data.success) {
        setQueryResult(data);
      }
    } catch (err) {
      console.error('SQL query execution failed:', err);
    } finally {
      setIsQueryRunning(false);
    }
  };

  const currentDatasetObj = SAMPLE_SQL_DATASETS.find(d => d.name === selectedDataset) || SAMPLE_SQL_DATASETS[0];

  // ROI Calculator Math
  const calculatedLeads = Math.round((monthlySpend / 85000) * 1850);
  const calculatedConversions = Math.round(calculatedLeads * 0.16);
  const calculatedRevenue = Math.round(monthlySpend * 5.29);
  const calculatedROI = Math.round(((calculatedRevenue - monthlySpend) / monthlySpend) * 100);

  return (
    <section 
      id="dashboards" 
      aria-labelledby="dashboards-heading"
      className={`py-20 transition-colors ${
        darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <BarChart3 className="w-3.5 h-3.5" />
            Live Data Engineering & Analytics Showcase
          </div>
          <h2 id="dashboards-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Interactive BI Dashboards & SQL Query Engine
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore real-world marketing campaign analytics built with Power BI DAX logic, live SQL execution, and dynamic ROI simulation.
          </p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <motion.button
            id="btn-tab-powerbi"
            onClick={() => setActiveTab('powerbi')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === 'powerbi'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Power BI Campaign Dashboard</span>
          </motion.button>

          <motion.button
            id="btn-tab-sql"
            onClick={() => { setActiveTab('sql'); if (!queryResult) handleRunSQL(); }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === 'sql'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Interactive SQL Sandbox</span>
          </motion.button>

          <motion.button
            id="btn-tab-roi"
            onClick={() => setActiveTab('roi')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === 'roi'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Campaign ROI Simulator</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {/* TAB 1: POWER BI DASHBOARD */}
          {activeTab === 'powerbi' && (
            <motion.div 
              key="powerbi"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
                darkMode ? 'bg-[#161616] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span>Marketing Campaign Performance & Revenue Yield</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    DAX Measures Active
                  </span>
                </h3>
                <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Comparing spend against generated revenue and CTR across key digital marketing channels.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Total Revenue Generated:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">₹33,20,000</span>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-80 w-full my-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="channel" tick={{ fontSize: 11, fill: darkMode ? '#cbd5e1' : '#475569' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: darkMode ? '#cbd5e1' : '#475569' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: darkMode ? '#cbd5e1' : '#475569' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                      borderColor: darkMode ? '#334155' : '#e2e8f0',
                      borderRadius: '8px',
                      color: darkMode ? '#f8fafc' : '#0f172a'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar yAxisId="left" dataKey="spend" name="Spend (INR)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue (INR)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* DAX Formula Snippet Showcase */}
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-mono text-blue-600 dark:text-blue-400 mb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> DAX Measure: Net Campaign Profit & ROI
                </span>
                <span>Power BI Desktop 2025</span>
              </div>
              <pre className={`text-xs font-mono p-3 rounded-lg overflow-x-auto ${
                darkMode ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'
              }`}>
                {`Net Campaign ROI % = 
VAR TotalRevenue = SUM(campaign_logs[revenue_generated])
VAR TotalSpend = SUM(campaign_logs[spend_inr])
RETURN 
DIVIDE(TotalRevenue - TotalSpend, TotalSpend, 0) * 100`}
              </pre>
            </div>

          </motion.div>
        )}

          {/* TAB 2: INTERACTIVE SQL SANDBOX */}
          {activeTab === 'sql' && (
            <motion.div 
              key="sql"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
                darkMode ? 'bg-[#161616] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  <span>Live SQL Query Execution Sandbox</span>
                </h3>
                <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Test SQL joins, aggregations, and window functions on Karan's sample datasets.
                </p>
              </div>

              {/* Dataset Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold">Select Table:</label>
                <select
                  id="sql-dataset-select"
                  value={selectedDataset}
                  onChange={(e) => {
                    setSelectedDataset(e.target.value);
                    const ds = SAMPLE_SQL_DATASETS.find(d => d.name === e.target.value);
                    if (ds) setSqlQuery(ds.defaultQuery);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border ${
                    darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  {SAMPLE_SQL_DATASETS.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SQL Query Editor Box */}
            <div className="my-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">SQL Command Line</span>
                <button
                  id="btn-run-sql"
                  onClick={handleRunSQL}
                  disabled={isQueryRunning}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  {isQueryRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Execute Query</span>
                </button>
              </div>

              <textarea
                id="sql-editor-textarea"
                rows={4}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className={`w-full p-3.5 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-900 border-slate-700 text-emerald-300'
                }`}
              />
            </div>

            {/* Query Results Table */}
            {queryResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Table className="w-3.5 h-3.5 text-blue-500" />
                    Returned {queryResult.rowCount} rows from table '{queryResult.dataset}'
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    Execution time: {queryResult.executionTimeMs}ms
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className={`font-mono text-[11px] uppercase ${
                      darkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <tr>
                        {queryResult.columns.map((col: string) => (
                          <th key={col} className="px-3.5 py-2.5 font-bold border-b border-slate-200 dark:border-slate-800">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y font-mono ${
                      darkMode ? 'divide-slate-800 bg-slate-900/50' : 'divide-slate-200 bg-white'
                    }`}>
                      {queryResult.rows.map((row: any, i: number) => (
                        <tr key={i} className={darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                          {queryResult.columns.map((col: string) => (
                            <td key={col} className="px-3.5 py-2 text-slate-700 dark:text-slate-300">
                              {row[col] !== undefined ? String(row[col]) : '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </motion.div>
        )}

        {/* TAB 3: CAMPAIGN ROI SIMULATOR */}
        {activeTab === 'roi' && (
          <motion.div 
            key="roi"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
              darkMode ? 'bg-[#161616] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-500" />
                  <span>Physics Wallah Campaign ROI Model</span>
                </h3>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Simulate lead generation, conversions, and estimated ROI yields based on Karan's predictive marketing analytics model.
                </p>
              </div>

              {/* Slider & Controls */}
              <div className={`p-6 rounded-xl border space-y-5 ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>Monthly Digital Marketing Spend:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                      ₹{monthlySpend.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    id="roi-spend-slider"
                    type="range"
                    min={10000}
                    max={250000}
                    step={5000}
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>₹10,000</span>
                    <span>₹1,25,000</span>
                    <span>₹2,50,000</span>
                  </div>
                </div>

                {/* Output Projections Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900">
                    <span className="text-[10px] font-medium text-slate-500 block">Est. Leads</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">{calculatedLeads.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900">
                    <span className="text-[10px] font-medium text-slate-500 block">Est. Enrolments</span>
                    <span className="text-lg font-black text-purple-600 dark:text-purple-400">{calculatedConversions.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900">
                    <span className="text-[10px] font-medium text-slate-500 block">Projected Revenue</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{calculatedRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900">
                    <span className="text-[10px] font-medium text-slate-500 block">Projected ROI</span>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">+{calculatedROI}%</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

      </motion.div>
    </section>
  );
};
