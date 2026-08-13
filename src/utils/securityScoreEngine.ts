import { 
  ThreatItem, IncidentItem, VulnerabilityItem, AssetItem, SecurityToolItem 
} from '../types/cybersecurity';

export interface SecurityScoreBreakdown {
  totalScore: number; // 0 - 100
  threatExposureScore: number; // Max 25
  incidentRiskScore: number; // Max 25
  vulnerabilityPostureScore: number; // Max 25
  assetHealthScore: number; // Max 15
  toolAvailabilityScore: number; // Max 10
  statusLabel: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'CRITICAL';
  factors: {
    activeCriticalThreats: number;
    activeHighThreats: number;
    openCriticalIncidents: number;
    openHighIncidents: number;
    unpatchedCriticalVulns: number;
    unpatchedHighVulns: number;
    highRiskAssets: number;
    degradedOrOfflineTools: number;
  };
}

export function calculateSecurityHealthScore(
  threats: ThreatItem[] = [],
  incidents: IncidentItem[] = [],
  vulnerabilities: VulnerabilityItem[] = [],
  assets: AssetItem[] = [],
  tools: SecurityToolItem[] = []
): SecurityScoreBreakdown {
  // 1. Active Threats (Max 25 points)
  const activeCriticalThreats = threats.filter(t => t.status !== 'RESOLVED' && t.status !== 'BLOCKED' && t.severity === 'CRITICAL').length;
  const activeHighThreats = threats.filter(t => t.status !== 'RESOLVED' && t.status !== 'BLOCKED' && t.severity === 'HIGH').length;
  const threatDeduction = (activeCriticalThreats * 6) + (activeHighThreats * 3);
  const threatExposureScore = Math.max(0, 25 - threatDeduction);

  // 2. Open Incidents (Max 25 points)
  const openCriticalIncidents = incidents.filter(i => i.status !== 'RESOLVED' && i.severity === 'CRITICAL').length;
  const openHighIncidents = incidents.filter(i => i.status !== 'RESOLVED' && i.severity === 'HIGH').length;
  const incidentDeduction = (openCriticalIncidents * 7) + (openHighIncidents * 4);
  const incidentRiskScore = Math.max(0, 25 - incidentDeduction);

  // 3. Vulnerability Posture (Max 25 points)
  const unpatchedCriticalVulns = vulnerabilities.filter(v => v.remediationStatus !== 'PATCHED' && v.severity === 'CRITICAL').length;
  const unpatchedHighVulns = vulnerabilities.filter(v => v.remediationStatus !== 'PATCHED' && v.severity === 'HIGH').length;
  const vulnDeduction = (unpatchedCriticalVulns * 5) + (unpatchedHighVulns * 2.5);
  const vulnerabilityPostureScore = Math.max(0, 25 - vulnDeduction);

  // 4. Asset Health (Max 15 points)
  const highRiskAssets = assets.filter(a => a.riskScore > 70).length;
  const assetDeduction = highRiskAssets * 3;
  const assetHealthScore = Math.max(0, 15 - assetDeduction);

  // 5. Tool Availability (Max 10 points)
  const degradedOrOfflineTools = tools.filter(t => t.healthStatus === 'Degraded' || t.healthStatus === 'Offline' || t.healthStatus === 'Warning').length;
  const toolDeduction = degradedOrOfflineTools * 2.5;
  const toolAvailabilityScore = Math.max(0, 10 - toolDeduction);

  const totalScore = Math.round(
    threatExposureScore + incidentRiskScore + vulnerabilityPostureScore + assetHealthScore + toolAvailabilityScore
  );

  let statusLabel: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'CRITICAL' = 'EXCELLENT';
  if (totalScore < 60) statusLabel = 'CRITICAL';
  else if (totalScore < 75) statusLabel = 'FAIR';
  else if (totalScore < 90) statusLabel = 'GOOD';

  return {
    totalScore,
    threatExposureScore: Math.round(threatExposureScore),
    incidentRiskScore: Math.round(incidentRiskScore),
    vulnerabilityPostureScore: Math.round(vulnerabilityPostureScore),
    assetHealthScore: Math.round(assetHealthScore),
    toolAvailabilityScore: Math.round(toolAvailabilityScore),
    statusLabel,
    factors: {
      activeCriticalThreats,
      activeHighThreats,
      openCriticalIncidents,
      openHighIncidents,
      unpatchedCriticalVulns,
      unpatchedHighVulns,
      highRiskAssets,
      degradedOrOfflineTools
    }
  };
}
