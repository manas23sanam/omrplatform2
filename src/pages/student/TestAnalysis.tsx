import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';
import { INITIAL_DIAGNOSTIC_RESULT } from '../../data/mockData';
import type { TestDiagnosticResult } from '../../types/test';
import { SubjectBreakdownCards } from '../../components/student/SubjectBreakdownCards';
import { ConceptGapCard } from '../../components/student/ConceptGapCard';
import { QuestionBreakdownTable } from '../../components/student/QuestionBreakdownTable';
import { RecoveryRoadmapWidget } from '../../components/student/RecoveryRoadmapWidget';

export const TestAnalysis: React.FC = () => {
  const { testId } = useParams<{ testId?: string }>();
  const { latestDiagnostic } = useLearningStore();

  const diagnostic: TestDiagnosticResult =
    latestDiagnostic && (latestDiagnostic.testId === testId || !testId || testId === 'latest')
      ? latestDiagnostic
      : INITIAL_DIAGNOSTIC_RESULT;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 font-sans">
      {/* Top Navigation Backlink (No floating action buttons) */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Student Dashboard</span>
        </Link>
      </div>

      {/* Slim Hero Banner (No embedded metric tiles, reduced height) */}
      <div className="bg-slate-900 rounded-2xl p-5 md:p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-500/30 text-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-400/30">
                {diagnostic.section} Scope
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Evaluated: {diagnostic.submissionDate}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              {diagnostic.testTitle}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-3xl">
              {diagnostic.feedbackSummary ||
                'Strong overall performance with notable mastery in Optics and Thermodynamics. Critical focus recommended on Rotational Dynamics torque signs.'}
            </p>
          </div>
          
          <div className="shrink-0 text-left md:text-right mt-2 md:mt-0">
            <div className="inline-flex flex-col items-start md:items-end bg-slate-800/60 px-4 py-2.5 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Marks</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white">{diagnostic.studentScore}</span>
                <span className="text-sm font-semibold text-slate-500">/ {diagnostic.totalMarks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Mastery Breakdown Cards */}
      <SubjectBreakdownCards
        questions={diagnostic.questionBreakdown}
        physicsScore={diagnostic.physicsScore}
        chemistryScore={diagnostic.chemistryScore}
        biologyScore={diagnostic.biologyScore}
        totalMarks={diagnostic.totalMarks}
      />

      {/* Main Content Area: Stacked Sequential Display */}
      <div className="space-y-10">
        {/* Section 1: Full Question Breakdown Table */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">Question-by-Question Review</h3>
            <p className="text-xs text-slate-500">
              Section-wise breakdown of attempts, official answer keys, and AI diagnostics.
            </p>
          </div>
          <QuestionBreakdownTable questions={diagnostic.questionBreakdown} />
        </div>

        {/* Section 2: Priority Concept Gaps (Weak Topics) & Roadmap */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Weak Topics & Improvement Scope</h3>
              <p className="text-xs text-slate-500">
                AI-identified root causes from your missed questions with 1-click remediation drills.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {diagnostic.weakGaps.length} Action Items
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-3">
              {diagnostic.weakGaps.map((gap) => (
                <ConceptGapCard key={gap.id} gap={gap} />
              ))}
            </div>

            <div className="lg:col-span-4 sticky top-24">
              <RecoveryRoadmapWidget
                weakGapsCount={diagnostic.weakGaps.length}
                testAccuracy={diagnostic.accuracy}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

