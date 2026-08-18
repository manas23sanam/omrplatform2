# Codebase & Tech Stack Survey Report

**Explorer**: Explorer 1 (Codebase & Tech Stack Explorer)  
**Date**: 2026-08-14 / 2026-08-15  
**Workspace Root**: `C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform`  
**Integrity Mode**: Development  

---

## 1. Executive Summary

The project is an AI-powered OMR Analysis and Personalized Learning Platform (branded for **Brothers Academy**) built on a modern **React 19 + TypeScript + Vite 8 + Tailwind CSS v4** stack with **Recharts** and **Lucide Icons**. 

While the baseline repository contains student-focused prototype pages and mock AI endpoints, it currently lacks the **Teacher Interface** (Class Analytics, Student Deep Dive, Test Management) and requires key updates to the **Student Interface** (categorized OMR upload sections, dedicated Mock Tests / Improvement page, embedded Dashboard Leaderboard & XP widgets) and **Dual-Portal Login & Routing Architecture** (`/`, `/teacher`, `/student`).

---

## 2. Tech Stack & Environment Analysis

### 2.1 Core Framework & Tooling
| Component | Version / Library | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React `^19.2.8`, React DOM `^19.2.8` | Installed & Operational | Latest React 19 architecture |
| **Language** | TypeScript `~6.0.2` | Installed | Configured via `tsconfig.app.json` & `tsconfig.node.json` |
| **Bundler & Dev Server** | Vite `^8.2.0` | Installed | Fast HMR enabled |
| **Styling & CSS** | Tailwind CSS `^4.3.3` + `@tailwindcss/vite` `^4.3.3` | Configured | Uses Tailwind v4 `@theme` in `src/index.css` |
| **CSS Utilities** | `clsx` `^2.1.1`, `tailwind-merge` `^3.6.0` | Installed | Ready for composable `cn()` class helper |
| **Icons** | `lucide-react` `^1.28.0` | Installed | Rich icon set for badges, subjects, metrics |
| **Data Visualization** | `recharts` `^3.10.1` | Installed | Area, Bar, Line, ResponsiveContainer |
| **Routing** | `react-router-dom` `^7.18.2` | Installed | Modern router supporting nested routes |
| **Backend Client** | `@supabase/supabase-js` `^2.111.0` | Installed | Configured in `src/lib/supabase.ts` with demo mode |
| **Linter** | `oxlint` `^1.75.0` | Configured | Fast Rust-based linter |
| **Backend (Optional)** | FastAPI (`backend/main.py`) | Present | Python backend with `/api/assess` mock endpoint |

### 2.2 Available npm Scripts
From `package.json`:
- `npm run dev`: Launches Vite dev server (`vite`).
- `npm run build`: Type-checks and builds for production (`tsc -b && vite build`).
- `npm run lint`: Runs Oxlint (`oxlint`).
- `npm run preview`: Previews Vite production build (`vite preview`).

### 2.3 Build Verification Findings
- Running `tsc -b && vite build` identified an isolated TypeScript type check issue in the legacy file `src/components/LoginPage.tsx` (line 45: access to protected `supabase.supabaseUrl`).
- Fixing or replacing the legacy login component with the new dual-portal login will resolve this compilation check immediately.
- `npm test` script is not currently configured in `package.json`.

---

## 3. Existing Codebase Layout

