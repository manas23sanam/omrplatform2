## 2026-08-14T20:13:47Z
You are Explorer 3 for Milestone 1 (Layout Shells & Navigation Architecture).
Your working directory: C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\explorer_m1_3
Project root: C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform
Original Request: C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\ORIGINAL_REQUEST.md
Project Spec: C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\PROJECT.md

Scope of Milestone 1:
- F02: Teacher Portal Layout Shell (`src/layouts/TeacherLayout.tsx`)
- F03: Student Portal Layout Shell (`src/layouts/StudentLayout.tsx`)
- Common UI components and navigation consistency across desktop & mobile

Your Task:
1. Investigate `src/layouts/StudentLayout.tsx` and existing components.
2. Design `TeacherLayout.tsx` with:
   - Sidebar: Class Analytics (`/teacher`), Student Deep Dive (`/teacher/students`), Test Management (`/teacher/tests`)
   - Topbar: Batch selector ("Batch A1 - JEE 2026"), Teacher profile ("Dr. S. K. Verma"), Switch to Student / Logout
3. Upgrade `StudentLayout.tsx` with:
   - Sidebar/Bottombar: Dashboard (`/student`), OMR Upload (`/student/upload`), Mock Tests & Improvement (`/student/mock-tests`), Profile (`/student/profile`)
   - Topbar: XP pill (`1,240 XP`), Streak badge (`15 Days`), Student avatar ("Rohan Sharma"), Switch to Teacher / Logout
4. Detail the recommended implementation strategy for the Worker in `C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\explorer_m1_3\analysis.md`.
5. Write `handoff.md` in your working directory and notify the orchestrator via send_message.
