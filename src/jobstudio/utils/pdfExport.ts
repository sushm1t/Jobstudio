// @ts-nocheck -- ported verbatim from the original project
import jsPDF from 'jspdf';
import { TailoredResumeData, CoverLetterData } from '../data/defaultData';

export interface PdfExportOptions {
  fileName?: string;
  forceSinglePage?: boolean;
}

/**
 * Sanitizes Unicode characters (like ₹, smart quotes, em-dashes) into clean Latin-1/ASCII
 * equivalents. This prevents jsPDF from falling back to multi-byte UTF-16 encoding
 * which inserts null bytes (rendered as literal spaces) between every character.
 */
function cleanPdfText(str: string): string {
  if (!str) return '';
  return str
    .replace(/₹/g, 'INR ')
    .replace(/€/g, 'EUR ')
    .replace(/£/g, 'GBP ')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u00A0\u202F]/g, ' ')
    .replace(/[^\x00-\xFF]/g, ' ');
}

/**
 * Creates an interactive clickable hyperlink annotation in jsPDF
 * with strictly normalized bounding box coordinates according to ISO 32000-1 (lly < ury)
 * so links are active and functional across all PDF viewers (Acrobat, Preview, Chrome, Edge).
 */
function addClickablePdfLink(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  url: string
): void {
  try {
    pdf.link(x, y, w, h, { url });

    const internal = pdf.internal as any;
    const page = typeof internal.getCurrentPageInfo === 'function' ? internal.getCurrentPageInfo() : null;
    const annots = page?.pageContext?.annotations;
    if (annots && annots.length > 0) {
      const lastAnnot = annots[annots.length - 1];
      if (lastAnnot && lastAnnot.finalBounds) {
        const b = lastAnnot.finalBounds;
        const y1 = parseFloat(b.y);
        const y2 = parseFloat(b.h);
        if (y1 > y2) {
          const temp = b.y;
          b.y = b.h;
          b.h = temp;
        }
      }
    }
  } catch (err) {
    console.warn('Error attaching clickable PDF link:', err);
  }
}

/**
 * Generates a 100% vector-based, ATS-compliant PDF with real selectable, copyable,
 * and searchable text (zero raster image compression).
 *
 * When uploaded to job application portals (Greenhouse, Lever, Workday, SmartRecruiters,
 * Taleo, Ashby, iCIMS, etc.), the parser can immediately read the native text stream
 * and auto-populate all candidate profile fields.
 */
