import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, Globe, Mail, Building, User, Sparkles, 
  Check, Send, ExternalLink, Copy, Shield, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/karanData';
import { soundFx } from '../utils/soundEffects';

interface InterviewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  initialRole?: string;
}

export const InterviewBookingModal: React.FC<InterviewBookingModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  initialRole = 'Cybersecurity & SOC Analyst (L1)'
}) => {
  const [recruiterName, setRecruiterName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [roleTopic, setRoleTopic] = useState(initialRole);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [userTimezone, setUserTimezone] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata');
    } catch {
      setUserTimezone('Asia/Kolkata');
    }
  }, []);

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '02:00 PM',
    '04:30 PM',
    '06:00 PM'
  ];

  const rolePresets = [
    { label: 'Cybersecurity & SOC Analyst (L1)', color: 'emerald' },
    { label: 'Data Analyst & BI Engineer', color: 'blue' },
    { label: 'Network Security Specialist', color: 'indigo' },
    { label: 'Consulting / Freelance Project', color: 'purple' },
  ];

  const generateMailto = () => {
    const subject = encodeURIComponent(`Interview Request: ${roleTopic} - ${company || 'Recruiter'}`);
    const body = encodeURIComponent(
      `Hi Karan,\n\nI reviewed your portfolio and would like to schedule a 20-minute introductory call regarding the ${roleTopic} opportunity.\n\n` +
      `Details:\n` +
      `- Recruiter Name: ${recruiterName || 'N/A'}\n` +
      `- Company: ${company || 'N/A'}\n` +
      `- Proposed Date: ${selectedDate}\n` +
      `- Proposed Time Slot: ${selectedSlot} (${userTimezone})\n` +
      `- Contact Email: ${email}\n` +
      `${notes ? `- Note: ${notes}\n` : ''}\n` +
      `Best regards,\n${recruiterName || 'Hiring Team'}`
    );
    return `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
  };

  const generateGoogleCalendarUrl = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    let hour = parseInt(selectedSlot.split(':')[0], 10);
    const minute = parseInt(selectedSlot.split(':')[1], 10) || 0;
    const isPM = selectedSlot.includes('PM');
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    const startDate = new Date(year, month - 1, day, hour, minute);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 mins

    const formatGCal = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const title = encodeURIComponent(`Interview Call: Karan Pandre x ${company || 'Hiring Manager'}`);
    const details = encodeURIComponent(`Role Topic: ${roleTopic}\nRecruiter Email: ${email}\nNotes: ${notes}`);
    const dates = `${formatGCal(startDate)}/${formatGCal(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&add=${PERSONAL_INFO.email}`;
  };

  const handleCopySummary = () => {
    soundFx.playCyberBlip();
    const text = `Interview Request for Karan Pandre\nRole: ${roleTopic}\nCompany: ${company || 'N/A'}\nProposed Time: ${selectedDate} at ${selectedSlot} (${userTimezone})\nContact: ${email}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    setSubmitted(true);
    // Open mailto link
    window.location.href = generateMailto();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-auto ${
            darkMode 
              ? 'bg-[#121212] border-white/10 text-slate-100 shadow-emerald-950/20' 
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
          }`}
        >
          {/* Modal Header */}
          <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
            darkMode ? 'bg-slate-900/50 border-white/10' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">1-Click Intro Meeting Request</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Fast Response
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  Your Timezone: <span className="font-mono text-emerald-400 font-semibold">{userTimezone}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { soundFx.playCyberBlip(); onClose(); }}
              className={`p-2 rounded-xl transition-all ${
                darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold">Meeting Request Prepared!</h4>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Your email client has been launched with the pre-formatted invite details for <span className="text-emerald-400 font-semibold">{selectedDate}</span> at <span className="text-emerald-400 font-semibold">{selectedSlot}</span>.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <Calendar className="w-4 h-4" /> Add to Google Calendar
                </a>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> {copied ? 'Copied to Clipboard!' : 'Copy Invitation Summary'}
                </button>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); onClose(); }}
                  className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/5 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
              {/* Preset Role Picker */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  1. Select Discussion Topic / Target Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rolePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => { soundFx.playCyberBlip(); setRoleTopic(preset.label); }}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                        roleTopic === preset.label
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : darkMode
                            ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                            : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {roleTopic === preset.label && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    2. Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    3. Preferred Slot ({userTimezone.split('/')[1] || 'Local'})
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => { soundFx.playCyberBlip(); setSelectedSlot(slot); }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                          selectedSlot === slot
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                            : darkMode
                              ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recruiter Details */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  4. Your Contact Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={recruiterName}
                      onChange={(e) => setRecruiterName(e.target.value)}
                      required
                      className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Work Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="relative">
                    <Building className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Company / Organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <textarea
                  placeholder="Optional notes or job description link..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className={`w-full p-3 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    darkMode ? 'bg-white/10 hover:bg-white/15 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied Summary!' : 'Copy Summary'}
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Invite Request</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
