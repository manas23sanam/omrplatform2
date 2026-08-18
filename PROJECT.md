# Project: OMR Analysis and Personalized Learning Platform

## Architecture
- **Framework & Tooling**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Recharts.
- **Routing Structure**:
  - `/` -> Dual-Portal Login Gateway with 1-click Teacher and Student demo roles.
  - `/teacher/*` -> Protected Teacher Layout Shell (`/teacher/analytics` or `/teacher`, `/teacher/students`, `/teacher/students/:id`, `/teacher/tests`).
  - `/student/*` -> Protected Student Layout Shell (`/student/dashboard` or `/student`, `/student/upload`, `/student/profile`, `/student/mock-tests`, `/student/analysis/:testId`, `/student/practice/:topicId`).
- **Data & State Management**:
  - Strongly typed TypeScript domain models (`StudentRecord`, `ClassAnalytics`, `MistakeRecord`, `TestPaper`, `MockAssignment`, `LeaderboardEntry`).
  - Reactive React Context store (`LearningStoreContext.tsx`) with localStorage synchronization for persistent interactive actions (uploading tests, assigning MCQs, submitting OMRs, earning XP).
- **Design System**: Premium e-learning UI with Tailwind v4, custom badges, stats cards, and Recharts interactive graphs.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Dual-Role Login Gateway | Root `/` presents professional login with explicit 1-click Teacher & Student routing options | M1 | ORIGINAL_REQUEST:14,32 |
| F02 | Teacher Portal Layout Shell | Navigation sidebar, topbar with batch selector and sign-out controls for `/teacher/*` | M1 | ORIGINAL_REQUEST:14 |
| F03 | Student Portal Layout Shell | Navigation sidebar, mobile bar, topbar with XP & streak counters for `/student/*` | M1 | ORIGINAL_REQUEST:14 |
| F04 | Mock Data Store & State Store | Type-safe in-memory and local-persisted store for students, tests, analytics, XP, leaderboard | M1 | ORIGINAL_REQUEST:16 |
| F05 | Class KPI Summary Cards | Total tests conducted, class average score, average accuracy, active student count | M2 | ORIGINAL_REQUEST:19,33 |
| F06 | Class Performance Over Time Graph | Recharts Area/Line chart displaying historical class average scores across tests | M2 | ORIGINAL_REQUEST:19,33 |
| F07 | Subject Mastery Comparison Graph | Recharts Bar chart showing class performance across Physics, Chemistry, Maths | M2 | ORIGINAL_REQUEST:19,33 |
| F08 | Frequently Missed Questions Table | Table listing most missed questions, error rates %, error patterns, and root causes | M2 | ORIGINAL_REQUEST:19 |
| F09 | Navigable Student Directory | Searchable, filterable roster of all students with quick performance stats | M2 | ORIGINAL_REQUEST:20,34 |
| F10 | Student Deep Dive Profile | Click-through view showing student marks, historical trajectory vs class average, XP | M2 | ORIGINAL_REQUEST:20,34 |
| F11 | Student Specific Mistakes Log | Filterable log of questions missed by selected student with picked vs correct option & AI note | M2 | ORIGINAL_REQUEST:20,34 |
| F12 | Question Paper Upload Interface | Form to upload test papers by Test Number, Title, Subject scope, and Answer Key | M2 | ORIGINAL_REQUEST:21 |
| F13 | Manual MCQ Test Assignment Engine | Form to compose and assign targeted MCQ remediation tests based on mistake patterns | M2 | ORIGINAL_REQUEST:21 |
| F14 | Categorized OMR Sheet Upload | Upload interface with explicit clickable options for Physics, Chemistry, Maths, Full Paper | M3 | ORIGINAL_REQUEST:24,35 |
| F15 | Multi-Stage OMR Scan Simulation | Visual pipeline simulating corner detection, bubble recognition, and answer key evaluation | M3 | ORIGINAL_REQUEST:24 |
| F16 | Detailed Test Diagnostic Report | Score summary, concept gap cards, question breakdown, and remediation links | M3 | ORIGINAL_REQUEST:24 |
| F17 | Gamified XP & Streak System | Persistent display and live increment of earned XP points and daily study streak | M3 | ORIGINAL_REQUEST:27,37 |
| F18 | Batch Leaderboard Component | Interactive leaderboard ranking peers with podium badges and highlighted current student | M3 | ORIGINAL_REQUEST:27,37 |
| F19 | Dedicated Student Profile Page | Score improvement trends over time, subject mastery bars, test history, unlocked badges | M3 | ORIGINAL_REQUEST:25,36 |
| F20 | Dedicated Improvement & Mock Tests Page | Dedicated page for AI-configured mock tests and targeted weak-area practice checklist | M3 | ORIGINAL_REQUEST:26,36 |
| F21 | Interactive Practice & Verification Quiz | Interactive concept review with MCQ verification quiz, immediate grading & XP award | M3 | ORIGINAL_REQUEST:26 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Foundation, State Store & Dual-Portal Gateway | F01, F02, F03, F04: Types, mock data repository, React context store, Login page with dual-routing, Teacher & Student layout shells | none | DONE |
| M2 | Teacher Interface (Analytics & Management) | F05, F06, F07, F08, F09, F10, F11, F12, F13: Class Analytics dashboard with Recharts, Student deep-dive list & mistake logs, Test paper upload & MCQ assignment | M1 | IN_PROGRESS |
| M3 | Student Interface (Gamified Learning & Profile) | F14, F15, F16, F17, F18, F19, F20, F21: Categorized OMR upload (Physics/Chem/Maths/Full), Student Profile with improvement trends, Mock Tests & Improvement page, Leaderboard & XP | M1 | PLANNED |
| M4 | E2E Testing Track (Test Suite & Infra) | Test harness, Vitest/React-testing verification suites for R1, R2, R3 (Tiers 1-4), publish TEST_READY.md | M1 | PLANNED |
| M5 | Final Integration, 100% E2E Test Pass & Hardening | Phase 1: 100% E2E test verification; Phase 2: Tier 5 adversarial coverage hardening & final acceptance | M2, M3, M4 | PLANNED |

