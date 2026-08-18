# AI OMR Analysis & Personalized Learning Platform
## Comprehensive UX/UI Component Architecture, Mock Data Models & Design System Report

**Explorer**: Explorer 3 (UX/UI & Mock Data Architecture Explorer)  
**Date**: 2026-08-14  
**Integrity Mode**: Development / Demo Ready  
**Workspace Root**: `C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform`  
**Target File**: `.agents/explorer_survey_3/analysis.md`

---

## 1. Executive Summary & Architectural Vision

The **AI OMR Analysis and Personalized Learning Platform** is a dual-portal web application designed to bridge traditional offline paper-and-pencil OMR examination workflows with AI-driven learning intelligence and adaptive gamified remediation. 

The application serves two distinct user personas:
1. **Educator / Teacher Persona (`/teacher`)**: Requires actionable classroom-level intelligence, cohort mastery distribution, test creation/management by test number, deep-dive forensic error analysis into individual students, and targeted assignment of remedial MCQ tests.
2. **Student Persona (`/student`)**: Requires seamless multi-subject OMR sheet photo uploads (Physics, Chemistry, Maths, Full Paper), instant AI root-cause diagnostic feedback, a distinct Improvement & Mock Tests practice hub, score trajectory analytics, and motivating gamification mechanics (XP ledger, streaks, and league leaderboards).

### High-Level Architectural Principles
- **Instant Demo Readiness**: Zero external backend dependency required for the full UI/UX walkthrough, powered by a rich, deterministic, type-safe Mock Data Layer with stateful in-memory / LocalStorage mutations.
- **Dual-Portal Role-Based Routing**: Clean entry screen at `/` allowing 1-click exploration of both Teacher and Student environments with shared context synchronization.
- **Atomic & Modular UI Hierarchy**: Pure functional React 19 components styled with Tailwind CSS v4, Lucide React icons, and Recharts visualization widgets.
- **Cognitive Clarity & Premium Aesthetics**: Clean white-labeled SaaS styling (inspired by Linear, Vercel, and Duolingo Pro) with generous padding, pill badges, vibrant accent gradients, and smooth state transitions.

---

## 2. Information Architecture & Routing Scheme

### 2.1 Route Tree & Portal Layout Hierarchy

```
/ (Root)
│
├── /login ── [Unified Dual-Portal Login & Demo Switcher]
│
├── /teacher (Teacher Portal Shell -> TeacherLayout)
│   ├── /teacher/dashboard ─────────── [Class Analytics, Aggregate Graphs, Top Missed Questions]
│   ├── /teacher/students ──────────── [Student Directory with Filterable Mastery Flags]
│   ├── /teacher/students/:studentId ─ [Student Deep Dive: Historical Marks & Specific Mistakes]
│   └── /teacher/tests ─────────────── [Test Management: Upload Papers by Test # & Assign MCQs]
│
└── /student (Student Portal Shell -> StudentLayout)
    ├── /student/dashboard ─────────── [Welcome Hero, Gamification Widget, Score Improvement Chart]
    ├── /student/upload ────────────── [Multi-Section OMR Upload: Physics, Chem, Maths, Full Paper]
    ├── /student/mock-tests ────────── [Dedicated Improvement Hub: AI & Teacher Assigned Tests]
    ├── /student/analysis/:testId ──── [OMR Evaluation Report: Score, Accuracy, Root-Cause Gaps]
    ├── /student/practice/:topicId ─── [Interactive Remedial Exercise Runner with Step Hints]
    ├── /student/leaderboard ───────── [Gamified Rankings, League Tiers, Streak Counters]
    └── /student/profile ───────────── [Profile Stats, Improvement Trends, Badges & Activity Log]
```

### 2.2 Navigation Matrix & Route Definitions

