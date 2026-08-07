import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, FileText, Download, 
  ArrowRight, Award, UserCheck, Briefcase, Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/soundEffects';

interface ATSResumeOptimizerProps {
  darkMode: boolean;
  onOpenResume: () => void;
}

export const ATSResumeOptimizer: React.FC<ATSResumeOptimizerProps> = ({
  darkMode,
  onOpenResume,
}) => {
  const roles = [
    {
      id: 'cybersecurity',
      role: 'Cyber Security & SOC Analyst',
      badge: 'Cisco & Google Certified',
      matchScore: '98%',
      summary: 'Karan holds active certifications in Google Cybersecurity and Cisco Packet Tracer network defense. Proven hands-on capability in SIEM log analysis, Wireshark packet inspection, and MITRE ATT&CK incident triage.',
      tokens: ['Splunk / SIEM', 'Wireshark Packet Inspection', 'Cisco Router ACLs', 'MITRE ATT&CK', 'Linux Security Hardening', 'NIST Framework', 'Phishing & SQLi Mitigation'],
      highlights: [
        'Google Cybersecurity Professional Certificate (SIEM, Python & Intrusion Detection).',
        'Hands-on network topology building & VLAN security in Cisco Packet Tracer.',
        'B.Tech IT graduate with strong systems architecture and CLI security foundation.'
      ]
    },
    {
      id: 'data-analytics',
      role: 'Data Analyst & BI Specialist',
      badge: 'Google Data Science & Infosys Certified',
      matchScore: '96%',
      summary: "Karan brings direct, hands-on campaign performance & ROI analytics experience from Physics Wallah, facilitating 12,650+ enrolments across multi-touch marketing funnels.",
      tokens: ['Power BI & DAX', 'Advanced SQL (Joins/Window Functions)', 'Python Pandas & NumPy', 'Excel Power Query', 'Multi-Channel Marketing ROI', 'ETL Data Pipelines'],
      highlights: [
        'Analyzed ₹2.5L+ digital ad budgets to boost campaign ROI yield by +429% at Physics Wallah.',
        'Built dynamic Power BI dashboards with complex DAX measures and drill-through slicers.',
        'Infosys Springboard certified in BI Architecture & SQL Window Functions.'
      ]
    },
    {
      id: 'tech-pm',
      role: 'Technical Project Manager & Delivery Lead',
      badge: 'IBM Agile Certified',
      matchScore: '94%',
      summary: 'Proven track record of cross-functional team coordination across academic, counseling, and sales operations at Physics Wallah, reducing lead response bottlenecks by 35%.',
      tokens: ['Agile / Scrum Sprint Delivery', 'Jira / Trello', 'Process Bottleneck Optimization', 'Stakeholder Management', 'Risk Assessment', 'Executive KPI Reporting'],
      highlights: [
        'IBM Certified in Agile Software Development & Sprint Ceremonies.',
        'Led cross-functional teams to streamline operational workflows and counselor handoffs.',
        'Strong communication skills with clear executive reporting metrics.'
      ]
    }
  ];

  const [selectedRole, setSelectedRole] = useState<string>('cybersecurity');

  const currentRole = roles.find(r => r.id === selectedRole) || roles[0];

  return (
    <section 
      id="ats-screener" 
      aria-labelledby="ats-screener-heading"
      className={`py-20 transition-colors relative overflow-hidden ${
        darkMode ? 'bg-[#0a0f1d] text-slate-100' : 'bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            Recruiter Screener & Role Alignment
          </div>
          <h2 id="ats-screener-heading" className="text-3xl sm:text-4xl font-black tracking-tight">
            Target Role Qualification & Competency Fit
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Review Karan's verified competencies, certifications, and technical qualification match across target enterprise roles.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedRole(r.id);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                selectedRole === r.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-600/40'
                  : darkMode 
                    ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {r.role}
            </button>
          ))}
        </div>

        {/* Selected Role Qualification Matrix */}
        <div className={`p-7 sm:p-9 rounded-2xl specular-shine ${
          darkMode ? 'glass-panel-dark' : 'glass-panel-light shadow-2xl'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Role Executive Fit */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold font-mono text-blue-500 uppercase tracking-wider block mb-1">
                    {currentRole.badge}
                  </span>
                  <h3 className="text-2xl font-black">{currentRole.role}</h3>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{currentRole.matchScore} Competency Match</span>
                </div>
              </div>

              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {currentRole.summary}
              </p>

              {/* Matched Keywords Tokens */}
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2.5">
                  Verified Technical Keyword Alignment
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentRole.tokens.map((token, idx) => (
                    <span 
                      key={idx}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                        darkMode ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{token}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Candidate Strengths */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-1">
                  Candidate Strengths & Differentiation
                </span>
                <div className="space-y-2">
                  {currentRole.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Actions & Quick Download */}
            <div className="lg:col-span-5 space-y-6">
              <div className={`p-6 rounded-2xl border ${
                darkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Official Formatted Resume</h4>
                    <span className="text-xs text-slate-400">ATS Optimized Single Page PDF</span>
                  </div>
                </div>

                <p className={`text-xs mb-5 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Download or inspect Karan's formatted ATS resume containing detailed academic credentials, Physics Wallah experience, and verified certifications.
                </p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      soundFx.playModalOpen();
                      onOpenResume();
                    }}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View & Download ATS Resume PDF</span>
                  </button>

                  <a
                    href="#contact"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Contact Karan Pandre</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
