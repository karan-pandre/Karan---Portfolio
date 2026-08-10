import React from 'react';
import { TargetRole } from '../types';
import { Shield, BarChart2, Network, Sparkles, RotateCcw, Filter, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/soundEffects';

interface RoleFilterBarProps {
  activeRole: TargetRole;
  onRoleChange: (role: TargetRole) => void;
  darkMode: boolean;
  className?: string;
}

export const RoleFilterBar: React.FC<RoleFilterBarProps> = ({
  activeRole,
  onRoleChange,
  darkMode,
  className = ''
}) => {
  const roles = [
    { id: 'all' as TargetRole, label: 'All Specialties', icon: Sparkles, count: 'Full Portfolio' },
    { id: 'cybersecurity' as TargetRole, label: 'SOC & Cybersecurity Analyst', icon: Shield, count: 'L1 Triage & SIEM' },
    { id: 'data-analyst' as TargetRole, label: 'Data Analyst & BI', icon: BarChart2, count: 'SQL & Power BI' },
    { id: 'network-engineer' as TargetRole, label: 'Network Security Specialist', icon: Network, count: 'Cisco ACL & Wireshark' },
  ];

  const handleSelect = (roleId: TargetRole) => {
    soundFx.playCyberBlip();
    onRoleChange(roleId);
  };

  const activeRoleData = roles.find(r => r.id === activeRole);

  return (
    <div className={`w-full ${className}`}>
      {/* Role Selector Buttons */}
      <div className={`p-2 rounded-2xl border backdrop-blur-md transition-all ${
        darkMode ? 'bg-[#161616]/90 border-white/10 shadow-2xl' : 'bg-white/95 border-slate-200 shadow-md'
      }`}>
        <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-white/10 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider text-[10px]">
            <Filter className="w-3.5 h-3.5 text-emerald-500" />
            Tailor Portfolio For Your Job Opening
          </span>
          {activeRole !== 'all' && (
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-mono font-bold"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = activeRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelect(role.id)}
                className={`p-2.5 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20 ring-2 ring-emerald-400'
                    : darkMode
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white text-emerald-700 p-0.5 rounded-full"
                    >
                      <Check className="w-3 h-3 font-bold" />
                    </motion.span>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold leading-tight">{role.label}</div>
                  <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {role.count}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Notification Banner */}
      {activeRole !== 'all' && activeRoleData && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              Portfolio view optimized for <strong className="text-white font-extrabold">{activeRoleData.label}</strong> roles. Highlighting relevant projects & skills below.
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelect('all')}
            className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold"
          >
            Show All
          </button>
        </motion.div>
      )}
    </div>
  );
};
