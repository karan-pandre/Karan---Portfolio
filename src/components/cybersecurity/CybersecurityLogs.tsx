import React, { useState, useEffect, useMemo } from 'react';
import { Terminal, Search, Filter, RefreshCw, Download, Shield, AlertTriangle, Eye, CheckCircle2, Play, Pause, Copy, Check } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export interface SIEMLogItem {
  id: string;
  timestamp: string;
  index: string;
  sourceType: string;
  host: string;
  severity: 'EMERGENCY' | 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
  actionTaken: string;
  rawLog: string;
  parsedFields: {
    srcIp: string;
    destPort: number;
    user?: string;
    signatureId?: string;
    cve?: string;
  };
}

const INITIAL_SIEM_LOGS: SIEMLogItem[] = [
  {
    id: 'log-8001',
    timestamp: '2026-08-10T10:14:02.120Z',
    index: 'secops_fw',
    sourceType: 'paloalto:pan:threat',
    host: 'fw-edge-us-east-01',
    severity: 'CRITICAL',
    actionTaken: 'DROP_PACKET',
    rawLog: '2026-08-10T10:14:02.120Z fw-edge-us-east-01 PaloAlto THREAT vulnerability(10921) src=192.168.1.105 dst=10.0.0.12 proto=TCP sport=49152 dport=22 risk=CRITICAL action=drop msg="SSH Brute Force Attack detected (142 attempts/sec)"',
    parsedFields: {
      srcIp: '192.168.1.105',
      destPort: 22,
      user: 'root',
      signatureId: 'CVE-2024-38077',
      cve: 'CVE-2024-38077'
    }
  },
  {
    id: 'log-8002',
    timestamp: '2026-08-10T10:13:48.890Z',
    index: 'secops_web',
    sourceType: 'nginx:access:kv',
    host: 'web-prod-alb-02',
    severity: 'CRITICAL',
    actionTaken: 'WAF_BLOCK_403',
    rawLog: '2026-08-10T10:13:48.890Z web-prod-alb-02 nginx: 185.220.101.5 - - [10/Aug/2026:10:13:48 +0000] "GET /api/v1/auth?user=admin\'%20OR%201=1-- HTTP/1.1" 403 280 "-" "Mozilla/5.0" waf_rule=SQLI_ATTACK_01',
    parsedFields: {
      srcIp: '185.220.101.5',
      destPort: 443,
      user: 'admin',
      signatureId: 'SQLI-OR-1=1',
      cve: 'CVE-2023-22515'
    }
  },
  {
    id: 'log-8003',
    timestamp: '2026-08-10T10:12:15.410Z',
    index: 'secops_auth',
    sourceType: 'linux:auth:syslog',
    host: 'k8s-master-node-01',
    severity: 'HIGH',
    actionTaken: 'MFA_CHALLENGE_FAILED',
    rawLog: '2026-08-10T10:12:15.410Z k8s-master-node-01 sshd[18492]: Failed password for invalid user oracle from 45.33.21.110 port 50212 ssh2',
    parsedFields: {
      srcIp: '45.33.21.110',
      destPort: 22,
      user: 'oracle',
      signatureId: 'SSH-INVALID-USER'
    }
  },
  {
    id: 'log-8004',
    timestamp: '2026-08-10T10:10:02.005Z',
    index: 'secops_endpoint',
    sourceType: 'suricata:alert:json',
    host: 'workstation-dev-88',
    severity: 'EMERGENCY',
    actionTaken: 'HOST_ISOLATE_EDR',
    rawLog: '2026-08-10T10:10:02.005Z workstation-dev-88 CrowdStrike EDR: Malware execution detected process="powershell.exe -enc JABzAD0..." parent="winword.exe" sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    parsedFields: {
      srcIp: '10.0.1.88',
      destPort: 4444,
      user: 'developer',
      signatureId: 'EDR-POWERSHELL-RANSOMWARE',
      cve: 'CVE-2024-21412'
    }
  },
  {
    id: 'log-8005',
    timestamp: '2026-08-10T10:08:33.720Z',
    index: 'secops_cloud',
    sourceType: 'aws:cloudtrail:json',
    host: 'aws-us-east-1-audit',
    severity: 'WARNING',
    actionTaken: 'IAM_POLICY_AUDIT',
    rawLog: '2026-08-10T10:08:33.720Z aws-us-east-1-audit CloudTrail: eventName=AttachUserPolicy user=karan.pandre policyArn=arn:aws:iam::aws:policy/AdministratorAccess userAgent="aws-cli/2.15.0"',
    parsedFields: {
      srcIp: '72.14.201.2',
      destPort: 443,
      user: 'karan.pandre',
      signatureId: 'IAM-ADMIN-ELEVATION'
    }
  },
  {
    id: 'log-8006',
    timestamp: '2026-08-10T10:05:11.100Z',
    index: 'secops_fw',
    sourceType: 'cisco:asa:syslog',
    host: 'router-border-01',
    severity: 'INFO',
    actionTaken: 'PERMIT',
    rawLog: '2026-08-10T10:05:11.100Z router-border-01 CiscoASA %ASA-6-302013: Built outbound TCP connection 9042 for outside:10.0.1.50/49152 to inside:10.0.0.5/80',
    parsedFields: {
      srcIp: '10.0.1.50',
      destPort: 80,
      user: 'system'
    }
  }
];

