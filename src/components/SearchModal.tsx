import React, { useState } from 'react';
import { Search, X, Award, Briefcase, BarChart3, ChevronRight } from 'lucide-react';
import { PROJECTS, CERTIFICATIONS, SKILL_GROUPS } from '../data/karanData';

interface SearchModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ darkMode, isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProjects = PROJECTS.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.techStack.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredCerts = CERTIFICATIONS.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.issuer.toLowerCase().includes(query.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm">
      <div className={`max-w-2xl w-full p-6 rounded-2xl border shadow-2xl relative space-y-4 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-blue-500" />
          <input
            id="global-search-modal-input"
            type="text"
            autoFocus
            placeholder="Type to search skills, Power BI, SQL, Cisco, projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium focus:outline-none"
          />
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-4">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Try searching for "Power BI", "SQL", "Google", "Python", or "Physics Wallah"...
            </div>
          ) : (
            <>
              {/* Projects Results */}
              {filteredProjects.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Projects ({filteredProjects.length})</span>
                  {filteredProjects.map(p => (
                    <a
                      key={p.id}
                      href="#projects"
                      onClick={onClose}
                      className={`block p-3 rounded-xl border text-xs transition-colors ${
                        darkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">{p.title}</div>
                      <div className="text-slate-500 mt-0.5">{p.subtitle}</div>
                    </a>
                  ))}
                </div>
              )}

              {/* Certifications Results */}
              {filteredCerts.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Certifications ({filteredCerts.length})</span>
                  {filteredCerts.map(c => (
                    <a
                      key={c.id}
                      href="#certifications"
                      onClick={onClose}
                      className={`block p-3 rounded-xl border text-xs transition-colors ${
                        darkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">{c.title}</div>
                      <div className="text-blue-500 mt-0.5">{c.issuer} ({c.date})</div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