export function generateVectorResumePdf(
  resume: TailoredResumeData,
  options: PdfExportOptions = {}
): jsPDF {
  const forceSinglePage = options.forceSinglePage !== false;

  // Standard US Letter dimensions in points (pt): 8.5 x 11 inches = 612 x 792 pt
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 612 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 792 pt

  // Margins (0.5 in = 36 pt)
  const marginX = 36;
  const marginTop = 36;
  const marginBottom = 36;
  const contentWidth = pageWidth - marginX * 2; // 540 pt
  const maxY = pageHeight - marginBottom;

  let y = marginTop;

  // Page break helper for multi-page documents
  function checkPageBreak(neededHeight: number): boolean {
    if (!forceSinglePage && y + neededHeight > maxY) {
      doc.addPage();
      y = marginTop;
      return true;
    }
    return false;
  }

  // 1. Candidate Full Name (Header)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(forceSinglePage ? 18 : 20);
  doc.setTextColor(29, 29, 31);
  doc.text(cleanPdfText((resume.full_name || 'CANDIDATE NAME').toUpperCase()), marginX, y);
  y += forceSinglePage ? 16 : 18;

  // 2. Contact Information Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 75);

  const contactItems: Array<{ text: string; url?: string }> = [];
  if (resume.email) {
    contactItems.push({ text: cleanPdfText(resume.email), url: `mailto:${resume.email}` });
  }
  if (resume.phone) {
    contactItems.push({ text: cleanPdfText(resume.phone), url: `tel:${resume.phone.replace(/[^0-9+]/g, '')}` });
  }
  if (
    resume.location &&
    resume.location.trim().length > 0 &&
    !resume.location.toLowerCase().includes('kochi') &&
    !resume.location.toLowerCase().includes('hyderabad')
  ) {
    contactItems.push({ text: cleanPdfText(resume.location) });
  } else if (resume.location) {
    contactItems.push({ text: cleanPdfText(resume.location) });
  }
  if (resume.linkedin) {
    const rawUrl = resume.linkedin.startsWith('http')
      ? resume.linkedin
      : `https://${resume.linkedin}`;
    const displayUrl = resume.linkedin
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/\/$/, '');
    contactItems.push({ text: cleanPdfText(displayUrl), url: rawUrl });
  }

  let curX = marginX;
  contactItems.forEach((item, i) => {
    if (i > 0) {
      doc.setTextColor(190, 190, 195);
      doc.text('|', curX, y);
      curX += doc.getTextWidth('|') + 6;
    }
    if (item.url) {
      doc.setTextColor(0, 113, 227); // Apple Blue clickable link
      doc.textWithLink(item.text, curX, y, { url: item.url });
      const itemW = doc.getTextWidth(item.text);
      addClickablePdfLink(doc, curX, y - 8, itemW, 10, item.url);
      curX += itemW + 6;
    } else {
      doc.setTextColor(70, 70, 75);
      doc.text(item.text, curX, y);
      curX += doc.getTextWidth(item.text) + 6;
    }
  });
  y += 10;

  // Top header rule
  doc.setDrawColor(29, 29, 31);
  doc.setLineWidth(1.25);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += forceSinglePage ? 12 : 14;

  // Reusable Section Header Function
  function renderSectionHeader(title: string): void {
    checkPageBreak(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(29, 29, 31);
    doc.text(title.toUpperCase(), marginX, y);
    y += 3.5;
    doc.setDrawColor(210, 210, 215);
    doc.setLineWidth(0.5);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += forceSinglePage ? 8 : 10;
  }

  // 3. Professional Summary
  if (resume.tailored_summary) {
    renderSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(35, 35, 38);
    const sanitizedSummary = cleanPdfText(resume.tailored_summary);
    const summaryLines = doc.splitTextToSize(sanitizedSummary, contentWidth);
    doc.text(summaryLines, marginX, y, { lineHeightFactor: 1.32 });
    y += summaryLines.length * (8.5 * 1.32) + (forceSinglePage ? 6 : 8);
  }

  // 4. Core Competencies & Skills
  if (resume.skills && resume.skills.length > 0) {
    renderSectionHeader('Core Competencies & Key Technical Stack');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(35, 35, 38);
    const skillsText = resume.skills.map(cleanPdfText).join('  •  ');
    const skillLines = doc.splitTextToSize(skillsText, contentWidth);
    doc.text(skillLines, marginX, y, { lineHeightFactor: 1.32 });
    y += skillLines.length * (8.5 * 1.32) + (forceSinglePage ? 6 : 8);
  }

  // 5. Professional Experience
  if (resume.experiences && resume.experiences.length > 0) {
    renderSectionHeader('Professional Experience');
    resume.experiences.forEach((exp) => {
      checkPageBreak(35);
      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(29, 29, 31);
      doc.text(cleanPdfText(exp.title), marginX, y);

      // Date Range (right-aligned)
      const rawDate = exp.date_range || '';
      const cleanDate = cleanPdfText(
        rawDate
          .replace(/\s*[·•|/,-]\s*(remote|global operations|regulated fintech|kochi|hyderabad|india|onsite|hybrid).*$/gi, '')
          .replace(/\s*\((remote|global operations|regulated fintech|kochi|hyderabad|india|onsite|hybrid).*\)$/gi, '')
          .trim()
      );
      if (cleanDate) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(90, 90, 95);
        const dW = doc.getTextWidth(cleanDate);
        doc.text(cleanDate, pageWidth - marginX - dW, y);
      }
      y += 10.5;

      // Company line
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 113, 227);
      doc.text(cleanPdfText(exp.company), marginX, y);
      if (exp.location) {
        const cW = doc.getTextWidth(cleanPdfText(exp.company));
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(110, 110, 115);
        doc.text(' — ' + cleanPdfText(exp.location), marginX + cW, y);
      }
      y += 9.5;

      // Bullets
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(35, 35, 38);
      const bW = contentWidth - 14;
      exp.bullets.forEach((bullet) => {
        const sanitizedBullet = cleanPdfText(bullet);
        const bLines = doc.splitTextToSize(sanitizedBullet, bW);
        checkPageBreak(bLines.length * 10.5);
        doc.text('•', marginX + 3, y);
        doc.text(bLines, marginX + 12, y, { lineHeightFactor: 1.28 });
        y += bLines.length * (8 * 1.28) + 2.5;
      });
      y += forceSinglePage ? 3 : 5;
    });
  }

  // 6. Selected Projects (if any)
  if (resume.projects && resume.projects.length > 0) {
    renderSectionHeader('Selected Proof of Work & AI/Product Projects');
    resume.projects.forEach((proj) => {
      checkPageBreak(32);

      // Alignment tag width on the right
      let alignW = 0;
      if (proj.target_alignment) {
        const sanitizedAlign = cleanPdfText(proj.target_alignment);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(0, 113, 227); // Apple Blue
        alignW = doc.getTextWidth(sanitizedAlign);
        doc.text(sanitizedAlign, pageWidth - marginX - alignW, y);
      }

      // Project Name on left
      const sanitizedName = cleanPdfText(proj.name);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(29, 29, 31);
      doc.text(sanitizedName, marginX, y);
      const nameW = doc.getTextWidth(sanitizedName);

      // Role next to project name
      if (proj.role) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 75);
        const maxRoleW = contentWidth - alignW - nameW - 12;
        const roleText = ` | ${cleanPdfText(proj.role)}`;
        const rLines = doc.splitTextToSize(roleText, Math.max(maxRoleW, 100));
        doc.text(rLines[0] || roleText, marginX + nameW, y);
      }
      y += 10.5;

      // Project Italic Summary Description (flush with marginX, matching UI)
      if (proj.description) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(110, 110, 115);
        const dLines = doc.splitTextToSize(cleanPdfText(proj.description), contentWidth);
        doc.text(dLines, marginX, y, { lineHeightFactor: 1.28 });
        y += dLines.length * (8 * 1.28) + 2.5;
      }

      // Bullets (identical font, indentation, and spacing to Professional Experience)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(35, 35, 38);
      const bW = contentWidth - 14;
      proj.bullets.forEach((b) => {
        const sanitizedB = cleanPdfText(b);
        const bLines = doc.splitTextToSize(sanitizedB, bW);
        checkPageBreak(bLines.length * 10.5);
        doc.text('•', marginX + 3, y);
        doc.text(bLines, marginX + 12, y, { lineHeightFactor: 1.28 });
        y += bLines.length * (8 * 1.28) + 2.5;
      });
      y += forceSinglePage ? 3.5 : 5.5;
    });
  }

  // 7. Education Section
  if (resume.education && resume.education.length > 0) {
    renderSectionHeader('Education');
    resume.education.forEach((edu) => {
      checkPageBreak(22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(29, 29, 31);
      doc.text(cleanPdfText(edu.degree), marginX, y);
      if (edu.year) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(90, 90, 95);
        const yW = doc.getTextWidth(cleanPdfText(edu.year));
        doc.text(cleanPdfText(edu.year), pageWidth - marginX - yW, y);
      }
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(70, 70, 75);
      doc.text(cleanPdfText(edu.institution), marginX, y);
      y += 12;
    });
    y += forceSinglePage ? 2 : 4;
  }

  // 8. Certifications & Credentials Section (Cleanly separated from Education)
  if (resume.certifications && resume.certifications.length > 0) {
    renderSectionHeader('Certifications & Credentials');
    const certsToShow = resume.certifications.slice(0, 4);
    certsToShow.forEach((c) => {
      checkPageBreak(12);
      const parts = cleanPdfText(c).split(/\s*[|–—]\s*/);
      const title = parts[0]?.trim() || c;
      const issuer = parts.length > 1 ? parts.slice(1).join(' · ').trim() : '';

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(35, 35, 38);
      doc.text('•', marginX + 3, y);

      doc.setFont('helvetica', 'bold');
      doc.text(title, marginX + 12, y);

      if (issuer) {
        const titleW = doc.getTextWidth(title);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 105);
        doc.text(` — ${issuer}`, marginX + 12 + titleW, y);
      }
      y += 11;
    });
  }

  return doc;
}

