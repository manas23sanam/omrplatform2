import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/auth';
import { StudentRecord, LeaderboardEntry } from '../types/student';
import { 
  ClassAnalyticsData, 
  TestPaper, 
  MockAssignment, 
  WeakTopicItem, 
  TestDiagnosticResult,
  NewTestPaperInput,
  NewAssignmentInput,
  OMRSubmissionInput
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
  MOCK_LATEST_DIAGNOSTIC
} from '../data/mockData';

const STORAGE_KEY = 'ai_learning_platform_store_v1';

interface LearningStoreState {
  currentUser: User | null;
  selectedBatch: string;
  students: StudentRecord[];
  classAnalytics: ClassAnalyticsData;
  testPapers: TestPaper[];
  assignedTests: MockAssignment[];
  weakTopics: WeakTopicItem[];
  leaderboard: LeaderboardEntry[];
  latestDiagnostic: TestDiagnosticResult | null;
}

interface LearningStoreContextType extends LearningStoreState {
  isAuthenticated: boolean;
  loginAs: (role: UserRole, studentId?: string) => void;
  logout: () => void;
  setSelectedBatch: (batch: string) => void;
  uploadTestPaper: (paper: NewTestPaperInput) => void;
  assignMCQTest: (assignment: NewAssignmentInput) => void;
  submitOMR: (submission: OMRSubmissionInput) => Promise<TestDiagnosticResult>;
  completePracticeQuiz: (topicId: string, score: number, earnedXp: number) => void;
  updateWeakTopicStatus: (topicId: string, status: WeakTopicItem['status']) => void;
  resetToDefaults: () => void;
}

const LearningStoreContext = createContext<LearningStoreContextType | undefined>(undefined);

function getInitialState(): LearningStoreState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        currentUser: parsed.currentUser || null,
        selectedBatch: parsed.selectedBatch || BATCH_LIST[0],
        students: parsed.students || MOCK_STUDENTS,
        classAnalytics: parsed.classAnalytics || MOCK_CLASS_ANALYTICS,
        testPapers: parsed.testPapers || MOCK_TEST_PAPERS,
        assignedTests: parsed.assignedTests || MOCK_ASSIGNMENTS,
        weakTopics: parsed.weakTopics || MOCK_WEAK_TOPICS,
        leaderboard: parsed.leaderboard || MOCK_LEADERBOARD,
        latestDiagnostic: parsed.latestDiagnostic || MOCK_LATEST_DIAGNOSTIC,
      };
    }
  } catch (err) {
    console.warn('Could not parse saved LearningStoreState from localStorage:', err);
  }

  return {
    currentUser: null,
    selectedBatch: BATCH_LIST[0],
    students: MOCK_STUDENTS,
    classAnalytics: MOCK_CLASS_ANALYTICS,
    testPapers: MOCK_TEST_PAPERS,
    assignedTests: MOCK_ASSIGNMENTS,
    weakTopics: MOCK_WEAK_TOPICS,
    leaderboard: MOCK_LEADERBOARD,
    latestDiagnostic: MOCK_LATEST_DIAGNOSTIC,
  };
}

