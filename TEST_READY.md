# TEST_READY.md — OMR Analysis & Personalized Learning Platform

## 1. Test Environment & Harness Architecture
- **Test Framework**: Vitest (`^4.1.10`)
- **DOM Testing Environment**: JSDOM (`^30.0.1`) + `@testing-library/react` (`^16.3.2`) + `@testing-library/jest-dom` (`^7.0.1`) + `@testing-library/user-event` (`^14.6.4`)
- **Test Configuration**: `vite.config.ts` (Vitest config block with JSDOM environment, setup file `src/test/setup.ts`, and CSS processing).
- **Test Setup Polyfills (`src/test/setup.ts`)**:
  - ResizeObserver mock polyfill
  - Window matchMedia polyfill
  - Window scrollTo & URL mock polyfill
  - Recharts `ResponsiveContainer` mock for deterministic SVG/DOM rendering in JSDOM

---

## 2. Test Execution Commands

| Target / Mode | Command | Description |
|---|---|---|
| **Run All Tests (CI / Headless)** | `npm test` or `npx vitest run` | Executes all 18 test suites across Tiers 1–4 |
| **Interactive Watch Mode** | `npm run test:watch` or `npx vitest` | Watch mode with instant feedback on file changes |
| **TypeScript Build Check** | `npm run build` (`tsc -b && vite build`) | Type checking and production asset compilation |
| **Code Linting** | `npm run lint` (`oxlint`) | Static code analysis and lint rules |

---

## 3. Complete Test Suites Matrix & Acceptance Criteria Mapping

| Tier | Category | Test File | Covered Features & Acceptance Criteria | Test Scope |
|---|---|---|---|---|
| **Tier 1** | **Unit & State Store** | `src/__tests__/store/LearningStoreContext.test.tsx` | F04, State Persistence | `loginAs`, `loginWithCredentials`, `logout`, `uploadTestPaper`, `assignMCQTest`, `submitOMR`, `completePracticeQuiz`, `addXp`, `resetToDefaults`, `localStorage` hydration |
| **Tier 1** | **Unit & Algorithms** | `src/__tests__/lib/gamification.test.ts` | F17, Gamification Engine | `getLevelInfo` (Levels 1-7, edge cases), `getStreakMultiplier`, `formatXp` |
| **Tier 2** | **Component & AC1** | `src/__tests__/pages/Login.test.tsx` | **AC1** Dual-Portal Gateway | 1-Click Teacher demo routing (`/teacher`), 1-Click Student demo routing (`/student/dashboard`), credential tabs, Auto-fill demo helper |
| **Tier 2** | **Component & AC2** | `src/__tests__/pages/TeacherDashboard.test.tsx` | **AC2** Teacher Analytics | 4 KPI Cards (Tests Conducted, Class Avg Score, Accuracy, Active Students), `ClassPerformanceChart`, `SubjectMasteryChart`, Frequently Missed Questions Diagnostic Table & Remediation Modal |
| **Tier 2** | **Component & AC3** | `src/__tests__/pages/StudentDeepDive.test.tsx` | **AC3** Student Deep Dive | Navigable roster, quartile filter ('all', 'top 80%+', '67-80%', 'remediation <67%'), search, individual metrics, trajectory chart, mistakes log with student picked vs correct option & AI diagnosis |
| **Tier 2** | **Component & F12/F13** | `src/__tests__/pages/TestManagement.test.tsx` | F12, F13 Test Assigner | Conducted test papers catalog, Question Paper Upload modal with interactive ABCD bubble grid & bulk tools, MCQ Drill Assignment modal |
| **Tier 2** | **Component & AC4** | `src/__tests__/pages/OMRUpload.test.tsx` | **AC4** Categorized OMR Upload | Explicit 4 options ("Physics", "Chemistry", "Maths", "Full Paper"), preset sample picker, drag-and-drop zone, camera scanner modal, multi-stage scan visualizer |
| **Tier 2** | **Component & AC5** | `src/__tests__/pages/StudentProfile.test.tsx` | **AC5 (Profile)** | Distinct `/student/profile` page, score improvement trends chart, subject mastery bars, test history log table, badge achievements gallery |
| **Tier 2** | **Component & AC5** | `src/__tests__/pages/MockTestsImprovement.test.tsx` | **AC5 (Mock Tests)** | Distinct `/student/mock-tests` page, AI mock test cards (XP rewards, difficulty), weak-topics study checklist with interactive status tags & quiz launchers |
| **Tier 2** | **Component & AC6** | `src/__tests__/pages/StudentDashboard.test.tsx` | **AC6** Gamification & Leaderboard | Gamification section with total XP score, level, daily streak, and visible `BatchLeaderboard` component (podium #1-#3, ranked peer table) |
| **Tier 3** | **Interactive Quiz** | `src/__tests__/pages/PracticeSession.test.tsx` | F21 Remediation Quiz | 5-question verification drill, countdown timer, instant feedback mode, option selection, step-by-step AI derivations, score calculation, XP store sync |
| **Tier 3** | **Diagnostic Report** | `src/__tests__/pages/TestAnalysis.test.tsx` | F16 Diagnostic Breakdown | Score hero banner, subject score breakdown, priority concept gaps, recovery roadmap GPS widget, question breakdown table |
| **Tier 3** | **Security & Guard** | `src/__tests__/components/RoleGuard.test.tsx` | F01 Role Guarding | Unauthenticated redirection, teacher/student role authorization boundaries |
| **Tier 3** | **UI Subcomponents** | `src/__tests__/components/BatchLeaderboard.test.tsx` | F18 Leaderboard | Podium rendering, student search filter, timeframe toggles |
| **Tier 3** | **UI Subcomponents** | `src/__tests__/components/OMRCategoryTabs.test.tsx` | F14 Category Tabs | Explicit rendering and switching across Physics, Chemistry, Mathematics, Full Paper |
| **Tier 4** | **E2E User Journeys** | `src/__tests__/e2e/NavigationAndFlows.test.tsx` | Cross-Portal Workflows | Teacher workflow (`/` -> `/teacher` -> Student Deep Dive -> Tests) and Student workflow (`/` -> `/student/dashboard` -> OMR Upload -> Mock Tests -> Profile) |
| **Tier 4** | **Adversarial Teacher** | `src/__tests__/teacher-workflows.test.tsx` | Teacher Workflows & Edge Cases | RoleGuard protection, empty trends, 0/300 marks edge cases, question key grid resizing & quick-fills, 1-click drill assignments |
| **Tier 4** | **Adversarial Student** | `src/__tests__/adversarial/StudentPortalGamificationAdv.test.tsx` | Student Portal & Gamification | Negative/zero/boundary/extreme XP scaling, streak multipliers at boundary days, Indian number formatting, 4 OMR categories, distinct routes, interactive quiz derivations |

---

## 4. Acceptance Criteria Verification Checklist
- [x] **AC1**: Root URL (`/`) presents a professional login screen with options to route to `/teacher` or `/student`.
- [x] **AC2**: Teacher Dashboard contains visible charts/graphs representing overall class performance and average marks.
- [x] **AC3**: Teacher interface contains a navigable list of students, and clicking a student reveals detailed performance data and mistakes.
- [x] **AC4**: Student Dashboard contains an OMR upload form with explicit options for "Physics", "Chemistry", "Maths", and "Full Paper".
- [x] **AC5**: Student portal includes a distinct "Profile" page showing score improvement trends, and a separate "Mock Tests/Improvement" page containing practice assignments.
- [x] **AC6**: Student Dashboard displays a gamification section featuring an XP score and a visible Leaderboard component.
