# Milestone 3 Handoff Report: OMR Upload Pipeline & Test Diagnostic Analysis (F14, F15, F16)

**Agent**: Explorer 1 (Milestone 3)  
**Date**: 2026-08-15T02:29:00Z  
**Project**: AI Learning Platform (Brothers Academy JEE & NEET Division)  
**Target Milestone**: M3 (Student Portal - F14, F15, F16, F17, F18, F19, F20, F21)

---

## 1. Observation

### 1.1 Existing Files and Code Analysis

1. **`src/types/test.ts` (lines 3-48, 168-187)**:
   - `OMRSection` is typed as `'Physics' | 'Chemistry' | 'Mathematics' | 'Full Paper'`.
   - `OMRQuestionEvaluation` defines: `questionNumber`, `subject`, `topic`, `studentOption`, `correctOption`, `isCorrect`, `status`, `confidence`, `aiNote`, `marksObtained`.
   - `WeakConceptGap` defines: `id`, `topic`, `subject`, `mistakesCount`, `insight`, `recommendedRemediation`, `practiceTopicId`, `priority: 'High' | 'Medium' | 'Low'`.
   - `TestDiagnosticResult` defines: `testId`, `testTitle`, `section`, `submissionDate`, `studentScore`, `totalMarks`, `percentage`, `accuracy`, `rank`, `physicsScore?`, `chemistryScore?`, `mathsScore?`, `weakGaps`, `questionBreakdown`, `scannedImageUrl?`, `feedbackSummary`, `earnedXp`.
   - `OMRProcessingStage` defines: `'idle' | 'uploading' | 'corner_detection' | 'bubble_recognition' | 'evaluating' | 'complete' | 'failed'`.

2. **`src/context/LearningStoreContext.tsx` (lines 48-70, 375-466, 488-530)**:
   - Exposes reactive store state: `currentUser`, `testPapers`, `assignedTests`, `weakTopics`, `leaderboard`, `latestDiagnostic`.
   - `submitOMR(submission: OMRSubmissionInput): Promise<TestDiagnosticResult>` generates realistic test evaluations, questions, scores, creates `TestDiagnosticResult`, persists to `latestDiagnostic` (and `localStorage`), and calls `addXp(earnedXp)` to update student XP and cohort leaderboard rankings in real time.
   - `completePracticeQuiz(topicId, score, earnedXp)` marks weak topics as `mastered` (if score >= 80) and adds XP.
   - `updateWeakTopicStatus(topicId, status)` updates topic state in real time.

3. **`src/data/mockData.ts` (lines 841-1025)**:
   - Contains `INITIAL_DIAGNOSTIC_RESULT` for "JEE Advanced Grand Mock #4" with score `228 / 300` (76.0%), accuracy `82.1%`, rank `4`, with 3 weak concept gap cards and question breakdown.
   - Contains `MOCK_LEADERBOARD` (10 students, with current student Rohan Sharma at Rank 4, 1240 XP).
   - Contains `MOCK_TEST_PAPERS` and `MOCK_WEAK_TOPICS`.

4. **`src/pages/Upload.tsx` (lines 1-146)**:
   - Currently a bare placeholder with a single generic drop area and a simple simulated timer text sequence (`Scanning OMR sheet...`, `Extracting marked bubbles...`).
   - Lacks explicit clickable category tabs (`"Physics"`, `"Chemistry"`, `"Maths"`, `"Full Paper"`).
   - Lacks sample OMR sheet selector for 1-click test evaluation.
   - Lacks interactive camera simulator modal with reticle/fiducial framing guides.
   - Lacks multi-stage CV visualization (corner detection bounding boxes, perspective warp/grid alignment, optical density bubble analysis, real-time CV log console).

5. **`src/pages/Analysis.tsx` (lines 1-207)**:
   - Currently contains static mock values hardcoded in JSX rather than reading from `useLearningStore().latestDiagnostic` or lookup by `useParams().testId`.
   - Lacks subject breakdown cards (Physics, Chemistry, Maths score/accuracy cards).
   - Lacks subject and status filter controls for the question review table.
   - Lacks dynamic connection to 1-click drill triggers linking to `/student/practice/:topicId` or `/student/mock-tests`.