```
C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\
├── backend/                  # FastAPI mock assessment backend
│   ├── main.py
│   └── requirements.txt
├── public/                   # Static assets (favicons, svgs)
├── src/
│   ├── assets/               # Images and SVGs
│   ├── components/           # UI widgets (Leaderboard, MasteryMap, StatCard, etc.)
│   ├── config/
│   │   └── branding.ts       # Branding config (Brothers Academy, DEMO_STUDENT)
│   ├── layouts/
│   │   └── StudentLayout.tsx # Student portal sidebar and topbar layout
│   ├── lib/
│   │   └── supabase.ts       # Supabase client setup
│   ├── pages/
│   │   ├── Analysis.tsx      # Test analysis & AI recommendations
│   │   ├── Dashboard.tsx     # Student dashboard overview
│   │   ├── History.tsx       # Past tests and topic heatmap
│   │   ├── Login.tsx         # Single-portal login page
│   │   ├── Practice.tsx      # Practice review session
│   │   ├── Profile.tsx       # Student profile wrapper
│   │   └── Upload.tsx        # Generic OMR upload page
│   ├── App.css
│   ├── App.tsx               # App routing and auth state
│   ├── index.css             # Tailwind v4 theme & base rules
│   └── main.tsx              # React bootstrap
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 4. Gap Analysis vs. `ORIGINAL_REQUEST.md`

### 4.1 Requirement 1: Dual-Portal Application Architecture (R1)
- **Requirement**: Professional login page at root URL (`/`) routing users to either a dedicated **Teacher Dashboard** (`/teacher`) or **Student Dashboard** (`/student`).
- **Current State**: `/` redirects to `/login`, which only supports student login into `/dashboard`. There are no teacher routes, no teacher portal layout, and no role selector.
- **Action Needed**:
  1. Update `Login.tsx` to provide seamless role switching ("Teacher Portal" / "Student Portal" or instant demo login for either role).
  2. Implement dual-branch routing in `App.tsx`:
     - `/` -> Dual-Portal Login / Role Selection
     - `/teacher/*` -> Protected Teacher Layout & sub-routes
     - `/student/*` -> Protected Student Layout & sub-routes

### 4.2 Requirement 2: Teacher Interface (Analytics & Management) (R2)
- **Requirement**:
  - **Class Analytics**: Total tests conducted, overall class performance, average marks, breakdown of frequently missed questions with visible charts/graphs.
  - **Student Deep Dive**: Navigable list of students with click-through drilldowns to view individual marks, historical performance trends, and specific concept mistakes.
  - **Test Management**: Upload question papers by test number, view test repository, and assign MCQ remediation tests based on mistake patterns.
- **Current State**: **0% implemented**. No teacher components or pages currently exist.
- **Action Needed**:
  1. Create `TeacherLayout.tsx` with dedicated sidebar (Dashboard, Student Deep Dive, Test Management, Question Papers).
  2. Create `TeacherDashboard.tsx` with Recharts bar/area charts for class marks distribution, average scores, and frequently missed questions breakdown.
  3. Create `StudentDeepDive.tsx` (or student list + detail drawer/modal) with individual student trajectories, radar/trend charts, and topic mistake logs.
  4. Create `TestManagement.tsx` to handle question paper uploads by Test ID/Number, answer key configuration, and manual MCQ test assignment to students.

### 4.3 Requirement 3: Student Interface (Gamified Learning & Profile) (R3)
- **Requirement**:
  - **OMR Upload Form**: Explicit categorization options for **"Physics"**, **"Chemistry"**, **"Maths"**, and **"Full Paper"**.
  - **Student Profile**: Dedicated profile showing score improvement trends and historical marks.
  - **Mock Tests / Improvement**: Dedicated separate page specifically for accessing AI-configured mock tests and targeted improvement exercises.
  - **Gamification**: Visual elements showing earned XP points and a competitive leaderboard prominently on the dashboard.
- **Current State**:
  - `Upload.tsx` has a generic upload dropzone without section selection tabs ("Physics", "Chemistry", "Maths", "Full Paper").
  - `Dashboard.tsx` lacks embedded XP gamification widgets and an inline leaderboard.
  - No dedicated "Mock Tests & Improvement" page in navigation.
- **Action Needed**:
  1. Enhance `Upload.tsx` with subject selector pills/tabs (`Physics`, `Chemistry`, `Maths`, `Full Paper`), subject-specific presets, answer key comparison, and instant AI diagnostic report.
  2. Create a dedicated `MockTestsImprovement.tsx` page in the student portal for AI mock tests, weak-area drills, and practice assignments.
  3. Embed the `Leaderboard` component and XP progress widget directly into `StudentDashboard.tsx`.
  4. Ensure `Profile.tsx` showcases score improvement trajectories, earned badges, and historical test performance breakdown.

---

## 5. Dependency Evaluation & Recommendations

### 5.1 Existing Dependencies (Sufficient & Ready)
- **UI & Styling**: Tailwind CSS v4 is integrated and working.
- **Icons**: `lucide-react` is installed and has all necessary icons (`Trophy`, `Medal`, `Target`, `Flame`, `Zap`, `BookOpen`, `BrainCircuit`, `UploadCloud`, `CheckCircle2`, `BarChart3`, `Users`, `FileSpreadsheet`, etc.).
- **Charting**: `recharts` is installed and supports `BarChart`, `AreaChart`, `LineChart`, `PieChart`, `RadarChart`, `ResponsiveContainer`, `Tooltip`, and `CartesianGrid`.
- **Routing**: `react-router-dom` v7 is installed and supports all necessary routing structures.

### 5.2 Recommended Additional Dependencies
1. **Testing Suite** (For automated testing and verification):
   - `vitest`
   - `@testing-library/react`
   - `@testing-library/jest-dom`
   - `@testing-library/user-event`
   - `jsdom`
2. **Animation / Celebrations** (Optional enhancement for XP / Quiz completion):
   - `canvas-confetti` + `@types/canvas-confetti` (or CSS keyframe animations).

---

## 6. Proposed Architectural Design & File Organization

### 6.1 Data Layer (`src/data/`)
Create a comprehensive, strongly-typed realistic mock data repository (`src/data/mockData.ts`):
- **Class Analytics Data**: Tests conducted (Weekly Test 1–12, Full Mocks 1–4), average score (71.4%), top performing topics, frequently missed questions with difficulty tags & mistake rationale.
- **Students Data**: 15+ realistic students with batch info, test histories, strengths, weaknesses, XP, streaks, and ranks.
- **Question Paper & Test Bank**: Test numbering (e.g. `TEST-PHY-104`, `TEST-CHEM-202`, `TEST-FULL-01`), subject categorization, assigned status, question breakdown.
- **Mock Tests & Improvement Tasks**: AI-generated practice assignments with topic targets and estimated completion times.

### 6.2 Target Directory Layout

```
src/
├── data/
│   └── mockData.ts                  # Centralized, realistic data for demo
├── types/
│   ├── auth.ts                      # User roles ('teacher' | 'student')
│   ├── test.ts                      # Test, Question, OMR, Submission, Analytics types
│   └── student.ts                   # Student, Mistake, XP, Leaderboard types
├── config/
│   └── branding.ts                  # Brothers Academy branding config
├── layouts/
│   ├── TeacherLayout.tsx            # Teacher portal layout with navigation & branding
│   └── StudentLayout.tsx            # Student portal layout with navigation & XP summary
├── pages/
│   ├── Login.tsx                    # Dual-portal login page (Teacher / Student quick switch)
│   ├── teacher/
│   │   ├── TeacherDashboard.tsx     # Class Analytics, Average Marks, Missed Questions
│   │   ├── StudentDeepDive.tsx      # Student profile list, performance trend, mistake drilldown
│   │   └── TestManagement.tsx       # Upload question papers by test#, assign MCQ tests
│   └── student/
│       ├── StudentDashboard.tsx     # Overview, XP Score, Streak, Leaderboard, Recent tests
│       ├── OMRUpload.tsx            # Section selection (Physics, Chemistry, Maths, Full Paper)
│       ├── MockTestsImprovement.tsx # AI mock tests & targeted practice exercises
│       ├── StudentProfile.tsx       # Historical marks, score trends, achievements
│       ├── TestAnalysis.tsx         # Detailed test breakdown & AI roadmap
│       └── PracticeSession.tsx      # Interactive remediation session
├── components/
│   ├── common/                      # StatCard, Modal, Badge, ScoreChart
│   ├── teacher/                     # ClassPerformanceChart, MissedQuestionsTable, AssignTestModal
│   └── student/                     # LeaderboardWidget, XPWidget, SectionSelector
├── lib/
│   ├── supabase.ts                  # Supabase client
│   └── utils.ts                     # cn helper
├── App.tsx                          # Dual-portal routes configuration
└── main.tsx
```

---

## 7. Next Steps & Recommendations for Implementation Team

1. **Fix Compile Issue**: Clean up `LoginPage.tsx` so `tsc -b && vite build` passes cleanly.
2. **Implement Dual-Portal Routing**: Update `src/App.tsx` and `src/pages/Login.tsx` with dedicated Teacher (`/teacher/*`) and Student (`/student/*`) routes.
3. **Build Teacher Portal Modules**:
   - `TeacherDashboard`: Class performance charts, average marks metric, frequently missed questions table.
   - `StudentDeepDive`: Student list with detailed popover/drawer showing mistake breakdown and performance trajectory.
   - `TestManagement`: Test paper upload form by test number + manual MCQ assignment workflow.
4. **Upgrade Student Portal Modules**:
   - `OMRUpload`: Add explicit section selector tabs ("Physics", "Chemistry", "Maths", "Full Paper") with instant feedback.
   - `MockTestsImprovement`: Dedicated page for AI mock tests & practice assignments.
   - `StudentDashboard`: Embed live XP counter, streak badge, and Leaderboard.
   - `StudentProfile`: Showcase score improvement trends and historical test logs.
5. **Configure Testing Tools**: Add Vitest / Testing Library for automated verification of all acceptance criteria.
