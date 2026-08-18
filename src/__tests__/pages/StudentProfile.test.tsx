import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StudentProfile } from '../../pages/student/StudentProfile';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('StudentProfile Page (AC5 - Profile)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderProfilePage = () => {
    return render(
      <MemoryRouter initialEntries={['/student/profile']}>
        <LearningStoreProvider>
          <Routes>
            <Route path="/student/profile" element={<StudentProfile />} />
          </Routes>
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders student profile hero banner with name, batch, and level badge', () => {
    renderProfilePage();

    expect(screen.getByText(/Level \d • /i)).toBeInTheDocument();
    expect(screen.getByText('Study Streak')).toBeInTheDocument();
    expect(screen.getByText('Total XP Points')).toBeInTheDocument();
    expect(screen.getByText('Cohort Rank')).toBeInTheDocument();
    expect(screen.getByText('Average Accuracy')).toBeInTheDocument();
  });

  it('renders XP Level Progress and study widget', () => {
    renderProfilePage();

    expect(screen.getByText(/Total XP/i)).toBeInTheDocument();
    expect(screen.getByText(/7-Day Study Calendar/i)).toBeInTheDocument();
  });

  it('renders score improvement trends chart', () => {
    renderProfilePage();

    expect(screen.getByText('Score Improvement Trajectory')).toBeInTheDocument();
    const chartContainers = screen.getAllByTestId('responsive-container');
    expect(chartContainers.length).toBeGreaterThan(0);
  });

  it('renders subject mastery breakdown and test history table', () => {
    renderProfilePage();

    expect(screen.getByText('Subject Mastery Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Evaluation & Test History Log')).toBeInTheDocument();
  });

  it('renders badge gallery with unlocked and locked achievements', () => {
    renderProfilePage();

    expect(screen.getByText('Achievement Badges & Mastery Honors')).toBeInTheDocument();
  });
});
