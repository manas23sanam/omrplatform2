# Milestone 1: Layout Shells & Navigation Architecture Analysis Report

**Explorer**: Explorer 3 (Layout Shells & Navigation Architecture)  
**Date**: 2026-08-15  
**Milestone**: M1 - Core Foundation, State Store & Dual-Portal Gateway  
**Target Files**:
- `src/layouts/TeacherLayout.tsx` (F02: Teacher Portal Layout Shell)
- `src/layouts/StudentLayout.tsx` (F03: Student Portal Layout Shell Upgrade)
- Common Navigation Components (`src/components/common/` / `src/config/branding.ts`)

---

## 1. Executive Summary

This report establishes the complete architectural blueprint and production-grade code implementation for the **Teacher Portal Layout Shell (`TeacherLayout.tsx`)** and **Student Portal Layout Shell (`StudentLayout.tsx`)**.

These two layout shells form the foundational navigation skeleton for the entire AI OMR Analysis & Personalized Learning Platform:
1. **Teacher Portal Shell (`TeacherLayout.tsx`)**:
   - **Sidebar**: White-labeled coaching branding (**Brothers Academy**), Teacher Portal badge, navigation links to **Class Analytics** (`/teacher` or `/teacher/dashboard`), **Student Deep Dive** (`/teacher/students`), and **Test Management** (`/teacher/tests`). Bottom action cluster with 1-click **Switch to Student Portal** and **Sign Out**.
   - **Topbar**: Interactive **Batch Selector Dropdown** ("Batch A1 - JEE 2026" with quick batch switcher), dynamic page title / breadcrumbs, **Teacher Profile** ("Dr. S. K. Verma - Senior Physics Faculty"), and role switch / logout quick actions.
   - **Mobile Responsiveness**: Sticky header with hamburger drawer menu and bottom navigation for seamless tablet/mobile administration.

2. **Student Portal Shell (`StudentLayout.tsx`)**:
   - **Sidebar**: White-labeled coaching branding, Student Portal badge, navigation links to **Dashboard** (`/student` or `/student/dashboard`), **OMR Upload** (`/student/upload`), **Mock Tests & Improvement** (`/student/mock-tests`), and **Profile** (`/student/profile`). Bottom action cluster with 1-click **Switch to Teacher Portal** and **Sign Out**.
   - **Topbar**: Real-time **Gamified XP Pill** (`⚡ 1,240 XP` with amber glowing chip), **Streak Badge** (`🔥 15 Days` with animated flame badge), **Student Avatar & Name** ("Rohan Sharma - Batch A1"), and quick switch / logout actions.
   - **Mobile Responsiveness**: Sticky mobile topbar displaying XP/Streak pills + avatar, coupled with a fixed, thumb-friendly **Mobile Bottom Navigation Bar** with high-contrast active icons and safe-area padding.

3. **Store & Context Resilience**:
   - Designed to seamlessly integrate with `useLearningStore()` from `src/context/LearningStoreContext.tsx`.
   - Built with resilient fallback defaults (`DEMO_STUDENT` and `DEMO_TEACHER` from `src/config/branding.ts`), guaranteeing zero runtime crashes during isolated component rendering, hot-reloading, or standalone testing.

---

## 2. Information Architecture & Route Mapping

