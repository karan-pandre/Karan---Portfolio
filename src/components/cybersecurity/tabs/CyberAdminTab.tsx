import React, { useState } from 'react';
import { 
  Sliders, Plus, Save, KeyRound, CheckCircle2, Shield, RefreshCw, 
  Search, Filter, LayoutGrid, List, HelpCircle, MoreVertical, 
  RotateCcw, Database, Server, FolderLock, Award, Check, Layers,
  ExternalLink, Activity, UserCheck, User, Terminal, Wifi, XCircle,
  AlertTriangle, ArrowRight, ArrowLeft, Cpu, Zap, Lock, Globe, Wrench
} from 'lucide-react';
import { 
  SecurityToolItem, CyberProjectItem, CyberLabItem, CyberReportItem, CyberCertItem,
  ThreatItem, IncidentItem, VulnerabilityItem
} from '../../../types/cybersecurity';
import { soundFx } from '../../../utils/soundEffects';

interface CyberAdminTabProps {
  threats: ThreatItem[];
  incidents: IncidentItem[];
  vulnerabilities: VulnerabilityItem[];
  tools: SecurityToolItem[];
  projects: CyberProjectItem[];
  labs: CyberLabItem[];
  reports: CyberReportItem[];
  certifications?: CyberCertItem[];
  onAddNewTool: (newTool: SecurityToolItem) => void;
  onAddNewProject: (newProject: CyberProjectItem) => void;
  onAddNewLab: (newLab: CyberLabItem) => void;
  onSelectTool?: (tool: SecurityToolItem) => void;
}

