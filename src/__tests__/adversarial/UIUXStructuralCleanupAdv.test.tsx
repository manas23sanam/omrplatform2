import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as fs from 'fs';
import * as path from 'path';

import { Topbar } from '../../components/Topbar';
import { Topbar as LayoutTopbar } from '../../components/layout/Topbar';
import { StudentDashboard } from '../../pages/student/StudentDashboard';
import { QuestionBreakdownTable } from '../../components/student/QuestionBreakdownTable';
import { ConceptGapCard } from '../../components/student/ConceptGapCard';
import { LearningStoreProvider } from '../../context/LearningStoreContext';
import type { OMRQuestionEvaluation, WeakConceptGap } from '../../types/test';

describe('Adversarial Test Suite: UI/UX Structural Cleanup (AC1 - AC4)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /* ====================================================================== */
  /* AC1: Topbar Minimal Header Verification                                */
  /* ====================================================================== */
  describe('AC1: Topbar Header Simplification', () => {
    it('verifies Topbar from both component paths are identical', () => {
      expect(Topbar).toBe(LayoutTopbar);
    });

    it('renders Topbar without XP/Streak pills, subtitles, or role-switching buttons', () => {
      const { container } = render(
        <LearningStoreProvider>
          <Topbar />
        </LearningStoreProvider>
      );

      // Verify Logo and Coaching Name are present
      expect(screen.getByText('BA')).toBeInTheDocument();
      expect(screen.getByText('Brothers Academy')).toBeInTheDocument();

      // Verify User Profile block is present
      expect(screen.getByAltText('User profile')).toBeInTheDocument();

      // Verify Sign Out button is present
      expect(screen.getByTitle('Sign Out')).toBeInTheDocument();

      // Adversarial Check: Ensure NO XP / Streak text or pills exist
      expect(screen.queryByText(/XP/i)).toBeNull();
      expect(screen.queryByText(/Streak/i)).toBeNull();
      expect(screen.queryByText(/Days Active/i)).toBeNull();
      expect(screen.queryByText(/Level/i)).toBeNull();

      // Adversarial Check: Ensure NO role-switching buttons exist
      expect(screen.queryByText(/Switch to Teacher/i)).toBeNull();
      expect(screen.queryByText(/Switch to Student/i)).toBeNull();
      expect(screen.queryByText(/Teacher View/i)).toBeNull();
      expect(screen.queryByText(/Student View/i)).toBeNull();
      expect(screen.queryByText(/Demo/i)).toBeNull();

      // Verify only exactly 1 button exists in Topbar (the Sign Out button)
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(1);
      expect(buttons[0]).toHaveAttribute('title', 'Sign Out');
    });

    it('statically verifies source code of Topbar.tsx for absence of forbidden elements', () => {
      const topbarSrc = fs.readFileSync(
        path.resolve(process.cwd(), 'src/components/Topbar.tsx'),
        'utf-8'
      );

      expect(topbarSrc).not.toMatch(/Zap/);
      expect(topbarSrc).not.toMatch(/Flame/);
      expect(topbarSrc).not.toMatch(/Switch to/i);
      expect(topbarSrc).not.toMatch(/RoleSwitch/i);
      expect(topbarSrc).not.toMatch(/streak/i);
      expect(topbarSrc).not.toMatch(/xp/i);
    });
  });

  /* ====================================================================== */
  /* AC2: StudentDashboard Stat Cards (Zero Lucide Icons)                   */
  /* ====================================================================== */
  describe('AC2: StudentDashboard Stat Cards Icon Elimination', () => {
    it('statically verifies StudentDashboard.tsx does not import Target, TrendingUp, Award, Flame', () => {
      const dashboardSrc = fs.readFileSync(
        path.resolve(process.cwd(), 'src/pages/student/StudentDashboard.tsx'),
        'utf-8'
      );

      // Check imports from lucide-react
      const lucideImportMatch = dashboardSrc.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
      expect(lucideImportMatch).not.toBeNull();
      const importedIcons = lucideImportMatch![1].split(',').map((s) => s.trim());

      expect(importedIcons).not.toContain('Target');
      expect(importedIcons).not.toContain('TrendingUp');
      expect(importedIcons).not.toContain('Award');
      expect(importedIcons).not.toContain('Flame');
    });

    it('renders 4 snapshot cards with strictly zero icons in their card containers', () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/student/dashboard']}>
          <LearningStoreProvider>
            <Routes>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
            </Routes>
          </LearningStoreProvider>
        </MemoryRouter>
      );

      const labels = ['Latest Score', 'Overall Accuracy', 'Cohort Rank', 'Daily Streak'];
      labels.forEach((label) => {
        const labelEl = screen.getByText(label);
        expect(labelEl).toBeInTheDocument();

        // The parent card container
        const cardContainer = labelEl.closest('.bg-slate-50');
        expect(cardContainer).not.toBeNull();

        // Ensure there are ZERO SVG or icon elements inside this snapshot card container
        const svgs = cardContainer!.querySelectorAll('svg');
        expect(svgs.length).toBe(0);
      });
    });
  });

  /* ====================================================================== */
  /* AC3: QuestionBreakdownTable Zero Input/Select & Neutral Row Colors     */
  /* ====================================================================== */
  describe('AC3: QuestionBreakdownTable Filters and Row Colors', () => {
    const mockQuestions: OMRQuestionEvaluation[] = [
      {
        questionNumber: 1,
        subject: 'Physics',
        topic: 'Rotational Dynamics',
        studentOption: 'B',
        correctOption: 'B',
        isCorrect: true,
        marksAwarded: 4,
        aiNote: 'Correctly identified torque direction.',
      },
      {
        questionNumber: 2,
        subject: 'Chemistry',
        topic: 'Thermodynamics',
        studentOption: 'A',
        correctOption: 'C',
        isCorrect: false,
        marksAwarded: -1,
        aiNote: 'Sign error in enthalpy calculation.',
      },
      {
        questionNumber: 3,
        subject: 'Biology',
        topic: 'Genetics',
        studentOption: 'unattempted',
        correctOption: 'D',
        isCorrect: false,
        marksAwarded: 0,
        aiNote: 'Skipped question.',
      },
    ];

    it('statically verifies zero <input> and zero <select> tags in QuestionBreakdownTable.tsx', () => {
      const tableSrc = fs.readFileSync(
        path.resolve(process.cwd(), 'src/components/student/QuestionBreakdownTable.tsx'),
        'utf-8'
      );

      expect(tableSrc).not.toMatch(/<input/i);
      expect(tableSrc).not.toMatch(/<select/i);
      expect(tableSrc).not.toMatch(/bg-red-50/);
      expect(tableSrc).not.toMatch(/bg-green-50/);
      expect(tableSrc).not.toMatch(/bg-rose-50/);
      expect(tableSrc).not.toMatch(/bg-emerald-50/);
    });

    it('renders table with ZERO input and ZERO select DOM elements', () => {
      const { container } = render(<QuestionBreakdownTable questions={mockQuestions} />);

      const inputs = container.querySelectorAll('input');
      const selects = container.querySelectorAll('select');

      expect(inputs.length).toBe(0);
      expect(selects.length).toBe(0);
    });

    it('ensures no full-row background color classes are applied to <tr> rows', () => {
      const { container } = render(<QuestionBreakdownTable questions={mockQuestions} />);

      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBe(3);

      rows.forEach((row) => {
        const classNames = row.className;
        expect(classNames).not.toMatch(/bg-red-/);
        expect(classNames).not.toMatch(/bg-green-/);
        expect(classNames).not.toMatch(/bg-emerald-/);
        expect(classNames).not.toMatch(/bg-rose-/);
        expect(classNames).not.toMatch(/bg-amber-/);
      });
    });

    it('renders empty placeholder row gracefully when questions array is empty', () => {
      render(<QuestionBreakdownTable questions={[]} />);
      expect(screen.getByText('No questions found in this evaluation.')).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /* AC4: ConceptGapCard Single Action Button/Link Constraint               */
  /* ====================================================================== */
  describe('AC4: ConceptGapCard Action Element Constraint', () => {
    const mockGapHigh: WeakConceptGap = {
      id: 'gap-01',
      subject: 'Physics',
      topic: 'Rotational Kinematics & Static Friction Torque',
      mistakesCount: 3,
      priority: 'High',
      insight: 'Frequent sign confusion when applying right-hand rule to torque vectors.',
      practiceTopicId: 'topic-rotational-friction',
    };

    const mockGapMedium: WeakConceptGap = {
      id: 'gap-02',
      subject: 'Chemistry',
      topic: 'Electrochemistry Nernst Equation',
      mistakesCount: 1,
      priority: 'Medium',
      insight: 'Log base 10 vs ln conversion factor omitted during cell potential calculation.',
      practiceTopicId: 'topic-nernst-equation',
    };

    const mockGapLow: WeakConceptGap = {
      id: 'gap-03',
      subject: 'Biology',
      topic: 'Photosystem II Resonance Energy',
      mistakesCount: 1,
      priority: 'Low',
      insight: 'Confusion between P680 and P700 absorption peaks.',
    };

    it('renders EXACTLY ONE action element (<button> or <Link>) for High, Medium, and Low priorities', () => {
      [mockGapHigh, mockGapMedium, mockGapLow].forEach((gap) => {
        const { container } = render(
          <MemoryRouter>
            <ConceptGapCard gap={gap} />
          </MemoryRouter>
        );

        // Find all interactive elements (buttons, links)
        const actionElements = container.querySelectorAll('button, a');
        expect(actionElements.length).toBe(1);

        const actionEl = actionElements[0];
        expect(actionEl.tagName.toLowerCase()).toBe('a');
        expect(actionEl).toHaveTextContent(/Start Practice Drill/i);
        expect(actionEl).toHaveAttribute(
          'href',
          `/student/practice/${gap.practiceTopicId || 'topic-rotational-friction'}`
        );
      });
    });

    it('verifies card background is neutral white without full-card colored tint', () => {
      const { container } = render(
        <MemoryRouter>
          <ConceptGapCard gap={mockGapHigh} />
        </MemoryRouter>
      );

      const cardRoot = container.firstChild as HTMLElement;
      expect(cardRoot.className).toContain('bg-white');
      expect(cardRoot.className).not.toMatch(/bg-rose-50/);
      expect(cardRoot.className).not.toMatch(/bg-red-50/);
      expect(cardRoot.className).not.toMatch(/bg-amber-50/);
    });

    it('statically checks ConceptGapCard.tsx has no second action or drawer toggle', () => {
      const cardSrc = fs.readFileSync(
        path.resolve(process.cwd(), 'src/components/student/ConceptGapCard.tsx'),
        'utf-8'
      );

      // Match all JSX elements <button ...> or <Link ...> or <a ...>
      const linkMatches = cardSrc.match(/<Link\b/g) || [];
      const buttonMatches = cardSrc.match(/<button\b/g) || [];
      const anchorMatches = cardSrc.match(/<a\b/g) || [];

      const totalInteractive = linkMatches.length + buttonMatches.length + anchorMatches.length;
      expect(totalInteractive).toBe(1);
    });
  });
});
