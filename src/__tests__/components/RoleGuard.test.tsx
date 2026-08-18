import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoleGuard } from '../../components/common/RoleGuard';
import { LearningStoreProvider, useLearningStore } from '../../context/LearningStoreContext';

describe('RoleGuard Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const TestSetup: React.FC<{ roleToLogin?: 'teacher' | 'student' }> = ({ roleToLogin }) => {
    const { loginAs } = useLearningStore();
    React.useEffect(() => {
      if (roleToLogin) {
        loginAs(roleToLogin);
      }
    }, [roleToLogin, loginAs]);

    return (
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/teacher" element={<div>Teacher Portal</div>} />
        <Route path="/student/dashboard" element={<div>Student Dashboard</div>} />
        <Route
          path="/protected-teacher"
          element={
            <RoleGuard allowedRoles={['teacher']}>
              <div>Protected Teacher Content</div>
            </RoleGuard>
          }
        />
        <Route
          path="/protected-student"
          element={
            <RoleGuard allowedRoles={['student']}>
              <div>Protected Student Content</div>
            </RoleGuard>
          }
        />
      </Routes>
    );
  };

  it('redirects unauthenticated user to /login', () => {
    render(
      <MemoryRouter initialEntries={['/protected-teacher']}>
        <LearningStoreProvider>
          <TestSetup />
        </LearningStoreProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('allows teacher access to teacher protected route', () => {
    render(
      <MemoryRouter initialEntries={['/protected-teacher']}>
        <LearningStoreProvider>
          <TestSetup roleToLogin="teacher" />
        </LearningStoreProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Teacher Content')).toBeInTheDocument();
  });

  it('redirects teacher attempting to access student route back to /teacher', () => {
    render(
      <MemoryRouter initialEntries={['/protected-student']}>
        <LearningStoreProvider>
          <TestSetup roleToLogin="teacher" />
        </LearningStoreProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Teacher Portal')).toBeInTheDocument();
  });
});
