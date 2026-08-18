# Handoff Report: Milestone 3 - Student Profile & Gamification Systems (F17, F18, F19)

**Explorer**: Explorer M3-2  
**Date**: 2026-08-15  
**Scope**: F17 (Gamified XP & Daily Streak System), F18 (Batch Leaderboard Component), F19 (Dedicated Student Profile Page)  
**Working Directory**: `C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform\.agents\explorer_m3_2`

---

## 1. Observation

### 1.1 Direct Codebase & File Inspection Findings

1. **Routing & Layout Configuration (`src/App.tsx` & `src/layouts/StudentLayout.tsx`)**:
   - `src/App.tsx` lines 66-97 mount the Student Portal under `/student/*` protected by `RoleGuard`, routing to:
     - `/student` or `/student/dashboard` -> `<Dashboard />` (`src/pages/Dashboard.tsx`)
     - `/student/upload` -> `<Upload />` (`src/pages/Upload.tsx`)
     - `/student/mock-tests` -> `<MockTestsImprovement />` (`src/pages/student/MockTestsImprovement.tsx`)
     - `/student/profile` -> `<Profile />` (`src/pages/Profile.tsx` which currently wraps `src/components/StudentProfile.tsx`)
     - `/student/analysis/:testId` -> `<Analysis />` (`src/pages/Analysis.tsx`)
     - `/student/practice/:topicId` -> `<Practice />` (`src/pages/Practice.tsx`)
     - `/student/history` -> `<History />` (`src/pages/History.tsx`)
   - `src/layouts/StudentLayout.tsx` lines 330-362 already render gamification topbar badges for XP (`student.xp.toLocaleString() + " XP"`) and Streak (`student.streak + " Days"`), linked to `useLearningStore()`.

2. **State Store & Mutators (`src/context/LearningStoreContext.tsx`)**:
   - Lines 33-46 define `LearningStoreState` with `currentUser`, `students`, `classAnalytics`, `testPapers`, `assignedTests`, `weakTopics`, `leaderboard`, `latestDiagnostic`.
   - Lines 488-530 implement `addXp(amount, reason)` which updates:
     - `currentUser.xp`
     - `students.find(s => s.id === currentUser.id).xp`
     - Re-sorts `leaderboard` descending by `totalXp` and assigns `rank: index + 1`.
   - Lines 375-466 implement `submitOMR()` which calculates `earnedXp` and calls `addXp(earnedXp, ...)`.
   - Lines 469-478 implement `completePracticeQuiz()` which updates topic mastery and calls `addXp(earnedXp, ...)`.

