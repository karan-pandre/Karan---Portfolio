import React, { useState } from 'react';
import { 
  Wrench, Shield, Terminal, Server, Cpu, Cloud, Radio, CheckCircle2, Award 
} from 'lucide-react';
import { SecurityToolItem } from '../../../types/cybersecurity';

interface CyberToolsTabProps {
  tools: SecurityToolItem[];
}

export const CyberToolsTab: React.FC<CyberToolsTabProps> = ({ tools }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Network Security',
    'SIEM & Monitoring',
    'Endpoint Security',
    'Cloud Security',
    'Offensive Security'
  ];

  const filteredTools = selectedCategory === 'ALL'
    ? tools
    : tools.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <span>Enterprise Security Tools & Technology Inventory</span>
          </h2>
          <p className="text-xs text-slate-400">
            Categorized stack of security monitoring, offensive testing, and firewall tools in Karan's portfolio.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  {tool.category}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  tool.status === 'Certified' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  tool.status === 'In Portfolio' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {tool.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-mono">{tool.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{tool.purpose}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Skill Level:</span>
                <strong className="text-emerald-300">{tool.skillLevel}</strong>
              </div>
              <p className="text-[11px] text-slate-400 italic bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                "{tool.description}"
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
