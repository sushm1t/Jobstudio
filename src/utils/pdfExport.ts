import jsPDF from 'jspdf';
import { toCanvas } from 'html-to-image';
import { TailoredResumeData, CoverLetterData } from '../data/defaultData';

export interface PdfExportOptions {
  fileName?: string;
  forceSinglePage?: boolean;
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

    // Normalize coordinates in the jsPDF annotation dictionary:
    // jsPDF uses inverted y values where b.y > b.h in PDF points.
    // Inverting/swapping ensures the rectangle [llx, lly, urx, ury] satisfies lly <= ury.
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

export async function downloadResumeAsPdf(
  elementId: string,
  fileName: string = 'Tailored_ATS_Resume.pdf',
  forceSinglePage: boolean = true
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // 1. Gather all interactive links from the DOM element (including email, LinkedIn, tel)
    const containerRect = element.getBoundingClientRect();
    const linkNodes = Array.from(element.querySelectorAll('a[href], [data-pdf-link]'));
    const extractedLinks = linkNodes
      .map((node) => {
        const linkElem = node as HTMLElement;
        const rawUrl =
          linkElem.getAttribute('data-pdf-link') ||
          linkElem.getAttribute('href') ||
          '';
        let url = rawUrl.trim();
        if (!url) return null;
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
          url = 'https://' + url;
        }

        const rect = linkElem.getBoundingClientRect();
        return {
          url,
          relX: rect.left - containerRect.left,
          relY: rect.top - containerRect.top,
          relW: rect.width,
          relH: rect.height,
        };
      })
      .filter(Boolean) as Array<{
        url: string;
        relX: number;
        relY: number;
        relW: number;
        relH: number;
      }>;

    // 2. Render element to high-res canvas using html-to-image
    const canvas = await toCanvas(element, {
      pixelRatio: 2.5,
      backgroundColor: '#ffffff',
      style: {
        transform: 'none',
        margin: '0',
      },
    });

    // Standard US Letter dimensions in mm: 215.9 x 279.4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Scale canvas to PDF width
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Strategy 1: Fit to single page if requested or close to 1 page
    const isSinglePageCandidate = forceSinglePage || imgHeight <= pdfHeight * 1.25;

