import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileSpreadsheet,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';
import { ClassKPICards } from '../../components/teacher/ClassKPICards';
import { ClassPerformanceChart } from '../../components/teacher/ClassPerformanceChart';
import { SubjectMasteryChart } from '../../components/teacher/SubjectMasteryChart';
import { FrequentlyMissedQuestionsTable } from '../../components/teacher/FrequentlyMissedQuestionsTable';
import { AssignRemediationModal } from '../../components/teacher/AssignRemediationModal';
import type { MissedQuestionStat, NewAssignmentInput } from '../../types/test';

export const TeacherDashboard: React.FC = () => {
  const {
    classAnalytics,
    students,
    selectedBatch,
    assignMCQTest,
  } = useLearningStore();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedQuestionForRemediation, setSelectedQuestionForRemediation] = useState<MissedQuestionStat | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleOpenRemediation = (question: MissedQuestionStat) => {
    setSelectedQuestionForRemediation(question);
    setIsAssignModalOpen(true);
  };

  const handleTopGapRemediate = (concept: string, subject: string) => {
    const found = classAnalytics.frequentlyMissedQuestions.find((q) => q.topic === concept);
    if (found) {
      setSelectedQuestionForRemediation(found);
    } else {
      setSelectedQuestionForRemediation({
        questionNumber: 14,
        testTitle: 'NEET Advanced Grand Mock #4',
        subject: subject as any,
        topic: concept,
        correctOption: 'C',
        missedPercentage: 72.5,
        commonWrongOption: 'B',
        rootCauseDiagnosis: 'Rolling friction torque sign error',
      });
    }
    setIsAssignModalOpen(true);
  };

  const handleDispatchAssignment = (assignment: NewAssignmentInput) => {
    assignMCQTest(assignment);
    setSuccessToast(`Targeted drill "${assignment.title}" assigned to ${selectedBatch}!`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Page Header (Clean, unboxed) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Class Analytics Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Cohort aggregate tracking, historical marks distributions, and mistake pattern diagnosis.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
            {selectedBatch}
          </span>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
            {students.length} Students Active
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-slate-800 text-xs font-bold animate-in fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-slate-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      {/* F05: Class KPI Cards */}
      <ClassKPICards
        analytics={classAnalytics}
        students={students}
      />


      {/* Analytics Visuals: Performance Trend & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* F06: Class Performance Over Time Graph */}
        <div className="lg:col-span-7">
          <ClassPerformanceChart data={classAnalytics.performanceTrends} />
        </div>

        {/* F07: Subject Mastery Comparison Graph */}
        <div className="lg:col-span-5">
          <SubjectMasteryChart subjectAverages={classAnalytics.subjectAverages} />
        </div>
      </div>

      {/* F08: Frequently Missed Questions Table */}
      <FrequentlyMissedQuestionsTable
        questions={classAnalytics.frequentlyMissedQuestions}
        onAssignRemediation={handleOpenRemediation}
      />

      {/* Faculty Quick Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/teacher/students"
          className="p-5 rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 text-white shadow-md flex items-center justify-between group hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-300">
              <Users size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">Student Directory & Mistake Logs</h4>
              <p className="text-xs text-blue-200 mt-0.5">Explore individual score trajectories and logged errors</p>
            </div>
          </div>
          <ArrowUpRight size={20} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/teacher/tests"
          className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-900 text-white shadow-md flex items-center justify-between group hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-slate-300">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">Test Management & Answer Keys</h4>
              <p className="text-xs text-slate-200 mt-0.5">Upload new test papers or compose targeted MCQ packs</p>
            </div>
          </div>
          <ArrowUpRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Assign Remediation Modal */}
      <AssignRemediationModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedQuestionForRemediation(null);
        }}
        onAssign={handleDispatchAssignment}
        initialQuestion={selectedQuestionForRemediation}
        activeBatch={selectedBatch}
      />
    </div>
  );
};
