# Handoff Report: Milestone 1 Layout Shells & Navigation Architecture

**Explorer**: Explorer 3 (Layout Shells & Navigation Architecture)  
**Milestone**: M1 - Core Foundation, State Store & Dual-Portal Gateway  
**Date**: 2026-08-15  
**Handoff Type**: Hard (Investigation & Design Complete)  

---

## 1. Observation

1. **Existing Student Layout (`src/layouts/StudentLayout.tsx`)**:
   - `StudentLayout.tsx` (lines 9-14) contains 4 hardcoded navigation items: `/dashboard`, `/upload`, `/history`, and `/profile`.
   - It currently lacks a link to the required **"Mock Tests & Improvement"** page (`/student/mock-tests`) specified in `ORIGINAL_REQUEST.md` (lines 26, 36) and `PROJECT.md` (line 36).
   - The topbar in `StudentLayout.tsx` (lines 74-85) displays only the student name and batch, but lacks the gamification **XP Pill** (`1,240 XP`) and **Streak Badge** (`15 Days`) requested in `ORIGINAL_REQUEST.md` (lines 27, 37) and the user prompt.
   - It lacks a quick role switcher ("Switch to Teacher") in both the sidebar footer and topbar.

2. **Absence of Teacher Layout (`src/layouts/TeacherLayout.tsx`)**:
   - `src/layouts/TeacherLayout.tsx` does not exist in the codebase.
   - `ORIGINAL_REQUEST.md` (lines 14, 18-21) and `PROJECT.md` (lines 18, 76) require a dedicated `TeacherLayout.tsx` shell for `/teacher/*` with:
     - Sidebar navigation: **Class Analytics** (`/teacher`), **Student Deep Dive** (`/teacher/students`), and **Test Management** (`/teacher/tests`).
     - Topbar: Interactive **Batch Selector Dropdown** ("Batch A1 - JEE 2026"), **Teacher Profile** ("Dr. S. K. Verma"), and **Switch to Student** / **Logout** controls.

3. **Branding & Demo Data (`src/config/branding.ts`)**:
   - `branding.ts` (lines 1-18) exports `BRANDING` (coachingName: 'Brothers Academy', logoText: 'BA') and `DEMO_STUDENT` (name: 'Rohan', batch: 'Batch A1', avatarUrl: 'https://i.pravatar.cc/150?u=rohan').
   - `DEMO_TEACHER` configuration is currently missing and should be added for clean fallback usage across teacher layouts and components.

4. **Tailwind CSS and Icon Environment**:
   - `@tailwindcss/vite` (v4.3.3) and `@tailwindcss` theme tokens are loaded in `src/index.css`.
   - `lucide-react` (v1.28.0) is installed and operational with all required icons: `LayoutDashboard`, `BarChart3`, `Users`, `FileSpreadsheet`, `UploadCloud`, `BrainCircuit`, `User`, `Zap`, `Flame`, `ArrowLeftRight`, `LogOut`, `Layers`, `ChevronDown`, `Menu`, `X`, `Sparkles`, `ShieldCheck`.

---

## 2. Logic Chain

1. **Premise 1 (Teacher Portal Shell Requirement)**: From Observation 2, `TeacherLayout.tsx` is required for all educator routes (`/teacher/*`). To support all acceptance criteria (AC 1, AC 2, AC 3), the layout must provide:
   - Fixed desktop sidebar + responsive mobile drawer with routes: `/teacher` (Class Analytics), `/teacher/students` (Student Deep Dive), and `/teacher/tests` (Test Management).
   - Topbar containing an interactive Batch Selector dropdown ("Batch A1 - JEE 2026"), teacher identity ("Dr. S. K. Verma"), quick switch button to student view, and logout trigger.
   - Dynamic page header reflecting the active route.

2. **Premise 2 (Student Portal Shell Upgrade Requirement)**: From Observation 1, `StudentLayout.tsx` must be upgraded to meet AC 4, AC 5, and AC 6. It requires:
   - Fixed desktop sidebar + responsive mobile bottom navigation bar with routes: `/student` (Dashboard), `/student/upload` (OMR Upload), `/student/mock-tests` (Mock Tests & Improvement), and `/student/profile` (My Profile).
   - Topbar containing gamified real-time chips: XP Pill (`1,240 XP` with amber styling) and Streak Badge (`15 Days` with flame animation), student profile ("Rohan Sharma - Batch A1"), quick switch button to teacher view, and logout trigger.

3. **Premise 3 (Routing & Sub-route Matching)**: Active route highlighting in both layouts must support exact and nested prefix matching (e.g. `/teacher/students/:id` highlights "Student Deep Dive", `/student/practice/:id` highlights "Mock Tests & Improvement").

4. **Premise 4 (Resilient State & Default Fallbacks)**: By utilizing default fallback objects (`DEMO_STUDENT`, `DEMO_TEACHER`) and standard React state for the batch dropdown and mobile drawer, both layout shells will function smoothly whether wrapped in a store context or evaluated standalone in testing harnesses.

---

## 3. Caveats

- **Caveat 1**: Child page implementations (`TeacherDashboard`, `StudentDeepDive`, `TestManagement`, `MockTestsImprovement`, etc.) belong to Milestones 2 and 3. In Milestone 1, placeholder page components or existing pages will render inside `<Outlet />`.
- **Caveat 2**: In production, the Batch Selector will synchronize with `useLearningStore().selectedBatch`. The layout design includes local state with seamless store sync readiness.
- **Caveat 3**: No caveats regarding layout rendering or responsive breakpoints.

---

## 4. Conclusion

1. **Deliverable 1 (`TeacherLayout.tsx`)**: The full production source code for `src/layouts/TeacherLayout.tsx` is finalized and documented in `analysis.md` (Section 4.1). It includes the complete desktop sidebar, mobile drawer, batch dropdown switcher ("Batch A1 - JEE 2026"), Dr. S. K. Verma profile header, switch to student button, and mobile bottombar.
2. **Deliverable 2 (`StudentLayout.tsx`)**: The upgraded production source code for `src/layouts/StudentLayout.tsx` is finalized and documented in `analysis.md` (Section 4.2). It includes the 4 core student routes (`/student`, `/student/upload`, `/student/mock-tests`, `/student/profile`), gamified XP pill (`1,240 XP`), streak badge (`15 Days`), Rohan Sharma avatar, switch to teacher button, and mobile bottombar.
3. **Deliverable 3 (`branding.ts`)**: Add `DEMO_TEACHER` configuration to `src/config/branding.ts` to supply standardized teacher metadata across the app.

---

## 5. Verification Method

1. **Codebase Inspection**:
   - Verify `src/layouts/TeacherLayout.tsx` exists and exports `TeacherLayout`.
   - Verify `src/layouts/StudentLayout.tsx` contains the updated nav items (`/student`, `/student/upload`, `/student/mock-tests`, `/student/profile`) and topbar gamification pills (`XP` and `Streak`).
2. **Type Checking & Build Command**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
3. **Runtime & Layout Verification**:
   - Navigate to `/teacher` -> verify Teacher sidebar (Class Analytics, Student Deep Dive, Test Management), topbar batch selector ("Batch A1 - JEE 2026"), teacher profile ("Dr. S. K. Verma"), and "Student View" button.
   - Navigate to `/student` -> verify Student sidebar (Dashboard, OMR Upload, Mock Tests & Improvement, My Profile), topbar XP Pill (`1,240 XP`), Streak Badge (`15 Days`), and "Teacher View" button.
   - Test viewport resize `< 768px` -> verify mobile header, mobile drawer menu, and mobile bottom navigation bar render cleanly.
