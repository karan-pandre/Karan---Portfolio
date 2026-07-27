import React from 'react';
import { X, Download, Printer, Copy, Check, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO, WORK_EXPERIENCES, PROJECTS, CERTIFICATIONS, EDUCATION } from '../data/karanData';

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
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

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
- Marketing & PM: Campaign ROI Tracking, Lead Funnel Management, Agile & Scrum

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
`;
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className={`max-w-4xl w-full max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl relative overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-950 text-white print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">ATS-Optimized Printable Resume</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document Canvas */}
        <div className="flex-1 p-8 sm:p-12 overflow-y-auto space-y-6 bg-white text-slate-900 font-sans print:p-0 print:overflow-visible">
          
          {/* Header */}
          <div className="text-center border-b pb-4 border-slate-300">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{PERSONAL_INFO.fullLegalName}</h1>
            <p className="text-xs font-bold text-blue-700 mt-1 uppercase tracking-wider">
              Business Analyst • Power BI • SQL • Python • Data Analytics & Business Intelligence
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-600 mt-2 font-medium">
              <span>{PERSONAL_INFO.location}</span> • 
              <span>{PERSONAL_INFO.phone}</span> • 
              <span>{PERSONAL_INFO.email}</span> • 
              <span>linkedin.com/in/karanpandre3</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {PERSONAL_INFO.bio}
            </p>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              TECHNICAL SKILLS
            </h2>
            <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
              <li><strong>Reporting & BI:</strong> Power BI (DAX, Slicers, Drill-throughs, KPI Dashboards), MS Excel (PivotTables, Power Query, VLOOKUP, Charts)</li>
              <li><strong>Databases & SQL:</strong> MySQL, MS SQL Server — Joins, Subqueries, Aggregations, Window Functions</li>
              <li><strong>Programming:</strong> Python (Pandas, NumPy, Matplotlib, Seaborn) — Data Cleaning, Automation Scripts, EDA</li>
              <li><strong>Productivity & AI Tools:</strong> ChatGPT, Google Gemini, Microsoft Copilot, GitHub Copilot, Prompt Engineering</li>
              <li><strong>Networking & Security:</strong> TCP/IP, DNS, OSI Model, Cisco Packet Tracer, VLAN Segmentation</li>
            </ul>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              WORK EXPERIENCE
            </h2>
            <div className="space-y-4">
              {WORK_EXPERIENCES.map((w) => (
                <div key={w.id}>
                  <div className="flex justify-between text-xs font-bold text-slate-900">
                    <span>{w.role} | {w.company}</span>
                    <span>{w.period}</span>
                  </div>
                  <ul className="text-xs text-slate-700 list-disc pl-4 mt-1 space-y-1">
                    {w.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              PROJECTS
            </h2>
            <div className="space-y-3">
              {PROJECTS.map((p) => (
                <div key={p.id}>
                  <div className="text-xs font-bold text-slate-900">
                    {p.title} — <span className="font-mono text-slate-600">{p.techStack.join(' · ')}</span>
                  </div>
                  <ul className="text-xs text-slate-700 list-disc pl-4 mt-1 space-y-0.5">
                    {p.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              EDUCATION
            </h2>
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span>{EDUCATION.degree} | {EDUCATION.institution}</span>
              <span>{EDUCATION.period} | {EDUCATION.score}</span>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              CERTIFICATIONS
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
              {CERTIFICATIONS.map((c) => (
                <div key={c.id}>
                  • <strong>{c.title}</strong> — {c.issuer} ({c.date})
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              LANGUAGES
            </h2>
            <p className="text-xs text-slate-700">
              {PERSONAL_INFO.languages.join(' | ')}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
