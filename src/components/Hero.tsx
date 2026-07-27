import React, { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Download, Mail, MapPin, Award, 
  BarChart3, Database, Briefcase, TrendingUp, CheckCircle2, ChevronRight, ExternalLink, Camera, Upload, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/karanData';

interface HeroProps {
  darkMode: boolean;
  onOpenATS: () => void;
  onOpenResume: () => void;
  onOpenAIChat: () => void;
  personalInfo?: typeof PERSONAL_INFO;
  onRefreshData?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  darkMode,
  onOpenATS,
  onOpenResume,
  onOpenAIChat,
  personalInfo,
  onRefreshData
}) => {
  const info = personalInfo || PERSONAL_INFO;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Animated role text rotator
  const rolesList = [
    "Business Intelligence & Data Analytics Specialist",
    "Physics Wallah Senior Marketing Associate",
    "Infosys Certified Data Analyst",
    "Cisco Cybersecurity & SOC Trainee"
  ];
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % rolesList.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [rolesList.length]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1000;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage('Processing photo...');

    try {
      const base64 = await compressImage(file);
      setUploadMessage('Saving photo...');
      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      const json = await res.json();
      if (json.success) {
        setUploadMessage('Photo updated!');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setUploadMessage(null), 3000);
      } else {
        setUploadMessage(json.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      setUploadMessage('Upload error');
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <section 
      id="hero" 
      aria-labelledby="hero-heading"
      className={`relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden transition-colors ${
        darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-gradient-to-b from-slate-50 via-blue-50/20 to-white text-slate-900'
      }`}
    >
      {/* Background Subtle Mesh Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* Target Role Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Open for Business Intelligence & Data Analytics Roles</span>
            </div>

            {/* Main Headline with Profile Photo / Initials Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-xl shrink-0 flex items-center justify-center overflow-hidden">
                {info.avatar ? (
                  <img 
                    key={info.avatar}
                    src={info.avatar} 
                    alt={info.name} 
                    className="w-full h-full object-cover rounded-xl transition-all group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.hero-avatar-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }
                    }}
                  />
                ) : null}
                <div className={`hero-avatar-fallback ${info.avatar ? 'hidden' : ''} w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl tracking-widest shadow-inner`}>
                  KP
                </div>

                {/* Upload Camera Overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload profile photo"
                  aria-label="Upload custom profile picture"
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-2xl backdrop-blur-xs cursor-pointer z-20"
                >
                  <Camera className="w-5 h-5 mb-1 animate-bounce" />
                  <span className="text-[10px] font-bold">Change Photo</span>
                </button>

                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold shadow-sm border-2 border-white dark:border-black z-30">
                  ACTIVE
                </span>
              </div>
              
              <div>
                {uploadMessage && (
                  <div className="mb-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20 inline-block animate-pulse">
                    {uploadMessage}
                  </div>
                )}
                <h1 
                  id="hero-heading" 
                  className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
                >
                  Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">{info.name}</span>
                </h1>
                
                {/* Dynamic Rotating Role Badge */}
                <div className="h-7 overflow-hidden mt-1 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={roleIdx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"
                    >
                      <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{rolesList[roleIdx]}</span>
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Subtitle / Role Focus */}
            <p className={`text-base sm:text-lg font-medium leading-relaxed ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Senior Associate at <span className="font-semibold text-blue-600 dark:text-blue-400">Physics Wallah</span>. Former <span className="font-semibold text-blue-600 dark:text-blue-400">Infosys</span> Data Analyst Intern & <span className="font-semibold text-blue-600 dark:text-blue-400">Cisco</span> Cybersecurity Virtual Intern.
            </p>

            {/* Target Competencies Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Data Analytics
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Briefcase className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Project Management
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Digital Business Marketing
              </span>
            </div>

            {/* Quick Location & Education Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                {PERSONAL_INFO.location}
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                Alliance University (CGPA: 7.7)
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                ATS Score 96%+ Optimized
              </span>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-cta-ats"
                onClick={onOpenATS}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ShieldCheck className="w-4 h-4" />
                Run ATS Match Screener
              </button>

              <button
                id="hero-cta-resume"
                onClick={onOpenResume}
                className={`px-5 py-3 rounded-xl font-semibold text-sm border flex items-center gap-2 transition-all hover:scale-[1.02] ${
                  darkMode 
                    ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800' 
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <Download className="w-4 h-4 text-blue-500" />
                Download Resume (PDF)
              </button>

              <button
                id="hero-cta-ai"
                onClick={onOpenAIChat}
                className={`px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 border border-purple-500/30 transition-all ${
                  darkMode ? 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/50' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                Ask AI Twin
              </button>
            </div>
          </motion.div>

          {/* Hero Feature Card / Live Data Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="lg:col-span-5"
          >
            <div className={`p-6 rounded-2xl border shadow-2xl relative overflow-hidden transition-all ${
              darkMode ? 'bg-[#161616] border-white/10 hover:border-blue-500/30 hover:shadow-blue-500/10' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xl'
            }`}>
              
              {/* Top Card Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-mono font-semibold ml-2 text-slate-500 dark:text-slate-400">
                    karan_pandre_kpi_overview.bi
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  LIVE
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 my-5">
                <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Campaigns Tracked</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">50+</span>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
                    ↑ Physics Wallah & Infosys
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Conversion Boost</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">+18.4%</span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                    Power BI DAX & Python
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Certifications</span>
                  <span className="text-2xl font-black text-purple-600 dark:text-purple-400">14 Verified</span>
                  <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400 mt-1 block">
                    Google, IBM, Cisco, UW
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Academic Standing</span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">7.7 CGPA</span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                    B.Tech IT (2021–2025)
                  </span>
                </div>
              </div>

              {/* Verified Badge Row */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Verified Credentials:</span>
                <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                  <span>Coursera</span> • <span>Springboard</span> • <span>Cisco</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
