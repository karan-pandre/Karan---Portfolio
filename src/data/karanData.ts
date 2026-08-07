import { WorkExperience, Project, Certification, SkillGroup, Education, SQLDataset } from '../types';

export const PERSONAL_INFO = {
  name: 'Karan Pandre',
  fullLegalName: 'Karan Umaji Pandre',
  title: 'Cybersecurity Analyst & Network Security Specialist',
  targetProgram: 'Cybersecurity & SOC Analyst (L1) Portfolio',
  avatar: '/karan_profile.jpg',
  tagline: 'Securing digital infrastructure through Network Defense, Packet Analysis (Wireshark), SIEM Log Triage, Cisco Packet Tracer, and Security Automation.',
  location: 'Bangalore, India',
  phone: '+91 96115 56402',
  email: 'karanpandre3@gmail.com',
  linkedin: 'https://linkedin.com/in/karanpandre3',
  github: 'https://github.com/karanpandre3',
  cgpa: '7.7 / 10.0',
  languages: ['English (Professional)', 'Hindi (Professional)', 'Kannada (Professional)', 'Marathi (Professional)'],
  bio: 'B.Tech Information Technology graduate (2025) with foundational expertise in Cybersecurity, Network Security, Packet Analysis (Wireshark), and Log Auditing. Certified by Google Cybersecurity, Cisco Networking Academy, and IBM OS Security. Experienced in Cisco Packet Tracer network simulation, firewall ACL configuration, Linux/Windows CLI, Python security scripting, and SOC triage workflows.',
};

