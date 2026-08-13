import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, ShieldAlert, Flame, Bug, Wrench, FolderLock, Award, 
  FileText, Sliders, LogOut, ArrowLeft, Menu, X, Bell, UserCheck, Clock, CheckCircle2,
  Globe, Terminal, Save, Download, Sparkles, RefreshCw, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CyberAuthUser, ThreatItem, IncidentItem, VulnerabilityItem, SecurityToolItem, CyberProjectItem, CyberLabItem, CyberReportItem, CyberCertItem, ThreatStatus, IncidentStatus, RemediationStatus } from '../../types/cybersecurity';
import { INITIAL_THREATS, INITIAL_INCIDENTS, INITIAL_VULNERABILITIES, INITIAL_TOOLS, INITIAL_PROJECTS, INITIAL_LABS, INITIAL_REPORTS, INITIAL_CERTS } from '../../data/cybersecurityData';
import { CyberOverviewTab } from './tabs/CyberOverviewTab';
import { CyberThreatsTab } from './tabs/CyberThreatsTab';
import { CyberIncidentsTab } from './tabs/CyberIncidentsTab';
import { CyberVulnerabilitiesTab } from './tabs/CyberVulnerabilitiesTab';
import { CyberToolsTab } from './tabs/CyberToolsTab';
import { CyberProjectsTab } from './tabs/CyberProjectsTab';
import { CyberLabsTab } from './tabs/CyberLabsTab';
import { CyberReportsTab } from './tabs/CyberReportsTab';
import { CyberLearningTab } from './tabs/CyberLearningTab';
import { CyberAdminTab } from './tabs/CyberAdminTab';
import { CyberThreatMap } from './CyberThreatMap';
import { CybersecurityLogs } from './CybersecurityLogs';
import { CyberD3Heatmap } from './CyberD3Heatmap';
import { CyberSocCLI } from './CyberSocCLI';
import { ToastNotification, ToastMessage } from './ToastNotification';
import { generateSocPdfReport } from '../../utils/cyberReportPdf';
import { saveSocSessionToFirestore, loadSocSessionFromFirestore } from '../../utils/firestoreSocSync';
import { soundFx } from '../../utils/soundEffects';

interface CyberDashboardProps {
  currentUser: CyberAuthUser;
  onLogout: () => void;
  onReturnToPortfolio: () => void;
}

