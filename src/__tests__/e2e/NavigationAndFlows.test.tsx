import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('End-to-End Navigation and Flows', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('navigates through Teacher journey: Login -> Dashboard -> Student Deep Dive -> Tests', async () => {
    render(
      <LearningStoreProvider>
        <App />
      </LearningStoreProvider>
    );

    // Verify Login page is rendered at root
    expect(screen.getByText('Sign In to Your Learning Portal')).toBeInTheDocument();

    // Click 1-Click Teacher Demo Button
    const teacherDemoBtn = screen.getByRole('button', { name: /teacher portal/i });
    fireEvent.click(teacherDemoBtn);

    // Wait for Teacher Dashboard to load
    await waitFor(
      () => {
        expect(screen.getByText('Class Diagnostic Overview')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Verify Teacher Layout links are present
    const studentRosterLink = screen.getAllByRole('link', { name: /student deep dive/i })[0];
    fireEvent.click(studentRosterLink);

    // Verify Student Deep Dive is loaded
    await waitFor(() => {
      expect(screen.getByText('Student Deep Dive & Mistake Log')).toBeInTheDocument();
    });

    // Navigate to Test Management
    const testsLink = screen.getAllByRole('link', { name: /test management/i })[0];
    fireEvent.click(testsLink);

    await waitFor(() => {
      expect(screen.getByText('Test Paper & MCQ Assignment Management')).toBeInTheDocument();
    });
  });

  it('navigates through Student journey: Login -> Dashboard -> OMR Upload -> Mock Tests -> Profile', async () => {
    render(
      <LearningStoreProvider>
        <App />
      </LearningStoreProvider>
    );

    // Click 1-Click Student Demo Button
    const studentDemoBtn = screen.getByRole('button', { name: /student portal/i });
    fireEvent.click(studentDemoBtn);

    // Wait for Student Dashboard to load
    await waitFor(
      () => {
        expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Navigate to OMR Upload
    const uploadLink = screen.getByRole('link', { name: /upload omr now/i });
    fireEvent.click(uploadLink);

    await waitFor(() => {
      expect(screen.getByText('Categorized OMR Sheet Upload & AI Diagnostics')).toBeInTheDocument();
    });

    // Navigate to Mock Tests
    const mockTestsLink = screen.getByRole('link', { name: /mock tests/i });
    fireEvent.click(mockTestsLink);

    await waitFor(() => {
      expect(screen.getByText('Targeted Weak-Area Practice & AI Mock Tests')).toBeInTheDocument();
    });

    // Navigate to Profile
    const profileLink = screen.getByRole('link', { name: /profile/i });
    fireEvent.click(profileLink);

    await waitFor(() => {
      expect(screen.getByText(/Level \d • /i)).toBeInTheDocument();
    });
  });
});
