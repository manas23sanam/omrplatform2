import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { LearningStoreProvider, useLearningStore } from '../../context/LearningStoreContext';
import { DEMO_TEACHER_USER, DEMO_STUDENT_USER } from '../../data/mockData';

describe('LearningStoreContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LearningStoreProvider>{children}</LearningStoreProvider>
  );

  it('throws error if useLearningStore is used outside LearningStoreProvider', () => {
    expect(() => {
      renderHook(() => useLearningStore());
    }).toThrow('useLearningStore must be used within a LearningStoreProvider');
  });

  it('initializes with default mock data', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });
    expect(result.current.students.length).toBeGreaterThan(0);
    expect(result.current.testPapers.length).toBeGreaterThan(0);
    expect(result.current.assignedTests.length).toBeGreaterThan(0);
    expect(result.current.weakTopics.length).toBeGreaterThan(0);
    expect(result.current.leaderboard.length).toBeGreaterThan(0);
    expect(result.current.classAnalytics.totalTestsConducted).toBeGreaterThan(0);
    expect(result.current.batches.length).toBeGreaterThan(0);
  });

  it('handles loginAs for teacher role', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    act(() => {
      result.current.loginAs('teacher');
    });

    expect(result.current.currentUser).not.toBeNull();
    expect(result.current.currentUser?.role).toBe('teacher');
    expect(result.current.currentUser?.name).toBe(DEMO_TEACHER_USER.name);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles loginAs for student role with default student', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    act(() => {
      result.current.loginAs('student');
    });

    expect(result.current.currentUser).not.toBeNull();
    expect(result.current.currentUser?.role).toBe('student');
    expect(result.current.currentUser?.name).toBe(DEMO_STUDENT_USER.name);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles loginAs for specific student ID', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    act(() => {
      result.current.loginAs('student', 's-02');
    });

    expect(result.current.currentUser).not.toBeNull();
    expect(result.current.currentUser?.id).toBe('s-02');
    expect(result.current.currentUser?.name).toBe('Ananya Verma');
  });

  it('handles loginWithCredentials successfully and validates invalid credentials', async () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    // Empty credentials
    await act(async () => {
      const res = await result.current.loginWithCredentials('', '', 'teacher');
      expect(res.success).toBe(false);
      expect(res.error).toBe('Please provide both email and password.');
    });

    // Short password
    await act(async () => {
      const res = await result.current.loginWithCredentials('test@test.com', '12', 'student');
      expect(res.success).toBe(false);
      expect(res.error).toBe('Password must be at least 4 characters long.');
    });

    // Valid teacher login
    await act(async () => {
      const res = await result.current.loginWithCredentials('faculty@brothers.edu', 'secret123', 'teacher');
      expect(res.success).toBe(true);
    });
    expect(result.current.currentUser?.role).toBe('teacher');
    expect(result.current.currentUser?.email).toBe('faculty@brothers.edu');

    // Valid student login matching existing email
    const studentEmail = result.current.students[0].email;
    await act(async () => {
      const res = await result.current.loginWithCredentials(studentEmail, 'password123', 'student');
      expect(res.success).toBe(true);
    });
    expect(result.current.currentUser?.role).toBe('student');
    expect(result.current.currentUser?.email.toLowerCase()).toBe(studentEmail.toLowerCase());
  });

  it('handles logout properly', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    act(() => {
      result.current.loginAs('teacher');
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.currentUser).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('updates selected batch and active batch', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    act(() => {
      result.current.setSelectedBatch('NEET Adv Super-30');
    });
    expect(result.current.selectedBatch).toBe('NEET Adv Super-30');
    expect(result.current.activeBatch).toBe('NEET Adv Super-30');
  });

  it('uploads new test paper and updates class analytics', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });
    const initialPaperCount = result.current.testPapers.length;
    const initialTotalTests = result.current.classAnalytics.totalTestsConducted;

    act(() => {
      result.current.uploadTestPaper({
        testNumber: 'Test #99',
        title: 'NEET Advanced Thermodynamics Mastery',
        batch: 'NEET Adv Super-30',
        subjectScope: 'Physics',
        totalMarks: 120,
        questionCount: 30,
        answerKey: { 1: 'A', 2: 'B', 3: 'C', 4: 'D' },
      });
    });

    expect(result.current.testPapers.length).toBe(initialPaperCount + 1);
    expect(result.current.testPapers[0].title).toBe('NEET Advanced Thermodynamics Mastery');
    expect(result.current.classAnalytics.totalTestsConducted).toBe(initialTotalTests + 1);
  });

  it('assigns targeted MCQ remediation test', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });
    const initialAssignmentCount = result.current.assignedTests.length;

    act(() => {
      result.current.assignMCQTest({
        title: 'Rotational Motion Quick Drill',
        subject: 'Physics',
        targetTopic: 'Moment of Inertia',
        difficulty: 'Hard',
        questionCount: 10,
        dueDate: '2026-08-20',
        xpReward: 200,
      });
    });

    expect(result.current.assignedTests.length).toBe(initialAssignmentCount + 1);
    expect(result.current.assignedTests[0].title).toBe('Rotational Motion Quick Drill');
    expect(result.current.assignedTests[0].targetTopic).toBe('Moment of Inertia');
  });

  it('submits OMR sheet, generates diagnostic report, and awards XP', async () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    act(() => {
      result.current.loginAs('student');
    });
    const initialXp = result.current.currentUser?.xp || 0;

    let diagnostic: any = null;
    await act(async () => {
      diagnostic = await result.current.submitOMR({
        testId: result.current.testPapers[0].id,
        section: 'Physics',
        imageFile: null,
      });
    });

    expect(diagnostic).not.toBeNull();
    expect(diagnostic.section).toBe('Physics');
    expect(diagnostic.questionBreakdown.length).toBeGreaterThan(0);
    expect(result.current.latestDiagnostic).toEqual(diagnostic);
    expect(result.current.currentUser?.xp).toBeGreaterThan(initialXp);
  });

  it('completes practice quiz and updates weak topic status & XP', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    act(() => {
      result.current.loginAs('student');
    });
    const topicId = result.current.weakTopics[0].id;
    const initialXp = result.current.currentUser?.xp || 0;

    // High score -> marks as mastered
    act(() => {
      result.current.completePracticeQuiz(topicId, 90, 100);
    });

    const updatedTopic = result.current.weakTopics.find((t) => t.id === topicId);
    expect(updatedTopic?.status).toBe('mastered');
    expect(result.current.currentUser?.xp).toBe(initialXp + 100);

    // Lower score -> marks as studying
    act(() => {
      result.current.completePracticeQuiz(topicId, 60, 50);
    });
    const updatedAgain = result.current.weakTopics.find((t) => t.id === topicId);
    expect(updatedAgain?.status).toBe('studying');
  });

  it('adds XP, updates user and student records, and sorts leaderboard', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    act(() => {
      result.current.loginAs('student', 's-01');
    });

    const initialXp = result.current.currentUser?.xp || 0;

    act(() => {
      result.current.addXp(500, 'Test Award');
    });

    expect(result.current.currentUser?.xp).toBe(initialXp + 500);
    const updatedStudent = result.current.students.find((s) => s.id === 's-01');
    expect(updatedStudent?.xp).toBe(initialXp + 500);

    // Verify leaderboard is sorted descending by totalXp
    const ranks = result.current.leaderboard.map((e) => e.rank);
    for (let i = 0; i < ranks.length; i++) {
      expect(ranks[i]).toBe(i + 1);
    }
  });

  it('resets state to defaults', () => {
    const { result } = renderHook(() => useLearningStore(), { wrapper });

    act(() => {
      result.current.loginAs('teacher');
      result.current.setSelectedBatch('NEET Adv Super-30');
    });

    act(() => {
      result.current.resetToDefaults();
    });

    expect(result.current.currentUser).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
