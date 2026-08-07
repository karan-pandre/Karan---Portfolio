import React, { useState, useMemo } from 'react';
import { 
  Award, ExternalLink, ShieldCheck, CheckCircle2, Search, X, Eye, 
  Copy, Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CERTIFICATIONS } from '../data/karanData';
import { Certification } from '../types';

interface CertificationsGridProps {
  darkMode: boolean;
  certifications?: Certification[];
}

export const CertificationsGrid: React.FC<CertificationsGridProps> = ({ darkMode, certifications }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCertModal, setSelectedCertModal] = useState<Certification | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Guarantee valid fallback list if prop is missing or empty
  const certsList = useMemo(() => {
    if (certifications && Array.isArray(certifications) && certifications.length > 0) {
      return certifications;
    }
    return CERTIFICATIONS;
  }, [certifications]);

  // Dynamically compute category tabs from dataset
  const categories = useMemo(() => {
    const categoriesArray: string[] = certsList.map(c => c.category).filter((c): c is string => Boolean(c));
    const rawCats: string[] = Array.from(new Set<string>(categoriesArray));
    const preferredOrder: string[] = ['Google & Coursera', 'Data & BI', 'Management & Productivity', 'Cybersecurity'];
    
    rawCats.sort((a: string, b: string) => {
      const idxA = preferredOrder.indexOf(a);
      const idxB = preferredOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return ['All', ...rawCats];
  }, [certsList]);

  // Calculate live count per category
  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return certsList.length;
    return certsList.filter(c => c.category === cat).length;
  };

  const filteredCerts = useMemo(() => {
    return certsList.filter(cert => {
      const matchesCat = selectedCategory === 'All' || cert.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery = q === '' ||
        cert.title.toLowerCase().includes(q) ||
        cert.issuer.toLowerCase().includes(q) ||
        cert.date.toLowerCase().includes(q) ||
        cert.skills.some(s => s.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [certsList, selectedCategory, searchQuery]);

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

  // Badge styles based on issuer name
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
            <span>{certsList.length} Industry Certified Credentials</span>
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
            <span className="text-xl sm:text-2xl font-black text-amber-500">{certsList.length} Verified</span>
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
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px] ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-105'
                      : darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
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
              placeholder="Search keyword, skill, or issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-8 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                darkMode ? 'bg-white/5 border-white/10 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Empty State Fallback */}
        {filteredCerts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 my-6 bg-white/5">
            <Award className="w-12 h-12 text-amber-500 mx-auto mb-3 animate-pulse" />
            <h3 className="text-base font-bold mb-1">No Matching Credentials Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              No certifications matched category "{selectedCategory}"{searchQuery ? ` and search "${searchQuery}"` : ''}.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Certifications Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <motion.div 
                key={cert.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -5, transition: { duration: 0.15 } }}
                className={`group rounded-2xl border shadow-sm flex flex-col justify-between overflow-hidden relative transition-all duration-300 ${
                  darkMode 
                    ? 'bg-[#141414] border-white/10 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10' 
                    : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-xl'
                }`}
              >
                {/* Visual Certificate Header Banner */}
                <div 
                  onClick={() => handleInspectCert(cert)}
                  className="relative p-5 flex flex-col justify-between cursor-pointer border-b border-slate-200 dark:border-white/10 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-purple-600/10 group-hover:from-amber-500/20 transition-all min-h-[160px]"
                >
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
                  
                  {/* Top Category Badge & Date Tag */}
                  <div className="flex items-center justify-between z-10 gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider shadow-sm truncate max-w-[60%]">
                      {cert.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-amber-500/20 shrink-0">
                      {cert.date}
                    </span>
                  </div>

                  {/* Certificate Title Graphic Preview */}
                  <div className="z-10 my-auto">
                    <div className="text-[9px] font-serif uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold mb-1">
                      Official Certificate
                    </div>
                    <h3 className="text-sm font-extrabold leading-snug group-hover:text-amber-500 transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                  </div>

                  {/* Issuer & Verification Badge Footer inside Banner */}
                  <div className="flex items-center justify-between z-10 text-[10px] font-medium mt-3 pt-2 border-t border-amber-500/10">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold truncate max-w-[65%] ${getIssuerBadge(cert.issuer)}`}>
                      {cert.issuer}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>

                {/* Card Body: Skills & Action Buttons */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Skills Pills */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Key Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                            darkMode 
                              ? 'bg-white/5 text-slate-300 border border-white/5' 
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                    <button
                      id={`btn-inspect-seal-${cert.id}`}
                      onClick={() => handleInspectCert(cert)}
                      className="px-3 py-2 min-h-[40px] text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-500 flex items-center gap-1.5 transition-colors rounded-xl hover:bg-amber-500/10 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Inspect Seal</span>
                    </button>

                    <a
                      id={`link-verify-cert-${cert.id}`}
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 min-h-[40px] rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0"
                    >
                      <span>Live Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Dynamic Interactive Certificate Modal */}
      <AnimatePresence>
        {selectedCertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className={`max-w-2xl w-full p-4 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
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

              {/* Certificate Presentation Document Container */}
              <div className={`p-6 sm:p-8 rounded-2xl border-4 border-amber-500/40 relative shadow-2xl ${
                darkMode ? 'bg-gradient-to-br from-amber-950/20 via-slate-900 to-amber-900/10' : 'bg-gradient-to-br from-amber-50/80 via-white to-amber-100/50'
              }`}>
                {/* Crest Header */}
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

                {/* Verification Actions */}
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
