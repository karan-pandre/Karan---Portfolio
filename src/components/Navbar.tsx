import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Shield, Search, Sparkles, FileText, Lock, 
  Wifi, WifiOff, Menu, X, ChevronDown, BarChart2, Database,
  Briefcase, Award, Terminal, Code2, ArrowUpRight, Cpu
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/karanData';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenATS: () => void;
  onOpenResume: () => void;
  onOpenCMS: () => void;
  onOpenAIChat: () => void;
  onOpenSearch: () => void;
  isOffline: boolean;
  personalInfo?: typeof PERSONAL_INFO;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenATS,
  onOpenResume,
  onOpenCMS,
  onOpenAIChat,
  onOpenSearch,
  isOffline,
  personalInfo
}) => {
  const info = personalInfo || PERSONAL_INFO;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Track active section for pill highlight
      const sections = ['hero', 'competencies', 'dashboards', 'experience', 'projects', 'certifications', 'contact'];
      const scrollPos = window.scrollY + 100;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories = [
    {
      id: 'analytics',
      label: 'Analytics & BI',
      href: '#dashboards',
      items: [
        { label: 'Interactive Dashboards', desc: 'Power BI & Campaign Funnel Analytics', href: '#dashboards', icon: BarChart2, badge: 'Power BI' },
        { label: 'SQL Sandbox Engine', desc: 'Run real-time joins & window functions', href: '#dashboards', icon: Database, badge: 'SQL' },
        { label: 'Core Competencies', desc: 'DAX, Python, Data Wrangling & Marketing', href: '#competencies', icon: Cpu, badge: 'Skill Grid' },
      ]
    },
    {
      id: 'career',
      label: 'Experience & Projects',
      href: '#experience',
      items: [
        { label: 'Work Timeline', desc: 'Physics Wallah, Infosys, Cisco Security', href: '#experience', icon: Briefcase, badge: 'Full Time' },
        { label: 'Featured Projects', desc: 'Campaign ROI & Campus Network Vulnerability', href: '#projects', icon: Code2, badge: '3 Case Studies' },
        { label: 'Academic Standing', desc: 'B.Tech IT Alliance University (7.7 CGPA)', href: '#experience', icon: Terminal, badge: '2021–2025' },
      ]
    },
    {
      id: 'credentials',
      label: 'Certifications & AI',
      href: '#certifications',
      items: [
        { label: '14 Verified Credentials', desc: 'Google, IBM, Cisco, UW & Infosys', href: '#certifications', icon: Award, badge: '100% Verified' },
        { label: 'ATS Match Screener', desc: 'Simulate recruiter keyword matching', action: onOpenATS, icon: Shield, badge: 'Real-time AI' },
        { label: 'AI Career Assistant', desc: 'Chat with Karan’s Gemini Twin', action: onOpenAIChat, icon: Sparkles, badge: 'Gemini 2.5' },
      ]
    },
  ];

  return (
    <header 
      id="main-navigation" 
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 pt-2 sm:pt-3 pointer-events-none"
    >
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 pointer-events-auto border shadow-xl backdrop-blur-2xl ${
        scrolled 
          ? darkMode 
            ? 'bg-[#121212]/90 border-white/10 shadow-black/60' 
            : 'bg-white/90 border-slate-200/80 shadow-slate-200/50'
          : darkMode 
            ? 'bg-[#0A0A0A]/75 border-white/10 shadow-black/40' 
            : 'bg-white/75 border-slate-200/60 shadow-slate-100'
      }`}>
        <div className="px-3 sm:px-5 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Brand Logo & Profile Picture */}
          <div className="flex items-center gap-3">
            <a 
              href="#hero" 
              id="brand-logo-link"
              aria-label="Karan Pandre Portfolio Home"
              className="flex items-center gap-2.5 group"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-md group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center overflow-hidden">
                {info.avatar ? (
                  <img 
                    src={info.avatar} 
                    alt={info.name} 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback to initials if image fails or is removed
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.avatar-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }
                    }}
                  />
                ) : null}
                <div className={`avatar-fallback ${info.avatar ? 'hidden' : ''} w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs sm:text-sm tracking-wider`}>
                  KP
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-sm sm:text-base tracking-tight leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {info.name}
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Apple/Google Style Dropdown Navigation */}
          <nav id="desktop-nav-links" className="hidden md:flex items-center space-x-1 lg:space-x-2 relative">
            <a
              href="#hero"
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                activeSection === 'hero' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview
            </a>

            {navCategories.map((cat) => (
              <div 
                key={cat.id} 
                className="relative group"
                onMouseEnter={() => setActiveMenu(cat.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <a
                  href={cat.href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 transition-all ${
                    darkMode ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.label}</span>
                  <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180 opacity-70" />
                </a>

                {/* Mega Dropdown Panel */}
                {activeMenu === cat.id && (
                  <div className={`absolute left-0 top-full pt-2 w-72 sm:w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}>
                    <div className={`p-3 rounded-2xl border shadow-2xl backdrop-blur-2xl ${
                      darkMode ? 'bg-[#181818]/95 border-white/15 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'
                    }`}>
                      <div className="space-y-1">
                        {cat.items.map((item, idx) => {
                          const IconComp = item.icon;
                          if (item.action) {
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  item.action!();
                                  setActiveMenu(null);
                                }}
                                className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-all ${
                                  darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                                }`}
                              >
                                <div className="p-2 rounded-lg bg-blue-600/10 text-blue-500 shrink-0 mt-0.5">
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</span>
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                      {item.badge}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.desc}</p>
                                </div>
                              </button>
                            );
                          }

                          return (
                            <a
                              key={idx}
                              href={item.href}
                              onClick={() => setActiveMenu(null)}
                              className={`block p-2.5 rounded-xl flex items-start gap-3 transition-all ${
                                darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                              }`}
                            >
                              <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-500 shrink-0 mt-0.5">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</span>
                                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                    {item.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.desc}</p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <a
              href="#contact"
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                activeSection === 'contact' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Action Controls & Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Command+K Search Bar Trigger Button */}
            <button
              id="btn-quick-search"
              onClick={onOpenSearch}
              aria-label="Search Skills, Projects & Certifications"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Search Portfolio (Cmd+K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden lg:inline text-slate-400 text-[11px]">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* AI Career Assistant Pill */}
            <button
              id="btn-ai-assistant"
              onClick={onOpenAIChat}
              aria-label="Open AI Career Assistant"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Twin</span>
            </button>

            {/* ATS Matcher Pill */}
            <button
              id="btn-ats-optimizer"
              onClick={onOpenATS}
              aria-label="Open ATS Resume Screener"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              title="Test Job Description ATS keyword match"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ATS Matcher</span>
            </button>

            {/* Download/View PDF Resume */}
            <button
              id="btn-view-resume"
              onClick={onOpenResume}
              aria-label="View and Download ATS Resume"
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 border transition-all ${
                darkMode 
                  ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' 
                  : 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden md:inline">Resume</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-2 rounded-xl transition-all border ${
                darkMode ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* CMS Portal Trigger */}
            <button
              id="btn-open-cms"
              onClick={onOpenCMS}
              aria-label="Open Built-in CMS Admin Portal"
              className={`p-2 rounded-xl transition-all border ${
                darkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
              title="CMS Admin Passkey Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Navigation Toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className={`md:hidden p-2 rounded-xl border ${
                darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t px-4 py-4 space-y-3 rounded-b-2xl animate-in slide-in-from-top duration-200 ${
            darkMode ? 'bg-[#161616] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
              <button
                onClick={() => { onOpenAIChat(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Career Twin
              </button>
              <button
                onClick={() => { onOpenATS(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
              >
                <Shield className="w-3.5 h-3.5" /> ATS Matcher
              </button>
            </div>

            <div className="space-y-1">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'text-slate-200 hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                Overview & Portfolio Summary
              </a>
              <a
                href="#competencies"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'text-slate-200 hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                Core Competencies & Skills
              </a>
              <a
                href="#dashboards"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'text-slate-200 hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                Analytics Dashboards & SQL Engine
              </a>
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'text-slate-200 hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                Work Experience (PW, Infosys, Cisco)
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'text-slate-200 hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                Featured Projects & Case Studies
              </a>
              <a
                href="#certifications"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'text-slate-200 hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                Verified Certifications (14 Credentials)
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'text-slate-200 hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                Contact & Inquiries
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
