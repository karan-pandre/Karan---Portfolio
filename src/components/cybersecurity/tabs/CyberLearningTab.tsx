import React from 'react';
import { 
  Award, CheckCircle2, ShieldCheck, ExternalLink, BookOpen, Clock, Target 
} from 'lucide-react';
import { CyberCertItem } from '../../../types/cybersecurity';

interface CyberLearningTabProps {
  certifications: CyberCertItem[];
}

export const CyberLearningTab: React.FC<CyberLearningTabProps> = ({ certifications }) => {
  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Cybersecurity Certifications & Continuous Learning</span>
          </h2>
          <p className="text-xs text-slate-400">
            Professional industry certifications, target credentials, and verified hands-on competency paths.
          </p>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="px-2.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                  {cert.issuer}
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  cert.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' :
                  cert.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {cert.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-mono">{cert.title}</h3>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400 font-bold">
                  <span>Certification Mastery</span>
                  <span className="text-emerald-400">{cert.progressPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${cert.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 font-mono text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Verified Competencies:</span>
              <div className="flex flex-wrap gap-1">
                {cert.skillsVerified.map((sk, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-emerald-300 text-[10px] font-bold border border-slate-800">
                    {sk}
                  </span>
                ))}
              </div>
              {cert.credentialUrl && (
                <div className="pt-1">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>Verify Credential Badge</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
