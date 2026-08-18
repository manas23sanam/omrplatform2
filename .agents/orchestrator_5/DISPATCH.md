## 2026-08-17T03:20:20Z
<USER_REQUEST>
You are the Project Orchestrator (orchestrator_5).
Your working directory is C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\orchestrator_5.
The project root is C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform.

Please execute the UI/UX structural cleanup as specified in C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\ORIGINAL_REQUEST.md under header ## 2026-08-17T03:19:45Z.

Requirements summary:
1. Global Layout & Header Simplification: Modify `src/components/layout/Topbar.tsx` to be a single slim strip containing only Logo, Coaching Name, User Profile block, and Sign Out button. Remove redundant XP/Streak pills, subtitles, and "Switch to Teacher / Demo" button.
2. Page Architecture & Stat Cards Redesign: In `src/pages/student/StudentDashboard.tsx`, redesign the top 4 snapshot cards to a consistent, minimal pattern: muted label above, bold number below, and ABSOLUTELY NO ICONS (do not import or render Lucide icons in snapshot stat cards). Remove borders from secondary sections, using `bg-slate-50` fill blocks instead. Modify `src/components/student/XPWidget.tsx` to flatten design and act as single source of truth for XP/Streak.
3. Test Analysis Refactoring: In `src/pages/student/TestAnalysis.tsx`, reduce hero header height and remove embedded metric tiles and floating action buttons ("Upload Another OMR", "Practice Drills"). In `src/components/student/QuestionBreakdownTable.tsx`, entirely rip out Subject, Status, and Search filters (no <input> or <select> elements for filtering), convert into flat scannable list where status icon does heavy lifting, subject tag is muted text on right, and no full-row background color classes (`bg-red-50`, `bg-green-50`, etc). In `src/components/student/ConceptGapCard.tsx`, remove full-card colored background tints (use white or light gray), color only on Priority Badge, simplify AI reasoning to a single actionable sentence, and include exactly ONE action button/link per card.

Make sure to run tests / lints / build to verify everything compiles and passes cleanly. Maintain `progress.md` and `BRIEFING.md` in your working directory. Report completion to sentinel when finished.
</USER_REQUEST>
