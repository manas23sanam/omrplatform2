import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TeacherDashboard } from '../../pages/teacher/TeacherDashboard';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('TeacherDashboard Page (AC2)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderDashboard = () => {
    return render(
      <MemoryRouter>
        <LearningStoreProvider>
          <TeacherDashboard />
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders Teacher Dashboard header with active batch and student count', () => {
    renderDashboard();
    expect(screen.getByText('Class Diagnostic Overview')).toBeInTheDocument();
    expect(screen.getByText(/Real-time Faculty Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Sync Active/i)).toBeInTheDocument();
  });

  it('renders 4 KPI Summary Cards with class metrics', () => {
    renderDashboard();

    // Total Tests KPI
    expect(screen.getByText('Tests Conducted')).toBeInTheDocument();
    // Class Avg Score KPI
    expect(screen.getByText('Class Avg Score')).toBeInTheDocument();
    // Class Accuracy KPI
    expect(screen.getByText('Avg Accuracy')).toBeInTheDocument();
    // Active Students KPI
    expect(screen.getByText('Active Students')).toBeInTheDocument();
  });

  it('renders visible charts: ClassPerformanceChart and SubjectMasteryChart', () => {
    renderDashboard();

    // Chart titles
    expect(screen.getByText('Class Performance Over Time')).toBeInTheDocument();
    expect(screen.getByText('Subject Mastery Comparison')).toBeInTheDocument();

    // Recharts responsive containers
    const chartContainers = screen.getAllByTestId('responsive-container');
    expect(chartContainers.length).toBeGreaterThanOrEqual(2);

    // Subject breakdown labels
    expect(screen.getByText(/Physics/i)).toBeInTheDocument();
    expect(screen.getByText(/Chemistry/i)).toBeInTheDocument();
    expect(screen.getByText(/Biology/i)).toBeInTheDocument();
  });

  it('renders Frequently Missed Questions Table and allows opening remediation modal', () => {
    renderDashboard();

    expect(screen.getByText('Frequently Missed Questions Diagnostic')).toBeInTheDocument();

    // Locate Assign Drill buttons in the table
    const assignButtons = screen.getAllByRole('button', { name: /assign drill/i });
    expect(assignButtons.length).toBeGreaterThan(0);

    // Click first assign button
    fireEvent.click(assignButtons[0]);

    // Verify Remediation Modal opens
    expect(screen.getByText(/Assign Targeted Remediation/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Concept \/ Gap/i)).toBeInTheDocument();
  });

  it('dispatches remediation drill from modal and displays success notification', () => {
    renderDashboard();

    const assignButtons = screen.getAllByRole('button', { name: /assign drill/i });
    fireEvent.click(assignButtons[0]);

    // Click confirm dispatch inside modal
    const dispatchButton = screen.getByRole('button', { name: /dispatch drill/i });
    fireEvent.click(dispatchButton);

    // Success alert should appear
    expect(screen.getByText(/assigned to/i)).toBeInTheDocument();
  });
});
