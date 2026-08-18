# Milestone 1: Dual-Portal Routing & Login Gateway Analysis Report

**Explorer**: Explorer 2 (Dual-Portal Routing & Login Gateway)  
**Date**: 2026-08-15  
**Milestone**: M1 - Core Foundation, State Store & Dual-Portal Gateway  
**Target Deliverables**:
- F01: Dual-Role Login Gateway (`src/pages/Login.tsx`)
- Dual-Branch Protected Routing Architecture (`src/App.tsx`)
- Role Guard Protection & Redirection (`src/components/common/RoleGuard.tsx`)
- Legacy Component Compatibility & Fix (`src/components/LoginPage.tsx`)

---

## 1. Executive Summary

This report delivers the complete design and production-ready TypeScript code specifications for **Milestone 1 (Dual-Portal Routing & Login Gateway)**.

### Key Objectives & Solutions:
1. **Dual-Role Login Gateway (`src/pages/Login.tsx`)**:
   - **Institute Branding**: Prominent **Brothers Academy** identity, customizable via `src/config/branding.ts`.
   - **1-Click Quick Demo Access Cards**: Instant login buttons for **Teacher (Dr. S. K. Verma)** and **Student (Rohan Sharma)** that initialize global auth state and immediately route users to `/teacher` and `/student/dashboard` respectively without requiring manual typing.
   - **Interactive Role Tab Credential Form**: Tab toggle allowing users to sign in with custom credentials for either Teacher or Student accounts, complete with one-click "Fill Demo Credentials" helpers.
   - **Feature Showcase & Trust Badges**: Visual highlights for 10-Second AI OMR Grading, Concept Root-Cause Diagnosis, and Gamified JEE/NEET Mastery.

2. **Dual-Branch Routing Architecture (`src/App.tsx`)**:
   - **Root & Login Gateway**: Both `/` and `/login` present the dual-role login page. If already authenticated, users are seamlessly redirected to their respective role portal.
   - **Teacher Portal Branch (`/teacher/*`)**: Encapsulated within `TeacherLayout`, providing nested routes for Class Analytics (`/teacher`, `/teacher/dashboard`), Student Deep Dive (`/teacher/students`, `/teacher/students/:id`), and Test Management (`/teacher/tests`).
   - **Student Portal Branch (`/student/*`)**: Encapsulated within `StudentLayout`, providing nested routes for Dashboard (`/student`, `/student/dashboard`), OMR Upload (`/student/upload`), Mock Tests & Improvement (`/student/mock-tests`), Profile (`/student/profile`), Test Diagnostics (`/student/analysis/:testId`), and Practice Quizzes (`/student/practice/:topicId`).
   - **Seamless Redirection & Backward Compatibility**: Legacy routes (`/dashboard`, `/upload`, `/profile`, `/history`, `/practice/:id`, `/analysis/:id`) automatically redirect to their new `/student/*` paths.
   - **Role Guard Protection**: `RoleGuard` component intercepts unauthorized cross-role access and redirects unauthenticated users to `/login` with return-state preservation.

3. **TypeScript Bug Resolution (`src/components/LoginPage.tsx`)**:
   - Identified and resolved the legacy build error where `supabase.supabaseUrl` was improperly accessed on `SupabaseClient`. Re-exported the new `Login` component cleanly to preserve backward compatibility.

---

## 2. Current State & Gap Analysis

### 2.1 Audit of Existing Codebase
| File | Current State | Issues / Gaps |
|---|---|---|
| `src/App.tsx` | Single-portal student routing with local `isDemoMode` state and direct Supabase auth listener. | No `/teacher/*` branch. No role guard. Hardcoded single student layout. Does not utilize global `useLearningStore()`. |
| `src/pages/Login.tsx` | Single generic login form with email/password and Supabase Google OAuth placeholder. | No distinction between Teacher and Student. No 1-click Teacher demo access. No role switching. |
| `src/components/LoginPage.tsx` | Legacy copy of login component. | Contains breaking TypeScript error: `supabase.supabaseUrl` (property does not exist on Supabase client v2). |
| `src/config/branding.ts` | Contains `BRANDING` and `DEMO_STUDENT`. | Missing `DEMO_TEACHER` metadata for Dr. S. K. Verma. |