## Interface Contracts
### Data & Store Contract (`src/types/` & `src/context/LearningStoreContext.tsx`)
- `useLearningStore()` exposes:
  - `currentUser: { role: 'teacher' | 'student'; id: string; name: string; avatarUrl: string; xp: number; streak: number }`
  - `loginAs(role: 'teacher' | 'student', studentId?: string): void`
  - `logout(): void`
  - `students: StudentRecord[]`
  - `classAnalytics: ClassAnalyticsData`
  - `testPapers: TestPaper[]`
  - `assignedTests: MockAssignment[]`
  - `weakTopics: WeakTopicItem[]`
  - `uploadTestPaper(paper: NewTestPaperInput): void`
  - `assignMCQTest(assignment: NewAssignmentInput): void`
  - `submitOMR(submission: OMRSubmissionInput): Promise<TestDiagnosticResult>`
  - `completePracticeQuiz(topicId: string, score: number, earnedXp: number): void`

## Code Layout
```
src/
├── data/
│   └── mockData.ts                  # Seed data for students, tests, analytics, mistakes, leaderboard
├── types/
│   ├── auth.ts                      # Role & user types
│   ├── test.ts                      # Test, question, OMR, analytics types
│   └── student.ts                   # Student, mistake, XP, leaderboard types
├── context/
│   └── LearningStoreContext.tsx     # Global reactive state provider with localStorage sync
├── layouts/
│   ├── TeacherLayout.tsx            # Teacher portal layout with navigation sidebar & topbar
│   └── StudentLayout.tsx            # Student portal layout with sidebar, mobile nav, topbar & XP
├── pages/
│   ├── Login.tsx                    # Root dual-portal login with 1-click teacher & student demo logins
│   ├── teacher/
│   │   ├── TeacherDashboard.tsx     # Class KPI cards, performance trend chart, subject mastery, missed questions
│   │   ├── StudentDeepDive.tsx      # Student directory & detailed student performance/mistake modal/view
│   │   └── TestManagement.tsx       # Upload test paper by test number & assign MCQ remediation
│   └── student/
│       ├── StudentDashboard.tsx     # Hero overview, XP points, streak, Leaderboard, recent tests
│       ├── OMRUpload.tsx            # 4 category options (Physics, Chemistry, Maths, Full Paper) & scan simulation
│       ├── StudentProfile.tsx       # Historical marks, score improvement trends chart, badges
│       ├── MockTestsImprovement.tsx # AI mock tests & targeted weak topics checklist
│       ├── TestAnalysis.tsx         # Detailed test diagnostic breakdown & concept roadmap
│       └── PracticeSession.tsx      # Interactive remediation quiz session
├── components/
│   ├── common/                      # StatCard, Badge, Modal, ErrorBoundary
│   ├── teacher/                     # ClassPerformanceChart, MissedQuestionsTable, AssignTestModal
│   └── student/                     # LeaderboardWidget, XPWidget, SectionSelector
├── lib/
│   └── utils.ts                     # Utility functions (cn class helper, formatters)
├── App.tsx                          # Dual-portal routing configuration
└── main.tsx                         # React entry point wrapped with BrowserRouter & LearningStoreProvider
```
