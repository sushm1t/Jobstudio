import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { WorkspaceNavigation } from '@/jobstudio/components/WorkspaceNavigation';

afterEach(cleanup);

const baseProps = {
  activeTab: 'resume',
  appliedCount: 3,
  userName: 'Alex Example',
  isProUser: false,
  tailoredCount: 1,
  onLogout: vi.fn(),
};

describe('Workspace brand navigation', () => {
  it('does not render the top-bar Export PDF button', () => {
    render(<WorkspaceNavigation {...baseProps} setActiveTab={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /export pdf/i })).toBeNull();
  });

  it('the Job Studio brand button opens the public landing page', () => {
    const setActiveTab = vi.fn();
    render(<WorkspaceNavigation {...baseProps} setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByRole('button', { name: /job studio/i }));
    expect(setActiveTab).toHaveBeenCalledExactlyOnceWith('home');
  });

  it('the View website button opens the public landing page', () => {
    const setActiveTab = vi.fn();
    render(<WorkspaceNavigation {...baseProps} setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByRole('button', { name: /view website/i }));
    expect(setActiveTab).toHaveBeenCalledExactlyOnceWith('home');
  });

  it('renders the active role badge when an active role is provided', () => {
    render(
      <WorkspaceNavigation
        {...baseProps}
        setActiveTab={vi.fn()}
        activeRole="Active: Senior Product Designer @ Figma"
      />
    );
    expect(screen.getAllByText('Active: Senior Product Designer @ Figma').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the grouped stages in the navigation and mobile selector', () => {
    render(<WorkspaceNavigation {...baseProps} setActiveTab={vi.fn()} />);
    expect(screen.getByText('Core Workflow')).toBeInTheDocument();
    expect(screen.getByText('Candidate Base')).toBeInTheDocument();
    expect(screen.getByText('Career Growth')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Job Evaluator' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Applied Jobs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Master Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tailored Documents' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Interview Prep' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Career Roadmaps' })).toBeInTheDocument();
  });
});
