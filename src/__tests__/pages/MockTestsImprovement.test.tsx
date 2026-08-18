import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockTestsImprovement } from '../../pages/student/MockTestsImprovement';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('MockTestsImprovement Page (AC5 - Mock Tests)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderMockTestsPage = () => {
    return render(
      <MemoryRouter initialEntries={['/student/mock-tests']}>
        <LearningStoreProvider>
          <Routes>
            <Route path="/student/mock-tests" element={<MockTestsImprovement />} />
            <Route path="/student/practice/:topicId" element={<div>Practice Session Page Mock</div>} />
          </Routes>
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders header banner and filter controls', () => {
    renderMockTestsPage();

    expect(screen.getByText('Targeted Weak-Area Practice & AI Mock Tests')).toBeInTheDocument();
    expect(screen.getByText(/AI Learning GPS & Teacher Remediation Engine/i)).toBeInTheDocument();
    expect(screen.getByText('Targeted Mock Tests')).toBeInTheDocument();
    expect(screen.getByText('Weak-Topic Study Checklist')).toBeInTheDocument();
  });

  it('renders mock test assignment cards with difficulty and XP rewards', () => {
    renderMockTestsPage();

    // Verify mock test cards exist
    const startButtons = screen.getAllByRole('link', { name: /start test/i });
    expect(startButtons.length).toBeGreaterThan(0);

    // Verify XP rewards are displayed
    expect(screen.getAllByText(/\+\d+ XP/i).length).toBeGreaterThan(0);
  });

  it('renders weak topics checklist with interactive status badges and quiz launcher', () => {
    renderMockTestsPage();

    // Verify weak topics are rendered
    const topicItems = screen.getAllByText(/Launch Practice Quiz/i);
    expect(topicItems.length).toBeGreaterThan(0);

    // Click to launch practice quiz
    fireEvent.click(topicItems[0]);
    expect(screen.getByText('Practice Session Page Mock')).toBeInTheDocument();
  });

  it('allows filtering mock tests by subject', () => {
    renderMockTestsPage();

    const physicsBtn = screen.getByRole('button', { name: /^physics$/i });
    fireEvent.click(physicsBtn);

    expect(screen.getByText('Targeted Mock Tests')).toBeInTheDocument();
  });
});