/**
 * Downloads the resume as an ATS-compliant PDF with 100% selectable vector text.
 * Accepts resume data directly or falls back to DOM extraction / active window cache.
 */
export async function downloadResumeAsPdf(
  elementId: string = 'printable-resume-container',
  fileName: string = 'Tailored_ATS_Resume.pdf',
  forceSinglePage: boolean = true,
  resumeData?: TailoredResumeData
): Promise<boolean> {
  try {
    // 1. Check if structured resumeData is supplied directly
    let targetResume: TailoredResumeData | undefined = resumeData;

    // 2. Fallback to active window cache
    if (!targetResume && typeof window !== 'undefined' && (window as any).__JOBSTUDIO_ACTIVE_RESUME__) {
      targetResume = (window as any).__JOBSTUDIO_ACTIVE_RESUME__;
    }

    // 3. Fallback: Parse structured data from DOM container if available
    if (!targetResume && typeof document !== 'undefined') {
      const container = document.getElementById(elementId);
      if (container) {
        const fullName = container.querySelector('.resume-header h1')?.textContent?.trim() || 'Candidate Name';
        const emailLink = container.querySelector('a[href^="mailto:"]')?.textContent?.trim() || '';
        const phoneLink = container.querySelector('a[href^="tel:"]')?.textContent?.trim() || '';
        const linkedinLink = container.querySelector('#resume-linkedin-link, a[href*="linkedin"]')?.textContent?.trim() || '';
        const summary = container.querySelector('.resume-section p')?.textContent?.trim() || '';

        targetResume = {
          full_name: fullName,
          email: emailLink,
          phone: phoneLink,
          location: '',
          linkedin: linkedinLink,
          tailored_summary: summary,
          skills: [],
          experiences: [],
          education: [],
          certifications: [],
        };
      }
    }

    // 4. Generate native vector PDF with 100% selectable, parseable text
    if (targetResume) {
      const doc = generateVectorResumePdf(targetResume, {
        fileName,
        forceSinglePage,
      });
      doc.save(fileName);
      return true;
    }

    // 5. If all else fails, use window.print vector output
    console.warn('Could not locate structured resume data. Opening print dialog for native PDF vector print.');
    window.print();
    return true;
  } catch (error) {
    console.error('Vector PDF generation error:', error);
    window.print();
    return false;
  }
}

