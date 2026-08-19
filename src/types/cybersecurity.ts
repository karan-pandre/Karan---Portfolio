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

export interface NormalizedEvent {
  eventId: string;
  timestamp: string;
  sourceAgent: string;
  agentIp: string;
  sourceIp: string;
  wazuhRuleId?: number | string;
  wazuhLevel?: number;
  category?: 'Authentication' | 'System Integrity' | 'Web Application' | 'Network Traffic' | 'Malware' | 'Privilege Escalation' | 'Data Exfiltration' | 'Cloud Audit';
  description: string;
  payload?: string;
  mitreTactic: string;
  mitreTechnique: string;
  normalizedSeverity: ThreatSeverity;
  rawLog?: string;
}

export interface DetectionPatternCondition {
  field: 'sourceIp' | 'description' | 'category' | 'wazuhLevel' | 'payload' | 'mitreTactic' | 'normalizedSeverity' | 'sourceAgent';
  operator: 'equals' | 'contains' | 'regex' | 'greaterThan' | 'in';
  value: string | number | string[];
}

export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  patternConditions: DetectionPatternCondition[];
  patternLogic: 'AND' | 'OR';
  incidentPatternType: 'Brute Force' | 'Privilege Escalation' | 'Web Exploitation' | 'Ransomware Activity' | 'Data Exfiltration' | 'Lateral Movement' | 'Credential Access' | 'C2 Communication';
  severity: ThreatSeverity;
  mitreTactic: string;
  mitreTechnique: string;
  action: 'PROMOTE_TO_THREAT' | 'PROMOTE_TO_INCIDENT' | 'AUTO_ISOLATE_HOST' | 'ALERT_ONLY';
  triggerAiExplanation: boolean;
  triggerAutomatedRemediation?: boolean;
  remediationActionType?: 'ISOLATE_HOST' | 'BLOCK_IP_FIREWALL' | 'REVOKE_USER_SESSION' | 'KILL_PROCESS_TREE' | 'RESTORE_GOLD_IMAGE' | 'FLUSH_DNS_CACHE' | 'CUSTOM_SCRIPT';
  enabled: boolean;
  matchCount: number;
  lastTriggered?: string;
}

export interface RemediationExecutionResult {
  id: string;
  actionType: string;
  scriptLanguage: 'bash' | 'powershell' | 'ansible' | 'wazuh_ar';
  scriptContent: string;
  targetAsset: string;
  targetIp?: string;
  executionOutput: string;
  exitCode: number;
  verificationHash: string;
  timestamp: string;
  status: 'VERIFIED_SUCCESS' | 'FAILED';
  latencyMs?: number;
}

export interface RemediationAuditLogEntry {
  id: string;
  timestamp: string;
  ruleId: string;
  ruleName: string;
  patternType: string;
  actionType: string;
  targetAsset: string;
  sourceIp: string;
  scriptLanguage: string;
  scriptSnippet: string;
  verificationHash: string;
  status: 'VERIFIED_SUCCESS' | 'FAILED';
  executedBy: string;
  latencyMs: number;
}

export interface RuleEvaluationResult {
  id: string;
  ruleId: string;
  ruleName: string;
  incidentPatternType: string;
  matchedEvent: NormalizedEvent;
  timestamp: string;
  severity: ThreatSeverity;
  action: string;
  triggeredAi: boolean;
  aiExplanationState: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  aiExplanation?: {
    summary: string;
    threatActorHypothesis: string;
    riskLevel: string;
    recommendedResponse: string[];
    mitreRef: string;
    confidenceScore?: number;
  };
  triggeredRemediation?: boolean;
  remediationState?: 'IDLE' | 'EXECUTING' | 'VERIFIED_SUCCESS' | 'FAILED';
  remediationExecution?: RemediationExecutionResult;
  promotedThreat?: ThreatItem;
  promotedIncident?: IncidentItem;
}

export type NotificationCategory = 'CRITICAL_ALERT' | 'REMEDIATION_ACTION' | 'DETECTION_RULE' | 'SECURITY_INTEL' | 'SYSTEM_HEALTH';

export interface SocNotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  category: NotificationCategory;
  severity: ThreatSeverity;
  read: boolean;
  pinned?: boolean;
  targetTab?: string;
  targetId?: string;
  metadata?: {
    sourceIp?: string;
    targetAsset?: string;
    ruleId?: string;
    hash?: string;
    cve?: string;
  };
}

export interface NotificationPreferences {
  soundEnabled: boolean;
  toastDuration: number; // 3, 5, 10, or 0 (sticky)
  dndMode: boolean;
  categories: {
    CRITICAL_ALERT: boolean;
    REMEDIATION_ACTION: boolean;
    DETECTION_RULE: boolean;
    SECURITY_INTEL: boolean;
    SYSTEM_HEALTH: boolean;
  };
}

