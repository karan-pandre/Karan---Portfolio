import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ThreatItem, IncidentItem, VulnerabilityItem, CyberReportItem } from '../types/cybersecurity';

export interface ReportPdfData {
  threats: ThreatItem[];
  incidents: IncidentItem[];
  vulnerabilities: VulnerabilityItem[];
  securityScore: number;
  analystName: string;
  reportTitle?: string;
}

export function generateSocPdfReport(data: ReportPdfData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Page Colors
  const primaryDark = [10, 15, 30]; // #0a0f1e
  const emeraldAccent = [16, 185, 129]; // #10b981
  const darkCard = [20, 27, 45];
  const textWhite = [255, 255, 255];
  const textMuted = [148, 163, 184];

  // Header Banner
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(0, 0, 210, 45, 'F');

  // Emerald Top Line
  doc.setFillColor(emeraldAccent[0], emeraldAccent[1], emeraldAccent[2]);
  doc.rect(0, 0, 210, 3, 'F');

  // Title
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SOC COMMAND CENTER - EXECUTIVE SECURITY REPORT', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(emeraldAccent[0], emeraldAccent[1], emeraldAccent[2]);
  doc.text(`CONFIDENTIAL | REAL-TIME CYBER THREAT & INCIDENT AUDIT`, 14, 25);

  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(9);
  doc.text(`Generated: ${dateStr} | Analyst: ${data.analystName || 'Karan Pandre'}`, 14, 32);
  doc.text(`Security Operations Center (SOC) - Automated Real-Time Assessment`, 14, 38);

  let currentY = 52;

  // Executive Summary Card
  doc.setFillColor(darkCard[0], darkCard[1], darkCard[2]);
  doc.roundedRect(14, currentY, 182, 32, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('Executive Summary & Security Posture', 20, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 225, 230);
  doc.text(
    `Overall Security Posture Score is ${data.securityScore}/100. During the monitored operational timeframe, ` +
    `the automated AI Agent and SOC telemetry processed active threat streams across enterprise endpoints. ` +
    `Active threats, critical CVE exposures, and incident containment vectors are detailed below.`,
    20, currentY + 16, { maxWidth: 170 }
  );

  currentY += 38;

  // Key Metrics Summary Grid
  const activeThreatsCount = data.threats.filter(t => t.status !== 'RESOLVED' && t.status !== 'BLOCKED').length;
  const openIncidentsCount = data.incidents.filter(i => i.status !== 'RESOLVED').length;
  const unpatchedVulnsCount = data.vulnerabilities.filter(v => v.remediationStatus !== 'PATCHED').length;

  autoTable(doc, {
    startY: currentY,
    head: [['Metric Parameter', 'Current Value', 'Status Level', 'Compliance Target']],
    body: [
      ['Security Posture Score', `${data.securityScore} / 100`, data.securityScore >= 90 ? 'EXCELLENT' : 'REQUIRES ATTENTION', '>= 90% (ISO 27001)'],
      ['Active Detected Threats', `${activeThreatsCount} Active`, activeThreatsCount === 0 ? 'NOMINAL' : 'MONITORED', 'Zero Unhandled'],
      ['Open SOC Incidents', `${openIncidentsCount} Investigating`, openIncidentsCount === 0 ? 'RESOLVED' : 'IN TRIAGE', '< 2 Open'],
      ['Unpatched CVE Vulnerabilities', `${unpatchedVulnsCount} Remaining`, unpatchedVulnsCount === 0 ? 'SECURE' : 'ACTION REQUIRED', 'Zero Critical']
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [16, 185, 129], fontStyle: 'bold' },
    bodyStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontSize: 8 },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Active Threats Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Threat Detection Log & Containment Actions', 14, currentY);
  currentY += 4;

  const threatRows = data.threats.slice(0, 8).map(t => [
    t.id,
    t.type,
    t.severity,
    t.sourceIp,
    t.status,
    t.targetSystem
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Threat ID', 'Vector Type', 'Severity', 'Source IP', 'Status', 'Target System']],
    body: threatRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5 },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // If page space is low, add page
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Vulnerability CVE Summary Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Vulnerability CVE Matrix & Patch Status', 14, currentY);
  currentY += 4;

  const vulnRows = data.vulnerabilities.slice(0, 8).map(v => [
    v.id,
    v.name,
    v.severity,
    `CVSS ${v.cvssScore}`,
    v.affectedSystem,
    v.remediationStatus
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['CVE ID', 'Vulnerability Title', 'Severity', 'CVSS', 'Affected Asset', 'Patch Status']],
    body: vulnRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5 },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Recommended Action Plan
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, currentY, 182, 35, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. AI Agent & Analyst Recommended Next Steps:', 18, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const steps = [
    '• Enforce automated zero-trust egress IP drop policies on perimeter Palo Alto firewalls.',
    '• Execute automated patch deployment for all high and critical CVEs across production subnets.',
    '• Continue continuous SIEM telemetry monitoring with automated AI agent playbook triggers.',
    '• Maintain ISO 27001 / SOC 2 Type II compliance audit records.'
  ];

  steps.forEach((step, idx) => {
    doc.text(step, 18, currentY + 15 + (idx * 5));
  });

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`SOC Command Center Confidential Report - Page ${i} of ${pageCount}`, 14, 287);
    doc.text(`Official Document | Karan Pandre Cybersecurity Operations`, 130, 287);
  }

  doc.save(`SOC_Executive_Security_Report_${Date.now()}.pdf`);
}
