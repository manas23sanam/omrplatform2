# Specification Mining Analysis Report: AI Learning & Exam Analytics Platform

**Authoritative Source**: `ORIGINAL_REQUEST.md`  
**Working Directory**: `C:\Users\BIT\.gemini\antigravity\scratch\ai-learning-platform`  
**Date**: 2026-08-14  
**Integrity Mode**: Development  
**Prepared By**: Spec Miner (`.agents/spec_miner_survey_2`)

---

## 1. Executive Summary & System Architecture

The target application is a **premium, white-labeled OMR Analysis and Personalized Learning Platform** designed for educational coaching centers, tutors, and students. The platform delivers instant test grading from uploaded OMR sheet photos, root-cause diagnostic feedback, class-wide performance analytics, and gamified AI-driven remediation workflows.

```
                                  ┌──────────────────────────────┐
                                  │      Root Landing / Login    │
                                  │          Route: `/`          │
                                  │  [Teacher Login] [Student]   │
                                  └──────────────┬───────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
        ┌──────────────────────────────┐                  ┌──────────────────────────────┐
        │       Teacher Portal         │                  │        Student Portal        │
        │       Route: `/teacher`      │                  │       Route: `/student`      │
        ├──────────────────────────────┤                  ├──────────────────────────────┤
        │ • Class Analytics Dashboard  │                  │ • Student Dashboard (XP/Rank)│
        │ • Student Deep Dive Profiles │                  │ • OMR Sheet Upload (4 modes) │
        │ • Test Management & Assign   │                  │ • Profile & Improvement Trend│
        │ • Mistake Diagnostics Table  │                  │ • Mock Tests & Weak Topics   │
        │ • Class Performance Charts   │                  │ • Competitive Leaderboard    │
        └──────────────────────────────┘                  └──────────────────────────────┘
```

### Key Architectural Pillars
1. **Dual-Portal Role-Based Routing**: Clean separation between Teacher (`/teacher/*`) and Student (`/student/*`) spaces, with an intuitive unified login gateway at `/`.
2. **Instant Demo Readiness**: Comprehensive, realistic mocked data across Physics, Chemistry, and Mathematics test sets, allowing instant interactive demonstrations without requiring backend or cloud credentials.
3. **White-Labeled Premium Design**: Styled with modern Tailwind CSS tokens, rounded containers, high-contrast typography, interactive Recharts visualizations, and Lucide iconography.
4. **Gamified AI Remediation Loop**: Complete feedback cycle from OMR scan $\to$ Mistake Analysis $\to$ Knowledge Gap Identification $\to$ Targeted Practice / AI Mock Tests $\to$ XP Awarding & Leaderboard climb.

---

## 2. Requirements Decomposition & Feature Specification

### R1. Dual-Portal Application Architecture

#### R1.1: Root Gateway & Role-Based Authentication (`/` & `/login`)
- **Objective**: Provide an authoritative entry point that lets visitors immediately experience either portal role.
- **Functional Requirements**:
  - Root route (`/`) or `/login` renders a branded login screen with coaching institute identity (e.g., "Brothers Academy" / "Apex Learning").
  - Role switcher tab or prominent dual-action demo buttons:
    1. **"Login as Teacher" / "Teacher Demo Portal"** $\to$ Navigates directly to `/teacher` (or `/teacher/analytics`).
    2. **"Login as Student" / "Student Demo Portal"** $\to$ Navigates directly to `/student` (or `/student/dashboard`).
  - Standard email/password form fields with client-side validation for production readiness.
  - Sign-out / Switch Role functionality accessible in top navigation / sidebar of both portals.

#### R1.2: Portal Shells & Navigation Hierarchy
- **Teacher Layout (`/teacher/*`)**:
  - Desktop sidebar and mobile header/drawer with navigation items:
    1. **Class Analytics** (`/teacher` or `/teacher/analytics`)
    2. **Student Deep Dive** (`/teacher/students`)
    3. **Test Management** (`/teacher/tests`)
  - Topbar displaying teacher identity, active batch selector (e.g. "Batch A1 - JEE 2026"), and switch portal / sign out button.
