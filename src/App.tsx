import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LearningStoreProvider, useLearningStore } from './context/LearningStoreContext';

// Layouts
import { TeacherLayout } from './layouts/TeacherLayout';
import { StudentLayout } from './layouts/StudentLayout';

// Common
import { RoleGuard } from './components/common/RoleGuard';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { Analysis } from './pages/Analysis';
import { Practice } from './pages/Practice';
import { History } from './pages/History';
import { Profile } from './pages/Profile';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentDeepDive } from './pages/teacher/StudentDeepDive';
import { TestManagement } from './pages/teacher/TestManagement';

// Student Pages
import { MockTestsImprovement } from './pages/student/MockTestsImprovement';

function AppRoutes() {
  const { currentUser, logout, loginAs } = useLearningStore();

  return (
    <Routes>
      {/* ============================================================ */}
      {/* Public Gateway Routes (/ and /login)                          */}
      {/* ============================================================ */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* ============================================================ */}
      {/* Teacher Portal Protected Branch (/teacher/*)                  */}
      {/* ============================================================ */}
      <Route
        path="/teacher"
        element={
          <RoleGuard allowedRoles={['teacher']}>
            <TeacherLayout
              onSignOut={logout}
              onSwitchRole={(role) => loginAs(role)}
            />
          </RoleGuard>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="analytics" element={<TeacherDashboard />} />
        <Route path="students" element={<StudentDeepDive />} />
        <Route path="students/:id" element={<StudentDeepDive />} />
        <Route path="tests" element={<TestManagement />} />
        <Route path="upload" element={<Upload />} />
        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Route>

      {/* ============================================================ */}
      {/* Student Portal Protected Branch (/student/*)                  */}
      {/* ============================================================ */}
      <Route
        path="/student"
        element={
          <RoleGuard allowedRoles={['student']}>
            <StudentLayout
              onSignOut={logout}
              onSwitchRole={(role) => loginAs(role)}
              studentData={
                currentUser && currentUser.role === 'student'
                  ? {
                      name: currentUser.name,
                      batch: currentUser.batch || 'Batch A1 - NEET 2026',
                      avatarUrl: currentUser.avatarUrl,
                      xp: currentUser.xp,
                      streak: currentUser.streak,
                    }
                  : undefined
              }
            />
          </RoleGuard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="mock-tests" element={<MockTestsImprovement />} />
        <Route path="profile" element={<Profile />} />
        <Route path="analysis/:testId" element={<Analysis />} />
        <Route path="practice/:topicId" element={<Practice />} />
        <Route path="history" element={<History />} />
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Route>

      {/* ============================================================ */}
      {/* Legacy Route Aliases & Redirections                           */}
      {/* ============================================================ */}
      <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/upload" element={<Navigate to="/teacher/upload" replace />} />
      <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
      <Route path="/history" element={<Navigate to="/student/history" replace />} />
      <Route path="/analysis/:testId" element={<Navigate to="/student/analysis/:testId" replace />} />
      <Route path="/practice/:topicId" element={<Navigate to="/student/practice/:topicId" replace />} />

      {/* Catch-All Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <LearningStoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LearningStoreProvider>
  );
}

export default App;