6. **`src/App.tsx` (lines 64-111)**:
   - Routes:
     - `/student/upload` -> `<Upload />`
     - `/student/analysis/:testId` -> `<Analysis />`
     - `/student/mock-tests` -> `<MockTestsImprovement />`
     - `/student/practice/:topicId` -> `<Practice />`
     - `/student/profile` -> `<Profile />`
     - `/student/dashboard` -> `<Dashboard />`

---

## 2. Logic Chain

```
[Requirement: F14 Categorized OMR Upload]
  ├── Observation: User needs explicit clickable category options ("Physics", "Chemistry", "Maths", "Full Paper") (ORIGINAL_REQUEST:24,35).
  ├── Observation: Users/testers need frictionless demo via Sample OMR Sheets picker and Camera simulator.
  └── Inference: Implement OMRCategorySelector with 4 explicit tabs, SampleOMRPicker with 4 realistic preset OMR cards, and CameraSimulatorModal with reticle & fiducials.
         │
         ▼
[Requirement: F15 Multi-Stage OMR Scan Simulation]
  ├── Observation: CV pipeline requires Corner Detection -> Grid Alignment -> Bubble Recognition -> Answer Key Evaluation.
  ├── Observation: Needs high-fidelity visual animation (laser scanline, corner bracket coordinates, bubble density indicators, real-time CV log stream, progress bar).
  └── Inference: Build OMRScanVisualizer that executes a realistic 4-step sequence (4-5s total) with animated HUD overlays and calls store `submitOMR()`, updating latestDiagnostic & awarding XP.
         │
         ▼
[Requirement: F16 Detailed Test Diagnostic Report]
  ├── Observation: Route `/student/analysis/:testId` must display score headline, subject breakdown, priority concept gaps, filterable question-by-question review, and 1-click drill triggers (ORIGINAL_REQUEST:24).
  ├── Observation: Store maintains `latestDiagnostic` or test paper lookup with `WeakConceptGap` and `OMRQuestionEvaluation`.
  └── Inference: Build TestAnalysis page reading from `latestDiagnostic` / `testId`, with Subject Mastery Cards (Physics, Chemistry, Maths), Priority Gap Cards with 1-click drill buttons, Filterable Question Table (Subject & Status filters), and Recovery Roadmap GPS.
```

---

## 3. Caveats

1. **Browser Camera API vs Camera Simulator**:
   - Accessing real hardware cameras in automated CI / headless test environments or restricted browser permissions can cause permission prompt failures.
   - **Recommendation**: Provide an interactive **Camera Simulator Modal** (with realistic viewfinder, corner reticles, flash animation, live simulated video feed with sample OMR alignment guides, and photo capture button) with optional fallback to `navigator.mediaDevices.getUserMedia` when available.
2. **Category Naming Consistency**:
   - `ORIGINAL_REQUEST.md` specifies "Maths" or "Mathematics", while `types/test.ts` uses `'Physics' | 'Chemistry' | 'Mathematics' | 'Full Paper'`.
   - **Recommendation**: In UI category tabs, label as "Physics", "Chemistry", "Maths", and "Full Paper", mapping `'Maths'` internally to `'Mathematics'` for 100% type safety.
3. **Route Aliasing**:
   - Both `/student/analysis/:testId` and legacy `/analysis/:testId` should render the same premium diagnostic experience.

---

## 4. Conclusion & Architecture Blueprint

### 4.1 Recommended File Structure