3. **Data Repository & Models (`src/types/student.ts` & `src/data/mockData.ts`)**:
   - `src/types/student.ts` defines `StudentRecord`, `StudentScoreHistory`, `SubjectMastery`, `BadgeItem`, `LeaderboardEntry`.
   - `src/data/mockData.ts` provides:
     - `DEMO_STUDENT_USER` (Rohan Sharma, Class 11 Advanced, 1,240 XP, 15-day streak, rank #4).
     - `MOCK_BADGES` (6 badges with gold, diamond, silver, bronze tiers, icons, unlock status).
     - `MOCK_STUDENTS` (8 comprehensive student records with 5-test score history, subject masteries, and mistake logs).
     - `MOCK_LEADERBOARD` (10 ranked student entries with rank, avatar, score, totalXp, streak, accuracy, tier).

4. **Existing Profile & Leaderboard Components (`src/components/StudentProfile.tsx`, `src/components/Leaderboard.tsx`)**:
   - `src/components/StudentProfile.tsx`:
     - Displays static hero banner, 4 basic metric tiles (Streak, Total XP, Mastered Topics, Accuracy).
     - Static progress bars for Physics (82%), Chemistry (74%), Mathematics (79%).
     - Static 3-badge display and hardcoded timeline items.
     - **Deficiency**: Missing Recharts score improvement trajectory comparison vs class benchmark, missing test history log table, missing tier filterable badge gallery, and not connected to active student dynamic data.
   - `src/components/Leaderboard.tsx`:
     - Displays basic list of ranked entries.
     - **Deficiency**: Missing timeframe toggles (Weekly / Monthly / All-Time), missing subject filters (Overall, Physics, Chemistry, Maths), missing rank movement indicators (`▲ +2`, `▼ -1`, `—`), missing podium top-3 visual styling with Gold/Silver/Bronze badges, missing search/filter peer capability, and missing highlighted sticky/prominent "YOU" row.

---

## 2. Logic Chain & Technical Specifications

### 2.1 Feature 17: Gamified XP & Daily Streak System

```
[Student Action (OMR Upload / Practice Quiz)]
                    │
                    ▼
       [LearningStoreContext.addXp()]
                    │
   ┌────────────────┴────────────────┬────────────────────────┐
   ▼                                 ▼                        ▼
[Update currentUser.xp]   [Update students[].xp]   [Recompute Leaderboard Ranks]
   │                                 │                        │
   ▼                                 ▼                        ▼
[Trigger Level Calculation]  [Persist localStorage]   [Trigger Floating XP Toast]
```

#### A. Level Progression Mathematical Model
Define a deterministic leveling formula and rank titles:

| Level | Title | XP Range | Min XP | Max XP | Delta | Perks / Description |
|---|---|---|---|---|---|---|
| **Level 1** | JEE Rookie | 0 – 350 XP | 0 | 350 | 350 | Starter badge unlocked |
| **Level 2** | Concept Apprentice | 351 – 750 XP | 350 | 750 | 400 | Remediation drills unlocked |
| **Level 3** | Problem Solver | 751 – 1,200 XP | 750 | 1,200 | 450 | AI Concept Maps unlocked |
| **Level 4** | Formula Wizard | 1,201 – 1,750 XP | 1,200 | 1,750 | 550 | Speed-challenge mode unlocked |
| **Level 5** | Mock Challenger | 1,751 – 2,400 XP | 1,750 | 2,400 | 650 | Batch Leaderboard podium contender |
| **Level 6** | AIR Rank Aspirant | 2,401 – 3,200 XP | 2,400 | 3,200 | 800 | Advanced JEE Grand Mock packs |
| **Level 7** | JEE Grandmaster | 3,201+ XP | 3,200 | 5,000 | 1,800 | Elite Hall of Fame |

```typescript
// Helper in src/lib/gamification.ts
export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  currentLevelXp: number;
  xpNeededForNext: number;
  progressPercentage: number;
  isMaxLevel: boolean;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  const levels = [
    { level: 1, title: 'JEE Rookie', min: 0, max: 350 },
    { level: 2, title: 'Concept Apprentice', min: 350, max: 750 },
    { level: 3, title: 'Problem Solver', min: 750, max: 1200 },
    { level: 4, title: 'Formula Wizard', min: 1200, max: 1750 },
    { level: 5, title: 'Mock Challenger', min: 1750, max: 2400 },
    { level: 6, title: 'AIR Rank Aspirant', min: 2400, max: 3200 },
    { level: 7, title: 'JEE Grandmaster', min: 3200, max: 5000 },
  ];

  for (let i = 0; i < levels.length; i++) {
    const l = levels[i];
    if (totalXp >= l.min && totalXp < l.max) {
      const currentLevelXp = totalXp - l.min;
      const span = l.max - l.min;
      const progressPercentage = Math.min(100, Math.max(0, Math.round((currentLevelXp / span) * 100)));
      return {
        level: l.level,
        title: l.title,
        minXp: l.min,
        maxXp: l.max,
        currentLevelXp,
        xpNeededForNext: l.max - totalXp,
        progressPercentage,
        isMaxLevel: false,
      };
    }
  }

  // Level 7+
  return {
    level: 7,
    title: 'JEE Grandmaster',
    min: 3200,
    maxXp: 5000,
    currentLevelXp: totalXp - 3200,
    xpNeededForNext: 0,
    progressPercentage: 100,
    isMaxLevel: true,
  };
}
```

#### B. Daily Streak System & Multiplier
- **7-Day Visual Calendar**: Monday through Sunday dots with active flame icons, streak count (`15 Days Active`), and bonus multiplier calculation (`+15% XP Booster`).
- **Streak Shield status**: "Active & Protected — 1 Freeze Available".

#### C. Floating Reactive XP Notification Banner (`XPToast.tsx`)
- App-level notification listening to XP awards with icon animation, amount (e.g. `+150 XP`), action reason, and level-up congratulations popup.

---

### 2.2 Feature 18: Batch Leaderboard Component

#### A. Component Architecture (`src/components/student/BatchLeaderboard.tsx`)
1. **Interactive Controls**:
   - **Timeframe Selector**: `[ Weekly | Monthly | All-Time ]`
     - *Weekly*: Current week sprint (filters/calculates weekly XP delta e.g., Aarav: 450 XP, Rohan: 380 XP).
     - *Monthly*: Current month standings.
     - *All-Time*: Full cohort cumulative XP.
   - **Subject Scope Tabs**: `[ All Subjects | Physics | Chemistry | Mathematics ]`
   - **Student Search Input**: Real-time filtering by peer name or roll number.
2. **Podium Badging for Top 3 (1st, 2nd, 3rd)**:
   - **Rank #1 (Gold)**: Amber/Gold gradient card, Golden Crown icon, Gold Laurel badge `#1`, 2,150 XP, Diamond tier badge.
   - **Rank #2 (Silver)**: Slate/Silver gradient card, Silver Laurel badge `#2`, 1,890 XP, Diamond tier badge.
   - **Rank #3 (Bronze)**: Bronze/Amber-700 card, Bronze Laurel badge `#3`, 1,520 XP, Platinum tier badge.
3. **Rank Movement Indicators**:
   - `▲ +2` in emerald badge (`bg-emerald-50 text-emerald-700 border-emerald-200`) for climbing ranks.
   - `▼ -1` in rose badge (`bg-rose-50 text-rose-700 border-rose-200`) for dropping ranks.
   - `—` in slate badge for unchanged rank.
4. **Current Student Highlight**:
   - Current active student (Rohan Sharma) highlighted with distinct `border-2 border-indigo-500 bg-indigo-50/70` and vibrant `YOU` badge.
   - Pinned / Sticky summary row if the student is not in the top 3 visible viewport.

---

### 2.3 Feature 19: Dedicated Student Profile Page (`/student/profile`)

#### A. Page Layout Structure (`src/pages/student/StudentProfile.tsx`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. HERO PROFILE BANNER                                                      │
│    Avatar (Gold Border) • Student Name • Roll No • Batch • Grade            │
│    Level 4 Formula Wizard Badge • XP Progress Bar (1,240 / 1,750 XP - 72%)  │
│    Quick Metric Badges: Overall Rank #4 • Streak 15d • Accuracy 78.5%       │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 2. SCORE IMPROVEMENT TRAJECTORY      │ 3. SUBJECT MASTERY BREAKDOWN         │
│    (Recharts Area / Line Chart)      │    Physics (82%) - 2 weak topics     │
│    • Student Score (Indigo Area)     │    Chemistry (74%) - 3 weak topics   │
│    • Class Average (Dashed Line)     │    Mathematics (79%) - 2 weak topics │
│    • Target Benchmark (80% Line)     │    [Visual Animated Gradient Bars]   │
│    • Subject Switchers [All|P|C|M]   │    [Total Questions & Accuracy]      │
├──────────────────────────────────────┴──────────────────────────────────────┤
│ 4. TEST HISTORY LOG TABLE                                                   │
│    Columns: Test Number | Title | Date | Marks / 300 | Acc % | Rank | Report │
│    Interactive links to /student/analysis/:testId                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. UNLOCKED ACHIEVEMENT BADGES GALLERY                                      │
│    Tier Filters: [ All | Diamond | Gold | Silver | Bronze ]                 │
│    Badge Cards (Icon, Title, Description, Tier Pill, Unlocked Date / Lock)   │
│    Clickable modal/drawer for deep badge criteria                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### B. Recharts Trajectory Configuration (`ScoreTrajectoryChart.tsx`)
- **Chart Type**: Composed `AreaChart` with linear gradient fills and layered `Line`.
- **Data Series**:
  - Primary Area: `studentScore` (`#4f46e5`, gradient fill `url(#studentScoreGradient)`).
  - Benchmark Line: `classAverage` (`#059669`, dashed `strokeDasharray="4 4"`).
  - Target Reference Line: `targetBenchmark` (`#d97706` at 240 / 80%).
- **Interactive Tooltip**: Custom card displaying Date, Test Name, Student Marks, Class Average, and Delta (`+28 marks vs class average`).
- **Subject Filtering**: Dynamic filtering for Total (out of 300), Physics (out of 100), Chemistry (out of 100), Mathematics (out of 100).

#### C. Subject Mastery Breakdown Bars (`SubjectMasteryBreakdown.tsx`)
- Dynamic rendering from `activeStudent.subjectMastery` (Physics, Chemistry, Mathematics).
- Each card features:
  - Subject Icon and Color Theme.
  - Large Percentage Mastery (e.g. `82%`).
  - Dual Progress Bar: Student mastery vs JEE Advanced Benchmark marker (80%).
  - Accuracy stat (e.g., `81.2% Acc`), Questions Attempted (`320 MCQs`), Weak Topics Count (`2 topics to review`).
  - Action link to `/student/mock-tests`.

#### D. Comprehensive Test History Table (`TestHistoryTable.tsx`)
- Responsive data table listing all 5 tests (`Mock #1` to `Mock #5`).
- Displays:
  - Test Number & Title badge.
  - Date formatted.
  - Score pill with percentage (e.g. `228 / 300 (76.0%)`).
  - Batch rank badge (e.g. `4th in Batch`).
  - Subject score chips (`P: 84 | C: 72 | M: 72`).
  - Action button: `<Link to="/student/analysis/test-04">View Analysis <ArrowRight /></Link>`.

#### E. Achievement Badges Gallery (`BadgeGallery.tsx`)
- Renders all 6 badges from `MOCK_BADGES` (Rotational Master, 15-Day Study Streak, Calculus Conqueror, Error Eliminator, Speed Demon, Organic Chemistry Wizard).
- Features tier filtering buttons (`All (6)`, `Diamond (1)`, `Gold (2)`, `Silver (2)`, `Bronze (1)`).
- Distinct visual styles:
  - **Unlocked**: Gradient glow borders, active emoji/icon, green checkmark pill, unlocked date.
  - **Locked**: Semi-transparent, grayscale icon, lock icon pill, requirement progress bar (e.g., `Speed Demon: 0 / 1 complete`).
- Modal trigger to inspect badge details.

---

## 3. Caveats

1. **Read-Only Scope**: This report contains pure analysis and architectural recommendations; no source code was directly mutated in this step.
2. **Persistence Key Compatibility**: The existing `LearningStoreContext` uses localStorage keys prefixed with `ai_learning_platform_store_v1`. Ensure any new state or fields added to `LeaderboardEntry` or `StudentRecord` handle optional fallbacks gracefully during deserialization.
3. **Route Integration**: `src/App.tsx` routes `/student/profile` and `/profile` to `<Profile />`. When `src/pages/student/StudentProfile.tsx` is implemented, `src/pages/Profile.tsx` can either re-export it or `App.tsx` can import it directly.

---

## 4. Conclusion

The recommended architecture for Milestone 3 (F17, F18, F19) provides a cohesive, premium e-learning student portal experience. By modularizing the gamification engine (`XPWidget`, `XPToast`, `getLevelInfo`), the competitive cohort leaderboard (`BatchLeaderboard`), and the dedicated student profile (`StudentProfile` with Recharts trajectory, mastery bars, test logs, and badge gallery), the platform delivers on all user requirements specified in `ORIGINAL_REQUEST.md` (R3: Gamification, Leaderboard, Profile improvement trends, Badges) and `PROJECT.md`.

### Recommended File Creation & Modification Plan

| Target File | Purpose | Action |
|---|---|---|
| `src/lib/gamification.ts` | Level calculation math, rank titles, streak multipliers, XP helpers | Create |
| `src/components/student/XPWidget.tsx` | Gamified level bar, XP stats, daily streak 7-day calendar | Create |
| `src/components/student/XPToast.tsx` | Reactive floating notification for earned XP | Create |
| `src/components/student/BatchLeaderboard.tsx` | Full leaderboard with podium top-3, time/subject filters, rank movement, highlight YOU | Create |
| `src/components/student/ScoreTrajectoryChart.tsx` | Recharts Area/Line chart comparing student vs class average over time | Create |
| `src/components/student/SubjectMasteryBreakdown.tsx` | Subject mastery cards with accuracy, weak topics count, progress bars | Create |
| `src/components/student/TestHistoryTable.tsx` | Test log table with scores, ranks, subject chips, analysis links | Create |
| `src/components/student/BadgeGallery.tsx` | Achievement badge grid with tier filters, locked/unlocked states & modals | Create |
| `src/pages/student/StudentProfile.tsx` | Dedicated Student Profile page assembling Hero, Trajectory, Mastery, History, Badges | Create |
| `src/pages/student/StudentDashboard.tsx` | Updated student dashboard embedding `XPWidget` and `BatchLeaderboard` | Create/Update |
| `src/pages/Profile.tsx` | Mount `StudentProfile` | Update |
| `src/pages/Dashboard.tsx` | Mount `StudentDashboard` or update layout | Update |
| `src/App.tsx` | Confirm student routing to `StudentProfile` and `StudentDashboard` | Verify |

---

## 5. Verification Method

To independently verify implementation of Milestone 3:

1. **Build & Lint Verification**:
   ```bash
   npm run build
   ```
   Ensures zero TypeScript errors across React 19, Recharts 3.x, and Lucide React.

2. **Gamified XP & Streak System (F17)**:
   - Navigate to `/student/dashboard` and `/student/profile`.
   - Verify visible XP counter displaying `1,240 XP` and `Level 4 • Formula Wizard`.
   - Verify level progress bar shows `72%` progress to Level 5.
   - Verify 7-day streak calendar displays `15 Days Active` with streak flame indicators.
   - Complete an OMR upload or practice quiz and verify reactive live increment of XP and streak.

3. **Batch Leaderboard Component (F18)**:
   - Navigate to `/student/dashboard` or leaderboard section.
   - Verify Podium display for Top 3 (1st Aarav Patel Gold, 2nd Ananya Iyer Silver, 3rd Vikram Malhotra Bronze).
   - Verify rank movement indicators (`▲ +2`, `▼ -1`, `—`).
   - Verify active student (Rohan Sharma #4) is distinctly highlighted with "YOU" badge.
   - Click timeframe filter tabs ("Weekly", "Monthly", "All-Time") and subject filter tabs ("All", "Physics", "Chemistry", "Maths") and verify rankings update.
   - Test peer search input by typing "Aarav" or "Sneha".

4. **Dedicated Student Profile Page (F19)**:
   - Navigate to `/student/profile`.
   - Verify Hero section with Rohan Sharma's avatar, roll number, batch, grade, and level banner.
   - Verify Recharts Score Improvement Trajectory chart renders with Student Area vs Class Average Line and subject toggle buttons.
   - Verify Subject Mastery breakdown displays Physics (82%), Chemistry (74%), and Mathematics (79%) with weak topic counts and accuracy stats.
   - Verify Test History table lists all 5 mock tests with scores, ranks, and working links to `/student/analysis/:testId`.
   - Verify Badges Gallery renders 6 badges with Diamond, Gold, Silver, Bronze tier filters, displaying unlocked vs locked states.
