import React, { useState } from 'react';
import { 
  BarChart3, Database, Shield, Search, ExternalLink, Code, 
  CheckCircle2, Sparkles, Filter, ChevronRight, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS } from '../data/karanData';
import { Project } from '../types';
import { MagneticCard } from './MagneticCard';

interface ProjectsSectionProps {
  darkMode: boolean;
  projects?: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ darkMode, projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCodeModal, setActiveCodeModal] = useState<Project | null>(null);

  const categories = ['All', 'Data Analytics', 'Cybersecurity', 'Digital Marketing'];

  const projectsList = projects || PROJECTS;

  const filteredProjects = projectsList.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section 
      id="projects" 
      aria-labelledby="projects-heading"
      className={`py-20 transition-colors relative overflow-hidden ${
        darkMode ? 'bg-[#0a0f1d] text-slate-100' : 'bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <BarChart3 className="w-3.5 h-3.5" />
            Featured Technical & Business Projects
          </div>
          <h2 id="projects-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Key Portfolio Projects & Case Studies
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-world analytics pipelines, network security audits, and marketing conversion funnel optimizations built by Karan Pandre.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`btn-proj-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="projects-search-input"
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <MagneticCard key={project.id} intensity={8}>
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`p-5 sm:p-6 rounded-2xl specular-shine flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden h-full ${
                    darkMode ? 'glass-panel-dark hover:border-blue-500/50' : 'glass-panel-light hover:border-blue-400 hover:shadow-2xl'
                  }`}
                >
                <div>
                  {/* Header Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="text-[10px] font-extrabold text-amber-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> FEATURED
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-4">
                    {project.subtitle}
                  </span>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {project.description}
                  </p>

                  {/* Metrics Highlight Pills */}
                  <div className="grid grid-cols-2 gap-2 my-4">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className={`p-2.5 rounded-lg border text-center ${
                        darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200'
                      }`}>
                        <span className="text-[10px] text-slate-500 block truncate">{m.label}</span>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Highlights List */}
                  <div className="space-y-1.5 my-4">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tech Stack & Action Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map(t => (
                      <span key={t} className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        darkMode ? 'bg-white/5 text-slate-300 border border-white/10' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {project.codeSnippet && (
                    <button
                      id={`btn-view-code-${project.id}`}
                      onClick={() => setActiveCodeModal(project)}
                      className="w-full py-2.5 min-h-[44px] rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Inspect DAX / SQL Code Snippet</span>
                    </button>
                  )}
                </div>

                {/* On-Hover Glassmorphism Technical Detail Reveal Overlay */}
                <div className="hidden md:flex absolute inset-0 bg-[#090d16]/95 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex-col justify-between z-30 pointer-events-none group-hover:pointer-events-auto border-2 border-blue-500/40 rounded-2xl text-slate-100">
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-500/20">
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                        TECHNICAL METADATA & SPECS
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED CODE
                      </span>
                    </div>

                    <h4 className="text-base font-black text-blue-400 mb-1 leading-snug">
                      {project.title}
                    </h4>
                    <span className="text-xs text-slate-400 block mb-3 font-mono">
                      {project.subtitle}
                    </span>

                    <div className="space-y-2 mb-4">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                        <span className="text-[9px] font-mono uppercase text-blue-300 font-extrabold block mb-0.5">Benchmark Metrics</span>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                          {project.metrics.map((m, idx) => (
                            <div key={idx} className="text-emerald-400">
                              {m.label}: <span className="text-white">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                        <span className="text-[9px] font-mono uppercase text-slate-400 font-extrabold block mb-1">Architecture Highlights</span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {project.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-blue-400 font-bold">•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-blue-500/20 flex items-center gap-2">
                    {project.codeSnippet ? (
                      <button
                        onClick={() => setActiveCodeModal(project)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-transform hover:scale-102"
                      >
                        <Code className="w-4 h-4" />
                        <span>Inspect DAX / SQL Code</span>
                      </button>
                    ) : (
                      <div className="w-full text-center text-xs font-mono text-slate-400 py-1">
                        Architecture Documentation Verified
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            </MagneticCard>
          ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Code Snippet Modal */}
      <AnimatePresence>
        {activeCodeModal && activeCodeModal.codeSnippet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`max-w-2xl w-full p-6 rounded-2xl border shadow-2xl relative ${
                darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                onClick={() => setActiveCodeModal(null)}
                className="absolute right-4 top-4 p-2 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" />
                <span>{activeCodeModal.codeSnippet.title}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono mb-4 block">
                {activeCodeModal.title} — Language: {activeCodeModal.codeSnippet.language}
              </span>

              <pre className={`p-4 rounded-xl text-xs font-mono overflow-x-auto border ${
                darkMode ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300'
              }`}>
                <code>{activeCodeModal.codeSnippet.code}</code>
              </pre>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setActiveCodeModal(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
