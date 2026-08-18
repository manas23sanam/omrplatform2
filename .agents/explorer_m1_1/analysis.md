# Milestone 1: Types, State Store & Data Models — Technical Analysis & Implementation Blueprint

## Executive Summary
Milestone 1 establishes the core foundation for the AI-driven OMR Analysis and Personalized Learning Platform ("Brothers Academy"). This blueprint defines:
1. **Type Definitions** in `src/types/` (`auth.ts`, `student.ts`, `test.ts`) providing end-to-end domain safety.
2. **Rich Mock Data** in `src/data/mockData.ts` with comprehensive JEE/NEET e-learning datasets (students, class analytics, mistake logs with option choices & AI insights, test papers, mock assignments, leaderboard).
3. **Reactive Global State Store** in `src/context/LearningStoreContext.tsx` with React Context and `localStorage` persistence, exposing robust action dispatchers (`loginAs`, `logout`, `uploadTestPaper`, `assignMCQTest`, `submitOMR`, `completePracticeQuiz`, `updateWeakTopicStatus`, `setSelectedBatch`).
4. **Dual-Role Login Gateway (F01)** in `src/pages/Login.tsx` with instant 1-click demo logins for Teacher (`Dr. Vikram Malhotra`) and Student (`Rohan Sharma - Batch A1`), along with email/password authentication.
5. **Teacher Portal Layout Shell (F02)** in `src/layouts/TeacherLayout.tsx` with navigation sidebar, live batch switcher dropdown, educator profile badge, and role switcher/sign-out.
6. **Student Portal Layout Shell (F03)** in `src/layouts/StudentLayout.tsx` with sidebar navigation, responsive mobile bottom bar, live gamified XP counter, daily study streak pill, student profile header, and sign-out.
7. **Routing & App Shell Architecture** in `src/App.tsx` and `src/main.tsx` supporting `/`, `/login`, `/teacher/*`, and `/student/*` with backward-compatible aliases for legacy links.
8. **Resolution of Legacy TypeScript Build Errors** in `src/components/LoginPage.tsx` (fixing `supabase.supabaseUrl` invalid property access).

---

## 1. Complete Type Architecture (`src/types/`)

### 1.1 `src/types/auth.ts`
```typescript
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatarUrl: string;
  batch?: string;
  grade?: string;
  subjectSpecialization?: string; // For teachers, e.g., 'Senior Physics'
  xp: number;
  streak: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
```

### 1.2 `src/types/student.ts`
```typescript
export type SubjectName = 'Physics' | 'Chemistry' | 'Mathematics';

export interface StudentScoreHistory {
  testId: string;
  testNumber: string;
  testTitle: string;
  date: string;
  score: number; // e.g. 120
  totalMarks: number; // e.g. 160
  percentage: number; // e.g. 75
  rank: number;
  physicsScore: number;
  chemistryScore: number;
  mathsScore: number;
  accuracy: number; // e.g. 82%
}

export interface MistakeRecord {
  id: string;
  testId: string;
  testTitle: string;
  questionNumber: number;
  subject: SubjectName;
  topic: string;
  subtopic: string;
  questionText: string;
  studentOption: 'A' | 'B' | 'C' | 'D' | 'unattempted';
  correctOption: 'A' | 'B' | 'C' | 'D';
  errorType: 'Conceptual' | 'Calculation' | 'Careless' | 'Time-Pressure' | 'Sign Error';
  aiExplanation: string;
  remediationAction: string;
}

export interface SubjectMastery {
  subject: SubjectName;
  masteryPercentage: number;
  color: string;
  bgLight: string;
  weakTopicsCount: number;
  totalQuestionsAttempted: number;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatarUrl: string;
  batch: string;
  score: number;
  totalXp: number;
  streak: number;
  accuracy: number;
  isCurrentStudent?: boolean;
  tier?: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  batch: string;
  grade: string;
  avatarUrl: string;
  overallRank: number;
  totalTests: number;
  averageScore: number;
  averageAccuracy: number;
  xp: number;
  streak: number;
  scoreHistory: StudentScoreHistory[];
  subjectMastery: SubjectMastery[];
  mistakes: MistakeRecord[];
  badges: BadgeItem[];
}
```

