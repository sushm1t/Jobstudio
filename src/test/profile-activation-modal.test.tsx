import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProfileActivationModal } from '@/jobstudio/components/onboarding/ProfileActivationModal';
import { SAMPLE_CANDIDATE_PROFILE } from '@/jobstudio/data/candidateProfiles';

afterEach(cleanup);

describe('ProfileActivationModal (Profile-First Activation Flow)', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ProfileActivationModal
        isOpen={false}
        onClose={vi.fn()}
        onNavigateToProfile={vi.fn()}
        onApplySampleProfile={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders heading, description, and action buttons when open', () => {
    render(
      <ProfileActivationModal
        isOpen={true}
        onClose={vi.fn()}
        onNavigateToProfile={vi.fn()}
        onApplySampleProfile={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { name: /Ground your workspace in your real experience/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Job Studio tailors documents using your genuine career accomplishments/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Master Profile \(60 sec\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Explore with Sample Profile/i })
    ).toBeInTheDocument();
  });

  it('navigates to master profile on primary CTA click', () => {
    const onNavigateToProfile = vi.fn();
    const onClose = vi.fn();

    render(
      <ProfileActivationModal
        isOpen={true}
        onClose={onClose}
        onNavigateToProfile={onNavigateToProfile}
        onApplySampleProfile={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Add Master Profile \(60 sec\)/i }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onNavigateToProfile).toHaveBeenCalledOnce();
  });

  it('applies sample profile on secondary CTA click', () => {
    const onApplySampleProfile = vi.fn();
    const onClose = vi.fn();

    render(
      <ProfileActivationModal
        isOpen={true}
        onClose={onClose}
        onNavigateToProfile={vi.fn()}
        onApplySampleProfile={onApplySampleProfile}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Explore with Sample Profile/i }));
    expect(onApplySampleProfile).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('provides a valid curated sample profile object with rich experience and skills', () => {
    expect(SAMPLE_CANDIDATE_PROFILE.name).toBe('Alex Rivera');
    expect(SAMPLE_CANDIDATE_PROFILE.skills.length).toBeGreaterThanOrEqual(5);
    expect(SAMPLE_CANDIDATE_PROFILE.experiences.length).toBeGreaterThanOrEqual(2);
    expect(SAMPLE_CANDIDATE_PROFILE.masterProfileText).toContain('Alex Rivera');
  });
});

