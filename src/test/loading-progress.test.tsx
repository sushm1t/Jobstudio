import React from 'react';
import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { estimatedProgressAt, useEstimatedProgress } from '@/jobstudio/utils/useEstimatedProgress';
import { LoadingProgress } from '@/jobstudio/components/LoadingProgress';
import { BusyIndicator } from '@/jobstudio/components/BusyIndicator';

afterEach(() => { cleanup(); vi.useRealTimers(); });

it('advances from 1 and holds below 100 while work is pending', () => {
  expect(estimatedProgressAt(0, 40)).toBe(1);
  expect(estimatedProgressAt(20, 40)).toBe(61);
  expect(estimatedProgressAt(400, 40)).toBe(95);
});

it('updates time estimates and reports overruns rather than promising imminent completion', () => {
  vi.useFakeTimers();
  const { result, rerender, unmount } = renderHook(({ active }) => useEstimatedProgress(active, 40), { initialProps: { active: true } });
  act(() => vi.advanceTimersByTime(20000));
  expect(result.current.progress).toBe(61);
  expect(result.current.etaLabel).toBe('About 20s remaining');
  act(() => vi.advanceTimersByTime(21000));
  expect(result.current.progress).toBe(95);
  expect(result.current.etaLabel).toBe('Taking longer than estimated · 41s elapsed');
  rerender({ active: false });
  expect(result.current.progress).toBe(0);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it('shows 100 only when a successful result changes, not when a request fails', () => {
  vi.useFakeTimers();
  const oldResult = { value: 'old' };
  const nextResult = { value: 'new' };
  const { rerender } = render(<LoadingProgress active label="Generating" resultToken={oldResult} />);
  rerender(<LoadingProgress active={false} label="Generating" resultToken={oldResult} />);
  expect(screen.queryByRole('progressbar')).toBeNull();
  rerender(<LoadingProgress active label="Generating" resultToken={oldResult} />);
  rerender(<LoadingProgress active={false} label="Generating" resultToken={nextResult} />);
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  act(() => vi.advanceTimersByTime(1500));
  expect(screen.queryByRole('progressbar')).toBeNull();
});

it('busy indicator for ordinary waits shows a spinner status without any percentage', () => {
  const { rerender } = render(<BusyIndicator active label="Signing in" />);
  expect(screen.getByRole('status')).toHaveTextContent('Signing in');
  expect(screen.queryByRole('progressbar')).toBeNull();
  expect(screen.queryByText(/%/)).toBeNull();
  rerender(<BusyIndicator active={false} label="Signing in" />);
  expect(screen.queryByRole('status')).toBeNull();
});

it('inline generation progresses from 1 to 100 only after its successful result changes', () => {
  vi.useFakeTimers();
  const { rerender } = render(<LoadingProgress inline active={false} label="Generating" idleLabel="Generate Answer" resultToken="old" />);
  expect(screen.queryByRole('progressbar')).toBeNull();
  rerender(<LoadingProgress inline active label="Generating" idleLabel="Generate Answer" resultToken="old" />);
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1');
  act(() => vi.advanceTimersByTime(40000));
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', '95');
  rerender(<LoadingProgress inline active={false} label="Generating" idleLabel="Generate Answer" resultToken="new" />);
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', '100');
  act(() => vi.advanceTimersByTime(1500));
  expect(screen.queryByRole('progressbar')).toBeNull();
});