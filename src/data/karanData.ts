import { WorkExperience, Project, Certification, SkillGroup, Education, SQLDataset } from '../types';

export const PERSONAL_INFO = {
  name: 'Karan Pandre',
  fullLegalName: 'Karan Umaji Pandre',
  title: 'Business Analyst & Data Analytics Professional',
  targetProgram: 'Data Analytics & Business Intelligence Portfolio',
  avatar: '/karan_profile.jpg',
  tagline: 'Transforming complex data into actionable business strategy, campaign ROI, and secure digital infrastructure.',
  location: 'Bangalore, India',
  phone: '+91 96115 56402',
  email: 'karanpandre3@gmail.com',
  linkedin: 'https://linkedin.com/in/karanpandre3',
  github: 'https://github.com/karanpandre3',
  cgpa: '7.7 / 10.0',
  languages: ['English (Professional)', 'Hindi (Professional)', 'Kannada (Professional)', 'Marathi (Professional)'],
  bio: 'B.Tech Information Technology graduate (2025) currently working at Physics Wallah, analyzing campaign performance, building dashboards, and translating business requirements into actionable insights. Hands-on experience with SQL databases, Power BI, Python, and Cisco network security simulated environments.',
};

export const WORK_EXPERIENCES: WorkExperience[] = [
  {
    id: 'pw-2025',
    role: 'Senior Associate',
    company: 'Physics Wallah',
    location: 'Bangalore, India',
    period: 'Apr 2025 – Present',
    type: 'Full-time',
    summary: 'Driving marketing execution, lead conversion analytics, campaign optimization, and cross-functional team management.',
    bullets: [
      'Collaborate with academic, counselling, and sales teams to ensure seamless execution of marketing initiatives and achievement of enrolment targets.',
      'Analyze campaign performance, lead conversion metrics, and market trends to optimize marketing strategies and improve ROI.',
      'Mentor and support team members in lead management, communication strategies, and marketing execution to improve overall team performance.',
      'Manage end-to-end marketing campaigns, including lead generation, follow-ups, conversion tracking, and stakeholder engagement, contributing to increased admissions and revenue growth.',
      'Conducted market research and competitor analysis to identify growth opportunities, optimize marketing strategies, and strengthen regional market presence.',
    ],
    skills: ['Campaign Analytics', 'ROI Optimization', 'Lead Conversion Tracking', 'Stakeholder Engagement', 'Market Research', 'Project Management'],
  },
  {
    id: 'infosys-2024',
    role: 'Data Analyst Intern',
    company: 'Infosys',
    location: 'Remote',
    period: 'Sep 2024 – Feb 2025',
    type: 'Internship',
    summary: 'Analyzed large structured datasets, built interactive Power BI dashboards, and automated business reporting.',
    bullets: [
      'Analyzed and transformed structured datasets using SQL, Excel, and Power BI to generate actionable business insights.',
      'Designed interactive dashboards and automated reports to monitor KPIs, identify trends, and support data-driven decision-making.',
      'Performed data cleaning, validation, and visualization to improve data quality and deliver accurate analytical reports.',
    ],
    skills: ['SQL', 'Power BI', 'DAX', 'Data Cleaning', 'KPI Dashboards', 'Excel Power Query', 'ETL'],
  },
  {
    id: 'cisco-2024',
    role: 'Cybersecurity Virtual Intern',
    company: 'Cisco Networking Academy',
    location: 'Remote',
    period: 'May 2024 – Jul 2024',
    type: 'Virtual Internship',
    summary: 'Simulated network topologies, applied firewall & VLAN security rules, and produced security risk reports.',
    bullets: [
      'Configured and secured simulated networks in Cisco Packet Tracer — applied firewall rules, VLAN segmentation, and access control policies across structured lab exercises.',
      'Performed vulnerability assessments on simulated environments; submitted a structured security findings report with risk ratings and remediation recommendations.',
    ],
    skills: ['Cisco Packet Tracer', 'VLAN Segmentation', 'Firewall Rules', 'Vulnerability Assessment', 'Log Analysis', 'Network Security'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'marketing-dashboard',
    title: 'Marketing Campaign Performance Dashboard',
    subtitle: 'End-to-End Campaign Analytics & Conversion Funnel Pipeline',
    category: 'Data Analytics',
    techStack: ['Power BI', 'Python (Pandas)', 'MySQL', 'MS Excel', 'DAX'],
    description: 'Designed an interactive Power BI campaign tracking dashboard with DAX measures, slicers, and drill-throughs to evaluate 5 key campaign KPIs (CTR, Conversions, ROI, Reach, Engagement). Cleaned and segmented user lead data using Python Pandas and SQL window functions.',
    highlights: [
      'Built custom DAX formulas for dynamic ROI and conversion tracking across multi-channel campaigns.',
      'Automated data cleaning pipeline using Python Pandas and SQL subqueries for multi-source lead consolidation.',
      'Generated executive pivot summaries and interactive slicers for stakeholder reporting at Physics Wallah.',
    ],
    metrics: [
      { label: 'Campaigns Tracked', value: '50+' },
      { label: 'Conversion Rate Boost', value: '+18.4%' },
      { label: 'ROI Tracking Precision', value: '99.2%' },
      { label: 'DAX Measures Created', value: '15+' },
    ],
    codeSnippet: {
      language: 'sql',
      title: 'Campaign Lead Segmentation & Conversion Query',
      code: `SELECT 
  campaign_name,
  channel,
  SUM(impressions) AS total_impressions,
  SUM(clicks) AS total_clicks,
  ROUND(SUM(clicks) * 100.0 / NULLIF(SUM(impressions), 0), 2) AS ctr_percentage,
  SUM(conversions) AS total_conversions,
  ROUND(SUM(spend_inr), 2) AS total_spend,
  ROUND(SUM(revenue_generated) - SUM(spend_inr), 2) AS net_profit,
  ROUND(((SUM(revenue_generated) - SUM(spend_inr)) / NULLIF(SUM(spend_inr), 0)) * 100, 2) AS roi_percentage
FROM campaign_logs
WHERE campaign_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
GROUP BY campaign_name, channel
HAVING total_clicks > 100
ORDER BY roi_percentage DESC;`,
    },
    featured: true,
  },
  {
    id: 'network-security',
    title: 'Campus Network Security Assessment',
    subtitle: 'Vulnerability Audit, Firewall Rule Implementation & Log Analysis',
    category: 'Cybersecurity',
    techStack: ['Cisco Packet Tracer', 'Wireshark Log Analysis', 'TCP/IP', 'VLAN Segmentation'],
    description: 'Mapped a simulated university network topology in Cisco Packet Tracer. Identified 3 critical security vulnerabilities including open administrative ports, missing VLAN isolation, and weak access control lists (ACLs).',
    highlights: [
      'Constructed complete 3-tier network topology featuring Core, Distribution, and Access layer switches.',
      'Implemented strict ACL policies and 802.1Q VLAN trunking to segregate administrative, faculty, and student traffic.',
      'Produced a formal vulnerability remediation report submitted to Cisco Networking Academy evaluators.',
    ],
    metrics: [
      { label: 'Vulnerabilities Remediated', value: '3 Critical' },
      { label: 'Network Segments', value: '4 VLANs' },
      { label: 'Access Control Rules', value: '24 ACLs' },
    ],
    codeSnippet: {
      language: 'bash',
      title: 'Cisco Packet Tracer Router ACL & VLAN Config',
      code: `! Configure VLAN 10 (Admin) and VLAN 20 (Students)
vlan 10
 name ADMIN_NET
vlan 20
 name STUDENT_NET
exit

! Access Control List to restrict Student access to Admin Server
ip access-list extended BLOCK_STUDENT_TO_ADMIN
 deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255
 permit ip any any
interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
 ip access-group BLOCK_STUDENT_TO_ADMIN in`,
    },
    featured: true,
  },
  {
    id: 'digital-marketing-funnel',
    title: 'EdTech Admission Funnel Optimization',
    subtitle: 'Lead Generation & Competitor Benchmarking Pipeline',
    category: 'Digital Marketing',
    techStack: ['Excel Power Query', 'Python EDA', 'Google Analytics KPIs', 'Market Research'],
    description: 'Conducted market analysis and lead attribution modeling for EdTech courses, identifying bottle-necks in counsellor follow-ups and optimizing digital ad channels for improved conversion.',
    highlights: [
      'Mapped customer journey from ad impression to final enrolment.',
      'Identified drop-offs in lead nurture emails and optimized counsellor assignment logic.',
      'Reduced cost per acquisition (CPA) by 14% through targeted competitor keyword segmentation.',
    ],
    metrics: [
      { label: 'Enrolment Yield', value: '+12%' },
      { label: 'Lead Response Time', value: '-35%' },
      { label: 'CPA Reduction', value: '14%' },
    ],
    featured: true,
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'google-data-science',
    title: 'Foundations of Data Science',
    issuer: 'Google (via Coursera)',
    date: 'Nov 2023',
    verifyUrl: 'https://coursera.org/verify/ZT89W7QT2ZZS',
    category: 'Google & Coursera',
    badgeColor: 'bg-blue-600',
    skills: ['Data Analysis', 'Python', 'Data Ethics', 'Statistical Thinking'],
  },
  {
    id: 'google-cybersecurity',
    title: 'Foundations of Cybersecurity',
    issuer: 'Google (via Coursera)',
    date: 'Nov 2023',
    verifyUrl: 'https://coursera.org/verify/Q24UVF9W4NC8',
    category: 'Google & Coursera',
    badgeColor: 'bg-emerald-600',
    skills: ['SIEM', 'Network Protocols', 'Security Compliance', 'Linux'],
  },
  {
    id: 'google-tech-support',
    title: 'Technical Support Fundamentals',
    issuer: 'Google (via Coursera)',
    date: 'Mar 2024',
    verifyUrl: 'https://coursera.org/verify/B64V36PPC6MT',
    category: 'Google & Coursera',
    badgeColor: 'bg-indigo-600',
    skills: ['Troubleshooting', 'Customer Support', 'Hardware & Networking', 'OS Administration'],
  },
  {
    id: 'google-os-poweruser',
    title: 'Operating Systems and You: Becoming a Power User',
    issuer: 'Google (via Coursera)',
    date: 'Nov 2023',
    verifyUrl: 'https://coursera.org/verify/VZTF73TU7JU7',
    category: 'Google & Coursera',
    badgeColor: 'bg-amber-600',
    skills: ['Windows CLI', 'Linux Shell', 'Process Management', 'File Systems'],
  },
  {
    id: 'ibm-project-management',
    title: 'Introduction to Project Management',
    issuer: 'IBM (via Coursera)',
    date: 'Nov 2023',
    verifyUrl: 'https://coursera.org/verify/JAH96AUSYLRU',
    category: 'Management & Productivity',
    badgeColor: 'bg-blue-700',
    skills: ['Project Governance', 'Agile & Waterfall', 'Risk Management', 'Stakeholder Communication'],
  },
  {
    id: 'ibm-os-security',
    title: 'Operating Systems: Overview, Administration, and Security',
    issuer: 'IBM (via Coursera)',
    date: 'Nov 2024',
    verifyUrl: 'https://coursera.org/verify/B1ZKCCG00PGF',
    category: 'Management & Productivity',
    badgeColor: 'bg-slate-700',
    skills: ['OS Hardening', 'Access Control', 'System Administration'],
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
  {
    id: 'infosys-powerbi',
    title: 'Learning Microsoft Power BI',
    issuer: 'Infosys Springboard',
    date: 'Feb 2025',
    verifyUrl: 'https://verify.onwingspan.com',
    category: 'Data & BI',
    badgeColor: 'bg-yellow-600',
    skills: ['Power BI Desktop', 'DAX Measures', 'Power Query', 'Data Modeling'],
  },
  {
    id: 'infosys-bi-intro',
    title: 'Introduction to Business Intelligence',
    issuer: 'Infosys Springboard',
    date: 'Apr 2025',
    verifyUrl: 'https://verify.onwingspan.com',
    category: 'Data & BI',
    badgeColor: 'bg-amber-600',
    skills: ['BI Architecture', 'Data Warehousing', 'KPI Reporting'],
  },
  {
    id: 'infosys-agile',
    title: 'Software Engineering and Agile Software Development',
    issuer: 'Infosys Springboard',
    date: 'Aug 2024',
    verifyUrl: 'https://verify.onwingspan.com',
    category: 'Management & Productivity',
    badgeColor: 'bg-cyan-600',
    skills: ['Agile Ceremonies', 'Scrum', 'Sprint Planning', 'Software Lifecycle'],
  },
  {
    id: 'cisco-virtual-internship',
    title: 'Cisco AICTE Virtual Internship Program in Networking',
    issuer: 'Cisco Networking Academy',
    date: 'Jul 2024',
    verifyUrl: 'https://netacad.com',
    category: 'Cybersecurity',
    badgeColor: 'bg-cyan-700',
    skills: ['Simulated Network Security', 'VLAN Segmentation', 'Firewalls', 'Vulnerability Auditing'],
  },
  {
    id: 'cisco-packet-tracer',
    title: 'Introduction to Packet Tracer',
    issuer: 'Cisco Networking Academy',
    date: 'Jul 2024',
    verifyUrl: 'https://netacad.com',
    category: 'Cybersecurity',
    badgeColor: 'bg-teal-600',
    skills: ['Packet Tracer Simulation', 'Topology Design', 'Router/Switch Config'],
  },
  {
    id: 'cisco-cybersecurity-essentials',
    title: 'Cybersecurity Essentials',
    issuer: 'Cisco Networking Academy',
    date: 'Jul 2024',
    verifyUrl: 'https://netacad.com',
    category: 'Cybersecurity',
    badgeColor: 'bg-emerald-700',
    skills: ['Threat Countermeasures', 'CIA Triad', 'Legal Frameworks'],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Reporting & Business Intelligence',
    iconName: 'BarChart3',
    skills: [
      { name: 'Power BI & DAX', level: 92, description: 'KPI Dashboards, Slicers, Drill-throughs, Dynamic DAX Measures' },
      { name: 'MS Excel (Power Query & Pivot)', level: 95, description: 'PivotTables, Power Query ETL, VLOOKUP, Advanced Formulas' },
      { name: 'Data Visualization & Storytelling', level: 90, description: 'Transforming raw data into clear executive narratives' },
    ],
  },
  {
    category: 'Databases & SQL',
    iconName: 'Database',
    skills: [
      { name: 'MySQL / MS SQL Server', level: 88, description: 'Complex Joins, Subqueries, Aggregations, Grouping' },
      { name: 'SQL Window Functions', level: 85, description: 'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, Over Partitioning' },
      { name: 'Data Cleaning & Validation', level: 92, description: 'Handling missing values, deduplication, schema normalization' },
    ],
  },
  {
    category: 'Programming & Data Science',
    iconName: 'Code2',
    skills: [
      { name: 'Python (Pandas & NumPy)', level: 86, description: 'Data wrangling, feature engineering, automated EDA scripts' },
      { name: 'Matplotlib & Seaborn', level: 82, description: 'Statistical charting, heatmaps, distribution plots' },
      { name: 'Machine Learning Concepts', level: 78, description: 'Regression, Classification, Clustering (UW Certified)' },
    ],
  },
  {
    category: 'Cyber Security & SOC Analytics (Active Focus)',
    iconName: 'ShieldCheck',
    skills: [
      { name: 'SOC Triage & SIEM Log Analysis', level: 85, description: 'Splunk/ELK concepts, log auditing, threat detection & event triage' },
      { name: 'Network Defense & Packet Analysis', level: 88, description: 'Wireshark, Cisco Packet Tracer, VLAN segmentation, Firewall ACLs' },
      { name: 'Threat Hunting & NIST / MITRE Framework', level: 82, description: 'Identifying attack vectors, vulnerability scanning, OS hardening' },
    ],
  },
  {
    category: 'Project Management & Operations',
    iconName: 'Briefcase',
    skills: [
      { name: 'Agile & Sprint Execution', level: 88, description: 'Scrum principles, task prioritization, sprint planning (IBM/Infosys)' },
      { name: 'Stakeholder Communication', level: 92, description: 'Collaborating across academic, counselling, and sales teams' },
      { name: 'Team Mentorship & Coordination', level: 88, description: 'Mentoring team members in communication & execution' },
    ],
  },
  {
    category: 'Networking & Security',
    iconName: 'ShieldCheck',
    skills: [
      { name: 'Cisco Packet Tracer & Networking', level: 85, description: 'TCP/IP, DNS, OSI Model, VLANs, Router/Switch config' },
      { name: 'Vulnerability Assessment & Logs', level: 82, description: 'Log analysis, identifying open ports, firewall ACL policies' },
    ],
  },
];

export const EDUCATION: Education = {
  degree: 'B.Tech in Information Technology',
  field: 'Information Technology & Data Systems',
  institution: 'Alliance University',
  location: 'Bangalore, India',
  period: '2021 – 2025',
  score: 'CGPA: 7.7 / 10.0',
  courses: [
    'Database Management Systems (DBMS)',
    'Data Structures & Algorithms',
    'Computer Networks & Protocols',
    'Operating Systems',
    'Software Engineering & Agile',
    'Data Analytics & Mining',
  ],
};

export const SAMPLE_SQL_DATASETS: SQLDataset[] = [
  {
    name: 'physicswallah_campaigns',
    description: 'Marketing campaign performance dataset for EdTech enrolment tracking.',
    defaultQuery: 'SELECT channel, SUM(leads) AS total_leads, ROUND(AVG(conversion_rate), 2) AS avg_conv_pct, ROUND(SUM(revenue_inr), 0) AS total_revenue FROM campaigns GROUP BY channel ORDER BY total_revenue DESC;',
    columns: ['campaign_id', 'channel', 'impressions', 'clicks', 'leads', 'conversions', 'spend_inr', 'revenue_inr', 'conversion_rate'],
    rows: [
      { campaign_id: 'CMP-101', channel: 'Google Search Ads', impressions: 145000, clicks: 12400, leads: 1850, conversions: 295, spend_inr: 85000, revenue_inr: 450000, conversion_rate: 15.95 },
      { campaign_id: 'CMP-102', channel: 'YouTube Organic', impressions: 320000, clicks: 28900, leads: 4100, conversions: 610, spend_inr: 40000, revenue_inr: 890000, conversion_rate: 14.88 },
      { campaign_id: 'CMP-103', channel: 'Instagram Reels', impressions: 210000, clicks: 18500, leads: 2300, conversions: 310, spend_inr: 55000, revenue_inr: 520000, conversion_rate: 13.48 },
      { campaign_id: 'CMP-104', channel: 'Direct Counselling', impressions: 45000, clicks: 11200, leads: 3200, conversions: 780, spend_inr: 30000, revenue_inr: 1150000, conversion_rate: 24.38 },
      { campaign_id: 'CMP-105', channel: 'Email Marketing', impressions: 88000, clicks: 6400, leads: 1200, conversions: 210, spend_inr: 12000, revenue_inr: 310000, conversion_rate: 17.50 },
    ],
  },
  {
    name: 'infosys_bi_kpis',
    description: 'Quarterly business intelligence KPI tracker with regional breakdowns.',
    defaultQuery: 'SELECT region, COUNT(client_id) AS active_clients, SUM(q4_revenue_usd) AS q4_revenue, ROUND(AVG(csat_score), 1) AS avg_csat FROM bi_kpis GROUP BY region ORDER BY q4_revenue DESC;',
    columns: ['kpi_id', 'region', 'client_id', 'service_line', 'q4_revenue_usd', 'csat_score', 'sla_compliance_pct'],
    rows: [
      { kpi_id: 'KPI-001', region: 'North America', client_id: 'CL-8801', service_line: 'Data Engineering', q4_revenue_usd: 240000, csat_score: 4.8, sla_compliance_pct: 99.4 },
      { kpi_id: 'KPI-002', region: 'Europe', client_id: 'CL-8802', service_line: 'Power BI Analytics', q4_revenue_usd: 185000, csat_score: 4.6, sla_compliance_pct: 98.9 },
      { kpi_id: 'KPI-003', region: 'Asia Pacific', client_id: 'CL-8803', service_line: 'Cloud Data Warehouse', q4_revenue_usd: 310000, csat_score: 4.9, sla_compliance_pct: 99.8 },
      { kpi_id: 'KPI-004', region: 'India Domestic', client_id: 'CL-8804', service_line: 'BI Dashboarding', q4_revenue_usd: 140000, csat_score: 4.7, sla_compliance_pct: 99.1 },
    ],
  },
];
