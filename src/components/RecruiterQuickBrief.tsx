import React, { useState } from 'react';
import { 
  X, ShieldCheck, Award, Briefcase, GraduationCap, CheckCircle2, 
  Copy, Check, Mail, Phone, ExternalLink, Download, Sparkles, FileText, ArrowRight, Zap, Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { PERSONAL_INFO, WORK_EXPERIENCES, CERTIFICATIONS, EDUCATION } from '../data/karanData';

interface RecruiterQuickBriefProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenATS: () => void;
  onOpenResume: () => void;
}

export const RecruiterQuickBrief: React.FC<RecruiterQuickBriefProps> = ({
  darkMode,
  isOpen,
  onClose,
  onOpenATS,
  onOpenResume,
}) => {
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const interviewInviteTemplate = `Hi Karan,

We reviewed your portfolio and were very impressed with your background in Data Analytics, campaign ROI tracking at Physics Wallah, and Power BI/SQL projects. 

We would love to invite you for an initial interview screening for our Data Analytics / Business Analyst role.

Best regards,
[Recruiter Name]
[Company / Organization]`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(interviewInviteTemplate);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`max-w-3xl w-full max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden relative ${
          darkMode ? 'bg-[#121212] border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-black bg-cyan-400 text-slate-900">
                  Recruiter 10-Sec Briefing
                </span>
                <span className="text-xs text-blue-100 font-medium hidden sm:inline">Google / MNC Screener Ready</span>
              </div>
              <h3 className="text-lg font-bold">Karan Pandre — Executive Candidate Dossier</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Metrics & Target Role Alignment */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border text-center ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="block text-[10px] uppercase font-extrabold text-blue-500">Current Experience</span>
              <span className="text-base font-black">Physics Wallah</span>
              <span className="block text-[10px] text-slate-500">Senior Associate</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="block text-[10px] uppercase font-extrabold text-emerald-500">Academic Standing</span>
              <span className="text-base font-black">7.7 CGPA</span>
              <span className="block text-[10px] text-slate-500">B.Tech IT (2025)</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="block text-[10px] uppercase font-extrabold text-purple-500">Certifications</span>
              <span className="text-base font-black">14 Verified</span>
              <span className="block text-[10px] text-slate-500">Google, IBM, Cisco, UW</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="block text-[10px] uppercase font-extrabold text-amber-500">Core Technicals</span>
              <span className="text-base font-black">Power BI + SQL</span>
              <span className="block text-[10px] text-slate-500">DAX, Python, Excel</span>
            </div>
          </div>

          {/* Why Hire Karan? 4 Recruiter Takeaways */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-blue-950/20 border-blue-500/20' : 'bg-blue-50/50 border-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <h4 className="font-extrabold text-sm uppercase tracking-wide">Key Candidate Strengths for Evaluators</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Campaign ROI & Lead Analytics</span>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Monitored 50+ multi-channel marketing campaigns at Physics Wallah with +18.4% conversion boost.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Infosys BI & SQL Engineering</span>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Built interactive Power BI dashboards, automated DAX measures, and executed complex window function queries.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">B.Tech IT Technical Depth</span>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Solid fundamentals in DBMS, Data Structures, Computer Networks, and Cisco Security (VLAN & Packet Tracer).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Cross-Functional Leadership</span>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Collaborated across academic, counselling, and sales teams to hit enrolment goals and mentor junior leads.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Copyable Recruiter Invite Email Template */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider">1-Click Recruiter Interview Invite Template</span>
              </div>
              <button
                onClick={handleCopyPitch}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Copied Pitch!' : 'Copy Template'}</span>
              </button>
            </div>

            <pre className={`p-3 rounded-xl text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed ${
              darkMode ? 'bg-black/40 text-slate-300' : 'bg-white text-slate-700 border border-slate-200'
            }`}>
              {interviewInviteTemplate}
            </pre>
          </div>

          {/* Direct Verification Credential Chips */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 block">Verified Top Certifications</span>
            <div className="flex flex-wrap gap-2">
              {CERTIFICATIONS.slice(0, 6).map((cert) => (
                <a
                  key={cert.id}
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 hover:border-blue-500 transition-all ${
                    darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-blue-500" />
                  <span>{cert.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">Direct Contact:</span>
            <button
              onClick={handleCopyEmail}
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>{PERSONAL_INFO.email}</span>
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenATS();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Run ATS Match</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenResume();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View / Print PDF Resume</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
