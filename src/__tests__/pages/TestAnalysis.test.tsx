import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TestAnalysis } from '../../pages/student/TestAnalysis';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('TestAnalysis Page (F16)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderTestAnalysis = (testId = 'paper-01') => {
    return render(
      <MemoryRouter initialEntries={[`/student/analysis/${testId}`]}>
        <LearningStoreProvider>
          <Routes>
            <Route path="/student/analysis/:testId" element={<TestAnalysis />} />
            <Route path="/student/dashboard" element={<div>Dashboard Mock</div>} />
            <Route path="/student/mock-tests" element={<div>Mock Tests Mock</div>} />
            <Route path="/student/upload" element={<div>Upload Mock</div>} />
          </Routes>
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders streamlined hero banner with test title, section scope, and feedback summary', () => {
    renderTestAnalysis();

    expect(screen.getByText(/Scope/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Student Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders subject breakdown cards, concept gaps, and recovery roadmap', () => {
    renderTestAnalysis();

    expect(screen.getByText('Physics')).toBeInTheDocument();
    expect(screen.getByText('Chemistry')).toBeInTheDocument();
    expect(screen.getByText('Biology')).toBeInTheDocument();
    expect(screen.getByText('Weak Topics & Improvement Scope')).toBeInTheDocument();
    expect(screen.getByText(/Recovery Roadmap/i)).toBeInTheDocument();
  });

  it('renders comprehensive question breakdown table with student vs correct choices', () => {
    renderTestAnalysis();

    expect(screen.getByText('Question-by-Question Review')).toBeInTheDocument();
    expect(screen.getAllByText(/Q\d+/i).length).toBeGreaterThan(0);
  });
});

