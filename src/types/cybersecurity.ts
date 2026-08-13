export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ThreatStatus = 'BLOCKED' | 'INVESTIGATING' | 'QUARANTINED' | 'MONITORING' | 'RESOLVED';
export type IncidentStatus = 'DETECTED' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
export type RemediationStatus = 'PATCHED' | 'MITIGATION_APPLIED' | 'PENDING_PATCH' | 'UNDER_REVIEW';

export type FeatureClassification = 
  | 'REAL INTEGRATED' 
  | 'REAL APPLICATION LOGIC' 
  | 'DEMO / SIMULATION' 
  | 'NOT CONFIGURED' 
  | 'UNKNOWN';

export type IntegrationState = 'REGISTERED' | 'CONFIGURED' | 'CONNECTED' | 'NOT_CONFIGURED';

export interface ThreatItem {
  id: string;
  type: string;
  severity: ThreatSeverity;
  sourceIp: string;
  targetSystem: string;
  timestamp: string;
  status: ThreatStatus;
  detectionMethod: string;
  payloadSample?: string;
  mitreTactic?: string;
  description: string;
  provenance?: {
    source: string;
    recordId: string;
    ruleId: string;
    environment: 'LIVE' | 'DEMO';
  };
}

export interface IncidentItem {
  id: string;
  title: string;
  severity: ThreatSeverity;
  status: IncidentStatus;
  assignedAnalyst: string;
  detectionTime: string;
  lastUpdated: string;
  description: string;
  affectedAssets: string[];
  containmentSteps: string[];
  auditLogs: { timestamp: string; action: string; author: string }[];
}

export interface VulnerabilityItem {
  id: string; // CVE ID
  name: string;
  cvssScore: number;
  severity: ThreatSeverity;
  affectedSystem: string;
  detectionDate: string;
  remediationStatus: RemediationStatus;
  description: string;
  cweCategory?: string;
  solutionLink?: string;
}

export interface SecurityToolItem {
  id: string;
  name: string;
  category: 'Network Security' | 'SIEM & Monitoring' | 'Endpoint Security' | 'Cloud Security' | 'Offensive Security' | 'Endpoint Protection' | 'Vulnerability Management';
  purpose: string;
  skillLevel: 'Expert' | 'Advanced' | 'Intermediate' | 'Foundational';
  status: 'In Portfolio' | 'Practical Lab Usage' | 'Enterprise Deployment' | 'Certified';
  description: string;
  iconName?: string;
  vendor?: string;
  version?: string;
  healthStatus?: 'Healthy' | 'Degraded' | 'Offline' | 'Warning';
  lastSync?: string;
  integrationType?: string;
  integrationState?: IntegrationState;
  apiConfigured?: boolean;
  autoRemediationEnabled?: boolean;
  eventsCount24h?: number;
  apiEndpoint?: string;
}

export interface CyberProjectItem {
  id: string;
  name: string;
  description: string;
  objective: string;
  technologies: string[];
  tools: string[];
  architectureSummary: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  status: 'Completed' | 'Active Lab' | 'Production';
  demonstratedSkills: string[];
  keyOutcomes: string[];
}

export interface CyberLabItem {
  id: string;
  name: string;
  platform: 'TryHackMe' | 'HackTheBox' | 'Cisco NetAcad' | 'PortSwigger Academy' | 'Custom SOC Lab';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  category: 'Web Exploitation' | 'Network Forensics' | 'SOC Analysis' | 'Active Directory' | 'Malware Analysis';
  dateCompleted: string;
  skillsPracticed: string[];
  toolsUsed: string[];
  notes: string;
  status: 'Completed' | 'In Progress';
}

export interface CyberReportItem {
  id: string;
  title: string;
  type: 'Vulnerability Assessment' | 'Incident Post-Mortem' | 'Network Security Audit' | 'Lab Write-up' | 'Compliance Review';
  author: string;
  date: string;
  executiveSummary: string;
  criticalFindingsCount: number;
  highFindingsCount: number;
  mediumFindingsCount: number;
  status: 'Published' | 'Draft' | 'Under Review';
  fullContent?: string;
}

export interface AssetItem {
  id: string;
  name: string;
  type: 'Server' | 'Endpoint' | 'Network Device' | 'Cloud Resource' | 'Database' | 'Critical Infrastructure';
  ipAddress: string;
  os: string;
  owner: string;
  health: 'Healthy' | 'At Risk' | 'Critical' | 'Isolated';
  riskScore: number; // 0 - 100
  openVulnerabilitiesCount: number;
  activeThreatsCount: number;
  lastSeen: string;
  location?: string;
  macAddress?: string;
}

export type PersonaRole = 'Analyst' | 'CISO' | 'Engineer' | 'Auditor';

export interface CyberCertItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  status: 'Active' | 'In Progress' | 'Target';
  progressPercentage: number;
  skillsVerified: string[];
}

export interface CyberAuthUser {
  username: string;
  email: string;
  role: 'SOC Administrator' | 'Lead Threat Hunter' | 'Security Analyst';
  lastLogin: string;
}
