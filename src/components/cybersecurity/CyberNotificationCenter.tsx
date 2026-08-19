import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Search, 
  Filter, 
  Pin, 
  PinOff, 
  ExternalLink, 
  Flame, 
  Zap, 
  Cpu, 
  Globe, 
  Activity, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Sliders, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SocNotificationItem, 
  NotificationCategory, 
  NotificationPreferences, 
  ThreatSeverity 
} from '../../types/cybersecurity';
import { soundFx } from '../../utils/soundEffects';

interface CyberNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SocNotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
  onTogglePin: (id: string) => void;
  onNavigateToTab: (tabId: string, targetId?: string) => void;
  preferences: NotificationPreferences;
  onUpdatePreferences: (newPrefs: Partial<NotificationPreferences>) => void;
  onTriggerSimulatedAlert?: (category: NotificationCategory) => void;
}

export const CyberNotificationCenter: React.FC<CyberNotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onTogglePin,
  onNavigateToTab,
  preferences,
  onUpdatePreferences,
  onTriggerSimulatedAlert
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'UNREAD' | NotificationCategory>('ALL');
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<'ALL' | ThreatSeverity>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Category Icon & Color Mapping
  const getCategoryMeta = (cat: NotificationCategory) => {
    switch (cat) {
      case 'CRITICAL_ALERT':
        return {
          label: 'Critical Alert',
          icon: Flame,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          badgeBg: 'bg-rose-500/20 text-rose-300'
        };
      case 'REMEDIATION_ACTION':
        return {
          label: 'SOAR Remediation',
          icon: Zap,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          badgeBg: 'bg-emerald-500/20 text-emerald-300'
        };
      case 'DETECTION_RULE':
        return {
          label: 'Detection Engine',
          icon: Cpu,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          badgeBg: 'bg-amber-500/20 text-amber-300'
        };
      case 'SECURITY_INTEL':
        return {
          label: 'Threat Intel',
          icon: Globe,
          color: 'text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          badgeBg: 'bg-purple-500/20 text-purple-300'
        };
      case 'SYSTEM_HEALTH':
      default:
        return {
          label: 'System Telemetry',
          icon: Activity,
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          badgeBg: 'bg-cyan-500/20 text-cyan-300'
        };
    }
  };

  const getSeverityBadge = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'LOW':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Copy hash or IP to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    soundFx.playCyberBlip();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((item) => {
        // Category / Read status filter
        if (activeCategoryFilter === 'UNREAD') {
          if (item.read) return false;
        } else if (activeCategoryFilter !== 'ALL') {
          if (item.category !== activeCategoryFilter) return false;
        }

        // Severity filter
        if (activeSeverityFilter !== 'ALL' && item.severity !== activeSeverityFilter) {
          return false;
        }

        // Text Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchMsg = item.message.toLowerCase().includes(query);
          const matchIp = item.metadata?.sourceIp?.toLowerCase().includes(query);
          const matchRule = item.metadata?.ruleId?.toLowerCase().includes(query);
          const matchAsset = item.metadata?.targetAsset?.toLowerCase().includes(query);
          const matchCve = item.metadata?.cve?.toLowerCase().includes(query);
          return matchTitle || matchMsg || matchIp || matchRule || matchAsset || matchCve;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned first, then by timestamp descending
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [notifications, activeCategoryFilter, activeSeverityFilter, searchQuery]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-Over Notification Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0a0f1d] border-l border-emerald-500/20 shadow-2xl flex flex-col font-sans text-slate-100"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-[#0d1424] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white flex items-center justify-center shadow-lg shadow-rose-950/60 animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold font-mono text-white">
                      SOC NOTIFICATION CENTER
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE STREAM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''} • {notifications.length} total cached
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                {/* Preferences Toggle Button */}
                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    setIsSettingsOpen(!isSettingsOpen);
                  }}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isSettingsOpen 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Notification Preferences"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {/* Mark All Read */}
                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    onMarkAllAsRead();
                  }}
                  disabled={unreadCount === 0}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300 disabled:opacity-40 transition-all cursor-pointer"
                  title="Mark All as Read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>

                {/* Close Drawer */}
                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    onClose();
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Close Notification Center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PREFERENCES SETTINGS SUB-PANEL */}
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-950 border-b border-slate-800/80 p-4 space-y-3 font-mono text-xs overflow-hidden"
                >
                  <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800/60 pb-2">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Sliders className="w-3.5 h-3.5" /> NOTIFICATION PREFERENCES & ROUTING
                    </span>
                    <button
                      onClick={() => setIsSettingsOpen(false)}
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    {/* Sound Alert Toggle */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-slate-200 block font-bold">Audio Alerts</span>
                        <span className="text-[10px] text-slate-500">Play cyber blip on events</span>
                      </div>
                      <button
                        onClick={() => {
                          soundFx.playCyberBlip();
                          onUpdatePreferences({ soundEnabled: !preferences.soundEnabled });
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          preferences.soundEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {preferences.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Do Not Disturb (DND) */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-slate-200 block font-bold">Do Not Disturb (DND)</span>
                        <span className="text-[10px] text-slate-500">Suppress popup banners</span>
                      </div>
                      <button
                        onClick={() => {
                          soundFx.playCyberBlip();
                          onUpdatePreferences({ dndMode: !preferences.dndMode });
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          preferences.dndMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {preferences.dndMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Test Alert Simulator Bar */}
                  {onTriggerSimulatedAlert && (
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
                      <div className="text-[10px] font-bold text-cyan-300 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Quick Simulate Alert Event:
                        </span>
                        <span className="text-slate-500 font-normal">Test live routing</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => {
                            soundFx.playCyberBlip();
                            onTriggerSimulatedAlert('CRITICAL_ALERT');
                          }}
                          className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold cursor-pointer"
                        >
                          + Critical Ransomware
                        </button>
                        <button
                          onClick={() => {
                            soundFx.playCyberBlip();
                            onTriggerSimulatedAlert('REMEDIATION_ACTION');
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold cursor-pointer"
                        >
                          + SOAR Firewall Drop
                        </button>
                        <button
                          onClick={() => {
                            soundFx.playCyberBlip();
                            onTriggerSimulatedAlert('DETECTION_RULE');
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold cursor-pointer"
                        >
                          + Rule Pattern Match
                        </button>
                        <button
                          onClick={() => {
                            soundFx.playCyberBlip();
                            onTriggerSimulatedAlert('SECURITY_INTEL');
                          }}
                          className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-bold cursor-pointer"
                        >
                          + Zero-Day CVE
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search & Filter Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-800/80 space-y-2.5 bg-[#080d19] font-mono text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter alerts by keyword, IP, rule ID, hash..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500/50 text-[11px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    setActiveCategoryFilter('ALL');
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryFilter === 'ALL'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All ({notifications.length})
                </button>

                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    setActiveCategoryFilter('UNREAD');
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryFilter === 'UNREAD'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Unread ({unreadCount})
                </button>

                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    setActiveCategoryFilter('CRITICAL_ALERT');
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryFilter === 'CRITICAL_ALERT'
                      ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Critical Alerts ({notifications.filter(n => n.category === 'CRITICAL_ALERT').length})
                </button>

                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    setActiveCategoryFilter('REMEDIATION_ACTION');
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryFilter === 'REMEDIATION_ACTION'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  SOAR Actions ({notifications.filter(n => n.category === 'REMEDIATION_ACTION').length})
                </button>

                <button
                  onClick={() => {
                    soundFx.playCyberBlip();
                    setActiveCategoryFilter('DETECTION_RULE');
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryFilter === 'DETECTION_RULE'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Detection Rules ({notifications.filter(n => n.category === 'DETECTION_RULE').length})
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 text-center space-y-3 font-mono text-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center mx-auto">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div className="text-slate-400 font-bold">No Notifications Found</div>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      No security alerts match your current filter criteria or query.
                    </p>
                  </motion.div>
                ) : (
                  filteredNotifications.map((item) => {
                    const catMeta = getCategoryMeta(item.category);
                    const IconComponent = catMeta.icon;
                    const sevBadge = getSeverityBadge(item.severity);

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, x: 20 }}
                        className={`p-4 rounded-2xl border transition-all space-y-2.5 relative ${
                          !item.read
                            ? 'bg-slate-900/95 border-slate-700/80 shadow-lg shadow-slate-950/50'
                            : 'bg-slate-950/60 border-slate-800/60 opacity-85 hover:opacity-100'
                        } ${item.pinned ? 'border-amber-500/40 bg-slate-900/90 ring-1 ring-amber-500/20' : ''}`}
                      >
                        {/* Unread Glow Indicator */}
                        {!item.read && (
                          <span className="absolute top-4 left-2 w-2 h-2 rounded-full bg-cyan-400 shadow-md shadow-cyan-400 animate-pulse" />
                        )}

                        {/* Top Meta Bar */}
                        <div className="flex items-center justify-between pl-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 ${catMeta.badgeBg} border ${catMeta.border}`}>
                              <IconComponent className="w-3 h-3" />
                              <span>{catMeta.label}</span>
                            </span>

                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${sevBadge}`}>
                              {item.severity}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>

                            {/* Pin Button */}
                            <button
                              onClick={() => {
                                soundFx.playCyberBlip();
                                onTogglePin(item.id);
                              }}
                              className={`p-1 rounded hover:text-white transition-colors cursor-pointer ${
                                item.pinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                              }`}
                              title={item.pinned ? 'Unpin Alert' : 'Pin to Top'}
                            >
                              {item.pinned ? <Pin className="w-3.5 h-3.5 fill-amber-400" /> : <Pin className="w-3.5 h-3.5" />}
                            </button>

                            {/* Delete Single Notification */}
                            <button
                              onClick={() => {
                                soundFx.playCyberBlip();
                                onDeleteNotification(item.id);
                              }}
                              className="p-1 rounded text-slate-600 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Dismiss Alert"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="pl-2 space-y-1">
                          <h4 className={`text-xs font-bold font-mono leading-snug ${!item.read ? 'text-white' : 'text-slate-200'}`}>
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                            {item.message}
                          </p>
                        </div>

                        {/* Metadata Tag Chips */}
                        {item.metadata && (
                          <div className="pl-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                            {item.metadata.sourceIp && (
                              <div className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 flex items-center gap-1">
                                <span className="text-slate-500">IP:</span>
                                <span>{item.metadata.sourceIp}</span>
                                <button
                                  onClick={() => handleCopy(item.metadata!.sourceIp!)}
                                  className="text-slate-500 hover:text-white ml-0.5 cursor-pointer"
                                  title="Copy IP"
                                >
                                  {copiedHash === item.metadata.sourceIp ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                                </button>
                              </div>
                            )}

                            {item.metadata.ruleId && (
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300">
                                Rule: {item.metadata.ruleId}
                              </span>
                            )}

                            {item.metadata.targetAsset && (
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-purple-300">
                                Host: {item.metadata.targetAsset}
                              </span>
                            )}

                            {item.metadata.cve && (
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-rose-300 font-bold">
                                {item.metadata.cve}
                              </span>
                            )}

                            {item.metadata.hash && (
                              <div className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-300 flex items-center gap-1 truncate max-w-xs">
                                <span className="text-slate-500">Hash:</span>
                                <span className="truncate">{item.metadata.hash}</span>
                                <button
                                  onClick={() => handleCopy(item.metadata!.hash!)}
                                  className="text-slate-500 hover:text-white ml-0.5 shrink-0 cursor-pointer"
                                  title="Copy Hash"
                                >
                                  {copiedHash === item.metadata.hash ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bottom Actions Bar */}
                        <div className="pl-2 pt-2 border-t border-slate-800/60 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <button
                              onClick={() => {
                                soundFx.playCyberBlip();
                                onMarkAsRead(item.id);
                              }}
                              className="text-slate-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              <span>{item.read ? 'Mark as Unread' : 'Mark as Read'}</span>
                            </button>
                          </div>

                          {item.targetTab && (
                            <button
                              onClick={() => {
                                soundFx.playCyberBlip();
                                onNavigateToTab(item.targetTab!, item.targetId);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold transition-all cursor-pointer"
                            >
                              <span>Navigate to View</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#080d19] flex items-center justify-between font-mono text-xs">
              <button
                onClick={() => {
                  soundFx.playCyberBlip();
                  onClearAll();
                }}
                disabled={notifications.length === 0}
                className="text-slate-400 hover:text-rose-400 disabled:opacity-40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Notifications</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playCyberBlip();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold cursor-pointer transition-all"
              >
                Close Drawer
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
