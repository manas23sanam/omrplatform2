import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types/auth';
import type {
  StudentRecord,
  LeaderboardEntry,
} from '../types/student';
import type {
  ClassAnalyticsData,
  TestPaper,
  MockAssignment,
  WeakTopicItem,
  TestDiagnosticResult,
  NewTestPaperInput,
  NewAssignmentInput,
  OMRSubmissionInput,
  OMRQuestionEvaluation,
} from '../types/test';
import {
  DEMO_TEACHER_USER,
  DEMO_STUDENT_USER,
  BATCH_LIST,
  MOCK_STUDENTS,
  MOCK_CLASS_ANALYTICS,
  MOCK_TEST_PAPERS,
  MOCK_ASSIGNMENTS,
  MOCK_WEAK_TOPICS,
  MOCK_LEADERBOARD,
  INITIAL_DIAGNOSTIC_RESULT,
} from '../data/mockData';

const LOCAL_STORAGE_KEY = 'ai_learning_platform_store_v3';

export interface LearningStoreState {
  currentUser: User | null;
  isAuthenticated: boolean;
  batches: string[];
  selectedBatch: string;
  activeBatch: string;
  students: StudentRecord[];
  classAnalytics: ClassAnalyticsData;
  testPapers: TestPaper[];
  assignedTests: MockAssignment[];
  weakTopics: WeakTopicItem[];
  leaderboard: LeaderboardEntry[];
  latestDiagnostic: TestDiagnosticResult | null;
}

