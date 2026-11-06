import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RecruiterReviewModal, RecruiterPanelData } from '@/jobstudio/components/RecruiterReviewModal';

afterEach(cleanup);

describe('RecruiterReviewModal UX & Readability', () => {
  const mockReviewData: RecruiterPanelData = {
    overall_score: 87,
    consensus_verdict: 'HIRE',
    executive_summary: 'The candidate shows exceptional operational alignment with the mandate, mirroring critical competencies in daily operating rhythms and AI workflows.',
    panel: {
      recruiter: {
        role: 'Senior Talent Acquisition Specialist',
        score: 88,
        scan_time_verdict: '5.1s scan - excellent operational keyword density',
        feedback: 'The resume immediately captures attention by mirroring the job specifications and demonstrating clear upward trajectory.',
        top_strength: 'High-density match for target operational keywords.',
        critical_flag: 'Clarify direct people management scope vs functional queue leadership.',
      },
      hiring_manager: {
        role: 'Operations Director',
        score: 86,
        business_impact_score: '8.8/10',
        feedback: 'Strong proof of metrics-driven queue management and process governance across cross-functional teams.',
        leadership_assessment: 'Proven indirect leadership across 1,000+ support agents.',
        major_concern: 'Probe direct hierarchical performance review experience.',
      },
      technical_lead: {
        role: 'Technical Operations Lead',
        score: 88,
        execution_confidence: 'High',
        feedback: 'Deep SQL, process automation, and incident runbook rigor demonstrated.',
        tooling_depth: 'Advanced SQL, ticketing APIs, and automated runbooks.',
        gap_to_fill: 'Highlight BI dashboard design alongside raw database queries.',
      },
    },
    top_strengths: [
      'Direct operational alignment with daily management systems.',
      'Proven AI application reducing reporting latency.',
    ],
    top_fixes: [
      'Quantify direct people leadership scope.',
      'Specify core visualization tools alongside SQL.',
    ],
  };

  it('renders loading state with high contrast and 3-persona simulation indicators without glare', () => {
    const { container } = render(
      <RecruiterReviewModal
        isOpen={true}
        onClose={vi.fn()}
        reviewData={null}
        isLoading={true}
        onRunReview={vi.fn()}
        jobTitle="India Delivery Operations Manager"
        companyName="MyAdvice"
        isProUser={true}
        onNavigateToPricing={vi.fn()}
      />
    );

    // Verify header contrast and no light-mode glare
    expect(screen.getByText(/Recruiter-Panel Multi-Persona Review/i)).toBeInTheDocument();
    expect(screen.getByText(/India Delivery Operations Manager/i)).toBeInTheDocument();
    expect(container.querySelector('.via-white')).toBeNull();

    // Verify 3 simulated persona indicators are present
    expect(screen.getByText('Senior Recruiter')).toBeInTheDocument();
    expect(screen.getByText('Hiring Manager')).toBeInTheDocument();
    expect(screen.getByText('Technical Peer')).toBeInTheDocument();
    expect(screen.getByText(/Convening 3-Person Hiring Committee/i)).toBeInTheDocument();
  });

  it('renders completed review with clear score hierarchy, segmented tabs, and readable feedback', () => {
    render(
      <RecruiterReviewModal
        isOpen={true}
        onClose={vi.fn()}
        reviewData={mockReviewData}
        isLoading={false}
        onRunReview={vi.fn()}
        jobTitle="India Delivery Operations Manager"
        companyName="MyAdvice"
        isProUser={true}
        onNavigateToPricing={vi.fn()}
      />
    );

    // Score & Consensus
    expect(screen.getByText('87')).toBeInTheDocument();
    expect(screen.getByText(/\/ 100 PANEL SCORE/i)).toBeInTheDocument();
    expect(screen.getByText(/HIRE • ADVANCE TO PANEL/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Committee Consensus/i)).toBeInTheDocument();

    // Persona Tab Switching
    expect(screen.getByText('Standout Strength')).toBeInTheDocument();
    expect(screen.getByText(/High-density match for target operational keywords/i)).toBeInTheDocument();

    // Switch to Hiring Manager
    const hiringManagerTab = screen.getByRole('button', { name: /Hiring Manager/i });
    fireEvent.click(hiringManagerTab);
    expect(screen.getByText('Leadership Assessment')).toBeInTheDocument();
    expect(screen.getByText(/Proven indirect leadership across 1,000\+ support agents/i)).toBeInTheDocument();

    // Switch to Technical Peer
    const techPeerTab = screen.getByRole('button', { name: /Technical Peer/i });
    fireEvent.click(techPeerTab);
    expect(screen.getByText('Tooling Depth')).toBeInTheDocument();
    expect(screen.getByText(/Advanced SQL, ticketing APIs, and automated runbooks/i)).toBeInTheDocument();

    // Consensus Strengths & Fixes
    expect(screen.getByText('Consensus Strengths')).toBeInTheDocument();
    expect(screen.getByText(/Direct operational alignment with daily management systems/i)).toBeInTheDocument();
    expect(screen.getByText('Actionable Polish Fixes')).toBeInTheDocument();
    expect(screen.getByText(/Quantify direct people leadership scope/i)).toBeInTheDocument();
  });
});