### 1.3 `src/types/test.ts`
```typescript
import { SubjectName } from './student';

export type OMRSection = 'Physics' | 'Chemistry' | 'Mathematics' | 'Full Paper';

export interface OMRQuestionEvaluation {
  questionNumber: number;
  subject: SubjectName;
  topic: string;
  studentOption: 'A' | 'B' | 'C' | 'D' | 'unattempted';
  correctOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  status: 'correct' | 'incorrect' | 'skipped';
  confidence: number; // 0.0 to 1.0 (bubble recognition quality)
  aiNote: string;
}

export interface WeakConceptGap {
  id: string;
  topic: string;
  subject: SubjectName;
  mistakesCount: number;
  insight: string;
  recommendedRemediation: string;
  practiceTopicId: string;
}

export interface TestDiagnosticResult {
  testId: string;
  testTitle: string;
  section: OMRSection;
  submissionDate: string;
  studentScore: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  rank: number;
  physicsScore?: number;
  chemistryScore?: number;
  mathsScore?: number;
  weakGaps: WeakConceptGap[];
  questionBreakdown: OMRQuestionEvaluation[];
  scannedImageUrl?: string;
  feedbackSummary: string;
}

export interface TestPaper {
  id: string;
  testNumber: string;
  title: string;
  batch: string;
  subjectScope: OMRSection;
  dateConducted: string;
  totalMarks: number;
  questionCount: number;
  classAverage: number;
  highestScore: number;
  answerKey: Record<number, 'A' | 'B' | 'C' | 'D'>;
  pdfUrl?: string;
}

export interface NewTestPaperInput {
  testNumber: string;
  title: string;
  batch: string;
  subjectScope: OMRSection;
  totalMarks: number;
  questionCount: number;
  answerKey: Record<number, 'A' | 'B' | 'C' | 'D'>;
}

export interface MockAssignment {
  id: string;
  title: string;
  description: string;
  subject: SubjectName;
  targetTopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  assignedBy: string;
  assignedToBatch: string;
  assignedToStudentId?: string;
  dueDate: string;
  status: 'assigned' | 'in_progress' | 'completed';
  score?: number;
  xpReward: number;
}

export interface NewAssignmentInput {
  title: string;
  subject: SubjectName;
  targetTopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  assignedToBatch: string;
  assignedToStudentId?: string;
  dueDate: string;
  xpReward: number;
}

export interface ClassPerformanceTrendPoint {
  testNumber: string;
  testTitle: string;
  classAverage: number;
  highestScore: number;
  lowestScore: number;
  targetBenchmark: number;
}

export interface MissedQuestionStat {
  questionNumber: number;
  testTitle: string;
  subject: SubjectName;
  topic: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  missedPercentage: number;
  commonWrongOption: 'A' | 'B' | 'C' | 'D';
  rootCauseDiagnosis: string;
}

export interface ClassAnalyticsData {
  batch: string;
  totalTestsConducted: number;
  classAverageScore: number;
  averageAccuracy: number;
  activeStudentCount: number;
  subjectAverages: {
    physics: number;
    chemistry: number;
    maths: number;
  };
  performanceTrends: ClassPerformanceTrendPoint[];
  frequentlyMissedQuestions: MissedQuestionStat[];
}

export interface WeakTopicItem {
  id: string;
  subject: SubjectName;
  name: string;
  status: 'not_started' | 'studying' | 'ready' | 'mastered';
  mistakesCount: number;
  lastTestedDate?: string;
  conceptExplanation: string;
  formula?: string;
  exampleProblem?: {
    question: string;
    steps: string[];
    solution: string;
  };
}

export interface OMRSubmissionInput {
  testId?: string;
  section: OMRSection;
  file?: File | null;
  imageUrl?: string;
  studentId: string;
}
```

---

## 2. Mock Data Store (`src/data/mockData.ts`)

`src/data/mockData.ts` contains:
- `DEMO_TEACHER_USER`: Dr. Vikram Malhotra (`teacher`, `id: 't-01'`, `Senior Physics Head`)
- `DEMO_STUDENT_USER`: Rohan Sharma (`student`, `id: 's-01'`, `Batch A1`, `1,240 XP`, `15 Streak`)
- `BATCH_LIST`:
  - `Batch A1 (JEE Advanced 2026)`
  - `Batch B1 (NEET Elite Target)`
  - `Batch C1 (JEE Main & Foundation)`
- `MOCK_STUDENTS`: 8 fully-detailed student records with historical tests, mistake breakdown, subject mastery percentages, and badges.
- `MOCK_CLASS_ANALYTICS`: Complete KPI data, 7-test historical trends (Class Average vs Highest vs Benchmark), subject breakdown (Physics 66%, Chemistry 74%, Maths 65%), and 4 frequently missed questions with root cause analysis.
- `MOCK_TEST_PAPERS`: 5 conducted test papers with answer keys.
- `MOCK_ASSIGNMENTS`: 6 AI & teacher configured mock assignments with difficulty and XP bounties.
- `MOCK_WEAK_TOPICS`: 5 detailed remediation checklist topics with interactive study data.
- `MOCK_LEADERBOARD`: 10 students ranking with podium styling and Rohan highlighted as current user.

---

## 3. Reactive State Store (`src/context/LearningStoreContext.tsx`)

