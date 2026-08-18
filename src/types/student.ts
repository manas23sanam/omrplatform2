export type SubjectName = 'Physics' | 'Chemistry' | 'Biology' | 'Biology';

export interface StudentScoreHistory {
  testId: string;
  testNumber: string;
  testTitle: string;
  date: string;
  score: number; // e.g. 184
  totalMarks: number; // e.g. 300
  percentage: number; // e.g. 61.3%
  rank: number;
  physicsScore: number;
  chemistryScore: number;
  biologyScore: number;
  accuracy: number; // e.g. 82%
  timeSpentMinutes?: number;
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
  errorType: 'Conceptual' | 'Calculation' | 'Careless' | 'Time-Pressure' | 'Sign Error' | 'Formula Recall';
  aiExplanation: string;
  remediationAction: string;
  dateLogged?: string;
}

export interface SubjectMastery {
  subject: SubjectName;
  masteryPercentage: number;
  color: string;
  bgLight: string;
  weakTopicsCount: number;
  totalQuestionsAttempted: number;
  accuracy: number;
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

export type Badge = BadgeItem;

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
  tier?: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}

export interface XpLedgerEntry {
  id: string;
  timestamp: string;
  amount: number;
  reason: string;
  activityType: 'omr_upload' | 'practice_quiz' | 'streak_bonus' | 'badge_unlock';
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
