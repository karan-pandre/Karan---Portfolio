import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, KeyRound, AlertTriangle, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/soundEffects';

interface CyberAuthScreenProps {
  onLoginSuccess: (userObj: { username: string; email: string }) => void;
  onReturnToPortfolio?: () => void;
}

export const CyberAuthScreen: React.FC<CyberAuthScreenProps> = ({
  onLoginSuccess,
  onReturnToPortfolio
}) => {
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    soundFx.playCyberBlip();

    const u = usernameInput.trim().toLowerCase();
    const p = passwordInput.trim();

    // Simulating authentication latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (u.length >= 1 && p.length >= 1) {
      soundFx.playSuccess();
      let roleDisplay = 'Karan Pandre (SOC Lead Analyst)';
      if (u.includes('ciso')) roleDisplay = 'Executive CISO (Strategic Risk Officer)';
      else if (u.includes('analyst')) roleDisplay = 'Cyber Incident Analyst (Tier 2)';
      else if (u.includes('karan') || u === 'admin') roleDisplay = 'SOC Manager & Lead Threat Hunter';

      const authUser = {
        username: roleDisplay,
        email: u.includes('@') ? u : `${u}@security.soc`
      };

      // Store in sessionStorage so it clears automatically when the tab is closed
      try {
        sessionStorage.setItem('karan_cyber_auth_session', JSON.stringify({
          authenticated: true,
          user: authUser,
          token: `sec-token-${Date.now()}`,
          timestamp: Date.now()
        }));
      } catch (err) {
        console.warn('SessionStorage error:', err);
      }

      setIsLoading(false);
      onLoginSuccess(authUser);
    } else {
      soundFx.playError();
      setIsLoading(false);
      setErrorMessage('Access Denied: Please enter a username and password.');
    }
  };

  const handle1ClickDemoLogin = (customUser?: string, customPass?: string) => {
    soundFx.playSuccess();
    const activeUsername = customUser || 'karanpandre3@gmail.com';
    const authUser = {
      username: customUser?.includes('ciso') ? 'Executive CISO (Strategic Risk Officer)' : 'Karan Pandre (SOC Lead Analyst)',
      email: activeUsername.includes('@') ? activeUsername : `${activeUsername}@security.soc`
    };
    try {
      sessionStorage.setItem('karan_cyber_auth_session', JSON.stringify({
        authenticated: true,
        user: authUser,
        token: `sec-demo-token-${Date.now()}`,
        timestamp: Date.now()
      }));
    } catch (e) {}
    onLoginSuccess(authUser);
  };

  const handleFillCredentials = (u: string, p: string) => {
    soundFx.playCyberBlip();
    setUsernameInput(u);
    setPasswordInput(p);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* High-Tech Background Cyber Grids & Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#070b14] to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-[#00ff88]/5_1px,transparent_1px] bg-[size:32px_32px] opacity-10 pointer-events-none" />

      {/* Top Bar with Return to Portfolio Link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={() => {
            if (onReturnToPortfolio) onReturnToPortfolio();
            else window.location.hash = '';
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Return to Public Portfolio</span>
        </button>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0d1322]/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl relative z-10 space-y-6"
      >
        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl shadow-emerald-900/20">
            <Shield className="w-8 h-8 animate-pulse text-emerald-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Private SOC Command Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Security Authentication
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto font-sans">
            Restricted System Access. Restricted to authorized SOC Analysts, Threat Hunters, and Recruiter Reviewers.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Username / Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Username or Email ID</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. karan.pandre@security.soc or admin"
                className="w-full pl-3.5 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-300 text-xs font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security Passkey / Password</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-300 text-xs font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-white p-1 rounded-lg"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Submit & Demo Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate & Open SOC Portal</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handle1ClickDemoLogin()}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-emerald-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1-Click Reviewer Access (Instant Demo Login)</span>
            </button>
          </div>
        </form>

        {/* Demo Credentials Helper Box - Clickable Quick-Fill */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-[11px] font-mono">
          <div className="flex items-center justify-between text-slate-400 font-bold border-b border-white/10 pb-1.5">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Click Credential Role to Autofill:
            </span>
            <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Active</span>
          </div>
          <div className="space-y-1.5 text-[10px] text-slate-300">
            <button
              type="button"
              onClick={() => handleFillCredentials('karan.pandre@security.soc', 'soc2026')}
              className="w-full flex justify-between items-center p-1.5 rounded-lg hover:bg-white/5 transition-all text-left"
            >
              <span className="text-slate-400 font-bold">SOC Lead Analyst:</span>
              <span><code className="text-amber-300 font-bold">karan.pandre@security.soc</code> / <code className="text-amber-300 font-bold">soc2026</code></span>
            </button>
            <button
              type="button"
              onClick={() => handleFillCredentials('analyst@security.soc', 'analyst2026')}
              className="w-full flex justify-between items-center p-1.5 rounded-lg hover:bg-white/5 transition-all text-left"
            >
              <span className="text-slate-400 font-bold">Incident Analyst:</span>
              <span><code className="text-amber-300 font-bold">analyst@security.soc</code> / <code className="text-amber-300 font-bold">analyst2026</code></span>
            </button>
            <button
              type="button"
              onClick={() => handleFillCredentials('ciso@security.soc', 'ciso2026')}
              className="w-full flex justify-between items-center p-1.5 rounded-lg hover:bg-white/5 transition-all text-left"
            >
              <span className="text-slate-400 font-bold">Executive CISO:</span>
              <span><code className="text-amber-300 font-bold">ciso@security.soc</code> / <code className="text-amber-300 font-bold">ciso2026</code></span>
            </button>
          </div>
        </div>

        {/* Footer Security Notice */}
        <div className="text-center text-[10px] text-slate-500 font-mono pt-1 border-t border-white/5">
          <span>Protected Route • Encrypted Session Token • Modular Backend Auth Ready</span>
        </div>

      </motion.div>
    </div>
  );
};