export const CybersecurityLogs: React.FC = () => {
  const [logs, setLogs] = useState<SIEMLogItem[]>(INITIAL_SIEM_LOGS);
  const [splQuery, setSplQuery] = useState<string>('index=secops* | sort -_time');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<SIEMLogItem | null>(INITIAL_SIEM_LOGS[0]);
  const [isAutoStreaming, setIsAutoStreaming] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live streaming new SIEM log events simulation
  useEffect(() => {
    if (!isAutoStreaming) return;

    const interval = setInterval(() => {
      const randomIps = ['192.168.1.105', '185.220.101.5', '45.33.21.110', '198.51.100.42', '10.0.2.14'];
      const severities: ('EMERGENCY' | 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO')[] = ['CRITICAL', 'HIGH', 'WARNING', 'INFO'];
      const pickSeverity = severities[Math.floor(Math.random() * severities.length)];
      const pickIp = randomIps[Math.floor(Math.random() * randomIps.length)];
      const idStr = `log-${Math.floor(Math.random() * 9000 + 1000)}`;

      const newLog: SIEMLogItem = {
        id: idStr,
        timestamp: new Date().toISOString(),
        index: 'secops_fw',
        sourceType: 'suricata:realtime:telemetry',
        host: 'sensor-us-east-edge',
        severity: pickSeverity,
        actionTaken: pickSeverity === 'CRITICAL' ? 'AUTOMATED_CISCO_ACL_BLOCK' : 'SYSLOG_INGEST',
        rawLog: `${new Date().toISOString()} sensor-us-east-edge Suricata IDS: [1:200129:4] Real-time anomaly src=${pickIp} dport=443 severity=${pickSeverity}`,
        parsedFields: {
          srcIp: pickIp,
          destPort: 443,
          signatureId: 'SURICATA-RT-01'
        }
      };

      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoStreaming]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (selectedSeverity !== 'ALL' && log.severity !== selectedSeverity) return false;
      if (splQuery.trim()) {
        const queryLower = splQuery.toLowerCase();
        // Simple search query match inside raw log or index
        if (queryLower.startsWith('index=')) {
          const idxVal = queryLower.replace('index=', '').split(' ')[0].replace('*', '');
          if (!log.index.toLowerCase().includes(idxVal)) return false;
        } else {
          return (
            log.rawLog.toLowerCase().includes(queryLower) ||
            log.severity.toLowerCase().includes(queryLower) ||
            log.index.toLowerCase().includes(queryLower) ||
            log.parsedFields.srcIp.includes(queryLower)
          );
        }
      }
      return true;
    });
  }, [logs, splQuery, selectedSeverity]);

  const handleCopyRawLog = (logStr: string, id: string) => {
    soundFx.playCyberBlip();
    navigator.clipboard.writeText(logStr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    soundFx.playSuccess();
    const csvHeader = 'Timestamp,Index,SourceType,Host,Severity,Action,RawLog\n';
    const csvRows = filteredLogs.map(l => 
      `"${l.timestamp}","${l.index}","${l.sourceType}","${l.host}","${l.severity}","${l.actionTaken}","${l.rawLog.replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spl_siem_logs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 rounded-2xl bg-[#070b14] border border-emerald-500/30 text-slate-100 space-y-4 font-mono shadow-2xl relative">
      
      {/* Splunk-inspired SPL Search Header */}
      <div className="space-y-3 bg-[#0d1322] p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              SPLUNK SIEM REAL-TIME TELEMETRY LOG INSPECTOR
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              SPL SEARCH
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                soundFx.playCyberBlip();
                setIsAutoStreaming(!isAutoStreaming);
              }}
              className={`px-3 py-1 rounded-lg border font-bold flex items-center gap-1.5 ${
                isAutoStreaming ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isAutoStreaming ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isAutoStreaming ? 'LIVE STREAM' : 'STREAM PAUSED'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 font-bold"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* SPL Query Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3" />
          <input
            type="text"
            value={splQuery}
            onChange={(e) => setSplQuery(e.target.value)}
            placeholder="SPL Query: index=secops* sourcetype=paloalto severity=CRITICAL"
            className="w-full pl-9 pr-24 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-xs font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => soundFx.playCyberBlip()}
            className="absolute right-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px]"
          >
            EXECUTE SPL
          </button>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Severity:
          </span>
          {['ALL', 'EMERGENCY', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'].map(sev => (
            <button
              key={sev}
              onClick={() => {
                soundFx.playCyberBlip();
                setSelectedSeverity(sev);
              }}
              className={`px-2.5 py-0.5 rounded-md font-bold transition-all ${
                selectedSeverity === sev
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
          <span className="ml-auto text-slate-500 text-[10px]">Showing {filteredLogs.length} events</span>
        </div>
      </div>

      {/* Main Content: High Density Data Grid + Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* High-Density Log Table (2 Cols) */}
        <div className="lg:col-span-2 bg-[#050811] border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0 uppercase font-bold">
                <tr>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Severity</th>
                  <th className="py-2 px-3">Index / Source</th>
                  <th className="py-2 px-3">Src IP</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLogs.map(log => {
                  const isSelected = selectedLog?.id === log.id;
                  const severityBadgeClass = 
                    log.severity === 'EMERGENCY' || log.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : log.severity === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700';

                  return (
                    <tr
                      key={log.id}
                      onClick={() => {
                        soundFx.playCyberBlip();
                        setSelectedLog(log);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-950/40 border-l-2 border-emerald-400' : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                        {log.timestamp.slice(11, 19)}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${severityBadgeClass}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300 whitespace-nowrap">
                        <span className="text-emerald-400">{log.index}</span>
                        <span className="text-slate-500 text-[10px] block">{log.sourceType}</span>
                      </td>
                      <td className="py-2 px-3 text-cyan-300 font-bold whitespace-nowrap">
                        {log.parsedFields.srcIp}
                      </td>
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                          {log.actionTaken}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Log Inspector Panel (1 Col) */}
        {selectedLog && (
          <div className="bg-[#050811] border border-emerald-500/30 rounded-xl p-4 space-y-3 text-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" /> Event Field Inspector
                </span>
                <button
                  onClick={() => handleCopyRawLog(selectedLog.rawLog, selectedLog.id)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 font-bold"
                >
                  {copiedId === selectedLog.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === selectedLog.id ? 'Copied' : 'Copy Log'}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">Raw Telemetry Event Line</span>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-emerald-300 font-mono break-all leading-relaxed">
                    {selectedLog.rawLog}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Host Endpoint:</span>
                    <span className="text-white font-bold">{selectedLog.host}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Source IP:</span>
                    <span className="text-cyan-300 font-bold">{selectedLog.parsedFields.srcIp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destination Port:</span>
                    <span className="text-amber-300 font-bold">{selectedLog.parsedFields.destPort}</span>
                  </div>
                  {selectedLog.parsedFields.signatureId && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Signature ID:</span>
                      <span className="text-rose-400 font-bold">{selectedLog.parsedFields.signatureId}</span>
                    </div>
                  )}
                  {selectedLog.parsedFields.cve && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">CVE Reference:</span>
                      <span className="text-rose-400 font-bold underline">{selectedLog.parsedFields.cve}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Suricata Rule Matched. Suricata + Cisco ACL auto-mitigation verified.</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
