import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PERSONAL_INFO, WORK_EXPERIENCES, PROJECTS, CERTIFICATIONS, EDUCATION } from '../data/karanData';

/**
 * Generates a clean, professional, ATS-friendly PDF document matching the user's CV layout
 * (Dark blue section headers, clean typography, structured margins).
 */
export async function downloadResumePDF(containerElement?: HTMLElement | null): Promise<void> {
  // If a DOM element matching the exact CV card is provided, render it with html2canvas for 100% visual fidelity
  if (containerElement) {
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
      console.warn('HTML rendering failed, falling back to vector jsPDF engine:', err);
    }
  }

  // Fallback / Direct Vector PDF Generator
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const marginX = 36; // 0.5 inch margins
  const contentWidth = pageWidth - marginX * 2;
  let y = 36;

  // Colors
  const darkNavy = [27, 54, 93]; // #1B365D
  const darkText = [31, 41, 55]; // #1F2937
  const blueSub = [30, 64, 175]; // #1E40AF
  const lightGray = [229, 231, 235];

  // Title: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('KARAN PANDRE', pageWidth / 2, y, { align: 'center' });
  y += 18;

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(blueSub[0], blueSub[1], blueSub[2]);
  doc.text('Business Analyst • Power BI • SQL • Python • Data Analytics • Networking', pageWidth / 2, y, { align: 'center' });
  y += 14;

  // Contact Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(55, 65, 81);
  const contactStr = `${PERSONAL_INFO.location} | ${PERSONAL_INFO.phone} | ${PERSONAL_INFO.email} | linkedin.com/in/karanpandre3`;
  doc.text(contactStr, pageWidth / 2, y, { align: 'center' });
  y += 20;

  // Helper for Section Banners
  const drawSectionHeader = (title: string) => {
    doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.rect(marginX, y, contentWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title, marginX + 8, y + 11.5);
    y += 22;
  };

  // Helper for Bullet Item
  const drawBullet = (text: string, boldPrefix?: string) => {
    doc.setFontSize(8.5);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    
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
    const remainingWidth = contentWidth - (currentX - marginX);
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
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const summaryLines = doc.splitTextToSize(
    'B.Tech Information Technology graduate (2025) currently working at Physics Wallah, analyzing campaign performance, building dashboards, and translating business requirements into actionable insights. Gained hands-on experience configuring simulated networks, applying firewall rules, and documenting security findings through a virtual internship with Cisco Networking Academy. Familiar with SQL databases, Power BI dashboards, and Python scripting through project work and professional experience. A quick learner with a problem solving mindset, eager to grow in data analytics and business intelligence.',
    contentWidth - 8
  );
  doc.text(summaryLines, marginX + 4, y);
  y += summaryLines.length * 11 + 8;

  // 2. TECHNICAL SKILLS
  drawSectionHeader('TECHNICAL SKILLS');
  drawBullet('Power BI (DAX, Slicers, Drill-throughs, KPI Dashboards), MS Excel (PivotTables, Power Query, VLOOKUP, Charts)', 'Reporting & BI:');
  drawBullet('MySQL, MS SQL Server — Joins, Subqueries, Aggregations, Window Functions', 'Databases & SQL:');
  drawBullet('Python (Pandas, NumPy, Matplotlib, Seaborn) — Data Cleaning, Automation Scripts, EDA', 'Programming:');
  drawBullet('ChatGPT, Google Gemini, Microsoft Copilot, GitHub Copilot, Prompt Engineering', 'Productivity & AI Tools:');
  drawBullet('Windows (Admin & Desktop Support), Linux.', 'OS & Hardware:');
  drawBullet('TCP/IP, DNS, OSI Model, Cisco Packet Tracer.', 'Networking & Security:');
  y += 6;

  // 3. WORK EXPERIENCE
  drawSectionHeader('WORK EXPERIENCE');
  WORK_EXPERIENCES.forEach((w) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(`${w.role}  |  ${w.company}`, marginX + 4, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(w.period, pageWidth - marginX - 4, y, { align: 'right' });
    y += 12;

    w.bullets.forEach((b) => {
      drawBullet(b);
    });
    y += 4;
  });

  // 4. PROJECTS
  drawSectionHeader('PROJECTS');
  PROJECTS.forEach((p) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(p.title, marginX + 4, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(` — ${p.techStack.join(' · ')}`, marginX + 4 + doc.getTextWidth(p.title), y);
    y += 12;

    p.highlights.forEach((h) => {
      drawBullet(h);
    });
    y += 4;
  });

  // 5. EDUCATION
  drawSectionHeader('EDUCATION');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`${EDUCATION.degree}  |  ${EDUCATION.institution}`, marginX + 4, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  doc.text(`${EDUCATION.period}  |  ${EDUCATION.score}`, pageWidth - marginX - 4, y, { align: 'right' });
  y += 18;

  // 6. CERTIFICATIONS
  drawSectionHeader('CERTIFICATIONS');
  CERTIFICATIONS.slice(0, 5).forEach((c) => {
    drawBullet(`${c.title} – ${c.issuer} (${c.date})`);
  });
  y += 6;

  // 7. LANGUAGES
  drawSectionHeader('LANGUAGES');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(PERSONAL_INFO.languages.join('  |  '), marginX + 4, y);

  doc.save('Karan_Pandre_Resume.pdf');
}
