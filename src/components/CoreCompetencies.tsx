import React from 'react';
import { 
  BarChart3, Briefcase, ShieldCheck, CheckCircle2, 
  Sparkles, ShieldAlert, Terminal, Network, Cpu, Lock, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface CoreCompetenciesProps {
  darkMode: boolean;
}

export const CoreCompetencies: React.FC<CoreCompetenciesProps> = ({ darkMode }) => {
  const securityPillars = [
    {
      id: 'soc',
      title: 'Security Operations (SOC)',
      stat: '24/7 Threat Ops',
      subtitle: 'Incident Response & Triage',
      icon: ShieldAlert,
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'group-hover:border-emerald-500/50',
      badge: 'Level 1 Ready',
      badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      items: [
        'Real-time alert triage & incident handling',
        'OS Hardening (Linux CLI & Windows)',
        'NIST Cybersecurity Framework mapping',
        'Phishing & malware payload triage'
      ]
    },
    {
      id: 'siem',
      title: 'SIEM & Log Parsing',
      stat: '10K+ Logs/Sec',
      subtitle: 'Splunk & RegEx Detection',
      icon: Terminal,
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'group-hover:border-blue-500/50',
      badge: 'Google Certified',
      badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      items: [
        'Splunk & ELK telemetry parsing rules',
        'RegEx pattern extraction for IOCs',
        'Brute-force & SQLi query detection',
        'MITRE ATT&CK framework mapping'
      ]
    },
    {
      id: 'network',
      title: 'Network Defense & ACLs',
      stat: '24+ ACL Rules',
      subtitle: 'Cisco Packet Tracer & Wireshark',
      icon: Network,
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'group-hover:border-purple-500/50',
      badge: 'Cisco Certified',
      badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      items: [
        'Wireshark packet stream analysis',
        'Firewall Ingress/Egress ACL policies',
        'VLAN trunking & subnet routing',
        'TCP/IP protocol handshake inspection'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Automation',
      stat: '12,650+ Records',
      subtitle: 'Power BI DAX & SQL Intelligence',
      icon: Cpu,
      color: 'from-amber-500 to-orange-600',
      borderColor: 'group-hover:border-amber-500/50',
      badge: 'Infosys Certified',
      badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      items: [
        'Advanced SQL Window functions (RANK, LAG)',
        'Power BI DAX measures & dashboards',
        'Python Pandas data wrangling scripts',
        'Conversion yield & campaign ROI tracking'
      ]
    }
  ];

  const tracks = [
    {
      id: 'cybersecurity',
      title: 'Cyber Security & SOC Analyst',
      icon: ShieldCheck,
      badge: 'Cisco & Google Certified',
      badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      color: 'from-emerald-600 to-teal-600',
      description: 'Hands-on focus in Security Operations Center (SOC) fundamentals, threat monitoring, SIEM log triage, network defense, and vulnerability assessment.',
      highlights: [
        'SIEM Log Analysis & Alert Triage utilizing Splunk / ELK & Google Cybersecurity framework.',
        'Network Traffic Inspection with Wireshark, Cisco Packet Tracer VLANs & Firewall ACLs.',
        'Threat Hunting & MITRE ATT&CK Mapping (Phishing, Malware, SQLi, Brute-Force).',
        'OS Hardening (Linux/Windows) & NIST Cybersecurity Framework alignment.'
      ],
      tools: ['SOC Triage', 'Splunk / SIEM', 'Wireshark', 'Cisco Packet Tracer', 'MITRE ATT&CK', 'Linux CLI', 'Firewall ACLs']
    },
    {
      id: 'analytics',
      title: 'Data Analytics & BI Specialist',
      icon: BarChart3,
      badge: 'Google & Infosys Certified',
      badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      color: 'from-blue-600 to-cyan-600',
      description: 'End-to-end data pipeline management, automated KPI reporting, complex SQL window functions, and interactive Power BI storytelling.',
      highlights: [
        'Advanced Power BI & DAX: Custom measures, slicers, drill-throughs, and dynamic dashboards.',
        'Databases & SQL: Joins, CTEs, group aggregations, and window functions (ROW_NUMBER, RANK, LAG).',
        'Python Data Wrangling: Pandas, NumPy, automated cleaning scripts, and EDA.',
        'Excel Power User: Power Query ETL, PivotTables, and executive storytelling.'
      ],
      tools: ['Power BI', 'DAX', 'MySQL', 'MS SQL Server', 'Python Pandas', 'Power Query', 'Marketing ROI']
    },
    {
      id: 'pm',
      title: 'Technical Project Leadership',
      icon: Briefcase,
      badge: 'IBM & Infosys Certified',
      badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      color: 'from-purple-600 to-indigo-600',
      description: 'Structured campaign planning, cross-functional stakeholder leadership, Agile/Scrum sprint execution, and operational risk mitigation.',
      highlights: [
        'Cross-Functional Leadership: Coordinating academic, counseling, and sales operations at Physics Wallah.',
        'Agile Sprint Delivery: IBM & Infosys certified in Scrum backlog and retrospective ceremonies.',
        'Workflow Optimization: Streamlining lead response bottlenecks to boost team efficiency by 35%.',
        'Stakeholder Alignment & Executive Reporting with actionable metric dashboards.'
      ],
      tools: ['Agile / Scrum', 'Jira / Trello', 'Process Mapping', 'Risk Assessment', 'Lead Nurture', 'KPI Tracking']
    }
  ];

  return (
    <section 
      id="competencies" 
      aria-labelledby="competencies-heading"
      className={`py-20 transition-colors ${
        darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Core Capabilities
          </div>
          <h2 id="competencies-heading" className="text-3xl sm:text-4xl font-black tracking-tight">
            Technical Security Pillars
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Simplified, high-impact overview of technical capabilities across Cyber Defense, Network Security, SIEM Threat Triage, and Data Intelligence.
          </p>
        </div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {securityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`p-5 rounded-2xl border shadow-md flex flex-col justify-between group transition-all hover:-translate-y-1 ${pillar.borderColor} ${
                  darkMode ? 'bg-[#141414] border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Main Stat & Title */}
                  <div className="mb-3">
                    <span className="text-2xl font-black block tracking-tight">{pillar.stat}</span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{pillar.title}</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">{pillar.subtitle}</span>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-white/10 text-xs">
                    {pillar.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Domain Deep Dives Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xl sm:text-2xl font-bold">
            Detailed Professional Domains
          </h3>
          <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            End-to-end skill alignment with industry standards and verified coursework credentials.
          </p>
        </div>

        {/* 3-Column Side-By-Side Competency Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tracks.map((track, idx) => {
            const Icon = track.icon;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-7 rounded-2xl border shadow-lg flex flex-col justify-between transition-all hover:-translate-y-1 group relative ${
                  darkMode 
                    ? 'bg-[#141414] border-white/10 hover:border-blue-500/40' 
                    : 'bg-white border-slate-200 hover:border-blue-400'
                }`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${track.badgeColor}`}>
                      {track.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold mb-2 group-hover:text-blue-500 transition-colors">
                    {track.title}
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {track.description}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-3 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                      Core Capabilities & Impact
                    </span>
                    <ul className="space-y-2">
                      {track.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Skill Badges Footer */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                    Key Stack & Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {track.tools.map((tool) => (
                      <span 
                        key={tool}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                          darkMode ? 'bg-white/5 text-slate-300 border border-white/10' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
