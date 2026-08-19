/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TargetRole } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoleFilterBar } from './components/RoleFilterBar';
import { CoreCompetencies } from './components/CoreCompetencies';
import { InteractiveDashboards } from './components/InteractiveDashboards';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ProjectsSection } from './components/ProjectsSection';
import { CertificationsGrid } from './components/CertificationsGrid';
import { ATSResumeOptimizer } from './components/ATSResumeOptimizer';
import { AICareerAssistant } from './components/AICareerAssistant';
import { CMSAdminPanel } from './components/CMSAdminPanel';
import { ContactSection } from './components/ContactSection';
import { ResumeViewerModal } from './components/ResumeViewerModal';
import { RecruiterQuickBrief } from './components/RecruiterQuickBrief';
import { InterviewBookingModal } from './components/InterviewBookingModal';
import { RecruiterDock } from './components/RecruiterDock';
import { SearchModal } from './components/SearchModal';
import { MouseSpotlight } from './components/MouseSpotlight';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Footer } from './components/Footer';

// Private Cybersecurity Dashboard Imports
import { CyberAuthScreen } from './components/cybersecurity/CyberAuthScreen';
import { CyberDashboard } from './components/cybersecurity/CyberDashboard';
import { CyberAuthUser } from './types/cybersecurity';
import { soundFx } from './utils/soundEffects';