export const CyberDashboard: React.FC<CyberDashboardProps> = ({
  currentUser,
  onLogout,
  onReturnToPortfolio
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [liveClock, setLiveClock] = useState<string>('');
  const [isSyncingFirestore, setIsSyncingFirestore] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Local state initialized with rich default datasets
  const [threats, setThreats] = useState<ThreatItem[]>(INITIAL_THREATS);
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityItem[]>(INITIAL_VULNERABILITIES);
  const [tools, setTools] = useState<SecurityToolItem[]>(INITIAL_TOOLS);
  const [projects, setProjects] = useState<CyberProjectItem[]>(INITIAL_PROJECTS);
  const [labs, setLabs] = useState<CyberLabItem[]>(INITIAL_LABS);
  const [reports, setReports] = useState<CyberReportItem[]>(INITIAL_REPORTS);
  const [certifications, setCertifications] = useState<CyberCertItem[]>(INITIAL_CERTS);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setToasts(prev => [...prev.slice(-4), newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Live UTC Clock Effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveClock(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save Progress to Firestore
  const handleSaveProgress = async () => {
    setIsSyncingFirestore(true);
    soundFx.playCyberBlip();
    const success = await saveSocSessionToFirestore({
      updatedAt: new Date().toISOString(),
      securityScore: 94,
      threats,
      incidents,
      vulnerabilities,
      analystName: currentUser.name || 'Karan Pandre'
    });
    setIsSyncingFirestore(false);

    if (success) {
      soundFx.playSuccess();
      showToast('Session Saved to Firestore', 'All active threats, CVE patches, and SOC progress backed up.', 'success');
    } else {
      showToast('Sync Warning', 'Saved session to browser local storage.', 'warning');
    }
  };

  // Restore Progress from Firestore
  const handleRestoreProgress = async () => {
    setIsSyncingFirestore(true);
    soundFx.playCyberBlip();
    const data = await loadSocSessionFromFirestore();
    setIsSyncingFirestore(false);

    if (data) {
      if (data.threats) setThreats(data.threats);
      if (data.incidents) setIncidents(data.incidents);
      if (data.vulnerabilities) setVulnerabilities(data.vulnerabilities);
      soundFx.playSuccess();
      showToast('Session Restored', `Loaded saved SOC session from ${new Date(data.updatedAt).toLocaleTimeString()}`, 'success');
    } else {
      showToast('No Saved Session', 'No previous session snapshot found in Firestore or local storage.', 'info');
    }
  };

  // Trigger PDF Report Download
  const handleDownloadPdf = () => {
    soundFx.playSuccess();
    generateSocPdfReport({
      threats,
      incidents,
      vulnerabilities,
      securityScore: 94,
      analystName: currentUser.name || 'Karan Pandre'
    });
    showToast('Executive PDF Exported', 'Downloaded official SOC Executive Threat & Vulnerability Report.', 'success');
  };

  // AI Agent CLI Automated Playbook Routine Handler
  const handleExecuteRoutine = (commandText: string) => {
    const lower = commandText.toLowerCase();

    if (lower.includes('threat hunting') || lower.includes('hunt')) {
      setThreats(prev => prev.map(t => ({ ...t, status: 'BLOCKED' as ThreatStatus })));
      showToast('AI Threat Hunting Complete', 'Suricata engine resolved 100% of open anomaly probes.', 'success');
    } else if (lower.includes('scan') || lower.includes('10.0.1.0')) {
      showToast('Subnet Scan Complete', 'Scanned 254 IPs on 10.0.1.0/24. Zero new open vulnerabilities detected.', 'info');
    } else if (lower.includes('contain') || lower.includes('isolate')) {
      setIncidents(prev => prev.map(i => ({ ...i, status: 'CONTAINED' as IncidentStatus })));
      showToast('Automated Containment', 'Applied Cisco BGP Null-Route on target egress vectors.', 'success');
    } else if (lower.includes('report') || lower.includes('pdf')) {
      handleDownloadPdf();
    } else if (lower.includes('block') || lower.includes('ip')) {
      showToast('Firewall Drop Rule Added', 'IP 185.220.101.5 blocked across all Palo Alto gateway firewalls.', 'warning');
    } else {
      showToast('Playbook Executed', `Completed automated routine: "${commandText}"`, 'success');
    }
  };

  // Update Functions for Interactive State
  const handleUpdateThreatStatus = (id: string, newStatus: ThreatStatus) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    showToast('Threat Updated', `Threat ID ${id} set to status: ${newStatus}`, 'info');
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    showToast('Incident Updated', `Incident ID ${id} set to status: ${newStatus}`, 'info');
  };

  const handleUpdateRemediationStatus = (id: string, newStatus: RemediationStatus) => {
    setVulnerabilities(prev => prev.map(v => v.id === id ? { ...v, remediationStatus: newStatus } : v));
    showToast('Vulnerability Status', `CVE remediation status set to: ${newStatus}`, 'success');
  };

  const navItems = [
    { id: 'overview', label: 'SOC Overview', icon: Activity, badge: null },
    { id: 'cli', label: 'AI Agent SOC CLI', icon: Terminal, badge: 'AI' },
    { id: 'heatmap', label: 'D3 Threat Heatmap', icon: Globe, badge: 'LIVE' },
    { id: 'map', label: 'Threat Radar Map', icon: Globe, badge: 'WORLD' },
    { id: 'logs', label: 'SIEM Telemetry Logs', icon: Terminal, badge: 'SPL' },
    { id: 'threats', label: 'Threat Monitoring', icon: ShieldAlert, badge: threats.filter(t => t.status === 'INVESTIGATING').length },
    { id: 'incidents', label: 'Incident Management', icon: Flame, badge: incidents.filter(i => i.status !== 'RESOLVED').length },
    { id: 'vulnerabilities', label: 'Vulnerability CVEs', icon: Bug, badge: vulnerabilities.filter(v => v.severity === 'CRITICAL' && v.remediationStatus !== 'PATCHED').length },
    { id: 'tools', label: 'Security Tools', icon: Wrench, badge: tools.length },
    { id: 'projects', label: 'Cyber Projects', icon: FolderLock, badge: projects.length },
    { id: 'labs', label: 'Security Labs & CTF', icon: Award, badge: labs.length },
    { id: 'reports', label: 'Audit Reports', icon: FileText, badge: reports.length },
    { id: 'learning', label: 'Certifications', icon: Award, badge: null },
    { id: 'admin', label: 'SOC Data Manager', icon: Sliders, badge: 'ADMIN' },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Toast Notification Mount */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Header Navigation Bar */}
      <header className="h-16 bg-[#0d1322]/95 border-b border-emerald-500/20 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        
        {/* Left: Mobile Menu Trigger + Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
            title="Toggle Sidebar Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white font-mono leading-none">
                  SOC COMMAND CENTER
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REAL-TIME ACTIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                Karan Pandre Security Operations & Telemetry Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Clock & Quick Header Actions */}
        <div className="hidden xl:flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{liveClock || 'UTC OPERATIONAL'}</span>
          </div>

          <button
            onClick={handleSaveProgress}
            disabled={isSyncingFirestore}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5 transition-all text-xs"
          >
            {isSyncingFirestore ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-emerald-400" />}
            <span>Save to Firestore</span>
          </button>

          <button
            onClick={handleRestoreProgress}
            disabled={isSyncingFirestore}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold flex items-center gap-1.5 transition-all text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Restore State</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Auto PDF Report</span>
          </button>
        </div>

        {/* Right: User Profile & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onReturnToPortfolio}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Portfolio Main</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-all"
            title="Lock Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Body Grid with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0a0f1d] border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0
          ${isMobileSidebarOpen ? 'translate-x-0 top-16' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-10rem)] pr-1 font-mono text-xs">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playCyberBlip();
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all group ${
                    isActive 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-lg shadow-emerald-950/20' 
                      : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      item.badge === 'AI' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      item.badge === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      typeof item.badge === 'number' && item.badge > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Security System Info */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 font-mono text-[10px]">
            <div className="text-slate-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Session Authenticated</span>
            </div>
            <div className="text-slate-500 truncate">Token: {currentUser.email}</div>

            <button
              onClick={handleDownloadPdf}
              className="w-full mt-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/30 flex items-center justify-center gap-1 transition-all"
            >
              <Download className="w-3 h-3" />
              <span>Export PDF Report</span>
            </button>
          </div>

        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* AI CLI Agent Module Embedded in Overview */}
                  <CyberSocCLI 
                    onExecuteRoutine={handleExecuteRoutine}
                    onShowToast={showToast}
                  />

                  {/* Real-Time D3 Heatmap Embedded in Overview */}
                  <CyberD3Heatmap 
                    onTriggerAction={handleExecuteRoutine}
                    onShowToast={showToast}
                  />

                  {/* Overview Stats & Charts */}
                  <CyberOverviewTab 
                    threats={threats} 
                    incidents={incidents} 
                    vulnerabilities={vulnerabilities}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                </div>
              )}

              {activeTab === 'cli' && (
                <CyberSocCLI 
                  onExecuteRoutine={handleExecuteRoutine}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'heatmap' && (
                <CyberD3Heatmap 
                  onTriggerAction={handleExecuteRoutine}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'map' && (
                <CyberThreatMap />
              )}

              {activeTab === 'logs' && (
                <CybersecurityLogs />
              )}

              {activeTab === 'threats' && (
                <CyberThreatsTab 
                  threats={threats}
                  onUpdateThreatStatus={handleUpdateThreatStatus}
                />
              )}

              {activeTab === 'incidents' && (
                <CyberIncidentsTab 
                  incidents={incidents}
                  onUpdateIncidentStatus={handleUpdateIncidentStatus}
                />
              )}

              {activeTab === 'vulnerabilities' && (
                <CyberVulnerabilitiesTab 
                  vulnerabilities={vulnerabilities}
                  onUpdateRemediationStatus={handleUpdateRemediationStatus}
                />
              )}

              {activeTab === 'tools' && (
                <CyberToolsTab tools={tools} />
              )}

              {activeTab === 'projects' && (
                <CyberProjectsTab projects={projects} />
              )}

              {activeTab === 'labs' && (
                <CyberLabsTab labs={labs} />
              )}

              {activeTab === 'reports' && (
                <CyberReportsTab 
                  reports={reports} 
                  threats={threats}
                  incidents={incidents}
                  vulnerabilities={vulnerabilities}
                  securityScore={94}
                />
              )}

              {activeTab === 'learning' && (
                <CyberLearningTab certifications={certifications} />
              )}

              {activeTab === 'admin' && (
                <CyberAdminTab 
                  threats={threats}
                  incidents={incidents}
                  vulnerabilities={vulnerabilities}
                  tools={tools}
                  projects={projects}
                  labs={labs}
                  reports={reports}
                  certifications={certifications}
                  onAddNewTool={(newT) => setTools(prev => [newT, ...prev])}
                  onAddNewProject={(newP) => setProjects(prev => [newP, ...prev])}
                  onAddNewLab={(newL) => setLabs(prev => [newL, ...prev])}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

    </div>
  );
};
