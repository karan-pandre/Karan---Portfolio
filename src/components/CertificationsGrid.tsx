import React, { useState } from 'react';
import { 
  Award, ExternalLink, ShieldCheck, CheckCircle2, Search, Sparkles, X, Eye, 
  Copy, Check, Building, Globe, Layers, Download 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CERTIFICATIONS } from '../data/karanData';
import { Certification } from '../types';

interface CertificationsGridProps {
  darkMode: boolean;
}

export const CertificationsGrid: React.FC<CertificationsGridProps> = ({ darkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCertModal, setSelectedCertModal] = useState<Certification | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Google & Coursera', 'Data & BI', 'Management & Productivity', 'Cybersecurity'];

  // Calculate live count per category
  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return CERTIFICATIONS.length;
    return CERTIFICATIONS.filter(c => c.category === cat).length;
  };

  const filteredCerts = CERTIFICATIONS.filter(cert => {
    const matchesCat = selectedCategory === 'All' || cert.category === selectedCategory;
    const matchesQuery = searchQuery === '' ||
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // fallback
    }
  };

  const handleInspectCert = (cert: Certification) => {
    setSelectedCertModal(cert);
    triggerConfetti();
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Badge colors based on issuer
  const getIssuerBadge = (issuer: string) => {
    if (issuer.includes('Google')) return 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    if (issuer.includes('IBM')) return 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    if (issuer.includes('Cisco')) return 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (issuer.includes('Washington')) return 'bg-purple-600/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    return 'bg-amber-600/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  };

  return (
    <section 
      id="certifications" 
      aria-labelledby="certifications-heading"
      className={`py-20 transition-colors relative overflow-hidden ${
        darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
            <Award className="w-4 h-4 animate-bounce text-amber-500" />
            <span>14 Industry Certified Credentials</span>
          </div>
          <h2 id="certifications-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Certifications & Industry Credentials
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Cryptographically verified credentials from Google, IBM, Cisco, University of Washington, and Infosys Springboard with live seal inspection.
          </p>
        </div>

        {/* Metric Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <div className={`p-4 rounded-2xl border text-center ${
            darkMode ? 'bg-[#141414] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs text-slate-400 uppercase font-bold block">Total Credentials</span>
            <span className="text-xl sm:text-2xl font-black text-amber-500">{CERTIFICATIONS.length} Verified</span>
          </div>
          <div className={`p-4 rounded-2xl border text-center ${
            darkMode ? 'bg-[#141414] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs text-slate-400 uppercase font-bold block">Global Issuers</span>
            <span className="text-xl sm:text-2xl font-black text-blue-500">5 Top Orgs</span>
          </div>
          <div className={`p-4 rounded-2xl border text-center ${
            darkMode ? 'bg-[#141414] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs text-slate-400 uppercase font-bold block">Verification Status</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-5 h-5" /> 100% Live
            </span>
          </div>
          <div className={`p-4 rounded-2xl border text-center ${
            darkMode ? 'bg-[#141414] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs text-slate-400 uppercase font-bold block">Specializations</span>
            <span className="text-xl sm:text-2xl font-black text-purple-500">Data, Security, PM</span>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`btn-cert-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-105'
                      : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-black/20 text-white' : darkMode ? 'bg-white/10 text-slate-400' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="certs-search-input"
              type="text"
              placeholder="Search by keyword, skill, or issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                darkMode ? 'bg-white/5 border-white/10 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Certifications Cards Grid with Dynamic Motion Transitions */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCerts.map((cert) => (
              <motion.div 
                key={cert.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group rounded-2xl border shadow-md flex flex-col justify-between overflow-hidden relative transition-all ${
                  darkMode ? 'bg-[#141414] border-white/10 hover:border-amber-500/40 hover:shadow-amber-500/10' : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-lg'
                }`}
              >
                {/* Visual Certificate Graphic Header Preview */}
                <div 
                  onClick={() => handleInspectCert(cert)}
                  className="relative h-44 p-4 flex flex-col justify-between cursor-pointer overflow-hidden border-b border-slate-200 dark:border-white/10 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-purple-600/10 group-hover:from-amber-500/20 transition-all"
                >
                  {/* Subtle Parchment Watermark Background Pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  
                  {/* Top Category Badge & Issuer Tag */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider shadow-sm">
                      {cert.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-amber-300 backdrop-blur-xs border border-amber-500/20">
                      {cert.date}
                    </span>
                  </div>

                  {/* Certificate Title Graphic Preview */}
                  <div className="z-10 my-auto py-2">
                    <div className="text-[10px] font-serif uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">Certificate of Completion</div>
                    <h4 className="text-sm font-extrabold line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors">
                      {cert.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      Issuer: <span className={`px-2 py-0.2 rounded border text-[10px] font-bold ${getIssuerBadge(cert.issuer)}`}>{cert.issuer}</span>
                    </p>
                  </div>

                  {/* Bottom Verification Seal Indicator */}
                  <div className="flex items-center justify-between z-10 text-[10px] font-medium text-slate-400 border-t border-amber-500/10 pt-1.5">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Official Credential
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform">
                      <Eye className="w-3 h-3" /> Inspect Seal
                    </span>
                  </div>

                  {/* Hover Overlay Light Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cert.skills.map((s) => (
                        <span 
                          key={s} 
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                            darkMode ? 'bg-white/5 text-slate-300 border border-white/5' : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      id={`btn-inspect-seal-${cert.id}`}
                      onClick={() => handleInspectCert(cert)}
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-500 flex items-center gap-1 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Inspect Seal</span>
                    </button>

                    <a
                      id={`link-verify-cert-${cert.id}`}
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                    >
                      <span>Live Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Dynamic Interactive Certificate View Modal */}
      <AnimatePresence>
        {selectedCertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className={`max-w-2xl w-full p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
                darkMode ? 'bg-[#121212] border-amber-500/30 text-slate-100' : 'bg-white border-amber-400 text-slate-900'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCertModal(null)}
                className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 bg-black/20 hover:bg-black/40 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Document Visual Presentation Container */}
              <div className={`p-6 sm:p-8 rounded-2xl border-4 border-amber-500/40 relative shadow-2xl ${
                darkMode ? 'bg-gradient-to-br from-amber-950/20 via-slate-900 to-amber-900/10' : 'bg-gradient-to-br from-amber-50/80 via-white to-amber-100/50'
              }`}>
                {/* Gold Crest Header */}
                <div className="text-center space-y-2 mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-500 shadow-lg mx-auto">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-xs font-serif uppercase tracking-widest text-amber-600 dark:text-amber-400 font-extrabold">
                    OFFICIAL CERTIFICATE OF ACHIEVEMENT
                  </h4>
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-amber-600 dark:text-amber-300">
                    {selectedCertModal.title}
                  </p>
                </div>

                {/* Recipient Notice */}
                <div className="text-center space-y-1 mb-6">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">THIS IS PROUDLY PRESENTED TO</p>
                  <p className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 underline decoration-amber-500/50 underline-offset-4">
                    KARAN UMAJI PANDRE
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto pt-1">
                    For successfully demonstrating mastery in <span className="font-semibold">{selectedCertModal.skills.join(', ')}</span> as accredited by <span className="font-bold">{selectedCertModal.issuer}</span>.
                  </p>
                </div>

                {/* Certificate Meta Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs py-3 border-y border-amber-500/20 my-4 bg-amber-500/5 rounded-xl px-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Issuer Organization</span>
                    <span className="font-bold text-amber-500">{selectedCertModal.issuer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Issue Date</span>
                    <span className="font-mono font-bold">{selectedCertModal.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Verification Status</span>
                    <span className="font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographically Verified
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                    <span className="font-bold">{selectedCertModal.category}</span>
                  </div>
                </div>

                {/* Official Stamp & Verification Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => handleCopyLink(selectedCertModal.verifyUrl, selectedCertModal.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                  >
                    {copiedId === selectedCertModal.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Verification URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={selectedCertModal.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all hover:scale-105"
                  >
                    <span>Verify Live Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