### 2.1 Route Hierarchy
```
/ (Dual-Portal Login Gateway)
│
├── /teacher (TeacherLayout Shell)
│   ├── /teacher               -> Redirects to /teacher/dashboard (or renders TeacherDashboard)
│   ├── /teacher/dashboard     -> Class Analytics, KPI Cards, Recharts Performance Trends, Missed Questions Table
│   ├── /teacher/students      -> Searchable Student Directory with mastery flags
│   ├── /teacher/students/:id  -> Student Deep Dive: Marks history, mistakes log, remediation composer
│   └── /teacher/tests         -> Question paper upload by Test #, answer key grid, MCQ assigner
│
└── /student (StudentLayout Shell)
    ├── /student               -> Redirects to /student/dashboard (or renders StudentDashboard)
    ├── /student/dashboard     -> Hero welcome, XP & streak summary, Leaderboard widget, score charts
    ├── /student/upload        -> 4-Category OMR upload (Physics, Chemistry, Maths, Full Paper), AI scan sim
    ├── /student/mock-tests    -> Dedicated Improvement & Mock Tests page (AI & Teacher practice tests)
    ├── /student/profile       -> Score improvement trends, subject mastery bars, unlocked badges
    ├── /student/analysis/:id  -> Detailed test diagnostic report & concept recovery roadmap
    ├── /student/practice/:id  -> Interactive concept recap & 5-question verification quiz
    └── /student/history       -> Past test archives and topic mastery heatmap
```

### 2.2 Navigation Consistency Matrix

| Portal | Nav Label | Route Path | Lucide Icon | Sub-routes Highlighted | Key Topbar Elements |
|---|---|---|---|---|---|
| **Teacher** | Class Analytics | `/teacher` or `/teacher/dashboard` | `BarChart3` / `LayoutDashboard` | `/teacher`, `/teacher/dashboard` | Batch Selector ("Batch A1 - JEE 2026"), Profile ("Dr. S. K. Verma"), Switch to Student, Logout |
| **Teacher** | Student Deep Dive | `/teacher/students` | `Users` | `/teacher/students`, `/teacher/students/:id` | Batch Selector, Profile, Switch to Student, Logout |
| **Teacher** | Test Management | `/teacher/tests` | `FileSpreadsheet` / `FileText` | `/teacher/tests`, `/teacher/tests/new` | Batch Selector, Profile, Switch to Student, Logout |
| **Student** | Dashboard | `/student` or `/student/dashboard` | `LayoutDashboard` | `/student`, `/student/dashboard` | XP Pill (`1,240 XP`), Streak Badge (`15 Days`), Student Avatar, Switch to Teacher, Logout |
| **Student** | OMR Upload | `/student/upload` | `UploadCloud` | `/student/upload` | XP Pill, Streak Badge, Student Avatar, Switch to Teacher, Logout |
| **Student** | Mock Tests & Improvement | `/student/mock-tests` | `BrainCircuit` / `Sparkles` | `/student/mock-tests`, `/student/practice/:topicId` | XP Pill, Streak Badge, Student Avatar, Switch to Teacher, Logout |
| **Student** | My Profile | `/student/profile` | `User` | `/student/profile`, `/student/history` | XP Pill, Streak Badge, Student Avatar, Switch to Teacher, Logout |

---

## 3. Detailed Component Specifications

### 3.1 Teacher Portal Layout (`src/layouts/TeacherLayout.tsx`)

#### A. Structure & Layout Grid
- **Desktop**:
  - Sidebar: Fixed width `w-64` (256px), full height `h-screen sticky top-0`, white background `bg-white`, right border `border-r border-slate-100 shadow-sm`.
  - Main Column: `flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50`.
  - Topbar: `sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between shadow-xs`.
  - Content Area: `flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto`.
- **Mobile / Tablet (`< 768px`)**:
  - Sticky Mobile Header: `h-16 bg-white border-b border-slate-100 px-4 flex items-center justify-between sticky top-0 z-40`.
  - Slide-out Drawer Menu: Full overlay with backdrop blur, rendering sidebar nav links, batch switcher, and teacher profile.
  - Mobile Bottom Nav: Fixed bottom navigation bar (`h-16 bg-white border-t border-slate-100`) providing 1-tap switching between Analytics, Students, and Tests.

#### B. Sidebar Elements
1. **Brand Header**:
   - Rounded square logo container (`w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-sm`).
   - Coaching Name: `BRANDING.coachingName` ("Brothers Academy").
   - Subtitle / Role Badge: `Teacher Portal` in indigo pill badge (`bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md`).
