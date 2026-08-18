import type { SubjectName } from './student';

export type OMRSection = 'Physics' | 'Chemistry' | 'Biology' | 'Full Paper';

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
  marksObtained: number; // +4 for correct, -1 for negative, 0 for skipped in NEET
}

export interface WeakConceptGap {
  id: string;
  topic: string;
  subject: SubjectName;
  mistakesCount: number;
  insight: string;
  recommendedRemediation: string;
  practiceTopicId: string;
  priority: 'High' | 'Medium' | 'Low';
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
  biologyScore?: number;
  weakGaps: WeakConceptGap[];
  questionBreakdown: OMRQuestionEvaluation[];
  scannedImageUrl?: string;
  feedbackSummary: string;
  timeSpentSeconds?: number;
  earnedXp: number;
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
  pdfUrl?: string;
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
  estimatedMinutes?: number;
}

export type MockTestPracticeItem = MockAssignment;

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
  description?: string;
}

export interface ClassPerformanceTrendPoint {
  testNumber: string;
  testTitle: string;
  classAverage: number;
  highestScore: number;
  lowestScore: number;
  targetBenchmark: number;
  date?: string;
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
  recommendedAction?: string;
}

export type FrequentlyMissedQuestion = MissedQuestionStat;

export interface ClassAnalyticsData {
  batch: string;
  totalTestsConducted: number;
  classAverageScore: number;
  classAverageMarks?: number;
  averageAccuracy: number;
  activeStudentCount: number;
  subjectAverages: {
    physics: number;
    chemistry: number;
    biology: number;
  };
  performanceTrends: ClassPerformanceTrendPoint[];
  frequentlyMissedQuestions: MissedQuestionStat[];
}

export type ClassTestAnalytics = ClassAnalyticsData;

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
  geminiResult?: any;
  testNumber?: string;
}

export type OMRSubmission = OMRSubmissionInput;

export type OMRProcessingStage = 
  | 'idle'
  | 'uploading'
  | 'corner_detection'
  | 'bubble_recognition'
  | 'evaluating'
  | 'complete'
  | 'failed';
