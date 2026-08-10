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
    { id: 'all' as TargetRole, label: 'All Specialties', icon: Sparkles, badge: 'Full Portfolio' },
    { id: 'cybersecurity' as TargetRole, label: 'SOC & Security Analyst', icon: Shield, badge: 'L1 Triage & SIEM' },
    { id: 'data-analyst' as TargetRole, label: 'Data Analyst & BI', icon: BarChart2, badge: 'SQL & Power BI' },
    { id: 'network-engineer' as TargetRole, label: 'Network Specialist', icon: Network, badge: 'Cisco ACLs' },
  ];

  const handleSelect = (roleId: TargetRole) => {
    soundFx.playCyberBlip();
    onRoleChange(roleId);
  };

  const activeRoleData = roles.find(r => r.id === activeRole);

  return (
    <div className={`w-full ${className}`}>
      {/* Compact Single-Row Segment Control */}
      <div className={`p-1.5 rounded-xl border backdrop-blur-md transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 ${
        darkMode ? 'bg-[#121622]/90 border-white/10 shadow-lg' : 'bg-white/95 border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold text-slate-400 shrink-0">
          <Filter className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden md:inline uppercase tracking-wider text-[10px]">Tailor Portfolio:</span>
        </div>

        {/* Horizontal Segmented Pills */}
        <div className="flex flex-1 flex-wrap sm:flex-nowrap items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = activeRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelect(role.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                    : darkMode
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                <span>{role.label}</span>
                {isSelected && <Check className="w-3 h-3 text-emerald-200 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Reset Button */}
        {activeRole !== 'all' && (
          <button
            type="button"
            onClick={() => handleSelect('all')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 transition-all shrink-0"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Mini Active Role Indicator */}
      {activeRole !== 'all' && activeRoleData && (
        <motion.div
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>
              Tailored view active: <strong className="text-white">{activeRoleData.label}</strong> ({activeRoleData.badge})
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelect('all')}
            className="text-emerald-300 hover:underline text-[10px] font-mono font-bold"
          >
            Clear
          </button>
        </motion.div>
      )}
    </div>
  );
};