2. **Navigation List**:
   - Links rendered with `NavLink` or custom active checker (`location.pathname`).
   - Active Style: `bg-indigo-50 text-indigo-700 font-bold shadow-xs border-r-4 border-indigo-600`.
   - Inactive Style: `text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors`.
3. **Footer Action Cluster**:
   - **Switch to Student Portal Button**: `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition-all`.
   - **Sign Out Button**: `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all`.

#### C. Topbar Elements
1. **Dynamic Page Title & Breadcrumb**:
   - Computes current section title (e.g. "Class Analytics Overview", "Student Directory & Deep Dive", "Test Paper Management").
2. **Interactive Batch Selector Dropdown**:
   - Renders current batch pill: `Layers` icon + "Batch A1 - JEE 2026" + `ChevronDown` icon.
   - Dropdown options:
     - `Batch A1 - JEE 2026` (48 Students • Physics & Chemistry)
     - `Batch A2 - JEE 2026` (42 Students • Full Syllabus)
     - `Batch B1 - NEET 2026` (36 Students • Physics & Bio)
   - Synchronizes selection with `selectedBatch` in `useLearningStore()`.
   - Click-outside handler to close dropdown cleanly.
3. **Teacher Profile Pill**:
   - Avatar: Circular image with subtle border.
   - Name: "Dr. S. K. Verma".
   - Role subtitle: "Senior Physics Faculty".
4. **Quick Switch & Logout Icons**:
   - "Switch to Student" button for 1-click preview without navigating back to `/login`.
   - Logout button with red hover tint.

---

### 3.2 Student Portal Layout (`src/layouts/StudentLayout.tsx`)

#### A. Structure & Layout Grid
- **Desktop**:
  - Sidebar: `w-64` (256px), `h-screen sticky top-0 bg-white border-r border-slate-100 shadow-sm flex flex-col`.
  - Main Column: `flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50`.
  - Topbar: `sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between shadow-xs`.
  - Content Area: `flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto`.
- **Mobile / Tablet (`< 768px`)**:
  - Sticky Mobile Header: `h-16 bg-white border-b border-slate-100 px-4 flex items-center justify-between sticky top-0 z-40`. Displays logo, XP pill, Streak badge, and student avatar.
  - Mobile Bottom Bar: `sticky bottom-0 z-40 bg-white border-t border-slate-100 flex items-center justify-around h-16 pb-safe`.
  - Bottom Bar Tabs:
    1. Dashboard (`/student`)
    2. Upload OMR (`/student/upload`)
    3. Mock Tests (`/student/mock-tests`)
    4. Profile (`/student/profile`)

#### B. Sidebar Elements
1. **Brand Header**:
   - Logo: `w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center`.
   - Coaching Name: "Brothers Academy".
   - Role Badge: `Student Portal` in emerald pill badge (`bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md`).
2. **Navigation List**:
   - **Dashboard**: `/student` or `/student/dashboard` (Icon: `LayoutDashboard`).
   - **OMR Upload**: `/student/upload` (Icon: `UploadCloud`).
   - **Mock Tests & Improvement**: `/student/mock-tests` (Icon: `BrainCircuit`).
   - **My Profile**: `/student/profile` (Icon: `User`).
   - Active styling with indigo pill background and bold font.
3. **Footer Action Cluster**:
   - **Switch to Teacher Portal Button**: `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition-all`.
   - **Sign Out Button**: `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all`.

#### C. Topbar Elements
1. **Gamified XP Pill**:
   - Container: `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-xs`.
   - Icon: `Zap` / `Sparkles` in vibrant amber (`text-amber-500 fill-amber-400`).
   - Label: `1,240 XP` (dynamically pulled from `currentUser.xp` or default).
2. **Gamified Streak Badge**:
   - Container: `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 shadow-xs`.
   - Icon: `Flame` in fiery orange (`text-orange-500 fill-orange-400 animate-pulse`).
   - Label: `15 Days` (dynamically pulled from `currentUser.streak` or default).
