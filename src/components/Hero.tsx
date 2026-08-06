import React, { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Download, Mail, MapPin, Award, 
  BarChart3, Briefcase, ChevronRight, ExternalLink, Camera, Upload,
  Terminal, TrendingUp, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { PERSONAL_INFO } from '../data/karanData';

interface HeroProps {
  darkMode: boolean;
  onOpenATS: () => void;
  onOpenResume: () => void;
  onOpenAIChat: () => void;
  onOpenRecruiterBrief?: () => void;
  personalInfo?: typeof PERSONAL_INFO;
  onRefreshData?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  darkMode,
  onOpenATS,
  onOpenResume,
  onOpenAIChat,
  onOpenRecruiterBrief,
  personalInfo,
  onRefreshData
}) => {
  const info = personalInfo || PERSONAL_INFO;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Parallax 3D tilt values for Hero Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXRaw = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateYRaw = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  const rotateX = useSpring(rotateXRaw, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Animated role text rotator
  const rolesList = [
    "Data Analytics & Business Intelligence Specialist",
    "Senior Associate at Physics Wallah",
    "Infosys Certified Data Analytics Intern",
    "Cisco Network Security & SOC Trainee"
  ];
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % rolesList.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [rolesList.length]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        if (!rawDataUrl) {
          resolve('');
          return;
        }
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDim = 800;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.88));
              return;
            }
          } catch (err) {
            console.warn('Canvas compression fallback', err);
          }
          resolve(rawDataUrl);
        };
        img.onerror = () => resolve(rawDataUrl);
        img.src = rawDataUrl;
      };
      reader.onerror = () => resolve('');
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
      if (!base64) {
        setUploadMessage('Unable to read image file.');
        return;
      }

      // Store in localStorage immediately so avatar persists across browser sessions
      try {
        localStorage.setItem('karan_custom_avatar', base64);
      } catch (err) {
        console.warn('LocalStorage avatar cache warning:', err);
      }

      setUploadMessage('Saving photo...');

      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      const json = await res.json();
      if (json.success) {
        setUploadMessage('Photo successfully updated!');
      } else {
        setUploadMessage('Photo updated locally!');
      }
      if (onRefreshData) onRefreshData();
      setTimeout(() => setUploadMessage(null), 3500);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setUploadMessage('Upload saved locally!');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setUploadMessage(null), 3500);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
            


            {/* Main Headline with Profile Photo / Initials Avatar */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-5">
              <motion.div 
                layoutId="hero-avatar-container"
                className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-xl shrink-0 flex items-center justify-center overflow-hidden"
              >
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
              </motion.div>
              
              <div className="flex-1 min-w-0">
                {uploadMessage && (
                  <div className="mb-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20 inline-block animate-pulse">
                    {uploadMessage}
                  </div>
                )}
                <motion.h1 
                  id="hero-heading" 
                  layoutId="hero-user-name"
                  className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
                >
                  Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">{info.name}</span>
                </motion.h1>
                
                {/* Dynamic Rotating Role Badge */}
                <div className="min-h-[32px] overflow-hidden mt-1 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={roleIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 leading-normal"
                    >
                      <Terminal className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="break-words">{rolesList[roleIdx]}</span>
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Subtitle / Role Focus */}
            <p className={`text-sm sm:text-base lg:text-lg font-medium leading-relaxed ${
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
              {onOpenRecruiterBrief && (
                <button
                  id="hero-cta-recruiter"
                  onClick={onOpenRecruiterBrief}
                  className="w-full sm:w-auto px-5 py-3 min-h-[44px] justify-center rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-[1.03]"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                  Recruiter 10-Sec Brief
                </button>
              )}

              <button
                id="hero-cta-ats"
                onClick={onOpenATS}
                className="w-full sm:w-auto px-5 py-3 min-h-[44px] justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ShieldCheck className="w-4 h-4" />
                Run ATS Match Screener
              </button>

              <button
                id="hero-cta-resume"
                onClick={onOpenResume}
                className={`w-full sm:w-auto px-5 py-3 min-h-[44px] justify-center rounded-xl font-semibold text-sm border flex items-center gap-2 transition-all hover:scale-[1.02] ${
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
                className={`w-full sm:w-auto px-4 py-3 min-h-[44px] justify-center rounded-xl font-semibold text-sm flex items-center gap-2 border border-purple-500/30 transition-all ${
                  darkMode ? 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/50' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                Ask AI Twin
              </button>
            </div>
          </motion.div>

          {/* Hero Feature Card / Verified Candidate Summary */}
          <motion.div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 perspective-1000"
          >
            <div className={`p-6 sm:p-7 rounded-2xl border shadow-xl relative overflow-hidden transition-all duration-200 ${
              darkMode ? 'bg-[#141414] border-white/10 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-300'
            }`}>
              
              {/* Header Status Badge */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 dark:border-white/10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available for Full-Time Roles</span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold">2025 Graduate</span>
              </div>

              {/* Core Qualification Summary */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Academic Degree
                  </span>
                  <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                    B.Tech in Information Technology
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Alliance University (2021–2025) • 7.7 CGPA
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                    Verified Industry Certifications
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="font-bold block">Google Cybersecurity</span>
                        <span className="text-[10px] text-slate-400">SIEM & Python Triage</span>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <Award className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <span className="font-bold block">Cisco Packet Tracer</span>
                        <span className="text-[10px] text-slate-400">Network Security & ACLs</span>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <BarChart3 className="w-4 h-4 text-purple-500 shrink-0" />
                      <div>
                        <span className="font-bold block">Infosys Springboard</span>
                        <span className="text-[10px] text-slate-400">Power BI & DAX Logic</span>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <Briefcase className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="font-bold block">IBM Agile Development</span>
                        <span className="text-[10px] text-slate-400">Scrum & Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Core Practical Experience */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Industry Experience
                  </span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Physics Wallah — Student Mentor & Campaign Growth Analyst
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Facilitated 12,650+ student admissions, managed ₹2.5L+ digital ad budgets, and boosted lead conversion yield by +429%.
                  </span>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-medium">Ready for immediate deployment</span>
                <button
                  onClick={onOpenResume}
                  className="text-blue-500 font-bold hover:underline flex items-center gap-1"
                >
                  <span>View Resume</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
