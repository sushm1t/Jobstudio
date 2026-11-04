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
  it.each([0, 1])('opens signup/sign-in from search action %i', (index) => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const navigate = vi.fn();
    render(<CinematicHome onNavigateToTab={navigate} />);
    const action = screen.getAllByRole('button', { name: 'Start searching jobs' })[index];
    if (!action) throw new Error(`Missing landing search action ${index}`);
    fireEvent.click(action);
    expect(navigate).toHaveBeenCalledExactlyOnceWith('auth');
    vi.unstubAllGlobals();
  });
});