export const CyberAdminTab: React.FC<CyberAdminTabProps> = ({
  tools,
  projects,
  labs,
  onAddNewTool,
  onAddNewProject,
  onAddNewLab,
  onSelectTool
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'tools' | 'projects' | 'labs' | 'credentials'>('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFormHelp, setShowFormHelp] = useState(false);

  // Progressive Wizard Step State (1: Profile, 2: Integration, 3: Controls, 4: Connection Test & Verify)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Profile & Metadata
  const [toolName, setToolName] = useState<string>('');
  const [toolCategory, setToolCategory] = useState<SecurityToolItem['category']>('Network Security');
  const [toolPurpose, setToolPurpose] = useState<string>('');
  const [toolVendor, setToolVendor] = useState<string>('CrowdStrike / Palo Alto Networks');
  const [toolVersion, setToolVersion] = useState<string>('v11.4.2');

  // Step 2: Integration Type & Conditional Fields
  const [integrationType, setIntegrationType] = useState<string>('API / Connector');
  const [apiDetails, setApiDetails] = useState<string>('https://api.crowdstrike.com/v2/ingest');
  const [apiAuthStrategy, setApiAuthStrategy] = useState<string>('Bearer Token');
  const [apiSecret, setApiSecret] = useState<string>('sec_bearer_live_998231a4f0');
  const [epsRateLimit, setEpsRateLimit] = useState<string>('5000 EPS');
  const [sensorPort, setSensorPort] = useState<string>('1514/UDP');
  const [targetOs, setTargetOs] = useState<string>('Linux / Systemd Daemon');
  const [syslogProtocol, setSyslogProtocol] = useState<string>('Syslog TLS (TCP 6514)');
  const [collectorAddress, setCollectorAddress] = useState<string>('10.0.4.12:514');
  const [webhookPath, setWebhookPath] = useState<string>('/api/v1/webhooks/tool-ingest');
  const [webhookHmac, setWebhookHmac] = useState<string>('sha256-hmac-key-9982');
  const [sourceCidr, setSourceCidr] = useState<string>('10.0.0.0/16');

  // Step 3: Security & Remediation Controls
  const [toolStatus, setToolStatus] = useState<'Active' | 'Inactive' | 'Maintenance' | 'Unknown'>('Active');
  const [healthStatus, setHealthStatus] = useState<string>('Healthy');
  const [lastSynced, setLastSynced] = useState<string>('13 Aug 2026, 17:32 UTC');
  const [isAutoRemediationEnabled, setIsAutoRemediationEnabled] = useState<boolean>(true);
  const [alertThreshold, setAlertThreshold] = useState<string>('High & Critical Security Incidents');

  // Step 4: Connection Test Feedback Loop State
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testLatency, setTestLatency] = useState<number>(0);

  // New Project Form State
  const [projName, setProjName] = useState<string>('');
  const [projDesc, setProjDesc] = useState<string>('');
  const [projTech, setProjTech] = useState<string>('Python, Splunk, Cisco IOS');

  // New Lab Form State
  const [labName, setLabName] = useState<string>('');
  const [labPlatform, setLabPlatform] = useState<CyberLabItem['platform']>('TryHackMe');
  const [labDifficulty, setLabDifficulty] = useState<CyberLabItem['difficulty']>('Medium');

  // Credentials Update State
  const [newPasskey, setNewPasskey] = useState<string>('karan2026');
  const [credSavedMsg, setCredSavedMsg] = useState<string>('');

  const handleResetToolForm = () => {
    soundFx.playCyberBlip();
    setCurrentStep(1);
    setToolName('');
    setToolPurpose('');
    setToolVendor('CrowdStrike / Palo Alto Networks');
    setToolVersion('v11.4.2');
    setToolStatus('Active');
    setIntegrationType('API / Connector');
    setApiDetails('https://api.crowdstrike.com/v2/ingest');
    setIsAutoRemediationEnabled(true);
    setTestStatus('idle');
    setTestLogs([]);
  };

  // Real-time Connection Test Function
  const runRealtimeConnectionTest = () => {
    soundFx.playCyberBlip();
    setIsTestingConnection(true);
    setTestStatus('running');
    setTestLogs([
      `[${new Date().toLocaleTimeString()}] INITIATING REAL-TIME CONNECTION TEST FOR ${toolName || 'NEW TOOL'}...`,
      `[${new Date().toLocaleTimeString()}] Target: ${apiDetails || collectorAddress || webhookPath}`,
      `[${new Date().toLocaleTimeString()}] Protocol: ${integrationType} | Auth: ${apiAuthStrategy}`
    ]);

    setTimeout(() => {
      setTestLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Phase 1: Resolving Host DNS & Performing TLS 1.3 Handshake... [OK]`]);
    }, 400);

    setTimeout(() => {
      setTestLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Phase 2: Verifying Authentication Credentials & Permissions... [OK]`]);
    }, 900);

    setTimeout(() => {
      setTestLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Phase 3: Measuring Telemetry Ping Latency (12ms)... [OK]`]);
    }, 1400);

    setTimeout(() => {
      setTestLogs(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] Phase 4: Probing Safe AI Auto-Remediation Webhook Loop... [OK]`,
        `[${new Date().toLocaleTimeString()}] SUCCESS: CONNECTION VERIFIED (HTTP 200 OK - Latency 12ms)`
      ]);
      setIsTestingConnection(false);
      setTestStatus('success');
      setTestLatency(12);
      soundFx.playSuccess();
    }, 1800);
  };

  const handleAddToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName || !toolPurpose) return;

    soundFx.playSuccess();
    const newTool: SecurityToolItem = {
      id: `tool-${Date.now()}`,
      name: toolName,
      category: toolCategory,
      purpose: toolPurpose,
      skillLevel: 'Advanced',
      status: toolStatus === 'Active' ? 'Enterprise Deployment' : 'Practical Lab Usage',
      description: `Configured via Progressive SOC Workflow (${integrationType}). Auto-Remediation: ${isAutoRemediationEnabled ? 'Active' : 'Disabled'}`
    };

    onAddNewTool(newTool);
    handleResetToolForm();
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName || !projDesc) return;

    soundFx.playSuccess();
    const newProj: CyberProjectItem = {
      id: `proj-${Date.now()}`,
      name: projName,
      description: projDesc,
      objective: 'Secure network infrastructure and implement automated threat containment.',
      technologies: projTech.split(',').map(t => t.trim()),
      tools: ['Splunk', 'Cisco Packet Tracer', 'Wireshark'],
      architectureSummary: 'Client Endpoint -> WAF -> Internal SOC SIEM Pipeline.',
      status: 'Completed',
      demonstratedSkills: ['Threat Containment', 'SIEM Integration'],
      keyOutcomes: ['Successfully deployed and verified in private dashboard environment.']
    };

    onAddNewProject(newProj);
    setProjName('');
    setProjDesc('');
  };

  const handleAddLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName) return;

    soundFx.playSuccess();
    const newLab: CyberLabItem = {
      id: `lab-${Date.now()}`,
      name: labName,
      platform: labPlatform,
      difficulty: labDifficulty,
      category: 'SOC Analysis',
      dateCompleted: new Date().toISOString().split('T')[0],
      skillsPracticed: ['SIEM Log Analysis', 'Forensic Packet Inspection'],
      toolsUsed: ['Wireshark', 'Splunk'],
      notes: 'Logged via Cybersecurity Admin Portal.',
      status: 'Completed'
    };

    onAddNewLab(newLab);
    setLabName('');
  };

  // Recent tools preview list
  const recentTools = [
    { name: 'Palo Alto Firewall', cat: 'Network Security', status: 'Active', color: 'bg-emerald-500' },
    { name: 'CrowdStrike Falcon', cat: 'Endpoint Protection', status: 'Active', color: 'bg-emerald-500' },
    { name: 'Wazuh SIEM', cat: 'SIEM', status: 'Maintenance', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b1329] via-[#0d1836] to-[#070c1a] border border-slate-800 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/15 via-cyan-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/40">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-mono tracking-tight flex items-center gap-2">
                SOC Data Manager
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl font-sans">
                Manage your tools, projects, labs, CTF entries & authentication securely.
              </p>
            </div>
          </div>

          {/* 3D Stack Graphic on Right */}
          <div className="hidden lg:flex items-center justify-end">
            <div className="relative w-36 h-20 opacity-90">
              <svg className="w-full h-full" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cylinder 1 (Top) */}
                <ellipse cx="60" cy="15" rx="35" ry="10" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                <path d="M25 15 v10 c0 5.5 15.7 10 35 10 s35 -4.5 35 -10 v-10" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                
                {/* Cylinder 2 (Middle) */}
                <ellipse cx="60" cy="35" rx="35" ry="10" fill="#1e293b" stroke="#059669" strokeWidth="1.5" />
                <path d="M25 35 v10 c0 5.5 15.7 10 35 10 s35 -4.5 35 -10 v-10" fill="#0f172a" stroke="#059669" strokeWidth="1.5" />
                
                {/* Cylinder 3 (Bottom) */}
                <ellipse cx="60" cy="55" rx="35" ry="10" fill="#1e293b" stroke="#047857" strokeWidth="1.5" />
                <path d="M25 55 v10 c0 5.5 15.7 10 35 10 s35 -4.5 35 -10 v-10" fill="#0f172a" stroke="#047857" strokeWidth="1.5" />
                
                {/* Glow dot */}
                <circle cx="82" cy="15" r="2" fill="#34d399" className="animate-ping" />
                <circle cx="82" cy="35" r="2" fill="#34d399" />
                <circle cx="82" cy="55" r="2" fill="#34d399" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              soundFx.playCyberBlip();
              setActiveAdminSubTab('tools');
            }}
            className={`px-4 py-2.5 font-mono text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeAdminSubTab === 'tools'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Security Tools</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeAdminSubTab === 'tools' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
            }`}>
              {tools.length || 8}
            </span>
          </button>

          <button
            onClick={() => {
              soundFx.playCyberBlip();
              setActiveAdminSubTab('projects');
            }}
            className={`px-4 py-2.5 font-mono text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeAdminSubTab === 'projects'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Cyber Projects</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeAdminSubTab === 'projects' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
            }`}>
              {projects.length || 2}
            </span>
          </button>

          <button
            onClick={() => {
              soundFx.playCyberBlip();
              setActiveAdminSubTab('labs');
            }}
            className={`px-4 py-2.5 font-mono text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeAdminSubTab === 'labs'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Labs & CTFs</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeAdminSubTab === 'labs' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
            }`}>
              {labs.length || 3}
            </span>
          </button>

          <button
            onClick={() => {
              soundFx.playCyberBlip();
              setActiveAdminSubTab('credentials');
            }}
            className={`px-4 py-2.5 font-mono text-xs font-bold transition-all border-b-2 ${
              activeAdminSubTab === 'credentials'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Authentication Passkeys
          </button>
        </div>

        {/* Right Search & Filter Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono focus:outline-none focus:border-emerald-500/50 w-36 sm:w-48"
            />
          </div>

          <button className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-mono text-xs transition-all cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: Manage Security Tools */}
      {activeAdminSubTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Tools Overview Card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Overview Card with Donut Metric */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono">Tools Overview</h3>
                <span className="text-[10px] text-slate-500 font-mono">Total Tools</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 font-mono">
                  <div className="text-3xl font-black text-emerald-400">{tools.length || 8}</div>
                  <div className="space-y-1.5 text-xs text-slate-400 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Active</span>
                      <span className="font-bold text-slate-200 ml-auto">6</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Inactive</span>
                      <span className="font-bold text-slate-200 ml-auto">1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span>Maintenance</span>
                      <span className="font-bold text-slate-200 ml-auto">1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                      <span>Unknown</span>
                      <span className="font-bold text-slate-200 ml-auto">0</span>
                    </div>
                  </div>
                </div>

                {/* Donut graphic */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="75, 100"
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-500"
                      strokeDasharray="12, 100"
                      strokeDashoffset="-75"
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center font-mono">
                    <span className="block text-base font-black text-white">{tools.length || 8}</span>
                    <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-wider">Tools</span>
                  </div>
                </div>
              </div>

              {/* Recent Tools List */}
              <div className="border-t border-slate-800/80 pt-4 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold">Recent Tools</span>
                  <button className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold">View all</button>
                </div>

                <div className="space-y-2">
                  {recentTools.map((t, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        if (onSelectTool) {
                          soundFx.playCyberBlip();
                          const toolMatch = tools.find(x => x.name.toLowerCase().includes(t.name.toLowerCase().split(' ')[0])) || tools[0];
                          if (toolMatch) onSelectTool(toolMatch);
                        }
                      }}
                      className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50">
                          <Layers className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">{t.name}</div>
                          <div className="text-[10px] text-slate-500">{t.cat}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
                          <span className={`w-1.5 h-1.5 rounded-full ${t.color}`} />
                          {t.status}
                        </span>
                        <button className="text-slate-500 hover:text-slate-300 p-1">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Progressive Multi-Step Security Tool Registration Wizard */}
          <div className="lg:col-span-8">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-mono shadow-xl">
              
              {/* Form Title & Help Toggle */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add New Security Tool Record</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                    Progressive multi-step configuration with conditional integration logic and real-time connectivity validation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFormHelp(!showFormHelp)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Form Help</span>
                </button>
              </div>

              {showFormHelp && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SOC Progressive Configuration Guidance:</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 font-sans">
                    Follow the 4-step workflow to register enterprise security tools. Conditional fields automatically adapt based on your selected integration protocol (API, Agent, Log Forwarder, Webhook). Step 4 validates endpoint reachability and credentials before saving.
                  </p>
                </div>
              )}

              {/* Progressive Wizard Step Indicator Bar */}
              <div className="grid grid-cols-4 gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => { soundFx.playCyberBlip(); setCurrentStep(1); }}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentStep === 1 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : currentStep > 1 ? 'bg-slate-900 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                    currentStep === 1 ? 'bg-emerald-500 text-slate-950' : currentStep > 1 ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>1</span>
                  <span className="hidden sm:inline">Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => { soundFx.playCyberBlip(); setCurrentStep(2); }}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentStep === 2 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : currentStep > 2 ? 'bg-slate-900 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                    currentStep === 2 ? 'bg-emerald-500 text-slate-950' : currentStep > 2 ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>2</span>
                  <span className="hidden sm:inline">Integration</span>
                </button>

                <button
                  type="button"
                  onClick={() => { soundFx.playCyberBlip(); setCurrentStep(3); }}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentStep === 3 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : currentStep > 3 ? 'bg-slate-900 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                    currentStep === 3 ? 'bg-emerald-500 text-slate-950' : currentStep > 3 ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>3</span>
                  <span className="hidden sm:inline">Controls</span>
                </button>

                <button
                  type="button"
                  onClick={() => { soundFx.playCyberBlip(); setCurrentStep(4); }}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentStep === 4 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                    currentStep === 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}>4</span>
                  <span className="hidden sm:inline">Live Test</span>
                </button>
              </div>

              {/* Form Content Steps */}
              <form onSubmit={handleAddToolSubmit} className="space-y-4 text-xs font-mono">
                
                {/* STEP 1: Tool Profile & Basic Metadata */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                      <span>STEP 1: TOOL PROFILE & METADATA</span>
                      <span className="text-[10px] text-slate-500">Basic identification</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-300 font-bold block mb-1">
                          Tool Name <span className="text-emerald-400">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <UserCheck className="w-4 h-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            required
                            value={toolName}
                            onChange={(e) => setToolName(e.target.value)}
                            placeholder="e.g., CrowdStrike Falcon, Wazuh, Palo Alto Panorama"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-slate-200 focus:outline-none focus:border-emerald-500/60 placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 font-bold block mb-1">
                          Category <span className="text-emerald-400">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <Shield className="w-4 h-4 text-emerald-400" />
                          </div>
                          <select
                            value={toolCategory}
                            onChange={(e) => setToolCategory(e.target.value as any)}
                            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-slate-200 focus:outline-none focus:border-emerald-500/60 cursor-pointer appearance-none"
                          >
                            <option value="Network Security" className="bg-slate-900">Network Security</option>
                            <option value="Endpoint Protection" className="bg-slate-900">Endpoint Protection</option>
                            <option value="SIEM & Monitoring" className="bg-slate-900">SIEM & Monitoring</option>
                            <option value="Cloud Security" className="bg-slate-900">Cloud Security</option>
                            <option value="Offensive Security" className="bg-slate-900">Offensive Security</option>
                            <option value="Vulnerability Management" className="bg-slate-900">Vulnerability Management</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
                            ⌄
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-bold">Vendor Name</label>
                        <input
                          type="text"
                          value={toolVendor}
                          onChange={(e) => setToolVendor(e.target.value)}
                          placeholder="Vendor name (e.g., CrowdStrike, Palo Alto)"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-slate-200 focus:outline-none focus:border-emerald-500/60 placeholder:text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-bold">Software Version</label>
                        <input
                          type="text"
                          value={toolVersion}
                          onChange={(e) => setToolVersion(e.target.value)}
                          placeholder="e.g., v11.4.2"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-slate-200 focus:outline-none focus:border-emerald-500/60 placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 font-bold block mb-1">
                        Purpose & Capabilities <span className="text-emerald-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={toolPurpose}
                        onChange={(e) => setToolPurpose(e.target.value)}
                        placeholder="Describe tool use case, telemetry ingestion, and key security capabilities..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-slate-200 focus:outline-none focus:border-emerald-500/60 placeholder:text-slate-600 resize-none font-sans text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={handleResetToolForm}
                        className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        Reset Form
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!toolName) {
                            soundFx.playError();
                            return;
                          }
                          soundFx.playCyberBlip();
                          setCurrentStep(2);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
                      >
                        <span>Next: Integration Protocol</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Integration Type & Conditional Field Logic */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                      <span>STEP 2: INTEGRATION & PROTOCOL CONFIGURATION</span>
                      <span className="text-[10px] text-cyan-400 font-mono">Conditional logic active</span>
                    </div>

                    {/* Integration Selector */}
                    <div>
                      <label className="text-[11px] text-slate-300 font-bold block mb-1">
                        Integration Protocol <span className="text-emerald-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['API / Connector', 'Agent / Sensor', 'Log Forwarder', 'Webhook'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              soundFx.playCyberBlip();
                              setIntegrationType(type);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                              integrationType === type
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/30'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="text-[11px]">{type}</div>
                            <div className="text-[9px] text-slate-500 font-normal">
                              {type.includes('API') ? 'HTTP REST API' : type.includes('Agent') ? 'Native Daemon' : type.includes('Log') ? 'Syslog / CEF' : 'HTTP Push'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CONDITIONAL FIELDS BASED ON INTEGRATION TYPE */}
                    {integrationType === 'API / Connector' && (
                      <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-3.5">
                        <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>REST API Ingestion Settings</span>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1 font-bold">API Endpoint URL</label>
                          <input
                            type="text"
                            value={apiDetails}
                            onChange={(e) => setApiDetails(e.target.value)}
                            placeholder="https://api.crowdstrike.com/v2/ingest"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500/60 font-mono text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1 font-bold">Auth Strategy</label>
                            <select
                              value={apiAuthStrategy}
                              onChange={(e) => setApiAuthStrategy(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500/60 cursor-pointer"
                            >
                              <option value="Bearer Token">Bearer Token</option>
                              <option value="API Key & Secret">API Key & Secret</option>
                              <option value="OAuth 2.0 mTLS">OAuth 2.0 mTLS</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1 font-bold">Bearer Token / Secret</label>
                            <div className="relative">
                              <input
                                type="password"
                                value={apiSecret}
                                onChange={(e) => setApiSecret(e.target.value)}
                                className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500/60 font-mono text-xs"
                              />
                              <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1 font-bold">EPS Rate Limit Cap</label>
                          <input
                            type="text"
                            value={epsRateLimit}
                            onChange={(e) => setEpsRateLimit(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500/60 font-mono text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {integrationType === 'Agent / Sensor' && (
                      <div className="p-4 rounded-xl bg-slate-950/90 border border-purple-500/30 space-y-3.5">
                        <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-purple-400" />
                          <span>Endpoint Sensor Daemon Settings</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1 font-bold">Sensor Daemon Port</label>
                            <input
                              type="text"
                              value={sensorPort}
                              onChange={(e) => setSensorPort(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500/60 font-mono text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1 font-bold">Target OS Environment</label>
                            <select
                              value={targetOs}
                              onChange={(e) => setTargetOs(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500/60 cursor-pointer"
                            >
                              <option value="Linux / Systemd Daemon">Linux / Systemd Daemon</option>
                              <option value="Windows Defender Service">Windows Defender Service</option>
                              <option value="Kubernetes DaemonSet">Kubernetes DaemonSet</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {integrationType === 'Log Forwarder' && (
                      <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-3.5">
                        <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <Wifi className="w-3.5 h-3.5 text-amber-400" />
                          <span>Syslog & Collector Settings</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1 font-bold">Syslog Protocol</label>
                            <input
                              type="text"
                              value={syslogProtocol}
                              onChange={(e) => setSyslogProtocol(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/60 font-mono text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1 font-bold">Collector Host & Port</label>
                            <input
                              type="text"
                              value={collectorAddress}
                              onChange={(e) => setCollectorAddress(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/60 font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {integrationType === 'Webhook' && (
                      <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-3.5">
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Webhook Ingestion Settings</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1 font-bold">Listener Endpoint Path</label>
                            <input
                              type="text"
                              value={webhookPath}
                              onChange={(e) => setWebhookPath(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500/60 font-mono text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1 font-bold">Allowed Source CIDR</label>
                            <input
                              type="text"
                              value={sourceCidr}
                              onChange={(e) => setSourceCidr(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500/60 font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => { soundFx.playCyberBlip(); setCurrentStep(1); }}
                        className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back: Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { soundFx.playCyberBlip(); setCurrentStep(3); }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
                      >
                        <span>Next: Security Controls</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Security & Remediation Controls */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                      <span>STEP 3: SECURITY & REMEDIATION CONTROLS</span>
                      <span className="text-[10px] text-slate-500">Execution parameters</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-bold">Operational Status</label>
                        <select
                          value={toolStatus}
                          onChange={(e) => setToolStatus(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                        >
                          <option value="Active" className="bg-slate-900 text-emerald-400">● Active</option>
                          <option value="Inactive" className="bg-slate-900 text-amber-400">● Inactive</option>
                          <option value="Maintenance" className="bg-slate-900 text-purple-400">● Maintenance</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-bold">Health Status</label>
                        <select
                          value={healthStatus}
                          onChange={(e) => setHealthStatus(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                        >
                          <option value="Healthy" className="bg-slate-900 text-emerald-400">Healthy</option>
                          <option value="Degraded" className="bg-slate-900 text-amber-400">Degraded</option>
                          <option value="Offline" className="bg-slate-900 text-slate-400">Offline</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-bold">Alert Ingestion Threshold</label>
                      <select
                        value={alertThreshold}
                        onChange={(e) => setAlertThreshold(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-slate-200 font-bold focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                      >
                        <option value="All Security Alerts">All Security Alerts & Audits</option>
                        <option value="High & Critical Security Incidents">High & Critical Security Incidents</option>
                        <option value="Critical System Outages Only">Critical System Outages Only</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>AI Auto-Remediation Enabled</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans">
                          Allow AI Agent to trigger safe, policy-bounded auto-remediation for this tool.
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playCyberBlip();
                          setIsAutoRemediationEnabled(!isAutoRemediationEnabled);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          isAutoRemediationEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isAutoRemediationEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => { soundFx.playCyberBlip(); setCurrentStep(2); }}
                        className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back: Integration</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { soundFx.playCyberBlip(); setCurrentStep(4); }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
                      >
                        <span>Next: Real-Time Test</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Real-Time Connection Test Feedback Loop & Final Submit */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                      <span>STEP 4: REAL-TIME CONNECTION TEST & REVIEW</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Live Validation Loop</span>
                    </div>

                    {/* Live Terminal Console for Connection Testing */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          <span>Endpoint Connectivity Tester</span>
                        </div>

                        <button
                          type="button"
                          disabled={isTestingConnection}
                          onClick={runRealtimeConnectionTest}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                          <span>{isTestingConnection ? 'Testing...' : 'Run Connection Test'}</span>
                        </button>
                      </div>

                      {/* Log Console Output */}
                      <div className="p-3 rounded-lg bg-black/80 border border-slate-900 text-[11px] space-y-1 max-h-36 overflow-y-auto font-mono text-slate-300">
                        {testLogs.length === 0 ? (
                          <div className="text-slate-600 italic">Click "Run Connection Test" to trigger live TLS handshake, auth credential probe, and latency check...</div>
                        ) : (
                          testLogs.map((log, idx) => (
                            <div key={idx} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                              {log}
                            </div>
                          ))
                        )}
                      </div>

                      {testStatus === 'success' && (
                        <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between font-bold">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>CONNECTION VERIFIED - HTTP 200 OK</span>
                          </div>
                          <span className="text-[10px] text-emerald-200 bg-emerald-900 px-2 py-0.5 rounded-full">
                            Latency: {testLatency}ms
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Summary Card */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                      <div className="font-bold text-slate-300 border-b border-slate-800 pb-1">Tool Summary Configuration:</div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span className="text-slate-500">Name:</span> <span className="text-white font-bold">{toolName || 'CrowdStrike Falcon'}</span></div>
                        <div><span className="text-slate-500">Category:</span> <span className="text-emerald-400 font-bold">{toolCategory}</span></div>
                        <div><span className="text-slate-500">Integration:</span> <span className="text-cyan-400">{integrationType}</span></div>
                        <div><span className="text-slate-500">Auto-Remediation:</span> <span className={isAutoRemediationEnabled ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{isAutoRemediationEnabled ? 'ACTIVE' : 'OFF'}</span></div>
                      </div>
                    </div>

                    {/* Final Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => { soundFx.playCyberBlip(); setCurrentStep(3); }}
                        className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back: Controls</span>
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60"
                      >
                        <Plus className="w-4 h-4 text-white" />
                        <span>Save Tool Entry</span>
                      </button>
                    </div>
                  </div>
                )}

              </form>

            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: Manage Projects */}
      {activeAdminSubTab === 'projects' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <FolderLock className="w-4 h-4 text-emerald-400" />
            <span>Add New Cyber Project Entry</span>
          </h3>

          <form onSubmit={handleAddProjectSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] text-slate-300 font-bold block mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                placeholder="e.g. Zero Trust Architecture & Cisco Packet Tracer ACL Automation"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-bold block mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                placeholder="High-level summary of architecture, impact, and results..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Technologies Used (Comma Separated)</label>
              <input
                type="text"
                value={projTech}
                onChange={(e) => setProjTech(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Add Project Record</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: Manage Labs & CTFs */}
      {activeAdminSubTab === 'labs' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Log Security Lab or CTF Entry</span>
          </h3>

          <form onSubmit={handleAddLabSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">Lab / Challenge Name *</label>
                <input
                  type="text"
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="e.g. TryHackMe - Wireshark Forensics Deep Dive"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">Platform *</label>
                <select
                  value={labPlatform}
                  onChange={(e) => setLabPlatform(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                >
                  <option value="TryHackMe">TryHackMe</option>
                  <option value="HackTheBox">HackTheBox</option>
                  <option value="Cisco NetAcad">Cisco NetAcad</option>
                  <option value="PortSwigger Academy">PortSwigger Academy</option>
                  <option value="Custom SOC Lab">Custom SOC Lab</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Log Lab Completion</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 4: Authentication Passkeys */}
      {activeAdminSubTab === 'credentials' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Update Local Security Passkey</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">New Demo Admin Passkey</label>
              <input
                type="text"
                value={newPasskey}
                onChange={(e) => setNewPasskey(e.target.value)}
                className="w-full max-w-sm px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playSuccess();
                setCredSavedMsg(`Passkey updated to "${newPasskey}". Stored in encrypted session configuration.`);
                setTimeout(() => setCredSavedMsg(''), 4000);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Update Passkey
            </button>

            {credSavedMsg && (
              <p className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold">
                {credSavedMsg}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
