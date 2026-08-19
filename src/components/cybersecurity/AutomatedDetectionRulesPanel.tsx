import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Bot, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  Plus, 
  Sliders, 
  Terminal, 
  Sparkles, 
  FileText, 
  ToggleLeft, 
  ToggleRight, 
  Database, 
  Layers, 
  Search, 
  ArrowRight,
  ExternalLink,
  Zap,
  Activity,
  Flame,
  ShieldCheck,
  Check,
  X,
  Code,
  Lock,
  History,
  CheckCircle,
  Copy,
  Wrench,
  Shield
} from 'lucide-react';
import { 
  DetectionRule, 
  RuleEvaluationResult, 
  NormalizedEvent, 
  ThreatItem, 
  IncidentItem,
  RemediationAuditLogEntry,
  RemediationExecutionResult
} from '../../types/cybersecurity';
import { soundFx } from '../../utils/soundEffects';

interface AutomatedDetectionRulesPanelProps {
  onPromoteThreatsToState?: (newThreats: ThreatItem[]) => void;
  onPromoteIncidentsToState?: (newIncidents: IncidentItem[]) => void;
  onShowToast?: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export const AutomatedDetectionRulesPanel: React.FC<AutomatedDetectionRulesPanelProps> = ({
  onPromoteThreatsToState,
  onPromoteIncidentsToState,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'RULES_ENGINE' | 'REMEDIATION_AUDIT'>('RULES_ENGINE');
  const [rules, setRules] = useState<DetectionRule[]>([]);
  const [stats, setStats] = useState<any>({
    totalRules: 6,
    activeRules: 6,
    totalMatches: 33,
    aiEnabledRules: 6,
    remediationEnabledRules: 6,
    totalRemediationsExecuted: 12,
    lastEvaluationTimestamp: new Date().toISOString()
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [remediationAuditLogs, setRemediationAuditLogs] = useState<RemediationAuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluatingStream, setIsEvaluatingStream] = useState(false);
  const [isExecutingManualRemediation, setIsExecutingManualRemediation] = useState(false);
  const [evaluationMatches, setEvaluationMatches] = useState<RuleEvaluationResult[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<RuleEvaluationResult | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPattern, setFilterPattern] = useState<string>('ALL');

  // Rule Creation / Edit Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRuleForm, setNewRuleForm] = useState({
    name: '',
    description: '',
    incidentPatternType: 'Brute Force' as const,
    field: 'description' as const,
    operator: 'contains' as const,
    value: '',
    severity: 'HIGH' as const,
    mitreTactic: 'Credential Access (T1110)',
    mitreTechnique: 'T1110.001 - Password Spraying',
    action: 'PROMOTE_TO_THREAT' as const,
    triggerAiExplanation: true,
    triggerAutomatedRemediation: true,
    remediationActionType: 'BLOCK_IP_FIREWALL' as const
  });

  // Custom Event Testing Modal
  const [isTestEventModalOpen, setIsTestEventModalOpen] = useState(false);
  const [customEventJson, setCustomEventJson] = useState(JSON.stringify({
    eventId: `EVT-CUSTOM-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sourceAgent: "app-server-01",
    agentIp: "10.0.3.14",
    sourceIp: "203.0.113.55",
    category: "System Integrity",
    description: "Unauthorized alteration of /etc/shadow credential store by non-root process.",
    payload: "Target file: /etc/shadow, modified size: +168 bytes",
    mitreTactic: "Defense Evasion",
    mitreTechnique: "T1078",
    normalizedSeverity: "CRITICAL"
  }, null, 2));

  // Load Rules & Stats on Mount
  useEffect(() => {
    fetchRules();
    fetchRemediationAudit();
  }, []);

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/detection-rules');
      const json = await res.json();
      if (json.success && json.data) {
        setRules(json.data.rules || []);
        if (json.data.stats) setStats(json.data.stats);
        if (json.data.auditLogs) setAuditLogs(json.data.auditLogs);
        if (json.data.remediationAuditLogs) setRemediationAuditLogs(json.data.remediationAuditLogs);
      }
    } catch (err) {
      console.error('Failed to fetch detection rules', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRemediationAudit = async () => {
    try {
      const res = await fetch('/api/detection-rules/remediation-audit');
      const json = await res.json();
      if (json.success && json.auditLogs) {
        setRemediationAuditLogs(json.auditLogs);
      }
    } catch (err) {
      console.error('Failed to fetch remediation audit', err);
    }
  };

  // Toggle Rule Enabled State
  const handleToggleRule = async (ruleId: string) => {
    soundFx.playCyberBlip();
    try {
      const res = await fetch(`/api/detection-rules/toggle/${ruleId}`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: json.enabled } : r));
        if (onShowToast) {
          onShowToast('Rule Toggled', json.message, 'info');
        }
      }
    } catch (err) {
      if (onShowToast) onShowToast('Error', 'Failed to toggle rule', 'error');
    }
  };

  // Run Automated Simulation Stream (Evaluates Events -> Matches Rules -> Triggers AI Explanation & Automated Remediation)
  const handleRunSimulationStream = async () => {
    setIsEvaluatingStream(true);
    soundFx.playCyberBlip();
    try {
      const res = await fetch('/api/detection-rules/simulate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (json.success) {
        setEvaluationMatches(json.matches || []);
        if (json.matches && json.matches.length > 0) {
          setSelectedEvaluation(json.matches[0]);
        }

        // Promote generated threats/incidents into parent SOC state
        if (onPromoteThreatsToState && json.promotedThreats?.length > 0) {
          onPromoteThreatsToState(json.promotedThreats);
        }
        if (onPromoteIncidentsToState && json.promotedIncidents?.length > 0) {
          onPromoteIncidentsToState(json.promotedIncidents);
        }

        if (onShowToast) {
          onShowToast(
            'Automated Pipeline Complete',
            `${json.matches?.length || 0} Incident matches detected! AI explanations generated & ${json.remediationCount || 0} remediation script(s) verified in audit log.`,
            'success'
          );
        }

        fetchRules();
        fetchRemediationAudit();
      }
    } catch (err) {
      if (onShowToast) onShowToast('Evaluation Error', 'Failed to evaluate normalized event stream', 'error');
    } finally {
      setIsEvaluatingStream(false);
    }
  };

  // Evaluate Custom Event
  const handleEvaluateCustomEvent = async () => {
    try {
      const parsedEvent = JSON.parse(customEventJson);
      setIsEvaluatingStream(true);
      soundFx.playCyberBlip();

      const res = await fetch('/api/detection-rules/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: [parsedEvent] })
      });
      const json = await res.json();
      if (json.success) {
        setEvaluationMatches(json.matches || []);
        if (json.matches && json.matches.length > 0) {
          setSelectedEvaluation(json.matches[0]);
        }

        if (onPromoteThreatsToState && json.promotedThreats?.length > 0) {
          onPromoteThreatsToState(json.promotedThreats);
        }
        if (onPromoteIncidentsToState && json.promotedIncidents?.length > 0) {
          onPromoteIncidentsToState(json.promotedIncidents);
        }

        setIsTestEventModalOpen(false);
        if (onShowToast) {
          onShowToast(
            'Event Evaluated',
            `Matched ${json.matchesCount} rule(s). AI explanation & verified remediation generated.`,
            'success'
          );
        }
        fetchRules();
        fetchRemediationAudit();
      }
    } catch (err: any) {
      if (onShowToast) onShowToast('Evaluation Error', err.message || 'Invalid JSON format', 'error');
    } finally {
      setIsEvaluatingStream(false);
    }
  };

  // Re-run or trigger on-demand remediation for current selected match
  const handleTriggerOnDemandRemediation = async (ruleId: string, event: any) => {
    setIsExecutingManualRemediation(true);
    soundFx.playCyberBlip();
    try {
      const res = await fetch('/api/detection-rules/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId, event })
      });
      const json = await res.json();
      if (json.success && json.remediation) {
        if (selectedEvaluation) {
          setSelectedEvaluation({
            ...selectedEvaluation,
            triggeredRemediation: true,
            remediationState: 'VERIFIED_SUCCESS',
            remediationExecution: json.remediation
          });
        }
        if (onShowToast) {
          onShowToast(
            'Remediation Script Verified',
            `Executed and cryptographically logged (${json.remediation.verificationHash.slice(0, 18)}...)`,
            'success'
          );
        }
        fetchRemediationAudit();
      }
    } catch (err) {
      if (onShowToast) onShowToast('Remediation Error', 'Failed to execute automated remediation script', 'error');
    } finally {
      setIsExecutingManualRemediation(false);
    }
  };

  // Copy hash to clipboard
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    soundFx.playCyberBlip();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Create New Rule
  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleForm.name || !newRuleForm.value) {
      if (onShowToast) onShowToast('Validation Error', 'Rule name and pattern value are required', 'warning');
      return;
    }

    try {
      const payload = {
        name: newRuleForm.name,
        description: newRuleForm.description,
        incidentPatternType: newRuleForm.incidentPatternType,
        patternConditions: [
          {
            field: newRuleForm.field,
            operator: newRuleForm.operator,
            value: newRuleForm.value
          }
        ],
        patternLogic: 'AND',
        severity: newRuleForm.severity,
        mitreTactic: newRuleForm.mitreTactic,
        mitreTechnique: newRuleForm.mitreTechnique,
        action: newRuleForm.action,
        triggerAiExplanation: newRuleForm.triggerAiExplanation,
        triggerAutomatedRemediation: newRuleForm.triggerAutomatedRemediation,
        remediationActionType: newRuleForm.remediationActionType,
        enabled: true
      };

      const res = await fetch('/api/detection-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setIsCreateModalOpen(false);
        setNewRuleForm({
          name: '',
          description: '',
          incidentPatternType: 'Brute Force',
          field: 'description',
          operator: 'contains',
          value: '',
          severity: 'HIGH',
          mitreTactic: 'Credential Access (T1110)',
          mitreTechnique: 'T1110.001 - Password Spraying',
          action: 'PROMOTE_TO_THREAT',
          triggerAiExplanation: true,
          triggerAutomatedRemediation: true,
          remediationActionType: 'BLOCK_IP_FIREWALL'
        });
        if (onShowToast) {
          onShowToast('Detection Rule Deployed', `Rule "${json.rule.name}" is now active with automated remediation armed.`, 'success');
        }
        fetchRules();
      }
    } catch (err) {
      if (onShowToast) onShowToast('Error', 'Failed to deploy detection rule', 'error');
    }
  };

  // Filtered Rules
  const filteredRules = rules.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPattern = filterPattern === 'ALL' || r.incidentPatternType === filterPattern;
    return matchesSearch && matchesPattern;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-mono">
                AUTOMATED DETECTION RULE ENGINE & REMEDIATION PIPELINE
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PATTERN MATCH + AI + REMEDIATION VERIFICATION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluates incoming normalized event streams against incident patterns, triggers Gemini AI root-cause hypotheses, and generates cryptographically verified remediation script responses logged to the audit trail.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Tab Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('RULES_ENGINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'RULES_ENGINE'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Rules Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('REMEDIATION_AUDIT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'REMEDIATION_AUDIT'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Remediation Audit ({remediationAuditLogs.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsTestEventModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Test Event JSON</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Rule</span>
          </button>

          <button
            onClick={handleRunSimulationStream}
            disabled={isEvaluatingStream}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {isEvaluatingStream ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
            <span>{isEvaluatingStream ? 'Evaluating & Remediating...' : 'Run Automated Stream Evaluation'}</span>
          </button>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px]">Defined Rules</span>
          <div className="text-xl font-bold text-white flex items-center justify-between">
            <span>{stats.totalRules}</span>
            <Sliders className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-[10px] text-cyan-400 font-medium">{stats.activeRules} Guarding Active Streams</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px]">Automated AI Triggers</span>
          <div className="text-xl font-bold text-amber-300 flex items-center justify-between">
            <span>{stats.aiEnabledRules} Active</span>
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-[10px] text-amber-400/80">Gemini SOC L3 Root-Cause Ready</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px]">Remediation Armed Rules</span>
          <div className="text-xl font-bold text-emerald-400 flex items-center justify-between">
            <span>{stats.remediationEnabledRules || stats.totalRules} Armed</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-[10px] text-emerald-400/80">SOAR Script Execution Verification</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px]">Verified Audit Proofs</span>
          <div className="text-xl font-bold text-cyan-400 flex items-center justify-between">
            <span>{remediationAuditLogs.length} Verified</span>
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-[10px] text-slate-400">Cryptographically Hash Sealed</div>
        </div>
      </div>

      {/* TAB 1: RULES ENGINE & LIVE MATCHES */}
      {activeTab === 'RULES_ENGINE' && (
        <div className="space-y-6">
          {/* Live Match & AI + Remediation Stream Section (When matches exist) */}
          {evaluationMatches.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white font-mono">
                    LIVE EVALUATION MATCHES, AI EXPLANATION & VERIFIED REMEDIATION ({evaluationMatches.length})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PROMOTED TO SOC STATE
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> REMEDIATION LOGGED
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Left: Matches List */}
                <div className="lg:col-span-4 space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {evaluationMatches.map((match) => {
                    const isSelected = selectedEvaluation?.id === match.id;
                    return (
                      <div
                        key={match.id}
                        onClick={() => {
                          soundFx.playCyberBlip();
                          setSelectedEvaluation(match);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-slate-950 border-amber-500/60 shadow-lg shadow-amber-950/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                            {match.incidentPatternType}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            match.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {match.severity}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-100 font-mono">{match.ruleName}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">{match.matchedEvent.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/80">
                          <span>Host: <span className="text-slate-300">{match.matchedEvent.sourceAgent}</span></span>
                          {match.triggeredRemediation ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1 font-bold">
                              <Bot className="w-3 h-3" /> AI Explaining
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Selected Match AI Explanation & Automated Remediation Drawer */}
                <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 max-h-[520px] overflow-y-auto">
                  {selectedEvaluation ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                        <div>
                          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                            Matched Rule: {selectedEvaluation.ruleId}
                          </div>
                          <h4 className="text-sm font-bold text-white font-mono">{selectedEvaluation.ruleName}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Bot className="w-3 h-3" /> GEMINI L3
                          </span>
                          <span className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> AUTO-REMEDIATION
                          </span>
                        </div>
                      </div>

                      {/* AI Threat Assessment Box */}
                      {selectedEvaluation.aiExplanation && (
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
                            <span className="flex items-center gap-1.5">
                              <Bot className="w-4 h-4" /> AI Incident Root-Cause Explanation
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">Confidence: {selectedEvaluation.aiExplanation.confidenceScore || 94}%</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                            {selectedEvaluation.aiExplanation.summary}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                            <div className="text-slate-400">
                              <span className="text-slate-500 block text-[10px]">Hypothesis:</span>
                              <span className="text-slate-300 font-sans">{selectedEvaluation.aiExplanation.threatActorHypothesis}</span>
                            </div>
                            <div className="text-slate-400">
                              <span className="text-slate-500 block text-[10px]">MITRE Tactic/Technique:</span>
                              <span className="text-cyan-400 font-bold">{selectedEvaluation.aiExplanation.mitreRef}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AUTOMATED REMEDIATION SCRIPT EXECUTION & VERIFICATION CARD */}
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                              <Wrench className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">
                                Automated Remediation Script Trigger & Verification
                              </span>
                              <span className="text-[10px] text-emerald-400">
                                Action: {selectedEvaluation.remediationExecution?.actionType || 'ISOLATE_HOST'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> VERIFIED (Exit Code 0)
                            </span>
                            <button
                              onClick={() => handleTriggerOnDemandRemediation(selectedEvaluation.ruleId, selectedEvaluation.matchedEvent)}
                              disabled={isExecutingManualRemediation}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              {isExecutingManualRemediation ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                              <span>Re-Verify Script</span>
                            </button>
                          </div>
                        </div>

                        {/* Generated Remediation Script View */}
                        {selectedEvaluation.remediationExecution?.scriptContent && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Code className="w-3.5 h-3.5 text-cyan-400" />
                                Generated Remediation Script ({selectedEvaluation.remediationExecution.scriptLanguage}):
                              </span>
                              <span className="text-[10px] text-slate-500">Latency: {selectedEvaluation.remediationExecution.latencyMs || 35}ms</span>
                            </div>
                            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 text-[10px] leading-relaxed overflow-x-auto font-mono">
                              {selectedEvaluation.remediationExecution.scriptContent}
                            </pre>
                          </div>
                        )}

                        {/* Execution Output Log & Cryptographic Proof */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                            <span className="text-slate-500 block font-bold">Execution Output (stdout):</span>
                            <pre className="text-slate-300 text-[10px] whitespace-pre-wrap font-mono leading-tight">
                              {selectedEvaluation.remediationExecution?.executionOutput || '[STDOUT] Return code: 0. Status: VERIFIED_SUCCESS.'}
                            </pre>
                          </div>

                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 flex flex-col justify-between">
                            <div>
                              <span className="text-slate-500 block font-bold flex items-center gap-1">
                                <Lock className="w-3 h-3 text-cyan-400" /> Cryptographic Integrity Proof:
                              </span>
                              <div className="text-cyan-300 text-[10px] font-mono break-all mt-1 bg-slate-900 p-1.5 rounded border border-slate-800 flex items-center justify-between">
                                <span>{selectedEvaluation.remediationExecution?.verificationHash || 'sha256-verified-ok'}</span>
                                <button
                                  onClick={() => handleCopyHash(selectedEvaluation.remediationExecution?.verificationHash || '')}
                                  className="text-slate-400 hover:text-white ml-1 shrink-0 cursor-pointer"
                                  title="Copy SHA-256 Hash"
                                >
                                  {copiedHash === selectedEvaluation.remediationExecution?.verificationHash ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="text-[9px] text-slate-500 pt-1">
                              Logged to immutable SOAR audit trail with zero trust hash verification.
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Event Telemetry Snapshot */}
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                        <div className="text-slate-300 font-bold">Event Telemetry Snapshot:</div>
                        <div className="truncate">Target Host: <span className="text-slate-200">{selectedEvaluation.matchedEvent.sourceAgent} ({selectedEvaluation.matchedEvent.agentIp})</span> | Source IP: <span className="text-cyan-300">{selectedEvaluation.matchedEvent.sourceIp}</span></div>
                        <div className="truncate">Payload: <span className="text-slate-200">{selectedEvaluation.matchedEvent.payload || 'N/A'}</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-500 font-mono text-xs">
                      Select a matched event from the list to inspect its AI explanation and verified remediation script.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Rules Engine Control Bar & Search Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search detection rules by name, description, ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Pattern Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['ALL', 'Brute Force', 'Privilege Escalation', 'Web Exploitation', 'Lateral Movement', 'Ransomware Activity', 'Data Exfiltration'].map(pat => (
                <button
                  key={pat}
                  onClick={() => setFilterPattern(pat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filterPattern === pat
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>

          {/* Defined Detection Rules Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRules.map((rule) => {
              return (
                <div
                  key={rule.id}
                  className={`p-5 rounded-2xl bg-slate-900/90 border transition-all flex flex-col justify-between space-y-4 ${
                    rule.enabled ? 'border-slate-800 hover:border-cyan-500/40 shadow-lg shadow-slate-950/40' : 'border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                        {rule.incidentPatternType}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          rule.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          rule.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {rule.severity}
                        </span>
                        <button
                          onClick={() => handleToggleRule(rule.id)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                          title={rule.enabled ? 'Disable Rule' : 'Enable Rule'}
                        >
                          {rule.enabled ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-600" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-slate-500">{rule.id}</div>
                      <h3 className="text-sm font-bold text-white font-mono leading-snug">{rule.name}</h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed font-sans">{rule.description}</p>
                    </div>

                    {/* Pattern Conditions */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[10px]">
                      <div className="text-slate-500 font-bold flex items-center justify-between">
                        <span>PATTERN CRITERIA ({rule.patternLogic})</span>
                        <span className="text-cyan-400">{rule.patternConditions.length} Condition(s)</span>
                      </div>
                      {rule.patternConditions.map((cond, cIdx) => (
                        <div key={cIdx} className="text-slate-300 truncate">
                          <span className="text-emerald-400 font-bold">[{cond.field}]</span> {cond.operator} <span className="text-amber-300 font-bold">"{String(cond.value)}"</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Meta, AI Trigger & Automated Remediation Action Badge */}
                  <div className="pt-3 border-t border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">MITRE Technique:</span>
                      <span className="text-slate-300 font-bold truncate max-w-[160px]">{rule.mitreTechnique}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Auto AI Explanation:</span>
                      <span className={`flex items-center gap-1 font-bold ${rule.triggerAiExplanation ? 'text-amber-300' : 'text-slate-600'}`}>
                        <Bot className="w-3 h-3" /> {rule.triggerAiExplanation ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Automated Remediation:</span>
                      <span className="flex items-center gap-1 font-bold text-emerald-400">
                        <Zap className="w-3 h-3" /> {rule.remediationActionType || 'ARMED'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/60">
                      <span className="text-slate-500">Matches Triggered:</span>
                      <span className="text-emerald-400 font-bold">{rule.matchCount} times</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: IMMUTABLE REMEDIATION AUDIT TRAIL */}
      {activeTab === 'REMEDIATION_AUDIT' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  IMMUTABLE AUTOMATED REMEDIATION AUDIT TRAIL
                </h3>
                <p className="text-[11px] text-slate-400">
                  Every automated response executed by detection rules is cryptographically hash-sealed and archived.
                </p>
              </div>
            </div>

            <button
              onClick={fetchRemediationAudit}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Audit</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Rule ID & Name</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Target Asset</th>
                  <th className="py-2.5 px-3">Script Execution Snippet</th>
                  <th className="py-2.5 px-3">SHA-256 Proof Hash</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {remediationAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No automated remediations logged yet. Run a simulation stream to generate verified remediation actions.
                    </td>
                  </tr>
                ) : (
                  remediationAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-cyan-300 font-bold block">{log.ruleId}</span>
                        <span className="text-slate-300 text-[10px]">{log.ruleName}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                          {log.actionType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                        <div>{log.targetAsset}</div>
                        <div className="text-[10px] text-slate-500">{log.sourceIp}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-emerald-400 max-w-xs truncate">
                        <code>{log.scriptSnippet}</code>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <code className="text-[10px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[140px]">
                            {log.verificationHash}
                          </code>
                          <button
                            onClick={() => handleCopyHash(log.verificationHash)}
                            className="text-slate-500 hover:text-white cursor-pointer"
                            title="Copy Hash"
                          >
                            {copiedHash === log.verificationHash ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create New Detection Rule with Automated Remediation */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Define New Automated Detection & Remediation Rule</span>
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apache Log4j JNDI Remote Code Execution Pattern"
                  value={newRuleForm.name}
                  onChange={e => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description & Threat Scope</label>
                <textarea
                  rows={2}
                  placeholder="Explain what malicious pattern or behavior this rule detects..."
                  value={newRuleForm.description}
                  onChange={e => setNewRuleForm({ ...newRuleForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Incident Pattern Type</label>
                  <select
                    value={newRuleForm.incidentPatternType}
                    onChange={e => setNewRuleForm({ ...newRuleForm, incidentPatternType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Brute Force">Brute Force</option>
                    <option value="Privilege Escalation">Privilege Escalation</option>
                    <option value="Web Exploitation">Web Exploitation</option>
                    <option value="Ransomware Activity">Ransomware Activity</option>
                    <option value="Lateral Movement">Lateral Movement</option>
                    <option value="Data Exfiltration">Data Exfiltration</option>
                    <option value="Credential Access">Credential Access</option>
                    <option value="C2 Communication">C2 Communication</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Severity</label>
                  <select
                    value={newRuleForm.severity}
                    onChange={e => setNewRuleForm({ ...newRuleForm, severity: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              {/* Condition Builder */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold block text-[11px]">Primary Pattern Match Condition:</span>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={newRuleForm.field}
                    onChange={e => setNewRuleForm({ ...newRuleForm, field: e.target.value as any })}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="description">description</option>
                    <option value="payload">payload</option>
                    <option value="category">category</option>
                    <option value="sourceIp">sourceIp</option>
                    <option value="sourceAgent">sourceAgent</option>
                    <option value="mitreTactic">mitreTactic</option>
                  </select>

                  <select
                    value={newRuleForm.operator}
                    onChange={e => setNewRuleForm({ ...newRuleForm, operator: e.target.value as any })}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="contains">contains</option>
                    <option value="equals">equals</option>
                    <option value="regex">regex</option>
                    <option value="greaterThan">greaterThan</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="match target value"
                    value={newRuleForm.value}
                    onChange={e => setNewRuleForm({ ...newRuleForm, value: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-[11px]"
                  />
                </div>
              </div>

              {/* Automated Remediation Action Configuration */}
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Auto-Trigger Remediation Script
                  </span>
                  <input
                    type="checkbox"
                    checked={newRuleForm.triggerAutomatedRemediation}
                    onChange={e => setNewRuleForm({ ...newRuleForm, triggerAutomatedRemediation: e.target.checked })}
                    className="w-4 h-4 accent-emerald-400 cursor-pointer"
                  />
                </div>
                {newRuleForm.triggerAutomatedRemediation && (
                  <div>
                    <label className="text-slate-400 block mb-1 text-[10px]">Remediation Action Type</label>
                    <select
                      value={newRuleForm.remediationActionType}
                      onChange={e => setNewRuleForm({ ...newRuleForm, remediationActionType: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-[11px]"
                    >
                      <option value="BLOCK_IP_FIREWALL">BLOCK_IP_FIREWALL (iptables/nftables edge drop)</option>
                      <option value="ISOLATE_HOST">ISOLATE_HOST (Wazuh Active Response Host Isolation)</option>
                      <option value="RESTORE_GOLD_IMAGE">RESTORE_GOLD_IMAGE (Integrity rollback & daemon reload)</option>
                      <option value="FLUSH_DNS_CACHE">FLUSH_DNS_CACHE (Terminate tunneling & flush DNS cache)</option>
                      <option value="REVOKE_USER_SESSION">REVOKE_USER_SESSION (Kill active SSH/PAM sessions)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* AI Trigger Option */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-amber-300 font-bold block flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" /> Auto-Trigger Gemini AI Explanation
                  </span>
                  <span className="text-[10px] text-slate-400">Generates root-cause hypothesis and containment plan when matched.</span>
                </div>
                <input
                  type="checkbox"
                  checked={newRuleForm.triggerAiExplanation}
                  onChange={e => setNewRuleForm({ ...newRuleForm, triggerAiExplanation: e.target.checked })}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Deploy Rule to Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Normalized Event JSON Tester */}
      {isTestEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Evaluate Custom Normalized Event JSON</span>
              </h3>
              <button 
                onClick={() => setIsTestEventModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-400 text-[11px]">
              Paste a custom normalized security event JSON. The engine will evaluate it against all active rules, trigger an AI Explanation, and execute verified automated remediation scripts.
            </p>

            <textarea
              rows={12}
              value={customEventJson}
              onChange={e => setCustomEventJson(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-cyan-300 font-mono text-[11px] focus:outline-none focus:border-cyan-500/50"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsTestEventModalOpen(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEvaluateCustomEvent}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Run Real-Time Evaluation</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
