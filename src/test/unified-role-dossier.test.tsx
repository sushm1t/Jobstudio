import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { JobEvaluatorView } from '@/jobstudio/components/JobEvaluatorView';
import { EMPTY_EVALUATION, MASTER_BASE_RESUME, EMPTY_COVER_LETTER } from '@/jobstudio/data/defaultData';

afterEach(cleanup);

describe('Unified Role Dossier (Eliminating Tab Jumping)', () => {
  const activeRoleEvaluation = {
    ...EMPTY_EVALUATION,
    job_title: 'Senior Product Designer',
    company_name: 'Figma',
    location_info: 'San Francisco, CA',
    match_score: 88,
    verdict: 'STRONG_MATCH',
    should_apply: true,
    executive_summary: 'Exceptional alignment with design systems and cross-functional leadership.',
    key_matching_factors: [
      'Extensive experience with Figma Tokens and Component Architecture',
      'Track record scaling multi-platform mobile and web products',
    ],
    tailoring_recommendations: [
      'Emphasize measurable outcomes in enterprise design adoption',
    ],
    missing_critical_skills: [
      'Design Token CI/CD integration (mitigated by deep GitHub and npm publishing workflows)',
    ],
  };

  const mockInterviewQuestions = [
    {
      question: 'Tell me about how you scaled a complex design system across multiple product teams.',
      category: 'Technical & Operational',
      source: 'Figma Candidate Portal Report',
      why_asked: 'Verifies systems thinking and ability to prevent divergence at scale.',
      key_talking_points: [
        'Situation: 5 divergent teams creating duplicate components.',
        'Task: Unify under a single semantic token architecture.',
        'Action: Created token taxonomy and weekly design reviews.',
        'Result: Cut component duplication by 65%.',
      ],
      suggested_answer: 'I led the migration of 40+ core components into a semantic token system with automated changelogs.',
    },
  ];

  const defaultProps = {
    evaluation: activeRoleEvaluation,
    isEvaluationComplete: true,
    opportunities: [],
    selectedJobId: 'job-figma',
    customJobText: '',
    setCustomJobText: vi.fn(),
    customUrl: '',
    setCustomUrl: vi.fn(),
    onEvaluate: vi.fn(),
    isLoading: false,
    onProceedToResume: vi.fn(),
    onSelectPreset: vi.fn(),
    onOpenTab: vi.fn(),
    onTrackApplication: vi.fn(),
    resume: MASTER_BASE_RESUME,
    setResume: vi.fn(),
    coverLetter: EMPTY_COVER_LETTER,
    interviewQuestions: mockInterviewQuestions,
    onFetchInterviewPrep: vi.fn(),
    isFetchingInterviewPrep: false,
  };

  it('renders Fit Analysis & Committee Review by default without duplicate pill navigation', () => {
    const { container } = render(<JobEvaluatorView {...defaultProps} />);

    // Role header & score
    expect(screen.getByText('Senior Product Designer')).toBeInTheDocument();
    expect(screen.getByText('Figma')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();

    // Hiring committee review
    expect(screen.getByText(/Hiring Committee Feedback/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Lead Recruiter/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hiring Manager/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Domain Lead/i).length).toBeGreaterThan(0);

    // Matching qualifications and gaps
    expect(screen.getByText(/Matching Qualifications/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Gaps & Where to Work/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Tailoring Recommendations/i)).toBeInTheDocument();

    // Verify duplicate pill navigation and redundant next steps grid are completely removed
    expect(container.querySelector('.role-dossier-nav')).toBeNull();
    expect(screen.queryByText(/Next Steps for this Role/i)).toBeNull();
  });

  it('provides a single canonical Review Tailored Application CTA that hands over to studio', () => {
    const onOpenTab = vi.fn();
    render(<JobEvaluatorView {...defaultProps} onOpenTab={onOpenTab} isEvaluationComplete={true} />);

    // Exactly 1 primary CTA to review tailored application
    const reviewButtons = screen.getAllByRole('button', { name: /Review Tailored Application/i });
    expect(reviewButtons.length).toBe(1);

    fireEvent.click(reviewButtons[0]!);
    expect(onOpenTab).toHaveBeenCalledWith('resume');
  });

  it('launches committee review exclusively from the Hiring Committee Feedback card', () => {
    const onOpenRecruiterReview = vi.fn();
    render(
      <JobEvaluatorView
        {...defaultProps}
        onOpenRecruiterReview={onOpenRecruiterReview}
      />
    );

    // Single contextual button on the Hiring Committee card
    const panelButtons = screen.getAllByRole('button', { name: /Launch Panel Review/i });
    expect(panelButtons.length).toBe(1);

    fireEvent.click(panelButtons[0]!);
    expect(onOpenRecruiterReview).toHaveBeenCalled();
  });

  it('progressively discloses the Skill Roadmap & Certifications to minimize cognitive load', () => {
    const onOpenTab = vi.fn();
    render(<JobEvaluatorView {...defaultProps} onOpenTab={onOpenTab} isEvaluationComplete={true} />);

    // Roadmap title and collapsed summary are visible
    expect(screen.getByText(/Skill Roadmap & Certifications/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Bridge Plan/i })).toBeInTheDocument();

    // The detailed learning roadmap is collapsed by default
    expect(screen.queryByText(/Learning Roadmap/i)).toBeNull();
    expect(screen.queryByText(/Target Certifications/i)).toBeNull();

    // Clicking Career Roadmaps navigates to the dedicated workspace tab
    const roadmapTabBtn = screen.getByRole('button', { name: /Career Roadmaps/i });
    fireEvent.click(roadmapTabBtn);
    expect(onOpenTab).toHaveBeenCalledWith('roadmaps');

    // Clicking View Bridge Plan expands the in-place curriculum
    fireEvent.click(screen.getByRole('button', { name: /View Bridge Plan/i }));
    expect(screen.getByText(/Learning Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Certifications/i)).toBeInTheDocument();

    // Clicking Hide Bridge Plan collapses it back
    fireEvent.click(screen.getByRole('button', { name: /Hide Bridge Plan/i }));
    expect(screen.queryByText(/Learning Roadmap/i)).toBeNull();
  });
});