export function printResumeVector(): void {
  window.print();
}

export function generatePlainTextResume(resume: TailoredResumeData): string {
  const divider = '--------------------------------------------------';
  const experienceText = resume.experiences
    .map((exp) => {
      const cleanDate = (exp.date_range || '')
        .replace(/\s*[·•|/,-]\s*(remote|global operations|regulated fintech|kochi|hyderabad|india|onsite|hybrid).*$/gi, '')
        .replace(/\s*\((remote|global operations|regulated fintech|kochi|hyderabad|india|onsite|hybrid).*\)$/gi, '')
        .replace(/\s*[·•]\s*.*$/gi, '')
        .trim();

      return `${exp.title.toUpperCase()} | ${exp.company}
${cleanDate}
${exp.bullets.map((b) => `• ${b}`).join('\n')}`;
    })
    .join('\n\n');

  const projectsText =
    resume.projects && resume.projects.length > 0
      ? `\n\n${divider}\nSELECTED PROOF OF WORK & AI/PRODUCT PROJECTS\n${divider}\n` +
        resume.projects
          .map(
            (p) =>
              `${p.name.toUpperCase()}${p.role ? ` | ${p.role}` : ''}${p.target_alignment ? ` (${p.target_alignment})` : ''}
${p.description ? p.description + '\n' : ''}${p.bullets.map((b) => `• ${b}`).join('\n')}`
          )
          .join('\n\n')
      : '';

  const educationText = resume.education
    .map((edu) => `${edu.degree} - ${edu.institution} (${edu.year})`)
    .join('\n');

  const contactParts = [resume.email, resume.phone];
  if (
    resume.location &&
    resume.location.trim().length > 0 &&
    !resume.location.toLowerCase().includes('kochi') &&
    !resume.location.toLowerCase().includes('hyderabad')
  ) {
    contactParts.push(resume.location);
  }
  contactParts.push(`LinkedIn: ${resume.linkedin}`);

  return `${resume.full_name.toUpperCase()}
${contactParts.join(' | ')}

${divider}
PROFESSIONAL SUMMARY
${divider}
${resume.tailored_summary}

${divider}
CORE COMPETENCIES & SKILLS
${divider}
${resume.skills.join(' • ')}

${divider}
PROFESSIONAL EXPERIENCE
${divider}
${experienceText}${projectsText}

${divider}
EDUCATION
${divider}
${educationText}${resume.certifications.length > 0 ? `\n\n${divider}\nCERTIFICATIONS & CREDENTIALS\n${divider}\n` + resume.certifications.slice(0, 4).map((c) => `• ${c}`).join('\n') : ''}`;
}

export function generatePlainTextCoverLetter(coverLetter: CoverLetterData, senderName: string): string {
  return `${coverLetter.recipient}

${coverLetter.subject}

${coverLetter.body_paragraphs.join('\n\n')}

${coverLetter.signoff}`;
}
