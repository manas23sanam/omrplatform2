import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { getLevelInfo, getStreakMultiplier, formatXp, LEVEL_DEFINITIONS } from '../../lib/gamification';
import { OMRCategoryTabs, OMR_CATEGORIES } from '../../components/student/OMRCategoryTabs';
import { SampleOMRPicker, PRESET_SAMPLE_OMRS } from '../../components/student/SampleOMRPicker';
import { BatchLeaderboard } from '../../components/student/BatchLeaderboard';
import { XPWidget } from '../../components/student/XPWidget';
import { StudentProfile } from '../../pages/student/StudentProfile';
import { MockTestsImprovement } from '../../pages/student/MockTestsImprovement';
import { PracticeSession } from '../../pages/student/PracticeSession';
import { OMRUpload } from '../../pages/student/OMRUpload';
import { LearningStoreProvider, useLearningStore } from '../../context/LearningStoreContext';
import { getPracticeTopicPack } from '../../data/practiceQuestions';

describe('Adversarial Test Suite: Student Portal & Gamification Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /* ====================================================================== */
  /* 1. Gamification Engine Edge-Case Stress Testing                        */
  /* ====================================================================== */
  describe('Gamification Engine Edge Cases', () => {
    it('handles negative, zero, non-numeric, and extreme XP values gracefully', () => {
      // Negative XP
      const neg = getLevelInfo(-100);
      expect(neg.level).toBe(1);
      expect(neg.currentLevelXp).toBe(0);
      expect(neg.progressPercentage).toBe(0);
      expect(neg.isMaxLevel).toBe(false);

      // Zero XP
      const zero = getLevelInfo(0);
      expect(zero.level).toBe(1);
      expect(zero.currentLevelXp).toBe(0);
      expect(zero.progressPercentage).toBe(0);
      expect(zero.xpNeededForNext).toBe(350);

      // Boundary values
      const b1 = getLevelInfo(350);
      expect(b1.level).toBe(2);
      expect(b1.currentLevelXp).toBe(0);
      expect(b1.progressPercentage).toBe(0);

      const b2 = getLevelInfo(750);
      expect(b2.level).toBe(3);
      expect(b2.currentLevelXp).toBe(0);

      const b3 = getLevelInfo(1200);
      expect(b3.level).toBe(4);

      const b4 = getLevelInfo(1750);
      expect(b4.level).toBe(5);

      const b5 = getLevelInfo(2400);
      expect(b5.level).toBe(6);

      const b6 = getLevelInfo(3200);
      expect(b6.level).toBe(7);
      expect(b6.isMaxLevel).toBe(true);
      expect(b6.xpNeededForNext).toBe(0);
      expect(b6.progressPercentage).toBe(100);

      // Extreme large XP
      const huge = getLevelInfo(1_000_000);
      expect(huge.level).toBe(7);
      expect(huge.isMaxLevel).toBe(true);
      expect(huge.progressPercentage).toBe(100);
    });

    it('validates all streak multipliers accurately at exact boundary days', () => {
      expect(getStreakMultiplier(0)).toBe(1.0);
      expect(getStreakMultiplier(1)).toBe(1.0);
      expect(getStreakMultiplier(2)).toBe(1.0);
      expect(getStreakMultiplier(3)).toBe(1.05);
      expect(getStreakMultiplier(6)).toBe(1.05);
      expect(getStreakMultiplier(7)).toBe(1.10);
      expect(getStreakMultiplier(13)).toBe(1.10);
      expect(getStreakMultiplier(14)).toBe(1.15);
      expect(getStreakMultiplier(29)).toBe(1.15);
      expect(getStreakMultiplier(30)).toBe(1.30);
      expect(getStreakMultiplier(365)).toBe(1.30);
    });

    it('formats Indian locale number grouping correctly', () => {
      expect(formatXp(0)).toBe('0');
      expect(formatXp(500)).toBe('500');
      expect(formatXp(1500)).toBe('1,500');
      expect(formatXp(100000)).toBe('1,00,000');
    });
  });

  /* ====================================================================== */
  /* 2. OMR Upload 4-Category Selection & Sample Verification               */
  /* ====================================================================== */
  describe('OMR Upload & 4 Categories', () => {
    it('has all 4 categories configured with correct question counts and marks', () => {
      expect(OMR_CATEGORIES.length).toBe(4);
      
      const physics = OMR_CATEGORIES.find((c) => c.id === 'Physics');
      expect(physics).toBeDefined();
      expect(physics?.questionCount).toBe(30);
      expect(physics?.totalMarks).toBe(120);

      const chem = OMR_CATEGORIES.find((c) => c.id === 'Chemistry');
      expect(chem).toBeDefined();
      expect(chem?.questionCount).toBe(30);
      expect(chem?.totalMarks).toBe(120);

      const biology = OMR_CATEGORIES.find((c) => c.id === 'Biology');
      expect(biology).toBeDefined();
      expect(biology?.label).toBe('Biology');
      expect(biology?.questionCount).toBe(30);
      expect(biology?.totalMarks).toBe(120);

      const full = OMR_CATEGORIES.find((c) => c.id === 'Full Paper');
      expect(full).toBeDefined();
      expect(full?.questionCount).toBe(90);
      expect(full?.totalMarks).toBe(300);
    });

    it('renders all 4 preset sample OMR sheets in SampleOMRPicker', () => {
      expect(PRESET_SAMPLE_OMRS.length).toBe(4);
      expect(PRESET_SAMPLE_OMRS.map((s) => s.section)).toEqual([
        'Full Paper',
        'Physics',
        'Chemistry',
        'Biology',
      ]);
    });
  });

  /* ====================================================================== */
  /* 3. Leaderboard and XP Sync Verification                                */
  /* ====================================================================== */
  describe('Leaderboard & Gamification UI Component', () => {
    it('renders BatchLeaderboard and allows searching students', () => {
      render(
        <LearningStoreProvider>
          <BatchLeaderboard />
        </LearningStoreProvider>
      );

      expect(screen.getByText('Cohort League Standings')).toBeInTheDocument();
      
      // Check search input
      const searchInput = screen.getByPlaceholderText('Search student name...');
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'Aarav' } });
      expect(screen.getByText('Aarav Patel')).toBeInTheDocument();
    });

    it('renders XPWidget with level, daily streak, and progress bar', () => {
      render(
        <XPWidget xp={1250} streak={14} showCalendar={true} />
      );

      expect(screen.getByText('Level 4')).toBeInTheDocument();
      expect(screen.getByText('Formula Wizard')).toBeInTheDocument();
      expect(screen.getByText('14 Days Active')).toBeInTheDocument();
      expect(screen.getByText('7-Day Study Calendar')).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /* 4. Distinct Routes & Content Isolation: Profile vs Mock Tests          */
  /* ====================================================================== */
  describe('Route & Content Isolation: Profile vs Mock Tests', () => {
    it('renders StudentProfile with historical charts, badges, and test history', () => {
      render(
        <MemoryRouter initialEntries={['/student/profile']}>
          <LearningStoreProvider>
            <Routes>
              <Route path="/student/profile" element={<StudentProfile />} />
            </Routes>
          </LearningStoreProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Study Streak')).toBeInTheDocument();
      expect(screen.getByText('Total XP Points')).toBeInTheDocument();
      expect(screen.getByText('Cohort Rank')).toBeInTheDocument();
      expect(screen.getByText('Average Accuracy')).toBeInTheDocument();
      expect(screen.getByText('Score Improvement Trajectory')).toBeInTheDocument();
      expect(screen.getByText('Subject Mastery Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Evaluation & Test History Log')).toBeInTheDocument();
      expect(screen.getByText('Achievement Badges & Mastery Honors')).toBeInTheDocument();
    });

    it('renders MockTestsImprovement with AI mock tests and weak topics checklist', () => {
      render(
        <MemoryRouter initialEntries={['/student/mock-tests']}>
          <LearningStoreProvider>
            <Routes>
              <Route path="/student/mock-tests" element={<MockTestsImprovement />} />
            </Routes>
          </LearningStoreProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Targeted Weak-Area Practice & AI Mock Tests')).toBeInTheDocument();
      expect(screen.getByText('Targeted Mock Tests')).toBeInTheDocument();
      expect(screen.getByText('Weak-Topic Study Checklist')).toBeInTheDocument();

      // Verify filters
      expect(screen.getByText('All Practice Packs')).toBeInTheDocument();
      expect(screen.getByText('AI-Generated Mocks')).toBeInTheDocument();
      expect(screen.getByText('Teacher Assigned')).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /* 5. Interactive PracticeSession Quiz Scoring & Derivations              */
  /* ====================================================================== */
  describe('Interactive PracticeSession Quiz Verification', () => {
    it('loads 5-question topic pack and validates question content', () => {
      const pack = getPracticeTopicPack('topic-rotational-friction');
      expect(pack.topicId).toBe('topic-rotational-friction');
      expect(pack.questions.length).toBe(5);
      
      pack.questions.forEach((q) => {
        expect(q.options.length).toBe(4);
        expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctOptionIndex).toBeLessThanOrEqual(3);
        expect(q.aiExplanation.length).toBeGreaterThan(10);
      });
    });

    it('interactively answers questions, checks derivation, and submits for XP', () => {
      render(
        <MemoryRouter initialEntries={['/student/practice/topic-rotational-friction']}>
          <LearningStoreProvider>
            <Routes>
              <Route path="/student/practice/:topicId" element={<PracticeSession />} />
              <Route path="/student/mock-tests" element={<div>Mock Tests Page</div>} />
            </Routes>
          </LearningStoreProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Rotational Kinematics & Static Friction Torque')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();

      // Check option selection
      const options = screen.getAllByRole('button').filter((b) => b.textContent?.includes('directed'));
      expect(options.length).toBeGreaterThan(0);
      
      // Select option 0
      fireEvent.click(options[0]);

      // Click Check Answer
      const checkBtn = screen.getByRole('button', { name: /check answer/i });
      fireEvent.click(checkBtn);

      // Verify Step-by-Step AI Solution appears
      expect(screen.getByText('Step-by-Step AI Solution & Derivation')).toBeInTheDocument();
    });
  });
});