- **Student Layout (`/student/*`)**:
  - Desktop sidebar and mobile bottom navigation / header with navigation items:
    1. **Dashboard** (`/student` or `/student/dashboard`)
    2. **OMR Upload** (`/student/upload`)
    3. **Mock Tests & Improvement** (`/student/mock-tests` or `/student/improvement`)
    4. **Profile & Performance** (`/student/profile`)
    5. **Past Test Analysis** (`/student/analysis/:testId`)
  - Topbar displaying student avatar, active XP badge (e.g. "1,240 XP"), study streak counter (e.g. "15 Days"), and sign out.

#### R1.3: Styling & Design System
- **Framework**: Tailwind CSS (v4) with CSS custom properties or modern class conventions.
- **Palette**: Indigo/Violet primary brand, Emerald green success, Amber/Orange warning/streaks, Rose/Red mistake alerts, Slate gray surfaces.
- **Card Aesthetics**: Rounded-3xl / Rounded-2xl borders, subtle shadows (`shadow-sm`, `hover:shadow-md`), backdrop blur modals.

---

### R2. Teacher Interface (Analytics & Management)

#### R2.1: Class Analytics Dashboard (`/teacher/analytics` or `/teacher`)
- **Key Metric Snapshot Cards**:
  1. **Total Tests Conducted**: Count of completed evaluations (e.g., "18 Tests").
  2. **Class Average Score**: Aggregate percentage with trend indicator (e.g., "68.4% (+4.2% this month)").
  3. **Average Accuracy**: Correct vs attempted ratio (e.g., "72.1%").
  4. **Active Students**: Count of evaluated students (e.g., "42 Students").
  5. **Top Problem Concept**: Most frequently missed topic across tests (e.g., "Rotational Dynamics").
- **Visual Analytics Charts (Recharts)**:
  - **Class Performance Trend Chart**: Multi-test line/area graph tracking average test scores across historical dates.
  - **Subject Mastery Comparison Chart**: Bar chart illustrating comparative class performance across Physics, Chemistry, and Mathematics.
  - **Score Distribution Histogram**: Distribution curve showing student count across score buckets (0-40%, 41-60%, 61-80%, 81-100%).
- **Frequently Missed Questions Breakdown Table**:
  - Detailed table listing questions with highest error rates across the class.
  - Column specifications:
    - `Test # / Name`: e.g. "Test #7 - Full Syllabus"
    - `Question #`: e.g. "Q14"
    - `Subject & Topic`: e.g. "Physics • Rotational Kinematics"
    - `Miss Rate (%)`: e.g. "68% of class got this wrong"
    - `Common Error Pattern`: e.g. "Applied linear velocity formula instead of angular ($v = r\omega$ missed)"
    - `Quick Action`: "Assign Remediation" or "View Question".

#### R2.2: Student Deep Dive (`/teacher/students` and `/teacher/students/:studentId`)
- **Navigable Student Directory**:
  - Filterable and searchable roster of students in the class.
  - Search bar supporting name or roll number lookup.
  - Filter pills: "All Students", "Top Quartile (>80%)", "Needs Remediation (<60%)", "Active Streaks".
  - Quick summary cards for each student showing Avatar, Name, Batch, Overall Average, Tests Taken, and Status.
- **Student Profile Deep Dive View**:
  - **Student Bio Header**: Avatar, Name, Batch, Overall Rank (e.g., "4th / 42"), Earned XP, Streak.
  - **Performance Trend Graph**: Historical trajectory of this specific student overlaid against the Class Average.
  - **Subject Breakdown**: Progress bars for Physics, Chemistry, Mathematics with accuracy percentages.
  - **Specific Mistakes Log**:
    - Filterable table of all questions missed by this student across recent tests.
    - Fields: Test Name, Question ID, Subject, Student's Pick vs Correct Answer, Error Category (e.g., "Calculation Error", "Concept Misunderstanding", "Formula Slip"), and AI Diagnostic Note.
  - **Action Button**: "Assign Targeted Remediation" button to push custom exercises directly to this student's portal.

#### R2.3: Test Management (`/teacher/tests`)
- **Question Paper Upload Interface**:
  - Upload form supporting PDF/Image question papers.
  - Form Fields:
    - `Test Number` (e.g., "Test #08")
    - `Test Title` (e.g., "JEE Main Mock 8 - Electrostatics & Thermodynamics")
    - `Subject Scope`: Physics, Chemistry, Maths, or Full Paper
    - `Total Questions` & `Total Marks`
    - `Answer Key Mapping`: Manual input or key grid (Q1: B, Q2: A, Q3: D...).
  - Upload dropzone with file preview and status.
