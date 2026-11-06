import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CareerRoadmapsView } from '@/jobstudio/components/CareerRoadmapsView';
import { CAREER_ROADMAPS } from '@/jobstudio/data/roadmapData';

afterEach(cleanup);

describe('CareerRoadmapsView Layout and Filtering', () => {
  it('renders all domain category pills with full names and un-truncated text', () => {
    render(<CareerRoadmapsView />);

    // Header and search bar
    expect(screen.getByText('Learning Paths for 2026 Careers')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search roles, skills, or tech/i)).toBeInTheDocument();

    // All categories exist with full labels
    expect(screen.getByRole('button', { name: /^All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Engineering/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^AI & Data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Cloud & DevOps/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Operations/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Product & Project/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Solutions & GTM/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Business & Finance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Travel & Hospitality/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Creative & Design/i })).toBeInTheDocument();
  });

  it('filters by category and allows resetting filters', () => {
    render(<CareerRoadmapsView />);

    // Click on Operations category
    const opsButton = screen.getByRole('button', { name: /^Operations/i });
    fireEvent.click(opsButton);

    // Should filter to Operations roadmaps
    expect(screen.getByText('Operations & Workforce Management (WFM)')).toBeInTheDocument();

    // Click Reset Filters
    const resetBtn = screen.getByRole('button', { name: /Reset filters/i });
    fireEvent.click(resetBtn);

    // All roadmaps should be visible again
    expect(screen.getByText('New Grad SWE')).toBeInTheDocument();
  });

  it('displays a friendly empty state when no roadmaps match search', () => {
    render(<CareerRoadmapsView />);

    const searchInput = screen.getByPlaceholderText(/Search roles, skills, or tech/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistentrole12345' } });

    expect(screen.getByText('No learning paths found')).toBeInTheDocument();
    const resetBtn = screen.getByRole('button', { name: 'Reset Filters' });
    fireEvent.click(resetBtn);

    expect(screen.getByText('New Grad SWE')).toBeInTheDocument();
  });
});
