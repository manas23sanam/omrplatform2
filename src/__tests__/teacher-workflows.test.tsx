import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LearningStoreProvider, useLearningStore } from '../context/LearningStoreContext';
import { RoleGuard } from '../components/common/RoleGuard';
import { TeacherDashboard } from '../pages/teacher/TeacherDashboard';
import { StudentDeepDive } from '../pages/teacher/StudentDeepDive';
import { TestManagement } from '../pages/teacher/TestManagement';
import { TeacherLayout } from '../layouts/TeacherLayout';
import { ClassPerformanceChart } from '../components/teacher/ClassPerformanceChart';
import { SubjectMasteryChart } from '../components/teacher/SubjectMasteryChart';
import { ClassKPICards } from '../components/teacher/ClassKPICards';
import { FrequentlyMissedQuestionsTable } from '../components/teacher/FrequentlyMissedQuestionsTable';
import type { ClassAnalyticsData, MissedQuestionStat, ClassPerformanceTrendPoint } from '../types/test';

describe('Teacher Portal Adversarial & Edge Case Verification Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  /* ====================================================================== */
  /* Section 1: Teacher Login & Role Protection Boundaries                  */
  /* ====================================================================== */
  describe('1. Teacher Login & Role Protection', () => {
    const FullAuthTestSetup: React.FC<{ initialRole?: 'teacher' | 'student' }> = ({ initialRole }) => {
      const { loginAs, logout } = useLearningStore();

      React.useEffect(() => {
        if (initialRole) {
          loginAs(initialRole);
        }
      }, [initialRole, loginAs]);

      return (
        <Routes>
          <Route path="/login" element={<div data-testid="login-screen">Login Gateway Screen</div>} />
          <Route path="/student/dashboard" element={<div data-testid="student-dashboard">Student Dashboard</div>} />
          <Route
            path="/teacher"
            element={
              <RoleGuard allowedRoles={['teacher']}>
                <TeacherLayout onSignOut={logout} onSwitchRole={(r) => loginAs(r)} />
              </RoleGuard>
            }
          >
            <Route index element={<div data-testid="teacher-dashboard">Teacher Analytics Dashboard</div>} />
            <Route path="students" element={<div data-testid="teacher-students">Student Deep Dive View</div>} />
            <Route path="tests" element={<div data-testid="teacher-tests">Test Management View</div>} />
          </Route>
        </Routes>
      );
    };

    it('blocks unauthenticated access to /teacher and redirects to /login', () => {
      render(
        <MemoryRouter initialEntries={['/teacher']}>
          <LearningStoreProvider>
            <FullAuthTestSetup />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('login-screen')).toBeInTheDocument();
      expect(screen.queryByTestId('teacher-dashboard')).not.toBeInTheDocument();
    });

    it('blocks student role from accessing /teacher and bounces them to /student/dashboard', () => {
      render(
        <MemoryRouter initialEntries={['/teacher']}>
          <LearningStoreProvider>
            <FullAuthTestSetup initialRole="student" />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('student-dashboard')).toBeInTheDocument();
      expect(screen.queryByTestId('teacher-dashboard')).not.toBeInTheDocument();
    });

    it('allows teacher access to /teacher, rendering TeacherLayout with navigation', () => {
      render(
        <MemoryRouter initialEntries={['/teacher']}>
          <LearningStoreProvider>
            <FullAuthTestSetup initialRole="teacher" />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('teacher-dashboard')).toBeInTheDocument();
      expect(screen.getByText('Class Analytics')).toBeInTheDocument();
      expect(screen.getByText('Student Deep Dive')).toBeInTheDocument();
      expect(screen.getByText('Test Management')).toBeInTheDocument();
    });

    it('handles teacher switching to student role via layout trigger', () => {
      render(
        <MemoryRouter initialEntries={['/teacher']}>
          <LearningStoreProvider>
            <FullAuthTestSetup initialRole="teacher" />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      const switchButtons = screen.getAllByRole('button', { name: /switch to student|student view/i });
      expect(switchButtons.length).toBeGreaterThan(0);
      fireEvent.click(switchButtons[0]);
    });

    it('handles teacher logout, clearing session and redirecting to /login', () => {
      render(
        <MemoryRouter initialEntries={['/teacher']}>
          <LearningStoreProvider>
            <FullAuthTestSetup initialRole="teacher" />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      const signOutButtons = screen.getAllByRole('button', { name: /sign out/i });
      expect(signOutButtons.length).toBeGreaterThan(0);
      fireEvent.click(signOutButtons[0]);
      expect(screen.getByTestId('login-screen')).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /* Section 2: Class Analytics Calculations & Chart Edge Cases             */
  /* ====================================================================== */
  describe('2. Class Analytics Calculations & Chart Edge Cases', () => {
    it('handles empty performance trends and zero tests conducted without crashing', () => {
      const emptyAnalytics: ClassAnalyticsData = {
        totalTestsConducted: 0,
        classAverageScore: 0,
        classAverageMarks: 0,
        averageAccuracy: 0,
        activeStudentCount: 0,
        subjectAverages: {
          physics: 0,
          chemistry: 0,
          biology: 0,
        },
        performanceTrends: [],
        frequentlyMissedQuestions: [],
      };

      render(
        <MemoryRouter>
          <ClassKPICards analytics={emptyAnalytics} students={[]} />
          <ClassPerformanceChart data={emptyAnalytics.performanceTrends} />
          <SubjectMasteryChart subjectAverages={emptyAnalytics.subjectAverages} />
          <FrequentlyMissedQuestionsTable questions={emptyAnalytics.frequentlyMissedQuestions} onAssignRemediation={() => {}} />
        </MemoryRouter>
      );

      // Verify KPI defaults and 0 renders
      expect(screen.getByText('Tests Conducted')).toBeInTheDocument();
      expect(screen.getByText('Avg Accuracy')).toBeInTheDocument();
      expect(screen.getByText('No missed questions matching the selected filter criteria.')).toBeInTheDocument();
    });

    it('handles perfect score edge case (100% accuracy, 300 marks)', () => {
      const perfectTrends: ClassPerformanceTrendPoint[] = [
        {
          testNumber: 'Test #1',
          testTitle: 'Perfect Mock 1',
          classAverage: 300,
          highestScore: 300,
          lowestScore: 300,
          targetBenchmark: 180,
          date: '2026-08-01',
        },
      ];

      render(
        <MemoryRouter>
          <ClassPerformanceChart data={perfectTrends} />
        </MemoryRouter>
      );

      // Toggle percentage view mode
      const percentageBtn = screen.getByRole('button', { name: /percentage/i });
      fireEvent.click(percentageBtn);

      const marksBtn = screen.getByRole('button', { name: /marks/i });
      fireEvent.click(marksBtn);

      // Toggle top score line
      const topScoreBtn = screen.getByRole('button', { name: /top score/i });
      fireEvent.click(topScoreBtn);
      fireEvent.click(topScoreBtn);
    });

    it('filters frequently missed questions by subject and search query', () => {
      const mockQuestions: MissedQuestionStat[] = [
        {
          questionNumber: 14,
          testTitle: 'Grand Mock #4',
          subject: 'Physics',
          topic: 'Rotational Incline Torque',
          correctOption: 'C',
          missedPercentage: 72.5,
          commonWrongOption: 'B',
          rootCauseDiagnosis: 'Torque direction sign error',
        },
        {
          questionNumber: 23,
          testTitle: 'Grand Mock #4',
          subject: 'Chemistry',
          topic: 'Le Chatelier Inert Gas',
          correctOption: 'D',
          missedPercentage: 64.0,
          commonWrongOption: 'A',
          rootCauseDiagnosis: 'Constant volume vs constant pressure confusion',
        },
      ];

      const onAssign = vi.fn();
      render(
        <MemoryRouter>
          <FrequentlyMissedQuestionsTable questions={mockQuestions} onAssignRemediation={onAssign} />
        </MemoryRouter>
      );

      // Initially both visible
      expect(screen.getByText('Rotational Incline Torque')).toBeInTheDocument();
      expect(screen.getByText('Le Chatelier Inert Gas')).toBeInTheDocument();

      // Filter by Chemistry
      const chemFilterBtn = screen.getByRole('button', { name: 'Chemistry' });
      fireEvent.click(chemFilterBtn);
      expect(screen.queryByText('Rotational Incline Torque')).not.toBeInTheDocument();
      expect(screen.getByText('Le Chatelier Inert Gas')).toBeInTheDocument();

      // Search matching
      const searchInput = screen.getByPlaceholderText(/search topic or diagnostic/i);
      fireEvent.change(searchInput, { target: { value: 'Inert Gas' } });
      expect(screen.getByText('Le Chatelier Inert Gas')).toBeInTheDocument();

      // Search non-existent
      fireEvent.change(searchInput, { target: { value: 'NonExistentXYZ' } });
      expect(screen.getByText('No missed questions matching the selected filter criteria.')).toBeInTheDocument();

      // Reset search and test assign drill click
      fireEvent.change(searchInput, { target: { value: '' } });
      const allFilterBtn = screen.getByRole('button', { name: 'All' });
      fireEvent.click(allFilterBtn);

      const assignButtons = screen.getAllByRole('button', { name: /assign drill/i });
      fireEvent.click(assignButtons[0]);
      expect(onAssign).toHaveBeenCalledWith(mockQuestions[0]);
    });

    it('renders full TeacherDashboard with interactive drill assignment modal flow', () => {
      render(
        <MemoryRouter>
          <LearningStoreProvider>
            <TeacherDashboard />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Class Diagnostic Overview')).toBeInTheDocument();

      // Click assign drill on table
      const assignButtons = screen.getAllByRole('button', { name: /assign drill/i });
      expect(assignButtons.length).toBeGreaterThan(0);
      fireEvent.click(assignButtons[0]);

      // Verify modal is open
      expect(screen.getByText('Assign Targeted Remediation')).toBeInTheDocument();

      // Submit drill dispatch
      const dispatchBtn = screen.getByRole('button', { name: /dispatch drill/i });
      fireEvent.click(dispatchBtn);

      // Verify success notification appeared
      expect(screen.getByText(/assigned to/i)).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /* Section 3: Student Roster Filtering, Search & Trajectory Deep Dive     */
  /* ====================================================================== */
  describe('3. Student Roster Filtering & Search Matching', () => {
    it('filters roster by search query across name, roll number, and email', () => {
      render(
        <MemoryRouter initialEntries={['/teacher/students']}>
          <LearningStoreProvider>
            <StudentDeepDive />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(/search name, roll#, email/i);

      // Search by Name
      fireEvent.change(searchInput, { target: { value: 'Ananya' } });
      expect(screen.getByText('Ananya Verma')).toBeInTheDocument();

      // Search by Roll Number
      fireEvent.change(searchInput, { target: { value: 'BA-2026-0842' } });
      expect(screen.getByText('Rohan Sharma')).toBeInTheDocument();

      // Search by Email
      fireEvent.change(searchInput, { target: { value: 'priya' } });
      expect(screen.getByText('Priya Patel')).toBeInTheDocument();

      // Search with non-matching query
      fireEvent.change(searchInput, { target: { value: 'NonExistentPerson12345' } });
      expect(screen.getByText('No students matched')).toBeInTheDocument();
    });

    it('filters roster by quartiles: all, q1 (>80%), q2 (67-80%), q4 (<67%)', () => {
      render(
        <MemoryRouter initialEntries={['/teacher/students']}>
          <LearningStoreProvider>
            <StudentDeepDive />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      // Filter Q1 (Top 80%+)
      const q1Btn = screen.getByRole('button', { name: /top 80%\+/i });
      fireEvent.click(q1Btn);

      // Filter Q2 (67-80%)
      const q2Btn = screen.getByRole('button', { name: /67-80%/i });
      fireEvent.click(q2Btn);

      // Filter Q4 (Remediation <67%)
      const q4Btn = screen.getByRole('button', { name: /remediation \(<67%\)/i });
      fireEvent.click(q4Btn);

      // Reset to All
      const allBtn = screen.getByRole('button', { name: /all \(/i });
      fireEvent.click(allBtn);
    });

    it('selects student from roster, renders deep-dive metrics, and toggles trajectory chart subject', () => {
      render(
        <MemoryRouter initialEntries={['/teacher/students']}>
          <LearningStoreProvider>
            <StudentDeepDive />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      // Verify active student profile elements
      expect(screen.getByText('Student Diagnostics Engine')).toBeInTheDocument();
      expect(screen.getByText('Average Score')).toBeInTheDocument();
      expect(screen.getByText('Test Accuracy')).toBeInTheDocument();
      expect(screen.getByText('Historical Score Trajectory vs Class Benchmark')).toBeInTheDocument();

      // Toggle subject trajectories
      const physicsBtn = screen.getByRole('button', { name: 'Physics' });
      fireEvent.click(physicsBtn);

      const chemBtn = screen.getByRole('button', { name: 'Chemistry' });
      fireEvent.click(chemBtn);

      const totalBtn = screen.getByRole('button', { name: /total \(300m\)/i });
      fireEvent.click(totalBtn);
    });

    it('filters student mistake logs and executes 1-click drill dispatch state transition', () => {
      render(
        <MemoryRouter initialEntries={['/teacher/students']}>
          <LearningStoreProvider>
            <StudentDeepDive />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Diagnosed Mistakes & Remediation Log')).toBeInTheDocument();

      // Verify student picked vs correct option badges
      expect(screen.getAllByText(/Student Picked:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Correct Answer:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/AI Root Cause Diagnosis:/i).length).toBeGreaterThan(0);

      // Click "1-Click Assign Drill" on mistake card
      const assignDrillButtons = screen.getAllByRole('button', { name: /1-click assign drill/i });
      expect(assignDrillButtons.length).toBeGreaterThan(0);
      fireEvent.click(assignDrillButtons[0]);

      // Verify modal is open
      expect(screen.getByText(/Assign Targeted Drill to/i)).toBeInTheDocument();

      // Dispatch drill
      const dispatchBtn = screen.getByRole('button', { name: /dispatch to student/i });
      fireEvent.click(dispatchBtn);

      // Verify success notification
      expect(screen.getByText(/Targeted MCQ drill dispatched to/i)).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /* Section 4: Test Paper Creation & Answer Key Grid State Management      */
  /* ====================================================================== */
  describe('4. Test Paper Creation & Answer Key Grid', () => {
    it('renders conducted test papers catalog and assigned drills', () => {
      render(
        <MemoryRouter>
          <LearningStoreProvider>
            <TestManagement />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Test Paper & MCQ Assignment Management')).toBeInTheDocument();
      expect(screen.getByText(/Conducted Test Papers/i)).toBeInTheDocument();
      expect(screen.getByText(/Assigned Drills/i)).toBeInTheDocument();
    });

    it('opens upload modal, manipulates question count & interactive answer key grid', () => {
      render(
        <MemoryRouter>
          <LearningStoreProvider>
            <TestManagement />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      const openUploadBtn = screen.getByRole('button', { name: /upload new test paper/i });
      fireEvent.click(openUploadBtn);

      expect(screen.getByText('Upload & Configure Question Paper')).toBeInTheDocument();
      expect(screen.getByText(/Interactive Answer Key Grid/i)).toBeInTheDocument();

      // Adjust Question Count
      const countInput = screen.getByDisplayValue('30');
      fireEvent.change(countInput, { target: { value: '10' } });

      // Test Bulk Tools: Alternating, Random, All A
      const altBtn = screen.getByRole('button', { name: /alternating \(abcd\)/i });
      fireEvent.click(altBtn);

      const randBtn = screen.getByRole('button', { name: /random/i });
      fireEvent.click(randBtn);

      const allABtn = screen.getByRole('button', { name: /all a/i });
      fireEvent.click(allABtn);

      // Select specific bubble (e.g. Q1 option C)
      const optCButtons = screen.getAllByRole('button', { name: 'C' });
      fireEvent.click(optCButtons[0]);

      // Fill title and publish
      const titleInput = screen.getByPlaceholderText(/e\.g\. neet advanced full mock test #5/i);
      fireEvent.change(titleInput, { target: { value: 'NEET 2026 Thermodynamics Mastery Mock' } });

      const publishBtn = screen.getByRole('button', { name: /publish paper & answer key/i });
      fireEvent.click(publishBtn);

      // Verify paper published in list and success message shown
      expect(screen.getByText(/configured & published with 10 MCQs/i)).toBeInTheDocument();
      expect(screen.getByText('NEET 2026 Thermodynamics Mastery Mock')).toBeInTheDocument();
    });

    it('views answer key grid for existing conducted test paper', () => {
      render(
        <MemoryRouter>
          <LearningStoreProvider>
            <TestManagement />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      const viewKeyButtons = screen.getAllByRole('button', { name: /view answer key grid/i });
      expect(viewKeyButtons.length).toBeGreaterThan(0);
      fireEvent.click(viewKeyButtons[0]);

      expect(screen.getByRole('button', { name: /close key/i })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /close key/i }));
    });

    it('creates targeted MCQ assignment from TestManagement page', () => {
      render(
        <MemoryRouter>
          <LearningStoreProvider>
            <TestManagement />
          </LearningStoreProvider>
        </MemoryRouter>
      );

      const assignDrillBtn = screen.getByRole('button', { name: /assign mcq drill/i });
      fireEvent.click(assignDrillBtn);

      expect(screen.getByText('Assign Targeted MCQ Remediation Drill')).toBeInTheDocument();

      // Select Individual Student target
      const studentTargetBtn = screen.getByRole('button', { name: /individual student/i });
      fireEvent.click(studentTargetBtn);

      // Fill title
      const titleInput = screen.getByPlaceholderText(/e\.g\. rotational torque sign remediation pack/i);
      fireEvent.change(titleInput, { target: { value: 'Optics Ray Diagram Drill' } });

      // Click Quick Pick suggestion
      const quickPickBtn = screen.getByRole('button', { name: /rolling on incline & friction/i });
      fireEvent.click(quickPickBtn);

      // Submit assignment
      const dispatchBtn = screen.getByRole('button', { name: /dispatch drill/i });
      fireEvent.click(dispatchBtn);

      expect(screen.getByText(/dispatched to/i)).toBeInTheDocument();
      expect(screen.getByText('Optics Ray Diagram Drill')).toBeInTheDocument();
    });
  });
});
