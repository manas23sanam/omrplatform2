import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLearningStore } from './context/LearningStoreContext';

// Layouts
import { TeacherLayout } from './layouts/TeacherLayout';
import { StudentLayout } from './layouts/StudentLayout';

// Pages
import { Login } from './pages/Login';

// Student Pages
import { Dashboard as StudentDashboard } from './pages/Dashboard';
import { Upload as OMRUpload } from './pages/Upload';
import { Analysis as TestAnalysis } from './pages/Analysis';
import { Practice as PracticeSession } from './pages/Practice';
import { History as MockTestsImprovement } from './pages/History';
import { Profile as StudentProfile } from './pages/Profile';

// Teacher Placeholder / Integration Pages (M2 will enhance)
const TeacherDashboardPlaceholder = () => (
  <div className="space-y-6">
    <div className="bg-indigo-900/10 border border-indigo-200 rounded-3xl p-8">
      <h2 className="text-2xl font-black text-slate-900">Teacher Analytics & Class KPI Overview</h2>
      <p className="text-slate-600 mt-1">Class averages, subject mastery breakdowns, and missed questions analysis.</p>
    </div>
  </div>
);

const StudentDeepDivePlaceholder = () => (
  <div className="space-y-6">
    <div className="bg-indigo-900/10 border border-indigo-200 rounded-3xl p-8">
      <h2 className="text-2xl font-black text-slate-900">Student Directory & Deep Dive Profile</h2>
      <p className="text-slate-600 mt-1">Searchable roster of all 48 students, individual mistake logs, and performance trajectory.</p>
    </div>
  </div>
);

const TestManagementPlaceholder = () => (
  <div className="space-y-6">
    <div className="bg-indigo-900/10 border border-indigo-200 rounded-3xl p-8">
      <h2 className="text-2xl font-black text-slate-900">Question Paper Upload & MCQ Assignment Engine</h2>
      <p className="text-slate-600 mt-1">Upload test papers by test number with answer keys and assign remediation MCQs.</p>
    </div>
  </div>
);

function App() {
  const { currentUser, isAuthenticated } = useLearningStore();

  return (
    <Routes>
      {/* Root Entry Point */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            currentUser?.role === 'teacher' ? (
              <Navigate to="/teacher/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* Login Page */}
      <Route path="/login" element={<Login />} />

      {/* Teacher Portal Routes */}
      <Route
        path="/teacher"
        element={
          isAuthenticated && currentUser?.role === 'teacher' ? (
            <TeacherLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<TeacherDashboardPlaceholder />} />
        <Route path="dashboard" element={<TeacherDashboardPlaceholder />} />
        <Route path="students" element={<StudentDeepDivePlaceholder />} />
        <Route path="students/:studentId" element={<StudentDeepDivePlaceholder />} />
        <Route path="tests" element={<TestManagementPlaceholder />} />
      </Route>

      {/* Student Portal Routes */}
      <Route
        path="/student"
        element={
          isAuthenticated && currentUser?.role === 'student' ? (
            <StudentLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="upload" element={<OMRUpload />} />
        <Route path="analysis/:testId" element={<TestAnalysis />} />
        <Route path="practice/:topicId" element={<PracticeSession />} />
        <Route path="mock-tests" element={<MockTestsImprovement />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Legacy / Direct Link Aliases */}
      <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/upload" element={<Navigate to="/student/upload" replace />} />
      <Route path="/analysis/:testId" element={<Navigate to="/student/analysis/:testId" replace />} />
      <Route path="/practice/:topicId" element={<Navigate to="/student/practice/:topicId" replace />} />
      <Route path="/history" element={<Navigate to="/student/mock-tests" replace />} />
      <Route path="/profile" element={<Navigate to="/student/profile" replace />} />

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
