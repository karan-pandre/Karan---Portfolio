import React, { useState } from 'react';
import { 
  Calculator, TrendingUp, Clock, DollarSign, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, Download, Copy, Check, BarChart2
} from 'lucide-react';
import { motion } from 'motion/react';

interface ValueImpactCalculatorProps {
  darkMode: boolean;
  onOpenResume?: () => void;
}

export const ValueImpactCalculator: React.FC<ValueImpactCalculatorProps> = ({ 
  darkMode,
  onOpenResume 
}) => {
  const [weeklyHours, setWeeklyHours] = useState<number>(20);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(25000);
  const [dataSources, setDataSources] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations based on Karan's proven Cybersecurity & Network Security metrics
  // - 75% reduction in manual log auditing time via Python RegEx SIEM parser
  // - Threat detection accuracy boost & 100% network traffic isolation via Cisco ACLs
  const monthlyHoursSaved = Math.round(weeklyHours * 0.75 * 4.33);
  const annualHoursSaved = monthlyHoursSaved * 12;
  const estimatedSecurityRiskReduction = Math.round(monthlyBudget * 0.22);
  const annualRiskReductionValue = estimatedSecurityRiskReduction * 12;
  const estimatedCostSavings = Math.round(annualHoursSaved * 45 + annualRiskReductionValue);

  const handleCopySummary = () => {
    const text = `Karan Pandre Cybersecurity Recruiter ROI Impact Summary:
• Annual Manual Log Auditing Hours Saved: ${annualHoursSaved} hrs/year (via Automated Python RegEx Log Parser & SIEM Rules)
• Projected Vulnerability Risk Reduction Value: $${annualRiskReductionValue.toLocaleString()}/year (based on Cisco ACL Network Segmentation benchmarks)
• Estimated Total Annual Security Value Add: $${estimatedCostSavings.toLocaleString()}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="impact-calculator" className={`py-20 relative overflow-hidden ${
      darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-white text-slate-900'
    }`}>
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/10 via-blue-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>CYBERSECURITY VALUE & ROI ESTIMATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Calculate Karan's Security Impact For Your Team
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Adjust your current team's metrics below to estimate the manual log analysis hours saved, vulnerability risk reduction, and SOC triage efficiency Karan brings as a Cybersecurity Associate.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Control Panel */}
          <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border space-y-6 ${
            darkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-500" />
                <span>Configure Your Team Parameters</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Interactive Inputs</span>
            </div>

            {/* Slider 1: Weekly Log Audit Hours */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-semibold text-slate-300">Weekly Security Log Audit Hours:</span>
                <span className="font-mono font-extrabold text-blue-500 text-base">{weeklyHours} hrs/week</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 hrs (Small Team)</span>
                <span>30 hrs (Mid Team)</span>
                <span>60 hrs (Enterprise SOC)</span>
              </div>
            </div>

            {/* Slider 2: IT Asset Risk Budget */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-semibold text-slate-300">Estimated Infrastructure Security Value at Risk:</span>
                <span className="font-mono font-extrabold text-emerald-500 text-base">${monthlyBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$5,000</span>
                <span>$100,000</span>
                <span>$200,000+</span>
              </div>
            </div>

            {/* Slider 3: Network Endpoints */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-semibold text-slate-300">Active Network Endpoints & Cisco Routers:</span>
                <span className="font-mono font-extrabold text-purple-500 text-base">{dataSources} Networks</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={dataSources}
                onChange={(e) => setDataSources(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Subnet</span>
                <span>6 Sources</span>
                <span>12+ Enterprise Sources</span>
              </div>
            </div>

            {/* Methodology Note */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>
                <strong>Verified Security Methodology:</strong> Applies Karan's 75% log analysis speedup via Python SIEM parsers and 22% risk reduction benchmarks achieved in Cisco Packet Tracer network segmentation labs.
              </span>
            </div>
          </div>

          {/* Results Impact Card */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900/40 to-blue-950/40 border border-emerald-500/30 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-extrabold text-emerald-300 tracking-wider">PROJECTED SECURITY IMPACT</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  HIGH SECURITY YIELD
                </span>
              </div>

              {/* Main Metric Spotlight */}
              <div>
                <span className="text-xs text-slate-400 block font-medium mb-1">Estimated Annual Security Value Add</span>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tight">
                  ${estimatedCostSavings.toLocaleString()}
                </div>
                <span className="text-xs text-emerald-400 font-semibold mt-1 inline-block">
                  ↑ Direct SOC efficiency & threat isolation yield
                </span>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <Clock className="w-4 h-4 text-blue-400 mb-1" />
                  <span className="text-[11px] text-slate-400 block">Log Audit Hours Saved</span>
                  <span className="text-xl font-bold text-white font-mono">{annualHoursSaved} hrs</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
                  <span className="text-[11px] text-slate-400 block">Risk Mitigation Value</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">+${annualRiskReductionValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCopySummary}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Impact Summary Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Impact Brief for Hiring Team</span>
                    </>
                  )}
                </button>

                {onOpenResume && (
                  <button
                    onClick={onOpenResume}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-300" />
                    <span>Download Karan's Full Verified Resume</span>
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
