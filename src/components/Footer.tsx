import React from 'react';
import { Sparkles, Shield, Heart, FileText, ArrowUp, Wifi } from 'lucide-react';
import { PERSONAL_INFO } from '../data/karanData';

interface FooterProps {
  darkMode: boolean;
  onOpenATS: () => void;
  onOpenResume: () => void;
  onOpenCMS?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ darkMode, onOpenATS, onOpenResume, onOpenCMS }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      role="contentinfo" 
      className={`border-t py-12 transition-colors ${
        darkMode ? 'bg-[#0A0A0A] border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/10">
          
          <div className="space-y-1 text-center md:text-left">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Karan Pandre — Portfolio & Career Suite
            </h3>
            <p className="text-xs">
              Data Analytics & Business Intelligence Professional | B.Tech IT Graduate (2025)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenATS}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors"
            >
              ATS Screener
            </button>
            <button
              onClick={onOpenResume}
              className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors"
            >
              Download Resume
            </button>
            {onOpenCMS && (
              <button
                onClick={onOpenCMS}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                CMS Admin
              </button>
            )}
            <button
              onClick={scrollToTop}
              aria-label="Scroll Back to Top"
              className={`p-2 rounded-xl border transition-colors ${
                darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>WCAG AA Accessible • Responsive Mobile-First Design • Offline Sync Enabled</span>
          </div>

          <p>© {new Date().getFullYear()} Karan Pandre. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};