| Path | Portal | Layout Shell | Primary Responsibilities | Acceptance Criteria Target |
|---|---|---|---|---|
| `/` or `/login` | Public / Dual | Fullscreen Card | Role selector ("Enter as Teacher Demo", "Enter as Student Demo"), branding header, Google OAuth simulation. | AC 1: Professional login screen routing to `/teacher` or `/student` |
| `/teacher/dashboard` | Teacher | `TeacherLayout` | Class performance AreaChart/BarChart, Average Marks KPI, Total Tests KPI, Frequently Missed Questions Leaderboard. | AC 2: Visible charts/graphs of class performance & average marks |
| `/teacher/students` | Teacher | `TeacherLayout` | Searchable table of students, batch filters, score badges, quick action to open Deep Dive. | AC 3: Navigable student list |
| `/teacher/students/:studentId` | Teacher | `TeacherLayout` | Individual score trajectory, subject breakdown, chronological test log, tagged mistake taxonomy, "Assign Remediation" modal. | AC 3: Detailed student performance & specific mistakes |
| `/teacher/tests` | Teacher | `TeacherLayout` | Upload question papers by Test # (e.g. `Test #108`), PDF attachment, Answer Key grid builder, Batch assignment wizard. | R2: Test management & manual MCQ assignment |
| `/student/dashboard` | Student | `StudentLayout` | Welcome banner, XP & Streak widget, Leaderboard preview snippet, Score Improvement Chart, Pending OMR CTA. | AC 6: XP score & visible leaderboard component |
| `/student/upload` | Student | `StudentLayout` | 4 Category Selector Tabs: **Physics**, **Chemistry**, **Maths**, **Full Paper**; Test Number selector; multi-stage AI scan simulation. | AC 4: OMR upload form with explicit 4-category options |
| `/student/profile` | Student | `StudentLayout` | Historical marks timeline, Score improvement trend charts, Badges showcase, XP ledger summary. | AC 5: Distinct Profile page showing score improvement trends |
| `/student/mock-tests` | Student | `StudentLayout` | Dedicated Improvement & Mock Tests hub: AI-configured adaptive tests, Teacher-assigned remedial tests, active practice queue. | AC 5: Separate Mock Tests / Improvement practice page |
| `/student/analysis/:testId` | Student | `StudentLayout` | Score banner, question-by-question matrix (correct, incorrect, skipped), AI root-cause diagnostics, recovery roadmap. | R3: AI-driven diagnostic analysis |
| `/student/leaderboard` | Student | `StudentLayout` | Full-scale competitive leaderboard, weekly league tiers, personal rank highlight, streak points. | AC 6: Competitive leaderboard |
| `/student/practice/:topicId` | Student | `StudentLayout` | Interactive MCQ quiz runner, instant rationale verification, dynamic XP award trigger. | R3: Remediation practice runner |

---

## 3. UX/UI Component Architecture

### 3.1 Component Hierarchy Diagram

