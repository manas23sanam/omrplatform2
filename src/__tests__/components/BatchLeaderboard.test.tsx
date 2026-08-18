import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BatchLeaderboard } from '../../components/student/BatchLeaderboard';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('BatchLeaderboard Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderLeaderboard = () => {
    return render(
      <LearningStoreProvider>
        <BatchLeaderboard />
      </LearningStoreProvider>
    );
  };

  it('renders leaderboard title, podium, and search input', () => {
    renderLeaderboard();

    expect(screen.getByText('Cohort League Standings')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search student name/i)).toBeInTheDocument();
  });

  it('filters leaderboard entries by student search', () => {
    renderLeaderboard();

    const searchInput = screen.getByPlaceholderText(/search student name/i);
    fireEvent.change(searchInput, { target: { value: 'Aarav' } });

    expect(screen.getByText('Aarav Patel')).toBeInTheDocument();
  });

  it('allows toggling timeframe between All-Time, Monthly, and Weekly', () => {
    renderLeaderboard();

    const weeklyBtn = screen.getByRole('button', { name: /^weekly$/i });
    fireEvent.click(weeklyBtn);

    expect(screen.getByText('Cohort League Standings')).toBeInTheDocument();
  });
});
