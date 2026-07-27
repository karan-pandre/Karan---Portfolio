/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
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
import { SearchModal } from './components/SearchModal';
import { MouseSpotlight } from './components/MouseSpotlight';
import { Footer } from './components/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Modals state
  const [showATSModal, setShowATSModal] = useState<boolean>(false);
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [showCMSModal, setShowCMSModal] = useState<boolean>(false);
  const [showAIChatModal, setShowAIChatModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  // Portfolio CMS Data
  const [portfolioData, setPortfolioData] = useState<any>(null);

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch('/api/portfolio-data');
      const json = await res.json();
      if (json.success) {
        setPortfolioData(json.data);
      }
    } catch (err) {
      console.log('Using local fallback portfolio data.');
    }
  };

  useEffect(() => {
    fetchPortfolioData();

    // Online / Offline Listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Keyboard shortcut (Ctrl+K) for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500 selection:text-white relative ${
      darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Interactive Cursor Spotlight Glow */}
      <MouseSpotlight darkMode={darkMode} />

      {/* Primary Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenATS={() => {
          const el = document.getElementById('ats-screener');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else setShowATSModal(true);
        }}
        onOpenResume={() => setShowResumeModal(true)}
        onOpenCMS={() => setShowCMSModal(true)}
        onOpenAIChat={() => setShowAIChatModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        isOffline={isOffline}
        personalInfo={portfolioData?.personalInfo}
      />

      {/* Main Content Sections */}
      <main id="main-content" role="main">
        <Hero
          darkMode={darkMode}
          onOpenATS={() => {
            const el = document.getElementById('ats-screener');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenResume={() => setShowResumeModal(true)}
          onOpenAIChat={() => setShowAIChatModal(true)}
          personalInfo={portfolioData?.personalInfo}
          onRefreshData={fetchPortfolioData}
        />

        <CoreCompetencies darkMode={darkMode} />

        <InteractiveDashboards darkMode={darkMode} />

        <ExperienceTimeline darkMode={darkMode} />

        <ProjectsSection darkMode={darkMode} />

        <CertificationsGrid darkMode={darkMode} />

        <ATSResumeOptimizer
          darkMode={darkMode}
          onOpenResume={() => setShowResumeModal(true)}
        />

        <ContactSection
          darkMode={darkMode}
          onOpenAIChat={() => setShowAIChatModal(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        darkMode={darkMode}
        onOpenATS={() => {
          const el = document.getElementById('ats-screener');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenResume={() => setShowResumeModal(true)}
      />

      {/* Modals */}
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
      />

      <ResumeViewerModal
        darkMode={darkMode}
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />

      <SearchModal
        darkMode={darkMode}
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

    </div>
  );
}