```
src/
├── layouts/
│   ├── StudentLayout.tsx          # Student Shell: Sidebar, Topbar with XP & Streak, Mobile Nav
│   └── TeacherLayout.tsx          # Teacher Shell: Class Switcher, Teacher Nav, Alert Badges
│
├── pages/
│   ├── Login.tsx                  # Dual-Role Entry Portal (Teacher / Student quick switch)
│   ├── teacher/
│   │   ├── TeacherDashboard.tsx   # Class KPI Cards, Class Trends Chart, Missed Questions Table
│   │   ├── StudentDirectory.tsx   # Searchable Student Table with Risk Badges
│   │   ├── StudentDeepDive.tsx    # Single Student Trajectory, Mistake Taxonomy, Remedial Modal
│   │   └── TestManagement.tsx     # Paper Upload by Test #, Answer Key Matrix, MCQ Assignment
│   └── student/
│       ├── StudentDashboard.tsx   # Student Home: XP Pill, Gamification Widget, Score Chart
│       ├── OMRUpload.tsx          # Section Tabs (Physics/Chem/Maths/Full), Scan Animation
│       ├── MockTestsHub.tsx       # Dedicated AI & Teacher Improvement Tests Hub
│       ├── StudentProfile.tsx     # Improvement Trends, Subject Mastery, Badge Showcase
│       ├── TestAnalysis.tsx       # Root Cause Diagnosis, Mistake Breakdown, Recovery Roadmap
│       ├── LeaderboardPage.tsx    # League Standings, Podiums, XP Badges
│       └── PracticeRunner.tsx     # Step-by-Step Concept Verification Quiz
│
├── components/
│   ├── common/
│   │   ├── StatCard.tsx           # Reusable KPI Stat Card with icon, trend indicator, bg tint
│   │   ├── Badge.tsx              # Status chips (Mastered, Developing, Weak, Critical)
│   │   ├── Modal.tsx              # Accessible dialog overlay
│   │   └── TabGroup.tsx           # Segmented pill tabs
│   ├── charts/
│   │   ├── PerformanceChart.tsx   # Responsive Recharts Area/Line Chart for score trends
│   │   ├── ClassDistribution.tsx  # Recharts BarChart for mark frequency distribution
│   │   ├── SubjectRadar.tsx       # Subject accuracy radar/progress bars
│   │   └── MistakeFrequencyBar.tsx# Horizontal bar chart of top question errors
│   ├── teacher/
│   │   ├── ClassStatCards.tsx     # Total Tests, Class Avg Marks, Top Score, Attention Needed
│   │   ├── MissedQuestionsTable.tsx # Top failed questions with failure rate % & concept node
│   │   ├── MistakeDetailCard.tsx  # Question preview, student answer vs correct key, AI insight
│   │   ├── AssignRemediationModal.tsx # Form to dispatch 5-10 MCQ targeted test to a student
│   │   └── PaperUploadForm.tsx    # Test Number input, Subject select, Answer Key bubble grid
│   ├── student/
│   │   ├── GamificationBar.tsx    # XP counter, Streak flame, Level badge, League status
│   │   ├── LeaderboardSnippet.tsx # Compact 5-row leaderboard for dashboard embedding
│   │   ├── OMRCategorySelector.tsx# Explicit 4-button selector (Physics, Chem, Maths, Full)
│   │   ├── OMRScannerPreview.tsx  # Bubble detection overlay with corner bounding boxes
│   │   ├── RemediationCard.tsx    # Card for assigned practice test with XP bounty tag
│   │   └── ConceptRoadmap.tsx     # Step-by-step recovery path from mistake to mastery
│   └── gamification/
│       ├── XpAwardModal.tsx       # Confetti / pop-in celebration when tests are completed
│       ├── BadgeGrid.tsx          # Grid of unlocked / locked milestone badges
│       └── StreakCounter.tsx      # Daily attendance & practice streak widget
│
├── context/
│   ├── AuthContext.tsx            # Current user role ('teacher' | 'student'), demo credentials
│   └── LearningStoreContext.tsx   # Central state store for students, tests, scans, assignments
│
├── config/
│   ├── branding.ts                # White-label coaching name, logos, color scheme
│   └── gamificationConfig.ts      # XP levels, streak rewards, league tiers
│
└── mock/
    ├── mockData.ts                # Comprehensive seed dataset (Students, Tests, Mistakes, XP)
    └── types.ts                   # All TypeScript domain models and interfaces
```

---

## 4. Comprehensive Mock Data Models & Schema Design

To ensure immediate demo readiness without requiring an external database, the platform utilizes a rich, relational in-memory schema defined in TypeScript.

### 4.1 Domain Entity Specifications (`src/mock/types.ts`)

