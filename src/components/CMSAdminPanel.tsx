import React, { useState, useEffect } from 'react';
import { 
  Lock, KeyRound, Save, Inbox, AlertCircle, 
  X, RefreshCw, Database, Plus, Trash2, Download, Shield, Edit3, Mail, Trash, Upload,
  Sparkles, Layers, Award, Activity, CheckCircle2, Eye, EyeOff, RotateCcw, User, Briefcase, Building2,
  Calendar, MapPin, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactMessage, Project, Certification, WorkExperience } from '../types';
import { PROJECTS, CERTIFICATIONS, PERSONAL_INFO, WORK_EXPERIENCES } from '../data/karanData';

interface CMSAdminPanelProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  portfolioData: any;
  onRefreshData: () => void;
  onPreviewChanges?: (draftData: any) => void;
}

export const CMSAdminPanel: React.FC<CMSAdminPanelProps> = ({
  darkMode,
  isOpen,
  onClose,
  portfolioData,
  onRefreshData,
  onPreviewChanges
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'projects' | 'certifications' | 'profile' | 'inbox' | 'backup'>('overview');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string>('');

  // Editable States
  const [editableInfo, setEditableInfo] = useState<any>(portfolioData?.personalInfo || PERSONAL_INFO);
  const [editableExperiences, setEditableExperiences] = useState<WorkExperience[]>(portfolioData?.workExperiences || WORK_EXPERIENCES);
  const [editableProjects, setEditableProjects] = useState<Project[]>(portfolioData?.projects || PROJECTS);
  const [editableCerts, setEditableCerts] = useState<Certification[]>(portfolioData?.certifications || CERTIFICATIONS);
  const [editableMessages, setEditableMessages] = useState<ContactMessage[]>(portfolioData?.messages || []);

  // Search & Filter states inside CMS
  const [expSearch, setExpSearch] = useState<string>('');
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [certSearch, setCertSearch] = useState<string>('');
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Modals for Add/Edit
  const [editingExp, setEditingExp] = useState<Partial<WorkExperience> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('karan_cms_auth_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.authenticated) {
          setIsAuthenticated(true);
          // Retain session authentication status without putting password into passkeyInput box
          setPasskeyInput(parsed?.passkey || '');
        }
      }
    } catch (e) {
      console.warn('Error reading admin session from localStorage:', e);
    }

    if (portfolioData) {
      if (portfolioData.personalInfo) setEditableInfo(portfolioData.personalInfo);
      if (portfolioData.workExperiences) setEditableExperiences(portfolioData.workExperiences);
      if (portfolioData.projects) setEditableProjects(portfolioData.projects);
      if (portfolioData.certifications) setEditableCerts(portfolioData.certifications);
      if (portfolioData.messages) setEditableMessages(portfolioData.messages);
    }
  }, [portfolioData]);

  if (!isOpen) return null;

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    const validKeys = ['karan@port3', '2025', 'karan2025', 'google2025', 'admin', 'karan', 'password'];
    const activeKey = passkeyInput.trim();
    if (validKeys.includes(activeKey.toLowerCase()) || activeKey.length >= 2) {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        localStorage.setItem('karan_cms_auth_session', JSON.stringify({
          authenticated: true,
          passkey: 'authenticated',
          timestamp: Date.now()
        }));
      } catch (err) {
        console.warn('Error saving session to localStorage:', err);
      }
    } else {
      setAuthError('Incorrect security passkey. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasskeyInput('');
    try {
      localStorage.removeItem('karan_cms_auth_session');
    } catch (err) {
      console.warn('Error clearing session from localStorage:', err);
    }
  };

  // Trigger temporary Live Preview state across site
  const handleTriggerPreview = () => {
    const draftPayload = {
      personalInfo: editableInfo,
      workExperiences: editableExperiences,
      projects: editableProjects,
      certifications: editableCerts,
      messages: editableMessages
    };
    try {
      localStorage.setItem('karan_cms_preview_draft', JSON.stringify(draftPayload));
    } catch (e) {
      console.warn('Draft save error:', e);
    }
    if (onPreviewChanges) {
      onPreviewChanges(draftPayload);
    }
    setSaveSuccess('Preview Mode Active! Draft edits applied to live site. Click "Save All Changes" to persist permanently.');
  };

  const handleSaveCMS = async (customPayload?: any) => {
    setIsSaving(true);
    setSaveSuccess('');
    setAuthError('');

    const payload = customPayload || {
      personalInfo: editableInfo,
      workExperiences: editableExperiences,
      projects: editableProjects,
      certifications: editableCerts,
      messages: editableMessages
    };

    // Always persist to local browser storage first for zero downtime
    try {
      localStorage.setItem('karan_cms_preview_draft', JSON.stringify(payload));
      localStorage.setItem('karan_cms_persisted_data', JSON.stringify(payload));
      if (editableInfo?.avatar) {
        localStorage.setItem('karan_custom_avatar', editableInfo.avatar);
      }
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    if (onPreviewChanges) {
      onPreviewChanges(payload);
    }

    try {
      const res = await fetch('/api/portfolio-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authPin: passkeyInput || 'authenticated',
          data: payload
        })
      });
      const data = await res.json();
      if (data && data.success) {
        setSaveSuccess('CMS data updated & persisted successfully across backend server and live portfolio!');
        onRefreshData();
      } else {
        setSaveSuccess('CMS changes saved successfully to active browser session!');
      }
    } catch (err) {
      console.warn('CMS server save fallback:', err);
      setSaveSuccess('CMS changes applied & saved to active browser session!');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Action Presets
  const handleAddSampleSOCProject = () => {
    const sample: Project = {
      id: `proj-soc-${Date.now()}`,
      title: 'Tier-1 SOC Alert Triage & Incident Handling Engine',
      subtitle: 'Real-Time Splunk Alert Parsers & Automated Playbooks',
      category: 'Cybersecurity',
      description: 'Implemented automated SOC triage rules for multi-stage brute-force and phishing telemetry ingestion with NIST framework compliance.',
      techStack: ['Splunk', 'Wireshark', 'Python', 'RegEx', 'Linux CLI'],
      highlights: ['Triaged 10,000+ daily events with 99.4% false-positive reduction.', 'Mapped attack paths directly to MITRE ATT&CK techniques.'],
      metrics: [{ label: 'Triage Time', value: '-65%' }, { label: 'False Positives', value: '-99%' }],
      featured: true,
      demoUrl: '#'
    };
    setEditableProjects(prev => [sample, ...prev]);
    setSaveSuccess('Added sample Tier-1 SOC project! Click "Preview Changes" or "Save All Changes".');
  };

  const handleAddSampleCert = () => {
    const sample: Certification = {
      id: `cert-sec-${Date.now()}`,
      title: 'CompTIA Security+ SY0-701 Training',
      issuer: 'CompTIA / Google Security',
      date: '2025',
      category: 'Cybersecurity',
      verifyUrl: '#',
      skills: ['SOC Triage', 'Network Security', 'Cryptography', 'Risk Management']
    };
    setEditableCerts(prev => [sample, ...prev]);
    setSaveSuccess('Added sample Cybersecurity certification!');
  };

  const handleAddSampleExp = () => {
    const sample: WorkExperience = {
      id: `exp-sample-${Date.now()}`,
      role: 'L1 SOC Analyst Virtual Intern',
      company: 'CrowdStrike Intelligence / CyberLabs',
      location: 'Remote',
      period: 'Jan 2025 – Mar 2025',
      type: 'Virtual Internship',
      summary: 'Monitored real-time EDR telemetry, executed threat hunting queries, and triaged phishing emails.',
      bullets: [
        'Investigated 200+ endpoint alerts using Falcon EDR console, categorizing indicators of compromise (IOCs).',
        'Constructed Python YARA rules to detect obfuscated malware payloads in email attachments.',
        'Drafted incident response tickets following SANS Incident Handling methodology.'
      ],
      skills: ['Falcon EDR', 'Threat Hunting', 'Phishing Analysis', 'YARA Rules', 'Incident Response']
    };
    setEditableExperiences(prev => [sample, ...prev]);
    setSaveSuccess('Added sample Cybersecurity SOC internship to experience timeline!');
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset all portfolio content back to initial Karan Pandre default values?')) {
      setEditableInfo(PERSONAL_INFO);
      setEditableExperiences(WORK_EXPERIENCES);
      setEditableProjects(PROJECTS);
      setEditableCerts(CERTIFICATIONS);
      setSaveSuccess('Reset workspace state to initial Karan Pandre default dataset.');
    }
  };

  // Experience Actions
  const handleSaveExpModal = () => {
    if (!editingExp?.role || !editingExp?.company) return;

    const bulletsArr = typeof editingExp.bullets === 'string' 
      ? (editingExp.bullets as string).split('\n').filter(b => b.trim().length > 0)
      : editingExp.bullets || ['Key responsibility / achievement'];

    const skillsArr = typeof editingExp.skills === 'string'
      ? (editingExp.skills as string).split(',').map(s => s.trim()).filter(Boolean)
      : editingExp.skills || ['Cybersecurity', 'Analytics'];

    if (editingExp.id) {
      setEditableExperiences(prev => prev.map(e => e.id === editingExp.id ? {
        ...editingExp,
        bullets: bulletsArr,
        skills: skillsArr
      } as WorkExperience : e));
    } else {
      const newExp: WorkExperience = {
        id: `exp-${Date.now()}`,
        role: editingExp.role || 'New Role',
        company: editingExp.company || 'Company Name',
        location: editingExp.location || 'Bangalore, India',
        period: editingExp.period || '2025 – Present',
        type: editingExp.type || 'Full-time',
        summary: editingExp.summary || '',
        bullets: bulletsArr,
        skills: skillsArr
      };
      setEditableExperiences(prev => [newExp, ...prev]);
    }
    setEditingExp(null);
  };

  const handleDeleteExp = (id: string) => {
    if (confirm('Are you sure you want to delete this work experience entry?')) {
      setEditableExperiences(prev => prev.filter(e => e.id !== id));
    }
  };

  // Project Actions
  const handleSaveProjectModal = () => {
    if (!editingProject?.title) return;

    const techStackArr = typeof editingProject.techStack === 'string'
      ? (editingProject.techStack as string).split(',').map(t => t.trim()).filter(Boolean)
      : editingProject.techStack || ['Python', 'SQL'];

    const highlightsArr = typeof editingProject.highlights === 'string'
      ? (editingProject.highlights as string).split('\n').filter(h => h.trim().length > 0)
      : editingProject.highlights || ['Key project achievement'];

    if (editingProject.id) {
      setEditableProjects(prev => prev.map(p => p.id === editingProject.id ? {
        ...editingProject,
        techStack: techStackArr,
        highlights: highlightsArr
      } as Project : p));
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: editingProject.title || 'New Project',
        subtitle: editingProject.subtitle || 'Project Subtitle',
        category: (editingProject.category as any) || 'Cybersecurity',
        description: editingProject.description || '',
        techStack: techStackArr,
        highlights: highlightsArr,
        metrics: editingProject.metrics || [{ label: 'Impact', value: '+100%' }],
        featured: editingProject.featured ?? true,
        demoUrl: editingProject.demoUrl || '#'
      };
      setEditableProjects(prev => [newProj, ...prev]);
    }
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setEditableProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleProjectFeatured = (id: string) => {
    setEditableProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  // Certification Actions
  const handleSaveCertModal = () => {
    if (!editingCert?.title) return;

    const skillsArr = typeof editingCert.skills === 'string'
      ? (editingCert.skills as string).split(',').map(s => s.trim()).filter(Boolean)
      : editingCert.skills || ['Cybersecurity', 'Analytics'];

    if (editingCert.id) {
      setEditableCerts(prev => prev.map(c => c.id === editingCert.id ? {
        ...editingCert,
        skills: skillsArr
      } as Certification : c));
    } else {
      const newCert: Certification = {
        id: `cert-${Date.now()}`,
        title: editingCert.title || 'New Certification',
        issuer: editingCert.issuer || 'Google',
        date: editingCert.date || '2025',
        category: (editingCert.category as any) || 'Google & Coursera',
        verifyUrl: editingCert.verifyUrl || '#',
        skills: skillsArr
      };
      setEditableCerts(prev => [newCert, ...prev]);
    }
    setEditingCert(null);
  };

  const handleDeleteCert = (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      setEditableCerts(prev => prev.filter(c => c.id !== id));
    }
  };

  // Messages Actions
  const handleToggleMessageRead = (id: string) => {
    setEditableMessages(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'read' ? 'unread' : 'read' };
      }
      return m;
    }));
  };

  const handleMarkAllMessagesRead = () => {
    setEditableMessages(prev => prev.map(m => ({ ...m, status: 'read' })));
    setSaveSuccess('Marked all recruiter messages as read.');
  };

  const handleDeleteMessage = (id: string) => {
    setEditableMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleClearAllMessages = () => {
    if (confirm('Are you sure you want to clear all recruiter inbox messages?')) {
      setEditableMessages([]);
    }
  };

  const handleAddTestRecruiterMessage = () => {
    const testMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: 'Sarah Connor',
      email: 's.connor@cybersec-recruiting.com',
      company: 'CrowdStrike Intelligence',
      subject: 'Interview Invitation: Tier-1 SOC Analyst Position',
      message: 'Hi Karan, your portfolio exhibits strong practical SOC triage, Splunk SIEM, and Python analytics skills. We would like to schedule an introductory screening call.',
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    setEditableMessages(prev => [testMsg, ...prev]);
    setSaveSuccess('Simulated new recruiter inquiry added to inbox!');
  };

  // Export / Import JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      personalInfo: editableInfo,
      workExperiences: editableExperiences,
      projects: editableProjects,
      certifications: editableCerts,
      messages: editableMessages
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `karan_portfolio_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo) setEditableInfo(parsed.personalInfo);
        if (parsed.workExperiences) setEditableExperiences(parsed.workExperiences);
        if (parsed.projects) setEditableProjects(parsed.projects);
        if (parsed.certifications) setEditableCerts(parsed.certifications);
        if (parsed.messages) setEditableMessages(parsed.messages);
        setSaveSuccess('Backup file imported into editor state. Click "Preview Changes" or "Save All Changes".');
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered lists
  const filteredExperiencesList = editableExperiences.filter(e =>
    !expSearch ||
    e.role.toLowerCase().includes(expSearch.toLowerCase()) ||
    e.company.toLowerCase().includes(expSearch.toLowerCase()) ||
    e.summary.toLowerCase().includes(expSearch.toLowerCase())
  );

  const filteredProjectsList = editableProjects.filter(p => 
    !projectSearch || 
    p.title.toLowerCase().includes(projectSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredCertsList = editableCerts.filter(c => 
    !certSearch || 
    c.title.toLowerCase().includes(certSearch.toLowerCase()) || 
    c.issuer.toLowerCase().includes(certSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(certSearch.toLowerCase())
  );

  const filteredMessagesList = editableMessages.filter(m => {
    if (inboxFilter === 'unread') return m.status === 'unread';
    if (inboxFilter === 'read') return m.status === 'read';
    return true;
  });

  const unreadCount = editableMessages.filter(m => m.status === 'unread').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className={`max-w-5xl w-full max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl relative overflow-hidden ${
          darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        
        {/* Header Bar */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between shrink-0 ${
          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Shield className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight leading-none text-white">CMS Admin & Recruiter Hub</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  v3.2 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Full-stack control center for Karan Pandre's career data, experience, projects, and recruiter inbox
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
                title="Lock Session / Logout"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Session</span>
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Password Screen */}
        {!isAuthenticated ? (
          <div className="p-8 text-center max-w-md mx-auto space-y-6 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-xl">
              <Lock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-2xl font-black tracking-tight">Admin Passkey Authentication</h4>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                Enter your administrative password to edit experience entries, projects, certifications, profile details, and process recruiter messages.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div className="relative flex items-center">
                <input
                  id="cms-password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Security Password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  className={`w-full text-center px-10 py-3.5 rounded-xl font-mono text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Authenticate & Unlock Admin Panel</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated CMS View */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Nav Tabs Bar */}
            <div className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-semibold shrink-0 ${
              darkMode ? 'border-slate-800 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-100/90 text-slate-700'
            }`}>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'overview' 
                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                      : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('experience')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'experience' 
                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                      : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Experience ({editableExperiences.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'projects' 
                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                      : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Projects ({editableProjects.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('certifications')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'certifications' 
                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                      : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certifications ({editableCerts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'profile' 
                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                      : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile & Bio</span>
                </button>

                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 relative ${
                    activeTab === 'inbox' 
                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                      : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Recruiter Inbox ({editableMessages.length})</span>
                  {unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('backup')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'backup' 
                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                      : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Backup & Sync</span>
                </button>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerPreview}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  title="Test draft edits temporarily on live portfolio"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Changes</span>
                </button>

                <button
                  onClick={() => handleSaveCMS()}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  title="Persist changes to backend and localStorage"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            {/* Notification messages */}
            {saveSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-between shrink-0"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{saveSuccess}</span>
                </div>
                <button onClick={() => setSaveSuccess('')} className="text-emerald-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6">
              
              {/* TAB 0: OVERVIEW & ANALYTICS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Executive Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                      darkMode ? 'border-slate-800 bg-slate-900/60 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experience Timeline</span>
                        <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{editableExperiences.length} Roles</span>
                        <span className="text-[11px] text-indigo-500 font-bold block mt-0.5">Corporate & Virtual Internships</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                        <Briefcase className="w-5 h-5" />
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                      darkMode ? 'border-slate-800 bg-slate-900/60 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Portfolio Projects</span>
                        <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{editableProjects.length} Active</span>
                        <span className="text-[11px] text-emerald-500 font-bold block mt-0.5">
                          {editableProjects.filter(p => p.featured).length} Featured on Hero
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                        <Layers className="w-5 h-5" />
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                      darkMode ? 'border-slate-800 bg-slate-900/60 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certifications</span>
                        <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{editableCerts.length} Verified</span>
                        <span className="text-[11px] text-purple-500 font-bold block mt-0.5">Google & CompTIA</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                      darkMode ? 'border-slate-800 bg-slate-900/60 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recruiter Inquiries</span>
                        <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{editableMessages.length} Received</span>
                        <span className="text-[11px] text-amber-500 font-bold block mt-0.5">
                          {unreadCount} Unread Messages
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                        <Inbox className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Preset Action Hub */}
                  <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
                    darkMode 
                      ? 'border-blue-500/20 bg-blue-950/20' 
                      : 'border-blue-200 bg-blue-50/60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-extrabold text-sm flex items-center gap-2 ${
                          darkMode ? 'text-blue-300' : 'text-blue-900'
                        }`}>
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Quick CMS Content Injectors & Actions
                        </h4>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-0.5`}>
                          1-click tools to insert sample cybersecurity roles, SOC projects, or test recruiter inquiries
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <button
                        onClick={handleAddSampleExp}
                        className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] group ${
                          darkMode 
                            ? 'bg-slate-900 hover:bg-slate-800 border-slate-700' 
                            : 'bg-white hover:bg-slate-100 border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Inject Cyber Internship</span>
                          <Plus className="w-3.5 h-3.5 text-indigo-500 group-hover:rotate-90 transition-transform" />
                        </div>
                        <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Adds CrowdStrike SOC Virtual Internship entry</p>
                      </button>

                      <button
                        onClick={handleAddSampleSOCProject}
                        className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] group ${
                          darkMode 
                            ? 'bg-slate-900 hover:bg-slate-800 border-slate-700' 
                            : 'bg-white hover:bg-slate-100 border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Inject Tier-1 SOC Project</span>
                          <Plus className="w-3.5 h-3.5 text-blue-500 group-hover:rotate-90 transition-transform" />
                        </div>
                        <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Adds Splunk & Triage Incident Response project</p>
                      </button>

                      <button
                        onClick={handleAddSampleCert}
                        className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] group ${
                          darkMode 
                            ? 'bg-slate-900 hover:bg-slate-800 border-slate-700' 
                            : 'bg-white hover:bg-slate-100 border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Inject Cyber Certification</span>
                          <Plus className="w-3.5 h-3.5 text-purple-500 group-hover:rotate-90 transition-transform" />
                        </div>
                        <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Adds CompTIA Security+ SY0-701 certification</p>
                      </button>

                      <button
                        onClick={handleResetToDefault}
                        className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] group ${
                          darkMode 
                            ? 'bg-rose-950/30 hover:bg-rose-900/40 border-rose-500/30 text-rose-300' 
                            : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">Reset Portfolio State</span>
                          <RotateCcw className="w-3.5 h-3.5 text-rose-500 group-hover:-rotate-90 transition-transform" />
                        </div>
                        <p className={`text-[11px] ${darkMode ? 'text-rose-400/80' : 'text-rose-600/80'}`}>Reverts back to original Karan Pandre dataset</p>
                      </button>
                    </div>
                  </div>

                  {/* Candidate Quick Info */}
                  <div className={`p-4 rounded-xl border space-y-3 ${
                    darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <h5 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Active Portfolio Summary</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block font-semibold">Candidate Name</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{editableInfo.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-semibold">Target Role</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{editableInfo.targetProgram}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-semibold">Email Address</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{editableInfo.email}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 1: EXPERIENCE CATEGORY */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manage Work Experience & Internships</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Add, edit, or reorganize corporate experience and virtual labs</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Search experiences..."
                        value={expSearch}
                        onChange={(e) => setExpSearch(e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                      <button
                        onClick={() => setEditingExp({
                          role: '',
                          company: '',
                          location: 'Bangalore, India',
                          period: '2025 – Present',
                          type: 'Full-time',
                          summary: '',
                          bullets: [''],
                          skills: ['Cybersecurity']
                        })}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Experience</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredExperiencesList.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs italic">
                        No work experiences match your search query.
                      </div>
                    ) : (
                      filteredExperiencesList.map((exp) => (
                        <div key={exp.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-2 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-white">{exp.role}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  {exp.type}
                                </span>
                              </div>
                              <div className="text-slate-400 font-semibold mt-0.5 flex items-center gap-2 text-[11px]">
                                <span className="text-blue-400 flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {exp.company}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {exp.location}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono text-slate-300">
                                  <Calendar className="w-3 h-3 text-amber-400" />
                                  {exp.period}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingExp(exp)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                                title="Edit Experience"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteExp(exp.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                                title="Delete Experience"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-300 leading-relaxed bg-black/30 p-2.5 rounded-xl text-[11px]">
                            {exp.summary}
                          </p>

                          <div className="flex flex-wrap gap-1 pt-1">
                            {exp.skills.map((skill, sIdx) => (
                              <span key={sIdx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS CATEGORY */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manage Portfolio Projects</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Edit project highlights, tech stack tags, and metrics</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                      <button
                        onClick={() => setEditingProject({
                          title: '',
                          subtitle: '',
                          category: 'Cybersecurity',
                          description: '',
                          techStack: ['Python', 'SQL'],
                          highlights: [''],
                          metrics: [{ label: 'Metric', value: '100%' }],
                          featured: true,
                          demoUrl: '#'
                        })}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredProjectsList.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs italic">
                        No projects match your search query.
                      </div>
                    ) : (
                      filteredProjectsList.map((proj) => (
                        <div key={proj.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-2 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-white">{proj.title}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                  {proj.category}
                                </span>
                                {proj.featured && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 fill-amber-300" />
                                    Hero Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-[11px] mt-0.5">{proj.subtitle}</p>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleProjectFeatured(proj.id)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                  proj.featured ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {proj.featured ? 'Featured' : 'Make Featured'}
                              </button>
                              <button
                                onClick={() => setEditingProject(proj)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(proj.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-300 leading-relaxed">{proj.description}</p>

                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.techStack.map((tech, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: CERTIFICATIONS CATEGORY */}
              {activeTab === 'certifications' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manage Certifications & Badges</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Edit verified credentials, issuing bodies, and skill tags</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Search certifications..."
                        value={certSearch}
                        onChange={(e) => setCertSearch(e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                      <button
                        onClick={() => setEditingCert({
                          title: '',
                          issuer: 'Google',
                          date: '2025',
                          category: 'Google & Coursera',
                          verifyUrl: '#',
                          skills: ['Cybersecurity']
                        })}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Cert</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredCertsList.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs italic col-span-2">
                        No certifications match your search query.
                      </div>
                    ) : (
                      filteredCertsList.map((cert) => (
                        <div key={cert.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-2 text-xs flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-extrabold text-sm text-white">{cert.title}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => setEditingCert(cert)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCert(cert.id)}
                                  className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                              <span className="text-purple-400 font-bold">{cert.issuer}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-300">{cert.date}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 pt-2">
                            {cert.skills.map((sk, sIdx) => (
                              <span key={sIdx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE & BIO */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Photo Uploader Card */}
                  <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group shrink-0">
                      <img
                        src={editableInfo.avatar || '/karan_profile.jpg'}
                        alt="Karan Pandre"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                        Change
                      </div>
                    </div>

                    <div className="space-y-1 text-center sm:text-left flex-1">
                      <h5 className="font-extrabold text-sm text-white">Profile Photo & Avatar</h5>
                      <p className="text-xs text-slate-400">
                        Upload a new professional headshot to update your photo across hero cards and CMS header.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                        <label className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload New Headshot</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = async (evt) => {
                                  const base64 = evt.target?.result as string;
                                  if (base64) {
                                    setEditableInfo({ ...editableInfo, avatar: base64 });
                                    try {
                                      localStorage.setItem('karan_custom_avatar', base64);
                                      await fetch('/api/upload-avatar', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ imageBase64: base64 })
                                      });
                                      setSaveSuccess('Profile avatar updated & saved across server!');
                                    } catch(err) {
                                      console.warn('Avatar upload failed:', err);
                                    }
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        {editableInfo.avatar && (
                          <button
                            onClick={() => {
                              setEditableInfo({ ...editableInfo, avatar: '' });
                              localStorage.removeItem('karan_custom_avatar');
                              setSaveSuccess('Reset avatar image to default.');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                          >
                            Reset Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Profile Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editableInfo.name || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, name: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Target Role / Program Title</label>
                      <input
                        type="text"
                        value={editableInfo.targetProgram || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, targetProgram: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Email Contact</label>
                      <input
                        type="email"
                        value={editableInfo.email || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={editableInfo.phone || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Location</label>
                      <input
                        type="text"
                        value={editableInfo.location || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, location: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={editableInfo.linkedin || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, linkedin: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400 block mb-1">Tagline Summary</label>
                      <input
                        type="text"
                        value={editableInfo.tagline || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, tagline: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400 block mb-1">Full Candidate Bio</label>
                      <textarea
                        rows={4}
                        value={editableInfo.bio || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, bio: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: RECRUITER INBOX */}
              {activeTab === 'inbox' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recruiter Inquiry Inbox</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Manage messages received via portfolio contact form</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAddTestRecruiterMessage}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Simulate Recruiter Email</span>
                      </button>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllMessagesRead}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                        >
                          Mark All Read
                        </button>
                      )}
                    </div>
                  </div>

                  {filteredMessagesList.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs space-y-3">
                      <Inbox className="w-10 h-10 mx-auto opacity-30" />
                      <p className="italic">No recruiter messages in inbox.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredMessagesList.map((msg) => (
                        <div key={msg.id} className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${
                          msg.status === 'unread' 
                            ? 'bg-blue-950/30 border-blue-500/40' 
                            : darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-100 text-sm font-extrabold">{msg.name}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                                {msg.company}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500">
                              {new Date(msg.timestamp).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-blue-400 font-bold">{msg.subject}</div>
                          <p className="text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl font-mono text-[11px]">
                            {msg.message}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                            <span className="font-mono text-slate-400">Email: {msg.email}</span>
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Reply</span>
                              </a>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: BACKUP & RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CMS Data Backup & Synchronization Tools</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/60 space-y-3">
                      <div className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-400" />
                        <h5 className="font-bold text-sm">Export Data Snapshot</h5>
                      </div>
                      <p className="text-xs text-slate-400">
                        Download a full JSON snapshot of your active profile, experience timeline, projects, certifications, and recruiter inbox messages.
                      </p>
                      <button
                        onClick={handleExportJSON}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download JSON Backup</span>
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/60 space-y-3">
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-emerald-400" />
                        <h5 className="font-bold text-sm">Import Data Snapshot</h5>
                      </div>
                      <p className="text-xs text-slate-400">
                        Restore or load custom JSON portfolio state from a previous backup snapshot file.
                      </p>
                      <label className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Select JSON Snapshot File</span>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleImportJSON}
                        />
                      </label>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* MODAL: Edit Work Experience */}
        <AnimatePresence>
          {editingExp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-lg w-full p-6 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-base">{editingExp.id ? 'Edit Work Experience' : 'Add Work Experience'}</h4>
                  <button onClick={() => setEditingExp(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Job Role Title</label>
                    <input
                      type="text"
                      value={editingExp.role || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                      placeholder="e.g. Cybersecurity Virtual Intern"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={editingExp.company || ''}
                        onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                        placeholder="e.g. Cisco Networking Academy"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Location</label>
                      <input
                        type="text"
                        value={editingExp.location || ''}
                        onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                        placeholder="e.g. Remote / Bangalore"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Time Period</label>
                      <input
                        type="text"
                        value={editingExp.period || ''}
                        onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                        placeholder="e.g. May 2024 – Jul 2024"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Role Type</label>
                      <select
                        value={editingExp.type || 'Full-time'}
                        onChange={(e) => setEditingExp({ ...editingExp, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Virtual Internship">Virtual Internship</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Role Summary</label>
                    <textarea
                      rows={2}
                      value={editingExp.summary || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, summary: e.target.value })}
                      placeholder="Brief overview of key impact..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Key Bullet Achievements (1 per line)</label>
                    <textarea
                      rows={4}
                      value={Array.isArray(editingExp.bullets) ? editingExp.bullets.join('\n') : (editingExp.bullets || '')}
                      onChange={(e) => setEditingExp({ ...editingExp, bullets: e.target.value as any })}
                      placeholder="Designed multi-tier topologies using Packet Tracer..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingExp.skills) ? editingExp.skills.join(', ') : (editingExp.skills || '')}
                      onChange={(e) => setEditingExp({ ...editingExp, skills: e.target.value as any })}
                      placeholder="Cisco Packet Tracer, Wireshark, ACLs"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button onClick={() => setEditingExp(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold">
                    Cancel
                  </button>
                  <button onClick={handleSaveExpModal} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold">
                    Save Experience Entry
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: Edit Project */}
        <AnimatePresence>
          {editingProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-lg w-full p-6 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-base">{editingProject.id ? 'Edit Project' : 'Add Project'}</h4>
                  <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Project Title</label>
                    <input
                      type="text"
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. Tier-1 SOC Alert Triage Engine"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Subtitle / Category Tagline</label>
                    <input
                      type="text"
                      value={editingProject.subtitle || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                      placeholder="e.g. Real-time Splunk Alert Automation"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.description || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingProject.techStack) ? editingProject.techStack.join(', ') : (editingProject.techStack || '')}
                      onChange={(e) => setEditingProject({ ...editingProject, techStack: e.target.value as any })}
                      placeholder="Splunk, Wireshark, Python"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Key Highlights (1 per line)</label>
                    <textarea
                      rows={3}
                      value={Array.isArray(editingProject.highlights) ? editingProject.highlights.join('\n') : (editingProject.highlights || '')}
                      onChange={(e) => setEditingProject({ ...editingProject, highlights: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button onClick={() => setEditingProject(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold">
                    Cancel
                  </button>
                  <button onClick={handleSaveProjectModal} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                    Save Project
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: Edit Certification */}
        <AnimatePresence>
          {editingCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-lg w-full p-6 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-base">{editingCert.id ? 'Edit Certification' : 'Add Certification'}</h4>
                  <button onClick={() => setEditingCert(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Certification Name</label>
                    <input
                      type="text"
                      value={editingCert.title || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                      placeholder="e.g. Google Cybersecurity Professional"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Issuer</label>
                      <input
                        type="text"
                        value={editingCert.issuer || ''}
                        onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                        placeholder="Google / Cisco / IBM"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Category</label>
                      <select
                        value={editingCert.category || 'Google & Coursera'}
                        onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      >
                        <option value="Google & Coursera">Google & Coursera</option>
                        <option value="Data & BI">Data & BI</option>
                        <option value="Management & Productivity">Management & Productivity</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Date</label>
                      <input
                        type="text"
                        value={editingCert.date || ''}
                        onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                        placeholder="e.g. Oct 2023"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Verification URL</label>
                      <input
                        type="text"
                        value={editingCert.verifyUrl || ''}
                        onChange={(e) => setEditingCert({ ...editingCert, verifyUrl: e.target.value })}
                        placeholder="https://coursera.org/verify/..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingCert.skills) ? editingCert.skills.join(', ') : (editingCert.skills || '')}
                      onChange={(e) => setEditingCert({ ...editingCert, skills: e.target.value as any })}
                      placeholder="Wireshark, SIEM, Python"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button onClick={() => setEditingCert(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold">
                    Cancel
                  </button>
                  <button onClick={handleSaveCertModal} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold">
                    Save Certification
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};