// Motion Staggered Variants for Main Sections
const mainContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_preference');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
  });
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  const handleSetDarkMode = (val: boolean | ((prev: boolean) => boolean)) => {
    setDarkMode(prev => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('theme_preference', nextVal ? 'dark' : 'light');
      return nextVal;
    });
  };

  // Modals state
  const [showATSModal, setShowATSModal] = useState<boolean>(false);
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [showRecruiterBriefModal, setShowRecruiterBriefModal] = useState<boolean>(false);
  const [showCMSModal, setShowCMSModal] = useState<boolean>(false);
  const [showAIChatModal, setShowAIChatModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

  // Private Cybersecurity Dashboard Route & Auth State
  const [currentHash, setCurrentHash] = useState<string>(() => {
    return window.location.hash || window.location.pathname || '';
  });

  const [cyberAuthUser, setCyberAuthUser] = useState<CyberAuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('karan_cyber_auth_session') || localStorage.getItem('karan_cyber_auth_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.authenticated && parsed?.user) {
          return parsed.user;
        }
      }
    } catch (err) {}
    return null;
  });

  // Role Filter State ("Tailor for My Job Opening")
  const [activeRole, setActiveRole] = useState<TargetRole>('all');

  // Portfolio CMS Data & Live Preview State
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false);

  const activeData = isPreviewActive && previewData ? previewData : portfolioData;

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch('/api/portfolio-data');
      const json = await res.json();
      if (json.success) {
        const savedAvatar = localStorage.getItem('karan_custom_avatar');
        if (savedAvatar && json.data?.personalInfo) {
          json.data.personalInfo.avatar = savedAvatar;
        }
        setPortfolioData(json.data);
      }
    } catch (err) {
      console.log('Using local fallback portfolio data.');
      const savedAvatar = localStorage.getItem('karan_custom_avatar');
      if (savedAvatar) {
        setPortfolioData((prev: any) => ({
          ...prev,
          personalInfo: {
            ...(prev?.personalInfo || {}),
            avatar: savedAvatar
          }
        }));
      }
    }
  };

  useEffect(() => {
    fetchPortfolioData();

    // Route Hash Listener
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || window.location.pathname || '');
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    // Online / Offline Listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // OS Theme preference media query listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const savedOverride = localStorage.getItem('theme_preference');
      if (!savedOverride) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Keyboard shortcuts (Ctrl+K for search, Ctrl+Shift+S for Secret SOC Portal)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        soundFx.playSuccess();
        window.location.hash = '#cybersecurity-dashboard';
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Sync document root class for Tailwind dark: selectors
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Private Cybersecurity Dashboard & Login Routes
  const normalizedHash = currentHash.toLowerCase().trim();
  const isCyberLoginRoute = normalizedHash === '#secure-login' || normalizedHash === '/secure-login' || normalizedHash === '#login';
  const isCyberDashboardRoute = normalizedHash === '#cybersecurity-dashboard' || normalizedHash === '/cybersecurity-dashboard' || normalizedHash === '#cyber-dashboard';

  if (isCyberLoginRoute) {
    return (
      <CyberAuthScreen
        onLoginSuccess={(user) => {
          setCyberAuthUser(user);
          window.location.hash = '#cybersecurity-dashboard';
        }}
        onReturnToPortfolio={() => {
          window.location.hash = '';
          setCurrentHash('');
        }}
      />
    );
  }

  if (isCyberDashboardRoute) {
    if (!cyberAuthUser) {
      return (
        <CyberAuthScreen
          onLoginSuccess={(user) => {
            setCyberAuthUser(user);
            window.location.hash = '#cybersecurity-dashboard';
          }}
          onReturnToPortfolio={() => {
            window.location.hash = '';
            setCurrentHash('');
          }}
        />
      );
    }

    return (
      <CyberDashboard
        currentUser={cyberAuthUser}
        onLogout={() => {
          try {
            sessionStorage.removeItem('karan_cyber_auth_session');
            localStorage.removeItem('karan_cyber_auth_session');
          } catch (e) {}
          setCyberAuthUser(null);
          window.location.hash = '#secure-login';
        }}
        onReturnToPortfolio={() => {
          window.location.hash = '';
          setCurrentHash('');
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500 selection:text-white relative theme-transition transition-colors duration-500 ease-in-out ${
      darkMode ? 'dark bg-[#0a0f1d] text-slate-100' : 'light bg-slate-50 text-slate-900'
    }`}>
      
      {/* High-Performance Animated Background Elements & Grid */}
      <AnimatedBackground darkMode={darkMode} />

      {/* Editorial Scroll Position Progress Bar */}
      <ScrollProgressBar darkMode={darkMode} />

      {/* Interactive Cursor Spotlight Glow */}
      <MouseSpotlight darkMode={darkMode} />

      {/* Live Preview Mode Floating Banner */}
      {isPreviewActive && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl border border-amber-300 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md animate-bounce">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 animate-ping" />
            <span className="tracking-tight">Preview Mode Active (Showing Draft CMS Edits)</span>
          </span>
          <div className="flex items-center gap-1.5 border-l border-slate-950/20 pl-3">
            <button
              onClick={async () => {
                if (previewData) {
                  setPortfolioData(previewData);
                  try {
                    localStorage.setItem('karan_cms_persisted_data', JSON.stringify(previewData));
                    await fetch('/api/portfolio-data', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ authPin: 'authenticated', data: previewData })
                    });
                  } catch (err) {
                    console.warn('Error persisting preview data:', err);
                  }
                  setIsPreviewActive(false);
                  setPreviewData(null);
                  alert('Preview changes published successfully to live portfolio!');
                }
              }}
              className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-extrabold text-[11px] hover:bg-emerald-900 transition-colors shadow-sm flex items-center gap-1"
            >
              <span>Save & Publish</span>
            </button>
            <button
              onClick={() => setShowCMSModal(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 font-extrabold text-[11px] hover:bg-slate-900 transition-colors"
            >
              Return to CMS
            </button>
            <button
              onClick={() => {
                setIsPreviewActive(false);
                setPreviewData(null);
              }}
              className="px-2 py-1 rounded-lg bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 text-[11px] font-bold transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Primary Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={handleSetDarkMode}
        onOpenATS={() => {
          const el = document.getElementById('ats-screener');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else setShowATSModal(true);
        }}
        onOpenResume={() => setShowResumeModal(true)}
        onOpenCMS={() => setShowCMSModal(true)}
        onOpenAIChat={() => setShowAIChatModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenRecruiterBrief={() => setShowRecruiterBriefModal(true)}
        onOpenBooking={() => setShowBookingModal(true)}
        isOffline={isOffline}
        personalInfo={activeData?.personalInfo}
      />

      {/* Main Content Sections */}
      <motion.main
        id="main-content"
        role="main"
        variants={mainContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={sectionVariants}>
          <Hero
            darkMode={darkMode}
            onOpenATS={() => {
              const el = document.getElementById('ats-screener');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenResume={() => setShowResumeModal(true)}
            onOpenAIChat={() => setShowAIChatModal(true)}
            onOpenRecruiterBrief={() => setShowRecruiterBriefModal(true)}
            onOpenBooking={() => setShowBookingModal(true)}
            personalInfo={activeData?.personalInfo}
            onRefreshData={fetchPortfolioData}
          />
        </motion.div>

        {/* Role-Based Custom Portfolio Filter Bar */}
        <motion.div variants={sectionVariants} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <RoleFilterBar
            activeRole={activeRole}
            onRoleChange={setActiveRole}
            darkMode={darkMode}
          />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <CoreCompetencies darkMode={darkMode} activeRole={activeRole} />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <InteractiveDashboards darkMode={darkMode} activeRole={activeRole} />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <ExperienceTimeline darkMode={darkMode} experiences={activeData?.workExperiences} />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <ProjectsSection darkMode={darkMode} projects={activeData?.projects} activeRole={activeRole} />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <CertificationsGrid darkMode={darkMode} certifications={activeData?.certifications} />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <ATSResumeOptimizer
            darkMode={darkMode}
            onOpenResume={() => setShowResumeModal(true)}
          />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <ContactSection
            darkMode={darkMode}
            onOpenAIChat={() => setShowAIChatModal(true)}
          />
        </motion.div>
      </motion.main>

      {/* Footer */}
      <Footer
        darkMode={darkMode}
        onOpenATS={() => {
          const el = document.getElementById('ats-screener');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenResume={() => setShowResumeModal(true)}
        onOpenCMS={() => setShowCMSModal(true)}
      />

      {/* Modals & Dock */}
      <RecruiterDock
        darkMode={darkMode}
        onOpenBriefing={() => setShowRecruiterBriefModal(true)}
        onOpenResume={() => setShowResumeModal(true)}
        onOpenATS={() => {
          const el = document.getElementById('ats-screener');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else setShowATSModal(true);
        }}
        onOpenBooking={() => setShowBookingModal(true)}
      />

      <InterviewBookingModal
        darkMode={darkMode}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

      <RecruiterQuickBrief
        darkMode={darkMode}
        isOpen={showRecruiterBriefModal}
        onClose={() => setShowRecruiterBriefModal(false)}
        onOpenATS={() => {
          const el = document.getElementById('ats-screener');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenResume={() => setShowResumeModal(true)}
      />

      <AICareerAssistant
        darkMode={darkMode}
        isOpen={showAIChatModal}
        onClose={() => setShowAIChatModal(false)}
      />

      <CMSAdminPanel
        darkMode={darkMode}
        isOpen={showCMSModal}
        onClose={() => setShowCMSModal(false)}
        portfolioData={portfolioData}
        onRefreshData={fetchPortfolioData}
        onPreviewChanges={(draftData) => {
          setPreviewData(draftData);
          setIsPreviewActive(true);
        }}
      />

      <ResumeViewerModal
        darkMode={darkMode}
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        portfolioData={activeData}
      />

      <SearchModal
        darkMode={darkMode}
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

    </div>
  );
}
