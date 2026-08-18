import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../../pages/Login';
import { LearningStoreProvider } from '../../context/LearningStoreContext';
import { BRANDING } from '../../config/branding';

describe('Login Page (AC1)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderLoginPage = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <LearningStoreProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/teacher" element={<div>Teacher Portal Dashboard Mock</div>} />
            <Route path="/student/dashboard" element={<div>Student Portal Dashboard Mock</div>} />
          </Routes>
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders branding and dual-portal login header', () => {
    renderLoginPage();
    expect(screen.getByText(BRANDING.coachingName)).toBeInTheDocument();
    expect(screen.getByText(/Dual-Portal Gateway/i)).toBeInTheDocument();
    expect(screen.getByText('Sign In to Your Learning Portal')).toBeInTheDocument();
  });

  it('provides 1-click Teacher demo access that routes to /teacher', async () => {
    renderLoginPage();

    const teacherDemoButton = screen.getByRole('button', { name: /teacher portal/i });
    expect(teacherDemoButton).toBeInTheDocument();
    expect(screen.getByText(/\/teacher/i)).toBeInTheDocument();

    fireEvent.click(teacherDemoButton);

    await waitFor(
      () => {
        expect(screen.getByText('Teacher Portal Dashboard Mock')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('provides 1-click Student demo access that routes to /student/dashboard', async () => {
    renderLoginPage();

    const studentDemoButton = screen.getByRole('button', { name: /student portal/i });
    expect(studentDemoButton).toBeInTheDocument();
    expect(screen.getByText(/\/student\/dashboard/i)).toBeInTheDocument();

    fireEvent.click(studentDemoButton);

    await waitFor(
      () => {
        expect(screen.getByText('Student Portal Dashboard Mock')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('allows toggling between Student and Teacher credential tabs', () => {
    renderLoginPage();

    const studentTab = screen.getByRole('button', { name: /student login/i });
    const teacherTab = screen.getByRole('button', { name: /teacher login/i });

    expect(studentTab).toBeInTheDocument();
    expect(teacherTab).toBeInTheDocument();

    // Default tab is student
    expect(screen.getByText('Student Sign In')).toBeInTheDocument();

    // Switch to teacher
    fireEvent.click(teacherTab);
    expect(screen.getByText('Teacher Sign In')).toBeInTheDocument();
  });

  it('auto-fills demo credentials when clicking Fill Demo button', () => {
    renderLoginPage();

    const fillDemoButton = screen.getByRole('button', { name: /fill demo/i });
    fireEvent.click(fillDemoButton);

    const emailInput = screen.getByPlaceholderText(/rohan\.sharma@brothersacademy\.edu/i) as HTMLInputElement;
    expect(emailInput.value).toContain('@');
  });

  it('submits credential form and authenticates teacher', async () => {
    renderLoginPage();

    const teacherTab = screen.getByRole('button', { name: /teacher login/i });
    fireEvent.click(teacherTab);

    const fillDemoBtn = screen.getByRole('button', { name: /fill demo/i });
    fireEvent.click(fillDemoBtn);

    const submitBtn = screen.getByRole('button', { name: /sign in as teacher/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Teacher Portal Dashboard Mock')).toBeInTheDocument();
    });
  });
});
