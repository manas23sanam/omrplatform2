import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StudentDeepDive } from '../../pages/teacher/StudentDeepDive';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('StudentDeepDive Page (AC3)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderDeepDive = (initialRoute = '/teacher/students') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <LearningStoreProvider>
          <Routes>
            <Route path="/teacher/students" element={<StudentDeepDive />} />
            <Route path="/teacher/students/:id" element={<StudentDeepDive />} />
          </Routes>
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders navigable student roster with search input and quartile filters', () => {
    renderDeepDive();

    expect(screen.getByPlaceholderText(/search name, roll#, email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all \(/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /top 80%\+/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /67-80%/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remediation \(<67%\)/i })).toBeInTheDocument();
  });

  it('filters students by search query in roster', () => {
    renderDeepDive();

    const searchInput = screen.getByPlaceholderText(/search name, roll#, email/i);
    fireEvent.change(searchInput, { target: { value: 'Ananya' } });

    expect(screen.getByText('Ananya Verma')).toBeInTheDocument();
  });

  it('selects a student from roster and displays detailed performance data', () => {
    renderDeepDive();

    // Default first student is active
    expect(screen.getByText('Student Deep Dive & Mistake Log')).toBeInTheDocument();
    expect(screen.getByText('Average Score')).toBeInTheDocument();
    expect(screen.getByText('Test Accuracy')).toBeInTheDocument();
    expect(screen.getByText('Total XP Earned')).toBeInTheDocument();
    expect(screen.getByText('Active Daily Streak')).toBeInTheDocument();
    expect(screen.getByText('Subject Mastery & Question Volume')).toBeInTheDocument();
  });

  it('displays historical score trajectory chart vs class benchmark', () => {
    renderDeepDive();

    expect(screen.getByText('Historical Score Trajectory vs Class Benchmark')).toBeInTheDocument();
    const chartContainers = screen.getAllByTestId('responsive-container');
    expect(chartContainers.length).toBeGreaterThan(0);
  });

  it('displays diagnosed mistakes log with student picked option, correct answer, and AI root cause diagnosis', () => {
    renderDeepDive();

    expect(screen.getByText('Diagnosed Mistakes & Remediation Log')).toBeInTheDocument();

    // Verify presence of picked vs correct option badges
    const studentPickedBadges = screen.getAllByText(/Student Picked:/i);
    expect(studentPickedBadges.length).toBeGreaterThan(0);

    const correctAnswerBadges = screen.getAllByText(/Correct Answer:/i);
    expect(correctAnswerBadges.length).toBeGreaterThan(0);

    // Verify presence of AI diagnosis
    const aiDiagnoses = screen.getAllByText(/AI Root Cause Diagnosis:/i);
    expect(aiDiagnoses.length).toBeGreaterThan(0);
  });

  it('allows filtering mistakes by subject dropdown', () => {
    renderDeepDive();

    const selectElements = screen.getAllByRole('combobox');
    const subjectSelect = selectElements[0]; // first select in mistake filter

    fireEvent.change(subjectSelect, { target: { value: 'Physics' } });
    expect(screen.getByText('Diagnosed Mistakes & Remediation Log')).toBeInTheDocument();
  });
});
