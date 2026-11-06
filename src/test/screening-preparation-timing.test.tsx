import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScreeningAnswersView } from '@/jobstudio/components/ScreeningAnswersView';

afterEach(cleanup);

describe('Restructure "ATS & Interview" by Preparation Timing', () => {
  const mockCandidateInfo = {
    first_name: 'Alex',
    last_name: 'Morgan',
    email: 'alex@example.com',
    phone: '+1 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alexmorgan',
    portfolio_url: 'https://alex.design',
    linkedin_url: 'https://linkedin.com/in/alexmorgan',
    github_url: 'https://github.com/alexmorgan',
    work_authorization: 'Authorized to work in US',
    relocation_preference: 'Open to relocation',
    notice_period: '2 weeks',
    compensation_target: '$160,000',
  };

  const defaultProps = {
    screeningAnswers: [
      {
        question: 'Why are you looking to leave your current role?',
        suggested_answer: 'Looking to take on deeper product design system ownership.',
        category: 'Career Goals',
      },
    ],
    candidateInfo: mockCandidateInfo,
    companyName: 'Figma',
    jobTitle: 'Senior Product Designer',
    jobDescription: 'Leading design systems and cross-functional token architecture.',
    masterProfileText: 'Senior Product Designer with 6+ years specializing in design tokens and component libraries.',
    interviewQuestions: [],
    onFetchInterviewPrep: vi.fn(),
    isFetchingInterviewPrep: false,
    onTrackApplication: vi.fn(),
    isTracked: false,
    onAddScreeningAnswer: vi.fn(),
    onRemoveScreeningAnswer: vi.fn(),
    isProUser: false,
  };

  it('renders Stage 1 (Immediate / Application Stage) by default with Screening Questions and Company Focus Guidance', () => {
    render(<ScreeningAnswersView {...defaultProps} />);

    // Stage 1 Header & Timing Badge
    expect(screen.getByText(/STAGE 1 · APPLICATION STAGE/i)).toBeInTheDocument();
    expect(screen.getByText(/Tools needed right now while submitting your job application/i)).toBeInTheDocument();

    // Stage 1 Tabs
    const screeningTab = screen.getByRole('button', { name: /Screening Question Answers/i });
    const companyTab = screen.getByRole('button', { name: /Company Focus Guidance/i });
    expect(screeningTab).toBeInTheDocument();
    expect(companyTab).toBeInTheDocument();

    // Active tool: Screening Question Answers (autofill & questions)
    expect(screen.getByText(/Standard Portal Application Fields/i)).toBeInTheDocument();
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();

    // Switching to Company Focus Guidance
    fireEvent.click(companyTab);
    expect(screen.getByText(/Site-verified company guidance/i)).toBeInTheDocument();

    // Switching back to Screening Question Answers
    fireEvent.click(screeningTab);
    expect(screen.getByText(/Standard Portal Application Fields/i)).toBeInTheDocument();
  });

  it('renders Stage 2 (Late Stage / Interview Call Stage) grouped in an expandable "Round 2 & Offer Prep" module', () => {
    render(<ScreeningAnswersView {...defaultProps} />);

    // Stage 2 Module Header
    expect(screen.getByText(/STAGE 2 · LATE STAGE/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Round 2 & Offer Prep/i })).toBeInTheDocument();
    expect(screen.getByText(/Interview Call Stage/i)).toBeInTheDocument();

    // Collapsed by default so first-round applicants aren't overwhelmed by salary tactics
    const expandBtn = screen.getByRole('button', { name: /Expand Round 2 & Offer Prep/i });
    expect(expandBtn).toBeInTheDocument();
    expect(screen.getByText(/First-round applicant\? Focus on Stage 1 above/i)).toBeInTheDocument();

    // Salary negotiation inputs should NOT be visible when collapsed
    expect(screen.queryByText(/Initial Offered Base Salary:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/AI STAR INTERVIEW COACH/i)).not.toBeInTheDocument();
  });

  it('expands "Round 2 & Offer Prep" to reveal Behavioral Mock Coach and Salary Negotiation Battlecards', () => {
    render(<ScreeningAnswersView {...defaultProps} />);

    // Click to expand Stage 2
    const expandBtn = screen.getByRole('button', { name: /Expand Round 2 & Offer Prep/i });
    fireEvent.click(expandBtn);

    // Expand button switches to collapse
    expect(screen.getByRole('button', { name: /Collapse Round 2 & Offer Prep/i })).toBeInTheDocument();

    // Stage 2 Tabs are revealed
    const behavioralTab = screen.getByRole('button', { name: /Behavioral STAR Mock Interview Coach/i });
    const negotiationTab = screen.getByRole('button', { name: /Salary Negotiation Battlecards/i });
    expect(behavioralTab).toBeInTheDocument();
    expect(negotiationTab).toBeInTheDocument();

    // Default Stage 2 tool: Behavioral STAR Coach
    expect(screen.getByText(/AI STAR INTERVIEW COACH/i)).toBeInTheDocument();
    expect(screen.getByText(/Behavioral Practice & AI STAR Scoring/i)).toBeInTheDocument();

    // Switch to Salary Negotiation Battlecards
    fireEvent.click(negotiationTab);
    expect(screen.getByText(/OFFER & COMPENSATION COPILOT/i)).toBeInTheDocument();
    expect(screen.getByText(/Strategic Salary Counter & Negotiation Prep/i)).toBeInTheDocument();
    expect(screen.getByText(/Initial Offered Base Salary:/i)).toBeInTheDocument();

    // Collapse module back
    fireEvent.click(screen.getByRole('button', { name: /Collapse Round 2 & Offer Prep/i }));
    expect(screen.getByRole('button', { name: /Expand Round 2 & Offer Prep/i })).toBeInTheDocument();
    expect(screen.queryByText(/Initial Offered Base Salary:/i)).not.toBeInTheDocument();
  });
});