```
src/
├── pages/
│   ├── Upload.tsx                           # Re-export / wrapper of student/OMRUpload
│   ├── Analysis.tsx                         # Re-export / wrapper of student/TestAnalysis
│   └── student/
│       ├── OMRUpload.tsx                    # [F14 & F15] Complete OMR Upload & Multi-stage Scan Simulation Page
│       ├── TestAnalysis.tsx                 # [F16] Comprehensive Test Diagnostic Report Page
│       ├── MockTestsImprovement.tsx         # [F20] AI Mock Tests & Weak Topic Checklist
│       ├── PracticeSession.tsx              # [F21] Interactive Practice Quiz with 1-click drill verification
│       ├── StudentDashboard.tsx             # [F03 & F17 & F18] Dashboard with XP, Leaderboard, Recent Tests
│       └── StudentProfile.tsx               # [F19] Historical Marks, Score Trajectory, Badges
├── components/
│   └── student/
│       ├── OMRCategoryTabs.tsx              # Explicit clickable tabs: Physics, Chemistry, Maths, Full Paper
│       ├── SampleOMRPicker.tsx              # 4 Preloaded sample OMR sheets with thumbnails & metadata
│       ├── CameraSimulatorModal.tsx         # Interactive camera reticle viewfinder with corner fiducial guides
│       ├── OMRScanVisualizer.tsx            # Multi-stage CV HUD: Corner Detection -> Grid -> Bubbles -> Eval
│       ├── ConceptGapCard.tsx               # Weak area card with priority badge & 1-click drill triggers
│       ├── QuestionBreakdownTable.tsx       # Filterable table (Subject, Status, Search) with confidence & AI notes
│       ├── SubjectBreakdownCards.tsx        # Physics, Chemistry, Mathematics score & accuracy cards
│       └── RecoveryRoadmapWidget.tsx        # Visual 4-step Learning GPS tracker
```

---

### 4.2 Detailed Component & Flow Specifications

#### Component 1: `src/pages/student/OMRUpload.tsx` (F14 & F15)
- **State Machine**:
  ```ts
  type UploadPhase = 'select_and_upload' | 'scanning' | 'complete';
  type OMRCategory = 'Physics' | 'Chemistry' | 'Mathematics' | 'Full Paper';
  ```
- **UI Sections**:
  1. **Header Banner**: Title "Categorized OMR Sheet Upload & AI Diagnostics", subtitle, and active batch pill.
  2. **Category Selection Tabs (F14)**:
     - 4 clickable tabs: `Physics` (30 Qs, 120 Marks), `Chemistry` (30 Qs, 120 Marks), `Maths` (30 Qs, 120 Marks), `Full Paper` (90 Qs, 300 Marks).
     - Active tab has high-contrast indigo background, subject badge, and question count pill.
  3. **Upload Zone / Dropzone (F14)**:
     - Drag & drop area with visual hover states (`isDraggingOver`).
     - "Browse Files" file picker button.
     - "Open Camera Scanner" button launching `CameraSimulatorModal`.
     - File preview container once file is chosen (file name, size, preview thumbnail, "Change OMR" button).
  4. **Sample OMR Sheets Picker (F14)**:
     - 4 realistic sample cards with OMR thumbnail illustration, paper title, questions count, and "Use Sample OMR" 1-click button.
     - Selecting a sample automatically sets the category, loads the mock image, and readies the form.
  5. **Camera Simulator Modal (F14)**:
     - Viewfinder overlay with animated glowing green corner brackets (Top-Left, Top-Right, Bottom-Left, Bottom-Right).
     - Reticle alignment instructions ("Align all 4 corner fiducials within the frame").
     - Live simulation indicators: "Lighting: Optimal", "Perspective: Centered".
     - Action buttons: "Capture Photo", "Toggle Reticle", "Cancel".
     - On capture, extracts simulated OMR image and proceeds to scan.
  6. **Multi-Stage OMR Scan Simulation HUD (F15)**:
     - Triggered on clicking "Start AI Evaluation".
     - **Stage 1 (0.0s - 1.2s): Corner Detection**
       - Identifies 4 registration marks: `TL: (112, 94)`, `TR: (948, 96)`, `BL: (110, 1340)`, `BR: (952, 1338)`.
       - Visual highlight bounding boxes on image preview.
     - **Stage 2 (1.2s - 2.4s): Grid Alignment & Deskewing**
       - Perspective correction calculation: Skew angle `+0.38°`, matrix grid warp overlay.
     - **Stage 3 (2.4s - 3.8s): Bubble Optical Density Recognition**
       - Laser scanline sweep animation moving vertically across the sheet.
       - Bubble recognition counter: `Scanning bubbles 1..30/90`, confidence scores (`98.2% avg`).
     - **Stage 4 (3.8s - 5.0s): Answer Key Evaluation & Scoring**
       - Grading against master key: Correct (+4), Incorrect (-1), Skipped (0).
       - Invokes `submitOMR({ section, imageUrl, studentId })`.
       - Earned XP notification badge: `+180 XP Earned!`.
     - **Live CV Terminal Log**: Timestamped console readout of CV steps.
     - **Progress Stepper**: 4-step linear badge indicator with spinner and checkmarks.
  7. **Completion Card (F15)**:
     - "Evaluation Complete!" banner with score snapshot, accuracy badge, XP awarded badge.
     - Primary button: "View Detailed Diagnostic Report" -> navigates to `/student/analysis/:testId`.

