import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { PERSONAL_INFO, WORK_EXPERIENCES, PROJECTS, CERTIFICATIONS, EDUCATION } from '../data/karanData';

export interface ResumeData {
  personalInfo?: typeof PERSONAL_INFO;
  workExperiences?: typeof WORK_EXPERIENCES;
  projects?: typeof PROJECTS;
  certifications?: typeof CERTIFICATIONS;
  education?: typeof EDUCATION;
}

/**
 * Generates a formal, professional PDF document using jsPDF & jspdf-autotable.
 * Pulls live portfolio state data when available, falling back to karanData.
 */
export async function downloadResumePDF(containerElement?: HTMLElement | null, portfolioData?: any): Promise<void> {
  // Extract data from portfolio state or local fallback
  const info = portfolioData?.personalInfo || PERSONAL_INFO;
  const experiences = portfolioData?.experiences || WORK_EXPERIENCES;
  const projects = portfolioData?.projects || PROJECTS;
  const certifications = portfolioData?.certifications || CERTIFICATIONS;
  const education = portfolioData?.education || EDUCATION;

  // 1. If HTML container provided and user prefers canvas render, attempt it first
  if (containerElement && !portfolioData) {
    try {
      const canvas = await html2canvas(containerElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('Karan_Pandre_Resume.pdf');
      return;
    } catch (err) {
      console.warn('HTML canvas export failed, generating vector autoTable PDF:', err);
    }
  }

  // 2. Vector PDF Document Generator using jsPDF + jspdf-autotable
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~595.28 pt
  const marginX = 36;
  const contentWidth = pageWidth - marginX * 2;
  let y = 36;

  // Theme Colors
  const darkNavy: [number, number, number] = [27, 54, 93];   // #1B365D
  const darkText: [number, number, number] = [31, 41, 55];   // #1F2937
  const blueSub: [number, number, number] = [30, 64, 175];   // #1E40AF

  // --- HEADER SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...darkNavy);
  const titleName = (info.name || 'KARAN PANDRE').toUpperCase();
  doc.text(titleName, pageWidth / 2, y, { align: 'center' });
  y += 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...blueSub);
  doc.text('Business Analyst • Power BI • SQL • Python • Data Analytics • Networking', pageWidth / 2, y, { align: 'center' });
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  const contactStr = `${info.location || 'Bangalore, India'} | ${info.phone || '+91 96115 56402'} | ${info.email || 'karanpandre3@gmail.com'} | linkedin.com/in/karanpandre3`;
  doc.text(contactStr, pageWidth / 2, y, { align: 'center' });
  y += 20;

  // Helper function to draw Navy Section Banners
  const drawSectionHeader = (title: string) => {
    doc.setFillColor(...darkNavy);
    doc.rect(marginX, y, contentWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title, marginX + 8, y + 11.5);
    y += 22;
  };

  // Helper for bullet lines
  const drawBullet = (text: string, boldPrefix?: string) => {
    doc.setFontSize(8.5);
    doc.setTextColor(...darkText);

    const bulletSymbol = '•  ';
    const bulletWidth = doc.getTextWidth(bulletSymbol);

    doc.setFont('helvetica', 'bold');
    doc.text(bulletSymbol, marginX + 4, y);

    let currentX = marginX + 4 + bulletWidth;
    const maxTextWidth = contentWidth - 20;

    if (boldPrefix) {
      doc.setFont('helvetica', 'bold');
      doc.text(boldPrefix + ' ', currentX, y);
      currentX += doc.getTextWidth(boldPrefix + ' ');
    }

    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, maxTextWidth);

    for (let i = 0; i < lines.length; i++) {
      if (i === 0) {
        doc.text(lines[i], currentX, y);
      } else {
        doc.text(lines[i], marginX + 16, y);
      }
      y += 11;
    }
    y += 2;
  };

  // 1. PROFESSIONAL SUMMARY
  drawSectionHeader('PROFESSIONAL SUMMARY');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkText);
  const summaryText = info.bio || 'B.Tech Information Technology graduate (2025) currently working at Physics Wallah, analyzing campaign performance, building dashboards, and translating business requirements into actionable insights. Gained hands-on experience configuring simulated networks, applying firewall rules, and documenting security findings through a virtual internship with Cisco Networking Academy. Familiar with SQL databases, Power BI dashboards, and Python scripting through project work and professional experience. A quick learner with a problem solving mindset, eager to grow in data analytics and business intelligence.';
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth - 8);
  doc.text(summaryLines, marginX + 4, y);
  y += summaryLines.length * 11 + 8;

  // 2. TECHNICAL SKILLS (Structured Table via jspdf-autotable)
  drawSectionHeader('TECHNICAL SKILLS');

  const skillsData = [
    ['Reporting & BI', 'Power BI (DAX, Slicers, Drill-throughs, KPI Dashboards), MS Excel (PivotTables, Power Query, VLOOKUP, Charts)'],
    ['Databases & SQL', 'MySQL, MS SQL Server — Joins, Subqueries, Aggregations, Window Functions'],
    ['Programming', 'Python (Pandas, NumPy, Matplotlib, Seaborn) — Data Cleaning, Automation Scripts, EDA'],
    ['Productivity & AI', 'ChatGPT, Google Gemini, Microsoft Copilot, GitHub Copilot, Prompt Engineering'],
    ['OS & Hardware', 'Windows (Admin & Desktop Support), Linux.'],
    ['Networking & Security', 'TCP/IP, DNS, OSI Model, Cisco Packet Tracer.']
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    body: skillsData,
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      textColor: [31, 41, 55],
      cellPadding: { top: 2, bottom: 2, left: 4, right: 4 },
      font: 'helvetica'
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 125, textColor: [27, 54, 93] },
      1: { cellWidth: contentWidth - 125 }
    }
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // 3. WORK EXPERIENCE
  drawSectionHeader('WORK EXPERIENCE');
  experiences.forEach((w: any) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkNavy);
    doc.text(`${w.role}  |  ${w.company}`, marginX + 4, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(w.period || '', pageWidth - marginX - 4, y, { align: 'right' });
    y += 12;

    const bullets: string[] = Array.isArray(w.bullets) ? w.bullets : (w.description ? [w.description] : []);
    bullets.forEach((b) => {
      drawBullet(b);
    });
    y += 4;
  });

  // 4. PROJECTS
  drawSectionHeader('PROJECTS');
  projects.forEach((p: any) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkNavy);
    doc.text(p.title, marginX + 4, y);

    const stackStr = Array.isArray(p.techStack) ? p.techStack.join(' · ') : (p.techStack || '');
    if (stackStr) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(` — ${stackStr}`, marginX + 4 + doc.getTextWidth(p.title), y);
    }
    y += 12;

    const highlights: string[] = Array.isArray(p.highlights) ? p.highlights : (p.description ? [p.description] : []);
    highlights.forEach((h) => {
      drawBullet(h);
    });
    y += 4;
  });

  // 5. EDUCATION & CERTIFICATIONS (Side-by-Side or Formatted Table)
  drawSectionHeader('EDUCATION');
  if (typeof education === 'object' && !Array.isArray(education)) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkNavy);
    doc.text(`${education.degree}  |  ${education.institution}`, marginX + 4, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(`${education.period}  |  ${education.score}`, pageWidth - marginX - 4, y, { align: 'right' });
    y += 18;
  } else if (Array.isArray(education)) {
    education.forEach((e: any) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...darkNavy);
      doc.text(`${e.degree}  |  ${e.institution}`, marginX + 4, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text(`${e.period || ''}`, pageWidth - marginX - 4, y, { align: 'right' });
      y += 14;
    });
    y += 4;
  }

  // 6. CERTIFICATIONS (autotable format)
  drawSectionHeader('CERTIFICATIONS');

  const certTableBody = certifications.slice(0, 6).map((c: any) => {
    return [`•  ${c.title}`, c.issuer || '', c.date || ''];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    body: certTableBody,
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      textColor: [31, 41, 55],
      cellPadding: { top: 2, bottom: 2, left: 4, right: 4 },
      font: 'helvetica'
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 260 },
      1: { cellWidth: 180, fontStyle: 'italic', textColor: [75, 85, 99] },
      2: { cellWidth: contentWidth - 440, halign: 'right', textColor: [107, 114, 128] }
    }
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // 7. LANGUAGES
  drawSectionHeader('LANGUAGES');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkText);
  const langStr = Array.isArray(info.languages) 
    ? info.languages.join('  |  ')
    : 'English – Professional | Hindi – Professional | Kannada – Professional | Marathi – Professional';
  doc.text(langStr, marginX + 4, y);

  // Save the PDF
  doc.save('Karan_Pandre_Resume.pdf');
}
