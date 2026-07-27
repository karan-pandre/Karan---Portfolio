import React, { useState } from 'react';
import { 
  ShieldCheck, Sparkles, RefreshCw, CheckCircle2, AlertCircle, 
  FileText, Download, Copy, Check, ArrowRight, Zap 
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ATSAnalysisResult } from '../types';

interface ATSResumeOptimizerProps {
  darkMode: boolean;
  onOpenResume: () => void;
}

export const ATSResumeOptimizer: React.FC<ATSResumeOptimizerProps> = ({
  darkMode,
  onOpenResume,
}) => {
  const PRESET_JDS = [
    {
      id: 'senior-da',
      title: 'Senior Data Analyst & BI Specialist',
      jd: `Looking for an experienced Data Analytics Professional to manage large-scale enterprise data pipelines and BI dashboards. Key requirements: Advanced SQL (Joins, Window Functions, CTEs), Power BI & DAX measures, Python for data wrangling (Pandas, NumPy), Excel Power Query, and executive storytelling with data-driven recommendations.`
    },
    {
      id: 'mkt-analytics',
      title: 'Business Analyst — Campaign & Growth Marketing',
      jd: `Seeking a Business Analyst to optimize digital ad spend, user conversion funnels, and customer acquisition. Key requirements: Campaign ROI analytics, lead conversion tracking, CTR/CAC optimization, market research, competitor benchmarking, and multi-channel attribution modeling.`
    },
    {
      id: 'tech-pm',
      title: 'Technical Project Manager & Agile Delivery Lead',
      jd: `Seeking a motivated Technical Project Manager to lead cross-functional sprint planning and operational execution. Key requirements: Agile/Scrum methodologies, stakeholder management, risk assessment, KPI reporting, process optimization, and clear executive communication.`
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState<string>('senior-da');
  const [customJD, setCustomJD] = useState<string>(PRESET_JDS[0].jd);
  const [targetRole, setTargetRole] = useState<string>('Senior Data Analyst & BI Specialist');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>({
    matchScore: 96,
    roleFitScore: 98,
    matchedKeywords: ['Power BI & DAX', 'SQL Window Functions', 'Python Pandas', 'Campaign ROI Analytics', 'Agile & Scrum', 'Google Data Science Certified', 'Cisco Packet Tracer', 'Lead Funnel Management'],
    missingKeywords: ['Looker (Bonus)', 'BigQuery (Transferable from SQL)'],
    recommendations: [
      'Karan brings direct, hands-on campaign performance & ROI analytics experience from Physics Wallah, making him immediately productive in Digital Marketing & Data Analytics.',
      'Holds top-tier certifications from Google (Data Science & Cybersecurity), IBM (Project Management), and Infosys Springboard (Power BI & BI Architecture).',
      'Strong academic foundation (B.Tech IT, Alliance University - 7.7 CGPA) with proven cross-functional leadership and stakeholder engagement.'
    ],
    summary: "Karan Pandre is a top-percentile candidate for Data Analytics & Business Intelligence positions. His blend of B.Tech IT technical depth, real-world campaign analytics at Physics Wallah, and hands-on BI experience at Infosys aligns seamlessly with high industry standards."
  });

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ats-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: customJD, targetRole })
      });
      const data = await res.json();
      if (data.success) {
        setAtsResult(data.result);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('ATS screener calculation failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section 
      id="ats-screener" 
      aria-labelledby="ats-screener-heading"
      className={`py-20 transition-colors ${
        darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-gradient-to-b from-blue-50/30 to-white text-slate-900'
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Enterprise & Tech MNC ATS Resume Screener
          </div>
          <h2 id="ats-screener-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ATS Keyword Alignment & Role Match Score
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Paste any Job Description or select a role template to test Karan's ATS keyword compatibility and role match score in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Job Description Input Box */}
          <div className="lg:col-span-6 space-y-5">
            <div className={`p-6 rounded-2xl border shadow-lg ${
              darkMode ? 'bg-[#161616] border-white/10' : 'bg-white border-slate-200'
            }`}>
              
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Target Enterprise Role Template:
                </label>
              </div>

              {/* Preset Selector Buttons */}
              <div className="grid grid-cols-1 gap-2 mb-4">
                {PRESET_JDS.map((preset) => (
                  <button
                    key={preset.id}
                    id={`btn-preset-${preset.id}`}
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      setCustomJD(preset.jd);
                      setTargetRole(preset.title);
                    }}
                    className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                      selectedPreset === preset.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>

              {/* Textarea for Job Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between">
                  <span>Job Description Text</span>
                  <span className="font-mono text-[10px] text-blue-500">Auto-Keyword Matcher</span>
                </label>
                <textarea
                  id="ats-jd-textarea"
                  rows={6}
                  value={customJD}
                  onChange={(e) => setCustomJD(e.target.value)}
                  className={`w-full p-3.5 rounded-xl text-xs leading-relaxed border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  placeholder="Paste any job description here..."
                />
              </div>

              {/* Run ATS Analysis Button */}
              <button
                id="btn-calculate-ats"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{isAnalyzing ? 'Calculating ATS Compatibility...' : 'Calculate ATS Compatibility'}</span>
              </button>

            </div>
          </div>

          {/* Right: Live ATS Results Card */}
          <div className="lg:col-span-6">
            {atsResult && (
              <div className={`p-6 sm:p-8 rounded-2xl border shadow-xl space-y-6 ${
                darkMode ? 'bg-[#161616] border-white/10' : 'bg-white border-slate-200'
              }`}>
                
                {/* Match Score Gauges */}
                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                  
                  <div className={`p-4 rounded-xl text-center border ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-xs font-bold text-slate-500 block mb-1">ATS Keyword Score</span>
                    <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                      {atsResult.matchScore}%
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 block mt-1">High Pass Rate</span>
                  </div>

                  <div className={`p-4 rounded-xl text-center border ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-xs font-bold text-slate-500 block mb-1">Executive Competency Fit</span>
                    <span className="text-4xl font-black text-blue-600 dark:text-blue-400">
                      {atsResult.roleFitScore}%
                    </span>
                    <span className="text-[10px] font-semibold text-blue-600 block mt-1">Top Tier Candidate</span>
                  </div>

                </div>

                {/* Recruiter Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Recruiter Screener Assessment
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl border ${
                    darkMode ? 'bg-[#0A0A0A] border-white/5 text-slate-200' : 'bg-blue-50/50 border-blue-100 text-slate-800'
                  }`}>
                    {atsResult.summary}
                  </p>
                </div>

                {/* Matched Keywords Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Matched Keyword Tokens
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.matchedKeywords.map((kw) => (
                      <span 
                        key={kw} 
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Candidate Strengths & Differentiation
                  </h4>
                  <div className="space-y-2">
                    {atsResult.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trigger PDF Resume Modal */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    id="btn-ats-open-resume"
                    onClick={onOpenResume}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View & Download ATS Resume PDF</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </motion.div>
    </section>
  );
};
