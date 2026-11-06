import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('gsap', () => ({ default: {
  registerPlugin: vi.fn(),
  context: () => ({ revert: vi.fn() }),
  ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
} }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { update: vi.fn() } }));
vi.mock('lenis', () => ({ default: class { on() {} raf() {} destroy() {} } }));

import { CinematicHome } from '@/jobstudio/components/CinematicHome';

afterEach(cleanup);

describe('Landing search navigation', () => {
  it('opens signup/sign-in from search action', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const navigate = vi.fn();
    render(<CinematicHome onNavigateToTab={navigate} />);
    const action = screen.getByRole('button', { name: 'Start searching jobs' });
    expect(action).toBeInTheDocument();
    fireEvent.click(action);
    expect(navigate).toHaveBeenCalledExactlyOnceWith('auth');
    vi.unstubAllGlobals();
  });
});