```typescript
// 1. User & Authentication
export type UserRole = 'teacher' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  batchId?: string;
  batchName?: string;
  institutionName: string;
}

// 2. Subject & Test Categorization
export type SubjectCategory = 'Physics' | 'Chemistry' | 'Maths' | 'Full Paper';

export interface TestPaper {
  id: string;
  testNumber: string; // e.g., "TEST-101", "TEST-102"
  title: string;
  category: SubjectCategory;
  date: string;
  totalQuestions: number;
  maxMarks: number;
  durationMinutes: number;
  classAverageMarks: number;
  classAccuracyPercentage: number;
  questionPaperPdfUrl?: string;
  answerKey: Record<number, string>; // { 1: "A", 2: "C", 3: "D", ... }
  questionTopics: Record<number, { subject: string; topic: string; difficulty: 'Easy' | 'Medium' | 'Hard' }>;
}

// 3. Student Record & Performance
export interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  avatarUrl: string;
  batch: string;
  grade: string;
  totalXp: number;
  currentRank: number;
  streakDays: number;
  overallAccuracy: number;
  averageScore: number;
  testsCompletedCount: number;
  statusFlag: 'On Track' | 'Needs Attention' | 'Critical Review';
  subjectMastery: {
    Physics: number;
    Chemistry: number;
    Maths: number;
  };
  scoreImprovementHistory: {
    testNumber: string;
    testTitle: string;
    date: string;
    score: number;
    maxScore: number;
    percentage: number;
    accuracy: number;
  }[];
}

// 4. Question Mistake & Root-Cause Forensic
export interface QuestionMistake {
  id: string;
  testNumber: string;
  testTitle: string;
  questionNumber: number;
  subject: string;
  topic: string;
  studentAnswer: string;
  correctAnswer: string;
  mistakeType: 'Conceptual Gap' | 'Calculation Error' | 'Formula Confusion' | 'Careless Bubble';
  questionSnippet: string;
  aiDiagnosis: string;
  remedialConcept: string;
  remediationAssigned: boolean;
}

// 5. Frequently Missed Question (Classroom Aggregation)
export interface FrequentlyMissedQuestion {
  testNumber: string;
  questionNumber: number;
  subject: SubjectCategory;
  topic: string;
  failRatePercentage: number; // e.g., 68% of class answered incorrectly
  mostCommonWrongOption: string;
  correctOption: string;
  rootCauseMisconception: string;
  recommendedAction: string;
}

// 6. Remediation / Mock Test Assignment
export interface MockTestAssignment {
  id: string;
  title: string;
  category: SubjectCategory;
  assignedBy: 'AI Engine' | 'Teacher (Mr. Sharma)' | 'Self Practice';
  sourceTestNumber?: string;
  targetTopics: string[];
  questionCount: number;
  estTimeMinutes: number;
  xpBounty: number;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  score?: number;
  accuracy?: number;
  completedAt?: string;
  questions?: {
    id: string;
    questionText: string;
    options: { id: string; text: string }[];
    correctOption: string;
    explanation: string;
  }[];
}

// 7. OMR Scan Submission
export interface OMRSubmission {
  id: string;
  studentId: string;
  testNumber: string;
  testTitle: string;
  category: SubjectCategory;
  submittedAt: string;
  status: 'evaluating' | 'completed' | 'flagged';
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  markedAnswers: Record<number, string>;
  mistakes: QuestionMistake[];
  feedbackSummary: string;
}

// 8. Gamification & Leaderboard
export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatarUrl: string;
  batch: string;
  xp: number;
  streakDays: number;
  accuracyPercentage: number;
  isCurrentUser: boolean;
  tier: 'Diamond League' | 'Platinum League' | 'Gold League' | 'Silver League';
}

export interface XpLedgerEntry {
  id: string;
  timestamp: string;
  amount: number;
  activity: string;
  category: 'omr_upload' | 'mock_test_pass' | 'remediation_mastery' | 'streak_milestone';
}
```

### 4.2 Realistic Initial Seed Dataset Overview

The seed dataset in `src/mock/mockData.ts` includes:

- **10 Realistic Students**: Rohan Sharma (Active Student), Aditya Verma, Priya Patel, Aarav Mehta, Ananya Gupta, Sneha Rao, Kabir Singh, Vikram Malhotra, Neha Reddy, Devansh Joshi.
- **5 Comprehensive Tests**:
  - `TEST-101`: Physics - Kinematics & Laws of Motion (30 Qs, Max Marks 120)
  - `TEST-102`: Chemistry - Stoichiometry & Chemical Bonding (30 Qs, Max Marks 120)
  - `TEST-103`: Mathematics - Calculus & Coordinate Geometry (30 Qs, Max Marks 120)
  - `TEST-104`: Full Paper - JEE Mock Exam 1 (90 Qs, Max Marks 300)
  - `TEST-105`: Full Paper - JEE Mock Exam 2 (90 Qs, Max Marks 300)
