# Project: UI/UX Structural Cleanup

## Architecture
- React + Tailwind CSS + TypeScript frontend
- Key modules touched:
  - `src/components/Topbar.tsx`
  - `src/components/layout/Topbar.tsx`
  - `src/layouts/StudentLayout.tsx`
  - `src/layouts/TeacherLayout.tsx`
  - `src/pages/student/StudentDashboard.tsx`
  - `src/components/student/XPWidget.tsx`
  - `src/pages/student/TestAnalysis.tsx`
  - `src/components/student/QuestionBreakdownTable.tsx`
  - `src/components/student/ConceptGapCard.tsx`
  - `src/__tests__/pages/TestAnalysis.test.tsx`
  - `src/__tests__/adversarial/UIUXStructuralCleanupAdv.test.tsx`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Global Layout & Header Simplification | Slim single strip Topbar: Logo, Coaching Name, Profile block, Sign Out. Remove XP/Streak pills, subtitles, Switch button. | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Page Architecture & Stat Cards Redesign | Minimal snapshot cards in StudentDashboard: muted label above, bold number below, NO icons. Remove borders from secondary sections (bg-slate-50 fill). XPWidget flattened. | M2 | ORIGINAL_REQUEST §R2 |
| 3 | Test Analysis Refactoring | Reduce hero header height, remove embedded metric tiles & floating action buttons in TestAnalysis. Flat scannable list in QuestionBreakdownTable without filters/bg colors. ConceptGapCard with white/light gray bg, single sentence AI reasoning, single button. | M3 | ORIGINAL_REQUEST §R3 |
| 4 | Verification & Quality Bar | Build, lint, TypeScript compile and full requirement compliance check. | M4 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Global Layout & Header Simplification | `src/components/Topbar.tsx`, `src/components/layout/Topbar.tsx` | none | DONE |
| 2 | Page Architecture & Stat Cards Redesign | `src/pages/student/StudentDashboard.tsx`, `src/components/student/XPWidget.tsx` | none | DONE |
| 3 | Test Analysis Refactoring | `src/pages/student/TestAnalysis.tsx`, `src/components/student/QuestionBreakdownTable.tsx`, `src/components/student/ConceptGapCard.tsx` | none | DONE |
| 4 | Verification & Quality Bar | Whole project validation & adversarial test suites | M1, M2, M3 | DONE |

## Code Layout
- `src/components/Topbar.tsx`: Global navigation header
- `src/components/layout/Topbar.tsx`: Re-export for path compatibility
- `src/pages/student/StudentDashboard.tsx`: Student main dashboard
- `src/components/student/XPWidget.tsx`: XP / Streak display widget
- `src/pages/student/TestAnalysis.tsx`: Test analysis breakdown page
- `src/components/student/QuestionBreakdownTable.tsx`: Flat question breakdown table
- `src/components/student/ConceptGapCard.tsx`: AI concept gap card
