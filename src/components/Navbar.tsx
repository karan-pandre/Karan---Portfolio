import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Shield, Search, Sparkles, FileText, Lock, 
  Menu, X, ChevronDown, BarChart2,
  Briefcase, Award, Code2, Cpu,
  Compass, Mail, Home, ArrowUp, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/karanData';
import { soundFx } from '../utils/soundEffects';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenATS: () => void;
  onOpenResume: () => void;
  onOpenCMS: () => void;
  onOpenAIChat: () => void;
  onOpenSearch: () => void;
  onOpenRecruiterBrief?: () => void;
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
  onOpenRecruiterBrief,
  isOffline,
  personalInfo
}) => {
  const info = personalInfo || PERSONAL_INFO;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [dockMinimized, setDockMinimized] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => soundFx.isMuted());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleAudio = () => {
    const muted = soundFx.toggleMute();
    setIsAudioMuted(muted);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = [
        { id: 'hero', label: 'Overview' },
        { id: 'competencies', label: 'Skills' },
        { id: 'dashboards', label: 'SIEM & Dashboards' },
        { id: 'pipeline-simulator', label: 'Log Pipeline' },
        { id: 'experience', label: 'Experience' },
        { id: 'projects', label: 'Projects' },
        { id: 'impact-calculator', label: 'ROI Estimator' },
        { id: 'certifications', label: 'Certifications' },
        { id: 'contact', label: 'Contact' }
      ];

      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Overview', icon: Home, href: '#hero' },
    { id: 'competencies', label: 'Skills', icon: Cpu, href: '#competencies' },
    { id: 'dashboards', label: 'SIEM & Dashboards', icon: BarChart2, href: '#dashboards' },
    { id: 'experience', label: 'Experience', icon: Briefcase, href: '#experience' },
    { id: 'projects', label: 'Projects', icon: Code2, href: '#projects' },
    { id: 'certifications', label: 'Certifications', icon: Award, href: '#certifications' },
    { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' },
  ];

  const quickTools = [
    {
      id: 'ai-twin',
      title: 'AI Career Twin',
      desc: 'Interactive Gemini assistant for candidate screening',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
      badge: 'Gemini AI',
      action: onOpenAIChat
    },
    {
      id: 'ats-matcher',
      title: 'ATS Keyword Matcher',
      desc: 'Simulate recruiter resume match against job specs',
      icon: Shield,
      color: 'bg-emerald-600 text-white',
      badge: 'Recruiter Tool',
      action: onOpenATS
    },
    {
      id: 'recruiter-brief',
      title: '10-Sec Executive Brief',
      desc: 'Fast Candidate Snapshot & key achievements',
      icon: Compass,
      color: 'bg-purple-600 text-white',
      badge: 'Fast Screen',
      action: onOpenRecruiterBrief
    },
    {
      id: 'view-resume',
      title: 'ATS Resume PDF',
      desc: 'View & download official formatted resume',
      icon: FileText,
      color: 'bg-slate-800 dark:bg-slate-700 text-white',
      badge: 'PDF',
      action: onOpenResume
    },
    {
      id: 'cms-portal',
      title: 'CMS Admin Portal',
      desc: 'Passkey authorized content management',
      icon: Lock,
      color: 'bg-amber-600 text-white',
      badge: 'Passkey',
      action: onOpenCMS
    }
  ];

  const scrollToSection = (id: string) => {
    soundFx.playCyberBlip();
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Primary Fixed Top Header */}
      <header 
        id="main-navigation" 
        role="banner"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 pt-2.5 sm:pt-4 pointer-events-none"
      >
        <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 pointer-events-auto border shadow-xl backdrop-blur-2xl ${
          scrolled 
            ? darkMode 
              ? 'bg-[#121212]/90 border-white/10 shadow-black/60' 
              : 'bg-white/90 border-slate-200/80 shadow-slate-200/50'
            : darkMode 
              ? 'bg-[#0A0A0A]/80 border-white/10 shadow-black/40' 
              : 'bg-white/80 border-slate-200/70 shadow-slate-100'
        }`}>
          <div className="px-2.5 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
            
            {/* Brand Identity */}
            <div className="flex items-center gap-2 min-w-0 shrink">
              <a 
                href="#hero" 
                id="brand-logo-link"
                onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
                aria-label="Karan Pandre Portfolio Home"
                className="flex items-center gap-2 group min-w-0"
              >
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-blue-600 to-indigo-600 shadow-md group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center overflow-hidden">
                  {info.avatar ? (
                    <img 
                      src={info.avatar} 
                      alt={info.name} 
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.nav-avatar-fallback');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                    />
                  ) : null}
                  <div className={`nav-avatar-fallback ${info.avatar ? 'hidden' : ''} w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs sm:text-sm tracking-wider`}>
                    KP
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" title="Available for Roles" />
                </div>
                <div className="flex flex-col min-w-0 max-w-[105px] xs:max-w-[145px] sm:max-w-none">
                  <span className={`font-extrabold text-xs sm:text-base tracking-tight leading-none truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {info.name}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 truncate hidden sm:block mt-0.5">
                    Cybersecurity & Analytics Specialist
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <nav id="desktop-nav-links" className="hidden lg:flex items-center space-x-1 bg-slate-100/60 dark:bg-white/5 p-1 rounded-xl border border-slate-200/50 dark:border-white/5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
                      isActive 
                        ? darkMode ? 'text-white' : 'text-slate-900' 
                        : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeNavBackground"
                        className={`absolute inset-0 rounded-lg shadow-sm ${
                          darkMode ? 'bg-white/10' : 'bg-white'
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {link.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Header Right Action Tools */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Direct CMS Admin Access Button */}
              <button
                id="btn-nav-cms-admin"
                onClick={onOpenCMS}
                aria-label="Open CMS Admin Management Panel"
                className={`hidden sm:flex px-2.5 py-1.5 rounded-xl text-xs font-bold items-center gap-1.5 transition-all border shadow-sm ${
                  darkMode 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                    : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                }`}
                title="CMS Admin Hub (Access Control Panel)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="hidden md:inline text-[11px]">CMS Admin</span>
              </button>

              {/* Command+K Search Button */}
              <button
                id="btn-quick-search"
                onClick={onOpenSearch}
                aria-label="Search Skills & Projects"
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                title="Search Portfolio (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline text-[11px]">Search</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  ⌘K
                </kbd>
              </button>

              {/* Consolidated AI & Tools Mega Popover Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="btn-tools-dropdown"
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  aria-expanded={toolsDropdownOpen}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="hidden xs:inline">Tools</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Tools Dropdown Menu */}
                <AnimatePresence>
                  {toolsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 sm:w-80 z-50 pointer-events-auto"
                    >
                      <div className={`p-3 rounded-2xl border shadow-2xl backdrop-blur-2xl ${
                        darkMode ? 'bg-[#161616]/95 border-white/15 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'
                      }`}>
                        <div className="px-2 py-1.5 mb-2 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Interactive Suite
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            5 Features Active
                          </span>
                        </div>

                        <div className="space-y-1">
                          {quickTools.map((tool) => {
                            if (!tool.action) return null;
                            const IconC = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                onClick={() => {
                                  tool.action!();
                                  setToolsDropdownOpen(false);
                                }}
                                className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-all ${
                                  darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                                }`}
                              >
                                <div className={`p-2 rounded-lg ${tool.color} shrink-0 mt-0.5 shadow-sm`}>
                                  <IconC className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                      {tool.title}
                                    </span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                                      {tool.badge}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                                    {tool.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <button
                id="btn-theme-toggle"
                onClick={() => {
                  soundFx.playToggle();
                  setDarkMode(!darkMode);
                }}
                aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className={`p-1.5 sm:p-2 rounded-xl transition-all border ${
                  darkMode ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Sound FX Toggle Button */}
              <button
                id="btn-sound-toggle"
                onClick={handleToggleAudio}
                aria-label={isAudioMuted ? "Unmute Sound FX" : "Mute Sound FX"}
                className={`hidden sm:flex p-2 rounded-xl transition-all border relative group ${
                  isAudioMuted
                    ? darkMode ? 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 shadow-sm'
                }`}
                title={isAudioMuted ? "Sound Effects: Muted (Click to Unmute)" : "Sound Effects: Active (Click to Mute)"}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
              </button>

              {/* Mobile Drawer Button */}
              <button
                id="btn-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className={`lg:hidden p-1.5 sm:p-2 rounded-xl border ${
                  darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>
          </div>

          {/* Mobile Drawer Panel */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`lg:hidden border-t px-4 py-4 space-y-4 rounded-b-2xl overflow-hidden ${
                  darkMode ? 'bg-[#161616] border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { onOpenAIChat(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Twin
                  </button>
                  <button
                    onClick={() => { onOpenATS(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    <Shield className="w-3.5 h-3.5" /> ATS Matcher
                  </button>
                  <button
                    onClick={() => { onOpenCMS(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
                  >
                    <Lock className="w-3.5 h-3.5" /> CMS Admin
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pb-1">
                    Navigation Jump
                  </div>
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => {
                        scrollToSection(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        activeSection === link.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : darkMode ? 'text-slate-200 hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span>{link.label}</span>
                      {activeSection === link.id && <span className="text-[10px]">Active</span>}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => { onOpenResume(); setMobileMenuOpen(false); }}
                    className="text-xs font-semibold text-blue-500 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> Resume PDF
                  </button>
                  {onOpenRecruiterBrief && (
                    <button
                      onClick={() => { onOpenRecruiterBrief(); setMobileMenuOpen(false); }}
                      className="text-xs font-semibold text-purple-500 flex items-center gap-1"
                    >
                      <Compass className="w-3.5 h-3.5" /> Recruiter Brief
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </header>

      {/* Floating Bottom Quick-Jump Dock (Appears when scrolled past 250px) */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto w-auto max-w-[94vw] sm:max-w-none"
          >
            <div className={`p-1 sm:p-1.5 rounded-full border shadow-2xl backdrop-blur-2xl flex items-center gap-1 sm:gap-1.5 transition-all max-w-full ${
              darkMode 
                ? 'bg-[#181818]/90 border-white/15 text-slate-200 shadow-black/80' 
                : 'bg-white/90 border-slate-200 text-slate-800 shadow-slate-300'
            }`}>
              
              {!dockMinimized ? (
                <>
                  {/* Current Active Section Badge */}
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-extrabold mr-1 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="capitalize">{activeSection.replace('-', ' ')}</span>
                  </div>

                  {/* Quick Section Anchors with Scroll Container */}
                  <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-none max-w-[65vw] sm:max-w-none px-0.5 py-0.5">
                    <button
                      onClick={() => scrollToSection('hero')}
                      title="Overview Top"
                      className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${
                        activeSection === 'hero' 
                          ? 'bg-emerald-600 text-white' 
                          : darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => scrollToSection('competencies')}
                      title="Core Skills"
                      className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${
                        activeSection === 'competencies' 
                          ? 'bg-emerald-600 text-white' 
                          : darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Cpu className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => scrollToSection('dashboards')}
                      title="SIEM & Dashboards"
                      className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${
                        activeSection === 'dashboards' || activeSection === 'pipeline-simulator'
                          ? 'bg-emerald-600 text-white' 
                          : darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => scrollToSection('experience')}
                      title="Work Experience"
                      className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${
                        activeSection === 'experience' 
                          ? 'bg-emerald-600 text-white' 
                          : darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => scrollToSection('projects')}
                      title="Projects & Case Studies"
                      className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${
                        activeSection === 'projects' 
                          ? 'bg-emerald-600 text-white' 
                          : darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Code2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => scrollToSection('impact-calculator')}
                      title="ROI Impact Calculator"
                      className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${
                        activeSection === 'impact-calculator' 
                          ? 'bg-emerald-600 text-white' 
                          : darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Compass className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => scrollToSection('certifications')}
                      title="Certifications"
                      className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${
                        activeSection === 'certifications' 
                          ? 'bg-emerald-600 text-white' 
                          : darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => scrollToSection('contact')}
                      title="Contact"
                      className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${
                        activeSection === 'contact' 
                          ? 'bg-emerald-600 text-white' 
                          : darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-0.5 shrink-0" />

                  {/* AI Quick Button */}
                  <button
                    onClick={onOpenAIChat}
                    title="Ask AI Assistant"
                    className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:scale-105 transition-transform shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </button>

                  {/* Scroll to top */}
                  <button
                    onClick={() => scrollToSection('hero')}
                    title="Scroll to Top"
                    className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${
                      darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setDockMinimized(false)}
                  className="px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 text-emerald-500"
                >
                  <Compass className="w-4 h-4" />
                  <span>Navigate</span>
                </button>
              )}

              {/* Minimize dock toggle */}
              <button
                onClick={() => setDockMinimized(!dockMinimized)}
                title={dockMinimized ? "Expand Dock" : "Minimize Dock"}
                className={`p-1 rounded-full text-slate-400 hover:text-slate-200 transition-colors ml-0.5 shrink-0`}
              >
                <X className="w-3 h-3" />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