export interface LearningStoreContextType extends LearningStoreState {
  // Auth & Profile
  loginAs: (role: UserRole, studentId?: string) => void;
  loginWithCredentials: (
    email: string,
    password: string,
    role?: UserRole
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Batch Selection
  setSelectedBatch: (batch: string) => void;
  setActiveBatch: (batch: string) => void;

  // Store Actions
  uploadTestPaper: (paper: NewTestPaperInput) => void;
  assignMCQTest: (assignment: NewAssignmentInput) => void;
  submitOMR: (submission: OMRSubmissionInput) => Promise<TestDiagnosticResult>;
  completePracticeQuiz: (topicId: string, score: number, earnedXp: number) => void;
  updateWeakTopicStatus: (topicId: string, status: WeakTopicItem['status']) => void;
  addXp: (amount: number, reason?: string) => void;
  resetToDefaults: () => void;
}

const LearningStoreContext = createContext<LearningStoreContextType | undefined>(undefined);

export const LearningStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted state or initialize with defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [selectedBatch, setSelectedBatchState] = useState<string>(() => {
    try {
      return localStorage.getItem(`${LOCAL_STORAGE_KEY}_batch`) || BATCH_LIST[0];
    } catch {
      return BATCH_LIST[0];
    }
  });

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_students`);
      return stored ? JSON.parse(stored) : MOCK_STUDENTS;
    } catch {
      return MOCK_STUDENTS;
    }
  });

  const [classAnalytics, setClassAnalytics] = useState<ClassAnalyticsData>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_analytics`);
      return stored ? JSON.parse(stored) : MOCK_CLASS_ANALYTICS;
    } catch {
      return MOCK_CLASS_ANALYTICS;
    }
  });

  const [testPapers, setTestPapers] = useState<TestPaper[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_papers`);
      return stored ? JSON.parse(stored) : MOCK_TEST_PAPERS;
    } catch {
      return MOCK_TEST_PAPERS;
    }
  });

  const [assignedTests, setAssignedTests] = useState<MockAssignment[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_assignments`);
      return stored ? JSON.parse(stored) : MOCK_ASSIGNMENTS;
    } catch {
      return MOCK_ASSIGNMENTS;
    }
  });

  const [weakTopics, setWeakTopics] = useState<WeakTopicItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_weak_topics`);
      return stored ? JSON.parse(stored) : MOCK_WEAK_TOPICS;
    } catch {
      return MOCK_WEAK_TOPICS;
    }
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leaderboard`);
      return stored ? JSON.parse(stored) : MOCK_LEADERBOARD;
    } catch {
      return MOCK_LEADERBOARD;
    }
  });

  const [latestDiagnostic, setLatestDiagnostic] = useState<TestDiagnosticResult | null>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_diagnostic`);
      return stored ? JSON.parse(stored) : INITIAL_DIAGNOSTIC_RESULT;
    } catch {
      return INITIAL_DIAGNOSTIC_RESULT;
    }
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
      }
    } catch (e) {
      console.error('Failed to persist user state:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_batch`, selectedBatch);
    } catch (e) {
      console.error('Failed to persist batch:', e);
    }
  }, [selectedBatch]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_students`, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to persist students:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_analytics`, JSON.stringify(classAnalytics));
    } catch (e) {
      console.error('Failed to persist analytics:', e);
    }
  }, [classAnalytics]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_papers`, JSON.stringify(testPapers));
    } catch (e) {
      console.error('Failed to persist papers:', e);
    }
  }, [testPapers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_assignments`, JSON.stringify(assignedTests));
    } catch (e) {
      console.error('Failed to persist assignments:', e);
    }
  }, [assignedTests]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_weak_topics`, JSON.stringify(weakTopics));
    } catch (e) {
      console.error('Failed to persist weak topics:', e);
    }
  }, [weakTopics]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_leaderboard`, JSON.stringify(leaderboard));
    } catch (e) {
      console.error('Failed to persist leaderboard:', e);
    }
  }, [leaderboard]);

  useEffect(() => {
    try {
      if (latestDiagnostic) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_diagnostic`, JSON.stringify(latestDiagnostic));
      }
    } catch (e) {
      console.error('Failed to persist diagnostic:', e);
    }
  }, [latestDiagnostic]);

  // Auth Operations
  const loginAs = (role: UserRole, studentId?: string) => {
    if (role === 'teacher') {
      setCurrentUser(DEMO_TEACHER_USER);
    } else {
      if (studentId) {
        const found = students.find((s) => s.id === studentId);
        if (found) {
          setCurrentUser({
            id: found.id,
            role: 'student',
            name: found.name,
            email: found.email,
            avatarUrl: found.avatarUrl,
            batch: found.batch,
            grade: found.grade,
            rollNumber: found.rollNumber,
            xp: found.xp,
            streak: found.streak,
          });
          return;
        }
      }
      setCurrentUser(DEMO_STUDENT_USER);
    }
  };

  const loginWithCredentials = async (
    email: string,
    password: string,
    role: UserRole = 'student'
  ): Promise<{ success: boolean; error?: string }> => {
    // Basic validation
    if (!email || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }
    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    if (role === 'teacher') {
      setCurrentUser({
        ...DEMO_TEACHER_USER,
        email,
      });
    } else {
      // Find or assign student
      const matched = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setCurrentUser({
          id: matched.id,
          role: 'student',
          name: matched.name,
          email: matched.email,
          avatarUrl: matched.avatarUrl,
          batch: matched.batch,
          grade: matched.grade,
          rollNumber: matched.rollNumber,
          xp: matched.xp,
          streak: matched.streak,
        });
      } else {
        setCurrentUser({
          ...DEMO_STUDENT_USER,
          email,
        });
      }
    }
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const setSelectedBatch = (batch: string) => {
    setSelectedBatchState(batch);
  };

  // Upload New Test Paper
  const uploadTestPaper = (newPaper: NewTestPaperInput) => {
    const created: TestPaper = {
      id: `paper-${Date.now()}`,
      testNumber: newPaper.testNumber,
      title: newPaper.title,
      batch: newPaper.batch || selectedBatch,
      subjectScope: newPaper.subjectScope,
      dateConducted: new Date().toISOString().split('T')[0],
      totalMarks: newPaper.totalMarks,
      questionCount: newPaper.questionCount,
      classAverage: Math.round(newPaper.totalMarks * 0.62),
      highestScore: Math.round(newPaper.totalMarks * 0.94),
      answerKey: newPaper.answerKey,
      pdfUrl: newPaper.pdfUrl,
    };

    setTestPapers((prev) => [created, ...prev]);

    // Update class analytics test count
    setClassAnalytics((prev) => ({
      ...prev,
      totalTestsConducted: prev.totalTestsConducted + 1,
      performanceTrends: [
        ...prev.performanceTrends,
        {
          testNumber: `Test #${prev.performanceTrends.length + 1}`,
          testTitle: newPaper.title,
          classAverage: created.classAverage,
          highestScore: created.highestScore,
          lowestScore: Math.round(created.classAverage * 0.55),
          targetBenchmark: 180,
          date: created.dateConducted,
        },
      ],
    }));
  };

  // Assign Targeted MCQ Remediation Test
  const assignMCQTest = (input: NewAssignmentInput) => {
    const newAssignment: MockAssignment = {
      id: `assign-${Date.now()}`,
      title: input.title,
      description: input.description || `Targeted practice test on ${input.targetTopic}.`,
      subject: input.subject,
      targetTopic: input.targetTopic,
      difficulty: input.difficulty,
      questionCount: input.questionCount,
      assignedBy: currentUser?.name || 'Dr. S. K. Verma',
      assignedToBatch: input.assignedToBatch || selectedBatch,
      assignedToStudentId: input.assignedToStudentId,
      dueDate: input.dueDate,
      status: 'assigned',
      xpReward: input.xpReward || 150,
      estimatedMinutes: Math.round(input.questionCount * 2),
    };

    setAssignedTests((prev) => [newAssignment, ...prev]);
  };

  // Submit OMR Sheet Simulation
  const submitOMR = async (submission: OMRSubmissionInput): Promise<TestDiagnosticResult> => {
    const targetPaper = testPapers.find((p) => p.id === submission.testId) || testPapers[0];
    const totalQ = targetPaper ? targetPaper.questionCount : 30;
    const totalMarks = targetPaper ? targetPaper.totalMarks : 300;

    const breakdown: OMRQuestionEvaluation[] = [];
    let correctCount = 0;
    let incorrectCount = 0;
    let score = 0;

    const subjects = submission.section === 'Full Paper'
      ? (['Physics', 'Chemistry', 'Biology'] as const)
      : [submission.section as 'Physics' | 'Chemistry' | 'Biology'];

    if (submission.geminiResult && submission.geminiResult.answers) {
      // Use real data from Gemini
      score = submission.geminiResult.score;
      submission.geminiResult.answers.forEach((ans: any, idx: number) => {
        const qSubject = subjects[idx % subjects.length];
        if (ans.isCorrect) correctCount++;
        else if (ans.selectedOption) incorrectCount++;

        breakdown.push({
          questionNumber: ans.questionNumber,
          subject: qSubject,
          topic: `${qSubject} Core Concept #${((ans.questionNumber * 3) % 7) + 1}`,
          studentOption: ans.selectedOption as any,
          correctOption: ans.correctOption as any,
          isCorrect: ans.isCorrect,
          status: ans.isCorrect ? 'correct' : (ans.selectedOption ? 'incorrect' : 'skipped'),
          confidence: Number((0.92 + (ans.questionNumber % 8) * 0.01).toFixed(2)),
          aiNote: ans.isCorrect
            ? 'Bubble recognized cleanly with verified answer match.'
            : (ans.selectedOption ? 'Careless or conceptual variance detected.' : 'Unattempted question.'),
          marksObtained: ans.isCorrect ? 4 : (ans.selectedOption ? -1 : 0),
        });
      });
    } else {
      // Fallback mock generation if no Gemini result
      for (let i = 1; i <= totalQ; i++) {
        const qSubject = subjects[(i - 1) % subjects.length];
        const correctOpt = targetPaper?.answerKey[i] || (['A', 'B', 'C', 'D'][i % 4] as 'A' | 'B' | 'C' | 'D');
        
        const isCorrect = i % 4 !== 0;
        const studentOpt = isCorrect
          ? correctOpt
          : (['A', 'B', 'C', 'D'].find((o) => o !== correctOpt) as 'A' | 'B' | 'C' | 'D');

        if (isCorrect) {
          correctCount++;
          score += 4;
        } else {
          incorrectCount++;
          score -= 1;
        }

        breakdown.push({
          questionNumber: i,
          subject: qSubject,
          topic: `${qSubject} Core Concept #${((i * 3) % 7) + 1}`,
          studentOption: studentOpt,
          correctOption: correctOpt,
          isCorrect,
          status: isCorrect ? 'correct' : 'incorrect',
          confidence: Number((0.92 + (i % 8) * 0.01).toFixed(2)),
          aiNote: isCorrect
            ? 'Bubble recognized cleanly with verified answer match.'
            : 'Careless or conceptual variance detected in selected option.',
          marksObtained: isCorrect ? 4 : -1,
        });
      }
    }

    const calculatedScore = Math.max(score, 0);
    const calculatedPercentage = Number(((calculatedScore / totalMarks) * 100).toFixed(1));
    const calculatedAccuracy = Number(((correctCount / Math.max(1, (correctCount + incorrectCount))) * 100).toFixed(1));
    const earnedXp = 150 + Math.round(calculatedAccuracy);

    const diagnosticResult: TestDiagnosticResult = {
      testId: targetPaper?.id || `test-${Date.now()}`,
      testTitle: targetPaper?.title || `${submission.section} Diagnostic Test`,
      section: submission.section,
      submissionDate: new Date().toLocaleString(),
      studentScore: calculatedScore,
      totalMarks,
      percentage: calculatedPercentage,
      accuracy: calculatedAccuracy,
      rank: calculatedScore > 200 ? 3 : 5,
      physicsScore: Math.round(calculatedScore * 0.35),
      chemistryScore: Math.round(calculatedScore * 0.33),
      biologyScore: Math.round(calculatedScore * 0.32),
      earnedXp,
      feedbackSummary: `OMR Sheet evaluated successfully with ${calculatedAccuracy}% accuracy. ${correctCount} correct, ${incorrectCount} incorrect.`,
      weakGaps: [
        {
          id: `gap-${Date.now()}-1`,
          topic: `${submission.section === 'Full Paper' ? 'Physics' : submission.section} Dynamic Problem Solving`,
          subject: submission.section === 'Full Paper' ? 'Physics' : (submission.section as 'Physics' | 'Chemistry' | 'Biology'),
          mistakesCount: incorrectCount,
          insight: 'Analysis revealed sign confusion and time-pressured algebraic shortcuts.',
          recommendedRemediation: 'Complete targeted 10-question practice pack.',
          practiceTopicId: 'topic-rotational-friction',
          priority: 'High',
        },
      ],
      questionBreakdown: breakdown,
    };

    setLatestDiagnostic(diagnosticResult);

    // Award XP and increment test count for active student
    addXp(earnedXp, `Completed OMR Evaluation for ${diagnosticResult.testTitle}`);

    return diagnosticResult;
  };

  // Complete Practice Quiz & Award XP
  const completePracticeQuiz = (topicId: string, score: number, earnedXp: number) => {
    // Update weak topic status to mastered if score >= 80
    if (score >= 80) {
      updateWeakTopicStatus(topicId, 'mastered');
    } else {
      updateWeakTopicStatus(topicId, 'studying');
    }

    addXp(earnedXp, `Completed Practice Quiz on ${topicId}`);
  };

  // Update Weak Topic Status
  const updateWeakTopicStatus = (topicId: string, status: WeakTopicItem['status']) => {
    setWeakTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, status } : t))
    );
  };

  // Add XP Points and update Leaderboard
  const addXp = (amount: number, _reason?: string) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updatedXp = (prev.xp || 0) + amount;
      return {
        ...prev,
        xp: updatedXp,
      };
    });

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === (currentUser?.id || 's-01')) {
          return {
            ...s,
            xp: s.xp + amount,
          };
        }
        return s;
      })
    );

    setLeaderboard((prev) => {
      const studentId = currentUser?.id || 's-01';
      const updated = prev.map((entry) => {
        if (entry.studentId === studentId || entry.isCurrentStudent) {
          return {
            ...entry,
            totalXp: entry.totalXp + amount,
          };
        }
        return entry;
      });

      // Sort by totalXp descending and assign ranks
      return updated
        .sort((a, b) => b.totalXp - a.totalXp)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));
    });
  };

  // Reset store to initial defaults
  const resetToDefaults = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_batch`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_students`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_analytics`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_papers`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_assignments`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_weak_topics`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_leaderboard`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_diagnostic`);

    setCurrentUser(null);
    setSelectedBatchState(BATCH_LIST[0]);
    setStudents(MOCK_STUDENTS);
    setClassAnalytics(MOCK_CLASS_ANALYTICS);
    setTestPapers(MOCK_TEST_PAPERS);
    setAssignedTests(MOCK_ASSIGNMENTS);
    setWeakTopics(MOCK_WEAK_TOPICS);
    setLeaderboard(MOCK_LEADERBOARD);
    setLatestDiagnostic(INITIAL_DIAGNOSTIC_RESULT);
  };

  const value: LearningStoreContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    batches: BATCH_LIST,
    selectedBatch,
    activeBatch: selectedBatch,
    students,
    classAnalytics,
    testPapers,
    assignedTests,
    weakTopics,
    leaderboard,
    latestDiagnostic,

    loginAs,
    loginWithCredentials,
    logout,
    setSelectedBatch,
    setActiveBatch: setSelectedBatch,
    uploadTestPaper,
    assignMCQTest,
    submitOMR,
    completePracticeQuiz,
    updateWeakTopicStatus,
    addXp,
    resetToDefaults,
  };

  return (
    <LearningStoreContext.Provider value={value}>
      {children}
    </LearningStoreContext.Provider>
  );
};

export const useLearningStore = (): LearningStoreContextType => {
  const context = useContext(LearningStoreContext);
  if (!context) {
    throw new Error('useLearningStore must be used within a LearningStoreProvider');
  }
  return context;
};