- **Manual MCQ Test Assignment Engine**:
  - Module allowing teachers to construct and push targeted tests based on aggregate or individual mistakes.
  - Selection criteria:
    - Assign to: Entire Class, Specific Batch, or Low-Scoring Students on a specific topic.
    - Pick focus topics (e.g. "Rotational Dynamics", "Limiting Reagents").
    - Number of practice questions (e.g. 5, 10, 20 MCQs).
  - List of Active Assigned Tests showing submission count, deadline, and average score.

---

### R3. Student Interface (Gamified Learning & Profile)

#### R3.1: OMR Upload Portal (`/student/upload`)
- **Explicit Category Options**:
  - Four distinct, clearly clickable category selectors:
    1. **"Physics"** (Single subject OMR sheet)
    2. **"Chemistry"** (Single subject OMR sheet)
    3. **"Maths"** (Single subject OMR sheet)
    4. **"Full Paper"** (Combined multi-subject OMR sheet)
- **Upload & Evaluation Simulation Engine**:
  - Drag-and-drop or camera file upload container.
  - Upload states with animated progression:
    1. `Idle`: File selector with instructions (corner markers, flat lighting).
    2. `Uploading`: Progress bar.
    3. `AI Evaluation Pipeline`: Step-by-step radar scan animation ("Scanning corner markers", "Detecting marked bubbles", "Comparing with Master Answer Key", "Evaluating root causes").
    4. `Evaluation Complete`: Success badge and automatic redirection to `/student/analysis/:testId`.
- **Diagnostic Result View (`/student/analysis/:testId`)**:
  - High-level score summary banner: Score (e.g., "120/160"), Percentage ("75%"), Accuracy ("82%").
  - Concept Gap Cards: Identifies specific concept breakdowns (e.g., "Fractions prerequisite missing in Calculus", "Angular velocity mapping").
  - Question-by-Question Breakdown table with AI explanatory notes.
  - Direct link to "Practice Weak Topics".

#### R3.2: Student Dashboard & Gamification (`/student/dashboard` or `/student`)
- **Gamification Hero & Metric Cards**:
  - **Earned XP Score Counter**: Prominently displayed (e.g., "1,240 XP", "+50 XP today").
  - **Daily Study Streak Counter**: Flame icon with streak count (e.g., "15 Days Streak").
  - **Class Rank / League Badge**: Current position in batch (e.g., "#4 in Batch A1").
- **Visible Competitive Leaderboard Component**:
  - Leaderboard table showing top ranking peers in the batch/coaching.
  - Podium badges for Rank #1 (Gold Medal), Rank #2 (Silver Medal), Rank #3 (Bronze Medal).
  - Highlighted row for the logged-in student ("You") with distinct styling, ranking badge, XP, and streak.
  - Anonymized student names (e.g. "Student A", "Student B", or real names) with toggle/privacy indicator.
- **Quick Action Remediation Center**:
  - "Pending Tests" and "Weak Topic Alerts".
  - Quick action buttons to launch remediation directly from dashboard.

#### R3.3: Student Profile & Improvement Trends (`/student/profile`)
- **Profile Header**: Avatar, Full Name, Batch/Grade, Coaching affiliation.
- **Historical Marks & Score Improvement Trends**:
  - Interactive Recharts Area/Line chart illustrating score progression over time across all completed tests.
  - Comparison indicators showing net percentage gain (e.g., "+18% improvement since Test 1").
  - Subject Mastery Progress meters (Mathematics, Science/Physics, Chemistry, English).
- **Test History Log**:
  - Complete list of past tests taken with dates, scores, accuracy %, and "View Analysis" links.
- **Achievements & Badges Showcase**:
  - Unlocked and locked badges: "7-Day Streak", "Math Whiz", "Error Buster", "Speed Demon", "1000 XP Club".

