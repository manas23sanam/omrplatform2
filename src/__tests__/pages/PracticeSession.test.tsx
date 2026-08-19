import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PracticeSession } from '../../pages/student/PracticeSession';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('PracticeSession Page (F21 & Mode Handling)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderPracticeSession = (initialUrl = '/student/practice/wt-1') => {
    return render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <LearningStoreProvider>
          <Routes>
            <Route path="/student/practice/:topicId" element={<PracticeSession />} />
            <Route path="/student/mock-tests" element={<div>Mock Tests Page Mock</div>} />
          </Routes>
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  /* ====================================================================== */
  /* 1. Quiz Mode Tests (Default & mode=practice / mode=drill)               */
  /* ====================================================================== */
  describe('Practice / Drill Quiz Mode (R1 & R3)', () => {
    it('renders quiz interface with question text, options, and timer', () => {
      renderPracticeSession('/student/practice/topic-rotational-friction');

      expect(screen.getByText(/Targeted Concept Remediation Drill/i)).toBeInTheDocument();
      expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
      expect(screen.getByText(/A\./i)).toBeInTheDocument();
      expect(screen.getByText(/B\./i)).toBeInTheDocument();
      expect(screen.getByText(/C\./i)).toBeInTheDocument();
      expect(screen.getByText(/D\./i)).toBeInTheDocument();
    });

    it('allows selecting an option and checking the answer with instant feedback', () => {
      renderPracticeSession('/student/practice/wt-1?mode=practice');

      // Select option A
      const optionA = screen.getByText(/A\./i).closest('button');
      expect(optionA).not.toBeNull();
      fireEvent.click(optionA!);

      // Click Check Answer
      const checkBtn = screen.getByRole('button', { name: /check answer/i });
      fireEvent.click(checkBtn);

      // AI Derivation & Step-by-Step Explanation should appear
      expect(screen.getByText(/Step-by-Step AI Solution & Derivation/i)).toBeInTheDocument();
    });

    it('navigates across questions using Next Question button and palette buttons', () => {
      renderPracticeSession('/student/practice/wt-1?mode=practice');

      // Question 1 initial
      expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument();

      const nextBtn = screen.getByRole('button', { name: /next question/i });
      fireEvent.click(nextBtn);

      expect(screen.getByText(/Question 2 of 5/i)).toBeInTheDocument();

      // Click palette button 4
      const paletteBtn4 = screen.getByRole('button', { name: '4' });
      fireEvent.click(paletteBtn4);
      expect(screen.getByText(/Question 4 of 5/i)).toBeInTheDocument();
    });

    it('submits quiz and displays score breakdown and XP earned', () => {
      renderPracticeSession('/student/practice/wt-1?mode=practice');

      // Submit quiz
      const submitBtn = screen.getByRole('button', { name: /(submit|finish) & grade drill|submit/i });
      fireEvent.click(submitBtn);

      // Score summary banner
      expect(screen.getByText(/Drill Completed!/i)).toBeInTheDocument();
      expect(screen.getByText(/Accuracy Score/i)).toBeInTheDocument();
      expect(screen.getByText(/XP Reward Claimed/i)).toBeInTheDocument();
      expect(screen.getByText(/0\/5 correct/i)).toBeInTheDocument();
    });

    it('calculates and reveals final score (e.g. 3/5 correct) when answers are selected', () => {
      renderPracticeSession('/student/practice/wt-1?mode=practice');

      // Question 1: correct answer is A (index 0)
      const optA = screen.getByText(/A\./i).closest('button');
      fireEvent.click(optA!);

      // Next to question 2
      fireEvent.click(screen.getByRole('button', { name: /next question/i }));

      // Question 2: correct answer is B (index 1)
      const optB = screen.getByText(/B\./i).closest('button');
      fireEvent.click(optB!);

      // Next to question 3
      fireEvent.click(screen.getByRole('button', { name: /next question/i }));

      // Question 3: correct answer is A (index 0)
      const optA3 = screen.getByText(/A\./i).closest('button');
      fireEvent.click(optA3!);

      // Submit quiz
      const submitBtn = screen.getByRole('button', { name: /(submit|finish) & grade drill|submit/i });
      fireEvent.click(submitBtn);

      // Verify score display includes correct count out of 5
      expect(screen.getByText(/3\/5 correct/i)).toBeInTheDocument();
      expect(screen.getByText(/Accuracy Score: 60%/i)).toBeInTheDocument();
    });

    it('supports drill mode (mode=drill) identically to practice mode', () => {
      renderPracticeSession('/student/practice/wt-1?mode=drill');

      expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument();
      expect(screen.getByText(/A\./i)).toBeInTheDocument();
    });

    it('allows retaking practice quiz after submission', () => {
      renderPracticeSession('/student/practice/wt-1?mode=practice');

      const submitBtn = screen.getByRole('button', { name: /(submit|finish) & grade drill|submit/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText(/Accuracy Score:/i)).toBeInTheDocument();

      const retakeBtn = screen.getByRole('button', { name: /retake practice quiz/i });
      fireEvent.click(retakeBtn);

      expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /* 2. Theory Mode Tests (mode=theory for wt-1, wt-2, wt-3)                */
  /* ====================================================================== */
  describe('Theory Mode (R1 & R2)', () => {
    it('displays paragraphs of theory text for wt-1 (Rotational Equilibrium)', () => {
      renderPracticeSession('/student/practice/wt-1?mode=theory');

      expect(screen.getByText('Rotational Equilibrium & Rigid Body Mechanics')).toBeInTheDocument();
      expect(screen.getByText(/Rotational equilibrium is the mechanical condition/i)).toBeInTheDocument();
      expect(screen.getByText(/When a rigid body undergoes rolling motion without slipping/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Mathematical & Physical Formulations/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Takeaways & High-Yield Exam Points/i)).toBeInTheDocument();
    });

    it('displays paragraphs of theory text for wt-2 (Electrophilic Aromatic Substitution)', () => {
      renderPracticeSession('/student/practice/wt-2?mode=theory');

      expect(screen.getByText('Electrophilic Aromatic Substitution (EAS) & Reaction Mechanisms')).toBeInTheDocument();
      expect(screen.getByText(/Electrophilic Aromatic Substitution \(EAS\) represents the central reaction pathway/i)).toBeInTheDocument();
      expect(screen.getByText(/The universal EAS mechanism proceeds through a distinct two-step pathway/i)).toBeInTheDocument();
    });

    it('displays paragraphs of theory text for wt-3 (Human Endocrine System)', () => {
      renderPracticeSession('/student/practice/wt-3?mode=theory');

      expect(screen.getByText('Human Endocrine System: Hormone Regulation & Feedback Mechanics')).toBeInTheDocument();
      expect(screen.getByText(/The human endocrine system constitutes a distributed regulatory network/i)).toBeInTheDocument();
      expect(screen.getByText(/Hormones are categorized biochemically into hydrophilic peptide/i)).toBeInTheDocument();
    });

    it('allows toggling between Theory mode and Interactive Quiz mode via tabs and action button', () => {
      renderPracticeSession('/student/practice/wt-1?mode=theory');

      // Initially in theory mode
      expect(screen.getByText('Rotational Equilibrium & Rigid Body Mechanics')).toBeInTheDocument();

      // Click "Launch Interactive Practice Quiz" button
      const launchBtn = screen.getByRole('button', { name: /launch interactive practice quiz/i });
      fireEvent.click(launchBtn);

      // Should now render question 1
      expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument();

      // Click "Theory & Concepts" tab to toggle back
      const theoryTab = screen.getByRole('button', { name: /theory & concepts/i });
      fireEvent.click(theoryTab);

      // Should render theory view again
      expect(screen.getByText('Rotational Equilibrium & Rigid Body Mechanics')).toBeInTheDocument();
    });
  });
});