---

#### Component 2: `src/pages/student/TestAnalysis.tsx` (F16)
- **Data Resolution**:
  - Reads `testId` from `useParams()`.
  - Retrieves `latestDiagnostic` from `useLearningStore()`. If `testId` matches or is `latest` / default, uses `latestDiagnostic`; otherwise finds matching test or provides rich mock diagnostic result.
- **UI Sections**:
  1. **Headline Hero Banner**:
     - Test Title (e.g. "JEE Advanced Grand Mock #4 - Full Syllabus").
     - Category pill ("Full Paper" / "Physics"), Submission timestamp, Batch name.
     - Score Chip: `228 / 300` (`76.0%`).
     - Accuracy Chip: `82.1% Accuracy`.
     - Batch Rank Chip: `#4 in Batch`.
     - XP Earned Chip: `+180 XP`.
     - AI Summary: "Strong performance overall! Notable strengths in Optics and Thermodynamics. Critical focus required on Rotational Dynamics torque signs."
  2. **Subject Mastery Cards**:
     - 3 Cards (Physics: `84/100`, Chemistry: `72/100`, Mathematics: `72/100`).
     - Progress bars, accuracy %, correct/incorrect count per subject.
  3. **Priority Concept Gap Cards (Weak Areas)**:
     - List of priority concept gaps detected from missed questions.
     - Each card displays:
       - Subject & Topic name.
       - Priority badge: `High Priority` (Red), `Medium Priority` (Amber), `Low Priority` (Blue).
       - Mistakes count: `2 Mistakes in Rotational Kinematics`.
       - Root-Cause AI Insight: "Neglecting static friction torque direction on inclined plane leading to inverted angular acceleration sign."
       - **1-Click Drill Action Buttons**:
         - `<Link to={`/student/practice/${gap.practiceTopicId}`} />`: "Start 5-min AI Practice Quiz" (direct drill trigger).
         - "Review Concept Formulas" (opens theory drawer or modal).
  4. **Question-by-Question Detailed Review Table**:
     - **Filter Bar**:
       - Subject dropdown / pill filter: `All Subjects (90)`, `Physics (30)`, `Chemistry (30)`, `Mathematics (30)`.
       - Status dropdown / pill filter: `All (90)`, `Correct (68)`, `Incorrect (18)`, `Skipped (4)`.
       - Search input: search by topic name or question number.
     - **Table Columns**:
       - `Q#`: Question number.
       - `Subject & Topic`: Subject badge + Topic name.
       - `Your Answer`: Marked option (e.g., `(B)` in red pill for wrong, `(A)` in green pill for correct).
       - `Correct Key`: Official answer (e.g., `(C)` with green check).
       - `Status & Marks`: `+4 Marks` (Green badge) / `-1 Mark` (Red badge) / `0 Marks` (Gray badge).
       - `AI Diagnosis & Solution Note`: Complete explanation of why the question was answered correctly/incorrectly and the exact formula/step involved.
  5. **Recovery Roadmap (Learning GPS)**:
     - Step 1: OMR Scanned & Evaluated (Completed).
     - Step 2: Concept Gap Review (Active - "2 topics require attention").
     - Step 3: Practice Verification Quiz (Next Step).
     - Step 4: Ready for Next Mock Test (Target 85%+).
  6. **Bottom Action Bar**:
     - "Practice Assigned Drills" (`/student/mock-tests`).
     - "Upload Another OMR Sheet" (`/student/upload`).
     - "Back to Dashboard" (`/student/dashboard`).

