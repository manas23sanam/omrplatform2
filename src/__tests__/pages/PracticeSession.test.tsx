import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PracticeSession } from '../../pages/student/PracticeSession';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('PracticeSession Page (F21)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderPracticeSession = (topicId = 'topic-rotational-friction') => {
    return render(
      <MemoryRouter initialEntries={[`/student/practice/${topicId}`]}>
        <LearningStoreProvider>
          <Routes>
            <Route path="/student/practice/:topicId" element={<PracticeSession />} />
            <Route path="/student/mock-tests" element={<div>Mock Tests Page Mock</div>} />
          </Routes>
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders quiz interface with question text, options, and timer', () => {
    renderPracticeSession();

    expect(screen.getByText(/Targeted Concept Remediation Drill/i)).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
    expect(screen.getByText(/A\./i)).toBeInTheDocument();
    expect(screen.getByText(/B\./i)).toBeInTheDocument();
    expect(screen.getByText(/C\./i)).toBeInTheDocument();
    expect(screen.getByText(/D\./i)).toBeInTheDocument();
  });

  it('allows selecting an option and checking the answer with instant feedback', () => {
    renderPracticeSession();

    // Select option A
    const optionA = screen.getByText(/A\./i).closest('button');
    expect(optionA).not.toBeNull();
    fireEvent.click(optionA!);

    // Click Check Answer
    const checkBtn = screen.getByRole('button', { name: /check answer/i });
    fireEvent.click(checkBtn);

    // AI Derivation & Step-by-Step Explanation should appear
    expect(screen.getByText(/Step-by-Step AI Derivation/i)).toBeInTheDocument();
  });

  it('navigates across questions using Next Question button', () => {
    renderPracticeSession();

    const nextBtn = screen.getByRole('button', { name: /next question/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Question 2 of/i)).toBeInTheDocument();
  });

  it('submits quiz and displays score breakdown and XP earned', () => {
    renderPracticeSession();

    // Submit quiz
    const finishBtn = screen.getByRole('button', { name: /finish & grade drill/i });
    fireEvent.click(finishBtn);

    // Score summary banner
    expect(screen.getByText(/Drill Completed!/i)).toBeInTheDocument();
    expect(screen.getByText(/Accuracy Score/i)).toBeInTheDocument();
    expect(screen.getByText(/XP Reward Claimed/i)).toBeInTheDocument();
  });
});