### 2.2 Route Mapping Requirements Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Application Root                               │
│                         / and /login (Login Gateway)                        │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │                               │
                       ▼                               ▼
       ┌──────────────────────────────┐ ┌──────────────────────────────┐
       │   Teacher Portal Branch      │ │    Student Portal Branch     │
       │   /teacher/* (TeacherLayout) │ │   /student/* (StudentLayout) │
       ├──────────────────────────────┤ ├──────────────────────────────┤
       │ /teacher (Analytics)         │ │ /student (Dashboard)         │
       │ /teacher/dashboard           │ │ /student/dashboard           │
       │ /teacher/students            │ │ /student/upload              │
       │ /teacher/students/:id        │ │ /student/mock-tests          │
       │ /teacher/tests               │ │ /student/profile             │
       └──────────────────────────────┘ │ /student/analysis/:testId    │
                                        │ /student/practice/:topicId   │
                                        │ /student/history             │
                                        └──────────────────────────────┘
```

---

## 3. Component Specification & Code Implementations

### 3.1 Dual-Role Login Gateway (`src/pages/Login.tsx`)

The modern login page features:
1. **Hero Header**: Brothers Academy branding, "AI OMR Diagnostic & Personalized Learning GPS" tagline.
2. **1-Click Quick Demo Access Cards**:
   - **Teacher Card**: "Login as Teacher" -> Dr. S. K. Verma (Sr. Physics Faculty • Batch Analytics & Test Assigner) -> 1-click calls `loginAs('teacher')` and navigates to `/teacher`.
   - **Student Card**: "Login as Student" -> Rohan Sharma (Batch A1 • Class 11 • OMR Uploads & Gamified XP) -> 1-click calls `loginAs('student')` and navigates to `/student/dashboard`.
3. **Role Tab Credential Section**:
   - Tab toggles between **Teacher Sign In** and **Student Sign In**.
   - Input fields for Email and Password with clean error handling and loading indicators.
   - "Fill Demo Credentials" quick button for effortless evaluation.
4. **Trust & Capability Features Bar**:
   - ⚡ 10s AI OMR Bubble Scanning
   - 🎯 Pinpoint Concept Root-Cause Diagnosis
   - 🏆 XP Points & Cohort Leaderboard

#### Complete Implementation (`src/pages/Login.tsx`):

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  FileCheck2,
  Lock,
  Mail,
  Loader2,
} from 'lucide-react';
import { BRANDING, DEMO_STUDENT, DEMO_TEACHER } from '../config/branding';
import { useLearningStore } from '../context/LearningStoreContext';

interface LoginProps {
  onDemoLogin?: (role?: 'teacher' | 'student') => void;
}

export const Login: React.FC<LoginProps> = ({ onDemoLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, loginAs, loginWithCredentials } = useLearningStore();

  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to active portal
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      if (from && from !== '/login' && from !== '/') {
        navigate(from, { replace: true });
      } else if (currentUser.role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate, location.state]);

  // 1-Click Quick Demo Login Handler
  const handleQuickDemo = (role: 'teacher' | 'student') => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      loginAs(role);
      if (onDemoLogin) onDemoLogin(role);
      setLoading(false);
      if (role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student/dashboard');
      }
    }, 400);
  };

  // Preset demo credentials helper
  const handleFillDemoCredentials = (role: 'teacher' | 'student') => {
    if (role === 'teacher') {
      setEmail(DEMO_TEACHER.email);
      setPassword('teacher@123');
      setActiveTab('teacher');
    } else {
      setEmail(DEMO_STUDENT.email);
      setPassword('student@123');
      setActiveTab('student');
    }
    setError(null);
  };

  // Credential Form Submit Handler
  const handleCredentialAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (loginWithCredentials) {
        const result = await loginWithCredentials(email, password, activeTab);
        if (!result.success) {
          setError(result.error || 'Invalid email or password.');
          setLoading(false);
          return;
        }
      } else {
        // Fallback login
        loginAs(activeTab);
      }

      setLoading(false);
      if (activeTab === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-200">
            {BRANDING.logoText}
          </div>
          <div>
            <span className="font-black text-xl text-slate-900 tracking-tight block">
              {BRANDING.coachingName}
            </span>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
              AI OMR Diagnostic & Remediation Platform
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            JEE & NEET 2026 Ready
          </span>
        </div>
      </header>

      {/* Main Dual-Portal Login Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-extrabold mb-4 shadow-2xs">
            <Sparkles size={14} className="text-indigo-600 animate-bounce" />
            Dual-Portal Gateway • Instant Access
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Sign In to Your Learning Portal
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-medium">
            Select your role below for 1-click demo evaluation or sign in with your institute credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto w-full">
          {/* ============================================================ */}
          {/* LEFT COLUMN: 1-Click Quick Demo Access Cards                  */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Instant Demo Evaluation</h2>
                    <p className="text-xs text-slate-500 font-medium">1-Click access with realistic seed data</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  No Password Needed
                </span>
              </div>

              <div className="space-y-3.5">
                {/* 1-Click Teacher Demo Button */}
                <button
                  type="button"
                  onClick={() => handleQuickDemo('teacher')}
                  disabled={loading}
                  className="w-full text-left group p-4 rounded-2xl border-2 border-indigo-100 hover:border-indigo-500 bg-gradient-to-r from-indigo-50/50 to-white hover:from-indigo-50 hover:to-indigo-50/30 transition-all duration-200 shadow-2xs hover:shadow-md relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <Users size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
                          Teacher Portal
                        </span>
                        <span className="text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center text-xs font-bold">
                          Launch <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                      <p className="font-extrabold text-base text-slate-900 mt-0.5">{DEMO_TEACHER.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Class Analytics • Student Mistake Logs • Test Assigner
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-indigo-100/60 flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span>Routes directly to <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-bold border border-indigo-100">/teacher</code></span>
                  </div>
                </button>

                {/* 1-Click Student Demo Button */}
                <button
                  type="button"
                  onClick={() => handleQuickDemo('student')}
                  disabled={loading}
                  className="w-full text-left group p-4 rounded-2xl border-2 border-emerald-100 hover:border-emerald-500 bg-gradient-to-r from-emerald-50/50 to-white hover:from-emerald-50 hover:to-emerald-50/30 transition-all duration-200 shadow-2xs hover:shadow-md relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <GraduationCap size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                          Student Portal
                        </span>
                        <span className="text-slate-400 group-hover:text-emerald-600 transition-colors flex items-center text-xs font-bold">
                          Launch <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                      <p className="font-extrabold text-base text-slate-900 mt-0.5">{DEMO_STUDENT.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        OMR Bubble Scanner • AI Mock Tests • 1,240 XP & Leaderboard
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-emerald-100/60 flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Routes directly to <code className="bg-white px-1.5 py-0.5 rounded text-emerald-700 font-bold border border-emerald-100">/student/dashboard</code></span>
                  </div>
                </button>
              </div>

              {/* Trust & Features Footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <FileCheck2 size={16} className="mx-auto text-indigo-600 mb-1" />
                  <p className="text-[10px] font-bold text-slate-700">10s AI OMR</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <Sparkles size={16} className="mx-auto text-amber-600 mb-1" />
                  <p className="text-[10px] font-bold text-slate-700">Root-Cause Fix</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <Award size={16} className="mx-auto text-emerald-600 mb-1" />
                  <p className="text-[10px] font-bold text-slate-700">XP & Ranks</p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Interactive Role Tab Credential Form            */}
          {/* ============================================================ */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
              {/* Role Toggle Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('student');
                    setError(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'student'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <GraduationCap size={16} className={activeTab === 'student' ? 'text-emerald-600' : ''} />
                  Student Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('teacher');
                    setError(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'teacher'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users size={16} className={activeTab === 'teacher' ? 'text-indigo-600' : ''} />
                  Teacher Login
                </button>
              </div>

              {/* Form Title */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {activeTab === 'teacher' ? 'Teacher Sign In' : 'Student Sign In'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeTab === 'teacher'
                      ? 'Access class diagnostic reports & manage tests'
                      : 'Access your OMR scans, improvement tests & XP'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillDemoCredentials(activeTab)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Auto-fill demo test credentials"
                >
                  Fill Demo
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                  <span>{error}</span>
                </div>
              )}

              {/* Credential Form */}
              <form onSubmit={handleCredentialAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    {activeTab === 'teacher' ? 'Faculty Email ID' : 'Student Email / ID'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={activeTab === 'teacher' ? 'skverma@brothersacademy.edu' : 'rohan.sharma@brothersacademy.edu'}
                      className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button type="button" onClick={() => handleFillDemoCredentials(activeTab)} className="text-[11px] font-bold text-indigo-600 hover:underline">
                      Auto-fill password
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                    Remember this device
                  </label>
                  <span className="text-[11px] text-slate-400">Brothers Academy Security</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span>Sign In as {activeTab === 'teacher' ? 'Teacher' : 'Student'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Info Note */}
              <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
                <span>
                  Demo instance initialized with mock JEE & NEET batches, question papers, and OMR sample sheets.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-8">
        <p>© 2026 {BRANDING.coachingName}. All Rights Reserved. • Support: {BRANDING.supportEmail}</p>
      </footer>
    </div>
  );
};
```

---

### 3.2 Role Guard Component (`src/components/common/RoleGuard.tsx`)

The `RoleGuard` component performs:
1. **Authentication Check**: If user is not logged in (`isAuthenticated === false`), redirects to `/login` and saves `location` in state.
2. **Role Permission Check**: If `allowedRoles` is specified (e.g. `['teacher']` or `['student']`), verifies that `currentUser.role` matches. If mismatched, seamlessly redirects to the user's correct home portal.

#### Implementation (`src/components/common/RoleGuard.tsx`):

```tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLearningStore } from '../../context/LearningStoreContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('teacher' | 'student')[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { currentUser, isAuthenticated } = useLearningStore();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to respective valid role dashboard if trying to access unauthorized branch
    if (currentUser.role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
};
```

---

### 3.3 Application Routing Architecture (`src/App.tsx`)

The upgraded `src/App.tsx`:
1. Connects global state from `LearningStoreProvider` (or imports `useLearningStore`).
2. Defines root and auth routes (`/` and `/login`).
3. Implements the `/teacher/*` branch:
   - Protected with `<RoleGuard allowedRoles={['teacher']}>`
   - Wrapped inside `<TeacherLayout />`
   - Nested routes:
     - `/teacher` & `/teacher/dashboard` -> `TeacherDashboard`
     - `/teacher/students` -> `StudentDeepDive`
     - `/teacher/students/:id` -> `StudentDeepDive`
     - `/teacher/tests` -> `TestManagement`
4. Implements the `/student/*` branch:
   - Protected with `<RoleGuard allowedRoles={['student']}>`
   - Wrapped inside `<StudentLayout />`
   - Nested routes:
     - `/student` & `/student/dashboard` -> `Dashboard` (or `StudentDashboard`)
     - `/student/upload` -> `Upload` (or `OMRUpload`)
     - `/student/mock-tests` -> `Practice` (or `MockTestsImprovement`)
     - `/student/profile` -> `Profile` (or `StudentProfile`)
     - `/student/analysis/:testId` -> `Analysis` (or `TestAnalysis`)
     - `/student/practice/:topicId` -> `Practice` (or `PracticeSession`)
     - `/student/history` -> `History`
5. Provides seamless redirect bridges for legacy flat URLs:
   - `/dashboard` -> `/student/dashboard`
   - `/upload` -> `/student/upload`
   - `/profile` -> `/student/profile`
   - `/history` -> `/student/history`
   - `/analysis/:testId` -> `/student/analysis/:testId`
   - `/practice/:topicId` -> `/student/practice/:topicId`
6. Implements 404 Catch-All `*` route that intelligently routes logged-in users to their role portal and unauthenticated users to `/login`.

#### Complete Implementation (`src/App.tsx`):

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LearningStoreProvider, useLearningStore } from './context/LearningStoreContext';

// Layouts
import { TeacherLayout } from './layouts/TeacherLayout';
import { StudentLayout } from './layouts/StudentLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { Analysis } from './pages/Analysis';
import { Practice } from './pages/Practice';
import { History } from './pages/History';
import { Profile } from './pages/Profile';

// Teacher Pages (or placeholding wrappers for M1)
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentDeepDive } from './pages/teacher/StudentDeepDive';
import { TestManagement } from './pages/teacher/TestManagement';

// Role Guard
import { RoleGuard } from './components/common/RoleGuard';

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
                      batch: 'Batch A1 - JEE 2026',
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
        <Route path="upload" element={<Upload />} />
        <Route path="mock-tests" element={<Practice />} />
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
      <Route path="/upload" element={<Navigate to="/student/upload" replace />} />
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
```

---

### 3.4 Teacher Page Placeholders for M1 (`src/pages/teacher/`)

To allow immediate functional navigation across `/teacher`, `/teacher/students`, and `/teacher/tests` during Milestone 1 without waiting for Milestone 2 implementation, the Worker should create three clean placeholder components in `src/pages/teacher/`:

#### A. `src/pages/teacher/TeacherDashboard.tsx`
```tsx
import React from 'react';
import { BarChart3, TrendingUp, Users, ArrowUpRight, FileCheck } from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';

export const TeacherDashboard: React.FC = () => {
  const { classAnalytics, students } = useLearningStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Class Analytics Overview</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Batch A1 - JEE 2026 • Real-time Diagnostic Summary ({students.length} Active Students)
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Sync Active
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Class Avg Score</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{classAnalytics?.classAverageMarks || 184} / 300</p>
          <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight size={12} /> +14.2% vs last test
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Tests Conducted</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{classAnalytics?.totalTestsConducted || 8}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Latest: JEE Advanced Mock #4</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Avg Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{classAnalytics?.averageAccuracy || 68}%</p>
          <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight size={12} /> +3.8% improvement
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Students Tracked</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{students.length || 48}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">100% attendance rate</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs text-center">
        <div className="max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Milestone 1 Gateway Connected</h3>
          <p className="text-xs text-slate-500 mt-1">
            Full Recharts Class Performance Trends & Missed Questions Matrix are queued for Milestone 2.
          </p>
        </div>
      </div>
    </div>
  );
};
```

#### B. `src/pages/teacher/StudentDeepDive.tsx`
```tsx
import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';

export const StudentDeepDive: React.FC = () => {
  const { students } = useLearningStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Deep Dive & Directory</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Explore student performance trajectories, specific mistake logs, and assigned practice.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name, roll number, or target rank..."
            className="w-full text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <div className="divide-y divide-slate-100">
          {students.map((student) => (
            <div key={student.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full border border-slate-200" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.batch} • Roll #{student.rollNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900">Avg: {student.avgScore}/300</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">{student.accuracy}% Accuracy</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### C. `src/pages/teacher/TestManagement.tsx`
```tsx
import React from 'react';
import { Plus } from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';

export const TestManagement: React.FC = () => {
  const { testPapers } = useLearningStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Test Paper & MCQ Management</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Upload question papers by test number, configure answer keys, and assign MCQ remediation sets.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 cursor-pointer">
          <Plus size={16} /> Upload New Test Paper
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testPapers.map((paper) => (
          <div key={paper.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  Test #{paper.testNumber}
                </span>
                <span className="text-xs text-slate-400 font-medium">{paper.date}</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{paper.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{paper.subject} • {paper.totalQuestions} MCQs • {paper.maxMarks} Marks</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Answer Key Ready</span>
              <button className="hover:underline cursor-pointer">View Details →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### 3.5 Resolving `src/components/LoginPage.tsx` TypeScript Bug

`src/components/LoginPage.tsx` is an older copy containing the illegal property `supabase.supabaseUrl`.

To eliminate this TypeScript error permanently while ensuring no existing imports break, replace `src/components/LoginPage.tsx` with a clean re-export of `src/pages/Login.tsx`:

```tsx
import { Login } from '../pages/Login';
export const LoginPage = Login;
export default Login;
```

---

### 3.6 Updating `src/config/branding.ts`

Add `DEMO_TEACHER` to `src/config/branding.ts`:

```ts
export const BRANDING = {
  coachingName: 'Brothers Academy',
  logoText: 'BA',
  logoUrl: null, // Set to a URL if you have an image logo
  colors: {
    primary: 'indigo', // Tailwind color name for primary actions
    secondary: 'purple',
    accent: 'blue',
  },
  supportEmail: 'support@brothersacademy.com',
};

export const DEMO_STUDENT = {
  id: 'student-1',
  name: 'Rohan Sharma',
  batch: 'Batch A1 - JEE 2026',
  grade: 'Grade 11',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  xp: 1240,
  streak: 15,
  email: 'rohan.sharma@brothersacademy.edu',
};

export const DEMO_TEACHER = {
  id: 'teacher-1',
  name: 'Dr. S. K. Verma',
  designation: 'Senior Physics Faculty',
  subject: 'Physics & Advanced Mechanics',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  email: 'skverma@brothersacademy.edu',
  batches: ['Batch A1 - JEE 2026', 'Batch A2 - JEE 2026', 'Batch B1 - NEET 2026'],
};
```

---

## 4. Recommended Implementation Strategy for Worker

### Step 1: Branding and Config Update
- Update `src/config/branding.ts` to export `DEMO_TEACHER` alongside `BRANDING` and `DEMO_STUDENT`.

### Step 2: Role Guard Component
- Create `src/components/common/RoleGuard.tsx` for protected route interception and role validation.

### Step 3: Dual-Role Login Gateway
- Rewrite `src/pages/Login.tsx` with the complete implementation from Section 3.1, providing 1-click Teacher and Student demo buttons, credential inputs, role tabs, and Brothers Academy branding.

### Step 4: Teacher Page Placeholders
- Create `src/pages/teacher/TeacherDashboard.tsx`, `StudentDeepDive.tsx`, and `TestManagement.tsx` to enable functional navigation across all teacher subroutes in Milestone 1.

### Step 5: Application Routing Upgrade (`src/App.tsx`)
- Rewrite `src/App.tsx` with `LearningStoreProvider`, `BrowserRouter`, dual-branch routing (`/teacher/*` with `TeacherLayout` and `/student/*` with `StudentLayout`), legacy redirects, and catch-all handler.

### Step 6: Fix `src/components/LoginPage.tsx`
- Replace `src/components/LoginPage.tsx` with clean re-export of `Login` to resolve the TypeScript compile error.

---

## 5. Verification Plan

1. **Root URL Gateway**:
   - Navigate to `/` -> Renders Brothers Academy branding, "Login as Teacher", "Login as Student", and Role Tab form.
   - Click "Login as Teacher" -> Immediately routes to `/teacher` and renders `TeacherLayout` with `Dr. S. K. Verma`.
   - Click "Login as Student" -> Immediately routes to `/student/dashboard` and renders `StudentLayout` with `Rohan Sharma` and XP pill.
2. **Teacher Subroutes**:
   - `/teacher` -> Renders `TeacherDashboard`.
   - `/teacher/students` -> Renders `StudentDeepDive`.
   - `/teacher/tests` -> Renders `TestManagement`.
   - Topbar switch button -> Successfully switches to Student view.
3. **Student Subroutes**:
   - `/student/dashboard` -> Renders Student Dashboard.
   - `/student/upload` -> Renders OMR Upload.
   - `/student/profile` -> Renders Student Profile.
4. **Legacy URL Aliases**:
   - `/dashboard` -> Seamlessly redirects to `/student/dashboard`.
   - `/upload` -> Seamlessly redirects to `/student/upload`.
5. **Build & Typecheck**:
   - Run `npx tsc -b` -> Confirms 0 TypeScript errors across the whole repository.