---

#### Component 3: `src/pages/student/PracticeSession.tsx` (F21)
- Interactive 5-question micro-remediation drill for any clicked concept gap.
- Question navigation, option selection, immediate grading, step-by-step solutions.
- Upon quiz submission:
  - Invokes `completePracticeQuiz(topicId, score, earnedXp)`.
  - Automatically updates topic status to `mastered` if score >= 80%.
  - Displays confetti / celebration modal with XP gain (+150 XP) and button to return to Test Diagnostic or Mock Tests.

---

## 5. Verification Method

To independently verify the Milestone 3 implementation once coded:

### 5.1 Step-by-Step UI Verification Scenarios

1. **Verify F14 (Categorized OMR Upload)**:
   - Navigate to `/student/upload`.
   - Verify that 4 category tabs are visible and clickable: `"Physics"`, `"Chemistry"`, `"Maths"`, `"Full Paper"`.
   - Click `"Chemistry"` -> verify active tab highlight changes and question count updates to 30.
   - Click `"Sample OMR Sheets"` -> select "JEE Advanced Full Paper Mock 4" -> verify category switches to "Full Paper" and sample image preview is populated.
   - Click `"Open Camera Scanner"` -> verify Camera Simulator modal opens with reticle, 4 corner fiducial brackets, and capture button -> click "Capture Photo" -> verify photo is loaded into upload preview.

2. **Verify F15 (Multi-Stage OMR Scan Simulation)**:
   - On the upload page with an image selected, click "Start AI Evaluation".
   - Verify that the multi-stage visual pipeline activates:
     1. Stage 1: Corner Detection (glowing corner coordinate boxes on OMR preview).
     2. Stage 2: Grid Alignment & Deskewing (perspective grid overlay).
     3. Stage 3: Bubble Optical Density Recognition (laser scanline sweep across bubbles).
     4. Stage 4: Answer Key Evaluation & Scoring (positive/negative marking computed).
   - Verify live CV log console outputs timestamped events.
   - Verify progress stepper increments smoothly from 0% to 100%.
   - Verify that student XP is incremented in store (`+180 XP`) and leaderboard updates.
   - Verify completion screen displays evaluation summary and button to "View Detailed Diagnostic Report".

3. **Verify F16 (Detailed Test Diagnostic Report)**:
   - Navigate to `/student/analysis/paper-01` (or click from scan completion).
   - Verify Score Headline banner shows score (`228 / 300`), accuracy (`82.1%`), rank (`#4`), and XP (`+180 XP`).
   - Verify Subject Mastery Cards show Physics, Chemistry, and Mathematics breakdowns.
   - Verify Priority Concept Gap cards are rendered with High/Medium/Low priority badges and AI root-cause explanations.
   - Click "Start 5-min Practice Quiz" on a concept gap card -> verify it routes to `/student/practice/topic-rotational-friction`.
   - On Question Breakdown Table:
     - Filter by Subject -> click "Physics" -> verify only Physics questions are shown.
     - Filter by Status -> click "Incorrect" -> verify only wrong questions (red -1 mark) are displayed with student option vs correct key.
     - Search for "Kinematics" -> verify filtered results match.

4. **Verify Build & Type Safety**:
   - `npm run build` (`tsc -b && vite build`) executes with zero errors.

---

### Invalidation Conditions
This architecture is invalidated if:
- Category tabs cannot be clicked independently or fail to switch sections.
- Scan simulation does not visualize all 4 distinct CV stages (Corner, Grid, Bubble, Evaluation).
- Diagnostic analysis page fails to display subject scores, concept gap cards, or question-by-question review with picked vs correct options.
- Concept gap drill buttons fail to link to practice sessions.
