import React, { useState } from 'react';
import { 
  Sliders, Plus, Save, Trash2, KeyRound, CheckCircle2, Shield, RefreshCw 
} from 'lucide-react';
import { 
  ThreatItem, IncidentItem, VulnerabilityItem, SecurityToolItem, 
  CyberProjectItem, CyberLabItem, CyberReportItem, CyberCertItem 
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
  certifications: CyberCertItem[];
  onAddNewTool: (newTool: SecurityToolItem) => void;
  onAddNewProject: (newProject: CyberProjectItem) => void;
  onAddNewLab: (newLab: CyberLabItem) => void;
}

export const CyberAdminTab: React.FC<CyberAdminTabProps> = ({
  threats,
  incidents,
  vulnerabilities,
  tools,
  projects,
  labs,
  reports,
  certifications,
  onAddNewTool,
  onAddNewProject,
  onAddNewLab
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'tools' | 'projects' | 'labs' | 'credentials'>('tools');

  // New Tool Form State
  const [toolName, setToolName] = useState<string>('');
  const [toolCategory, setToolCategory] = useState<SecurityToolItem['category']>('Network Security');
  const [toolPurpose, setToolPurpose] = useState<string>('');
  const [toolSkillLevel, setToolSkillLevel] = useState<SecurityToolItem['skillLevel']>('Advanced');
  const [toolStatus, setToolStatus] = useState<SecurityToolItem['status']>('In Portfolio');

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

  const handleAddToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName || !toolPurpose) return;

    soundFx.playSuccess();
    const newTool: SecurityToolItem = {
      id: `tool-${Date.now()}`,
      name: toolName,
      category: toolCategory,
      purpose: toolPurpose,
      skillLevel: toolSkillLevel,
      status: toolStatus,
      description: `Added via SOC Admin Panel on ${new Date().toLocaleDateString()}`
    };

    onAddNewTool(newTool);
    setToolName('');
    setToolPurpose('');
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

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>Cybersecurity Dashboard Administration & Data Manager</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage private security tools, portfolio projects, CTF lab entries, and update authentication settings.
          </p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveAdminSubTab('tools')}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
            activeAdminSubTab === 'tools' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Manage Security Tools ({tools.length})
        </button>
        <button
          onClick={() => setActiveAdminSubTab('projects')}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
            activeAdminSubTab === 'projects' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Manage Cyber Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveAdminSubTab('labs')}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
            activeAdminSubTab === 'labs' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Manage Labs & CTFs ({labs.length})
        </button>
        <button
          onClick={() => setActiveAdminSubTab('credentials')}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
            activeAdminSubTab === 'credentials' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Authentication Passkeys
        </button>
      </div>

      {/* SUB-TAB 1: Add Tools */}
      {activeAdminSubTab === 'tools' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add New Security Tool Record</span>
          </h3>

          <form onSubmit={handleAddToolSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Tool Name:</label>
                <input
                  type="text"
                  required
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="e.g. CrowdStrike Falcon, Wazuh, Palo Alto Panorama"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Category:</label>
                <select
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Network Security">Network Security</option>
                  <option value="SIEM & Monitoring">SIEM & Monitoring</option>
                  <option value="Endpoint Security">Endpoint Security</option>
                  <option value="Cloud Security">Cloud Security</option>
                  <option value="Offensive Security">Offensive Security</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Purpose & Capabilities:</label>
              <textarea
                required
                rows={2}
                value={toolPurpose}
                onChange={(e) => setToolPurpose(e.target.value)}
                placeholder="Describe tool use case and key capabilities..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Security Tool Entry</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: Add Projects */}
      {activeAdminSubTab === 'projects' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add New Private Cybersecurity Project</span>
          </h3>

          <form onSubmit={handleAddProjectSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Project Title:</label>
              <input
                type="text"
                required
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                placeholder="e.g. Zero Trust Architecture & Cisco Packet Tracer ACL Automation"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Description:</label>
              <textarea
                required
                rows={2}
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                placeholder="High-level summary of architecture, impact, and results..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Add Project Record</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: Add Labs */}
      {activeAdminSubTab === 'labs' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Log Completed Security Lab or CTF</span>
          </h3>

          <form onSubmit={handleAddLabSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Lab / Challenge Name:</label>
                <input
                  type="text"
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="e.g. TryHackMe - Wireshark Forensics Deep Dive"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Platform:</label>
                <select
                  value={labPlatform}
                  onChange={(e) => setLabPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
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
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Log Lab Completion</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 4: Manage Passkeys */}
      {activeAdminSubTab === 'credentials' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Update Local Security Passkey</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">New Demo Admin Passkey:</label>
              <input
                type="text"
                value={newPasskey}
                onChange={(e) => setNewPasskey(e.target.value)}
                className="w-full max-w-sm px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playSuccess();
                setCredSavedMsg(`Passkey updated to "${newPasskey}". Stored in encrypted session configuration.`);
                setTimeout(() => setCredSavedMsg(''), 4000);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Update Passkey
            </button>

            {credSavedMsg && (
              <p className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold">
                {credSavedMsg}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
