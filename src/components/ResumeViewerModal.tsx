import React, { useRef, useState } from 'react';
import { X, Download, Printer, Copy, Check, FileText } from 'lucide-react';
import { PERSONAL_INFO, WORK_EXPERIENCES, PROJECTS, CERTIFICATIONS, EDUCATION } from '../data/karanData';
import { downloadResumePDF } from '../utils/generateResumePDF';

interface ResumeViewerModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeViewerModal: React.FC<ResumeViewerModalProps> = ({
  darkMode,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeCardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadResumePDF(resumeCardRef.current);
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const rawText = `
${PERSONAL_INFO.name.toUpperCase()}
Business Analyst • Power BI • SQL • Python • Data Analytics • Networking
Location: ${PERSONAL_INFO.location} | Phone: ${PERSONAL_INFO.phone} | Email: ${PERSONAL_INFO.email}
LinkedIn: ${PERSONAL_INFO.linkedin}

PROFESSIONAL SUMMARY
${PERSONAL_INFO.bio}

TECHNICAL SKILLS
- Reporting & BI: Power BI (DAX, Slicers, KPI Dashboards), MS Excel (PivotTables, Power Query)
- Databases & SQL: MySQL, MS SQL Server (Joins, Subqueries, Aggregations, Window Functions)
- Programming: Python (Pandas, NumPy, Matplotlib, Seaborn)
- Productivity & AI Tools: ChatGPT, Google Gemini, Copilot, Prompt Engineering
- Networking & Security: TCP/IP, DNS, OSI Model, Cisco Packet Tracer

WORK EXPERIENCE
${WORK_EXPERIENCES.map(w => `
${w.role.toUpperCase()} | ${w.company} (${w.period})
${w.bullets.map(b => `- ${b}`).join('\n')}
`).join('\n')}

PROJECTS
${PROJECTS.map(p => `
${p.title.toUpperCase()} (${p.techStack.join(', ')})
${p.highlights.map(h => `- ${h}`).join('\n')}
`).join('\n')}

EDUCATION
${EDUCATION.degree} | ${EDUCATION.institution} (${EDUCATION.period}) - ${EDUCATION.score}

CERTIFICATIONS
${CERTIFICATIONS.map(c => `- ${c.title} (${c.issuer})`).join('\n')}

LANGUAGES
${PERSONAL_INFO.languages.join(' | ')}
`;
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className={`max-w-4xl w-full max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl relative overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-950 text-white print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-none">Official CV Resume (PDF)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Exact recruiter-approved format</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyText}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden xs:flex px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-3.5 sm:px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download Resume PDF'}</span>
            </button>

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white" title="Close modal">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document Canvas matching user CV design */}
        <div 
          ref={resumeCardRef}
          className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-4 bg-white text-slate-900 font-sans print:p-0 print:overflow-visible text-left select-text"
        >
          
          {/* Header */}
          <div className="text-center border-b pb-3 border-slate-300">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B365D] tracking-tight uppercase">
              {PERSONAL_INFO.name}
            </h1>
            <p className="text-xs font-bold text-blue-800 mt-1 uppercase tracking-wider">
              Business Analyst • Power BI • SQL • Python • Data Analytics • Networking
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs text-slate-700 mt-2 font-medium">
              <span>{PERSONAL_INFO.location}</span> | 
              <span>{PERSONAL_INFO.phone}</span> | 
              <span>{PERSONAL_INFO.email}</span> | 
              <a href="https://linkedin.com/in/karanpandre3" target="_blank" rel="noreferrer" className="text-blue-700 underline">
                linkedin.com/in/karanpandre3
              </a>
            </div>
          </div>

          {/* 1. PROFESSIONAL SUMMARY */}
          <div>
            <div className="bg-[#1B365D] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider mb-2">
              PROFESSIONAL SUMMARY
            </div>
            <p className="text-xs text-slate-800 leading-relaxed px-1">
              B.Tech Information Technology graduate (2025) currently working at Physics Wallah, analyzing campaign performance, building dashboards, and translating business requirements into actionable insights. Gained hands-on experience configuring simulated networks, applying firewall rules, and documenting security findings through a virtual internship with Cisco Networking Academy. Familiar with SQL databases, Power BI dashboards, and Python scripting through project work and professional experience. A quick learner with a problem solving mindset, eager to grow in data analytics and business intelligence.
            </p>
          </div>

          {/* 2. TECHNICAL SKILLS */}
          <div>
            <div className="bg-[#1B365D] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider mb-2">
              TECHNICAL SKILLS
            </div>
            <ul className="text-xs text-slate-800 space-y-1 list-disc pl-5">
              <li><strong>Reporting & BI:</strong> Power BI (DAX, Slicers, Drill-throughs, KPI Dashboards), MS Excel (PivotTables, Power Query, VLOOKUP, Charts)</li>
              <li><strong>Databases & SQL:</strong> MySQL, MS SQL Server — Joins, Subqueries, Aggregations, Window Functions</li>
              <li><strong>Programming:</strong> Python (Pandas, NumPy, Matplotlib, Seaborn) — Data Cleaning, Automation Scripts, EDA</li>
              <li><strong>Productivity & AI Tools:</strong> ChatGPT, Google Gemini, Microsoft Copilot, GitHub Copilot, Prompt Engineering</li>
              <li><strong>OS & Hardware:</strong> Windows (Admin & Desktop Support), Linux .</li>
              <li><strong>Networking & Security:</strong> TCP/IP, DNS, OSI Model, Cisco Packet Tracer.</li>
            </ul>
          </div>

          {/* 3. WORK EXPERIENCE */}
          <div>
            <div className="bg-[#1B365D] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider mb-2">
              WORK EXPERIENCE
            </div>
            <div className="space-y-3.5 px-1">
              
              <div>
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>Senior Associate  |  <span className="font-semibold italic">Physics Wallah, Bangalore</span></span>
                  <span className="text-slate-600 font-semibold">Apr 2025 – Present</span>
                </div>
                <ul className="text-xs text-slate-800 list-disc pl-4 mt-1 space-y-1">
                  <li>Collaborate with academic, counselling, and sales teams to ensure seamless execution of marketing initiatives and achievement of enrolment targets.</li>
                  <li>Analyze campaign performance, lead conversion metrics, and market trends to optimize marketing strategies and improve ROI.</li>
                  <li>Mentor and support team members in lead management, communication strategies, and marketing execution to improve overall team performance.</li>
                  <li>Manage end-to-end marketing campaigns, including lead generation, follow-ups, conversion tracking, and stakeholder engagement, contributing to increased admissions and revenue growth.</li>
                  <li>Conducted market research and competitor analysis to identify growth opportunities, optimize marketing strategies, and strengthen regional market presence.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>Data Analyst intern  |  <span className="font-semibold italic">Infosys (Remote)</span></span>
                  <span className="text-slate-600 font-semibold">Sep 2024 – Feb 2025</span>
                </div>
                <ul className="text-xs text-slate-800 list-disc pl-4 mt-1 space-y-1">
                  <li>Analyzed and transformed structured datasets using SQL, Excel, and Power BI to generate actionable business insights.</li>
                  <li>Designed interactive dashboards and automated reports to monitor KPIs, identify trends, and support data-driven decision-making.</li>
                  <li>Performed data cleaning, validation, and visualization to improve data quality and deliver accurate analytical reports.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>Cybersecurity Virtual Intern  |  <span className="font-semibold italic">Cisco Networking Academy (Remote)</span></span>
                  <span className="text-slate-600 font-semibold">May 2024 – Jul 2024</span>
                </div>
                <ul className="text-xs text-slate-800 list-disc pl-4 mt-1 space-y-1">
                  <li>Configured and secured simulated networks in Cisco Packet Tracer — applied firewall rules, VLAN segmentation, and access control policies across structured lab exercises.</li>
                  <li>Performed vulnerability assessments on simulated environments; submitted a structured security findings report with risk ratings and remediation recommendations.</li>
                </ul>
              </div>

            </div>
          </div>

          {/* 4. PROJECTS */}
          <div>
            <div className="bg-[#1B365D] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider mb-2">
              PROJECTS
            </div>
            <div className="space-y-3 px-1">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Marketing Campaign Performance Dashboard — <span className="font-semibold italic text-slate-700">Power BI · Python · SQL · MS Excel</span>
                </div>
                <ul className="text-xs text-slate-800 list-disc pl-4 mt-1 space-y-1">
                  <li>Designed a Power BI dashboard with DAX measures, slicers, and drill-throughs to track 5 campaign KPIs — CTR, conversions, ROI, reach, and engagement — in a single view.</li>
                  <li>Cleaned and analyzed data using Python (Pandas); wrote SQL queries for segmentation; created Excel summaries using PivotTables and Power Query for stakeholder reporting.</li>
                </ul>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900">
                  Campus Network Security Assessment — <span className="font-semibold italic text-slate-700">Cisco Packet Tracer · Network Analysis · Log Analysis</span>
                </div>
                <ul className="text-xs text-slate-800 list-disc pl-4 mt-1 space-y-1">
                  <li>Mapped a simulated university network topology; identified 3 critical vulnerabilities including open ports, missing VLAN segmentation, and weak access controls.</li>
                  <li>Performed log analysis to detect threats; produced a structured findings report with risk ratings and firewall/segmentation improvement recommendations.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 5. EDUCATION */}
          <div>
            <div className="bg-[#1B365D] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider mb-2">
              EDUCATION
            </div>
            <div className="flex justify-between items-baseline text-xs font-bold text-slate-900 px-1">
              <span>B.Tech – Information Technology | <span className="font-normal italic">Alliance University, Bangalore</span></span>
              <span className="text-slate-700 font-semibold">2021 – 2025 | CGPA: 7.7 / 10.0</span>
            </div>
          </div>

          {/* 6. CERTIFICATIONS */}
          <div>
            <div className="bg-[#1B365D] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider mb-2">
              CERTIFICATIONS
            </div>
            <ul className="text-xs text-slate-800 space-y-1 list-disc pl-5">
              <li>Microsoft Power BI – Infosys Springboard (2025)</li>
              <li>Data Analytics Foundations – LinkedIn Learning (2024)</li>
              <li>Python for Data Science – LinkedIn Learning (2024)</li>
              <li>Cybersecurity Essentials – Cisco Networking Academy (2024)</li>
              <li>Foundations of Cybersecurity – Google Career Certificates / Coursera (2024)</li>
            </ul>
          </div>

          {/* 7. LANGUAGES */}
          <div>
            <div className="bg-[#1B365D] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider mb-2">
              LANGUAGES
            </div>
            <p className="text-xs text-slate-800 px-1 font-medium">
              English – Professional | Hindi – Professional | Kannada – Professional | Marathi – Professional
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
