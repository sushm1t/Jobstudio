import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportBugModal } from '@/jobstudio/components/ReportBugModal';
import { WorkspaceNavigation } from '@/jobstudio/components/WorkspaceNavigation';

describe('Bug Reporting System', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders ReportBugModal with all required fields when open', () => {
    render(
      <ReportBugModal
        isOpen={true}
        onClose={vi.fn()}
        userEmail="test@example.com"
        activeTab="evaluator"
        activeRole="Senior Frontend Engineer"
      />
    );

    expect(screen.getByText(/report a bug or issue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/area \/ category/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. work experience timeline/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe what happened/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit bug report/i })).toBeInTheDocument();

    // Verify user-facing cognitive load elements are removed
    expect(screen.queryByText(/severity/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cmd\+v|ctrl\+v/i)).not.toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ReportBugModal
        isOpen={false}
        onClose={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('toggles diagnostic details visibility', () => {
    render(
      <ReportBugModal
        isOpen={true}
        onClose={vi.fn()}
        userEmail="dev@jobstudio.ai"
        activeTab="resume"
        activeRole="Staff Engineer"
      />
    );

    const toggleButton = screen.getByText(/auto-included environment & diagnostics/i);
    expect(screen.queryByText(/page tab:/i)).not.toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText(/page tab:/i)).toBeInTheDocument();
    expect(screen.getByText(/staff engineer/i)).toBeInTheDocument();
  });

  it('submits bug report successfully with diagnostics and shows reference ID', async () => {
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        id: 'BUG-M4X9-8123',
        message: 'Bug report received successfully.',
      }),
    });
    global.fetch = fakeFetch;

    render(
      <ReportBugModal
        isOpen={true}
        onClose={vi.fn()}
        userEmail="candidate@domain.com"
        activeTab="screening"
      />
    );

    const subjectInput = screen.getByPlaceholderText(/e\.g\. work experience timeline/i);
    const descriptionInput = screen.getByPlaceholderText(/describe what happened/i);

    fireEvent.change(subjectInput, { target: { value: 'Broken PDF download formatting' } });
    fireEvent.change(descriptionInput, { target: { value: 'Clicking ATS PDF download resulted in blank second page.' } });

    const submitBtn = screen.getByRole('button', { name: /submit bug report/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fakeFetch).toHaveBeenCalledWith(
        '/api/report-bug',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    const firstCall = fakeFetch.mock.calls[0];
    expect(firstCall).toBeDefined();
    const body = JSON.parse(firstCall![1]!.body as string);
    expect(body.subject).toBe('Broken PDF download formatting');
    expect(body.description).toBe('Clicking ATS PDF download resulted in blank second page.');
    expect(body.severity).toBe('medium');
    expect(body.diagnostics.activeTab).toBe('screening');

    // Shows success screen
    await waitFor(() => {
      expect(screen.getByText(/bug report submitted successfully!/i)).toBeInTheDocument();
      expect(screen.getByText(/BUG-M4X9-8123/i)).toBeInTheDocument();
    });
  });

  it('handles server failure gracefully with error banner', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Database connection failed. Please retry later.',
      }),
    });

    render(
      <ReportBugModal
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. work experience timeline/i), {
      target: { value: 'Missing skills tags' },
    });
    fireEvent.change(screen.getByPlaceholderText(/describe what happened/i), {
      target: { value: 'Tags did not render on page load.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit bug report/i }));

    await waitFor(() => {
      expect(screen.getByText(/database connection failed/i)).toBeInTheDocument();
    });
  });

  it('renders exactly one report a bug button in WorkspaceNavigation sidebar', () => {
    const onReportBugMock = vi.fn();
    render(
      <WorkspaceNavigation
        activeTab="evaluator"
        setActiveTab={vi.fn()}
        appliedCount={3}
        userName="Alex Morgan"
        isProUser={true}
        tailoredCount={5}
        onLogout={vi.fn()}
        onReportBug={onReportBugMock}
      />
    );

    const bugButtons = screen.getAllByRole('button', { name: /report a bug|report bug/i });
    expect(bugButtons).toHaveLength(1);

    fireEvent.click(bugButtons[0]!);
    expect(onReportBugMock).toHaveBeenCalledTimes(1);
  });
});

