import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, ShieldAlert, Flame, Bug, Wrench, FolderLock, Award, 
  FileText, Sliders, LogOut, ArrowLeft, Menu, X, Bell, UserCheck, Clock, CheckCircle2 
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

  // Local state initialized with rich default datasets
  const [threats, setThreats] = useState<ThreatItem[]>(INITIAL_THREATS);
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityItem[]>(INITIAL_VULNERABILITIES);
  const [tools, setTools] = useState<SecurityToolItem[]>(INITIAL_TOOLS);
  const [projects, setProjects] = useState<CyberProjectItem[]>(INITIAL_PROJECTS);
  const [labs, setLabs] = useState<CyberLabItem[]>(INITIAL_LABS);
  const [reports, setReports] = useState<CyberReportItem[]>(INITIAL_REPORTS);
  const [certifications, setCertifications] = useState<CyberCertItem[]>(INITIAL_CERTS);

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

  // Update Functions for Interactive State
  const handleUpdateThreatStatus = (id: string, newStatus: ThreatStatus) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const handleUpdateRemediationStatus = (id: string, newStatus: RemediationStatus) => {
    setVulnerabilities(prev => prev.map(v => v.id === id ? { ...v, remediationStatus: newStatus } : v));
  };

  const navItems = [
    { id: 'overview', label: 'SOC Overview', icon: Activity, badge: null },
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

        {/* Right: Live Clock, User Profile & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Live UTC Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{liveClock || 'UTC Synchronized'}</span>
          </div>

          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left font-mono">
              <div className="text-xs font-bold text-slate-200">{currentUser.username}</div>
              <div className="text-[9px] text-emerald-400">SOC Analyst Session Active</div>
            </div>
          </div>

          {/* Return to Portfolio Link */}
          <button
            onClick={onReturnToPortfolio}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            title="Return to Public Portfolio"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Portfolio</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              soundFx.playCyberBlip();
              onLogout();
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            title="End Session & Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

        </div>

      </header>

      {/* Main Workspace Layout (Sidebar + Content) */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className={`w-64 bg-[#0a0f1d] border-r border-slate-800/80 p-4 space-y-2 flex flex-col justify-between shrink-0 transition-all duration-300 absolute lg:relative z-30 inset-y-0 left-0 ${
          isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}>
          
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
              SOC Command Modules
            </div>

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
                  className={`w-full px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600/30 via-teal-600/20 to-transparent text-emerald-300 border-l-4 border-emerald-400 pl-3 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
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
                      item.badge === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
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
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1 font-mono text-[10px]">
            <div className="text-slate-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Session Authenticated</span>
            </div>
            <div className="text-slate-500 truncate">Token: {currentUser.email}</div>
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
            >
              {activeTab === 'overview' && (
                <CyberOverviewTab 
                  threats={threats} 
                  incidents={incidents} 
                  vulnerabilities={vulnerabilities}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
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
                <CyberReportsTab reports={reports} />
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