    if (isSinglePageCandidate) {
      const scale = Math.min(1, pdfHeight / imgHeight);
      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = Math.max(0, (pdfHeight - finalHeight) / 4);

      const pageData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(pageData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');

      // Attach active PDF deeplinks for LinkedIn, email, and external links
      const mmPerPxX = finalWidth / containerRect.width;
      const mmPerPxY = finalHeight / containerRect.height;

      extractedLinks.forEach((link) => {
        const linkX = xOffset + link.relX * mmPerPxX;
        const linkY = yOffset + link.relY * mmPerPxY;
        const linkW = Math.max(link.relW * mmPerPxX, 3);
        const linkH = Math.max(link.relH * mmPerPxY, 3);

        addClickablePdfLink(pdf, linkX, linkY, linkW, linkH, link.url);
      });

      pdf.save(fileName);
      return true;
    }

    // Strategy 2: Multi-page document with DOM-aware pagination and link mapping
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const pxPerMm = canvasWidth / pdfWidth;
    const idealPageHeightPx = pdfHeight * pxPerMm;
    const canvasScaleY = canvasHeight / containerRect.height;

    // Collect atomic DOM elements that must never be sliced through the middle
    interface ForbiddenRange {
      top: number;
      bottom: number;
    }
    const forbiddenRanges: ForbiddenRange[] = [];
    const safeCutPoints: number[] = [];

    // 1. Headings: Never split through the heading itself, and never leave an orphan heading
    const headings = Array.from(
      element.querySelectorAll('h1, h2, h3, h4, .resume-heading, .resume-header')
    ) as HTMLElement[];
    headings.forEach((h) => {
      const rect = h.getBoundingClientRect();
      const topPx = (rect.top - containerRect.top) * canvasScaleY;
      const bottomPx = (rect.bottom - containerRect.top) * canvasScaleY;
      // Forbid cutting inside the heading or within 40px below it (orphan prevention)
      forbiddenRanges.push({
        top: topPx - 4,
        bottom: bottomPx + 40,
      });
      // Safe cut point immediately prior to heading
      safeCutPoints.push(Math.max(0, topPx - 8));
    });

    // 2. Atomic list items, bullets, and education/degree rows
    const atomicItems = Array.from(
      element.querySelectorAll('.resume-bullet, li, .education-item, .project-item')
    ) as HTMLElement[];
    atomicItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const topPx = (rect.top - containerRect.top) * canvasScaleY;
      const bottomPx = (rect.bottom - containerRect.top) * canvasScaleY;
      // Forbid cutting through the interior text of the bullet
      forbiddenRanges.push({
        top: topPx + 1,
        bottom: bottomPx - 1,
      });
      // Safe cut points before and after each bullet
      safeCutPoints.push(Math.max(0, topPx - 3));
      safeCutPoints.push(bottomPx + 3);
    });

    // 3. Section and experience container boundaries (safe cuts before and after)
    const containers = Array.from(
      element.querySelectorAll('.resume-section, .education-section, .exp-block, section')
    ) as HTMLElement[];
    containers.forEach((c) => {
      const rect = c.getBoundingClientRect();
      const topPx = (rect.top - containerRect.top) * canvasScaleY;
      const bottomPx = (rect.bottom - containerRect.top) * canvasScaleY;
      safeCutPoints.push(Math.max(0, topPx - 8));
      safeCutPoints.push(bottomPx + 4);
    });

    const sortedSafeCuts = Array.from(new Set(safeCutPoints)).sort((a, b) => a - b);

    // Pixel-based whitespace scanner as secondary fallback (strictly respecting forbidden heading/item ranges)
    function findPixelWhiteSplitY(targetY: number, searchRangePx: number): number {
      if (targetY >= canvasHeight) return canvasHeight;

      const startY = Math.max(0, Math.floor(targetY - searchRangePx));
      const endY = Math.min(canvasHeight - 1, Math.floor(targetY));

      let bestY = -1;
      let maxWhiteRun = 0;
      let currentWhiteRun = 0;

      // Inset by 10% on left and right to completely bypass container borders (e.g. border-slate-200)
      const scanStartX = Math.floor(canvasWidth * 0.1);
      const scanWidth = Math.floor(canvasWidth * 0.8);

      for (let y = endY; y >= startY; y--) {
        // Strictly skip any line inside forbidden ranges (such as headings or bullet interiors)
        const isRowInForbidden = forbiddenRanges.some((r) => y >= r.top && y <= r.bottom);
        if (isRowInForbidden) {
          currentWhiteRun = 0;
          continue;
        }

        const rowData = ctx!.getImageData(scanStartX, y, scanWidth, 1).data;
        let isRowBlank = true;

        for (let x = 0; x < rowData.length; x += 16) {
          const r = rowData[x];
          const g = rowData[x + 1];
          const b = rowData[x + 2];
          if (r < 240 || g < 240 || b < 240) {
            isRowBlank = false;
            break;
          }
        }

        if (isRowBlank) {
          currentWhiteRun++;
          if (currentWhiteRun > maxWhiteRun) {
            maxWhiteRun = currentWhiteRun;
            bestY = y;
          }
        } else {
          if (currentWhiteRun >= 4 && bestY !== -1) {
            return bestY;
          }
          currentWhiteRun = 0;
        }
      }

      if (bestY !== -1 && !forbiddenRanges.some((r) => bestY >= r.top && bestY <= r.bottom)) {
        return bestY;
      }

      // If no valid pixel whitespace found outside forbidden ranges, pick highest safe cut before targetY
      const safeFallback = sortedSafeCuts.filter((c) => c <= targetY && c >= startY);
      if (safeFallback.length > 0) {
        return safeFallback[safeFallback.length - 1];
      }

      // Guard: If targetY itself is inside a forbidden text block (e.g. heading), back up before the block
      const hitForbidden = forbiddenRanges.find((r) => targetY >= r.top && targetY <= r.bottom);
      if (hitForbidden) {
        return Math.max(0, hitForbidden.top - 8);
      }

      return targetY;
    }

    function findBestSplitY(targetY: number, searchRangePx: number = 320): number {
      if (targetY >= canvasHeight) return canvasHeight;

      const minAllowedY = targetY - searchRangePx;

      // 1. Check DOM-derived safe cut points
      const candidateCuts = sortedSafeCuts.filter((c) => c <= targetY && c >= minAllowedY);
      for (let i = candidateCuts.length - 1; i >= 0; i--) {
        const c = candidateCuts[i];
        // Ensure cut does not land inside a forbidden heading or bullet text range
        const isForbidden = forbiddenRanges.some((r) => c >= r.top && c <= r.bottom);
        if (!isForbidden) {
          return c;
        }
      }

      // 2. Fall back to margin-safe pixel whitespace search (which also checks forbidden ranges)
      return findPixelWhiteSplitY(targetY, searchRangePx);
    }

    let currentY = 0;
    let pageIndex = 0;

    while (currentY < canvasHeight) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      const remainingHeight = canvasHeight - currentY;
      let sliceHeight = Math.min(idealPageHeightPx, remainingHeight);

      if (remainingHeight > idealPageHeightPx) {
        // Search up to 30% of page height backwards to find an ideal section or bullet break
        const searchRange = Math.floor(idealPageHeightPx * 0.32);
        const splitY = findBestSplitY(currentY + idealPageHeightPx, searchRange);
        sliceHeight = Math.max(splitY - currentY, idealPageHeightPx * 0.5);
      }

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = sliceHeight;

      const pageCtx = pageCanvas.getContext('2d');
      if (pageCtx) {
        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, canvasWidth, sliceHeight);
        pageCtx.drawImage(
          canvas,
          0,
          currentY,
          canvasWidth,
          sliceHeight,
          0,
          0,
          canvasWidth,
          sliceHeight
        );

        const sliceData = pageCanvas.toDataURL('image/jpeg', 0.98);
        const sliceMmHeight = (sliceHeight / canvasWidth) * pdfWidth;

        pdf.addImage(sliceData, 'JPEG', 0, 0, pdfWidth, sliceMmHeight, undefined, 'FAST');

        // Add links that fall within this page slice
        extractedLinks.forEach((link) => {
          const linkCanvasY = link.relY * canvasScaleY;
          const linkCanvasH = link.relH * canvasScaleY;

          if (linkCanvasY + linkCanvasH >= currentY && linkCanvasY <= currentY + sliceHeight) {
            const relSliceY = linkCanvasY - currentY;
            const linkX = link.relX * (pdfWidth / containerRect.width);
            const linkY = relSliceY * (pdfWidth / canvasWidth);
            const linkW = Math.max(link.relW * (pdfWidth / containerRect.width), 3);
            const linkH = Math.max(link.relH * (pdfWidth / containerRect.width), 3);

            addClickablePdfLink(pdf, linkX, linkY, linkW, linkH, link.url);
          }
        });
      }

      currentY += sliceHeight;
      pageIndex++;

      if (pageIndex > 10) break;
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.warn('html-to-image capture fallback, opening native print dialog:', error);
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
EDUCATION & CERTIFICATIONS
${divider}
${educationText}
${resume.certifications.length > 0 ? '\nProfessional Certifications & Credentials:\n' + resume.certifications.slice(0, 3).map((c) => `• ${c}`).join('\n') : ''}`;
}

export function generatePlainTextCoverLetter(coverLetter: CoverLetterData, senderName: string): string {
  return `${coverLetter.recipient}

${coverLetter.subject}

${coverLetter.body_paragraphs.join('\n\n')}

${coverLetter.signoff}`;
}
