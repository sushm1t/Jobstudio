import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReferralMessageView } from '@/jobstudio/components/ReferralMessageView';
import { JobEvaluatorView } from '@/jobstudio/components/JobEvaluatorView';
import { EMPTY_EVALUATION, MASTER_BASE_RESUME, EMPTY_COVER_LETTER } from '@/jobstudio/data/defaultData';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ReferralMessageView Component', () => {
  const defaultProps = {
    candidateName: 'Alex Morgan',
    companyName: 'Spotify',
    jobTitle: 'Operations Manager',
    candidateSkills: ['Vendor Relations', 'Workflow Automation', 'Team Leadership'],
    candidateSummary: 'Operations Leader with 4+ years experience.',
    keyFactors: ['Strong operational efficiency', 'Proven vendor relations'],
    jobReqUrl: 'https://spotify.jobs/ops-123',
  };

  it('renders referral message view with all 4 outreach scenario presets', () => {
    render(<ReferralMessageView {...defaultProps} />);

    expect(screen.getByText('Internal Referral Outreach')).toBeInTheDocument();
    expect(screen.getByText(/Targeting/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Operations Manager/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Spotify/i).length).toBeGreaterThan(0);

    // 4 Presets
    expect(screen.getByRole('button', { name: /Former Colleague \/ Friend/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /LinkedIn \/ 2nd Degree/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /School \/ Alumni Network/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hiring Manager Pitch/i })).toBeInTheDocument();
  });

  it('renders the one-click forwardable referral blurb', () => {
    render(<ReferralMessageView {...defaultProps} />);

    expect(screen.getByText('One-Click Forwardable Referral Blurb')).toBeInTheDocument();
    expect(screen.getAllByText(/Forwardable Referral Blurb for Spotify:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Candidate: Alex Morgan/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Target Role: Operations Manager at Spotify/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/https:\/\/spotify.jobs\/ops-123/i).length).toBeGreaterThan(0);
  });

  it('switches between presets and updates the message subject and body', () => {
    render(<ReferralMessageView {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/Your referral outreach message.../i) as HTMLTextAreaElement;

    // Default preset is colleague
    expect(textarea.value).toContain('Quick question / Operations Manager role at Spotify!');
    expect(textarea.value).toContain('Hey Alex');

    // Switch to LinkedIn / 2nd Degree
    const linkedinBtn = screen.getByRole('button', { name: /LinkedIn \/ 2nd Degree/i });
    fireEvent.click(linkedinBtn);

    expect(textarea.value).toContain('Re: Operations Manager opening at Spotify / Quick connection');
    expect(textarea.value).toContain('Hi Alex');

    // Switch to Alumni Network
    const alumniBtn = screen.getByRole('button', { name: /School \/ Alumni Network/i });
    fireEvent.click(alumniBtn);

    expect(textarea.value).toContain('Fellow our university alumni network alum reaching out');

    // Switch to Hiring Manager Pitch
    const managerBtn = screen.getByRole('button', { name: /Hiring Manager Pitch/i });
    fireEvent.click(managerBtn);

    expect(textarea.value).toContain("Operations Manager opening — Alex Morgan's background & impact");
  });

  it('updates the template dynamically when parameters are edited', () => {
    render(<ReferralMessageView {...defaultProps} />);

    const recipientInput = screen.getByPlaceholderText('e.g. Alex');
    fireEvent.change(recipientInput, { target: { value: 'Samantha' } });

    const textarea = screen.getByPlaceholderText(/Your referral outreach message.../i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Hey Samantha');
  });

  it('allows manual edits and provides a reset button', () => {
    render(<ReferralMessageView {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/Your referral outreach message.../i) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Custom hand-written message to my friend.' } });

    expect(textarea.value).toBe('Custom hand-written message to my friend.');
    expect(screen.getByText('Reset to template')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Reset to template'));
    expect(textarea.value).toContain('Quick question / Operations Manager role at Spotify!');
  });

  it('copies message to clipboard on click', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ReferralMessageView {...defaultProps} />);

    const copyBtn = screen.getByTitle('Copy entire message to clipboard');
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock.mock.calls[0]![0]).toContain('Operations Manager');
    expect(screen.getByText('Copied Message')).toBeInTheDocument();
  });

  it('renders the One-Click LinkedIn Connection Finder with 4 targeted search URLs', () => {
    render(<ReferralMessageView {...defaultProps} />);

    expect(screen.getByTestId('linkedin-finder-panel')).toBeInTheDocument();
    expect(screen.getByText('One-Click LinkedIn Connection Finder')).toBeInTheDocument();
    expect(screen.getByText('Zero Scraping · 100% Safe')).toBeInTheDocument();

    // 1. 2nd-Degree Mutuals
    const mutualsLink = screen.getByTestId('linkedin-search-mutuals') as HTMLAnchorElement;
    expect(mutualsLink).toBeInTheDocument();
    expect(mutualsLink.href).toContain('linkedin.com/search/results/people');
    expect(mutualsLink.href).toContain('Spotify');
    expect(mutualsLink.href).toContain('network=%5B%22S%22%5D');
    expect(mutualsLink.target).toBe('_blank');

    // 2. School Alumni
    const alumniLink = screen.getByTestId('linkedin-search-alumni') as HTMLAnchorElement;
    expect(alumniLink).toBeInTheDocument();
    expect(alumniLink.href).toContain('linkedin.com/search/results/people');
    expect(alumniLink.href).toContain('Spotify');
    expect(alumniLink.target).toBe('_blank');

    // 3. Role Peers
    const peersLink = screen.getByTestId('linkedin-search-peers') as HTMLAnchorElement;
    expect(peersLink).toBeInTheDocument();
    expect(peersLink.href).toContain('Spotify');
    expect(peersLink.href).toContain('Operations%20Manager');
    expect(peersLink.target).toBe('_blank');

    // 4. Recruiters & Talent Partners
    const recruitersLink = screen.getByTestId('linkedin-search-recruiters') as HTMLAnchorElement;
    expect(recruitersLink).toBeInTheDocument();
    expect(recruitersLink.href).toContain('Spotify');
    expect(recruitersLink.href).toContain('Recruiter');
    expect(recruitersLink.target).toBe('_blank');
  });
});
