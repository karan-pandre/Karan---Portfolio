import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/karanData';

interface ContactSectionProps {
  darkMode: boolean;
  onOpenAIChat: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ darkMode, onOpenAIChat }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'Data Analytics Recruitment Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Contact submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      aria-labelledby="contact-heading"
      className={`py-20 transition-colors ${
        darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Mail className="w-3.5 h-3.5" />
            Recruiter & Hiring Contact Hub
          </div>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Get In Touch with Karan Pandre
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Open to opportunities for Data Analytics, Business Intelligence, Project Management, and Digital Marketing roles across Bangalore & Global MNCs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className={`p-6 rounded-2xl border shadow-lg space-y-6 ${
              darkMode ? 'bg-[#161616] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className="text-xl font-bold">Contact Details</h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <a 
                  href={`mailto:${PERSONAL_INFO.email}`} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{PERSONAL_INFO.email}</span>
                  </div>
                </a>

                <a 
                  href={`tel:${PERSONAL_INFO.phone}`} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                    <span className="font-semibold">{PERSONAL_INFO.phone}</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Location</span>
                    <span className="font-semibold">{PERSONAL_INFO.location}</span>
                  </div>
                </div>
              </div>

              {/* Languages Spoken */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Professional Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PERSONAL_INFO.languages.map((lang) => (
                    <span key={lang} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      darkMode ? 'bg-white/5 text-slate-300 border border-white/10' : 'bg-white text-slate-700 border border-slate-200'
                    }`}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* AI Assistant Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-sm">Need Instant Answers?</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Chat with Karan's AI Twin for real-time answers about his B.Tech degree, campaign ROI, and Google Apprentice fit.
              </p>
              <button
                onClick={onOpenAIChat}
                className="w-full py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-md hover:bg-blue-50 transition-colors"
              >
                Launch AI Twin Chat
              </button>
            </div>

          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <div className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
              darkMode ? 'bg-[#161616] border-white/10' : 'bg-white border-slate-200'
            }`}>
              
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Message Received!</h3>
                  <p className={`text-xs sm:text-sm max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Thank you for reaching out. Your inquiry has been securely stored in Karan's CMS inbox. He will reply promptly!
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', company: '', subject: 'Google Apprentice Screener Inquiry', message: '' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold mb-2">Send a Direct Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Your Name *</label>
                      <input
                        id="contact-input-name"
                        type="text"
                        required
                        placeholder="e.g. Google University Recruiter"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Email Address *</label>
                      <input
                        id="contact-input-email"
                        type="email"
                        required
                        placeholder="recruiter@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Company / Organization</label>
                      <input
                        id="contact-input-company"
                        type="text"
                        placeholder="e.g. Google / Microsoft / Infosys"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Subject Category</label>
                      <select
                        id="contact-select-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      >
                        <option value="Senior Data Analytics Inquiry">Senior Data Analytics / BI Opportunity</option>
                        <option value="Data Analytics Opportunity">Data Analytics Opportunity</option>
                        <option value="Project Management Opportunity">Project Management Opportunity</option>
                        <option value="Digital Marketing Opportunity">Digital Business Marketing Opportunity</option>
                        <option value="General Technical Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Message Body *</label>
                    <textarea
                      id="contact-input-message"
                      required
                      rows={5}
                      placeholder="Write your message or interview invitation details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full p-3.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <button
                    id="btn-submit-contact"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
                  >
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Direct Message'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </motion.div>
    </section>
  );
};
