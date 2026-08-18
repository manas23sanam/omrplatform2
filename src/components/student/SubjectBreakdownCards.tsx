import React from 'react';
import { Atom, FlaskConical, Calculator, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import type { OMRQuestionEvaluation } from '../../types/test';

interface SubjectBreakdownCardsProps {
  questions: OMRQuestionEvaluation[];
  physicsScore?: number;
  chemistryScore?: number;
  biologyScore?: number;
  totalMarks?: number;
}

export const SubjectBreakdownCards: React.FC<SubjectBreakdownCardsProps> = ({
  questions,
  physicsScore,
  chemistryScore,
  biologyScore,
  totalMarks = 300,
}) => {
  // Aggregate stats per subject
  const subjects = [
    {
      name: 'Physics' as const,
      icon: <Atom size={18} />,
      color: 'text-blue-600',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-100',
      barColor: 'bg-blue-600',
      score: physicsScore ?? 84,
      maxScore: Math.round(totalMarks / 3),
    },
    {
      name: 'Chemistry' as const,
      icon: <FlaskConical size={18} />,
      color: 'text-slate-600',
      bgLight: 'bg-slate-50',
      borderColor: 'border-slate-100',
      barColor: 'bg-slate-600',
      score: chemistryScore ?? 72,
      maxScore: Math.round(totalMarks / 3),
    },
    {
      name: 'Biology' as const,
      icon: <Calculator size={18} />,
      color: 'text-slate-600',
      bgLight: 'bg-slate-50',
      borderColor: 'border-slate-100',
      barColor: 'bg-slate-500',
      score: biologyScore ?? 72,
      maxScore: Math.round(totalMarks / 3),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {subjects.map((subj) => {
        const subjQuestions = questions.filter((q) => q.subject === subj.name);
        const correctCount = subjQuestions.filter((q) => q.isCorrect).length;
        const incorrectCount = subjQuestions.filter((q) => !q.isCorrect && q.studentOption !== 'unattempted').length;
        const skippedCount = subjQuestions.filter((q) => q.studentOption === 'unattempted').length;
        const totalAttempted = correctCount + incorrectCount;
        const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
        const percentage = Math.min(100, Math.max(0, Math.round((subj.score / subj.maxScore) * 100)));

        return (
          <div
            key={subj.name}
            className={`bg-white rounded-3xl p-6 border ${subj.borderColor} shadow-2xs space-y-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${subj.bgLight} ${subj.color} flex items-center justify-center font-black`}>
                  {subj.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{subj.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">NEET Advanced Score</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-lg text-slate-900">{subj.score}</span>
                <span className="text-xs text-slate-400 font-semibold"> / {subj.maxScore}</span>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Subject Mastery</span>
                <span className={subj.color}>{percentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${subj.barColor} rounded-full transition-all duration-700`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Breakdown Chips */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-slate-700 font-bold">
                <CheckCircle2 size={12} className="text-slate-500" />
                {correctCount} Correct
              </span>
              <span className="flex items-center gap-1 text-slate-700 font-bold">
                <XCircle size={12} className="text-slate-500" />
                {incorrectCount} Wrong
              </span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <MinusCircle size={12} className="text-slate-400" />
                {skippedCount} Skipped
              </span>
              <span className="font-extrabold text-slate-700">{accuracy}% Acc</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