#### R3.4: Improvement & Mock Tests Page (`/student/improvement` or `/student/mock-tests`)
- **Distinct Dedicated Page**: Dedicated separate navigation target from Profile.
- **AI-Configured Mock Tests**:
  - Practice tests algorithmically assembled to target the student's historical weak areas.
  - Examples: "Physics Mechanics Booster Test", "Chemistry Stoichiometry Drill", "Full Syllabus Speed Test".
  - Interactive test modal/runner: Timer, MCQ options (A/B/C/D), instantaneous grading, XP reward upon completion.
- **Targeted Improvement Exercises / Weak Topics Checklist**:
  - Interactive list of identified concept gaps with statuses: `Not Started`, `Studying`, `Ready for Test`, `Mastered`.
  - Concept recap viewer (definitions, key formulas, worked examples).
  - Verification mini-quiz: Interactive quiz to prove mastery and flip status to `Mastered` with XP reward.

---

## 3. Features Discovered & Probed Table

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| **F01** | Architecture (R1) | Dual-Role Login Gateway | Root (`/`) or `/login` presents interface to access either Teacher or Student portal with 1-click demo toggles | Role click / credentials | Redirects to `/teacher` or `/student` | Shows auth validation message if empty | `ORIGINAL_REQUEST.md:14`, `src/App.tsx` |
| **F02** | Architecture (R1) | Teacher Portal Layout Shell | Navigation sidebar & header for teacher routes with batch selector and role logout | Route navigation | Renders child pages with persistent teacher chrome | 404 fallback routes to `/teacher` | `ORIGINAL_REQUEST.md:14` |
| **F03** | Architecture (R1) | Student Portal Layout Shell | Navigation sidebar, topbar with XP/streak, and mobile bottom bar for student routes | Route navigation | Renders student pages with persistent student chrome | 404 fallback routes to `/student` | `ORIGINAL_REQUEST.md:14`, `src/layouts/StudentLayout.tsx` |
| **F04** | Architecture (R1) | Mock Data Store | Client-side reactive mock datasets for students, tests, mistakes, analytics, and leaderboard | Query state / CRUD actions | Realistic demo data populated across all views | Fallback to default mock constants if uninitialized | `ORIGINAL_REQUEST.md:16` |
| **F05** | Teacher (R2) | Class KPI Summary Cards | Displays Total Tests Conducted, Class Average Score, Average Accuracy, and Active Students | Mock test records | KPI statistic widgets with trend arrows | Renders `0` or `N/A` if dataset empty | `ORIGINAL_REQUEST.md:19` |
| **F06** | Teacher (R2) | Class Performance Over Time Graph | Interactive Line/Area chart displaying class average trajectory across all tests | Time range selector / test history | Recharts visualization with tooltip metrics | Flat line if only 1 test exists | `ORIGINAL_REQUEST.md:19,33` |
| **F07** | Teacher (R2) | Subject Mastery Comparison Graph | Bar chart comparing aggregate class scores in Physics, Chemistry, and Mathematics | Subject score aggregates | Comparative multi-bar visual chart | Empty bars with zero state if no subject data | `ORIGINAL_REQUEST.md:19,33` |
| **F08** | Teacher (R2) | Frequently Missed Questions Table | Table listing questions with highest class-wide error rates, error patterns, and root causes | Test question error records | Interactive table with filters & remediation triggers | Empty state message if 100% pass rate | `ORIGINAL_REQUEST.md:19` |
| **F09** | Teacher (R2) | Navigable Student Roster | Searchable & filterable directory of all enrolled students with performance summaries | Search query, batch/grade filter | Filtered grid/list of student preview cards | "No students match your filter" banner | `ORIGINAL_REQUEST.md:20,34` |
| **F10** | Teacher (R2) | Student Deep Dive Profile | Comprehensive individual student view with marks, historical trajectory vs class average, and XP | Student selection (`studentId`) | Detailed performance analytics & profile dashboard | "Student not found" fallback if ID invalid | `ORIGINAL_REQUEST.md:20,34` |
| **F11** | Teacher (R2) | Student Specific Mistakes Log | Filterable breakdown of all questions missed by selected student with picked vs correct answers & AI insights | Student ID / Test filter | Mistake log table with concept diagnostic tags | "Zero mistakes recorded" success banner | `ORIGINAL_REQUEST.md:20,34` |
| **F12** | Teacher (R2) | Question Paper Upload | Interface to upload test papers by test number with title, subject, marks, and answer key | PDF/Image file, Test Number, Subject, Answer Key | New test added to platform catalog | Validates required fields & file format | `ORIGINAL_REQUEST.md:21` |
| **F13** | Teacher (R2) | Manual MCQ Test Assignment | Form to compose and assign targeted MCQ tests to class or low-performing students based on mistakes | Target audience, topic selection, question count | New assignment created in student portals | Prevents assignment with 0 questions selected | `ORIGINAL_REQUEST.md:21` |
| **F14** | Student (R3) | Categorized OMR Sheet Upload | OMR upload form with explicit clickable options for Physics, Chemistry, Maths, and Full Paper | Category selection, image file / photo | Initiates simulated AI scanning pipeline | Prompts user if no category selected | `ORIGINAL_REQUEST.md:24,35` |
| **F15** | Student (R3) | Multi-Stage OMR Scan Simulation | Visual multi-step evaluation radar (Scan $\to$ Bubbles $\to$ Answer Key $\to$ Root Cause) | Upload trigger | Step-by-step progress animation $\to$ navigation to test report | Error banner on simulated corrupted upload | `ORIGINAL_REQUEST.md:24`, `src/pages/Upload.tsx` |
| **F16** | Student (R3) | Detailed Test Diagnostic Report | Post-evaluation report showing total score, accuracy %, concept breakdown, and remediation links | `testId` route parameter | Rich summary banner, weak concept cards, question review table | Fallback demo test shown if ID unmatched | `ORIGINAL_REQUEST.md:24`, `src/pages/Analysis.tsx` |
| **F17** | Student (R3) | Gamified XP & Streak System | Persistent display of earned XP points and daily study streak counters | Quiz completion, practice actions | Updates XP pill in topbar, triggers celebration toast | Non-negative integers only | `ORIGINAL_REQUEST.md:27,37` |
| **F18** | Student (R3) | Batch Leaderboard Component | Interactive leaderboard displaying rank, student names, avatar, streaks, and XP points with podium badges | Mock leaderboard data | Styled ranking table with current student highlighted | Highlights logged-in user at proper rank | `ORIGINAL_REQUEST.md:27,37`, `src/components/Leaderboard.tsx` |
| **F19** | Student (R3) | Dedicated Student Profile Page | Profile view showcasing personal details, historical test scores, improvement trends, and badges | Student profile data | Profile hero banner, historical score chart, badge showcase | Graceful placeholders for missing avatar | `ORIGINAL_REQUEST.md:25,36` |
| **F20** | Student (R3) | Dedicated Improvement & Mock Tests Page | Distinct page dedicated to AI-configured mock tests and targeted weakness exercises | Navigation to `/student/mock-tests` | Grid of practice mock tests and weak topics checklist | Shows "All topics mastered" if no gaps active | `ORIGINAL_REQUEST.md:26,36` |
| **F21** | Student (R3) | Interactive Practice & Verification Quiz | Embedded modal or page to review concept summary and take a 5-question verification test | Option selection (A/B/C/D) | Instant score feedback, status change to "Mastered", XP award | Displays explanation when wrong option selected | `ORIGINAL_REQUEST.md:26`, `src/pages/Practice.tsx` |