export const LearningStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LearningStoreState>(getInitialState);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to persist store state to localStorage:', err);
    }
  }, [state]);

  const loginAs = (role: UserRole, studentId?: string) => {
    if (role === 'teacher') {
      setState(prev => ({
        ...prev,
        currentUser: DEMO_TEACHER_USER,
      }));
    } else {
      const student = state.students.find(s => s.id === (studentId || 's-01')) || MOCK_STUDENTS[0];
      const studentUser: User = {
        id: student.id,
        role: 'student',
        name: student.name,
        email: student.email,
        avatarUrl: student.avatarUrl,
        batch: student.batch,
        grade: student.grade,
        xp: student.xp,
        streak: student.streak,
      };
      setState(prev => ({
        ...prev,
        currentUser: studentUser,
      }));
    }
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      currentUser: null,
    }));
  };

  const setSelectedBatch = (batch: string) => {
    setState(prev => ({
      ...prev,
      selectedBatch: batch,
    }));
  };

  const uploadTestPaper = (newPaper: NewTestPaperInput) => {
    const id = `t-${Date.now()}`;
    const paper: TestPaper = {
      ...newPaper,
      id,
      dateConducted: new Date().toISOString().split('T')[0],
      classAverage: 70.0,
      highestScore: newPaper.totalMarks * 0.95,
    };

    setState(prev => ({
      ...prev,
      testPapers: [paper, ...prev.testPapers],
      classAnalytics: {
        ...prev.classAnalytics,
        totalTestsConducted: prev.classAnalytics.totalTestsConducted + 1,
        performanceTrends: [
          ...prev.classAnalytics.performanceTrends,
          {
            testNumber: paper.testNumber,
            testTitle: paper.title,
            classAverage: 70.0,
            highestScore: paper.highestScore,
            lowestScore: 40.0,
            targetBenchmark: 75.0,
          },
        ],
      },
    }));
  };

  const assignMCQTest = (newAssignment: NewAssignmentInput) => {
    const id = `asg-${Date.now()}`;
    const assignment: MockAssignment = {
      ...newAssignment,
      id,
      assignedBy: state.currentUser?.name || 'Dr. Vikram Malhotra',
      status: 'assigned',
    };

    setState(prev => ({
      ...prev,
      assignedTests: [assignment, ...prev.assignedTests],
    }));
  };

  const submitOMR = async (submission: OMRSubmissionInput): Promise<TestDiagnosticResult> => {
    // Simulate real OMR scanning delay
    await new Promise(res => setTimeout(res, 2000));

    const result: TestDiagnosticResult = {
      ...MOCK_LATEST_DIAGNOSTIC,
      testId: submission.testId || `t-${Date.now()}`,
      section: submission.section,
      submissionDate: new Date().toISOString(),
      studentScore: submission.section === 'Full Paper' ? 120 : 38,
      totalMarks: submission.section === 'Full Paper' ? 160 : 40,
      percentage: submission.section === 'Full Paper' ? 75.0 : 95.0,
    };

    // Update student state (earn XP + increment streak)
    setState(prev => {
      const studentId = submission.studentId || prev.currentUser?.id || 's-01';
      const updatedStudents = prev.students.map(s => {
        if (s.id === studentId) {
          const newXp = s.xp + 150;
          return {
            ...s,
            xp: newXp,
            totalTests: s.totalTests + 1,
          };
        }
        return s;
      });

      const updatedCurrentUser = prev.currentUser && prev.currentUser.id === studentId
        ? { ...prev.currentUser, xp: prev.currentUser.xp + 150 }
        : prev.currentUser;

      const updatedLeaderboard = prev.leaderboard.map(entry => {
        if (entry.studentId === studentId) {
          return { ...entry, totalXp: entry.totalXp + 150, score: entry.score + 50 };
        }
        return entry;
      });

      return {
        ...prev,
        latestDiagnostic: result,
        students: updatedStudents,
        currentUser: updatedCurrentUser,
        leaderboard: updatedLeaderboard,
      };
    });

    return result;
  };

  const completePracticeQuiz = (topicId: string, _score: number, earnedXp: number) => {
    setState(prev => {
      // Update weak topics
      const updatedTopics = prev.weakTopics.map(t => {
        if (t.id === topicId) {
          return { ...t, status: 'mastered' as const };
        }
        return t;
      });

      // Update student XP
      const studentId = prev.currentUser?.id || 's-01';
      const updatedStudents = prev.students.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            xp: s.xp + earnedXp,
          };
        }
        return s;
      });

      const updatedCurrentUser = prev.currentUser
        ? { ...prev.currentUser, xp: prev.currentUser.xp + earnedXp }
        : prev.currentUser;

      const updatedLeaderboard = prev.leaderboard.map(entry => {
        if (entry.studentId === studentId) {
          return { ...entry, totalXp: entry.totalXp + earnedXp };
        }
        return entry;
      });

      return {
        ...prev,
        weakTopics: updatedTopics,
        students: updatedStudents,
        currentUser: updatedCurrentUser,
        leaderboard: updatedLeaderboard,
      };
    });
  };

  const updateWeakTopicStatus = (topicId: string, status: WeakTopicItem['status']) => {
    setState(prev => ({
      ...prev,
      weakTopics: prev.weakTopics.map(t => (t.id === topicId ? { ...t, status } : t)),
    }));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      currentUser: null,
      selectedBatch: BATCH_LIST[0],
      students: MOCK_STUDENTS,
      classAnalytics: MOCK_CLASS_ANALYTICS,
      testPapers: MOCK_TEST_PAPERS,
      assignedTests: MOCK_ASSIGNMENTS,
      weakTopics: MOCK_WEAK_TOPICS,
      leaderboard: MOCK_LEADERBOARD,
      latestDiagnostic: MOCK_LATEST_DIAGNOSTIC,
    });
  };

  return (
    <LearningStoreContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.currentUser,
        loginAs,
        logout,
        setSelectedBatch,
        uploadTestPaper,
        assignMCQTest,
        submitOMR,
        completePracticeQuiz,
        updateWeakTopicStatus,
        resetToDefaults,
      }}
    >
      {children}
    </LearningStoreContext.Provider>
  );
};

export const useLearningStore = () => {
  const context = useContext(LearningStoreContext);
  if (!context) {
    throw new Error('useLearningStore must be used within a LearningStoreProvider');
  }
  return context;
};
