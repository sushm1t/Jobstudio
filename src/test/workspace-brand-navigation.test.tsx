import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { WorkspaceNavigation } from '@/jobstudio/components/WorkspaceNavigation';

afterEach(cleanup);

const baseProps = {
  activeTab: 'resume',
  appliedCount: 3,
  userName: 'Alex M',
  isProUser: false,
  tailoredCount: 1,
  onLogout: vi.fn(),
  onDownloadPdf: vi.fn(),
  isDownloading: false,
  downloadSuccess: false,
};

describe('Workspace brand navigation', () => {
  it('the Job Studio brand button returns to the workspace, not the landing page', () => {
    const setActiveTab = vi.fn();
    render(<WorkspaceNavigation {...baseProps} setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByRole('button', { name: /job studio/i }));
    expect(setActiveTab).toHaveBeenCalledExactlyOnceWith('evaluator');
  });

  it('the View website button opens the public landing page', () => {
    const setActiveTab = vi.fn();
    render(<WorkspaceNavigation {...baseProps} setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByRole('button', { name: /view website/i }));
    expect(setActiveTab).toHaveBeenCalledExactlyOnceWith('home');
  });
});
