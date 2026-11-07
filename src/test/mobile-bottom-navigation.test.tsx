import React from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkspaceNavigation } from '@/jobstudio/components/WorkspaceNavigation';

afterEach(cleanup);

describe('Task 8: Mobile Bottom Navigation Bar & Drawer', () => {
  const baseProps = {
    activeTab: 'evaluator',
    setActiveTab: vi.fn(),
    appliedCount: 4,
    userName: 'Alex Rivera',
    userPlan: 'pro' as const,
    isProUser: true,
    tailoredCount: 12,
    onLogout: vi.fn(),
    onStartTour: vi.fn(),
    onReportBug: vi.fn(),
  };

  it('renders the mobile bottom navigation bar with 4 primary tabs and Menu button', () => {
    const { container } = render(<WorkspaceNavigation {...baseProps} />);

    // Bottom navigation container exists and is md:hidden
    const bottomNav = container.querySelector('nav[aria-label="Mobile workspace navigation"]');
    expect(bottomNav).toBeInTheDocument();
    expect(bottomNav).toHaveClass('md:hidden', 'fixed', 'bottom-0', 'left-0', 'right-0');

    // 4 primary tabs + Menu within the bottom nav
    expect(within(bottomNav!).getByRole('button', { name: 'Profile' })).toBeInTheDocument();
    expect(within(bottomNav!).getByRole('button', { name: 'Jobs' })).toBeInTheDocument();
    expect(within(bottomNav!).getByRole('button', { name: 'Docs' })).toBeInTheDocument();
    expect(within(bottomNav!).getByRole('button', { name: 'Tracker' })).toBeInTheDocument();
    expect(within(bottomNav!).getByRole('button', { name: 'Menu' })).toBeInTheDocument();

    // Tracker shows applied count badge
    expect(within(bottomNav!).getByText('4')).toBeInTheDocument();
  });

  it('highlights the active tab with text-brand styling', () => {
    render(<WorkspaceNavigation {...baseProps} activeTab="evaluator" />);

    const jobsBtn = screen.getByRole('button', { name: 'Jobs' });
    expect(jobsBtn).toHaveClass('text-brand', 'font-semibold');

    const profileBtn = screen.getByRole('button', { name: 'Profile' });
    expect(profileBtn).not.toHaveClass('text-brand');
  });

  it('clicking bottom nav tabs calls setActiveTab immediately', () => {
    const setActiveTab = vi.fn();
    render(<WorkspaceNavigation {...baseProps} setActiveTab={setActiveTab} />);

    fireEvent.click(screen.getByRole('button', { name: 'Profile' }));
    expect(setActiveTab).toHaveBeenCalledWith('profile');

    fireEvent.click(screen.getByRole('button', { name: 'Docs' }));
    expect(setActiveTab).toHaveBeenCalledWith('resume');

    fireEvent.click(screen.getByRole('button', { name: 'Tracker' }));
    expect(setActiveTab).toHaveBeenCalledWith('applied');
  });

  it('tapping Menu opens the slide-up drawer containing secondary tabs and utility actions', () => {
    const setActiveTab = vi.fn();
    const onStartTour = vi.fn();
    const onReportBug = vi.fn();
    const onLogout = vi.fn();

    render(
      <WorkspaceNavigation
        {...baseProps}
        setActiveTab={setActiveTab}
        onStartTour={onStartTour}
        onReportBug={onReportBug}
        onLogout={onLogout}
      />
    );

    // Drawer is closed initially
    expect(screen.queryByRole('dialog', { name: 'More navigation options' })).not.toBeInTheDocument();

    // Tap Menu button
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

    // Drawer opens
    const drawer = screen.getByRole('dialog', { name: 'More navigation options' });
    expect(drawer).toBeInTheDocument();

    // Secondary tabs in drawer
    expect(within(drawer).getByRole('button', { name: /career roadmaps/i })).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: /interview prep/i })).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: /pricing & plans/i })).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: /take the tour/i })).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: /report a bug/i })).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: /sign out/i })).toBeInTheDocument();

    // Tap Career Roadmaps in drawer
    fireEvent.click(within(drawer).getByRole('button', { name: /career roadmaps/i }));
    expect(setActiveTab).toHaveBeenCalledWith('roadmaps');

    // Drawer closes after selection
    expect(screen.queryByRole('dialog', { name: 'More navigation options' })).not.toBeInTheDocument();
  });

  it('completely removes the outdated HTML <select> dropdown from the DOM', () => {
    const { container } = render(<WorkspaceNavigation {...baseProps} />);

    expect(container.querySelector('select')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/workspace section/i)).not.toBeInTheDocument();
  });
});