export const WORK_EXPERIENCES: WorkExperience[] = [
  {
    id: 'cisco-2024',
    role: 'Cybersecurity Virtual Intern',
    company: 'Cisco Networking Academy',
    location: 'Remote',
    period: 'May 2024 – Jul 2024',
    type: 'Virtual Internship',
    summary: 'Simulated enterprise network topologies, configured firewall ACLs, VLAN isolation, and delivered comprehensive security audit reports.',
    bullets: [
      'Designed and simulated multi-tier enterprise network topologies using Cisco Packet Tracer, implementing routers, layer-3 switches, and firewalls.',
      'Configured 802.1Q VLAN trunking and strict Access Control Lists (ACLs) to segregate administrative, server, and guest traffic segments.',
      'Performed packet inspection and protocol analysis using Wireshark to identify unencrypted traffic and open vulnerable ports (FTP/Telnet).',
      'Submitted a detailed vulnerability assessment report with severity rankings, risk ratings, and recommended remediation countermeasures.',
    ],
    skills: ['Cisco Packet Tracer', 'VLAN Segmentation', 'Firewall ACLs', 'Wireshark', 'Vulnerability Assessment', 'Network Defense', 'TCP/IP Protocols'],
  },
  {
    id: 'pw-2025',
    role: 'Senior Associate (Data & Security Operations)',
    company: 'Physics Wallah',
    location: 'Bangalore, India',
    period: 'Apr 2025 – Present',
    type: 'Full-time',
    summary: 'Overseeing lead data protection, system access controls, data integrity auditing, and operational risk management.',
    bullets: [
      'Enforced strict Role-Based Access Control (RBAC) and data protection protocols across 50,000+ student lead records to prevent PII exposure.',
      'Conducted weekly access log audits and user permissions reviews to detect anomalies and enforce least-privilege principles.',
      'Automated operational lead validation pipelines using Python scripts, ensuring data sanitization and preventing SQL injection vectors.',
      'Collaborated with cross-functional IT and management teams to handle operational incident escalations and maintain system reliability.',
    ],
    skills: ['Data Protection & RBAC', 'Log Auditing', 'Python Scripting', 'Incident Escalation', 'System Access Control', 'Risk Mitigation'],
  },
  {
    id: 'infosys-2024',
    role: 'Data Analyst Intern',
    company: 'Infosys',
    location: 'Remote',
    period: 'Sep 2024 – Feb 2025',
    type: 'Internship',
    summary: 'Audited enterprise SQL databases, verified system metrics integrity, and designed KPI monitoring dashboards.',
    bullets: [
      'Engineered SQL scripts to query and audit system event logs, verifying database integrity and identifying anomalous transaction patterns.',
      'Created Power BI security and performance dashboards monitoring database health, pipeline latencies, and access metrics.',
      'Automated data cleaning and validation routines with Python to filter malicious string inputs and bad data formatting.',
    ],
    skills: ['SQL Log Auditing', 'Power BI Dashboards', 'Data Validation', 'Python', 'ETL Verification', 'Database Security'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'network-security',
    title: 'Enterprise Network Defense & Vulnerability Assessment',
    subtitle: 'Vulnerability Audit, Firewall ACL Implementation & Wireshark Packet Inspection',
    category: 'Cybersecurity',
    techStack: ['Cisco Packet Tracer', 'Wireshark', 'TCP/IP', 'VLAN 802.1Q', 'Firewall ACLs'],
    description: 'Designed a secure 3-tier enterprise campus network topology in Cisco Packet Tracer. Conducted a vulnerability assessment identifying open administrative ports (Telnet 23), missing VLAN isolation, and unauthorized inter-department traffic. Deployed ACL policies and SSH encryption to secure the network.',
    highlights: [
      'Constructed complete 3-tier network topology featuring Core, Distribution, and Access layer switches.',
      'Implemented strict ACL policies and 802.1Q VLAN trunking to segregate administrative, faculty, and student traffic.',
      'Captured and analyzed TCP handshakes and ICMP bursts using Wireshark to verify packet filtering rules.',
      'Produced a formal vulnerability remediation report submitted to Cisco Networking Academy evaluators.',
    ],
    metrics: [
      { label: 'Vulnerabilities Remediated', value: '3 Critical' },
      { label: 'Network Segments', value: '4 VLANs' },
      { label: 'Access Control Rules', value: '24 ACLs' },
      { label: 'Traffic Isolation', value: '100% Verified' },
    ],
    codeSnippet: {
      language: 'bash',
      title: 'Cisco Router ACL & VLAN Security Configuration',
      code: `! Step 1: Create VLANs for Network Segmentation
vlan 10
 name ADMIN_SECURE_NET
vlan 20
 name GUEST_STUDENT_NET
exit

! Step 2: Extended ACL to Block Guest Access to Admin Subnet & Log Violations
ip access-list extended SECURE_ADMIN_ACL
 deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255 log
 deny tcp any 192.168.10.0 0.0.0.255 eq 23 log  ! Block Unencrypted Telnet
 permit ip any any

! Step 3: Apply ACL to Subinterface with 802.1Q Trunking
interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
 ip access-group SECURE_ADMIN_ACL in`,
    },
    featured: true,
  },
  {
    id: 'soc-log-analyzer',
    title: 'SOC SIEM Log Analyzer & Threat Parser',
    subtitle: 'Automated Python Log Audit, Brute-Force Detection & Alerting System',
    category: 'Cybersecurity',
    techStack: ['Python', 'RegEx', 'Linux Syslog', 'SQL', 'Security Audit'],
    description: 'Built a lightweight Python security log parser that simulates SOC SIEM log ingestion. Scans Linux authentication logs (`/var/log/auth.log`) and web server logs to detect SSH brute-force attempts, unauthorized privilege escalations, and SQL injection patterns.',
    highlights: [
      'Parsed over 100,000+ raw syslog entries in real-time using RegEx pattern matching.',
      'Flagged IP addresses attempting >5 failed logins within 60 seconds and generated automated incident tickets.',
      'Correlated web request headers to detect SQL injection payloads (UNION SELECT, OR 1=1).',
    ],
    metrics: [
      { label: 'Log Ingestion Rate', value: '10K events/sec' },
      { label: 'Threat Patterns', value: '12 RegEx Rules' },
      { label: 'Brute-Force Detection', value: '100% Accuracy' },
    ],
    codeSnippet: {
      language: 'python',
      title: 'Python Threat Parser - SSH Brute-Force & SQLi Detector',
      code: `import re
from collections import defaultdict

# RegEx patterns for security threats
FAILED_PASSWORD_PATTERN = r"Failed password for .* from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
SQLI_PATTERN = r"(?i)(UNION\s+SELECT|OR\s+1=1|--|DROP\s+TABLE)"

def analyze_soc_logs(log_file_path):
    failed_attempts = defaultdict(int)
    detected_threats = []

    with open(log_file_path, 'r') as log_file:
        for line in log_file:
            # Check SSH Brute Force
            match = re.search(FAILED_PASSWORD_PATTERN, line)
            if match:
                ip = match.group(1)
                failed_attempts[ip] += 1
                if failed_attempts[ip] >= 5:
                    detected_threats.append(f"[ALERT] SSH Brute-Force from IP: {ip} ({failed_attempts[ip]} failures)")
            
            # Check SQL Injection
            if re.search(SQLI_PATTERN, line):
                detected_threats.append(f"[CRITICAL] SQL Injection Payload Detected in line: {line.strip()}")

    return detected_threats`,
    },
    featured: true,
  },
  {
    id: 'packet-sniffer-tool',
    title: 'Network Traffic & Protocol Inspector',
    subtitle: 'Python Packet Header Capture & Port Audit Utility',
    category: 'Cybersecurity',
    techStack: ['Python', 'Socket Library', 'Scapy', 'Linux CLI', 'Network Protocols'],
    description: 'Developed a custom Python network inspection script to capture live Ethernet frames, decode IP/TCP/UDP packet headers, and identify clear-text transmission of credentials across unencrypted HTTP/FTP connections.',
    highlights: [
      'Unpacked raw binary network packets to extract Source IP, Destination IP, Port, and Payload.',
      'Built port scanner module to identify open listening ports and active network sockets on host machines.',
      'Generated summary charts of top bandwidth-consuming protocols across local network interfaces.',
    ],
    metrics: [
      { label: 'Protocols Parsed', value: 'TCP / UDP / ICMP' },
      { label: 'Capture Speed', value: '<2ms per packet' },
      { label: 'Port Audit Range', value: '1 - 1024' },
    ],
    featured: true,
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'google-cybersecurity',
    title: 'Foundations of Cybersecurity',
    issuer: 'Google (via Coursera)',
    date: 'Nov 2023',
    verifyUrl: 'https://coursera.org/verify/Q24UVF9W4NC8',
    category: 'Google & Coursera',
    badgeColor: 'bg-emerald-600',
    skills: ['SIEM Tools', 'Network Security Protocols', 'Security Compliance', 'Linux Systems', 'Asset Defense'],
  },
  {
    id: 'cisco-virtual-internship',
    title: 'Cisco AICTE Virtual Internship Program in Cybersecurity & Networking',
    issuer: 'Cisco Networking Academy',
    date: 'Jul 2024',
    verifyUrl: 'https://netacad.com',
    category: 'Cybersecurity',
    badgeColor: 'bg-cyan-700',
    skills: ['Simulated Network Security', 'VLAN Segmentation', 'Firewalls & ACLs', 'Vulnerability Auditing'],
  },
  {
    id: 'cisco-cybersecurity-essentials',
    title: 'Cybersecurity Essentials',
    issuer: 'Cisco Networking Academy',
    date: 'Jul 2024',
    verifyUrl: 'https://netacad.com',
    category: 'Cybersecurity',
    badgeColor: 'bg-emerald-700',
    skills: ['Threat Countermeasures', 'CIA Triad', 'Cryptography Basics', 'Legal & Regulatory Frameworks'],
  },
  {
    id: 'cisco-packet-tracer',
    title: 'Introduction to Packet Tracer',
    issuer: 'Cisco Networking Academy',
    date: 'Jul 2024',
    verifyUrl: 'https://netacad.com',
    category: 'Cybersecurity',
    badgeColor: 'bg-teal-600',
    skills: ['Packet Tracer Simulation', 'Topology Design', 'Router/Switch CLI Config', 'Subnetting'],
  },
  {
    id: 'ibm-os-security',
    title: 'Operating Systems: Overview, Administration, and Security',
    issuer: 'IBM (via Coursera)',
    date: 'Nov 2024',
    verifyUrl: 'https://coursera.org/verify/B1ZKCCG00PGF',
    category: 'Management & Productivity',
    badgeColor: 'bg-slate-700',
    skills: ['OS Hardening', 'Access Control Lists', 'System Administration', 'Security Policies'],
  },
  {
    id: 'google-tech-support',
    title: 'Technical Support Fundamentals',
    issuer: 'Google (via Coursera)',
    date: 'Mar 2024',
    verifyUrl: 'https://coursera.org/verify/B64V36PPC6MT',
    category: 'Google & Coursera',
    badgeColor: 'bg-indigo-600',
    skills: ['Network Troubleshooting', 'Hardware Diagnostics', 'DNS & IPv4/IPv6', 'OS Administration'],
  },
  {
    id: 'google-os-poweruser',
    title: 'Operating Systems and You: Becoming a Power User',
    issuer: 'Google (via Coursera)',
    date: 'Nov 2023',
    verifyUrl: 'https://coursera.org/verify/VZTF73TU7JU7',
    category: 'Google & Coursera',
    badgeColor: 'bg-amber-600',
    skills: ['Windows PowerShell', 'Linux Bash Shell', 'Process Monitoring', 'File Permissions'],
  },
  {
    id: 'google-data-science',
    title: 'Foundations of Data Science',
    issuer: 'Google (via Coursera)',
    date: 'Nov 2023',
    verifyUrl: 'https://coursera.org/verify/ZT89W7QT2ZZS',
    category: 'Google & Coursera',
    badgeColor: 'bg-blue-600',
    skills: ['Data Analysis', 'Python Scripting', 'Data Ethics', 'System Log Evaluation'],
  },
  {
    id: 'ibm-project-management',
    title: 'Introduction to Project Management',
    issuer: 'IBM (via Coursera)',
    date: 'Nov 2023',
    verifyUrl: 'https://coursera.org/verify/JAH96AUSYLRU',
    category: 'Management & Productivity',
    badgeColor: 'bg-blue-700',
    skills: ['Project Governance', 'Agile & Scrum', 'Risk Management', 'Documentation'],
  },
  {
    id: 'infosys-powerbi',
    title: 'Learning Microsoft Power BI',
    issuer: 'Infosys Springboard',
    date: 'Feb 2025',
    verifyUrl: 'https://verify.onwingspan.com',
    category: 'Data & BI',
    badgeColor: 'bg-yellow-600',
    skills: ['Power BI Desktop', 'DAX Measures', 'Power Query', 'Security Metrics'],
  },
  {
    id: 'infosys-bi-intro',
    title: 'Introduction to Business Intelligence',
    issuer: 'Infosys Springboard',
    date: 'Apr 2025',
    verifyUrl: 'https://verify.onwingspan.com',
    category: 'Data & BI',
    badgeColor: 'bg-amber-600',
    skills: ['BI Architecture', 'Data Quality', 'KPI Monitoring'],
  },
  {
    id: 'infosys-agile',
    title: 'Software Engineering and Agile Development',
    issuer: 'Infosys Springboard',
    date: 'Aug 2024',
    verifyUrl: 'https://verify.onwingspan.com',
    category: 'Management & Productivity',
    badgeColor: 'bg-cyan-600',
    skills: ['Agile Ceremonies', 'Scrum', 'Incident Workflows'],
  },
  {
    id: 'uw-ml-regression',
    title: 'Machine Learning: Regression',
    issuer: 'University of Washington (via Coursera)',
    date: 'Oct 2023',
    verifyUrl: 'https://coursera.org/verify/8BHMNBDZNJA5',
    category: 'Data & BI',
    badgeColor: 'bg-purple-600',
    skills: ['Linear Regression', 'Ridge & Lasso', 'Gradient Descent', 'Model Evaluation'],
  },
  {
    id: 'uw-ml-foundations',
    title: 'Machine Learning Foundations: A Case Study Approach',
    issuer: 'University of Washington (via Coursera)',
    date: 'Nov 2023',
    verifyUrl: 'https://coursera.org/verify/EXLNMK6WS5EX',
    category: 'Data & BI',
    badgeColor: 'bg-purple-700',
    skills: ['Classification', 'Clustering', 'Recommender Systems', 'Predictive Modeling'],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Network Defense & Infrastructure',
    iconName: 'ShieldCheck',
    skills: [
      { name: 'Cisco Packet Tracer & Topology Design', level: 90, description: 'Simulating 3-tier enterprise networks, switch/router CLI configuration, VLAN trunking' },
      { name: 'Packet Analysis & Wireshark', level: 88, description: 'Capturing & analyzing TCP/UDP/IP headers, decoding HTTP/DNS, identifying clear-text risks' },
      { name: 'Firewalls & Access Control Lists (ACLs)', level: 85, description: 'Standard & extended IPv4 ACL rules, port filtering, perimeter defense' },
      { name: 'TCP/IP, OSI Model & Subnetting', level: 92, description: 'IPv4/IPv6 addressing, CIDR, DNS, DHCP, NAT, Routing Protocols' },
    ],
  },
  {
    category: 'SOC & Security Operations (Target Focus)',
    iconName: 'Terminal',
    skills: [
      { name: 'SIEM Log Analysis & Ingestion', level: 85, description: 'Splunk/ELK concepts, parsing Syslogs, authentication event monitoring' },
      { name: 'Threat Detection & Incident Triage', level: 82, description: 'Identifying SSH brute-force, SQL injection payloads, port scans, suspicious IPs' },
      { name: 'Vulnerability Assessment & Audit', level: 86, description: 'Evaluating system weaknesses, open port audits, risk rating & remediation reporting' },
      { name: 'Security Frameworks (CIA, NIST, MITRE)', level: 84, description: 'Understanding threat vectors, cyber kill chain, compliance baselines' },
    ],
  },
  {
    category: 'Operating Systems & System Hardening',
    iconName: 'Code2',
    skills: [
      { name: 'Linux Bash Shell & Systems Admin', level: 88, description: 'File permissions (chmod/chown), process management, system monitoring commands' },
      { name: 'Windows Administration & PowerShell', level: 85, description: 'Event Viewer, User Rights Assignment, Active Directory concepts' },
      { name: 'Role-Based Access Control (RBAC)', level: 90, description: 'Enforcing least-privilege policies and access log auditing' },
    ],
  },
  {
    category: 'Security Automation & Programming',
    iconName: 'Code2',
    skills: [
      { name: 'Python for Security Scripting', level: 86, description: 'Log parsing with RegEx, automated threat reporting, socket networking scripts' },
      { name: 'SQL for Audit & Log Queries', level: 90, description: 'Querying database security logs, identifying unauthorized edits, data validation' },
    ],
  },
  {
    category: 'Technical Support & Networking Troubleshooting',
    iconName: 'Briefcase',
    skills: [
      { name: 'Network Troubleshooting Tools', level: 92, description: 'ping, traceroute, nslookup, netstat, nmap basics, arp' },
      { name: 'Hardware & OS Diagnostics', level: 90, description: 'System recovery, network adapter config, troubleshooting client connectivity' },
    ],
  },
];

export const EDUCATION: Education = {
  degree: 'B.Tech in Information Technology',
  field: 'Information Technology & Cybersecurity Systems',
  institution: 'Alliance University',
  location: 'Bangalore, India',
  period: '2021 – 2025',
  score: 'CGPA: 7.7 / 10.0',
  courses: [
    'Computer Networks & Security Protocols',
    'Database Management Systems & Security',
    'Operating Systems & System Hardening',
    'Data Structures & Algorithms',
    'Software Engineering & Agile Methodologies',
    'Information & Data Security',
  ],
};

export const SAMPLE_SQL_DATASETS: SQLDataset[] = [
  {
    name: 'security_event_logs',
    description: 'SOC Security Log Dataset tracking login attempts, firewall events, and intrusion alerts.',
    defaultQuery: 'SELECT event_type, severity, COUNT(log_id) AS total_events, COUNT(DISTINCT src_ip) AS unique_ips FROM security_event_logs GROUP BY event_type, severity ORDER BY total_events DESC;',
    columns: ['log_id', 'timestamp', 'src_ip', 'dest_port', 'event_type', 'severity', 'action_taken'],
    rows: [
      { log_id: 'LOG-8001', timestamp: '2026-08-06 04:12:01', src_ip: '192.168.1.105', dest_port: 22, event_type: 'SSH Brute-Force Attempt', severity: 'HIGH', action_taken: 'IP Blocked (ACL Rule)' },
      { log_id: 'LOG-8002', timestamp: '2026-08-06 04:15:33', src_ip: '10.0.4.12', dest_port: 80, event_type: 'SQL Injection Payload', severity: 'CRITICAL', action_taken: 'WAF Blocked & Ticketed' },
      { log_id: 'LOG-8003', timestamp: '2026-08-06 04:18:20', src_ip: '192.168.1.201', dest_port: 443, event_type: 'Authorized SSL Session', severity: 'LOW', action_taken: 'Permitted' },
      { log_id: 'LOG-8004', timestamp: '2026-08-06 04:22:45', src_ip: '172.16.0.44', dest_port: 23, event_type: 'Unencrypted Telnet Attempt', severity: 'MEDIUM', action_taken: 'Denied by Router ACL' },
      { log_id: 'LOG-8005', timestamp: '2026-08-06 04:30:10', src_ip: '192.168.1.110', dest_port: 53, event_type: 'DNS Query Burst', severity: 'INFORMATIONAL', action_taken: 'Logged' },
    ],
  },
  {
    name: 'network_vulnerability_audit',
    description: 'Vulnerability scan results across enterprise campus endpoints.',
    defaultQuery: 'SELECT severity, cve_id, COUNT(host_ip font) AS affected_hosts, remediation_status FROM network_vulnerability_audit GROUP BY severity, cve_id ORDER BY affected_hosts DESC;',
    columns: ['audit_id', 'host_ip', 'cve_id', 'service_name', 'severity', 'remediation_status'],
    rows: [
      { audit_id: 'AUD-101', host_ip: '192.168.10.5', cve_id: 'CVE-2023-4863', service_name: 'OpenSSH v7.4 (Weak Cipher)', severity: 'HIGH', remediation_status: 'Patch Applied' },
      { audit_id: 'AUD-102', host_ip: '192.168.20.12', cve_id: 'CVE-2021-34527', service_name: 'Windows Print Spooler', severity: 'CRITICAL', remediation_status: 'Disabled Service' },
      { audit_id: 'AUD-103', host_ip: '192.168.10.1', cve_id: 'N/A', service_name: 'Telnet Port 23 Open', severity: 'MEDIUM', remediation_status: 'Migrated to SSH v2' },
      { audit_id: 'AUD-104', host_ip: '192.168.30.50', cve_id: 'CVE-2022-22965', service_name: 'Spring Framework Remote Code Exec', severity: 'CRITICAL', remediation_status: 'Remediated' },
    ],
  },
];

