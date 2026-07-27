import React, { useState } from 'react';
import { 
  BarChart3, Database, Briefcase, TrendingUp, ShieldCheck, Code2, 
  CheckCircle, ArrowUpRight, Cpu, Layers, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SKILL_GROUPS } from '../data/karanData';

interface CoreCompetenciesProps {
  darkMode: boolean;
}

export const CoreCompetencies: React.FC<CoreCompetenciesProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'pm' | 'cybersecurity'>('analytics');

  const tracks = [
    {
      id: 'analytics',
      title: 'Data Analytics Track',
      icon: BarChart3,
      badge: 'Analytics & BI Lead',
      color: 'from-blue-600 to-cyan-600',
      description: 'End-to-end data pipeline management, automated KPI reporting, complex SQL window functions, and interactive Power BI storytelling.',
      highlights: [
        'Advanced Power BI & DAX: Custom measures, slicers, drill-throughs, and dynamic KPI dashboards.',
        'Databases & SQL: Joins, subqueries, group aggregations, window functions (ROW_NUMBER, RANK, LAG/LEAD).',
        'Python Data Wrangling: Pandas, NumPy, automated cleaning scripts, Matplotlib/Seaborn EDA.',
        'Excel Power User: Power Query ETL, PivotTables, VLOOKUP, data validation, executive reporting.'
      ],
      tools: ['Power BI', 'DAX', 'MySQL', 'MS SQL Server', 'Python Pandas', 'Excel Power Query', 'Seaborn']
    },
    {
      id: 'pm',
      title: 'Project Management Track',
      icon: Briefcase,
      badge: 'Google & IBM Certified',
      color: 'from-purple-600 to-indigo-600',
      description: 'Structured campaign planning, cross-functional stakeholder leadership, Agile/Scrum sprint execution, and risk mitigation.',
      highlights: [
        'Cross-Functional Coordination: Collaborating across academic, counselling, and sales teams at Physics Wallah.',
        'Agile & Sprint Delivery: IBM & Infosys certified in Agile software development, sprint backlog, and retrospective ceremonies.',
        'Team Mentorship & Growth: Mentoring team members in communication strategies, lead nurture, and performance management.',
        'Process Optimization: Streamlining workflow bottlenecks to reduce lead response times by 35%.'
      ],
      tools: ['Agile / Scrum', 'Jira / Trello', 'Process Mapping', 'Risk Assessment', 'Stakeholder Management', 'Time Management']
    },
    {
      id: 'cybersecurity',
      title: 'Cyber Security & SOC Analyst Track',
      icon: ShieldCheck,
      badge: 'Cisco & Google Certified (Actively Skill Building)',
      color: 'from-emerald-600 to-teal-600',
      description: 'Active learning and hands-on focus in Security Operations Center (SOC) fundamentals, threat monitoring, SIEM log analysis, network defense, and vulnerability assessment.',
      highlights: [
        'SIEM & Alert Triage: Hands-on log analysis utilizing Splunk/ELK concepts, alert detection, and Google Cybersecurity SIEM practices.',
        'Network Security & Traffic Inspection: Packet inspection with Wireshark, Cisco Packet Tracer VLAN segmentation, and firewall access control rules (ACLs).',
        'Threat Hunting & Incident Triage: Understanding attack vectors (Phishing, Malware, SQLi, DDoS), MITRE ATT&CK framework, and incident response playbooks.',
        'Security Compliance & OS Hardening: Linux/Windows CLI security hardening, vulnerability scanning, and NIST Cybersecurity Framework alignment.'
      ],
      tools: ['SOC Triage', 'Splunk / SIEM', 'Wireshark', 'Cisco Packet Tracer', 'MITRE ATT&CK', 'Linux Security', 'Firewall ACLs', 'NIST Framework', 'Vulnerability Assessment']
    }
  ];

  const currentTrack = tracks.find(t => t.id === activeTab) || tracks[0];

  return (
    <section 
      id="competencies" 
      aria-labelledby="competencies-heading"
      className={`py-20 transition-colors ${
        darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-slate-50 text-slate-900'
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Core Professional Alignment
          </div>
          <h2 id="competencies-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Targeted Core Competencies
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Comprehensive technical data mastery combined with commercial marketing execution and technical project leadership.
          </p>
        </div>

        {/* Track Selection Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tracks.map((track) => {
            const Icon = track.icon;
            const isActive = activeTab === track.id;
            return (
              <motion.button
                key={track.id}
                id={`btn-track-${track.id}`}
                onClick={() => setActiveTab(track.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                aria-selected={isActive}
                role="tab"
                className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 transition-all shadow-sm ${
                  isActive
                    ? 'bg-blue-600 text-white ring-2 ring-blue-600/50 shadow-blue-600/30'
                    : darkMode
                      ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{track.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Track Focus Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`p-6 sm:p-8 rounded-2xl border shadow-xl relative overflow-hidden transition-all ${
              darkMode ? 'bg-[#161616] border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Track Info */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentTrack.color} flex items-center justify-center text-white shadow-md`}>
                    <currentTrack.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {currentTrack.badge}
                    </span>
                    <h3 className="text-2xl font-bold">{currentTrack.title}</h3>
                  </div>
                </div>

                <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {currentTrack.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Accomplishments & Capabilities
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentTrack.highlights.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 + 0.1 }}
                        className="flex items-start gap-2.5 text-xs sm:text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tools Tags */}
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                    Technical Stack & Frameworks
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentTrack.tools.map((tool) => (
                      <span 
                        key={tool}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          darkMode ? 'bg-white/5 text-blue-300 border border-white/10' : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right: Detailed Skill Competency Progress Bars */}
              <div className="lg:col-span-5 space-y-6">
                <div className={`p-5 rounded-xl border ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className="text-sm font-bold mb-4 flex items-center justify-between">
                    <span>Skill Competency Breakdown</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">Proficiency</span>
                  </h4>

                  <div className="space-y-4">
                    {SKILL_GROUPS.map((group) => {
                      const pct = Math.round(group.skills.reduce((acc, s) => acc + s.level, 0) / group.skills.length);
                      return (
                        <div key={group.category} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{group.category}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-mono">
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> All skills verified via Infosys, Google, IBM & Cisco credentials
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </motion.div>
    </section>
  );
};