- **Top 5 Frequently Missed Questions**:
  - `TEST-101` Q14: *Rotational Kinematics (Angular momentum conservation)* — 68% class fail rate (Confusion between linear & angular impulse).
  - `TEST-102` Q8: *Limiting Reagents in Combustion* — 62% class fail rate (Neglecting stoichiometry coefficients).
  - `TEST-103` Q22: *Integration by Parts (Inverse trig derivatives)* — 59% class fail rate (Sign error in the second integral).
  - `TEST-104` Q45: *Thermodynamics (Isothermal vs Adiabatic work done)* — 54% class fail rate (Area under P-V curve miscalculation).
  - `TEST-105` Q19: *Electromagnetic Induction (Lenz's Law flux opposition)* — 51% class fail rate (Incorrect normal vector convention).
- **Remediation Queue**:
  - 3 AI-configured targeted improvement tests targeting Rohan's specific concept gaps.
  - 2 Teacher-assigned custom remedial tests with XP rewards (150 XP and 200 XP).
- **Gamification Roster**: Full 10-student competitive leaderboard showing Rohan ranked #4 with 1,420 XP and a 7-day study streak.

---

## 5. Interactive State Management Architecture

To support interactive operations across both portals (e.g. uploading OMRs, creating tests, assigning remediations, solving practice quizzes, and earning XP), a React Context + Hook architecture backed by browser `LocalStorage` is designed.

### 5.1 Learning Store Context Schema (`LearningStoreContext.tsx`)

```typescript
export interface LearningStoreState {
  // Authentication & Persona
  currentUser: UserProfile;
  activeRole: UserRole;
  isDemoMode: boolean;
  switchRole: (role: UserRole) => void;
  signInAsDemo: (role: UserRole) => void;
  signOut: () => void;

  // Data Collections
  students: StudentRecord[];
  tests: TestPaper[];
  submissions: OMRSubmission[];
  remediations: MockTestAssignment[];
  frequentlyMissed: FrequentlyMissedQuestion[];
  leaderboard: LeaderboardEntry[];
  xpLedger: XpLedgerEntry[];

  // Active Selections
  activeStudentId: string;
  selectedBatch: string;
  setSelectedBatch: (batch: string) => void;

  // Mutation Handlers
  submitOMRScan: (submission: Omit<OMRSubmission, 'id' | 'submittedAt'>) => OMRSubmission;
  uploadQuestionPaper: (newPaper: Omit<TestPaper, 'id'>) => TestPaper;
  assignRemediationToStudent: (studentId: string, assignment: Omit<MockTestAssignment, 'id' | 'status'>) => void;
  completeRemediationQuiz: (remediationId: string, score: number, accuracy: number) => void;
  awardXp: (amount: number, activity: string, category: XpLedgerEntry['category']) => void;
}
```

### 5.2 Reactive Data Flow Diagram

```
User Action: Upload OMR (Physics)
         │
         ▼
[OMRUpload Component] ──> trigger multi-step scan animation (1.2s per step)
         │
         ▼
[LearningStore.submitOMRScan] ──> Calculates score & detects mistake taxonomy
         │
         ├── Updates `submissions` array in LocalStorage
         ├── Generates AI Remedial Mock Test in `remediations`
         ├── Appends 100 XP to `xpLedger` and increases student `totalXp`
         └── Updates `scoreImprovementHistory` on Student Profile
         │
         ▼
Navigation ──> `/student/analysis/:testId` 
         │
         └── Instantly reflects new test results in Teacher Dashboard Class Analytics!
```

---

## 6. UI Design System Guidelines & Visual Language

The design system adheres to modern e-learning SaaS benchmarks (resembling Tailwind UI, Linear, and Duolingo Pro):

### 6.1 Color Palette & Semantic Tokens

| Token | Hex / Class | Purpose | Application |
|---|---|---|---|
| **Primary Brand** | `#4f46e5` (`indigo-600`) | Main brand accent | Buttons, active navigation tabs, chart lines, active filters |
| **Secondary Brand** | `#7c3aed` (`purple-600`) | Gradient paired accent | Hero banners, premium tags, AI diagnostic highlights |
| **Success / Mastered** | `#10b981` (`emerald-500`) | Mastery & high performance | Correct answers, mastered topics, passing scores (≥75%) |
| **Warning / Developing**| `#f59e0b` (`amber-500`) | Needs attention | Developing topics, average scores (50–74%), streak flame |
| **Danger / Critical** | `#ef4444` (`red-500`) | Concept gaps & mistakes | Incorrect answers, weak topics, failing scores (<50%) |
| **Gamification Gold** | `#eab308` (`yellow-500`) | XP & Leaderboard podium | XP badges, trophy icons, #1 rank highlight |
| **Surface Neutral** | `#f8fafc` (`slate-50`) | Application background | Clean, high-contrast canvas |
| **Card Neutral** | `#ffffff` (`white`) | Component surfaces | `rounded-3xl border border-slate-100 shadow-sm` |
| **Text Primary** | `#0f172a` (`slate-900`) | Headings & bold metrics | Font weight 800/900, tracking tight |
| **Text Secondary** | `#64748b` (`slate-500`) | Subtitles & metadata | Font weight 500, readable line heights |

### 6.2 Component Style Standards

- **Cards & Containers**:
  - Container radius: `rounded-3xl` (24px) for major widgets, `rounded-2xl` (16px) for inner list cards.
  - Border: 1px subtle border `border-slate-100` with light box-shadow `shadow-sm hover:shadow-md`.
  - Hover transitions: `transition-all duration-200 hover:-translate-y-0.5`.
- **Badges & Pill Chips**:
  - `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`.
- **Chart Typography & Tooltips**:
  - Tooltips styled with `bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 p-3`.
  - Recharts CartesianGrid with `stroke="#f1f5f9" strokeDasharray="3 3"` and zero Y-axis borders for a minimalist, modern appearance.
- **Responsive Layout Shells**:
  - Desktop: 64-column fixed sidebar (256px) + sticky topbar + centered `max-w-7xl` content container.
  - Mobile: Sticky branded header + scrollable content + bottom tab navigation with safe-area padding.

---

## 7. Deep-Dive Design of Required Modules

### 7.1 Module 1: Dual-Portal Login & Role Switcher (`/` or `/login`)
- **UI Elements**:
  - White-labeled institute badge (e.g. "Brothers Academy").
  - Two prominent 1-click Quick Launch cards:
    1. **"Enter as Teacher"** (Icon: `GraduationCap`, Subtext: "Class analytics, student deep dive, test management").
    2. **"Enter as Student"** (Icon: `User`, Subtext: "OMR upload, mock tests, score trajectory & leaderboard").
  - Alternative email/password form for traditional login.
  - Clear visual feedback with smooth route navigation to `/teacher` or `/student`.

### 7.2 Module 2: Teacher Dashboard & Class Analytics (`/teacher/dashboard`)
- **Key Metrics Row**:
  - Total Tests Conducted (`24 Tests`)
  - Overall Class Performance (`67.4% Avg Score`)
  - Active Students (`48 Students enrolled`)
  - Critical Misconceptions Identified (`14 Concept Gaps`)
- **Class Performance Distribution Chart**:
  - Recharts AreaChart & BarChart displaying test-by-test average marks vs top 10% benchmark over the last 8 tests.
- **Subject Mastery Matrix**:
  - Physics (64% avg), Chemistry (71% avg), Mathematics (67% avg) with mini progress bars.
- **Top Frequently Missed Questions Leaderboard**:
  - Interactive table showing Question Number, Test Number, Subject, Fail Rate %, Most Common Wrong Choice, and Root-Cause Concept Node.
  - Direct 1-click action button: **"Assign Remedial Quiz to Affected Students"**.

### 7.3 Module 3: Teacher Student Deep Dive (`/teacher/students/:studentId`)
- **Student Profile Header**:
  - Name, Batch, Roll Number, Rank in Class, Total XP, and Status Flag badge (e.g. `Needs Attention`).
- **Score Trajectory & Subject Accuracy**:
  - Recharts LineChart tracking individual marks vs class average across all tests.
- **Specific Mistakes Forensic Log**:
  - Filterable by Subject (`All`, `Physics`, `Chemistry`, `Maths`).
  - Expandable mistake cards showing:
    - Question text & diagrams.
    - Student's marked option vs Correct key.
    - AI-identified error category (e.g., *Calculation Error*, *Formula Confusion*).
    - Diagnostic explanation.
- **"Assign Custom Remedial Test" Action Drawer**:
  - Allows the teacher to select 5–10 MCQ questions tailored to the student's specific weak topics and push it to their Student Portal with a custom XP reward.

### 7.4 Module 4: Teacher Test Management (`/teacher/tests`)
- **Upload Question Paper by Test Number**:
  - Input field for **Test Number** (e.g. `TEST-106 - Mechanics & Thermodynamics Part 1`).
  - Category selector: Physics, Chemistry, Maths, Full Paper.
  - File uploader for Question Paper PDF / Scanned Sheet.
  - Interactive **Answer Key Grid Builder** (allowing the teacher to quickly mark options A, B, C, D for questions 1 to 30/90).
- **Assigned Tests & Remedial Distribution Table**:
  - Table of active tests, submission count, average score, and pending evaluations.

### 7.5 Module 5: Student OMR Upload (`/student/upload`)
- **Explicit 4-Category Selection Tabs**:
  - 4 large toggle cards: **[ ⚛️ Physics ]**, **[ 🧪 Chemistry ]**, **[ 📐 Maths ]**, **[ 📑 Full Paper ]**.
  - Dropdown selector for available Test Numbers (e.g., `Test #101`, `Test #102`).
- **Interactive Scan Zone**:
  - Drag-and-drop file dropzone with "Open Camera" and "Browse Files" triggers.
  - Realistic multi-stage scanning animation:
    1. *Scanning OMR sheet markers...*
    2. *Extracting marked bubbles...*
    3. *Cross-referencing Answer Key for [Category]...*
    4. *Running AI concept gap analysis...*
    5. *Generating personalized evaluation report...*
  - Automatically redirects to `/student/analysis/:testId` upon completion.

### 7.6 Module 6: Student Profile & Improvement Trends (`/student/profile`)
- **Hero Banner & Profile Bio**:
  - Avatar, Name, Grade, Batch, Streak Flame (e.g. `🔥 7 Days`), Total XP (`⚡ 1,420 XP`).
- **Score Improvement Trend Graph**:
  - Interactive Recharts AreaChart showing score percentage improvement over chronological tests.
- **Subject Mastery Gauges**:
  - Progress meters for Physics, Chemistry, Mathematics with topic counts (Mastered vs In Progress).
- **Earned Badges & Achievement Grid**:
  - Badges: `7-Day Streak`, `Math Whiz`, `OMR Master`, `Speed Demon`, `Perfect 100`.
- **Chronological Activity & XP Ledger**:
  - Timeline of recent tests submitted, remediations cleared, and XP earned.

### 7.7 Module 7: Dedicated Improvement & Mock Tests Hub (`/student/mock-tests`)
- **Categorized Remediation Tabs**:
  - **AI-Configured Mock Tests**: Adaptive short tests generated from recent OMR mistakes.
  - **Teacher-Assigned Tests**: Remedial assignments sent by the educator with custom due dates and XP bounties.
  - **Completed Remediations**: Archive of mastered concept tests.
- **Practice Test Cards**:
  - Displays Subject icon, Topic tags, Question Count (e.g. `5 Questions`), Estimated Time (`10 mins`), and XP Bounty (`+150 XP`).
  - Direct CTA button: **"Start Practice Test"** -> launches interactive quiz runner.

### 7.8 Module 8: Gamification Section & Leaderboard (`/student/leaderboard` & Widget)
- **Gamification Header / Banner**:
  - User's Current League Tier (e.g. `💎 Diamond League - Top 10%`).
  - Weekly countdown timer.
  - Total XP score and Daily Streak counter.
- **Competitive Leaderboard Table**:
  - Top 3 Podium Cards (Gold, Silver, Bronze crown badges).
  - Full class ranking list with rank numbers, avatars, student names, streak badges, total XP, and highlight styling on the current logged-in student.
- **Dashboard Leaderboard Snippet**:
  - Compact 3-5 row leaderboard widget directly embedded on the Student Dashboard (`/student/dashboard`) with "View Full Leaderboard" navigation.

---

## 8. Gap Analysis & Proposed File Changes

### 8.1 Comparison Against Current Codebase

| Area | Current State | Required Target State | Action Required |
|---|---|---|---|
| **Entry & Auth** | Single student demo login in `Login.tsx`, no teacher routing. | Professional Dual-Portal login with 1-click Teacher vs Student buttons. | Update `Login.tsx` and `App.tsx` routes. |
| **Teacher Portal** | Does not exist in the codebase. | Complete Teacher Portal (`/teacher/dashboard`, `/teacher/students`, `/teacher/students/:id`, `/teacher/tests`). | Implement `TeacherLayout.tsx`, `TeacherDashboard.tsx`, `StudentDirectory.tsx`, `StudentDeepDive.tsx`, `TestManagement.tsx`. |
| **OMR Upload** | Generic upload box with no category selection. | 4 Explicit Category Tabs: **Physics**, **Chemistry**, **Maths**, **Full Paper**, plus Test Number selector. | Enhance `Upload.tsx` / `OMRUpload.tsx`. |
| **Mock Tests / Improvement** | Embedded inside analysis page or simple modal. | Distinct dedicated page at `/student/mock-tests` for AI & Teacher assigned practice tests. | Implement `MockTestsHub.tsx` and link in student navigation. |
| **Student Profile** | Simple profile with hardcoded text. | Comprehensive profile showing historical marks and score improvement trends via Recharts. | Upgrade `StudentProfile.tsx` / `Profile.tsx`. |
| **Gamification** | Standalone Leaderboard component not prominently integrated on dashboard. | Visible gamification bar + Leaderboard snippet on Student Dashboard + full Leaderboard page. | Integrate `GamificationBar` & `LeaderboardSnippet` into `StudentDashboard.tsx`. |
| **Mock Data Store** | Scattered static arrays across components. | Centralized, relational, type-safe data store (`mockData.ts` + `LearningStoreContext.tsx`) with state persistence. | Create `src/mock/mockData.ts`, `src/mock/types.ts`, and `src/context/LearningStoreContext.tsx`. |

---

## 9. Verification & Acceptance Checklist

| AC # | Acceptance Criterion | Verification Method |
|---|---|---|
| **AC 1** | Root URL (`/`) presents a professional login screen with options to route to `/teacher` or `/student`. | Navigate to `/` and inspect Teacher & Student login routing buttons and automatic redirection. |
| **AC 2** | Teacher Dashboard contains visible charts/graphs representing overall class performance and average marks. | Navigate to `/teacher/dashboard` and verify Recharts performance trends, average marks stat card, and total tests conducted. |
| **AC 3** | Teacher interface contains a navigable list of students, and clicking a student reveals detailed performance data and mistakes. | Navigate to `/teacher/students`, click any student row (e.g. Rohan Sharma), and verify `/teacher/students/s1` displays marks, trend graphs, and mistake cards. |
| **AC 4** | Student Dashboard contains an OMR upload form with explicit options for "Physics", "Chemistry", "Maths", and "Full Paper". | Navigate to `/student/upload` and verify the 4 distinct category buttons and test number selector are rendered and functional. |
| **AC 5** | Student portal includes a distinct "Profile" page showing score improvement trends, and a separate "Mock Tests/Improvement" page containing practice assignments. | Verify `/student/profile` renders improvement trend charts and `/student/mock-tests` renders the dedicated AI & Teacher practice tests list. |
| **AC 6** | Student Dashboard displays a gamification section featuring an XP score and a visible Leaderboard component. | Navigate to `/student/dashboard` and verify the XP score banner and visible Leaderboard component are present. |

---

## 10. Conclusion & Recommendation for Implementation

The proposed UX/UI and Mock Data architecture fulfills all requirements stipulated in `ORIGINAL_REQUEST.md`. It provides a realistic, visually appealing white-labeled experience for both teachers and students while maintaining pure client-side reliability for instant live demonstration.

Following this survey, the implementation phase can proceed with creating the centralized mock data repository and building out the Teacher and Student portal layouts and pages systematically.
