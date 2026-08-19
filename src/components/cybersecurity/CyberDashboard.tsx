import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, ShieldAlert, Flame, Bug, Wrench, FolderLock, Award, 
  FileText, Sliders, LogOut, ArrowLeft, Menu, X, Bell, UserCheck, Clock, CheckCircle2,
  Globe, Terminal, Save, Download, Sparkles, RefreshCw, Cpu, Search, HelpCircle,
  ChevronRight, Server, Zap, Radio, Layers, Eye, ChevronLeft, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CyberAuthUser, ThreatItem, IncidentItem, VulnerabilityItem, SecurityToolItem, 
  CyberProjectItem, CyberLabItem, CyberReportItem, CyberCertItem, AssetItem, PersonaRole,
  ThreatStatus, IncidentStatus, RemediationStatus,
  SocNotificationItem, NotificationCategory, NotificationPreferences, ThreatSeverity
} from '../../types/cybersecurity';
import { 
  INITIAL_THREATS, INITIAL_INCIDENTS, INITIAL_VULNERABILITIES, INITIAL_TOOLS, 
  INITIAL_PROJECTS, INITIAL_LABS, INITIAL_REPORTS, INITIAL_CERTS, INITIAL_ASSETS,
  DEMO_THREATS, DEMO_INCIDENTS, DEMO_VULNERABILITIES, DEMO_ASSETS, DEMO_TOOLS,
  INITIAL_NOTIFICATIONS
} from '../../data/cybersecurityData';
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
import { CyberAssetsTab } from './tabs/CyberAssetsTab';
import { CyberPlaybooksTab } from './tabs/CyberPlaybooksTab';
import { CyberHuntingTab } from './tabs/CyberHuntingTab';
import { CyberThreatMap } from './CyberThreatMap';
import { CybersecurityLogs } from './CybersecurityLogs';
import { CyberD3Heatmap } from './CyberD3Heatmap';
import { CyberSocCLI } from './CyberSocCLI';
import { AutomatedDetectionRulesPanel } from './AutomatedDetectionRulesPanel';
import { CommandPaletteModal } from './CommandPaletteModal';
import { ConfirmationModal } from './ConfirmationModal';
import { AssetDetailDrawer } from './AssetDetailDrawer';
import { ToolDetailDrawer } from './ToolDetailDrawer';
import { GuidedTourModal } from './GuidedTourModal';
import { CyberDemoMode } from './CyberDemoMode';
import { SystemAuditModal } from './SystemAuditModal';
import { CyberNotificationCenter } from './CyberNotificationCenter';
import { ToastNotification, ToastMessage } from './ToastNotification';
import { generateSocPdfReport } from '../../utils/cyberReportPdf';
import { saveSocSessionToFirestore, loadSocSessionFromFirestore } from '../../utils/firestoreSocSync';
import { calculateSecurityHealthScore } from '../../utils/securityScoreEngine';
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
  const [activeTab, setActiveTab] = useState<string>('admin');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [liveClock, setLiveClock] = useState<string>('');
  const [isSyncingFirestore, setIsSyncingFirestore] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [persona, setPersona] = useState<PersonaRole>('Auditor');
  const [environmentMode, setEnvironmentMode] = useState<'LIVE' | 'DEMO'>('LIVE');

  // Notification Center & Persistent State
  const [notifications, setNotifications] = useState<SocNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    soundEnabled: true,
    toastDuration: 5,
    dndMode: false,
    categories: {
      CRITICAL_ALERT: true,
      REMEDIATION_ACTION: true,
      DETECTION_RULE: true,
      SECURITY_INTEL: true,
      SYSTEM_HEALTH: true,
    }
  });

  // Modals & Drawers State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [selectedTool, setSelectedTool] = useState<SecurityToolItem | null>(null);

  // Confirmation Modal State
  const [confirmationConfig, setConfirmationConfig] = useState<{
    isOpen: boolean;
    title: string;
    target: string;
    riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    expectedImpact: string;
    reason: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    target: '',
    riskLevel: 'HIGH',
    expectedImpact: '',
    reason: '',
    onConfirm: () => {}
  });

  // Partitioned Datasets for LIVE vs DEMO Environment Mode
  const [liveThreats, setLiveThreats] = useState<ThreatItem[]>(INITIAL_THREATS);
  const [liveIncidents, setLiveIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [liveVulnerabilities, setLiveVulnerabilities] = useState<VulnerabilityItem[]>(INITIAL_VULNERABILITIES);
  const [liveTools, setLiveTools] = useState<SecurityToolItem[]>(INITIAL_TOOLS);
  const [liveAssets, setLiveAssets] = useState<AssetItem[]>(INITIAL_ASSETS);

  const [demoThreats, setDemoThreats] = useState<ThreatItem[]>(DEMO_THREATS);
  const [demoIncidents, setDemoIncidents] = useState<IncidentItem[]>(DEMO_INCIDENTS);
  const [demoVulnerabilities, setDemoVulnerabilities] = useState<VulnerabilityItem[]>(DEMO_VULNERABILITIES);
  const [demoTools, setDemoTools] = useState<SecurityToolItem[]>(DEMO_TOOLS);
  const [demoAssets, setDemoAssets] = useState<AssetItem[]>(DEMO_ASSETS);

  // Active Datasets mapped to current Environment Mode
  const threats = environmentMode === 'LIVE' ? liveThreats : demoThreats;
  const incidents = environmentMode === 'LIVE' ? liveIncidents : demoIncidents;
  const vulnerabilities = environmentMode === 'LIVE' ? liveVulnerabilities : demoVulnerabilities;
  const tools = environmentMode === 'LIVE' ? liveTools : demoTools;
  const assets = environmentMode === 'LIVE' ? liveAssets : demoAssets;

  const setThreats: React.Dispatch<React.SetStateAction<ThreatItem[]>> = (val) => {
    if (environmentMode === 'LIVE') setLiveThreats(val);
    else setDemoThreats(val);
  };
  const setIncidents: React.Dispatch<React.SetStateAction<IncidentItem[]>> = (val) => {
    if (environmentMode === 'LIVE') setLiveIncidents(val);
    else setDemoIncidents(val);
  };
  const setVulnerabilities: React.Dispatch<React.SetStateAction<VulnerabilityItem[]>> = (val) => {
    if (environmentMode === 'LIVE') setLiveVulnerabilities(val);
    else setDemoVulnerabilities(val);
  };
  const setTools: React.Dispatch<React.SetStateAction<SecurityToolItem[]>> = (val) => {
    if (environmentMode === 'LIVE') setLiveTools(val);
    else setDemoTools(val);
  };
  const setAssets: React.Dispatch<React.SetStateAction<AssetItem[]>> = (val) => {
    if (environmentMode === 'LIVE') setLiveAssets(val);
    else setDemoAssets(val);
  };

  const [projects, setProjects] = useState<CyberProjectItem[]>(INITIAL_PROJECTS);
  const [labs, setLabs] = useState<CyberLabItem[]>(INITIAL_LABS);
  const [reports, setReports] = useState<CyberReportItem[]>(INITIAL_REPORTS);
  const [certifications, setCertifications] = useState<CyberCertItem[]>(INITIAL_CERTS);

  // Enhanced Notification & Toast Helper
  const showToast = (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    options?: {
      category?: NotificationCategory;
      severity?: ThreatSeverity;
      targetTab?: string;
      targetId?: string;
      metadata?: { sourceIp?: string; targetAsset?: string; ruleId?: string; hash?: string; cve?: string };
    }
  ) => {
    // Determine category and severity
    const category: NotificationCategory = options?.category || (
      type === 'error' ? 'CRITICAL_ALERT' :
      type === 'success' ? 'REMEDIATION_ACTION' :
      type === 'warning' ? 'DETECTION_RULE' : 'SYSTEM_HEALTH'
    );
    const severity: ThreatSeverity = options?.severity || (
      type === 'error' ? 'CRITICAL' :
      type === 'warning' ? 'HIGH' :
      type === 'success' ? 'MEDIUM' : 'LOW'
    );

    // Auto-append to persistent Notification Center
    const newNotification: SocNotificationItem = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      title,
      message,
      category,
      severity,
      read: false,
      pinned: severity === 'CRITICAL',
      targetTab: options?.targetTab,
      targetId: options?.targetId,
      metadata: options?.metadata
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play sound if enabled and not DND (unless critical)
    if (notificationPreferences.soundEnabled && (!notificationPreferences.dndMode || severity === 'CRITICAL')) {
      soundFx.playCyberBlip();
    }

    // Check if DND or category filtered for popup toast
    if (notificationPreferences.dndMode && severity !== 'CRITICAL') {
      return;
    }

    if (!notificationPreferences.categories[category]) {
      return;
    }

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

  // Notification Center Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Updated', 'All alerts marked as read in SOC history', 'info');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showToast('Notification Stream Cleared', 'All cached alerts purged from memory', 'info');
  };

  const handleTogglePinNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const handleUpdateNotificationPreferences = (newPrefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => ({
      ...prev,
      ...newPrefs,
      categories: { ...prev.categories, ...(newPrefs.categories || {}) }
    }));
  };

  const handleTriggerSimulatedAlert = (category: NotificationCategory) => {
    switch (category) {
      case 'CRITICAL_ALERT':
        showToast(
          'Simulated Ransomware Activity Detected',
          'Mass encrypted file write operations (.locked) detected on storage-node-01.',
          'error',
          {
            category: 'CRITICAL_ALERT',
            severity: 'CRITICAL',
            targetTab: 'incidents',
            metadata: { targetAsset: 'storage-node-01', ruleId: 'RULE-RANSOM-09' }
          }
        );
        break;
      case 'REMEDIATION_ACTION':
        showToast(
          'Automated Firewall Isolation Verified',
          'Perimeter firewall dropped malicious subnet 194.26.29.0/24 with SHA-256 integrity hash verification.',
          'success',
          {
            category: 'REMEDIATION_ACTION',
            severity: 'HIGH',
            targetTab: 'detection-rules',
            metadata: { sourceIp: '194.26.29.112', hash: 'sha256-f87c2b19e4a055d28b1a' }
          }
        );
        break;
      case 'DETECTION_RULE':
        showToast(
          'SIEM Correlated Brute-Force Match',
          'Detection Rule RULE-BRUTE-01 triggered: 1,420 failed SSH logins from 185.220.101.5 in 30s.',
          'warning',
          {
            category: 'DETECTION_RULE',
            severity: 'HIGH',
            targetTab: 'detection-rules',
            metadata: { sourceIp: '185.220.101.5', ruleId: 'RULE-BRUTE-01' }
          }
        );
        break;
      case 'SECURITY_INTEL':
        showToast(
          'New Threat Intel Bulletin (CVE-2026-9041)',
          'CVSS 9.8 Remote Code Execution advisory published for OpenSSH daemon.',
          'info',
          {
            category: 'SECURITY_INTEL',
            severity: 'CRITICAL',
            targetTab: 'vulnerabilities',
            metadata: { cve: 'CVE-2026-9041' }
          }
        );
        break;
      case 'SYSTEM_HEALTH':
      default:
        showToast(
          'SIEM Agent Heartbeat Synchronized',
          'All Wazuh EDR endpoints and Suricata sensor buffers reporting nominal 0% packet loss.',
          'info',
          {
            category: 'SYSTEM_HEALTH',
            severity: 'LOW',
            targetTab: 'logs'
          }
        );
        break;
    }
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

  // Keyboard Shortcuts (⌘K & G-then-X sequences)
  useEffect(() => {
    let pendingGKey = false;
    let timer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keybindings inside text inputs or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsGuidedTourOpen(true);
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        pendingGKey = true;
        clearTimeout(timer);
        timer = setTimeout(() => { pendingGKey = false; }, 1000);
        return;
      }

      if (pendingGKey) {
        pendingGKey = false;
        const key = e.key.toLowerCase();
        if (key === 'o') setActiveTab('overview');
        if (key === 't') setActiveTab('threats');
        if (key === 'i') setActiveTab('incidents');
        if (key === 'v') setActiveTab('vulnerabilities');
        if (key === 'a') setActiveTab('cli');
        if (key === 'm') setActiveTab('admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, []);

  // Save Progress to Firestore
  const handleSaveProgress = async () => {
    setIsSyncingFirestore(true);
    soundFx.playCyberBlip();
    const currentScore = calculateSecurityHealthScore(threats, incidents, vulnerabilities, assets, tools).totalScore;
    const success = await saveSocSessionToFirestore({
      updatedAt: new Date().toISOString(),
      securityScore: currentScore,
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
      triggerHostIsolationModal('WIN-104 (10.0.2.45)');
    } else if (lower.includes('report') || lower.includes('pdf')) {
      handleDownloadPdf();
    } else if (lower.includes('block') || lower.includes('ip')) {
      triggerBlockIocModal('185.220.101.5');
    } else {
      showToast('Playbook Executed', `Completed automated routine: "${commandText}"`, 'success');
    }
  };

  // High-Impact Action Confirmation Triggers
  const triggerHostIsolationModal = (hostName: string) => {
    setConfirmationConfig({
      isOpen: true,
      title: 'Isolate Host From VLAN',
      target: hostName,
      riskLevel: 'CRITICAL',
      expectedImpact: 'Port quarantine applied via Cisco ISE 802.1X. All active TCP/UDP sockets terminated immediately.',
      reason: 'Unverified administrative Kerberos ticket requests and suspicious outbound C2 beaconing detected.',
      onConfirm: () => {
        setAssets(prev => prev.map(a => a.name.includes(hostName) || hostName.includes(a.name) ? { ...a, health: 'Isolated' } : a));
        setIncidents(prev => prev.map(i => ({ ...i, status: 'CONTAINED' as IncidentStatus })));
        showToast('Host Isolated', `${hostName} isolated from corporate network via Cisco ISE.`, 'success');
      }
    });
  };

  const triggerBlockIocModal = (ipAddress: string) => {
    setConfirmationConfig({
      isOpen: true,
      title: 'Block Egress IP on Edge Firewalls',
      target: ipAddress,
      riskLevel: 'HIGH',
      expectedImpact: 'BGP null-route and Palo Alto PA-3220 drop rule added across all perimeter firewalls.',
      reason: 'Malicious external IP associated with active DNS tunneling and password brute-force probing.',
      onConfirm: () => {
        setThreats(prev => prev.map(t => t.sourceIp === ipAddress ? { ...t, status: 'BLOCKED' as ThreatStatus } : t));
        showToast('IOC Blacklisted', `Egress IP ${ipAddress} blocked on all Palo Alto edge firewalls.`, 'warning');
      }
    });
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

  // Navigation Groups Structure
  const navGroups = [
    {
      groupLabel: 'COMMAND CENTER',
      items: [
        { id: 'overview', label: 'SOC Overview', icon: Activity, badge: null }
      ]
    },
    {
      groupLabel: 'INVESTIGATE',
      items: [
        { id: 'threats', label: 'Threat Monitoring', icon: ShieldAlert, badge: threats.filter(t => t.status === 'INVESTIGATING').length },
        { id: 'incidents', label: 'Incident Triage', icon: Flame, badge: incidents.filter(i => i.status !== 'RESOLVED').length },
        { id: 'hunting', label: 'Threat Hunting', icon: Search, badge: 'HUNTER' }
      ]
    },
    {
      groupLabel: 'EXPOSURE',
      items: [
        { id: 'vulnerabilities', label: 'Vulnerabilities & CVEs', icon: Bug, badge: vulnerabilities.filter(v => v.severity === 'CRITICAL' && v.remediationStatus !== 'PATCHED').length },
        { id: 'assets', label: 'Assets Inventory', icon: Server, badge: assets.length }
      ]
    },
    {
      groupLabel: 'NETWORK',
      items: [
        { id: 'heatmap', label: 'D3 Threat Heatmap', icon: Zap, badge: 'LIVE' },
        { id: 'map', label: 'Threat Radar Map', icon: Globe, badge: 'WORLD' },
        { id: 'logs', label: 'SIEM Telemetry Logs', icon: Terminal, badge: 'SPL' }
      ]
    },
    {
      groupLabel: 'AUTOMATION',
      items: [
        { id: 'detection-rules', label: 'Detection Rules Engine', icon: Cpu, badge: 'RULES' },
        { id: 'cli', label: 'AI Agent SOC CLI', icon: Terminal, badge: 'AI' },
        { id: 'playbooks', label: 'Response Playbooks', icon: Layers, badge: 'DEFCON' }
      ]
    },
    {
      groupLabel: 'TOOLS & RESOURCES',
      items: [
        { id: 'tools', label: 'Security Tools', icon: Wrench, badge: tools.length },
        { id: 'projects', label: 'Cyber Projects', icon: FolderLock, badge: projects.length },
        { id: 'labs', label: 'Security Labs & CTF', icon: Award, badge: labs.length }
      ]
    },
    {
      groupLabel: 'REPORTS & GOVERNANCE',
      items: [
        { id: 'reports', label: 'Audit Reports', icon: FileText, badge: reports.length },
        { id: 'admin', label: 'SOC Data Manager', icon: Sliders, badge: 'ADMIN' }
      ]
    },
    {
      groupLabel: 'INTERACTIVE DEMO',
      items: [
        { id: 'demo', label: 'Guided Demo Mode', icon: Sparkles, badge: 'SCENARIO' }
      ]
    }
  ];

  // Helper to find breadcrumb titles
  const findActiveGroupAndItem = () => {
    for (const grp of navGroups) {
      for (const item of grp.items) {
        if (item.id === activeTab) {
          return { group: grp.groupLabel, itemLabel: item.label };
        }
      }
    }
    return { group: 'COMMAND CENTER', itemLabel: 'SOC Overview' };
  };

  const breadcrumbInfo = findActiveGroupAndItem();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Toast Notification Mount */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />

      {/* Universal Command Palette Modal (⌘K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onExecuteCommand={handleExecuteRoutine}
        threats={threats}
        incidents={incidents}
        vulnerabilities={vulnerabilities}
        assets={assets}
        onSelectAsset={(ast) => setSelectedAsset(ast)}
      />

      {/* Action Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationConfig.isOpen}
        onClose={() => setConfirmationConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationConfig.onConfirm}
        title={confirmationConfig.title}
        target={confirmationConfig.target}
        riskLevel={confirmationConfig.riskLevel}
        expectedImpact={confirmationConfig.expectedImpact}
        reason={confirmationConfig.reason}
      />

      {/* Asset Detail Slide-over Drawer */}
      <AssetDetailDrawer
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onIsolateHost={(hostName) => triggerHostIsolationModal(hostName)}
        onScanAsset={(hostName) => showToast('Deep Scan Initiated', `Vulnerability scanner running on ${hostName}`, 'info')}
      />

      {/* Tool Detail Slide-over Drawer */}
      <ToolDetailDrawer
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
      />

      {/* 60-Second Guided Tour Modal */}
      <GuidedTourModal
        isOpen={isGuidedTourOpen}
        onClose={() => setIsGuidedTourOpen(false)}
        onStartInteractiveDemo={() => setActiveTab('demo')}
      />

      {/* Official Classification & Integration System Audit Modal */}
      <SystemAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Advanced SOC Notification Center Drawer */}
      <CyberNotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
        onTogglePin={handleTogglePinNotification}
        onNavigateToTab={(tab, targetId) => {
          setActiveTab(tab);
          if (targetId) {
            showToast('Navigated from Notification', `Focused record ID: ${targetId}`, 'info');
          }
        }}
        preferences={notificationPreferences}
        onUpdatePreferences={handleUpdateNotificationPreferences}
        onTriggerSimulatedAlert={handleTriggerSimulatedAlert}
      />

      {/* Top Header Navigation Bar */}
      <header className="h-16 bg-[#0d1322]/95 border-b border-emerald-500/20 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md font-sans">
        
        {/* Left: Mobile Menu Trigger + Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
            title="Toggle Sidebar Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/30 transition-all cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-emerald-400" /> : <PanelLeftClose className="w-4 h-4 text-slate-400" />}
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
                
                {/* System Health & Feature Classification Audit Matrix Button */}
                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    setIsAuditModalOpen(true);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all cursor-pointer"
                  title="Inspect Real vs Demo System Feature Classification Matrix"
                >
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>AUDIT MATRIX</span>
                </button>

                {/* Environment Indicator (LIVE / DEMO) */}
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playCyberBlip();
                    const nextEnv = environmentMode === 'LIVE' ? 'DEMO' : 'LIVE';
                    setEnvironmentMode(nextEnv);
                    if (nextEnv === 'DEMO') {
                      setActiveTab('demo');
                      showToast('Environment Mode: DEMO', 'Simulated attack scenario environment active.', 'warning');
                    } else {
                      setActiveTab('overview');
                      showToast('Environment Mode: LIVE', 'Connected to production SIEM & firewall telemetry stream.', 'success');
                    }
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black border flex items-center gap-1 transition-all cursor-pointer ${
                    environmentMode === 'LIVE'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                      : 'bg-purple-950 text-purple-300 border-purple-500/40 hover:bg-purple-900/60'
                  }`}
                  title="Click to toggle Environment Mode (LIVE / DEMO)"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${environmentMode === 'LIVE' ? 'bg-emerald-400 animate-ping' : 'bg-purple-400'}`} />
                  <span>ENV: {environmentMode}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                Karan Pandre Enterprise Security Operations Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search & Quick Actions */}
        <div className="hidden xl:flex items-center gap-3 font-mono text-xs">
          
          {/* Universal Search Palette Trigger */}
          <button
            onClick={() => {
              soundFx.playCyberBlip();
              setIsCommandPaletteOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-300 flex items-center gap-2 transition-all w-60 justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Search SOC (⌘K)...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[9px] bg-slate-800 text-slate-400 rounded">⌘K</kbd>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-[11px]">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-500 font-sans">Role:</span>
            <select
              value={persona}
              onChange={e => {
                const newP = e.target.value as PersonaRole;
                setPersona(newP);
                showToast('Persona Mode Switched', `Dashboard priority view updated for ${newP}`, 'info');
              }}
              className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="Analyst" className="bg-slate-900 text-slate-200">Analyst (Technical)</option>
              <option value="CISO" className="bg-slate-900 text-slate-200">CISO (Executive KPIs)</option>
              <option value="Engineer" className="bg-slate-900 text-slate-200">Engineer (Network & Tools)</option>
              <option value="Auditor" className="bg-slate-900 text-slate-200">Auditor (Compliance Logs)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
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
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md text-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Auto PDF Report</span>
          </button>
        </div>

        {/* Right: Tour / Notification Center / User Profile & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 font-sans">
          
          {/* Advanced Notification Center Bell Trigger */}
          <button
            onClick={() => {
              soundFx.playCyberBlip();
              setIsNotificationCenterOpen(true);
            }}
            className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
              isNotificationCenterOpen
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : notifications.filter(n => !n.read).length > 0
                ? 'bg-slate-900 border-emerald-500/40 text-slate-200 hover:border-emerald-400 hover:text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={`Notification Center (${notifications.filter(n => !n.read).length} unread alerts)`}
          >
            <Bell className={`w-4 h-4 ${notifications.filter(n => !n.read).length > 0 ? 'text-emerald-400' : ''}`} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-mono font-black text-white flex items-center justify-center shadow-lg ring-2 ring-[#0d1322] ${
                notifications.some(n => !n.read && n.severity === 'CRITICAL')
                  ? 'bg-rose-500 shadow-rose-950/80 animate-pulse'
                  : 'bg-emerald-500 shadow-emerald-950/80'
              }`}>
                {notifications.filter(n => !n.read).length > 9 ? '9+' : notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              soundFx.playCyberBlip();
              setIsGuidedTourOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-mono text-xs flex items-center gap-1.5 transition-all font-bold cursor-pointer"
            title="Start product tour"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tour Guide</span>
          </button>

          <button
            onClick={onReturnToPortfolio}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Portfolio Main</span>
          </button>

          {/* User Initial Avatar Badge */}
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
            KP
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-all cursor-pointer"
            title="Lock Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Body Grid with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Grouped Sidebar Navigation */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 ${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#0a0f1d] border-r border-slate-800/80 p-3 flex flex-col justify-between transition-all duration-300 lg:translate-x-0
          ${isMobileSidebarOpen ? 'translate-x-0 top-16' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)] pr-1 font-mono text-xs">
            {navGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5">
                    {grp.groupLabel}
                  </div>
                )}
                {grp.items.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      title={isSidebarCollapsed ? `${item.label}` : undefined}
                      onClick={() => {
                        soundFx.playCyberBlip();
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full ${isSidebarCollapsed ? 'px-2 justify-center' : 'px-3 justify-between'} py-2 rounded-xl flex items-center transition-all group ${
                        isActive 
                          ? 'bg-[#059669] text-white font-bold shadow-lg shadow-emerald-950/40' 
                          : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                        }`} />
                        {!isSidebarCollapsed && <span className={isActive ? 'text-white font-bold' : ''}>{item.label}</span>}
                      </div>

                      {!isSidebarCollapsed && item.badge !== null && item.badge !== 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                          item.badge === 'AI' ? 'bg-purple-900/80 text-purple-200 border border-purple-500/40' :
                          item.badge === 'LIVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                          item.badge === 'WORLD' || item.badge === 'SPL' ? 'bg-blue-950 text-blue-300 border border-blue-500/40' :
                          item.badge === 'DEFCON' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                          typeof item.badge === 'number' ? 'bg-rose-600 text-white min-w-[18px] text-center' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer Security System Info */}
          <div className={`p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 font-mono text-[10px] ${isSidebarCollapsed ? 'text-center' : ''}`}>
            <div className={`text-slate-400 font-bold flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-1.5'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {!isSidebarCollapsed && <span>Session Authenticated</span>}
            </div>
            {!isSidebarCollapsed && (
              <>
                <div className="text-slate-500 truncate">Analyst: {currentUser.name || 'Karan Pandre'}</div>
                <button
                  onClick={handleDownloadPdf}
                  className="w-full mt-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/30 flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export PDF Report</span>
                </button>
              </>
            )}
          </div>

        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] space-y-4">
          
          {/* Breadcrumbs Navigation Bar */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/80 w-fit">
            <span className="text-slate-500">SOC Command Center</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400">{breadcrumbInfo.group}</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-bold">{breadcrumbInfo.itemLabel}</span>
          </div>

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
                    assets={assets}
                    tools={tools}
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

              {activeTab === 'playbooks' && (
                <CyberPlaybooksTab 
                  onExecuteCommand={handleExecuteRoutine}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'hunting' && (
                <CyberHuntingTab 
                  threats={threats}
                  onExecuteCommand={handleExecuteRoutine}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'assets' && (
                <CyberAssetsTab 
                  assets={assets}
                  onSelectAsset={(ast) => setSelectedAsset(ast)}
                  onIsolateHost={(h) => triggerHostIsolationModal(h)}
                  onScanAsset={(h) => showToast('Vulnerability Scan Dispatched', `Deep scan running on asset ${h}`, 'info')}
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

              {activeTab === 'detection-rules' && (
                <AutomatedDetectionRulesPanel
                  onPromoteThreatsToState={(newThreats) => setThreats(prev => [...newThreats, ...prev])}
                  onPromoteIncidentsToState={(newIncidents) => setIncidents(prev => [...newIncidents, ...prev])}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'vulnerabilities' && (
                <CyberVulnerabilitiesTab 
                  vulnerabilities={vulnerabilities}
                  onUpdateRemediationStatus={handleUpdateRemediationStatus}
                />
              )}

              {activeTab === 'tools' && (
                <CyberToolsTab 
                  tools={tools} 
                  onTriggerToolAction={handleExecuteRoutine}
                  onShowToast={showToast}
                  onSelectTool={(t) => setSelectedTool(t)}
                  onPromoteThreatsToState={(newThreats) => setThreats(prev => [...newThreats, ...prev])}
                  onPromoteIncidentsToState={(newIncidents) => setIncidents(prev => [...newIncidents, ...prev])}
                />
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

              {activeTab === 'demo' && (
                <CyberDemoMode
                  onExitDemo={() => setActiveTab('overview')}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                  onShowToast={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

    </div>
  );
};