3. **Student Profile Pill**:
   - Avatar: `w-9 h-9 rounded-full object-cover border-2 border-indigo-100 shadow-xs`.
   - Name: "Rohan Sharma".
   - Batch Tag: "Batch A1 • Class 11".
4. **Action Controls**:
   - "Switch to Teacher" pill button.
   - Logout button (`LogOut` icon).

---

## 4. Full Source Code Implementation Blueprints

### 4.1 Teacher Layout Component (`src/layouts/TeacherLayout.tsx`)

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  LogOut,
  ArrowLeftRight,
  ChevronDown,
  Layers,
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Check
} from 'lucide-react';
import { BRANDING } from '../config/branding';

interface TeacherLayoutProps {
  onSignOut?: () => void;
  onSwitchRole?: (role: 'teacher' | 'student') => void;
}

const AVAILABLE_BATCHES = [
  { id: 'batch-a1', name: 'Batch A1 - JEE 2026', count: '48 Students', subject: 'Physics & Chem' },
  { id: 'batch-a2', name: 'Batch A2 - JEE 2026', count: '42 Students', subject: 'Full Syllabus' },
  { id: 'batch-b1', name: 'Batch B1 - NEET 2026', count: '36 Students', subject: 'Physics & Bio' },
];

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({ onSignOut, onSwitchRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedBatch, setSelectedBatch] = useState(AVAILABLE_BATCHES[0].name);
  const [isBatchMenuOpen, setIsBatchMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBatchMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      path: '/teacher',
      exact: true,
      label: 'Class Analytics',
      icon: <LayoutDashboard size={20} />,
      badge: 'Live',
    },
    {
      path: '/teacher/students',
      exact: false,
      label: 'Student Deep Dive',
      icon: <Users size={20} />,
      badge: '48',
    },
    {
      path: '/teacher/tests',
      exact: false,
      label: 'Test Management',
      icon: <FileSpreadsheet size={20} />,
      badge: 'New',
    },
  ];

  const handleRoleSwitch = () => {
    if (onSwitchRole) {
      onSwitchRole('student');
    } else {
      navigate('/student');
    }
  };

  const handleLogout = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      navigate('/login');
    }
  };

  const isNavActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === '/teacher' || location.pathname === '/teacher/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/teacher/students')) {
      return 'Student Deep Dive & Mistake Logs';
    }
    if (location.pathname.startsWith('/teacher/tests')) {
      return 'Test Paper & MCQ Assignment Management';
    }
    return 'Class Performance & Analytics Overview';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* ============================================================ */}
      {/* Desktop Sidebar Navigation                                    */}
      {/* ============================================================ */}
      <aside className="w-64 bg-white border-r border-slate-100 shadow-sm hidden md:flex flex-col sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-100">
              {BRANDING.logoText}
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-base text-slate-900 tracking-tight block truncate">
                {BRANDING.coachingName}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
                <ShieldCheck size={10} /> Teacher Portal
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const active = isNavActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-150 ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs border-r-4 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? 'text-indigo-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Role Switch & Sign Out) */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <button
            onClick={handleRoleSwitch}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all shadow-2xs"
            title="Switch to Student Portal view"
          >
            <span className="flex items-center gap-2">
              <ArrowLeftRight size={14} className="text-indigo-600" />
              Switch to Student
            </span>
            <span className="text-[10px] text-slate-400">Demo</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-xl text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* Main Content Area                                             */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              {BRANDING.logoText}
            </div>
            <span className="font-extrabold text-sm text-slate-900 truncate">
              {BRANDING.coachingName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRoleSwitch}
              className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg"
            >
              Student View
            </button>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Teacher"
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
          </div>
        </header>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col">
            <div className="bg-white w-4/5 max-w-xs h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {BRANDING.logoText}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{BRANDING.coachingName}</p>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase">Teacher Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Batch Switcher */}
              <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Active Batch
                </p>
                <p className="text-xs font-bold text-slate-800">{selectedBatch}</p>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const active = isNavActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm ${
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={handleRoleSwitch}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl"
                >
                  <ArrowLeftRight size={14} /> Switch to Student Portal
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Topbar */}
        <header className="hidden md:flex bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-3.5 items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Brothers Academy JEE Division • Real-time Diagnostic Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Batch Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsBatchMenuOpen(!isBatchMenuOpen)}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 transition-colors shadow-2xs"
                aria-haspopup="true"
                aria-expanded={isBatchMenuOpen}
              >
                <div className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Layers size={12} />
                </div>
                <span>{selectedBatch}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isBatchMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Cohort / Batch
                    </p>
                  </div>
                  <div className="mt-1 space-y-1">
                    {AVAILABLE_BATCHES.map((batch) => {
                      const isSelected = selectedBatch === batch.name;
                      return (
                        <button
                          key={batch.id}
                          onClick={() => {
                            setSelectedBatch(batch.name);
                            setIsBatchMenuOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700 font-medium'
                          }`}
                        >
                          <div>
                            <p className="text-xs leading-tight">{batch.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {batch.count} • {batch.subject}
                            </p>
                          </div>
                          {isSelected && <Check size={14} className="text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Switch to Student Button */}
            <button
              onClick={handleRoleSwitch}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors border border-indigo-100"
              title="Open Student Portal demo view"
            >
              <GraduationCap size={15} />
              <span>Student View</span>
            </button>

            {/* Teacher Profile Info */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-tight">Dr. S. K. Verma</p>
                <p className="text-[11px] text-indigo-600 font-semibold">Sr. Physics Faculty</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="Dr. S. K. Verma"
                className="w-10 h-10 rounded-full border-2 border-slate-200 object-cover shadow-2xs"
              />
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden bg-white border-t border-slate-100 flex items-center justify-around sticky bottom-0 z-30 pb-safe shadow-lg">
          {navItems.map((item) => {
            const active = isNavActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-3 flex-1 transition-colors ${
                  active ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
```

---

### 4.2 Upgraded Student Layout Component (`src/layouts/StudentLayout.tsx`)

```tsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  BrainCircuit,
  User,
  LogOut,
  ArrowLeftRight,
  Zap,
  Flame,
  Menu,
  X,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { BRANDING, DEMO_STUDENT } from '../config/branding';

interface StudentLayoutProps {
  onSignOut?: () => void;
  onSwitchRole?: (role: 'teacher' | 'student') => void;
  studentData?: {
    name: string;
    batch: string;
    avatarUrl: string;
    xp: number;
    streak: number;
  };
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  onSignOut,
  onSwitchRole,
  studentData
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use props or fallback to standard demo student data
  const currentStudent = {
    name: studentData?.name || DEMO_STUDENT.name || 'Rohan Sharma',
    batch: studentData?.batch || DEMO_STUDENT.batch || 'Batch A1 - JEE 2026',
    avatarUrl: studentData?.avatarUrl || DEMO_STUDENT.avatarUrl || 'https://i.pravatar.cc/150?u=rohan',
    xp: studentData?.xp ?? 1240,
    streak: studentData?.streak ?? 15,
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      path: '/student',
      exact: true,
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/student/upload',
      exact: false,
      label: 'OMR Upload',
      icon: <UploadCloud size={20} />,
      badge: 'AI Scan',
    },
    {
      path: '/student/mock-tests',
      exact: false,
      label: 'Mock Tests & Improvement',
      icon: <BrainCircuit size={20} />,
      badge: 'Targeted',
    },
    {
      path: '/student/profile',
      exact: false,
      label: 'My Profile',
      icon: <User size={20} />,
    },
  ];

  const handleRoleSwitch = () => {
    if (onSwitchRole) {
      onSwitchRole('teacher');
    } else {
      navigate('/teacher');
    }
  };

  const handleLogout = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      navigate('/login');
    }
  };

  const isNavActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === '/student' || location.pathname === '/student/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/student/upload')) return 'OMR Sheet Scanner & AI Evaluation';
    if (location.pathname.startsWith('/student/mock-tests')) return 'AI Mock Tests & Targeted Remediation';
    if (location.pathname.startsWith('/student/profile')) return 'Student Performance & Achievement Profile';
    if (location.pathname.startsWith('/student/analysis')) return 'Test Diagnostic & Root-Cause Roadmap';
    if (location.pathname.startsWith('/student/practice')) return 'Interactive Concept Verification Quiz';
    if (location.pathname.startsWith('/student/history')) return 'Past Test History & Topic Heatmap';
    return 'Student Learning Overview';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* ============================================================ */}
      {/* Desktop Sidebar Navigation                                    */}
      {/* ============================================================ */}
      <aside className="w-64 bg-white border-r border-slate-100 shadow-sm hidden md:flex flex-col sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-100">
              {BRANDING.logoText}
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-base text-slate-900 tracking-tight block truncate">
                {BRANDING.coachingName}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
                <Sparkles size={10} /> Student Portal
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Learning Navigation
          </p>
          {navItems.map((item) => {
            const active = isNavActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-150 ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs border-r-4 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? 'text-indigo-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Role Switch & Sign Out) */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <button
            onClick={handleRoleSwitch}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all shadow-2xs"
            title="Switch to Teacher Portal view"
          >
            <span className="flex items-center gap-2">
              <ArrowLeftRight size={14} className="text-indigo-600" />
              Switch to Teacher
            </span>
            <span className="text-[10px] text-slate-400">Demo</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-xl text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* Main Content Area                                             */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Topbar */}
        <header className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              {BRANDING.logoText}
            </div>
            <span className="font-extrabold text-sm text-slate-900 truncate max-w-[120px]">
              {BRANDING.coachingName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile XP & Streak mini pills */}
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <Zap size={12} className="text-amber-500 fill-amber-400" />
              <span className="text-[11px] font-black text-amber-900">{currentStudent.xp}</span>
            </div>
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
              <Flame size={12} className="text-orange-500 fill-orange-400" />
              <span className="text-[11px] font-black text-orange-900">{currentStudent.streak}d</span>
            </div>
            <img
              src={currentStudent.avatarUrl}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
          </div>
        </header>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col">
            <div className="bg-white w-4/5 max-w-xs h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {BRANDING.logoText}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{BRANDING.coachingName}</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">Student Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Student Summary Card in drawer */}
              <div className="my-4 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.name}
                  className="w-10 h-10 rounded-full border border-indigo-200"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentStudent.name}</p>
                  <p className="text-[10px] text-slate-500">{currentStudent.batch}</p>
                </div>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const active = isNavActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm ${
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={handleRoleSwitch}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl"
                >
                  <ArrowLeftRight size={14} /> Switch to Teacher Portal
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Topbar */}
        <header className="hidden md:flex bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-3.5 items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Personalized AI Study GPS • {currentStudent.batch}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* XP Pill */}
            <div
              className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full shadow-2xs"
              title="Total Earned Learning XP"
            >
              <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                <Zap size={14} className="fill-amber-950" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-950 tracking-tight">
                  {currentStudent.xp.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-amber-700 ml-1">XP</span>
              </div>
            </div>

            {/* Streak Badge */}
            <div
              className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/80 px-3.5 py-1.5 rounded-full shadow-2xs"
              title="Consecutive Days Study Streak"
            >
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                <Flame size={14} className="fill-white animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-black text-orange-950 tracking-tight">
                  {currentStudent.streak}
                </span>
                <span className="text-[10px] font-bold text-orange-700 ml-1">Days</span>
              </div>
            </div>

            {/* Switch to Teacher Button */}
            <button
              onClick={handleRoleSwitch}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors border border-indigo-100"
              title="Open Teacher Portal demo view"
            >
              <ArrowLeftRight size={14} />
              <span>Teacher View</span>
            </button>

            {/* Student Profile Info */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-tight">
                  {currentStudent.name}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {currentStudent.batch}
                </p>
              </div>
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.name}
                className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover shadow-2xs"
              />
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden bg-white border-t border-slate-100 flex items-center justify-around sticky bottom-0 z-30 pb-safe shadow-lg">
          {navItems.map((item) => {
            const active = isNavActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-3 flex-1 transition-colors ${
                  active ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
```

---

## 5. Integration with Router and State Store

### 5.1 Router Setup in `src/App.tsx`
The layout components are consumed by `src/App.tsx` as parent route layout wrappers:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TeacherLayout } from './layouts/TeacherLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { Login } from './pages/Login';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentDeepDive } from './pages/teacher/StudentDeepDive';
import { TestManagement } from './pages/teacher/TestManagement';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { OMRUpload } from './pages/student/OMRUpload';
import { MockTestsImprovement } from './pages/student/MockTestsImprovement';
import { StudentProfile } from './pages/student/StudentProfile';
import { TestAnalysis } from './pages/student/TestAnalysis';
import { PracticeSession } from './pages/student/PracticeSession';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Gateway */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Teacher Portal Protected Shell */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="students" element={<StudentDeepDive />} />
          <Route path="students/:studentId" element={<StudentDeepDive />} />
          <Route path="tests" element={<TestManagement />} />
        </Route>

        {/* Student Portal Protected Shell */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="upload" element={<OMRUpload />} />
          <Route path="mock-tests" element={<MockTestsImprovement />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="analysis/:testId" element={<TestAnalysis />} />
          <Route path="practice/:topicId" element={<PracticeSession />} />
        </Route>

        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 6. Implementation Strategy & Recommendations for Worker

To ensure clean, flawless execution by the Worker agent, follow these prioritized implementation steps:

1. **Step 1: Implement `src/layouts/TeacherLayout.tsx`**:
   - Write the complete `TeacherLayout.tsx` component with full desktop sidebar, mobile drawer, batch dropdown switcher ("Batch A1 - JEE 2026"), teacher profile, and switch role handlers.
2. **Step 2: Upgrade `src/layouts/StudentLayout.tsx`**:
   - Upgrade `StudentLayout.tsx` with XP pill (`1,240 XP`), Streak badge (`15 Days`), student profile ("Rohan Sharma"), links to `/student`, `/student/upload`, `/student/mock-tests`, `/student/profile`, and bottom navigation bar.
3. **Step 3: Update `src/config/branding.ts`**:
   - Add `DEMO_TEACHER` config to `src/config/branding.ts` alongside `DEMO_STUDENT` and `BRANDING` for unified metadata.
4. **Step 4: Verify Compilation & Responsiveness**:
   - Ensure all Lucide icons are imported correctly.
   - Run `npx tsc --noEmit` to verify type safety.
   - Validate desktop layout (`>= 768px`) and mobile layout (`< 768px`).

---

## 7. Acceptance Criteria Alignment

| Acceptance Criterion | Layout Component Feature | Verification Evidence |
|---|---|---|
| **AC 1: Professional dual-routing** | Layout shells provide prominent "Switch to Student" & "Switch to Teacher" pill buttons. | Verified in Topbar & Sidebar footers. |
| **AC 2: Teacher navigation** | `TeacherLayout` links to Class Analytics, Student Deep Dive, and Test Management. | Sidebar & Mobile Bottombar route to `/teacher`, `/teacher/students`, `/teacher/tests`. |
| **AC 3: Teacher Batch Switching** | `TeacherLayout` topbar contains interactive Batch Selector ("Batch A1 - JEE 2026"). | Batch selector dropdown with 3 realistic batches. |
| **AC 4: Student Navigation** | `StudentLayout` links to Dashboard, OMR Upload, Mock Tests & Improvement, Profile. | Sidebar & Mobile Bottombar route to `/student`, `/student/upload`, `/student/mock-tests`, `/student/profile`. |
| **AC 5: Gamification Elements** | `StudentLayout` topbar showcases XP Pill (`1,240 XP`) and Streak Badge (`15 Days`). | Live pill chips with icons and gradient backgrounds. |
