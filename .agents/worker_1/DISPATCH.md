## 2026-08-17T03:24:45Z
You are Worker 1. Your working directory is C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\worker_1.
The project root is C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform.

MANDATORY: Read ORIGINAL_REQUEST.md at C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\ORIGINAL_REQUEST.md before starting work.
Also review the explorer handoff reports:
- C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\explorer_1\handoff.md
- C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\explorer_2\handoff.md
- C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\explorer_3\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task is to implement the full UI/UX structural cleanup:
1. **Global Layout & Header Simplification (R1)**:
   - Modify `src/components/Topbar.tsx` to be a single slim strip containing only Logo, Coaching Name, User Profile block, and Sign Out button.
   - Remove redundant XP/Streak pills, subtitles, and "Switch to Teacher / Demo" buttons from the header.
   - Create `src/components/layout/Topbar.tsx` re-exporting `Topbar` for path compatibility.
   - Clean desktop layout headers in `src/layouts/StudentLayout.tsx` and `src/layouts/TeacherLayout.tsx` of XP/streak pills, subtitles, and role-switch buttons if present.
2. **Page Architecture & Stat Cards Redesign (R2)**:
   - In `src/pages/student/StudentDashboard.tsx`, redesign the top 4 snapshot cards to a consistent, minimal pattern: muted label above, bold number below, and ABSOLUTELY NO ICONS (do NOT import or render Lucide icons `Target`, `TrendingUp`, `Award`, `Flame` in snapshot cards).
   - Remove borders from secondary sections, using `bg-slate-50` fill blocks instead.
   - Retain the Quick Action banner (`Upload OMR Sheet` with `<Link to="/student/upload">Upload OMR Now</Link>`) formatted as a clean `bg-slate-50` block for test compatibility.
   - Modify `src/components/student/XPWidget.tsx` to flatten design and act as the single source of truth for XP/Streak (removing internal redundant labels while preserving test-asserted strings like `Total XP`, `Daily Streak`, `Progress to Level`, `7-Day Study Calendar`).
3. **Test Analysis Refactoring (R3)**:
   - In `src/pages/student/TestAnalysis.tsx`, reduce hero header height and remove embedded metric tiles (`Score`, `Accuracy`, `Batch Rank`, `XP Earned`) and floating action buttons ("Upload Another OMR", "Practice Drills").
   - In `src/components/student/QuestionBreakdownTable.tsx`, entirely rip out Subject, Status, and Search filters (NO `<input>` or `<select>` elements). Convert into a flat scannable list where status icon (CheckCircle2, XCircle, MinusCircle) does heavy lifting, subject tag is muted text on right, and no full-row background color classes (`bg-red-50`, `bg-green-50`, etc).
   - In `src/components/student/ConceptGapCard.tsx`, remove full-card colored background tints (use neutral white/light gray), color only on Priority Badge, simplify AI reasoning to a single actionable sentence, and include exactly ONE action button/link per card (`<Link>` to practice quiz).
4. **Test Alignment & Verification**:
   - Update `src/__tests__/pages/TestAnalysis.test.tsx` (and any other test files if needed) so tests align with the streamlined hero header while maintaining full coverage.
   - Run `npm run build`, `npm run test`, and `npm run lint` to verify that all builds succeed, all tests pass, and linter is clean.

Write ownership:
- You exclusively own all modified component files and test files in `src/`.
