import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CoverLetterView } from '@/jobstudio/components/CoverLetterView';
import { generateVectorCoverLetterPdf } from '@/jobstudio/utils/pdfExport';
import * as pdfExportModule from '@/jobstudio/utils/pdfExport';
import * as docxExportModule from '@/jobstudio/utils/docxExport';
import { CoverLetterData } from '@/jobstudio/data/defaultData';

afterEach(cleanup);

const mockCoverLetter: CoverLetterData = {
  recipient: 'Hiring Team\nAcme Corp\nSan Francisco, CA',
  subject: 'Application for Senior Operations Lead - Alex Rivera',
  body_paragraphs: [
    'I am writing to express my strong interest in the Senior Operations Lead position at Acme Corp. With over 8 years of scaling cross-border financial operations and payment reconciliation systems, I am excited about the opportunity to contribute to your team.',
    'At my previous role, I spearheaded the automated reconciliation pipeline which reduced settlement latency by 42% across EMEA corridors while maintaining 99.99% compliance with local financial regulations.',
    'Thank you for your time and consideration. I welcome the opportunity to discuss how my operational background aligns with your upcoming roadmap.',
  ],
  signoff: 'Sincerely,\nAlex Rivera',
};

describe('Task 9: CoverLetterView PDF & DOCX Exports', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders the empty state if no cover letter paragraphs are present', () => {
    render(
      <CoverLetterView
        coverLetter={{ recipient: '', subject: '', body_paragraphs: [], signoff: '' }}
        candidateName="Alex Rivera"
        companyName="Acme Corp"
        jobTitle="Senior Operations Lead"
      />
    );

    expect(screen.getByRole('heading', { name: /^Cover Letter$/i })).toBeInTheDocument();
    expect(screen.getByText(/Select an opportunity in Job Evaluator/i)).toBeInTheDocument();
  });

  it('renders letter paper and action buttons: Copy Text, Export PDF, and Export DOCX', () => {
    render(
      <CoverLetterView
        coverLetter={mockCoverLetter}
        candidateName="Alex Rivera"
        companyName="Acme Corp"
        jobTitle="Senior Operations Lead"
      />
    );

    // Header info
    expect(screen.getByText(/Addressed to/i)).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getAllByText(/Alex Rivera/i).length).toBeGreaterThanOrEqual(1);

    // Letter content
    expect(screen.getByText(mockCoverLetter.subject)).toBeInTheDocument();
    expect(screen.getByText(mockCoverLetter.body_paragraphs[0])).toBeInTheDocument();

    // 3 Action buttons
    expect(screen.getByRole('button', { name: /Copy Text/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export DOCX/i })).toBeInTheDocument();
  });

  it('copies plain text to clipboard when Copy Text is clicked', async () => {
    render(
      <CoverLetterView
        coverLetter={mockCoverLetter}
        candidateName="Alex Rivera"
        companyName="Acme Corp"
        jobTitle="Senior Operations Lead"
      />
    );

    const copyBtn = screen.getByRole('button', { name: /Copy Text/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(screen.getByText(/Copied/i)).toBeInTheDocument();
  });

  it('triggers downloadCoverLetterAsPdf and displays success state', async () => {
    const downloadPdfSpy = vi.spyOn(pdfExportModule, 'downloadCoverLetterAsPdf').mockResolvedValue(true);

    render(
      <CoverLetterView
        coverLetter={mockCoverLetter}
        candidateName="Alex Rivera"
        companyName="Acme Corp"
        jobTitle="Senior Operations Lead"
      />
    );

    const pdfBtn = screen.getByRole('button', { name: /Export PDF/i });
    await act(async () => {
      fireEvent.click(pdfBtn);
    });

    expect(downloadPdfSpy).toHaveBeenCalledWith(
      mockCoverLetter,
      'Alex Rivera',
      'Cover_Letter_Acme_Corp_Alex_Rivera.pdf'
    );
    expect(screen.getByText(/PDF Downloaded/i)).toBeInTheDocument();

    downloadPdfSpy.mockRestore();
  });

  it('triggers downloadCoverLetterAsDocx and displays success state', () => {
    const downloadDocxSpy = vi.spyOn(docxExportModule, 'downloadCoverLetterAsDocx').mockImplementation(() => {});

    render(
      <CoverLetterView
        coverLetter={mockCoverLetter}
        candidateName="Alex Rivera"
        companyName="Acme Corp"
        jobTitle="Senior Operations Lead"
      />
    );

    const docxBtn = screen.getByRole('button', { name: /Export DOCX/i });
    act(() => {
      fireEvent.click(docxBtn);
    });

    expect(downloadDocxSpy).toHaveBeenCalledWith(
      mockCoverLetter,
      'Alex Rivera',
      'Cover_Letter_Acme_Corp_Alex_Rivera.docx'
    );
    expect(screen.getByText(/DOCX Downloaded/i)).toBeInTheDocument();

    downloadDocxSpy.mockRestore();
  });

  it('generates a valid vector PDF instance via generateVectorCoverLetterPdf', () => {
    const doc = generateVectorCoverLetterPdf(mockCoverLetter, 'Alex Rivera');
    expect(doc).toBeDefined();
    expect(doc.internal.pageSize.getWidth()).toBe(612); // standard US Letter width in pt
    expect(doc.internal.pageSize.getHeight()).toBe(792); // standard US Letter height in pt
  });
});