---

## 4. Edge Cases, Boundary Conditions & Error Handling

| # | Feature / Area | Scenario / Input Condition | Expected System Behavior |
|---|----------------|----------------------------|--------------------------|
| **E01** | Dual Portal Login | User accesses root URL `/` directly without active session | Render clean login screen with clear choice between Teacher Portal and Student Portal demo logins. |
| **E02** | Dual Portal Routing | User attempts to navigate directly to invalid sub-route (e.g. `/teacher/unknown`) | Redirect gracefully to `/teacher` (or `/student` if in student path) with toast/notification. |
| **E03** | Class Analytics | Single test recorded in dataset (insufficient points for multi-period line trend) | Render line chart with single data point dot and a contextual message ("1 test recorded. More trends will appear after Test 2."). |
| **E04** | Class Analytics | Frequently Missed Questions table with 0 mistakes across all questions | Display empty state badge: "Perfect Class Record! No frequently missed questions detected." |
| **E05** | Student Deep Dive | Search term entered in student directory matches 0 students | Display clear empty search state: "No students found matching '[query]'. Try searching by first name or roll number." |
| **E06** | Student Deep Dive | Student has 100% score on all tests (0 mistakes in log) | Mistakes table shows congratulatory banner: "Clean Sheet! No concept gaps or mistakes identified for this student." |
| **E07** | Test Management | Teacher attempts to upload Question Paper without entering Test Number or Title | Highlight invalid fields with red border and message: "Test Number and Title are required." |
| **E08** | Test Management | Teacher assigns MCQ test without selecting any topic or questions | Disable "Assign Test" button and show prompt: "Select at least 1 focus topic or question to assign." |
| **E09** | OMR Upload | User attempts to upload image without selecting one of the 4 category options | Category selector defaults to "Full Paper" or indicates active selection with clear radio indicator. |
| **E10** | OMR Upload | User uploads non-image or excessively large file | Display friendly error: "Please upload a clear JPG or PNG image of your OMR sheet." |
| **E11** | Mock Tests / Improvement | Student completes verification test with incorrect answer | Provide remedial hint, keep status at "Studying", and offer immediate re-study materials without penalizing XP. |
| **E12** | Gamification Leaderboard | Current student is ranked beyond top 5 (e.g. Rank #12) | Leaderboard displays top 3 podium + surrounding peers and pins "You (#12)" visibly at the bottom or in-line. |
| **E13** | Viewport Responsiveness | User opens Teacher Analytics or Student OMR on mobile screen (<640px) | Layout switches to vertical stack, sidebar collapses to drawer/bottom bar, tables enable horizontal scrolling. |
| **E14** | State Persistence | User completes an assignment or practice quiz in demo mode | Local state updates immediately (XP increases, topic marked "Mastered", test appears in history) during the session. |

---

## 5. Verification & Acceptance Criteria Matrix

| Criteria ID | Acceptance Rule from ORIGINAL_REQUEST.md | Verification Method | Pass Condition |
|-------------|------------------------------------------|---------------------|----------------|
| **AC-01** | Root URL (`/`) presents a professional login screen with options to route to `/teacher` or `/student` | Load `/` in browser | Visible login card with explicit "Teacher Portal" and "Student Portal" routing options. |
| **AC-02** | Teacher Dashboard contains visible charts/graphs (using mocked data) representing overall class performance and average marks | Navigate to `/teacher` | Recharts Line/Area chart for class performance trends and Bar chart for subject averages are rendered with mock data. |
| **AC-03** | Teacher interface contains a navigable list of students, and clicking a student reveals detailed performance data and mistakes | Navigate to `/teacher/students` $\to$ click a student | List of students rendered; clicking a student opens detailed profile with performance graphs and mistakes breakdown. |
| **AC-04** | Student Dashboard contains an OMR upload form with explicit options for "Physics", "Chemistry", "Maths", and "Full Paper" | Navigate to `/student/upload` | Four distinct category buttons/tabs ("Physics", "Chemistry", "Maths", "Full Paper") are visible and selectable. |
| **AC-05** | Student portal includes a distinct "Profile" page showing score improvement trends, and a separate "Mock Tests/Improvement" page containing practice assignments | Navigate to `/student/profile` and `/student/mock-tests` | `/student/profile` displays historical improvement chart; `/student/mock-tests` (or `/student/improvement`) is a separate page with practice tests. |
| **AC-06** | Student Dashboard displays a gamification section featuring an XP score and a visible Leaderboard component | Navigate to `/student` / `/student/dashboard` | XP points counter is prominently displayed alongside a visible Leaderboard ranking table. |

---

## 6. End-to-End User Journeys & Workflows

### Workflow 1: Teacher Class Diagnostic & Remediation Assignment
1. Teacher accesses `/` $\to$ clicks **"Teacher Portal"** demo login.
2. Lands on **Class Analytics Dashboard (`/teacher/analytics`)**:
   - Inspects KPI cards (Total Tests: 18, Class Average: 68.4%).
   - Reviews Class Performance Trend curve and Subject Score comparisons.
   - Observes that **Question #14 (Physics - Rotational Kinematics)** has a 68% miss rate.
3. Navigates to **Student Deep Dive (`/teacher/students`)**:
   - Searches for "Rohan" or filters by "Needs Attention".
   - Clicks student row to open Rohan's comprehensive diagnostic view.
   - Inspects Rohan's mistakes log: sees error on Q14 ("Applied linear velocity $v=at$ instead of $\omega=\alpha t$").
4. Navigates to **Test Management (`/teacher/tests`)**:
   - Uploads new test paper "Test #08 - Mechanics & Rotational Motion Booster".
   - Assigns a 5-question targeted MCQ quiz specifically to students who missed Q14.

### Workflow 2: Student OMR Upload, Diagnostic Review & Gamified Remediation
1. Student accesses `/` $\to$ clicks **"Student Portal"** demo login.
2. Lands on **Student Dashboard (`/student/dashboard`)**:
   - Sees current XP (1,240 XP), 15-day streak, and position on the Batch Leaderboard (#4).
   - Notices alert: "Weekly Physics Test OMR Pending".
3. Clicks **"Upload OMR" (`/student/upload`)**:
   - Selects category button: **"Physics"** (or "Full Paper").
   - Drops OMR photo $\to$ AI multi-stage scanner runs with visual progress steps.
4. Redirected to **Test Analysis (`/student/analysis/test-7`)**:
   - Reviews score (120/160, 75%) and weak topic cards ("Rotational Kinematics").
   - Clicks **"Practice 5 Questions"** to jump into remediation.
5. Navigates to **Mock Tests & Improvement (`/student/mock-tests`)**:
   - Reviews concept study card $\to$ takes 5-question verification test.
   - Scores 5/5 $\to$ earns **+100 XP**, topic status changes to "Mastered".
6. Visits **Profile (`/student/profile`)**:
   - Views updated score improvement trend graph and newly unlocked "Physics Whiz" badge.
   - Verifies updated climb on the Batch Leaderboard.

---

## 7. Comprehensive Mock Data Architecture

To ensure the platform is demo-ready, the application will provide rich in-memory mock datasets structured as follows:

```typescript
// Core Data Models Specification

export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  grade: string;
  batch: string;
  email: string;
  xp: number;
  streakDays: number;
  rank: number;
  overallScore: number;
  accuracy: number;
  subjectMastery: {
    physics: number;
    chemistry: number;
    maths: number;
  };
  badges: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }>;
}

export interface MistakeRecord {
  id: string;
  studentId: string;
  testId: string;
  testName: string;
  questionNumber: number;
  subject: 'Physics' | 'Chemistry' | 'Maths';
  topic: string;
  selectedOption: string;
  correctOption: string;
  errorType: 'Concept Gap' | 'Calculation Error' | 'Formula Misapplied' | 'Misread';
  diagnosticNote: string;
  timestamp: string;
}

export interface ClassTestAnalytics {
  id: string;
  testNumber: string;
  testName: string;
  date: string;
  totalStudents: number;
  averageScore: number;
  averageAccuracy: number;
  highestScore: number;
  subjectAverages: {
    physics: number;
    chemistry: number;
    maths: number;
  };
  frequentlyMissedQuestions: Array<{
    questionNumber: number;
    subject: string;
    topic: string;
    missRatePercentage: number;
    commonErrorNote: string;
  }>;
}

export interface MockTestPracticeItem {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Maths' | 'Full Paper';
  topic: string;
  questionCount: number;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  targetGap: string;
  xpReward: number;
  questions: Array<{
    id: string;
    questionText: string;
    options: Array<{ id: string; text: string }>;
    correctOptionId: string;
    explanation: string;
  }>;
}

export interface WeakTopicItem {
  id: string;
  subject: string;
  topicName: string;
  mistakeCount: number;
  status: 'not_started' | 'studying' | 'ready' | 'mastered';
  studyGuideMarkdown: string;
  verificationQuestions: Array<{
    id: string;
    questionText: string;
    options: Array<{ id: string; text: string }>;
    correctOptionId: string;
  }>;
}
```

---

## 8. Summary & Conclusion

This specification mining analysis establishes the complete feature contract for the AI Learning & Exam Analytics Platform. All functional requirements from `ORIGINAL_REQUEST.md` (R1: Dual-Portal Architecture, R2: Teacher Interface, R3: Student Interface) alongside all six Verification & Quality Bar Acceptance Criteria (AC1–AC6), edge cases, and user workflows are rigorously documented and ready for implementation.