The store provides unified state with localStorage synchronization:
```typescript
interface LearningStoreContextType {
  // Authentication & Profile
  currentUser: User | null;
  isAuthenticated: boolean;
  loginAs: (role: UserRole, studentId?: string) => void;
  logout: () => void;

  // Batch Selection
  batches: string[];
  selectedBatch: string;
  setSelectedBatch: (batch: string) => void;

  // Domain Data
  students: StudentRecord[];
  classAnalytics: ClassAnalyticsData;
  testPapers: TestPaper[];
  assignedTests: MockAssignment[];
  weakTopics: WeakTopicItem[];
  leaderboard: LeaderboardEntry[];
  latestDiagnostic: TestDiagnosticResult | null;

  // Actions
  uploadTestPaper: (paper: NewTestPaperInput) => void;
  assignMCQTest: (assignment: NewAssignmentInput) => void;
  submitOMR: (submission: OMRSubmissionInput) => Promise<TestDiagnosticResult>;
  completePracticeQuiz: (topicId: string, score: number, earnedXp: number) => void;
  updateWeakTopicStatus: (topicId: string, status: WeakTopicItem['status']) => void;
  resetToDefaults: () => void;
}
```

Key store features:
- Automatically updates student XP and streak when tests or practice quizzes are completed.
- Dynamically recalculates leaderboard when student XP changes.
- Syncs state changes to `localStorage` under `ai_learning_store_v1`.
- Provides mock OMR scanning pipeline with realistic simulated delay and diagnostic generation.

---

## 4. UI Implementation Specifications

### 4.1 Login Gateway (`src/pages/Login.tsx`)
- **Top Brand**: Brothers Academy AI GPS logo + subtitle.
- **Fast 1-Click Demo Buttons**:
  - `👨‍🏫 Demo as Teacher` (Dr. Vikram Malhotra) -> logs in and navigates to `/teacher`.
  - `🎓 Demo as Student` (Rohan Sharma) -> logs in and navigates to `/student`.
- **Standard Email & Password Form**:
  - Includes toggle between Sign In and Sign Up.
  - Seamlessly handles authentication.

### 4.2 Teacher Layout Shell (`src/layouts/TeacherLayout.tsx`)
- **Theme**: Premium Slate / Indigo header and sidebar with educator badges.
- **Sidebar**:
  - `Class Analytics & KPIs` (`/teacher` or `/teacher/dashboard`)
  - `Student Deep Dive` (`/teacher/students`)
  - `Test & MCQ Management` (`/teacher/tests`)
- **Topbar**:
  - Batch Selector Dropdown (`selectedBatch`) syncing to store.
  - Active Educator Badge: "Dr. Vikram Malhotra (Senior Faculty)".
  - Role Switcher & Sign Out buttons.

### 4.3 Student Layout Shell (`src/layouts/StudentLayout.tsx`)
- **Theme**: Energetic e-learning with gamified accents.
- **Sidebar (Desktop)**:
  - `Dashboard` (`/student` or `/student/dashboard`)
  - `Upload OMR Sheet` (`/student/upload`)
  - `Mock Tests & Improvement` (`/student/mock-tests`)
  - `Student Profile & Trends` (`/student/profile`)
- **Topbar**:
  - Gamified XP Pill: `⚡ 1,240 XP`
  - Study Streak Pill: `🔥 15 Days`
  - Student Avatar & Roll Number info (`Rohan Sharma - Batch A1`).
  - Sign Out button.
- **Mobile Navigation Bar**: Bottom sticky bar with active tab indicator for 100% mobile accessibility.

### 4.4 App Routing Configuration (`src/App.tsx`)
- Route structure:
  - `/` -> Login Gateway or redirects to `/teacher` / `/student` if authenticated.
  - `/login` -> Dual-Portal Login Gateway.
  - `/teacher/*` -> Wrapped in `<TeacherLayout />`:
    - `/teacher` / `/teacher/dashboard` -> `<TeacherDashboard />`
    - `/teacher/students` -> `<StudentDeepDive />`
    - `/teacher/students/:studentId` -> `<StudentDeepDive />`
    - `/teacher/tests` -> `<TestManagement />`
  - `/student/*` -> Wrapped in `<StudentLayout />`:
    - `/student` / `/student/dashboard` -> `<StudentDashboard />`
    - `/student/upload` -> `<OMRUpload />`
    - `/student/profile` -> `<StudentProfile />`
    - `/student/mock-tests` -> `<MockTestsImprovement />`
    - `/student/analysis/:testId` -> `<TestAnalysis />`
    - `/student/practice/:topicId` -> `<PracticeSession />`
  - Legacy Aliases (auto-redirect to `/student/*`):
    - `/dashboard` -> `/student/dashboard`
    - `/upload` -> `/student/upload`
    - `/profile` -> `/student/profile`
    - `/history` -> `/student/mock-tests`
    - `/analysis/:testId` -> `/student/analysis/:testId`
    - `/practice/:topicId` -> `/student/practice/:topicId`

---

## 5. TypeScript Error Fix in `src/components/LoginPage.tsx`
- In `src/components/LoginPage.tsx` line 45:
  ```typescript
  // BEFORE (causes build failure: Property 'supabaseUrl' does not exist on type 'SupabaseClient'):
  else if (!isLogin && !supabase.supabaseUrl.includes('placeholder'))

  // AFTER (safe environment variable check):
  else if (!isLogin && !import.meta.env.VITE_SUPABASE_URL?.includes('placeholder'))
  ```
  Or clean replacement with new `src/pages/Login.tsx` and re-export.
