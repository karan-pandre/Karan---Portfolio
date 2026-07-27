import React, { useState } from 'react';
import { 
  Briefcase, Calendar, MapPin, CheckCircle2, ChevronDown, ChevronUp, 
  Award, Sparkles, Building2, GraduationCap, ShieldCheck, TrendingUp, Layers, Filter 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WORK_EXPERIENCES, EDUCATION } from '../data/karanData';

interface ExperienceTimelineProps {
  darkMode: boolean;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ darkMode }) => {
  const [filter, setFilter] = useState<'all' | 'work' | 'education'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('pw-2025'); // Default open first item

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const showWork = filter === 'all' || filter === 'work';
  const showEdu = filter === 'all' || filter === 'education';

  // Metrics highlights for each role
  const roleHighlights: Record<string, { label: string; val: string }[]> = {
    'pw-2025': [
      { label: 'Role Type', val: 'Full-time' },
      { label: 'Key Focus', val: 'Campaign ROI' },
      { label: 'Conversion Impact', val: 'Admissions Boost' }
    ],
    'infosys-2024': [
      { label: 'Role Type', val: 'MNC Internship' },
      { label: 'Key Focus', val: 'Power BI & SQL' },
      { label: 'Accuracy', val: '99%+ Clean Data' }
    ],
    'cisco-2024': [
      { label: 'Role Type', val: 'Virtual Internship' },
      { label: 'Key Focus', val: 'Packet Tracer' },
      { label: 'Audit Result', val: '3 Vulnerabilities Fixed' }
    ]
  };

  return (
    <section 
      id="experience" 
      aria-labelledby="experience-heading"
      className={`py-20 transition-colors relative overflow-hidden ${
        darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background ambient light orb */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
            <Briefcase className="w-4 h-4 animate-pulse" />
            <span>Career Progression & Academic Foundation</span>
          </div>
          <h2 id="experience-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Work Experience & Educational Foundation
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Proven track record across full-time corporate marketing operations, MNC data analytics internships, and hands-on cybersecurity network labs.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-center gap-2 mb-12">
          <button
            id="btn-filter-exp-all"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Timeline Entries ({WORK_EXPERIENCES.length + 1})</span>
          </button>

          <button
            id="btn-filter-exp-work"
            onClick={() => setFilter('work')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'work'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Work Experience ({WORK_EXPERIENCES.length})</span>
          </button>

          <button
            id="btn-filter-exp-edu"
            onClick={() => setFilter('education')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'education'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Education (1)</span>
          </button>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-indigo-500/30 dark:border-indigo-500/20 ml-4 sm:ml-8 lg:ml-12 space-y-10 pr-2">
          
          <AnimatePresence>
            {showWork && WORK_EXPERIENCES.map((exp, idx) => {
              const isExpanded = expandedId === exp.id;
              const metrics = roleHighlights[exp.id] || [];

              return (
                <motion.div 
                  key={exp.id} 
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="relative pl-6 sm:pl-10 group"
                >
                  
                  {/* Glowing Timeline Node */}
                  <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-500/30 ring-4 ring-slate-50 dark:ring-[#0A0A0A] group-hover:scale-115 transition-all">
                    {idx + 1}
                  </div>

                  {/* Experience Card */}
                  <div className={`p-6 sm:p-8 rounded-2xl border shadow-lg transition-all ${
                    darkMode ? 'bg-[#141414] border-white/10 hover:border-indigo-500/40 hover:shadow-indigo-500/10' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xl'
                  }`}>
                    
                    {/* Role Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                            {exp.type}
                          </span>
                          <h3 className="text-xl font-bold tracking-tight">{exp.role}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                            {exp.company}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {exp.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end text-xs font-medium text-slate-500 dark:text-slate-400 space-y-1">
                        <span className="flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className={`my-4 text-xs sm:text-sm leading-relaxed font-medium ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {exp.summary}
                    </p>

                    {/* Quick Metric Pills Bar */}
                    {metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 my-4">
                        {metrics.map((m, i) => (
                          <div key={i} className={`p-2 rounded-xl text-center border ${
                            darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block truncate">{m.label}</span>
                            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 truncate block">{m.val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Expandable Bullet Points Section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden space-y-2.5 my-4 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800"
                        >
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Key Deliverables & Measured Results:
                          </span>
                          {exp.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{bullet}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Card Footer: Skills & Toggle Button */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map((skill) => (
                          <span 
                            key={skill}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              darkMode ? 'bg-slate-900 text-indigo-300 border border-slate-800' : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button
                        id={`btn-toggle-exp-${exp.id}`}
                        onClick={() => toggleExpand(exp.id)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Full Accomplishments'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}

            {/* Education Milestone in Timeline */}
            {showEdu && (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative pl-6 sm:pl-10 group"
              >
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-purple-500/30 ring-4 ring-slate-50 dark:ring-[#0A0A0A] group-hover:scale-115 transition-all">
                  <GraduationCap className="w-4 h-4" />
                </div>

                <div className={`p-6 sm:p-8 rounded-2xl border shadow-lg transition-all ${
                  darkMode ? 'bg-[#141414] border-white/10 hover:border-purple-500/40 hover:shadow-purple-500/10' : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                          Academic Degree
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> CGPA: {EDUCATION.score}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mt-1">{EDUCATION.degree}</h3>
                      <span className="text-base font-bold text-purple-600 dark:text-purple-400">
                        {EDUCATION.institution}, {EDUCATION.location}
                      </span>
                    </div>

                    <div className="flex flex-col md:items-end text-xs font-medium text-slate-500 dark:text-slate-400 space-y-1">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        {EDUCATION.period}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-500" />
                      Core IT, Software & Data Science Coursework
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {EDUCATION.courses.map((course) => (
                        <span 
                          key={course}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            darkMode ? 'bg-purple-950/40 text-purple-300 border border-purple-800/40' : 'bg-purple-50 text-purple-800 border border-purple-200'
                          }`}
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};
