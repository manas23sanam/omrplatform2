# Original User Request

## 2026-08-14T20:08:05Z

A premium, white-labeled OMR Analysis and Personalized Learning Platform featuring both Teacher and Student portals. Inspired by top e-learning platforms, it includes test management, class analytics, student OMR uploads, and AI-driven gamified remediation with XP and leaderboards.

Working directory: C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform
Integrity mode: development
Requested team: Full multi-agent team

## Requirements

### R1. Dual-Portal Application Architecture
- Implement a professional login page that routes users to either a dedicated Teacher Dashboard or Student Dashboard.
- Build this within the existing React repository, using premium UI libraries (like Tailwind CSS) for a modern look.
- Use realistic mocked data throughout the application so the UI is immediately ready for a demo.

### R2. Teacher Interface (Analytics & Management)
- **Class Analytics**: A dashboard showing total tests conducted, overall class performance, average marks, and a breakdown of frequently missed questions.
- **Student Deep Dive**: The ability to click into individual student profiles to view their marks, performance trends, and specific mistakes.
- **Test Management**: An interface to upload question papers by test number and manually assign MCQ tests based on student mistakes.

### R3. Student Interface (Gamified Learning & Profile)
- **OMR Upload**: An interface to upload OMR sheet photos, categorized into sections: Physics, Chemistry, Maths, and Full Paper.
- **Student Profile**: A dedicated profile section where students can view their overall improvement trends and historical marks.
- **Improvement & Mock Tests**: A dedicated page specifically for accessing AI-configured mock tests and targeted improvement exercises.
- **Gamification**: Visual elements showing earned XP points and a competitive leaderboard.

## Acceptance Criteria

### Verification & Quality Bar
- [ ] An agent-judge verifies that the root URL (`/`) presents a professional login screen with options to route to `/teacher` or `/student`.
- [ ] An agent-judge verifies the Teacher Dashboard contains visible charts/graphs (using mocked data) representing overall class performance and average marks.
- [ ] An agent-judge verifies the Teacher interface contains a navigable list of students, and clicking a student reveals detailed performance data and mistakes.
- [ ] An agent-judge verifies the Student Dashboard contains an OMR upload form with explicit options for "Physics", "Chemistry", "Maths", and "Full Paper".
- [ ] An agent-judge verifies the Student portal includes a distinct "Profile" page showing score improvement trends, and a separate "Mock Tests/Improvement" page containing practice assignments.
- [ ] An agent-judge verifies that the Student Dashboard displays a gamification section featuring an XP score and a visible Leaderboard component.

## 2026-08-17T03:19:45Z

Execute a comprehensive UI/UX structural cleanup of the React AI Learning Platform to remove visual clutter, redundant information, and inconsistent UI patterns.

Working directory: C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform
Integrity mode: development

## Requirements

### R1. Global Layout & Header Simplification
- Modify `src/components/layout/Topbar.tsx` (or equivalent global header) to be a single slim strip containing only the Logo, Coaching Name, User Profile block, and Sign Out button.
- Remove redundant XP/Streak pills, subtitles, and the "Switch to Teacher / Demo" button from the header.

### R2. Page Architecture & Stat Cards Redesign
- In `src/pages/student/StudentDashboard.tsx`, redesign the top 4 snapshot cards to a consistent, minimal pattern: Muted label above, bold number below, and **absolutely no icons**. 
- Remove borders from secondary sections, using `bg-slate-50` fill blocks instead.
- Modify `src/components/student/XPWidget.tsx` to flatten the design and act as the single source of truth for XP/Streak (removing internal redundant labels).

### R3. Test Analysis Refactoring
- In `src/pages/student/TestAnalysis.tsx`, reduce the hero header height and remove embedded metric tiles and floating action buttons ("Upload Another OMR", "Practice Drills").
- In `src/components/student/QuestionBreakdownTable.tsx`, entirely rip out the Subject, Status, and Search filters. Convert the table into a flat, scannable list where the status icon (Check/Cross) does the heavy lifting, the subject tag is muted text on the right, and full-row colored backgrounds are removed.
- In `src/components/student/ConceptGapCard.tsx`, remove full-card colored background tints (use white or light gray). Use color only on the Priority Badge, simplify the AI reasoning to a single actionable sentence, and include exactly **one** clear action button per card.

## Acceptance Criteria

### Verification & Quality Bar
- [ ] An agent-judge verifies that the global Topbar component does not render any XP/Streak pills or role-switching buttons.
- [ ] An agent-judge verifies that the snapshot stat cards in `StudentDashboard.tsx` no longer import or render Lucide icons.
- [ ] An agent-judge verifies that `QuestionBreakdownTable.tsx` no longer contains `<input>` or `<select>` elements for filtering, and does not use full-row background color classes (`bg-red-50`, `bg-green-50`, etc) for correct/incorrect states.
- [ ] An agent-judge verifies that `ConceptGapCard.tsx` renders exactly one `<button>` or `<Link>` element for action.
