import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StudentDashboard } from '../../pages/student/StudentDashboard';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('StudentDashboard Page (AC6)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderStudentDashboard = () => {
    return render(
      <MemoryRouter initialEntries={['/student/dashboard']}>
        <LearningStoreProvider>
          <Routes>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Routes>
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders student greeting and quick action banner', () => {
    renderStudentDashboard();

    expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument();
    expect(screen.getByText('Upload OMR Sheet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /upload omr now/i })).toBeInTheDocument();
  });

  it('renders 4 snapshot cards including daily streak and accuracy', () => {
    renderStudentDashboard();

    expect(screen.getByText('Latest Score')).toBeInTheDocument();
    expect(screen.getByText('Overall Accuracy')).toBeInTheDocument();
    expect(screen.getByText('Cohort Rank')).toBeInTheDocument();
    expect(screen.getByText('Daily Streak')).toBeInTheDocument();
  });

  it('displays the gamification section featuring an XP score, level progress, and streak', () => {
    renderStudentDashboard();

    // XP & Streak Widget
    expect(screen.getByText(/Total XP/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Streak/i)).toBeInTheDocument();
    expect(screen.getByText(/Progress to Level/i)).toBeInTheDocument();
    expect(screen.getByText(/7-Day Study Calendar/i)).toBeInTheDocument();
  });

  it('renders the visible BatchLeaderboard component with podium and ranked peers', () => {
    renderStudentDashboard();

    // Leaderboard header
    expect(screen.getByText('Cohort League Standings')).toBeInTheDocument();
    expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();

    // Podium ranks #1, #2, #3
    expect(screen.getAllByText(/#1|#2|#3/i).length).toBeGreaterThan(0);
  });
});
